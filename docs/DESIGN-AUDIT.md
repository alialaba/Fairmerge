# Fairmerge design-system audit

**Phase 1: report only. Nothing in the code has been changed.**

**Scope:**
- `src/styles/global.css`, `src/layouts/Base.astro`, every component in `src/components/` (including Header, Footer, Logo and Icon), and `public/favicon.svg`.
- Export- and archive-only files (`src/dev/hero-image.astro`, `src/components/_archive/PrMergeVisual.astro`) are listed separately. They don't render on the site.

**Method:**
- Every CSS declaration (2,703 in total) and every SVG colour attribute was extracted by script, with file and line, and counted.
- Contrast was measured in Chrome on the rendered page at 1440 and 375. For every visible text element, the translucent backgrounds behind it were blended to find what it actually sits on.
- States that aren't visible on load were calculated from the tokens: hovers, open menu, error messages, the other Paths colours.

---

## Summary

| Area | Finding | Severity |
|---|---|---|
| Hard-coded colours | **0** in live components; only the two literal colours in `favicon.svg` (unavoidable) | ✅ |
| Colour tokens | 3 defined but unused on the site; 14 ad-hoc `color-mix()` alpha variants, 3 duplicating existing tokens | Medium |
| Contrast | **All 50 rendered text pairs pass AA** (lowest 5.29:1); hidden states (hovers, Paths colours, errors) also pass (lowest 4.67:1). Decorative `--line` borders are 1.35:1, acceptable where nothing relies on them | ✅ |
| Font sizes | **29** unique values (14 fixed + 15 one-off `clamp()`s); 3 near-duplicate clusters | High |
| Line heights / letter spacing | **15** / **9** unique values | Medium |
| Heading hierarchy | No skipped levels, but two headings render *larger* than the page's h1; same-level headings use 3 different styles | High |
| Spacing | **70** unique padding/margin/gap values; 123 uses of off-grid values (6, 10, 14, 18, 20, 22, 28 px…) | High |
| Section padding | 5 of 8 sections share `clamp(64px, 10vw, 128px)`; Paths, Hero, Final CTA, Footer each differ | Low |
| Radius | **16** values (only 2 tokenised) | Medium |
| Shadows | 6 different drop shadows, all one-offs | Medium |
| Motion | **12** durations, **5** easing curves, 1 local `--ease` token | Medium |
| Buttons | 4 primary-button implementations with different heights, paddings and **two different primary colours** | High |
| Focus styles | 3 ring colours across dark surfaces | Low |

---

## 1. Colours

### 1.1 Hard-coded colours outside `global.css`

| Where | Value | Note |
|---|---|---|
| `public/favicon.svg:3` | `fill="#6E3FF3"` | SVG file, can't read CSS variables. Must be updated by hand when the brand changes |
| `public/favicon.svg:4` | `stroke="#FFFFFF"` | Same |

No live component contains a hex, `rgb()`, `hsl()` or named colour.

Things that look like colours but aren't:
- `#482`, `#512` and similar are PR numbers in text.
- `white` hits are `white-space` properties.
- `currentColor` is used correctly in all icons.

### 1.2 Tokens defined but never used on the site

| Token | Value | Used only in |
|---|---|---|
| `--hero-shape-violet` | `#CDBEFB` | `src/dev/hero-image.astro` (export page) |
| `--hero-shape-green` | `#BFE6D2` | `src/dev/hero-image.astro` |
| `--glass-surface` | `rgba(255,255,255,0.72)` | `src/dev/hero-image.astro` |

These are fine, but they belong to the export page. Phase 2 replaces the two shapes with `--brand-soft` and `--accent-tint`. `--merged-soft`, mentioned in the Phase 2 brief, **doesn't exist yet**; it would be new.

### 1.3 Token usage (live components)

| Token | Uses | | Token | Uses |
|---|---|---|---|---|
| `--ink` | 87 | | `--payout-tint` | 11 |
| `--surface` | 72 | | `--removed` | 8 |
| `--ink-muted` | 51 | | `--merged-hover` | 6 |
| `--merged` | 40 | | `--on-dark-line` | 6 |
| `--line` | 40 | | `--path-ship-bg` | 6 |
| `--content-pad` | 25 | | `--on-dark-muted` | 5 |
| `--font-display` | 21 | | `--path-grow-bg` / `--on-dark-surface` | 3 / 3 |
| `--canvas` | 21 | | `--removed-tint` / `--path-earn-bg` | 2 / 2 |
| `--radius-sm` | 20 | | `--font-body` | 2 |
| `--payout` | 19 | | `--on-dark-control` | 1 |
| `--merged-tint` | 18 | | `--header-height` | 10 |
| `--content-width` | 15 | | `--radius-lg` | 10 |
| `--font-code` | 14 | | | |

