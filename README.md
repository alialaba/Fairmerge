# Fairmerge

A marketing homepage for a bounty platform where developers get paid the moment their code is merged, anywhere in the world.

The page layout is inspired by the section structure of [oneforma.com](https://www.oneforma.com)'s homepage. All copy, branding, colours, typography and visuals are original. Every person, bounty, repository and number on the page is sample demo content.

Final CTA photo by [Anthony Riera](https://unsplash.com/photos/man-in-black-t-shirt-using-laptop-computer--ZZ7I31c0B8) on Unsplash (Unsplash License).

## Tech stack

- [Astro](https://astro.build) (minimal template, static output)
- Plain HTML and CSS in Astro components, with design tokens as CSS custom properties
- Vanilla JavaScript only: no UI framework, no Tailwind
- Google Fonts: Bricolage Grotesque, IBM Plex Sans, IBM Plex Mono

## Getting started

Requires Node.js 22.23.4 or later (see `engines` in `package.json`).

```bash
npm install
npm run dev       # dev server at http://localhost:4321
npm run build     # production build to dist/
npm run preview   # serve the production build locally
```

### Re-exporting the hero image

The hero image is a flat WebP exported from an HTML composition (`src/dev/hero-image.astro`), which only exists on the dev server. To change its stats or layout, edit that file, then with `npm run dev` running:

```bash
npm run export:hero
```

This uses Playwright and your installed Google Chrome to screenshot the composition into `public/images/hero-image-desktop.webp` and `hero-image-mobile.webp`.

## Sections

| # | Section | What it demonstrates |
|---|---|---|
| 1 | **Hero** | A one-time page-load reveal; a responsive `<picture>` that loads a separate desktop or mobile image; an accessible testimonial carousel with pause/play that stops on hover and focus |
| 2 | **Ways to Earn** | One set of markup that works as vertical tabs on desktop (roving tabindex, arrow keys) and as an accordion on mobile. The open item can't be closed; the active tab's underline grows from the centre; the accordion's height is animated with `grid-template-rows` |
| 3 | **Paths** | A scroll-pinned section (`position: sticky`): scrolling switches the path, crossfades the background colour and grows a progress line. On mobile it becomes a scroll-snap carousel with mouse drag, segment buttons and arrow keys |
| 4 | **Bounty Board** | Language and difficulty filters that combine, with a fade-out/fade-in transition and a live result count; an inline counter-offer form with validation and focus management; a scroll-snap carousel on mobile |
| 5 | **Contributors** | Quote-led cards in a carousel with page dots, built on a reusable carousel module (`src/scripts/carousel.js`, shared with Paths). Shows 3, 2 or 1 cards per view depending on screen width |
| 6 | **How It Works** | An auto-advancing four-step list. Each step's progress line is a timer driven by `requestAnimationFrame`, so it pauses and resumes in place. Auto-advance runs only while the section is in view, pauses on hover and focus, and stops after a click; each step swaps a matching UI card with no layout shift |
| 7 | **FAQ** | A heading that sticks with pure CSS (`position: sticky`) while an accordion scrolls past; several answers can be open at once; height animated with `grid-template-rows`; every answer stays visible if JavaScript fails |
| 8 | **Final CTA** | A scroll-linked heading: one `--progress` variable lights the letters one by one through CSS `calc()` and `clamp()`, in both scroll directions. The supporting line and buttons reveal once; everything is visible without JS or with reduced motion |

Across the page:

- Every control is a real `<button>`, with visible keyboard focus and WCAG AA contrast.
- `prefers-reduced-motion` is respected everywhere: animations become instant, and scroll-driven sections become static.

## Project structure

```text
src/
├── components/       # one component per page section, plus ui/Icon.astro
├── dev/              # dev-only pages (hero image composition)
├── layouts/          # Base.astro: <head>, fonts, global styles
├── pages/index.astro # the homepage
├── scripts/          # shared vanilla JS (carousel.js)
└── styles/global.css # design tokens and base styles
public/               # favicon and the exported hero images
scripts/              # export-hero.mjs (Playwright export)
docs/                 # WEBFLOW-BUILD.md: guide to rebuilding the sections in Webflow
```
