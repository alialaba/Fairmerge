// Exports the hero image composition (src/dev/hero-image.astro, served at /hero-image by the dev server only) as two
// transparent WebP files:
//   public/images/hero-image-desktop.webp  (1200 x 1140)
//   public/images/hero-image-mobile.webp   (936 x 893)
//
// Usage: start the dev server (`npm run dev`), then run `npm run export:hero`.
// Another server address: HERO_URL=http://localhost:4322 npm run export:hero
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

const BASE = process.env.HERO_URL ?? 'http://localhost:4321';
const OUT_DIR = path.resolve('public/images');
const VERSIONS = [
  { name: 'desktop', width: 1200, height: 1140 },
  { name: 'mobile', width: 936, height: 893 },
];

// 1. Make sure the dev server is up.
try {
  await fetch(BASE);
} catch {
  console.error(`Can't reach ${BASE}. Start the dev server first: npm run dev`);
  process.exit(1);
}

// 2. Screenshot each version. Prefer the installed Google Chrome; fall back to
//    Playwright's own Chromium (npx playwright install chromium).
let browser;
try {
  browser = await chromium.launch({ channel: 'chrome' });
} catch {
  browser = await chromium.launch();
}

try {
  for (const v of VERSIONS) {
    const page = await browser.newPage({ viewport: { width: v.width, height: v.height }, deviceScaleFactor: 1 });
    await page.goto(`${BASE}/hero-image?v=${v.name}`, { waitUntil: 'networkidle' });

    // Wait until web fonts are ready, so nothing renders in a fallback.
    // Also remove Astro's dev toolbar, which would otherwise end up in the image.
    await page.evaluate(async () => {
      document.querySelector('astro-dev-toolbar')?.remove();
      await document.fonts.ready;
    });

    // Layout check: warn if a stat card leaves the canvas, overlaps another card,
    // or covers the text or icons inside something marked data-keep-clear
    // (the PR card, the payout toast). Covering their empty edges is fine.
    // Fix positions in hero-image.astro.
    const problems = await page.evaluate(() => {
      const c = document.querySelector('[data-canvas]').getBoundingClientRect();
      const cards = [...document.querySelectorAll('[data-card]')].map((el) => ({ key: el.dataset.card, r: el.getBoundingClientRect() }));
      const out = [];
      for (const { key, r } of cards) {
        if (r.left < c.left || r.top < c.top || r.right > c.right || r.bottom > c.bottom) out.push(`card "${key}" goes outside the canvas`);
      }
      for (let i = 0; i < cards.length; i++)
        for (let j = i + 1; j < cards.length; j++) {
          const a = cards[i].r, b = cards[j].r;
          if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) out.push(`cards "${cards[i].key}" and "${cards[j].key}" overlap`);
        }
      for (const keep of document.querySelectorAll('[data-keep-clear]')) {
        // Boxes of every line of text (via a Range) and every icon inside it.
        const boxes = [...keep.querySelectorAll('svg')].map((el) => el.getBoundingClientRect());
        const walker = document.createTreeWalker(keep, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          if (!walker.currentNode.textContent.trim()) continue;
          const range = document.createRange();
          range.selectNodeContents(walker.currentNode);
          boxes.push(...range.getClientRects());
        }
        for (const { key, r } of cards) {
          const hit = boxes.some((k) => Math.min(r.right, k.right) > Math.max(r.left, k.left) && Math.min(r.bottom, k.bottom) > Math.max(r.top, k.top));
          if (hit) out.push(`card "${key}" covers text or an icon in the ${keep.dataset.keepClear}`);
        }
      }
      return out;
    });
    problems.forEach((p) => console.warn(`  ! ${v.name}: ${p}`));

    const canvas = page.locator('[data-canvas]');
    const png = await canvas.screenshot({ omitBackground: true }); // keeps transparency
    const out = path.join(OUT_DIR, `hero-image-${v.name}.webp`);
    await sharp(png).webp({ quality: 85, alphaQuality: 100 }).toFile(out);

    const { width, height } = await sharp(out).metadata();
    console.log(`Saved ${path.relative(process.cwd(), out)} (${width} x ${height}, ${Math.round(fs.statSync(out).size / 1024)} KB)`);
    await page.close();
  }
} finally {
  await browser.close();
}