### 1.4 Colours used that have no token: ad-hoc `color-mix()` variants

| Mix | Where | Overlaps with |
|---|---|---|
| `--surface 70%` | Footer muted text | `--on-dark-muted` is 72%: **near-duplicate** |
| `--surface 12%` | Footer dividers | `--on-dark-line` is exactly 12%: **duplicate** |
| `--surface 85%` | Header frosted bg, Final CTA supporting line | two different roles share one value |
| `--surface 60%` | Final CTA secondary button border | none |
| `--surface 35%` | Final CTA inset frame | none |
| `--surface 10%`, `8%`, `6%`, `4%` | Final CTA / Footer hovers, watermarks | `--on-dark-surface` is 6%: **duplicate** |
| `--ink 40%`, `45%`, `80%` | Shadows (Contributors, Header, HowItWorks, Paths) | should be shadow tokens |
| `--ink 6%` | Header button hover tint | none |
| `--ink 82%` over `--surface` | How It Works active step description | none |

### 1.5 WCAG contrast

**Rendered on the page** (Chrome, both widths; text colour blended onto its real background):

| Ratio | Pair | Where | AA |
|---|---|---|---|
| 5.29 | `#0F7B4F` payout on `#FFFFFF` | "paid on merge", offer sent | ✅ |
| 5.33 | `#5A5F7A` muted on `#EFEAFE` merged-tint | Ways to Earn text, inactive tabs | ✅ |
| 5.72 | `#FFFFFF` on `#6E3FF3` merged | Primary buttons (Hero, Bounty Board) | ✅ |
| 5.85 | muted on `#F6F7FB` canvas | Ledes, filter labels, FAQ, Contributors cards | ✅ |
| 6.26 | muted on `#FFFFFF` | Card descriptions, How It Works | ✅ |
| 6.32 | `#BFCBC7` (72% white) on Paths card | Paths media subtitles | ✅ |
| 6.42 | `#5A2BD9` merged-hover on merged-tint | Domain tags | ✅ |
| 7.26 | 72% white on `#0B3B2C` | Paths lede | ✅ |
| 9.12 | 70% white on `#14162B` ink | Footer links and text | ✅ |
| 10.20 | `#3E4051` (82% ink) on white | How It Works active description | ✅ |
| 10.52 – 12.53 | white on Paths backgrounds | Paths titles | ✅ |
| 15.15 – 17.81 | ink on light backgrounds / white on ink | Headings, body, chips, dark buttons | ✅ |

**States not visible on load** (calculated):

| Ratio | Pair | AA |
|---|---|---|
| 13.14 / 12.76 | white on `--path-grow-bg` / `--path-ship-bg` | ✅ |
| 7.53 / 7.25 | 72% white on Grow / Ship | ✅ |
| 3.38 / 3.22 | Inactive Paths segment (40% white) on Grow / Ship (non-text, needs 3) | ✅ |
| 7.55 | white on `--merged-hover` (button hover) | ✅ |
| 5.35 / 4.87 | `--merged` on canvas / on merged-tint (link hover, menu current) | ✅ |
| 6.14 | `--removed` on canvas (counter-offer error) | ✅ |
| 4.67 | `--payout` on `--payout-tint` (diff "+", icon) | ✅ (tightest) |
| 5.65 | `--removed` on `--removed-tint` | ✅ |
| 5.72 / 15.15 | Focus ring on white / on ink (non-text) | ✅ |
| **1.35** | `--line` border on white (non-text) | ⚠️ Acceptable: used for decorative card edges, dividers, and icon buttons whose ink icon carries the contrast. Must not be the only boundary of an input or chip (inputs and chips already use `--ink-muted`, 6.26:1) |

**Text on photo or gradient:**
- Contributors cards (canvas → surface gradient): worst case 5.85:1.
- Final CTA over the real photo, measured as the lightest pixel behind the text: **7.40:1** at 1440, **8.24:1** at 375.

