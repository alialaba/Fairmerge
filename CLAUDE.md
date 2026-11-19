# Fairmerge

Single-page marketing site built with Astro (minimal template). Plain HTML and CSS in Astro components, vanilla JavaScript only. No UI framework integrations, no Tailwind.

## Product

Fairmerge: developers get paid the moment their code is merged, anywhere in the world.

- Maintainers and startups post bounties on issues.
- AI reviews the pull request against the bounty requirements, and can suggest a fair bounty price.
- Contributors can counter-offer.
- Payouts go out via PayPal.

**Promise:** "Get paid the moment your code is merged, anywhere in the world."

**Positioning on AI tools:** Contributors are welcome to use AI tools. Fairmerge pays for expertise: someone who truly understands the issue can ship a fix quickly, and the AI review checks whether the PR solves the issue, not how the code was written. Merges are fast when the fix is right.

## Audiences

- **Contributors:** claim bounties, get paid.
- **Maintainers / startups:** post bounties, get quality PRs.

## Page sections (in order)

Each section is one component in `src/components/`, rendered in `src/pages/index.astro`. Every section root has the `.section` class and sets its background through `--section-bg` (see "Section backgrounds" below).

| # | Section | Component | Background | Notes |
|---|---|---|---|---|
| 1 | Hero | `Hero.astro` | `--canvas` | The promise, both CTAs, payout stats, contributor testimonial; keeps its decorative shapes |
| 2 | WaysToEarn | `WaysToEarn.astro` | `--brand-tint` | Five bounty types (fix bugs, build features, write tests, improve docs, review code) as vertical tabs on desktop and an accordion below 1024px; one item always open. Plus a row of language chips with open bounties (formerly the Stacks section) |
| 3 | Paths | `Paths.astro` | Per-path dark colors (`--path-earn-bg`, `--path-grow-bg`, `--path-ship-bg`) | Contributor path vs maintainer path (scroll-pinned, dark, `.section--dark`) |
| 4 | BountyBoard | `BountyBoard.astro` | `--canvas` | Filterable bounty cards with a counter-offer option (`id="bounties"`) |
| 5 | Contributors | `Contributors.astro` | `--surface` | Top contributors with earnings, countries, merged PRs |
| 6 | HowItWorks | `HowItWorks.astro` | `--payout-tint` (content in a white `--surface` panel) | Four steps (post a bounty → ship a PR → AI review → merged and paid) with an auto-advancing step list and a matching UI card. Not scroll-pinned |
| 7 | FAQ | `FAQ.astro` | `--surface` (content in a large `--canvas` panel) | Sticky heading (desktop) beside an accordion: payouts, AI tools, AI review, disputes, pricing, countries, fees. Works without JS |
| 8 | FinalCTA | `FinalCTA.astro` | `--surface` (content in a dark photo panel: optional `public/images/cta-photo.webp` under an `--ink` → `--path-ship-bg` overlay, white text) | Scroll-linked heading that lights up letter by letter; "Find a bounty" and "Post a bounty" (`id="get-started"`) |

### Site header

- `Header.astro` (with `Logo.astro`) is rendered by `layouts/Base.astro` above every page, after a "Skip to content" link to `<main id="main">`.
- Sticky; transparent at the top, frosted after 24px of scroll. Below 1024px the nav moves into a native `<dialog>` menu.
- `--header-height` (64px, 72px from 1024px) is the single source for the header's height, `scroll-margin-top` on sections with an id, the hero's `min-height`, and anything sticky that must sit below the header (FAQ heading, Paths pin). Never hard-code the header height.

### Site footer

- `Footer.astro` is rendered by `layouts/Base.astro` below every page: `--ink` background, logo (`theme="dark"`), four link columns in `<nav aria-label="Footer">`, a bottom bar ("Payouts via PayPal.", legal links, designer credit) and a faint "fairmerge" watermark.
- The designer credit is the `CREDIT` constant at the top of `Footer.astro`.

### Section backgrounds

- `global.css` defines `.section { background-color: var(--section-bg, transparent); }`.
- Each component sets `--section-bg` on its root class, e.g. `.faq { --section-bg: var(--canvas); }`. Change a background there, nowhere else.
- When changing a background, re-check WCAG AA for text, buttons, and borders in that section.