---

## 2. Typography

### 2.1 Font sizes: 29 unique

| Size | px | Uses | Role(s) |
|---|---|---|---|
| `0.625rem` | 10 | 1 | Avatar letter in a How It Works vignette |
| `0.6875rem` | 11 | 4 | Vignette labels (How It Works, Paths, Ways) |
| `0.75rem` | 12 | 7 | Eyebrows, badges, tags |
| `0.8125rem` | 13 | **21** | Meta, captions, small labels |
| `0.875rem` | 14 | 14 | Secondary text, chips, footer, buttons |
| `0.9375rem` | 15 | 13 | Card descriptions, nav links, small buttons |
| `0.9375em` | 15 (relative) | 1 | `code` in global.css |
| `1rem` | 16 | 8 | Body, buttons |
| `1.0625rem` | 17 | 8 | Ledes, quotes |
| `1.125rem` | 18 | 2 | Contributors quote, menu card title |
| `1.25rem` | 20 | 4 | Step titles, FAQ questions (mobile), accordion headers |
| `1.375rem` | 22 | 1 | Logo wordmark |
| `1.5rem` | 24 | 3 | Tab labels, FAQ questions, menu links |
| `2rem` | 32 | 1 | Bounty price |
| + 15 one-off `clamp()`s | | 15 | Every section heading, hero, card titles, CTA, watermarks |

**Near-duplicate clusters:**
- **13 / 14 / 15px** (`0.8125`, `0.875`, `0.9375rem`): 48 uses across three sizes that are visually almost indistinguishable and used for the same roles. Card descriptions are 15px in Bounty Board, 14px in Paths and 15px in Ways.
- **11 / 12px** (`0.6875`, `0.75rem`): 11 uses, both for uppercase labels and badges.
- **17 / 18px** (`1.0625`, `1.125rem`): ledes and quotes.
- **Card-title clamps:** `clamp(1.25rem, 1.1rem + 0.45vw, 1.5rem)` in Bounty Board vs `clamp(1.25rem, 1.1rem + 0.5vw, 1.5rem)` in Paths. Same intent, two formulas.
- **Big-heading clamps:** 6 different `clamp()`s with 40px minimums (Hero, Ways, Paths cards, Ways panel, global h1, global h2).

### 2.2 Line heights: 15 unique

| Value | Uses | Value | Uses |
|---|---|---|---|
| `1` | 5 | `1.45` | 2 |
| `1.02` | 1 | `1.5` | 4 |
| `1.05` | 3 | `1.55` | 3 |
| `1.1` | 2 | `1.6` | 2 |
| `1.2` | 2 | `1.65` | 1 |
| `1.25` | 3 | `1.85` | 1 |
| `1.3` | 3 | `1.9` | 2 |
| `1.4` | 4 | | |

Body text alone uses 1.45, 1.5, 1.55, 1.6 and 1.65. Diff and code lines use 1.8, 1.85 and 1.9.

### 2.3 Font weights: 4 (all loaded)

| Weight | Uses | Role |
|---|---|---|
| `400` | 3 | Deliberately light display: Final CTA, Paths card words, Ways panel titles |
| `500` | 14 | |
| `600` | 47 | Dominant; section titles |
| `700` | 8 | |

The hero h1 is **700** while every other section title is **600**. Weight 400 is the lightest loaded, so "light" headings can't go lighter.

### 2.4 Letter spacing: 9 unique

`-0.04em` (watermarks), `-0.03em` (CTA), `-0.025em` (Ways), `-0.02em` (×5), `-0.015em` (global h2), `-0.01em` (Bounty Board), `0` (Footer), `0.06em` (×3 eyebrows), `0.08em` (How It Works review title).

Headings use five different negative values for the same intent.

### 2.5 Heading hierarchy

**No levels are skipped:** h1 (hero) → h2 (each section) → h3 (cards and items). The footer's column headings are h2.

**The same level is styled differently in different sections:**

| Level | Section | Size (1440 / 375) | Weight | Issue |
|---|---|---|---|---|
| h1 | Hero | 66 / 34px | 700 | |
| h2 | **Ways to Earn** | **72 / 40px** | 600 | **Larger than the page's h1** |
| h2 | Paths, Bounty Board, Contributors, How It Works, FAQ | 52 / 32px | 600 | Consistent |
| h2 | Final CTA | 62 / 30px | **400** | Different weight and size |
| h2 | Footer columns | 14px, body font | 600 | Fine (column labels), but a different style for h2 |
| h3 | Bounty Board cards | 24 / 20px | 600 | |
| h3 | **Paths cards** ("Earn", "Grow", "Ship") | **64 / 40px** | 400 | **Larger than their own section's h2 (52px)** |
| h3 | Ways and FAQ | wraps a `<button>`; text styled 20–24px display | 500 | Different again |

How It Works step titles are `<span>`s inside buttons, not headings. That's acceptable, because the list is an `<ol>` of controls.

### 2.6 Fonts used outside their role

The mono code font is meant for code, repo names and file paths. It's also used for things that aren't code:

| Where | Content | Verdict |
|---|---|---|
| `HowItWorks.astro:805` `.ui__toast-amount` | "+$900.00" | ❌ Money: use body with `tabular-nums` |
| `Paths.astro:474` `.vig__amount` | "+$400.00" | ❌ Money |
| `Paths.astro:546` `.vig__posted strong` | "$320" | ❌ Money |
| `Paths.astro:649` `.pcard__num` | "01" | ❌ Ordinal: tabular-nums |
| `Paths.astro:773` `.paths__counter` | "01 / 03" | ❌ Counter |
| `Paths.astro:572` `.vig__counter-text b` | "amara-o" | ✅ A username/handle, code-like |
| Bounty Board, Contributors, How It Works, Paths diffs, Ways vignettes | repo names, file paths, code lines | ✅ |

---

## 3. Spacing and layout

### 3.1 Padding, margin and gap: 70 unique values

**Fixed pixel values** (count of uses):

| On a 4px grid | Uses | Off-grid | Uses |
|---|---|---|---|
| 4px | 17 | 2px | 9 |
| 8px | **47** | 3px | 4 |
| 12px | 32 | 5px | 3 |
| 16px | 32 | 6px | 21 |
| 24px | 15 | 7px | 1 |
| 32px | 7 | 10px | **29** |
| 40px | 4 | 14px | 12 |
| 48px | 4 | 18px | 8 |
| 56px | 3 | 20px | 21 |
| 72px | 2 | 22px | 2 |
| 80px | 1 | 28px | 7 |
| | | 34px | 1 |

**123 uses of off-grid values.** 10px and 20px are the most common, then 6px and 14px.

**Fluid `clamp()` spacing:** 38 one-off formulas, for example:
- `clamp(32px, 4vw, 48px)`, `clamp(32px, 5vw, 56px)` and `clamp(32px, 4vw, 56px)` for similar "gap below header" roles;
- `clamp(24px, 3vw, 36px)` and `clamp(24px, 3.5vw, 36px)`;
- nine hero-specific `svh` clamps (intentional, for the one-screen fit).

### 3.2 Section vertical padding

| Section | Value | Reason to differ? |
|---|---|---|
| Ways, Bounty Board, Contributors, How It Works, FAQ | `clamp(64px, 10vw, 128px)` | Baseline |
| Paths (mobile) | `clamp(64px, 10vw, 112px)` | ❌ No reason; same as baseline intent |
| Hero | `clamp(40px, 7vw, 88px)`, plus desktop `svh` | ✅ Fills one screen |
| Final CTA | `clamp(48px, 8vw, 112px)` | ✅ Smaller, as a panel inside a white section |
| Footer | 56/24 → 80/32 | ✅ Footer rhythm |

### 3.3 Containers and text measures

- Every section uses `--content-width` (1240px) + `--content-pad`. ✅
- **Text measures:** 10 different values: `14ch`, `16ch`, `18ch`, `22ch`, `22rem`, `28rem`, `30rem`, `32rem`, `34rem` (×2), `38rem` (×2), `40rem` (×2).
- **Panels:** `--content-width` full in every section ✅. The menu sheet is `min(480px, …)`, which is intentional.

### 3.4 Border radius: 16 values (2 tokens)