## Layout reference

- We follow the section structure and layout of oneforma.com's homepage, rebuilt with our own copy, colors, fonts, and images.
- Never copy OneForma's code, images, illustrations, logos, testimonials, or stats. Rebuild from screenshots and descriptions.
- Hero layout: left column = headline, subheadline, two CTAs, testimonial carousel card. Right column = main visual with three floating stat cards and two soft decorative shapes behind it.

## Visual language

Borrowed from code review:

- **Green** (`--brand`, `--brand-hover`, `--brand-tint`, `--brand-soft`) = brand, merged, and money. Primary CTAs, links, focus ring, payouts (`--payout` is the same green), added lines.
- **Amber** (`--accent`, `--accent-tint`, `--accent-ink`) = bounty highlights and badges only. Text on solid `--accent` is always `--ink`; text on `--accent-tint` is `--accent-ink`. Never white on amber.
- **Red** (`--removed`, `--removed-tint`) = errors, rejected, removed lines.

Token names describe roles, not colours, so the palette can change without renaming.

### Design tokens

All tokens live in `:root` in `src/styles/global.css`:

- **Colour:** neutrals (`--ink`, `--ink-soft`, `--ink-muted`, `--canvas`, `--surface`, `--surface-frosted`, `--line`, `--ink-overlay`, `--scrim`), brand, accent, status, the three `--path-*-bg`, and white layers for dark backgrounds (`--on-dark-*`).
- **Type:** `--text-display`, `--text-h1`, `--text-h2`, `--text-h3`, `--text-body-lg`, `--text-body`, `--text-small`, `--text-caption`; `--leading-tight|snug|normal|code`; `--tracking-tight|wide`. `--font-code` is for code, repo names, file paths and handles only; numbers use the body font with `font-variant-numeric: tabular-nums`.
- **Spacing:** `--space-1` … `--space-10` (4, 8, 12, 16, 24, 32, 40, 48, 64, 80px), `--section-pad`, `--gap-section-head`, `--measure-narrow|measure|measure-wide`.
- **Radius:** `--radius-xs|sm|md|lg|xl|pill`. **Shadow:** `--shadow-sm|md|lg`.
- **Motion:** `--dur-fast|base|slow|slower` (160, 250, 400, 600ms), `--ease-out`, `--ease-in`. JS timings that must match a transition say which token they mirror.
- **Focus:** `--focus-ring`, `--focus-ring-on-dark`.

### Buttons

One shared set in `global.css`: `.btn` plus a variant (`--primary`, `--secondary`, `--on-dark`, `--outline-on-dark`) and an optional size (`--sm` 40px, default 48px, `--lg` 52px). Add `.btn__arrow` to a trailing arrow icon for the hover nudge. Components only add layout (width, alignment), never their own button colours.

## Rules

- One component per section.
- Vanilla JS only.
- Only tokens: every colour, font size, line height, letter spacing, spacing, radius, shadow, duration and easing in a component must be a `var(--…)` from `global.css`. No hex, rgb, raw px spacing or ms values outside `:root`. Documented exceptions: decorative watermark sizes and large outer clamps that are built from tokens. If a value is missing, add a token rather than a one-off.
- Mobile-first and responsive.
- Visible keyboard focus.
- Respect `prefers-reduced-motion`.
- WCAG AA contrast.
- Use real `<button>` elements for controls.

### Scroll-pinned sections (Paths)

- Use CSS `position: sticky` first; vanilla JS only for progress tracking.
- With `prefers-reduced-motion`, show all content statically.

### Motion

- One deliberate page-load reveal on the hero only.
- No fade-in on every section.
- Deliberate exception: FinalCTA's scroll-linked heading and its one-time reveal of the supporting line and buttons (never hidden again; content stays focusable throughout).

### PayPal

- Say "Payouts via PayPal".
- Never use PayPal's brand colors as our own.

## Working with the user

After writing any animation or interaction, explain how it works in plain language so the user can learn it.

## Development

```bash
npm run dev      # dev server at http://localhost:4321
npm run build    # production build to dist/
npm run preview  # preview the production build
```