| Value | Uses | Note |
|---|---|---|
| `var(--radius-sm)` 8px | 20 | Token |
| `50%` | 15 | Circles (avatars, round buttons) |
| `999px` | 13 | Pills, untokenised |
| `var(--radius-lg)` 20px | 10 | Token |
| `8px` literal | 5 | **Duplicates `--radius-sm`** |
| `24px` / `28px` / `32px` | 3 / 1 / 2 | Big panels (FAQ, CTA, menu) |
| `10px`, `12px`, `14px`, `16px` | 2 / 1 / 1 / 1 | Vignette and inner-card radii |
| `20px` literal | 1 | **Duplicates `--radius-lg`** (CTA frame) |
| `2px`, `4px`, `6px` | 2 / 1 / 1 | Small bars, footer focus |

---

## 4. Other inconsistencies

### 4.1 Shadows: 6 drop shadows, all one-offs

| Shadow | Where |
|---|---|
| `0 16px 32px -24px ink/40%` | Contributors card hover |
| `0 16px 32px -16px ink/40%` | How It Works toast |
| `0 24px 48px -28px ink/45%` | How It Works UI cards |
| `0 20px 40px -24px ink/80%` | Paths vignettes (on dark) |
| `0 10px 24px -10px ink/45%` + white ring | Hero / Contributors avatars |
| `0 2px 6px ink/6%` + `0 24px 48px -28px ink/40%` | Ways vignettes |

Plus "inset borders" drawn as box-shadow: `inset 0 0 0 1.5px var(--ink)` ×3 for outline buttons, and `1px` and `1.5px var(--line)` in How It Works.

### 4.2 Motion: 12 durations, 5 easings

- **Durations:** 150, 160, 180, 200, 250, 260, 300, 350, 400, 450, 500, 600ms.
- **Easings:**
  - `ease`
  - `ease-in`
  - `linear` (visibility delays)
  - `cubic-bezier(0.2, 0.7, 0.2, 1)` (Ways, Header, Hero, Paths)
  - `cubic-bezier(0.22, 1, 0.36, 1)`, declared locally as `--ease` in How It Works, FAQ and Final CTA, and inline in Header.
- **Hover colour changes** use 160ms in five components and 200ms in Footer and Contributors.
- **Accordion heights:** 260ms (Bounty Board), 300ms (Ways), 350ms (FAQ).

### 4.3 Focus styles

- Global: `3px solid --merged`, offset 3px. ✅
- On dark surfaces three different rings: `--merged-tint` (Paths, Footer, `.section--dark`), `--surface` (Final CTA buttons) and the global violet (Header over Paths when scrolled).
- Offsets: 3px, −3px (scroll tracks), 2px (FAQ, inputs), 4px (How It Works steps).

### 4.4 Button variants

| Section | Class | Primary colour | Height | Padding | Font |
|---|---|---|---|---|---|
| Hero | `.btn--primary` | **`--merged`** | 52 | 0 24 | 1rem/600 |
| Bounty Board | `.bbtn--primary` | **`--merged`** | 52 (sm 44) | 0 24 (sm 18) | 1rem / .9375 |
| Header | `.hbtn--primary` | **`--ink`** | 40 (menu 48) | 0 16 | .9375rem |
| Ways to Earn | `.ways__cta` | **`--ink`** | 48 | 0 22 | 1rem |
| Final CTA | `.cta__btn--primary` | `--surface` (on dark) | 52 | 0 24 | 1rem |

- **Secondary/outline:** Hero, Bounty Board and Header use `inset 0 0 0 1.5px --ink`; Final CTA uses `1px` at 60% white (on dark, as intended).
- **Round icon buttons:** 44px (Paths, Contributors), 36px (How It Works toggle), 32px (hero testimonial toggle). The 32px one is below the 44px tap guideline, though it's desktop-only.

Five implementations of one component, with two different "primary" colours.

### 4.5 Borders

- `1px solid var(--line)` is standard ✅.
- Exceptions:
  - `1.5px` outlines (buttons, dashed boxes);
  - `1px dashed var(--line)` (Contributors);
  - `1.5px dashed var(--ink-muted)` (empty state);
  - `1px solid var(--ink-muted)` (chips, inputs, FAQ icon box) where a 3:1 boundary is needed. ✅ Deliberate.

---

## 5. Proposed system

### 5.1 Type scale: 8 sizes

| Token | Value | px (375 → 1440) | Role |
|---|---|---|---|
| `--text-display` | `clamp(2.5rem, 1.5rem + 4vw, 4.5rem)` | 40 → 72 | Hero h1, Final CTA heading, Paths card words |
| `--text-h1` | `clamp(2rem, 1.4rem + 2.6vw, 3.25rem)` | 32 → 52 | **Every section title** (the h2 elements), including Ways to Earn |
| `--text-h2` | `clamp(1.5rem, 1.2rem + 1.2vw, 2.25rem)` | 24 → 36 | Panel titles (Ways tabs), big card headlines |
| `--text-h3` | `clamp(1.25rem, 1.1rem + 0.5vw, 1.5rem)` | 20 → 24 | Card titles, FAQ questions, step titles, tab labels, menu links |
| `--text-body-lg` | `clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)` | 17 → 20 | Ledes, quotes, CTA supporting line |
| `--text-body` | `1rem` | 16 | Body, buttons |
| `--text-small` | `0.875rem` | 14 | Secondary text, card descriptions, chips, nav (replaces 14/15px) |
| `--text-caption` | `0.75rem` | 12 | Meta, eyebrows, badges, vignette labels (replaces 10/11/12/13px) |

- **Line heights** (15 → 4): `--leading-tight: 1.05` (display, h1), `--leading-snug: 1.25` (h2, h3, UI), `--leading-normal: 1.55` (body), `--leading-code: 1.8` (diffs).
- **Letter spacing** (9 → 3): `--tracking-tight: -0.02em` (display to h2), `0`, `--tracking-wide: 0.06em` (uppercase eyebrows).
- **Weights:** 600 for every heading level, including the hero (currently 700). 400 stays as one named variant, "light display", for the three intentionally light large headings (Paths cards, Ways panel titles, Final CTA).
- **Fixing the hierarchy:**
  - The Ways to Earn h2 moves from 72px to `--text-h1` (52px), below the hero's 72px.
  - The Paths card words stay large as `--text-display`. They're decorative labels, so they should become `<p aria-hidden>` plus a visually hidden h3, or the h3 stays and is styled with `--text-h2`. **Your call; I'd make them h3 with `--text-h2`.**
- **Mono font:** code, repo names, file paths and handles only. Money and counters move to the body font with `font-variant-numeric: tabular-nums`.

### 5.2 Spacing scale: 4/8px steps

| Token | Value | Replaces |
|---|---|---|
| `--space-1` | 4px | 2, 3, 4, 5px |
| `--space-2` | 8px | 6, 7, 8, 10px |
| `--space-3` | 12px | 12, 14px |
| `--space-4` | 16px | 16, 18px |
| `--space-5` | 24px | 20, 22, 24px |
| `--space-6` | 32px | 28, 32, 34px |
| `--space-7` | 40px | 40px |
| `--space-8` | 48px | 48px |
| `--space-9` | 64px | 56, 64px |
| `--space-10` | 80px | 72, 80px |

Plus:
- `--section-pad: clamp(4rem, 2.4rem + 6.8vw, 8rem)` (64 → 128px) for every standard section, including Paths. Hero, Final CTA and Footer keep their own reasoned values, built from the scale.
- `--gap-section-head: clamp(var(--space-7), 4vw, var(--space-8))` for the space below section headers. It replaces 4 near-identical clamps.
- **Text measures** (10 → 3): `--measure-narrow: 32rem`, `--measure: 40rem`, `--measure-wide: 48rem`. Headline `ch` limits stay local.
- **Allowed exceptions** (not spacing): 1–2px hairline nudges for borders and focus offsets.

### 5.3 Radius, shadow, motion

**Radius** (16 → 6):

| Token | Value | Use |
|---|---|---|
| `--radius-xs` | 4px | Focus corners, tiny bars |
| `--radius-sm` | 8px | Buttons, inputs, inner boxes (absorbs 6, 8, 10px) |
| `--radius-md` | 12px | Vignettes, inner cards (absorbs 12, 14, 16px) |
| `--radius-lg` | 20px | Cards (absorbs 20px) |
| `--radius-xl` | `clamp(24px, 3vw, 32px)` | Large panels: FAQ, CTA, menu sheet (absorbs 24, 28, 32px) |
| `--radius-pill` | 999px | Pills, tags, chips |

Circles keep `50%`.

**Shadows** (6 → 3, built from `--ink`):

| Token | Value |
|---|---|
| `--shadow-sm` | `0 2px 6px rgb(ink / 6%)` (subtle lift) |
| `--shadow-md` | `0 16px 32px -20px rgb(ink / 40%)` (cards, toasts, hover) |
| `--shadow-lg` | `0 24px 48px -28px rgb(ink / 45%)` (floating UI vignettes; also on dark) |

Outline buttons keep the inset ring, defined once in the shared button class.

**Motion** (12 durations → 4, 5 easings → 2):

| Token | Value | Use |
|---|---|---|
| `--dur-fast` | 160ms | Hover colours, underlines |
| `--dur-base` | 250ms | State changes, small reveals, close animations |
| `--dur-slow` | 400ms | Panels, cards, accordions, line growth |
| `--dur-slower` | 600ms | Background colour fades (Paths) |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Everything that enters or grows |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Things that leave or shrink |

**Focus:** `--focus-ring: var(--brand)` and `--focus-ring-on-dark: var(--brand-tint)`, one width (3px) and offset (3px; −3px inside scroll tracks).

**Buttons:** one shared set in `global.css`, replacing the five per-section copies:
- `.btn` with `--primary` (brand), `--secondary` (outline), `--on-dark` (white) and `--dark` (ink);
- sizes `--sm` 40, `--md` 48, `--lg` 52.

Header "Get started" and the Ways to Earn CTA become `--primary`, so one colour means "primary" everywhere.

### 5.4 Phase 2 palette: pre-checked

Contrast of the colours in the brief, before applying anything:

| Pair | Ratio | AA |
|---|---|---|
| White on `--brand` `#0E6B47` (buttons) | 6.54 | ✅ |
| White on `--brand-hover` `#0A5537` | 8.87 | ✅ |
| `--brand` on white / canvas (links) | 6.54 / 6.11 | ✅ |
| `--brand` on `--brand-tint` `#E3F1EA` (tags, Ways section) | 5.61 | ✅ |
| `--ink-muted` on `--brand-tint` | 5.38 | ✅ |
| `--brand` on `--brand-soft` `#BFE3CF` | 4.70 | ✅ (close; avoid for small text) |
| `--accent-ink` `#6B4206` on `--accent-tint` `#FCEFD6` | 7.67 | ✅ |
| **`--accent-ink` on solid `--accent` `#F2A93B`** | **4.37** | ❌ For text on solid amber, use `--ink` (8.91). |
| White on `--accent` | 2.00 | ❌ Never |
| White / 72% white on `--path-grow-bg` `#102F3A` | 14.10 / 8.01 | ✅ |
| White / 72% white on `--path-ship-bg` `#3A2A0E` | 13.84 / 7.92 | ✅ |
| Inactive Paths segment (40% white) on Earn / Grow / Ship | 3.32 / 3.52 / 3.51 | ✅ (non-text) |
| `--brand` on `--payout-tint` | 5.76 | ✅ |

### 5.5 Also affected in Phase 2 (not in the brief)

- **`public/favicon.svg`** has the violet hard-coded and needs the new brand green.
- **The Hero image is a baked WebP.** Its violet "Merged" badge, violet stat numbers and the violet pill will stay violet until `npm run export:hero` re-runs. That's already step 5 of the brief.
- **`docs/WEBFLOW-BUILD.md`** lists the old token names and values throughout and will need the renames.
- **`src/components/_archive/PrMergeVisual.astro`** references `--merged*`. It isn't rendered, but it will break silently if reused.
- **Paths' Earn background `#0B3B2C` is a dark green,** close to the new brand green. Earn may read as "brand" rather than "path 1", which is acceptable but worth seeing.
- **Payout and brand become the same colour.** "Paid on merge", the diff "+" lines and money amounts will no longer stand apart from links and buttons. If you want money to stay distinct, keep `--payout` a separate, slightly different green.

### 5.6 Before → after (projected)

| | Before | After |
|---|---|---|
| Distinct colour values in use | 33 (19 tokens + 14 ad-hoc mixes) | ~22 (all tokens, including on-dark alphas) |
| Font sizes | 29 | 8 (+ 2 watermarks, + hero `svh` fit) |
| Line heights | 15 | 4 |
| Letter spacings | 9 | 3 |
| Spacing values | 70 | 10 + `--section-pad` + 2 helpers |
| Radius values | 16 | 6 + `50%` |
| Shadows | 6 + 3 inset rings | 3 + 1 ring |
| Durations / easings | 12 / 5 | 4 / 2 |
| Button implementations | 5 | 1 shared set |
