# Fairmerge in Webflow: build guide

How to rebuild **Hero, WaysToEarn, Paths and BountyBoard** from the Astro site in Webflow, using Client-First naming.

The Astro source is the reference. When something here is unclear, open the matching file in `src/components/` and `src/styles/global.css`.

**Contents**

- [Before you start](#before-you-start)
- [Part 1: Global setup](#part-1-global-setup)
- [Part 2.1: Hero](#part-21-hero)
- [Part 2.2: WaysToEarn](#part-22-waystoearn)
- [Part 2.3: Paths](#part-23-paths)
- [Part 2.4: BountyBoard](#part-24-bountyboard)
- [Final pass (whole page)](#final-pass-whole-page)

---

## Before you start

### Breakpoints

Webflow uses its own fixed breakpoints. The Astro code switches at 900px (hero) and 1024px (Paths, BountyBoard). In Webflow both switches happen at **Tablet**.

| Webflow breakpoint | Width | Astro equivalent |
|---|---|---|
| Desktop (base) | 992px and up | ≥ 900 / ≥ 1024 |
| Tablet | 991px and below | < 900 / < 1024 |
| Mobile landscape | 767px and below | < 768 |
| Mobile portrait | 478px and below | < 480 |

Styles cascade **down**: set everything on Desktop, then override only what changes on smaller breakpoints. That's the opposite of the mobile-first Astro CSS, so the "Styles per breakpoint" lists below start at Desktop.

### Four Webflow limits that shape this guide

1. **No `<button>` from the Button element.** Webflow's Button and Link Block render as `<a>`. CLAUDE.md requires real `<button>`s for controls (carousel arrows, chips, toggles), so those live in **Code Embeds**. Links that go somewhere (e.g. "Find a bounty") stay native.
2. **No pseudo-elements, `:focus-visible` on every element, attribute selectors or `subgrid` in the Style panel.** Those few rules go into one global CSS block (Part 1.6) or into a section's embed.
3. **Interactions ignore `prefers-reduced-motion`.** They write inline styles. The global CSS overrides them with `!important` under `prefers-reduced-motion: reduce` (Part 1.6).
4. **CSS functions.** Size fields accept `clamp()`, `min()`, `max()` and `calc()` when you type the whole expression into the value box (e.g. click the font-size field and type `clamp(2rem, 4.5vw, 3.25rem)`). If a field turns red or drops the value, use the per-breakpoint fallbacks given next to each value.

### Where script embeds go

A `<script>` inside a Code Embed runs the moment the browser reaches it, so it can only find elements that come **before** it on the page. Every embed with a script in this guide is placed as the **last child** of the element it controls. If you'd rather keep all scripts in **Page settings → Before `</body>` tag**, move just the `<script>…</script>` part there. It then runs after the whole page exists.

### Variable names inside custom code

Every Webflow Variable is published as a CSS custom property. The exact name depends on the collection and variable name, and Webflow may add prefixes.

To find a name: in the Variables panel, open the variable's menu and copy its CSS name if offered, or open the published site's CSS and search for the hex value. The snippets below use `var(--colors--brand, #0E6B47)`. The hex after the comma is a fallback, so a snippet still works if your name differs. Replace the names once and the fallbacks become unused.

---

## Part 1: Global setup

Do this once, before building any section.

### 1.1 Variables

Go to **Variables panel** (the "Variables" icon in the left bar) → create these collections.

**Collection: Colors**

| Variable | Value | Used for |
|---|---|---|
| ink | `#14162B` | Main text, dark buttons, FinalCTA |
| ink-muted | `#5A5F7A` | Secondary text, input borders |
| canvas | `#F6F7FB` | Page background, Hero, BountyBoard, FAQ |
| surface | `#FFFFFF` | Cards, text on dark |
| line | `#DADDEA` | Borders, dividers |
| brand | `#0E6B47` | Primary brand, merged state, CTAs, focus ring |
| brand-hover | `#0A5537` | Button hover, domain tag text |
| brand-tint | `#E3F1EA` | WaysToEarn background, tints, focus ring on dark |
| brand-soft | `#BFE3CF` | Hero decorative shape |
| accent | `#F2A93B` | Bounty highlights and badges only. Text on it is always ink |
| accent-tint | `#FCEFD6` | Highlight backgrounds, hero decorative shape |
| accent-ink | `#6B4206` | Text on accent-tint |
| payout | `#0E6B47` | "paid on merge", payout amounts (same as brand) |
| payout-tint | `#E6F4EC` | Added diff lines, HowItWorks background |
| removed | `#B42318` | Errors |
| removed-tint | `#FBEAEA` | Removed diff lines |
| path-earn-bg | `#0B3B2C` | Paths: Earn |
| path-grow-bg | `#102F3A` | Paths: Grow |
| path-ship-bg | `#3A2A0E` | Paths: Ship |
| on-dark-surface | `rgba(255,255,255,0.06)` | Translucent cards on Paths |
| on-dark-line | `rgba(255,255,255,0.12)` | Borders on Paths |
| on-dark-muted | `rgba(255,255,255,0.72)` | Muted text on Paths |
| on-dark-control | `rgba(255,255,255,0.4)` | Inactive carousel segments (3:1 contrast) |

The hero image is exported as a finished file (shapes in brand-soft and accent-tint), so you upload it rather than rebuild it.

**Collection: Typography**

| Variable | Type | Value |
|---|---|---|
| font-display | Font family | Bricolage Grotesque (fallback: Helvetica Neue, Arial, sans-serif) |
| font-body | Font family | IBM Plex Sans (fallback: Helvetica Neue, Arial, sans-serif) |
| font-code | Font family | IBM Plex Mono (fallback: Menlo, monospace) |
| size-h1 | Size | `clamp(2.5rem, 6vw, 4.5rem)` |
| size-h2 | Size | `clamp(2rem, 4.5vw, 3.25rem)` |
| size-h3 | Size | `clamp(1.25rem, 2.5vw, 1.625rem)` |

**Collection: Spacing**

| Variable | Type | Value | Fallback if `clamp()` isn't accepted |
|---|---|---|---|
| content-width | Size | `1240px` | |
| content-pad | Size | `clamp(16px, 4vw, 56px)` | Desktop 48px · Tablet 32px · Mobile L 24px · Mobile P 16px |
| section-pad | Size | `clamp(64px, 10vw, 128px)` | Desktop 112px · Tablet 88px · Mobile L 72px · Mobile P 64px |

**Collection: Radius**

| Variable | Value |
|---|---|
| radius-sm | `8px` |
| radius-lg | `20px` |
| radius-pill | `999px` |

**About the fallbacks:** variables hold one value for all breakpoints. If a size variable won't take `clamp()`, store the Desktop fallback in the variable. Then on each class that uses it, type the smaller value directly at Tablet and Mobile.

**Why one variable per section background instead of `--section-bg`:** in Astro, `.section` reads `--section-bg` so every section changes colour in one place. In Webflow you get the same result by picking a Colors variable as each section's Background. Changing the variable updates every section that uses it.

### 1.2 Fonts

Go to **Site settings → Fonts → Google Fonts**, then add:

| Family | Weights |
|---|---|
| Bricolage Grotesque | 400, 500, 600, 700 |
| IBM Plex Sans | 400, 500, 600 |
| IBM Plex Mono | 400, 500, 600 |

- **IBM Plex Mono 600:** the Astro site only loads 400 and 500, so the browser fakes the bold for the payout amounts. Webflow lets you load the real 600.
- **Bricolage's optical sizing:** Astro loads Bricolage as a variable font with an `opsz` axis. Webflow's Google Fonts picker loads static weights, so very large headings will look slightly less tight than on the Astro site. That's acceptable. For an exact match, upload the variable font file under **Custom fonts** instead.

### 1.3 Base styles

Select the **Body (All Pages)** tag in the Style panel's selector field, then set the styles below. Do the same for each heading tag (select "All H1 Headings" and so on).

| Tag | Styles |
|---|---|
| Body (All Pages) | Font: font-body · Size 16px · Line height 1.6 · Colour: ink · Background: canvas |
| All H1–H4 | Font: font-display · Weight 700 · Line height 1.1 · Margin 0 |
| All H1 | Size: size-h1 · Letter spacing −0.02em |
| All H2 | Size: size-h2 · Letter spacing −0.015em |
| All H3 | Size: size-h3 |
| All H4 | Size 1.25rem |
| All Paragraphs | Margin 0 |
| All Links | Colour: brand · Hover state: brand-hover · Underline offset: see Part 1.6 |

`text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs and `text-underline-offset` go into the global CSS (Part 1.6). Add them in **Style panel → Custom properties** instead if your Designer shows that section.

**Heading fallbacks** (only if the size variables hold a single px value):

| | Desktop | Tablet | Mobile L | Mobile P |
|---|---|---|---|---|
| H1 | 4.5rem | 3.5rem | 2.75rem | 2.5rem |
| H2 | 3.25rem | 2.5rem | 2.25rem | 2rem |
| H3 | 1.625rem | 1.5rem | 1.375rem | 1.25rem |

### 1.4 Page structure (Client-First)

```
Body
└─ page-wrapper (Div)
   ├─ global-styles (Code Embed: Part 1.6)   ← or put the CSS in Site settings → Head code
   └─ main-wrapper (Div, tag: main)
      ├─ section_hero
      ├─ section_ways
      ├─ section_paths
      └─ section_board
```

Every section follows the Client-First pattern:

```
section_[name] (Section)
└─ padding-global (Div)
   └─ container-large (Div)
      └─ padding-section-large (Div)     ← vertical padding (skip where the section sets its own)
         └─ [name]_component (Div)
```

### 1.5 Reusable classes

| Class | Styles |
|---|---|
| `padding-global` | Padding left/right: content-pad |
| `container-large` | Max width `1128px` (= 1240 − 2 × 56, the content width at full size) · Margin left/right auto · Width 100% |
| `padding-section-large` | Padding top/bottom: section-pad |
| `button` | Display inline-flex · Align center · Justify center · Gap 8px · Min height 52px · Padding 0 24px · Radius radius-sm · Background brand · Colour surface · Weight 600 · Size 1rem · No underline · Transition: background-colour 160ms ease, colour 160ms ease. **Hover:** Background brand-hover |
| `button` + `is-secondary` | Background transparent · Colour ink · Box shadow inset 0 0 0 1.5px ink. **Hover:** Background ink · Colour surface |
| `button` + `is-small` | Min height 44px · Padding 0 18px · Size 0.9375rem |
| `button_icon` | The arrow inside a button. Width/height 18px · Transition transform 160ms ease. Parent hover moves it: add a hover Interaction (Move X 3px, 160ms), or the global CSS rule |
| `tag` | Padding 2px 10px · Border 1px line · Radius radius-pill · Size 0.8125rem · Colour ink-muted |
| `tag` + `is-domain` | Background brand-tint · Border colour brand-tint · Colour brand-hover · Weight 600 |
| `card` | Background surface · Border 1px line · Radius radius-lg · Padding `clamp(22px, 2.2vw, 30px)` (fallback: Desktop 28px, Mobile 22px) |
| `chip` | Built by script in BountyBoard, styled in its embed (Part 2.4). WaysToEarn's chips are `ways_panel-chip` and `ways_lang` |
| `sr-only` | Visually hidden text that screen readers still read (rules in Part 1.6) |
| `link-stretched` | Makes a link's click area cover its whole card (rules in Part 1.6) |

**Why `container-large` is 1128px and not 1240px:** in Astro, `--content-width` is the outer width *including* padding. Client-First puts the padding on `padding-global`, outside the container, so the container's max width is the inner width.

### 1.6 Global CSS

Put this in **Site settings → Custom code → Head code**, or in the `global-styles` Code Embed (Client-First's convention, which also previews in the Designer). It holds only what the Style panel can't do.

```html
<style>
/* 1. Keyboard focus ring on everything (Webflow can't style :focus-visible globally). */
:focus-visible { outline: 3px solid var(--colors--brand, #0E6B47); outline-offset: 3px; }
.section_paths :focus-visible { outline-color: var(--colors--brand-tint, #E3F1EA); }

/* 2. Visually hidden, still read by screen readers. */
.sr-only {
  position: absolute !important; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; border: 0;
}

/* 3. The hidden attribute must win over Webflow's display styles. */
[hidden] { display: none !important; }

/* 4. Typography details the Style panel lacks. */
h1, h2, h3, h4 { text-wrap: balance; }
p { text-wrap: pretty; }
a { text-underline-offset: 0.2em; }

/* 5. Stretched link: the link's ::after covers the nearest positioned parent (the card). */
.link-stretched::after { content: ''; position: absolute; inset: 0; border-radius: inherit; }
.link-stretched:focus-visible { outline: none; }
.link-stretched:focus-visible::after { outline: 3px solid var(--colors--brand, #0E6B47); outline-offset: 3px; }

/* 6. Button arrow nudge on hover. */
.button:hover .button_icon { transform: translateX(3px); }

/* 7. Hide scrollbars on horizontal scroll rows (they still scroll). */
.ways_lang-list, .board_list-wrapper, .paths_card-list, .board_chips { scrollbar-width: none; }
.ways_lang-list::-webkit-scrollbar, .board_list-wrapper::-webkit-scrollbar,
.paths_card-list::-webkit-scrollbar, .board_chips::-webkit-scrollbar { display: none; }

/* 8. Reduced motion. Interactions write inline styles; !important beats them.
      [data-reveal] marks elements that start hidden in a load or scroll animation. */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important; animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important; scroll-behavior: auto !important;
  }
  [data-reveal] { opacity: 1 !important; transform: none !important; }
}
@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }
</style>
```

**Global checklist**

- [ ] Publish to the staging domain, open DevTools and confirm the variables appear as CSS custom properties. Update the names in the snippets.
- [ ] Tab through the page: every link, button and input shows the 3px green ring.
- [ ] In DevTools → Rendering, set "Emulate prefers-reduced-motion: reduce" and reload. Nothing animates and nothing stays invisible.

---

## Part 2.1: Hero

**Background:** canvas. The copy rises in once on page load. On Desktop the image sits on the right and the testimonial card under the buttons. Astro shows the card from 900px; in Webflow it's **Desktop only** (992px and up).

### Element tree

```
section_hero (Section, id: hero)                         [Custom attr: aria-labelledby = hero-title]
└─ padding-global
   └─ container-large
      └─ hero_component (Div, Grid)
         ├─ hero_content (Div)
         │  ├─ hero_title (Heading H1, id: hero-title)    [data-reveal]
         │  ├─ hero_lede (Paragraph)                      [data-reveal]
         │  └─ hero_button-group (Div)                    [data-reveal]
         │     ├─ button (Link Block → #bounties)
         │     │  ├─ Text: "Find a bounty"
         │     │  └─ button_icon (Code Embed: arrow SVG)
         │     └─ button is-secondary (Link Block → #paths)
         │        └─ Text: "Post a bounty"
         ├─ hero_visual (Div)
         │  └─ hero_picture (Code Embed: <picture>, see "Image")
         └─ hero_quote (Div)                              [carousel attrs, see Accessibility]
            ├─ hero_quote-slides (Div, Grid)
            │  └─ hero_quote-slide (Div, tag: figure) × 3 [data-slide, data-name]
            │     ├─ hero_quote-text (Block Quote)
            │     └─ hero_quote-person (Div)
            │        ├─ hero_avatar (Div)                 [aria-hidden = true] letter "A"
            │        └─ hero_quote-who (Div)
            │           ├─ hero_quote-name (Text Block)
            │           └─ hero_quote-meta (Text Block)
            └─ hero_quote-controls (Code Embed: buttons + script, see "Custom code")
```

Give the first slide the combo class `is-active`.

**Arrow SVG** for `button_icon`, reused in every button with an arrow:

```html
<svg class="button_icon" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" focusable="false"><path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
```

### Image: two Image elements vs one `<picture>` embed

| | Two Image elements (one hidden per breakpoint) | One `<picture>` in a Code Embed |
|---|---|---|
| How | Desktop image: Display none at Mobile L. Mobile image: Display none on Desktop and Tablet | `<source media="(max-width: 767px)">` picks the file |
| Downloads | An image hidden with `display: none` is **still downloaded** when its loading is set to Eager. The hero image must be eager (it's the largest thing on screen), so phones download both | Exactly one file |
| Webflow extras | Webflow generates responsive sizes and lets you edit alt text in the panel | You paste asset URLs and write alt text in code |

**Recommendation: the `<picture>` embed.** It's the only option that loads one file *and* keeps it eager and high priority. That's the same choice as the Astro code.

1. Upload `public/images/hero-image-desktop.webp` and `hero-image-mobile.webp` in the **Assets panel**. Then open each asset's settings and copy its URL.
2. Add a Code Embed inside `hero_visual`:

```html
<!-- The browser uses the first <source> whose media query matches, else the <img>.
     Only the chosen file is downloaded. width/height reserve space (no layout jump). -->
<picture class="hero_picture">
  <source media="(max-width: 767px)" srcset="PASTE-MOBILE-URL" width="936" height="893">
  <img class="hero_image" src="PASTE-DESKTOP-URL" width="1200" height="1140"
       alt="A pull request marked Merged after passing AI review, with a $900 payout sent via PayPal. Stats: 40+ languages, about 5 minutes from merge to payout, $250 average bounty."
       loading="eager" fetchpriority="high" decoding="async">
</picture>
<style>
  .hero_picture { display: block; width: min(100%, 640px); }
  .hero_image { display: block; width: 100%; height: auto; }
</style>
```

### Styles per breakpoint

**Desktop (base)**

| Class | Styles |
|---|---|
| `section_hero` | Background canvas · Min height `100svh` (fallback `100vh`) · Display flex · Align center · Padding top/bottom `clamp(20px, 4.5svh, 64px)` (fallback 40px) · Overflow clip |
| `hero_component` | Grid, 2 columns `1.05fr 1fr`, 2 rows auto · Column gap `clamp(32px, 5vw, 80px)` (fallback 56px) · Row gap `clamp(20px, 4svh, 40px)` (fallback 32px) · Align content center. Place `hero_content` at col 1 row 1, `hero_quote` at col 1 row 2, and `hero_visual` at col 2 spanning rows 1–2 (Grid child settings → Manual) |
| `hero_title` | Size `clamp(2.5rem, min(4.6vw, 8.4svh), 4.5rem)` (fallback 4rem) · Line height 1.02 · Max width 14ch · Colour ink |
| `hero_lede` | Margin top `clamp(12px, 2.4svh, 24px)` · Max width 38rem · Size `clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)` (fallback 1.1875rem) · Colour ink-muted |
| `hero_button-group` | Margin top `clamp(18px, 3.6svh, 36px)` · Flex, wrap · Gap 12px |
| `hero_visual` | Flex · Justify center · Align self center |
| `hero_quote` | Max width 34rem · Padding 20px 22px 16px · Background surface · Border 1px line · Radius radius-lg |
| `hero_quote-slides` | Grid, 1 column. Put **all three slides in row 1 / col 1** (Manual) so they overlap and the card keeps the tallest slide's height |
| `hero_quote-slide` | Opacity 0 (the slide transitions are in the embed CSS) |
| `hero_quote-slide` + `is-active` | Opacity 1 |
| `hero_quote-text` | Size 1rem · Line height 1.55 · Colour ink · No border, padding 0, margin 0 (Webflow styles Block Quote by default) |
| `hero_quote-person` | Margin top 14px · Flex · Align center · Gap 10px |
| `hero_avatar` | 36 × 36px · Radius 50% · Grid, centred · Background brand-tint · Colour brand · Font font-display 700 · Size 0.9375rem |
| `hero_quote-name` | Weight 600 · Size 0.9375rem · Line height 1.3 · Colour ink |
| `hero_quote-meta` | Size 0.8125rem · Colour ink-muted |

**Tablet**

| Class | Changes |
|---|---|
| `section_hero` | Min height auto · Padding top/bottom `clamp(40px, 7vw, 88px)` (fallback 64px) |
| `hero_component` | 1 column · Row gap `clamp(40px, 8vw, 56px)` (fallback 48px). Children: content row 1, visual row 2 |
| `hero_title` | Size `clamp(2rem, 1.2rem + 4vw, 4.75rem)` (fallback 3.5rem) · Line height 1.05 |
| `hero_lede` | Margin top `clamp(16px, 2.5vw, 24px)` |
| `hero_button-group` | Margin top `clamp(24px, 3.5vw, 36px)` |
| `hero_quote` | **Display none.** Astro also hides it below 900px. A hidden carousel stops rotating: the script checks |

**Mobile landscape**

| Class | Changes |
|---|---|
| `hero_title` | Fallback size 2.75rem |

**Mobile portrait**

| Class | Changes |
|---|---|
| `hero_button-group` | Direction vertical |
| `button` (inside the hero only: use the combo `hero_button`, or set it on the global `button`, which Astro also does below 480px) | Width 100% |

### Content

- **H1:** Get paid the moment your code merges.
- **Lede:** Claim a bounty in robotics, space or AI agents and ship the fix, AI tools welcome. Our AI checks it against the brief before the maintainer looks. Merged means paid, via PayPal, wherever you are.
- **Primary button:** Find a bounty → `#bounties`
- **Secondary button:** Post a bounty → `#paths`
- **Image alt:** in the embed above.
- **Testimonials** (sample demo content, not real customers):

| `data-name` | Quote | Name | Meta |
|---|---|---|---|
| Amara O. | "Fixed a flaky gripper test in the robot sim on a Friday night. The payout hit PayPal before I closed my laptop." | Amara O. | Nigeria · Robotics, C++ |
| Lucas M. | "The AI review told me exactly what my telemetry decoder was missing before the maintainer even looked. Second push got merged." | Lucas M. | Brazil · Space, Go |
| Priya S. | "We cleared 30 agent-tooling issues in a month without hiring. Contributors get paid, we ship." | Priya S. | India · Maintainer, open-source agent framework |

Avatar letters: A, L, P.

### Interactions

**Load reveal (native).** Create **Page trigger → Page Load → "When page finishes loading"** and a new timed animation named "Hero reveal":

| # | Target (Element: select it) | Action | Values |
|---|---|---|---|
| 1 | hero_title, hero_lede, hero_button-group | Opacity + Move | Opacity 0 %, Move Y 14px. Tick **Set as initial state** |
| 2 | hero_title | Opacity + Move | → 100 %, Y 0 · 420ms · delay 0 |
| 3 | hero_lede | Opacity + Move | → 100 %, Y 0 · 420ms · delay 80ms |
| 4 | hero_button-group | Opacity + Move | → 100 %, Y 0 · 420ms · delay 160ms |

- **Easing:** Custom `cubic-bezier(0.2, 0.7, 0.2, 1)` if your Interactions panel has custom bezier, otherwise **Out Cubic**.
- **Why `data-reveal`:** "Set as initial state" hides the elements with inline styles before the animation runs. The global reduced-motion CSS uses `[data-reveal]` to force them visible again, so reduced-motion users never see them hidden.

**Testimonial carousel: native Slider vs custom embed.**

| | Webflow Slider | Custom embed (Astro's logic) |
|---|---|---|
| Pause button | None. Auto-advance can't be paused by keyboard or screen-reader users. That fails WCAG 2.2.2 (moving content over 5s needs pause) | Real `<button aria-pressed>` Pause/Play |
| Pauses on hover/focus | No | Yes, and when the tab is hidden or the card is hidden |
| Announcements | Can announce automatic slide changes | Announces only changes the user caused (`aria-live` switches off while rotating) |
| Reduced motion | Keeps rotating | Starts paused |
| Controls | Dots are `div`s with roles | Real `<button>`s with labels |

**Recommendation: custom embed.** It's the accessible option, and the slides themselves stay native elements you can edit in the Designer.

### Custom code

Put one Code Embed `hero_quote-controls` as the last child of `hero_quote`. The dots are built from the slides, so adding a slide needs no code change.

```html
<div class="hero_quote-controls" data-controls hidden>
  <button class="hero_quote-toggle" type="button" aria-pressed="false" aria-label="Pause testimonials" data-toggle>
    <svg class="icon-pause" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><path d="M5.5 3.5v9M10.5 3.5v9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    <svg class="icon-play" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><path d="M5 3.2v9.6L12.5 8z" fill="currentColor"/></svg>
  </button>
  <div class="hero_quote-dots" data-dots></div>
</div>

<style>
  /* Slides: fade, and become invisible to screen readers once faded out. */
  .hero_quote-slide { visibility: hidden; transition: opacity 400ms ease, visibility 0s linear 400ms; }
  .hero_quote-slide.is-active { visibility: visible; transition: opacity 400ms ease, visibility 0s; }

  .hero_quote-controls { margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--colors--line, #DADDEA);
    display: flex; align-items: center; justify-content: space-between; }
  .hero_quote-toggle { display: grid; place-items: center; width: 32px; height: 32px; padding: 0;
    border: 1px solid var(--colors--line, #DADDEA); border-radius: 50%;
    background: var(--colors--surface, #FFF); color: var(--colors--ink, #14162B); cursor: pointer; }
  .hero_quote-toggle:hover { background: var(--colors--canvas, #F6F7FB); }
  .hero_quote-toggle .icon-play { display: none; }
  .hero_quote-toggle[aria-pressed="true"] .icon-play { display: block; }
  .hero_quote-toggle[aria-pressed="true"] .icon-pause { display: none; }

  .hero_quote-dots { display: flex; gap: 2px; }
  /* 28px hit area, 8px visible dot; the current dot stretches into a 20px green bar. */
  .hero_quote-dot { display: grid; place-items: center; width: 28px; height: 28px; padding: 0;
    border: 0; border-radius: 50%; background: transparent; cursor: pointer; }
  .hero_quote-dot::before { content: ''; width: 8px; height: 8px; border-radius: 999px;
    background: var(--colors--ink-muted, #5A5F7A); transition: width 200ms ease, background-color 200ms ease; }
  .hero_quote-dot[aria-current="true"]::before { width: 20px; background: var(--colors--brand, #0E6B47); }
</style>

<script>
(() => {
  const carousel = document.querySelector('[data-carousel]');
  if (!carousel) return;

  const INTERVAL = 6000; // ms between slides
  const slides = [...carousel.querySelectorAll('[data-slide]')];
  const live = carousel.querySelector('.hero_quote-slides');
  const controls = carousel.querySelector('[data-controls]');
  const toggle = carousel.querySelector('[data-toggle]');
  const dotsBox = carousel.querySelector('[data-dots]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 992px)'); // the card is hidden below this

  // Build one labelled <button> per slide.
  const dots = slides.map((slide, n) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'hero_quote-dot';
    b.setAttribute('aria-label', `Show testimonial ${n + 1} of ${slides.length}: ${slide.dataset.name}`);
    b.addEventListener('click', () => { show(n); sync(); });
    dotsBox.append(b);
    return b;
  });

  let index = 0, timer, hovering = false, focusWithin = false;
  let userPaused = reduce.matches; // reduced motion: start paused
  controls.hidden = false;         // controls only appear when JS runs

  // Show slide i: one gets .is-active, the rest are hidden from screen readers.
  function show(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => {
      s.classList.toggle('is-active', n === index);
      s.setAttribute('aria-hidden', String(n !== index));
    });
    dots.forEach((d, n) => n === index ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current'));
  }

  const rotating = () => !userPaused && !hovering && !focusWithin && !document.hidden && desktop.matches;

  // Re-check after every change: start or stop the timer, update the button,
  // and announce slide changes only when they're not automatic.
  function sync() {
    clearInterval(timer);
    timer = rotating() ? setInterval(() => show(index + 1), INTERVAL) : undefined;
    toggle.setAttribute('aria-pressed', String(userPaused));
    toggle.setAttribute('aria-label', userPaused ? 'Play testimonials' : 'Pause testimonials');
    live.setAttribute('aria-live', rotating() ? 'off' : 'polite');
  }

  toggle.addEventListener('click', () => { userPaused = !userPaused; if (!userPaused) focusWithin = false; sync(); });
  carousel.addEventListener('mouseenter', () => { hovering = true; sync(); });
  carousel.addEventListener('mouseleave', () => { hovering = false; sync(); });
  carousel.addEventListener('focusin', () => { focusWithin = true; sync(); });
  carousel.addEventListener('focusout', (e) => { if (!carousel.contains(e.relatedTarget)) { focusWithin = false; sync(); } });
  document.addEventListener('visibilitychange', sync);
  desktop.addEventListener('change', sync);
  reduce.addEventListener('change', () => { if (reduce.matches) userPaused = true; sync(); });

  show(0);
  sync();
})();
</script>
```

The Astro version keeps one `aria-label` ("Pause testimonials") and relies on `aria-pressed`. This version also swaps the label to "Play testimonials" when paused, which reads more clearly. Either is valid.

### Accessibility (Element settings → Custom attributes)

| Element | Attribute | Value |
|---|---|---|
| section_hero | `aria-labelledby` | `hero-title` |
| hero_title | ID (settings field) | `hero-title` |
| hero_title, hero_lede, hero_button-group | `data-reveal` | (empty, or `true`) |
| hero_quote | `role` | `region` |
| hero_quote | `aria-roledescription` | `carousel` |
| hero_quote | `aria-label` | `What contributors and maintainers say` |
| hero_quote | `data-carousel` | `true` |
| hero_quote-slides | `aria-live` | `off` (the script changes it) |
| each hero_quote-slide | `role` | `group` |
| each hero_quote-slide | `aria-roledescription` | `slide` |
| each hero_quote-slide | `aria-label` | `1 of 3`, `2 of 3`, `3 of 3` |
| each hero_quote-slide | `data-slide` | `true` |
| each hero_quote-slide | `data-name` | `Amara O.` / `Lucas M.` / `Priya S.` |
| hero_avatar | `aria-hidden` | `true` |

### Checklist

- [ ] At 1440 × 900 and 1280 × 720, the whole hero (copy, card and image) fits one screen.
- [ ] Network panel at 375px: only `hero-image-mobile.webp` downloads. At 1280px only the desktop file downloads.
- [ ] Reload: the title, lede and buttons rise in once, all within about 0.6s. With reduced motion they're simply there.
- [ ] Carousel: rotates every 6s; stops while hovered and while any control has focus. Pause → Play works and the label changes. Dots jump to a slide.
- [ ] Screen reader: automatic changes are silent; clicking a dot announces the new quote.
- [ ] Below 992px the testimonial card is hidden and no timer runs (check DevTools → Performance for repeating intervals, or add a breakpoint in the script).

---

## Part 2.2: WaysToEarn

**Background:** brand-tint. The five bounty types appear as **vertical tabs** on Desktop and as an **accordion** on Tablet and smaller. One item is always open; clicking the open item does nothing.

### Webflow's native Tabs vs one structure + script

| | Native Tabs element (+ a separate accordion for mobile) | One structure + script (Astro's approach) |
|---|---|---|
| Structure | Tabs keeps its menu and its content in two separate wrappers, so it can't turn into an accordion. You'd build the five items twice: Tabs shown on Desktop, an accordion shown below | Built once in accordion order (each panel right under its header) |
| Keeping content in sync | Every copy change twice | Once |
| Accessibility | Tabs is fine; the duplicate hidden copy is invisible to assistive tech only if you hide it with display none | Correct tabs pattern on Desktop, correct accordion pattern below |
| Centre-out line, "can't close", height animation | Not native in either; needs custom code anyway | In the script and CSS |

**Recommendation: one structure + script.** Native Tabs can't become an accordion, so the native route doubles the content and still needs code. Build the items once in the Designer, then paste one Code Embed that adds the behaviour and the Desktop tab layout.

**Why the panels move on Desktop.** ARIA only allows tabs inside a `tablist`. The panels can't sit between the tabs, so on Desktop the script moves them into an empty right-hand column (`ways_panels`), and moves them back below 992px. It's still one set of elements, never duplicated.

### Element tree

```
section_ways (Section, id: ways-to-earn)                    [aria-labelledby = ways-title, data-ways]
└─ padding-global
   └─ container-large
      └─ padding-section-large
         └─ ways_component (Div)
            ├─ ways_header (Div, Grid)
            │  ├─ ways_title (H2, id: ways-title)
            │  │  ├─ ways_title-line (Text Span): "Five ways"
            │  │  └─ ways_title-line (Text Span): "to earn."
            │  └─ ways_intro (Div)
            │     ├─ ways_intro-text (Paragraph)
            │     └─ ways_browse (Link Block → #bounties): "Browse all bounties" + arrow embed
            ├─ ways_tabs (Div)                                        [data-comp]
            │  ├─ ways_list (Div)                                     [data-list]
            │  │  └─ ways_item (Div) × 5                              [data-item]
            │  │     ├─ ways_header-embed (Code Embed: <h3><button>, see below)
            │  │     └─ ways_panel (Div, id: ways-panel-bugs …)       [data-panel; items 2–5 also: hidden]
            │  │        └─ ways_panel-clip (Div)
            │  │           └─ ways_panel-body (Div, Grid)
            │  │              ├─ ways_panel-text (Div)
            │  │              │  ├─ ways_panel-title (Paragraph)      [data-anim]
            │  │              │  ├─ ways_panel-desc (Paragraph)       [data-anim]
            │  │              │  ├─ ways_panel-chips (List)           [data-anim]
            │  │              │  │  └─ ways_panel-chip (List Item) × 4
            │  │              │  └─ ways_cta (Link Block → #bounties) [data-anim]
            │  │              │     ├─ Text: "View bug-fix bounties"
            │  │              │     └─ arrow embed
            │  │              └─ ways_visual (Div)                   [aria-hidden = true]
            │  │                 └─ vig + is-card (Div): vignette, see "Vignettes"
            │  └─ ways_panels (Div, empty)                            [data-panels]
            ├─ ways_langs (Div)
            │  ├─ ways_langs-label (Text Block, id: ways-langs-label): "Open bounties in"
            │  └─ ways_lang-list (List)                               [aria-labelledby = ways-langs-label]
            │     └─ List Item × 9
            │        └─ ways_lang (Link → #bounties)
            └─ ways_script (Code Embed: CSS + script)                 ← must be last
```

**Header embed** (one per item; change the id, label, icon and `is-active` per item). Webflow's Heading element can't contain a button, so the whole `<h3>` is one embed:

```html
<h3 class="ways_h" data-heading>
  <button type="button" class="ways_tab is-active" id="ways-tab-bugs" aria-controls="ways-panel-bugs" data-tab>
    <span class="ways_icon"><!-- paste the item's icon SVG here --></span>
    <span class="ways_label">Fix bugs</span>
    <svg class="ways_chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 9l6 6 6-6"/></svg>
  </button>
</h3>
```

Only the first item has `is-active`. The `id` and `aria-controls` must match its `ways_panel`'s ID.

**Icon SVGs** (1.5px stroke, 24px):

```html
<!-- bugs --><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M8 9a4 4 0 0 1 8 0v5a4 4 0 0 1-8 0z"/><path d="M12 9v9M4 13h4M16 13h4M5 7l3 2M19 7l-3 2M5 19l3-2M19 19l-3-2M9.5 5.5 8 4M14.5 5.5 16 4"/></svg>
<!-- features --><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8M8 12h8"/></svg>
<!-- tests --><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3"/><path d="M7.5 15h9"/></svg>
<!-- docs --><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 6c-2-1.5-5-2-8-1.5v14c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-14c-3-.5-6 0-8 1.5zM12 6v14"/></svg>
<!-- reviews --><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M6 8.5v7M18 15.5V9a3 3 0 0 0-3-3h-4M13 3.5 10.5 6 13 8.5"/></svg>
```

### Vignettes

White cards built from native Divs, reusing the `vig_*` classes from Paths (Part 2.3) plus the combo `vig is-card`. Use a Code element or `font-code` only for actual code.

```
Fix bugs (diff)                  Build features (PR card)            Write tests
vig is-card                      vig is-card                         vig is-card
├─ vig_head                      ├─ vig_meta: "groundlink/telemetry  ├─ vig_head: "tests/test_avoidance.py" · "pytest"
│  ├─ "src/sim/gripper.py"       │   · Pull request #214"            ├─ vig_tests (List)
│  └─ "+3" (payout) "−2"         ├─ vig_title: "Decode CubeSat       │  └─ vig_test × 4: check circle + test name
│     (removed)                  │   telemetry frames"               └─ vig_result: "4 passed" (payout) "in 0.84s"
└─ vig_diff                      └─ vig_pr-meta
   └─ vig_line × 5                  ├─ "4 files changed"
      (2 × is-del, 3 × is-add)      └─ "+182" "−24" + 5 small squares
                                       (4 payout, 1 removed)

Improve docs (doc preview)       Review code (comment)
vig is-card                      vig is-card
├─ vig_title: "Build a custom    ├─ vig_codeline: "88" + "await tool.call(args, { timeout: 30_000 })"
│   agent tool"                  └─ vig_comment
├─ vig_text × 2                     ├─ vig_comment-head: avatar "L" · "lena-w" · vig_badge "Approved" (payout-tint / payout)
└─ vig_code (Code Block)            └─ Paragraph: "Timeout plus backoff covers the hang. Nice, no other changes needed."
```

**Content for the vignettes:**

- **Diff lines** (`−` = is-del, `+` = is-add):
  - `− state = sim.read_gripper()`
  - `− sim.step()`
  - `+ with sim.lock:`
  - `+     sim.step()`
  - `+     state = sim.read_gripper()`
- **Test names:** `glass_wall_detected`, `pedestrian_crossing`, `dropped_lidar_frame`, `empty_scan_stops`
- **Doc text:**
  - "Register a tool once and the agent can call it whenever a task needs it."
  - "Give it a clear name and a typed input."
  - Code block:
    ```
    @tool("search_issues")
    def search(query: str) -> list[Issue]:
        ...
    ```

| Class | Styles |
|---|---|
| `vig` + `is-card` | Max width 440px · Padding 18px 20px · Radius radius-lg · Shadow 0 24px 48px −28px rgba(20,22,43,0.4) · Size 0.875rem |
| `vig_meta`, `vig_text` | Colour ink-muted · Size 0.8125rem |
| `vig_pr-meta` | Margin top 14px · Padding top 12px · Border top 1px line · Flex · Space between |
| `vig_tests` | No list style · Padding 6px 0 0 |
| `vig_test` | Flex · Align center · Gap 10px · Padding 6px 0 |
| `vig_check` | 18 × 18px · Radius 50% · Grid centred · Background payout-tint · Colour payout |
| `vig_result` | Margin top 8px · Padding top 10px · Border top 1px line |
| `vig_code`, `vig_codeline` | Margin top 12px · Padding 10px 12px · Radius 8px · Background canvas · Font font-code 0.8125rem · White space pre · Overflow hidden |
| `vig_comment` | Margin top 12px · Padding 12px · Border 1px line · Radius 10px |
| `vig_badge` | Margin left auto · Inline-flex · Gap 4px · Padding 2px 8px · Radius pill · Background payout-tint · Colour payout · Size 0.75rem · Weight 600 |

### Styles per breakpoint

The Designer holds the **accordion** look, the base for every breakpoint. The Desktop tab layout only applies after the script adds `is-tabs`, so it lives in the embed CSS (below), not in the Style panel.

**Desktop (base)**

| Class | Styles |
|---|---|
| `section_ways` | Background brand-tint |
| `ways_header` | Grid, 2 columns `1fr auto` · Gap 20px · Align end · Padding bottom `clamp(32px, 4vw, 48px)` · Border bottom 1px line |
| `ways_title` | Size `clamp(2.5rem, 1.6rem + 3.6vw, 4.5rem)` (fallback 4.5rem) · Weight 600 · Line height 1 · Letter spacing −0.025em |
| `ways_title-line` | Display block |
| `ways_intro` | Max width 30rem · Justify self end · Text align right · Colour ink-muted |
| `ways_browse` | Margin top 16px · Inline-flex · Gap 6px · Padding bottom 3px · Border bottom 1.5px solid ink · Weight 600 · Size 0.9375rem · Colour ink · No underline. **Hover:** colour brand |
| `ways_item` | Border bottom 1px line |
| `ways_panel` | Grid, 1 row (the embed CSS animates its row) |
| `ways_panel-clip` | Min height 0 · Overflow hidden · Margin 0 −6px · Padding 0 6px (keeps focus rings visible) |
| `ways_panel-body` | Grid, 1 column · Gap 24px · Padding 4px 0 28px |
| `ways_panel-text` | Flex vertical · Align start · Gap 16px |
| `ways_panel-title` | Display none (shown on Desktop by the embed CSS) |
| `ways_panel-desc` | Max width 32rem · Colour ink-muted |
| `ways_panel-chips` | Flex, wrap · Gap 8px · No list style · Padding 0 |
| `ways_panel-chip` | Inline-flex · Align center · Gap 8px · Padding 5px 12px · Border 1px line · Radius pill · Background surface · Size 0.875rem. The green dot is the embed CSS's `::before` |
| `ways_cta` | Inline-flex · Centre · Gap 8px · Min height 48px · Padding 0 24px · Radius radius-sm · Background brand · Colour surface · Weight 600 · No underline · Align self stretch. **Hover:** Background brand-hover |
| `ways_langs` | Margin top `clamp(32px, 4vw, 48px)` · Grid, 2 columns `auto 1fr` · Align center · Gap 16px |
| `ways_langs-label` | Size 0.8125rem · Weight 600 · Letter spacing 0.06em · Uppercase · Colour ink-muted |
| `ways_lang-list` | Flex, no wrap · Gap 8px · No list style · Padding 4px |
| `ways_lang` | Inline-flex · Align center · Min height 36px · Padding 0 14px · Border 1px line · Radius pill · Background surface · Size 0.875rem · Colour ink · No underline · No wrap. **Hover:** Border and colour brand |

**Tablet**

| Class | Changes |
|---|---|
| `ways_header` | 1 column |
| `ways_intro` | Justify self start · Text align left |
| `ways_lang-list` | Wrap |

**Mobile landscape**

| Class | Changes |
|---|---|
| `ways_langs` | 1 column · Gap 12px |
| `ways_lang-list` | No wrap · Overflow: scroll horizontally · Margin left/right −24px · Padding 4px 24px (one sideways-scrolling row) |

**Mobile portrait**

| Class | Changes |
|---|---|
| `ways_lang-list` | Margin left/right −16px · Padding 4px 16px |

### Content

- **H2:** Five ways / to earn.
- **Intro:** Every bounty falls into one of five types. Bring the expertise you already have, and use whatever tools you like, AI included.
- **Link:** Browse all bounties → `#bounties`

| id | Label | Title (Desktop only) | Description | Chips | CTA |
|---|---|---|---|---|---|
| bugs | Fix bugs | Find it. Fix it. Get paid. | Track down what's broken and ship the fix. If you've seen the problem before, you can be merged and paid the same day. | Race conditions · Memory leaks · Edge cases · Regressions | View bug-fix bounties |
| features | Build features | From brief to merged code. | Take a well-scoped issue from idea to merged code. The brief tells you exactly what done looks like, and the AI review checks against it. | API endpoints · UI components · Integrations · CLI commands | View feature bounties |
| tests | Write tests | Cover what nobody covered. | Cover the cases nobody else got to. A great starting point if you're new to a codebase. | Unit tests · Integration tests · Edge cases · Flaky test fixes | View testing bounties |
| docs | Improve docs | Make the code make sense. | Explain what the code does so the next developer doesn't have to guess. Clear writing gets merged fast. | Migration guides · API reference · Tutorials · READMEs | View docs bounties |
| reviews | Review code | Catch what others miss. | Specialists in security, accessibility, databases, or performance catch what general reviews miss. Get paid for the expertise, not the typing. | Security · Accessibility · Performance · Database design | View review bounties |

- **All CTAs and language chips:** link to `#bounties`.
- **Language chips:** TypeScript, Python, Rust, Go, JavaScript, Java, Ruby, PHP, +32 more. Give the last one a custom attribute `aria-label` = `32 more languages`.

### Interactions

None native. Everything is a CSS transition triggered by classes the script toggles:

| Effect | How |
|---|---|
| Centre-out line | `::after` with `scaleX(0)` → `scaleX(1)` and `transform-origin: center`; 400ms ease-out to grow, 250ms to shrink |
| Hover preview | Inactive tab hover: `scaleX(0.3)` at 40% opacity |
| Desktop panel swap | Old panel fades in 150ms; new panel's pieces rise 12px and fade in over 300ms, staggered 50ms; the visual scales from 0.96 |
| Accordion height | `grid-template-rows: 0fr` → `1fr` over 300ms; the chevron rotates 180° |
| Reduced motion | The global CSS (Part 1.6) cuts every transition to 0.01ms, so all of this becomes instant |

**Why not Interactions:** the active state is decided by the script, and so are the rules ("can't close", keyboard, ARIA). Class-driven CSS transitions keep the motion and the state in one place, and they respect reduced motion through the global CSS automatically.

### Custom code (`ways_script`, last child of `ways_component`)

```html
<style>
/* ---------- Header buttons (tab / accordion header) ---------- */
.ways_h { margin: 0; font: inherit; }
.ways_tab { position: relative; width: 100%; min-height: 56px; display: flex; align-items: center; gap: 14px;
  padding: 16px 0; border: 0; background: none; text-align: left; cursor: pointer;
  font-family: var(--typography--font-display, 'Bricolage Grotesque', sans-serif); font-size: 1.25rem; font-weight: 500;
  color: var(--colors--ink-muted, #5A5F7A); transition: color 160ms ease; }
.ways_tab.is-active { color: var(--colors--ink, #14162B); cursor: default; } /* can't be closed: don't look clickable */
.ways_icon { flex: none; display: grid; color: var(--colors--brand, #0E6B47); }
.ways_chevron { flex: none; margin-left: auto; color: var(--colors--ink-muted, #5A5F7A); transition: transform 300ms ease; }
.ways_tab.is-active .ways_chevron { transform: rotate(180deg); }
.ways_tab:focus-visible { outline-offset: -3px; border-radius: 8px; }

/* The centre-out line: full width, squashed to nothing with scaleX(0);
   transform-origin: center makes it grow (and shrink) from the middle. */
.ways_tab::after { content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px;
  background: var(--colors--brand, #0E6B47); transform: scaleX(0); transform-origin: center;
  transition: transform 250ms ease-in, opacity 250ms ease-in; }
.ways_tab.is-active::after { transform: scaleX(1); opacity: 1; transition: transform 400ms cubic-bezier(.2,.7,.2,1); }
@media (hover: hover) {
  .ways_tab:not(.is-active):hover { color: var(--colors--ink, #14162B); }
  .ways_tab:not(.is-active):hover::after { transform: scaleX(0.3); opacity: 0.4; }
}

/* Chip dot */
.ways_panel-chip::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--colors--brand, #0E6B47); }

/* ---------- Accordion: height via grid rows 0fr -> 1fr ---------- */
.is-accordion .ways_panel { grid-template-rows: 0fr; visibility: hidden;
  transition: grid-template-rows 300ms ease, visibility 0s linear 300ms; }
.is-accordion .ways_panel.is-open { grid-template-rows: 1fr; visibility: visible;
  transition: grid-template-rows 300ms ease, visibility 0s; }
.ways_panels:empty { display: none; }
.is-instant, .is-instant *, .is-instant *::after { transition: none !important; } /* first frame / layout switch */

/* ---------- Desktop tabs (the script adds .is-tabs at >= 992px) ---------- */
@media (min-width: 992px) {
  .ways_tabs.is-tabs { display: grid; grid-template-columns: 28% minmax(0, 1fr); }
  .is-tabs .ways_list { border-right: 1px solid var(--colors--line, #DADDEA); }
  .is-tabs .ways_item:last-child { border-bottom: 0; }
  .is-tabs .ways_tab { padding: 28px 24px 28px 0; font-size: 1.5rem; }
  .is-tabs .ways_chevron { display: none; }
  .is-tabs .ways_panels { display: grid; align-items: center; padding: 40px 0 40px clamp(32px, 4vw, 64px); }
  .is-tabs .ways_panel { grid-area: 1 / 1; transition: opacity 150ms ease; }  /* panels share one cell */
  .is-tabs .ways_panel.is-leaving { opacity: 0; }
  .is-tabs .ways_panel-body { grid-template-columns: minmax(0, 1fr) minmax(0, .95fr); align-items: center;
    gap: clamp(32px, 4vw, 56px); padding: 4px 0; }
  .is-tabs .ways_panel-text { gap: 20px; }
  .is-tabs .ways_panel-title { display: block; font-family: var(--typography--font-display, 'Bricolage Grotesque', sans-serif);
    font-size: clamp(2.5rem, 3.4vw, 3rem); font-weight: 400; line-height: 1.05; letter-spacing: -0.02em; }
  .is-tabs .ways_cta { align-self: flex-start; }
  .is-tabs .vig.is-card { margin-left: auto; }

  /* Incoming panel: pieces rise 12px and fade in, staggered by --d; visual scales from .96. */
  .is-tabs [data-anim] { transition: opacity 300ms ease, transform 300ms cubic-bezier(.2,.7,.2,1); }
  .is-tabs [data-anim]:nth-child(2) { transition-delay: 50ms; }
  .is-tabs [data-anim]:nth-child(3) { transition-delay: 100ms; }
  .is-tabs [data-anim]:nth-child(4) { transition-delay: 150ms; }
  .is-tabs .ways_visual { transition: opacity 300ms ease 100ms, transform 300ms cubic-bezier(.2,.7,.2,1) 100ms; }
  .is-tabs .ways_panel.is-entering [data-anim] { opacity: 0; transform: translateY(12px); transition: none; }
  .is-tabs .ways_panel.is-entering .ways_visual { opacity: 0; transform: scale(.96); transition: none; }
}
</style>

<script>
(() => {
  const root = document.querySelector('[data-ways]');
  if (!root) return;
  const comp = root.querySelector('[data-comp]');
  const list = comp.querySelector('[data-list]');
  const host = comp.querySelector('[data-panels]');
  const items = [...list.querySelectorAll('[data-item]')];
  const headings = items.map((it) => it.querySelector('[data-heading]'));
  const tabs = items.map((it) => it.querySelector('[data-tab]'));
  const panels = items.map((it) => it.querySelector('[data-panel]'));
  const wide = matchMedia('(min-width: 992px)');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  let active = 0;     // the one open item
  let mode = null;    // 'tabs' | 'accordion'
  let swapTimer;

  // Skip transitions for one moment so setting the starting state doesn't animate.
  const instant = () => { comp.classList.add('is-instant'); setTimeout(() => comp.classList.remove('is-instant'), 50); };

  // ---------- Desktop: tabs pattern ----------
  function toTabs() {
    mode = 'tabs'; instant();
    comp.classList.add('is-tabs'); comp.classList.remove('is-accordion');
    list.setAttribute('role', 'tablist');
    list.setAttribute('aria-orientation', 'vertical');
    list.setAttribute('aria-labelledby', 'ways-title');
    items.forEach((item, i) => {
      item.setAttribute('role', 'presentation');      // wrappers and <h3> step aside,
      headings[i].setAttribute('role', 'presentation'); // so the tablist contains only tabs
      const tab = tabs[i], panel = panels[i];
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', String(i === active));
      tab.tabIndex = i === active ? 0 : -1;             // roving tabindex
      tab.removeAttribute('aria-expanded'); tab.removeAttribute('aria-disabled');
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      panel.inert = false;
      panel.classList.remove('is-open', 'is-leaving', 'is-entering');
      panel.hidden = i !== active;
      host.append(panel);                               // into the right-hand column
    });
  }

  // ---------- Tablet / mobile: accordion pattern ----------
  function toAccordion() {
    mode = 'accordion'; instant();
    comp.classList.add('is-accordion'); comp.classList.remove('is-tabs');
    ['role', 'aria-orientation', 'aria-labelledby'].forEach((a) => list.removeAttribute(a));
    items.forEach((item, i) => {
      item.removeAttribute('role'); headings[i].removeAttribute('role');
      const tab = tabs[i], panel = panels[i];
      ['role', 'aria-selected', 'tabindex'].forEach((a) => tab.removeAttribute(a));
      tab.setAttribute('aria-expanded', String(i === active));
      i === active ? tab.setAttribute('aria-disabled', 'true') : tab.removeAttribute('aria-disabled'); // open one can't close
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', tab.id);
      panel.classList.remove('is-leaving', 'is-entering');
      panel.hidden = false;                             // closed panels stay rendered at 0 height
      panel.classList.toggle('is-open', i === active);
      panel.inert = i !== active;                       // closed: not focusable, not read
      item.append(panel);                               // back under its header
    });
  }

  // ---------- Desktop swap: old fades out (150ms), new rises in ----------
  function swapPanels(from, to) {
    clearTimeout(swapTimer);
    panels.forEach((p, n) => { if (n !== from && n !== to) { p.hidden = true; p.classList.remove('is-leaving', 'is-entering'); } });
    const out = panels[from], incoming = panels[to];
    if (reduce.matches) { out.hidden = true; incoming.hidden = false; return; }
    out.classList.add('is-leaving');
    swapTimer = setTimeout(() => {
      out.hidden = true; out.classList.remove('is-leaving');
      incoming.classList.add('is-entering');            // start state
      incoming.hidden = false;
      void incoming.offsetWidth;                        // apply it before removing it
      incoming.classList.remove('is-entering');         // transitions run
    }, 150);
  }

  // ---------- Activate item i: the open item never closes ----------
  function activate(i, focus = false) {
    if (i === active) return;                           // re-clicking the open item: nothing happens
    const prev = active;
    active = i;
    tabs.forEach((t, n) => t.classList.toggle('is-active', n === i));
    if (mode === 'tabs') {
      tabs.forEach((t, n) => { t.setAttribute('aria-selected', String(n === i)); t.tabIndex = n === i ? 0 : -1; });
      if (focus) tabs[i].focus();
      swapPanels(prev, i);
    } else {
      tabs.forEach((t, n) => {
        t.setAttribute('aria-expanded', String(n === i));
        n === i ? t.setAttribute('aria-disabled', 'true') : t.removeAttribute('aria-disabled');
      });
      panels.forEach((p, n) => { p.classList.toggle('is-open', n === i); p.inert = n !== i; });
      // If the panel above closed and pushed this header off-screen, bring it back.
      setTimeout(() => {
        if (tabs[i].getBoundingClientRect().top < 0) {
          tabs[i].scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
        }
      }, reduce.matches ? 0 : 320);
    }
  }

  tabs.forEach((tab, i) => tab.addEventListener('click', () => activate(i)));

  // Tabs keyboard: Up/Down (wrapping), Home/End.
  list.addEventListener('keydown', (e) => {
    if (mode !== 'tabs') return;
    const last = tabs.length - 1;
    const next = { ArrowDown: active === last ? 0 : active + 1, ArrowUp: active === 0 ? last : active - 1, Home: 0, End: last }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    next === active ? tabs[active].focus() : activate(next, true);
  });

  const applyMode = () => (wide.matches ? toTabs() : toAccordion());
  applyMode();
  wide.addEventListener('change', applyMode);
})();
</script>
```

**Stagger note:** Astro staggers with a `--d` custom property per element. Webflow can't set a custom property per element without an embed, so the CSS staggers by position instead: `[data-anim]:nth-child(2)`, `(3)` and `(4)` inside `ways_panel-text`.

### Accessibility

Most of the ARIA is switched by the script. In the Designer add only:

| Element | Attribute | Value |
|---|---|---|
| section_ways | `aria-labelledby` | `ways-title` |
| section_ways | `data-ways` | `true` |
| ways_title | ID | `ways-title` |
| ways_tabs | `data-comp` | `true` |
| ways_list | `data-list` | `true` |
| ways_item (each) | `data-item` | `true` |
| ways_panel (each) | ID | `ways-panel-bugs` / `-features` / `-tests` / `-docs` / `-reviews` |
| ways_panel (each) | `data-panel` | `true` |
| ways_panel (items 2–5) | `hidden` | `hidden` (only matters before the script runs) |
| ways_panel-title, -desc, -chips, ways_cta | `data-anim` | `true` |
| ways_visual (each) | `aria-hidden` | `true` |
| ways_panels | `data-panels` | `true` |
| ways_langs-label | ID | `ways-langs-label` |
| ways_lang-list | `aria-labelledby` | `ways-langs-label` |

**What the script sets:**

| | Desktop (tabs) | Below 992px (accordion) |
|---|---|---|
| List | `role="tablist"`, `aria-orientation="vertical"` | no role |
| Wrapper and `<h3>` | `role="presentation"` | real heading |
| Button | `role="tab"`, `aria-selected`, `tabindex` 0 or −1 | `aria-expanded`; the open one also gets `aria-disabled="true"` |
| Panel | `role="tabpanel"`; inactive ones `hidden` | `role="region"`; closed ones `inert` |

### Checklist

- [ ] 1440 and 1024: tabs on the left (28%), the panel on the right with the vignette at the far right. Clicking another tab: the old panel fades, and the new one rises in piece by piece.
- [ ] The line grows from the centre outward, and shrinks back to the centre on the tab you left.
- [ ] Click the open tab: nothing moves. The cursor over it is the plain arrow.
- [ ] Keyboard at Desktop: Tab lands on the active tab only. Down/Up move and activate, and wrap at the ends; Home/End jump. The next Tab goes into the panel (the CTA).
- [ ] 768 and 375: an accordion. Opening an item closes the previous one with a smooth height change, the chevron flips, and the big title is hidden. The CTA is full width with the vignette below.
- [ ] Open the last item, scroll down, then open the first: the page scrolls its header back into view.
- [ ] Keyboard at mobile: Tab goes header → the open panel's CTA → the next headers, and skips closed panels. Enter or Space opens an item.
- [ ] Screen reader at mobile: the open header reads "expanded, dimmed/unavailable"; the others read "collapsed".
- [ ] Resize from Desktop to mobile and back without reloading: the same item stays open.
- [ ] Reduced motion: the line and panels switch instantly.
- [ ] 375: the language chips scroll sideways in one row; no sideways page scroll.

---

## Part 2.3: Paths

**Background:** changes per path (path-earn-bg → path-grow-bg → path-ship-bg).

| Breakpoint | Behaviour | Built with |
|---|---|---|
| Desktop | The section is 300vh tall; a sticky wrapper holds the content on screen while scrolling switches the path, swaps the media and card, changes the background and grows the line | Native: `position: sticky` + "While scrolling in view" Interaction |
| Tablet and smaller | One media card above a swipeable row of path cards. Scroll-snap, mouse drag, segment buttons, prev/next; the background follows the active card | Native scroll-snap + custom code |
| Desktop + reduced motion | No pinning: three stacked rows, each on its own background | Custom CSS |

### Element tree

```
section_paths (Section, id: paths)                         [aria-labelledby, data-paths, data-active=0]
└─ paths_pin (Div)
   └─ padding-global
      └─ container-large
         └─ paths_component (Div, Grid)
            ├─ paths_intro (Div)
            │  ├─ paths_title (H2, id: paths-title)
            │  │  ├─ paths_title-line (Text Span): "One platform."
            │  │  └─ paths_title-line (Text Span): "Three paths."
            │  └─ paths_lede (Paragraph)
            ├─ paths_bg-list (Div)                          [aria-hidden=true]  reduced-motion only
            │  └─ paths_row-bg (Div) + is-earn / is-grow / is-ship
            ├─ paths_media-list (Div, Grid)
            │  └─ paths_media (Div) + is-earn / is-grow / is-ship   [data-media]
            │     ├─ sr-only (Paragraph): text summary of the vignette
            │     ├─ paths_media-stage (Div)                [aria-hidden=true]
            │     │  └─ vig (Div): see "Vignettes"
            │     └─ paths_media-text (Div)
            │        ├─ paths_media-caption (Paragraph)
            │        └─ paths_media-sub (Paragraph)
            ├─ paths_card-list (Div)                        [carousel attrs, data-track]
            │  └─ paths_card (Div, tag: article) + is-earn / is-grow / is-ship   [slide attrs, data-card]
            │     ├─ paths_card-meta (Div)
            │     │  ├─ paths_card-num (Text Block): "01"
            │     │  ├─ paths_line (Div)                    [aria-hidden=true]
            │     │  │  └─ paths_line-fill (Div)
            │     │  └─ paths_card-label (Text Block): "Earn"
            │     ├─ paths_card-title (H3): "Earn"
            │     ├─ paths_card-quote (Block Quote)
            │     │  ├─ paths_card-mark (Code Embed: quote SVG)
            │     │  └─ paths_card-quote-text (Paragraph)
            │     ├─ paths_card-who (Paragraph)
            │     └─ paths_card-body (Paragraph)
            ├─ paths_live (Paragraph) + sr-only              [aria-live=polite, data-live]
            └─ paths_controls (Code Embed: buttons, CSS, script; see "Custom code")   ← must be last
```

**Why `paths_line-fill` is a real element:** Astro draws the line's fill with `::after` and scales it with a CSS variable. Webflow Interactions can only animate elements you can select, so the fill is a child div.

**Quote mark SVG** (`paths_card-mark`):

```html
<svg class="paths_card-mark" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path fill="currentColor" d="M4 18v-5.5C4 8.4 6.4 6 10 5.5V8c-2 .5-3 1.8-3 4h3v6H4zm10 0v-5.5c0-4.1 2.4-6.5 6-7V8c-2 .5-3 1.8-3 4h3v6h-6z"/></svg>
```

### Vignettes (inside `paths_media-stage`)

Small white "app" panels. They're decorative (`aria-hidden` on the stage), and each media item has an `sr-only` summary instead.

```
Earn                                   Grow                                   Ship
vig                                    vig                                    vig
├─ vig_head                            ├─ vig_head + is-code                  ├─ vig_title: "Add timeouts to agent tool calls"
│  ├─ "Payout history"                 │  ├─ "nav/avoid.py"                   ├─ vig_ai (Paragraph)
│  └─ vig_tag: "via PayPal"            │  └─ vig_plus: "+2"                   │  ├─ "AI suggested price: "
└─ vig_rows (List)                     ├─ vig_diff                            │  ├─ vig_ai-strong (Bold): "$280–$360"
   └─ vig_row × 3                      │  └─ vig_line × 4 (+ is-add on 2, 3) │  └─ " based on complexity"
      ├─ vig_pr: "PR #512 merged"      │     ├─ vig_sign: " " or "+"         ├─ vig_posted
      └─ vig_amount: "+$400.00"        │     └─ vig_code: code text           │  ├─ "Bounty posted"
                                       └─ vig_bubble                          │  └─ vig_posted-amount: "$320"
                                          ├─ vig_bubble-label: "AI review"    └─ vig_counter
                                          └─ Paragraph                           ├─ vig_avatar: "A"
                                                                                 ├─ vig_counter-text: "amara-o countered $340"
                                                                                 └─ vig_chips
                                                                                    ├─ vig_chip + is-accept: "Accept"
                                                                                    └─ vig_chip: "Decline"
```

| Class | Styles |
|---|---|
| `vig` | Padding 14px 16px · Background surface · Radius 12px · Colour ink · Size 0.875rem · Shadow 0 20px 40px −24px rgba(20,22,43,0.8) |
| `vig_head` | Flex · Space between · Align center · Gap 12px · Padding bottom 10px · Border bottom 1px line · Weight 600 |
| `vig_head` + `is-code` | Font font-code · Weight 500 · Size 0.8125rem · Colour ink-muted |
| `vig_tag` | Padding 2px 8px · Radius pill · Background canvas · Size 0.75rem · Weight 500 · Colour ink-muted |
| `vig_plus` | Colour payout |
| `vig_rows` | No list style · Padding 0 · Margin 0 |
| `vig_row` | Flex · Space between · Padding 10px 0 · Border bottom 1px line (last one: none; use the `:last-child` state in the selector menu) |
| `vig_pr` | Colour ink-muted |
| `vig_amount` | Font font-code · Weight 600 · Colour payout |
| `vig_diff` | Margin top 10px · Font font-code · Size 0.8125rem · Line height 1.9 · Radius 6px · Overflow hidden |
| `vig_line` | Grid, columns `1.6em 1fr` · Padding right 8px · White space pre |
| `vig_line` + `is-add` | Background payout-tint |
| `vig_sign` | Text align center · Colour ink-muted (`is-add` → payout) |
| `vig_bubble` | Margin top 12px · Padding 10px 12px · Radius 10px · Background brand-tint · Size 0.8125rem · Line height 1.45 |
| `vig_bubble-label` | Block · Margin bottom 2px · Size 0.6875rem · Weight 600 · Letter spacing 0.06em · Uppercase · Colour brand |
| `vig_title` | Font font-display · Size 1rem · Weight 600 |
| `vig_ai` | Margin top 8px · Padding 8px 10px · Radius 8px · Background brand-tint · Size 0.8125rem |
| `vig_ai-strong` | Colour brand |
| `vig_posted` | Margin top 10px · Flex · Space between · Padding 8px 0 · Border top and bottom 1px line · Colour ink-muted |
| `vig_posted-amount` | Font font-code · Weight 600 · Colour ink |
| `vig_counter` | Margin top 10px · Flex, wrap · Align center · Gap 8px · Size 0.8125rem |
| `vig_avatar` | 22 × 22px · Radius 50% · Grid centred · Background brand-tint · Colour brand · Size 0.6875rem · Weight 700 |
| `vig_chips` | Margin left auto · Flex · Gap 6px |
| `vig_chip` | Padding 3px 10px · Radius pill · Border 1px line · Size 0.75rem · Weight 600 · Colour ink-muted |
| `vig_chip` + `is-accept` | Border transparent · Background payout-tint · Colour payout |

**Grow diff lines** (`vig_sign` / `vig_code`):

| Sign | Code | Combo |
|---|---|---|
| (space) | `scan = lidar.latest()` | |
| `+` | `if scan is None:` | is-add |
| `+` | `    return Stop()` | is-add |
| (space) | `return plan_path(scan)` | |

### Styles per breakpoint

**Desktop (base)**

| Class | Styles |
|---|---|
| `section_paths` | Position relative · **Height 300vh** · Background path-earn-bg (the Interaction changes it) · Colour surface |
| `paths_pin` | **Position sticky, top 0** · Height `100dvh` (fallback 100vh) · Flex · Align center · Overflow hidden |
| `paths_pin` > `padding-global` | Width 100% (it's a flex child now) |
| `paths_component` | Grid, 3 columns `0.85fr 1fr 1fr` · Gap `clamp(24px, 3vw, 48px)` (fallback 40px) · Align items center |
| `paths_title` | Colour surface · Weight 600 |
| `paths_title-line` | Display block |
| `paths_lede` | Margin top 16px · Max width 28rem · Size 1.0625rem · Colour on-dark-muted |
| `paths_bg-list` | Display none |
| `paths_media-list` | Grid, 1 column. Set **every `paths_media` to row 1 / col 1** (Manual) so they stack |
| `paths_media` | Flex vertical · Gap 20px · Padding `clamp(16px, 2vw, 24px)` · Background on-dark-surface · Border 1px on-dark-line · Radius radius-lg |
| `paths_media-stage` | Flex grow 1 · Grid · Align center |
| `paths_media-caption` | Font font-display · Size `clamp(1.25rem, 1.1rem + 0.5vw, 1.5rem)` (fallback 1.5rem) · Weight 500 · Line height 1.2 · Colour surface |
| `paths_media-sub` | Margin top 4px · Size 0.9375rem · Colour on-dark-muted |
| `paths_card-list` | Grid, 1 column. Set **every `paths_card` to row 1 / col 1** (Manual) |
| `paths_card` | Flex vertical · Padding `clamp(20px, 2.4vw, 32px)` (fallback 32px) · Background on-dark-surface · Border 1px on-dark-line · Radius radius-lg |
| `paths_card-meta` | Flex · Align center · Gap 12px · Padding bottom 18px · Border bottom 1px on-dark-line · Size 0.875rem |
| `paths_card-num` | Font font-code · Weight 500 |
| `paths_line` | Position relative · Flex grow 1 · Height 1px · Overflow hidden · Background on-dark-line |
| `paths_line-fill` | Position absolute, Full (inset 0) · Background surface · **Transform origin: left center** (Style panel → Transforms → settings) |
| `paths_card-title` | Margin top 20px · Font font-display · Size `clamp(2.5rem, 1.9rem + 2.4vw, 4rem)` (fallback 4rem) · Weight 400 · Line height 1 · Letter spacing −0.02em |
| `paths_card-quote` | Margin top 20px · Grid, columns `auto 1fr` · Gap 12px · Size 1.0625rem · Line height 1.5 · Padding 0 · Border none |
| `paths_card-mark` | Colour brand-tint · Margin top 2px |
| `paths_card-who` | Margin top 10px · Padding left 34px, bottom 20px · Border bottom 1px on-dark-line · Size 0.8125rem · Colour on-dark-muted |
| `paths_card-body` | Margin top 20px · Size 0.9375rem · Line height 1.55 · Colour on-dark-muted |
| `paths_controls` | No styles. Its bar starts with `hidden`, and the script shows it only below 992px |

The Interaction sets every opacity and the line scale, so leave those at their defaults in the Style panel.

**Sticky gotcha:** `position: sticky` stops working if *any* ancestor has `overflow: hidden` (or auto). Check `page-wrapper`, `main-wrapper` and `section_paths`: their overflow must be Visible. That's why the global CSS uses `overflow: clip` on the hero only, never on wrappers.

**Tablet**

| Class | Changes |
|---|---|
| `section_paths` | Height auto · Padding top/bottom `clamp(64px, 10vw, 112px)` (fallback 88px) |
| `paths_pin` | Position static · Height auto · Display block · Overflow visible |
| `paths_component` | 1 column · Gap `clamp(28px, 5vw, 40px)` (fallback 36px) |
| `paths_card-list` | **Flex**, horizontal, no wrap · Gap 14px · Overflow: scroll horizontally · Margin left/right `-32px` · Padding 4px 32px (the negative margin lets the row run edge to edge) · Custom properties: `scroll-snap-type: x mandatory`, `scroll-padding-inline: 32px`, `overscroll-behavior-x: contain` |
| `paths_card` | Width `min(86%, 440px)` · Flex shrink 0 · Custom property `scroll-snap-align: start` |
| `paths_card-title` | Size fallback 3rem |

**Mobile landscape**

| Class | Changes |
|---|---|
| `paths_card-list` | Margin left/right −24px · Padding 4px 24px · `scroll-padding-inline: 24px` |

**Mobile portrait**

| Class | Changes |
|---|---|
| `paths_card-list` | Margin left/right −16px · Padding 4px 16px · `scroll-padding-inline: 16px` |
| `paths_card-title` | Size fallback 2.5rem |

These margins and paddings equal `content-pad` at each breakpoint. If your content-pad variable holds the `clamp()`, use `calc(-1 * <variable>)` instead of fixed numbers.

### Content

- **H2:** One platform. / Three paths.
- **Lede:** Pick the one that fits where you are. Every path ends with merged code and a fair payout.

| | Earn (01) | Grow (02) | Ship (03) |
|---|---|---|---|
| Media caption | Earning on merge. | Learning in public. | Clearing the backlog. |
| Media sub | Paid bounties | Portfolio-building bounties | For maintainers and startups |
| `sr-only` summary | Example payout history: three merged pull requests paid $400, $150 and $900 via PayPal. | Example AI review on a small fix to a robot's obstacle avoidance, asking for one more test before the bounty requirements are met. | Example bounty for adding timeouts to AI agent tool calls: AI suggested $280 to $360, it was posted at $320, and a contributor countered at $340. |
| Quote | "I pick up robotics bounties between client projects. It's the most predictable income I have." | "Every AI review taught me something. Six months of merged simulation tests got me my first robotics job." | "The AI suggested a fair price, a contributor countered, and the fix shipped in two days." |
| Who | Kenji T. · Japan · Robotics, C++ | Sofia R. · Mexico · Robotics, Python | Daniel K. · Germany · CTO, AI agents startup |
| Body | You already know how to ship. Earn turns your skills into a payout for every merged pull request. No proposals, no invoices, no chasing clients. | Start with beginner-friendly bounties and get AI feedback on every pull request. Build a public record of merged work that hiring managers can actually check. | Review one verified pull request, not ten. Each bounty goes to one contributor at a time, AI checks their PR against your brief and tests before you look, and payouts go out via PayPal only when you merge. |

- **Earn vignette rows:** PR #512 merged +$400.00 · PR #498 merged +$150.00 · PR #476 merged +$900.00
- **Grow bubble:** Nice fix. Add a test for the dropped-frame case and this meets the bounty.

The testimonials are sample demo content, not real customers.

### Interactions (Desktop): "While scrolling in view"

**How the numbers work.** "While scrolling in view" runs from 0%, when the section's top enters the bottom of the screen, to 100%, when its bottom leaves the top. With a 300vh section and a 100vh screen that's 400vh of scrolling:

- 0–25%: the section scrolls into place.
- **25%–75%: pinned.**
- 75–100%: it scrolls away.

Each path gets a third of the pinned stretch:

| Path | Timeline range |
|---|---|
| Earn | 25% – 41.7% |
| Grow | 41.7% – 58.3% |
| Ship | 58.3% – 75% |

**Set up:**

1. Select `section_paths` → **Interactions panel → Element trigger → Scroll → "While scrolling in view"**.
2. **Breakpoints:** Desktop only (untick Tablet and both Mobile). The carousel takes over below 992px.
3. Create a new animation, "Paths scroll". Set Smoothing to 20% (the default 50% lags behind the scroll).
4. For every action, target **Element** and pick the exact element (not "Class"), because the three media and cards share a base class.

**Keyframes.** Each swap fades over a 3% window around the switch point (≈12vh of scrolling).

| Target | Action | Keyframes (position: value) |
|---|---|---|
| section_paths | Background colour | 0%: path-earn-bg · 40%: path-earn-bg · 43.3%: path-grow-bg · 56.7%: path-grow-bg · 60%: path-ship-bg |
| paths_media is-earn | Opacity | 0%: 100 · 40%: 100 · 43.3%: 0 |
| paths_media is-grow | Opacity | 0%: 0 · 40%: 0 · 43.3%: 100 · 56.7%: 100 · 60%: 0 |
| paths_media is-ship | Opacity | 0%: 0 · 56.7%: 0 · 60%: 100 |
| paths_card is-earn | Opacity | same as media is-earn |
| paths_card is-grow | Opacity | same as media is-grow |
| paths_card is-ship | Opacity | same as media is-ship |
| paths_line-fill (Earn card) | Scale X | 0%: 0 · 25%: 0 · 41.7%: 1 |
| paths_line-fill (Grow card) | Scale X | 0%: 0 · 41.7%: 0 · 58.3%: 1 |
| paths_line-fill (Ship card) | Scale X | 0%: 0 · 58.3%: 0 · 75%: 1 |

**Optional polish** (matches Astro's motion):

| Target | Action | Keyframes |
|---|---|---|
| Each incoming `paths_media-stage` | Scale | 96% at the start of its window → 100% at the end |
| Each incoming card's title, quote, who, body | Move Y | 14px → 0. Stagger the end keyframes by 0.5% each so they arrive one after another |

**How this differs from Astro.** In Astro the background *fades over 600ms* once a path becomes active, whatever your scroll speed. Here the fade is tied to scroll position: scroll slowly and it fades slowly. It looks the same at normal scrolling speed.

If you want time-based fades instead, use three invisible 100vh "marker" divs inside the section, each with a "Scroll into view" trigger that plays a 600ms timed animation. That's more setup, so the scroll-linked version is the default here.

### Custom code: Tablet carousel and reduced-motion fallback

One Code Embed `paths_controls`, placed as the **last child** of `paths_component` (after `paths_live`). It holds the controls' markup, all of Paths' custom CSS, and the carousel script.

```html
<div class="paths_controls-bar" data-controls hidden>
  <button class="paths_btn" type="button" aria-label="Previous path" data-prev>
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M15 6l-6 6 6 6"/></svg>
  </button>
  <div class="paths_segs" data-segs></div>
  <p class="paths_counter" aria-hidden="true"><span data-counter>01</span> / 03</p>
  <button class="paths_btn" type="button" aria-label="Next path" data-next>
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9 6l6 6-6 6"/></svg>
  </button>
</div>

<style>
/* ---------- Controls (shown by the script below 992px) ---------- */
.paths_controls-bar { display: flex; align-items: center; gap: 16px; }
.paths_btn { flex: none; display: grid; place-items: center; width: 44px; height: 44px; padding: 0; cursor: pointer;
  border: 1px solid var(--colors--on-dark-line, rgba(255,255,255,.12)); border-radius: 50%;
  background: var(--colors--on-dark-surface, rgba(255,255,255,.06)); color: var(--colors--surface, #FFF); }
.paths_btn:disabled { opacity: 0.4; cursor: not-allowed; }
.paths_segs { flex: 1; display: flex; gap: 6px; }
/* 28px-tall hit area, 3px visible bar. Inactive bars are 40% white (3:1 on all three backgrounds). */
.paths_seg { position: relative; flex: 1; height: 28px; padding: 0; border: 0; background: transparent; cursor: pointer; }
.paths_seg::before { content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 3px; margin-top: -1.5px;
  border-radius: 999px; background: var(--colors--on-dark-control, rgba(255,255,255,.4)); transition: background-color 300ms ease; }
.paths_seg[aria-current="true"]::before { background: var(--colors--surface, #FFF); }
.paths_counter { flex: none; margin: 0; font-family: var(--typography--font-code, 'IBM Plex Mono', monospace);
  font-size: 0.875rem; color: var(--colors--on-dark-muted, rgba(255,255,255,.72)); }
.paths_counter span { color: var(--colors--surface, #FFF); }

/* ---------- Tablet & mobile carousel ----------
   !important beats any inline styles the desktop Interaction left behind
   (e.g. after resizing a desktop window down). */
@media (max-width: 991px) {
  .section_paths { transition: background-color 600ms ease;
    background-color: var(--colors--path-earn-bg, #0B3B2C) !important; }
  .section_paths[data-active="1"] { background-color: var(--colors--path-grow-bg, #102F3A) !important; }
  .section_paths[data-active="2"] { background-color: var(--colors--path-ship-bg, #3A2A0E) !important; }

  /* Only the active media card shows; it wipes in from the top. */
  .paths_media { transition: opacity 400ms ease; }
  .paths_media.is-active { opacity: 1 !important; }
  .paths_media:not(.is-active) { opacity: 0 !important; pointer-events: none; }
  .paths_media-stage { clip-path: inset(0 0 0 0 round 12px);
    transition: opacity 500ms ease, transform 600ms cubic-bezier(.2,.7,.2,1), clip-path 600ms cubic-bezier(.2,.7,.2,1); }
  .paths_media:not(.is-active) .paths_media-stage { opacity: 0; transform: scale(.96); clip-path: inset(0 0 100% 0 round 12px); }
  .paths_media-caption, .paths_media-sub { transition: opacity 400ms ease, transform 400ms ease; }
  .paths_media.is-active .paths_media-caption { transition-delay: 250ms; }
  .paths_media.is-active .paths_media-sub { transition-delay: 370ms; }
  .paths_media:not(.is-active) .paths_media-caption,
  .paths_media:not(.is-active) .paths_media-sub { opacity: 0; transform: translateY(10px); }

  /* All path cards visible in the row; lines full. */
  .paths_card { opacity: 1 !important; transform: none !important; }
  .paths_line-fill { transform: none !important; }

  .paths_card-list:focus-visible { outline-offset: -3px; border-radius: 8px; }
  .paths_card-list.is-dragging { cursor: grabbing; user-select: none; scroll-snap-type: none; }
}
@media (max-width: 991px) and (hover: hover) and (pointer: fine) {
  .paths_card-list[tabindex] { cursor: grab; }
}

/* ---------- Desktop + reduced motion: three static rows ----------
   Same idea as Astro: the list wrappers "disappear" (display: contents) so the
   media and cards become direct grid items and can be placed row by row.
   !important is needed to beat the Interaction's inline styles and Webflow's
   manual grid placement (which uses ID selectors). */
@media (min-width: 992px) and (prefers-reduced-motion: reduce) {
  .section_paths { height: auto !important; overflow-x: clip;
    background-color: var(--colors--ink, #14162B) !important; }
  .paths_pin { position: static !important; height: auto !important; display: block !important; }
  .paths_component { grid-template-columns: minmax(0,1fr) minmax(0,1fr) !important; row-gap: 0 !important; align-items: start !important; }
  .paths_intro { grid-column: 1 / -1 !important; grid-row: 1 !important; padding: clamp(80px, 8vw, 112px) 0 56px; }
  .paths_bg-list, .paths_media-list, .paths_card-list { display: contents !important; }

  /* Full-width colour band behind each row. */
  .paths_row-bg { display: block !important; grid-column: 1 / -1 !important; margin-inline: calc(50% - 50vw); }
  .paths_row-bg.is-earn { grid-row: 2 !important; background: var(--colors--path-earn-bg, #0B3B2C); }
  .paths_row-bg.is-grow { grid-row: 3 !important; background: var(--colors--path-grow-bg, #102F3A); }
  .paths_row-bg.is-ship { grid-row: 4 !important; background: var(--colors--path-ship-bg, #3A2A0E); }

  .paths_media, .paths_card { position: relative; z-index: 1; margin-block: 56px;
    opacity: 1 !important; transform: none !important; }
  .paths_media { grid-column: 1 !important; }
  .paths_card { grid-column: 2 !important; }
  .paths_media.is-earn, .paths_card.is-earn { grid-row: 2 !important; }
  .paths_media.is-grow, .paths_card.is-grow { grid-row: 3 !important; }
  .paths_media.is-ship, .paths_card.is-ship { grid-row: 4 !important; }
  .paths_media *, .paths_card * { opacity: 1 !important; transform: none !important; }
  .paths_line-fill { transform: none !important; }
}
</style>

<script>
(() => {
  const section = document.querySelector('[data-paths]');
  if (!section) return;
  const track = section.querySelector('[data-track]');
  const cards = [...section.querySelectorAll('[data-card]')];
  const medias = [...section.querySelectorAll('[data-media]')];
  const controls = section.querySelector('[data-controls]');
  const prev = section.querySelector('[data-prev]');
  const next = section.querySelector('[data-next]');
  const counter = section.querySelector('[data-counter]');
  const live = section.querySelector('[data-live]');
  const narrow = matchMedia('(max-width: 991px)');           // desktop is the Interaction's job
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const count = cards.length;
  let active = -1;

  // One segment button per card, labelled from the card's data-label.
  const segs = cards.map((card, n) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'paths_seg';
    b.setAttribute('aria-label', `Go to path ${n + 1}: ${card.dataset.label}`);
    b.addEventListener('click', () => goTo(n));
    section.querySelector('[data-segs]').append(b);
    return b;
  });

  // Make path i active: data-active drives the background in CSS; .is-active
  // shows the matching media card; segments, counter and buttons follow.
  function setActive(i, announce = false) {
    if (i !== active) {
      active = i;
      section.dataset.active = String(i);
      cards.forEach((c, n) => c.classList.toggle('is-active', n === i));
      medias.forEach((m, n) => m.classList.toggle('is-active', n === i));
      segs.forEach((s, n) => n === i ? s.setAttribute('aria-current', 'true') : s.removeAttribute('aria-current'));
      counter.textContent = String(i + 1).padStart(2, '0');
    }
    prev.disabled = i === 0;
    next.disabled = i === count - 1;
    // Announce only when the user pressed a button or key (not on swipe).
    if (announce) live.textContent = `Path ${i + 1} of ${count}: ${cards[i].dataset.label}`;
  }

  // Scroll the row so card i sits at the padded start edge.
  function goTo(i, announce = true) {
    const target = Math.max(0, Math.min(count - 1, i));
    const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    track.scrollTo({ left: cards[target].offsetLeft - pad, behavior: reduce.matches ? 'auto' : 'smooth' });
    setActive(target, announce);
  }

  prev.addEventListener('click', () => goTo(active - 1));
  next.addEventListener('click', () => goTo(active + 1));
  track.addEventListener('keydown', (e) => {
    if (!narrow.matches) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(active + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(active - 1); }
  });

  // Swipes and scroll-snap: the most visible card (over 55%) becomes active.
  const ratios = new Map();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => ratios.set(e.target, e.intersectionRatio));
    if (!narrow.matches) return;
    let best = -1, bestRatio = 0.55;
    cards.forEach((c, n) => { const r = ratios.get(c) || 0; if (r > bestRatio) { bestRatio = r; best = n; } });
    if (best !== -1) setActive(best);
  }, { root: track, threshold: [0, 0.25, 0.5, 0.6, 0.75, 0.9, 1] });
  cards.forEach((c) => io.observe(c));

  // Mouse drag-to-scroll (touch already scrolls natively). Snapping is off while
  // dragging (.is-dragging), then the row settles on the nearest card.
  let drag = null;
  track.addEventListener('pointerdown', (e) => {
    if (!narrow.matches || e.pointerType !== 'mouse' || e.button !== 0) return;
    drag = { x: e.clientX, left: track.scrollLeft, id: e.pointerId, moved: false };
  });
  track.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 4) {          // 4px threshold: a click stays a click
      drag.moved = true;
      track.setPointerCapture(drag.id);
      track.classList.add('is-dragging');
    }
    if (drag.moved) track.scrollLeft = drag.left - dx;
  });
  const endDrag = () => {
    if (!drag) return;
    const moved = drag.moved;
    drag = null;
    if (!moved) return;
    track.classList.remove('is-dragging');
    const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    let nearest = 0;
    cards.forEach((c, n) => {
      if (Math.abs(c.offsetLeft - pad - track.scrollLeft) < Math.abs(cards[nearest].offsetLeft - pad - track.scrollLeft)) nearest = n;
    });
    goTo(nearest, false);
  };
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);

  // Carousel on/off when the window crosses 992px.
  function applyMode() {
    controls.hidden = !narrow.matches;
    if (narrow.matches) {
      track.tabIndex = 0;              // focusable so arrow keys work
      track.scrollLeft = 0;
      active = -1;
      setActive(0);
    } else {
      track.removeAttribute('tabindex');
      delete section.dataset.active;   // the Interaction owns the background on desktop
    }
  }
  applyMode();
  narrow.addEventListener('change', applyMode);
})();
</script>
```

**Why the background works differently per breakpoint.** On Desktop the Interaction writes the background colour inline, based on scroll position. Below 992px the Interaction is off, the script sets `data-active="0|1|2"` on the section, and the CSS maps that to a colour with a 600ms transition. That's the same mechanism as Astro on every breakpoint.

### Accessibility

| Element | Attribute | Value |
|---|---|---|
| section_paths | `aria-labelledby` | `paths-title` |
| section_paths | `data-paths` | `true` |
| paths_title | ID | `paths-title` |
| paths_bg-list | `aria-hidden` | `true` |
| paths_media (each) | `data-media` | `true` |
| paths_media-stage (each) | `aria-hidden` | `true` |
| paths_card-list | `role` | `region` |
| paths_card-list | `aria-roledescription` | `carousel` |
| paths_card-list | `aria-label` | `Fairmerge paths` |
| paths_card-list | `data-track` | `true` |
| paths_card (each) | `role` | `group` |
| paths_card (each) | `aria-roledescription` | `slide` |
| paths_card (each) | `aria-label` | `1 of 3: Earn` / `2 of 3: Grow` / `3 of 3: Ship` |
| paths_card (each) | `data-card` | `true` |
| paths_card (each) | `data-label` | `Earn` / `Grow` / `Ship` |
| paths_line (each) | `aria-hidden` | `true` |
| paths_live | `aria-live` | `polite` |
| paths_live | `data-live` | `true` |

The script sets `tabindex="0"` on the card list below 992px only; don't add it in Designer.

### Checklist

- [ ] 1440 × 900: scroll into the section; it pins at the top. Earn → Grow → Ship switch at about a third and two thirds of the pinned scroll, and the background fades to each colour. The active card's line fills from left to right and resets on the next path.
- [ ] At the end of the pinned stretch the next section follows with no jump or gap. Scrolling back up reverses everything.
- [ ] If it doesn't pin: check every ancestor's overflow (see "Sticky gotcha").
- [ ] Reduced motion at 1440: no pinning; three rows, each on its own colour band; all lines full.
- [ ] 768 and 375: one media card on top, swipeable cards below. Swipe → background, media, counter and segment follow. Prev/next, segments and arrow keys each move one card, and the end buttons disable.
- [ ] Mouse drag at 768: dragging 60% of a card goes to the next one; a short drag snaps back; a plain click does nothing.
- [ ] Screen reader: pressing Next announces "Path 2 of 3: Grow"; swiping announces nothing.
- [ ] Resize from desktop to tablet without reloading: the carousel and background still work. If anything looks stuck, reload. Interactions only re-initialise on load.

---

## Part 2.4: BountyBoard

**Background:** canvas.

- The bounties come from a CMS Collection, and the filters combine language and difficulty.
- Each card has an inline counter-offer form (demo only, nothing is sent).
- Desktop shows a 3-column grid; Tablet and smaller show a scroll-snap carousel.

### CMS Collection: "Bounties"

**CMS panel → Create collection → "Bounties"** (singular item name "Bounty").

| Field | Webflow type | Required | Notes |
|---|---|---|---|
| Name | Plain text (built-in) | ✓ | The bounty title |
| Slug | Slug (built-in) | ✓ | Used to build unique IDs for the counter-offer form |
| Repo | Plain text | ✓ | e.g. `openarm/motion-planner` |
| Description | Plain text | ✓ | One or two sentences; the card clamps to 2 lines |
| Domain | Option: Robotics, Space, AI agents | ✓ | Tinted tag |
| Language | Option: C++, Python, Rust, Go, TypeScript | ✓ | Filter + tag. Add options as needed; the chips update on their own |
| Type | Option: Bug fix, Tests, Performance, Feature, Docs, Accessibility | ✓ | Tag |
| Difficulty | Option: Beginner, Intermediate, Advanced | ✓ | Filter + meta |
| Estimate | Plain text | ✓ | e.g. `~12 hrs` |
| Price | Number (integer, min 1) | ✓ | Dollars, no symbol |
| Fair range min | Number (integer) | ✓ | |
| Fair range max | Number (integer) | ✓ | Above this the "less often" note appears |
| Fair range label | Plain text | ✓ | e.g. `$800–$1,050`. Number fields can't show thousands separators, so the display text is its own field |
| Claim URL | Link | | Where "Claim bounty" goes (defaults to `#`) |
| Sort order | Number | | Controls the card order |

**Option fields and custom attributes:** the filters read `data-language` and `data-difficulty` from each card, bound to these fields. If the custom-attribute binding menu doesn't offer Option fields in your Designer, change Language and Difficulty to **Plain text** and type the values exactly as listed (case matters).

**Items** (sample demo content; fictional repositories):

| Name | Repo | Domain | Language | Type | Difficulty | Estimate | Price | Min | Max | Range label | Sort |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Fix arm jitter near joint limits | openarm/motion-planner | Robotics | C++ | Bug fix | Advanced | ~12 hrs | 900 | 800 | 1050 | $800–$1,050 | 1 |
| Add tests for obstacle-avoidance edge cases | trailbot/nav-stack | Robotics | Python | Tests | Beginner | ~3 hrs | 150 | 120 | 180 | $120–$180 | 2 |
| Speed up satellite orbit propagation | orbitkit/propagator | Space | Rust | Performance | Advanced | ~10 hrs | 850 | 750 | 1000 | $750–$1,000 | 3 |
| Decode CubeSat telemetry frames | groundlink/telemetry | Space | Go | Feature | Intermediate | ~6 hrs | 400 | 350 | 450 | $350–$450 | 4 |
| Add timeouts and retries to agent tool calls | relaykit/agents | AI agents | TypeScript | Feature | Intermediate | ~5 hrs | 320 | 280 | 360 | $280–$360 | 5 |
| Write a guide to building a custom agent tool | taskpilot/core | AI agents | Python | Docs | Beginner | ~3 hrs | 180 | 150 | 210 | $150–$210 | 6 |

**Descriptions:**

1. The 6-axis arm oscillates when a target sits close to a joint limit. Smooth the IK solver output and add a simulation test.
2. Cover glass walls, people walking past, and dropped lidar frames in the simulated test suite.
3. Batch the SGP4 step so 10,000 satellites update in under a second. Include before-and-after benchmarks.
4. Parse AX.25 beacon frames from a 3U CubeSat into typed fields, using the sample captures as fixtures.
5. Agents hang when a tool never responds. Add per-tool timeouts, backoff, and an error message the agent can act on.
6. Walk through one tool end to end: its schema, the handler, tests, and how the agent decides when to call it.

### Element tree

```
section_board (Section, id: bounties)                     [aria-labelledby, data-board]
└─ padding-global
   └─ container-large
      └─ padding-section-large
         └─ board_component (Div)
            ├─ board_header (Div, Grid)
            │  ├─ board_intro (Div)
            │  │  ├─ board_title (H2, id: board-title)
            │  │  │  ├─ board_title-line (Text Span): "Open bounties,"
            │  │  │  └─ board_title-line (Text Span): "live now."
            │  │  └─ board_lede (Paragraph)
            │  └─ button is-secondary (Link Block → #): "See all 24 bounties" + button_icon
            ├─ board_filters (Div, Grid)
            │  ├─ board_filter (Div)                       [role=group, aria-labelledby=filter-language]
            │  │  ├─ board_filter-label (Text Block, id: filter-language): "Language"
            │  │  └─ board_chips (Div)                     [data-filter-group=language]  ← chips built by script
            │  └─ board_filter (Div)                       [role=group, aria-labelledby=filter-difficulty]
            │     ├─ board_filter-label (Text Block, id: filter-difficulty): "Difficulty"
            │     └─ board_chips (Div)                     [data-filter-group=difficulty]
            ├─ board_count (Paragraph) + sr-only           [aria-live=polite, data-count]
            ├─ board_list-wrapper (Collection List Wrapper → Bounties)   [data-track]
            │  └─ board_list (Collection List)
            │     └─ board_item (Collection Item)          [data-card, data-language ← Language, data-difficulty ← Difficulty]
            │        └─ board_card (Div, tag: article)
            │           ├─ board_card-tags (List, unordered)
            │           │  ├─ tag is-domain (List Item) ← Domain
            │           │  ├─ tag (List Item) ← Language
            │           │  └─ tag (List Item) ← Type
            │           ├─ board_card-repo (Text Block) ← Repo
            │           ├─ board_card-title (H3) ← Name
            │           ├─ board_card-desc (Paragraph) ← Description
            │           ├─ board_card-meta (List, unordered)
            │           │  ├─ board_card-meta-item (List Item)
            │           │  │  ├─ Code Embed: level icon
            │           │  │  ├─ sr-only (Text Span): "Difficulty: "
            │           │  │  └─ Text Span ← Difficulty
            │           │  └─ board_card-meta-item (List Item)
            │           │     ├─ Code Embed: clock icon
            │           │     ├─ sr-only (Text Span): "Estimate: "
            │           │     └─ Text Span ← Estimate
            │           ├─ board_card-footer (Div)
            │           │  ├─ board_card-price (Div)
            │           │  │  ├─ board_card-amount (Div)
            │           │  │  │  ├─ Text Span: "$"
            │           │  │  │  └─ Text Span ← Price
            │           │  │  └─ board_card-paid (Text Block): "paid on merge"
            │           │  └─ button is-small (Link Block ← Claim URL)
            │           │     ├─ Text Block: "Claim bounty"
            │           │     ├─ sr-only (Text Block) ← Name
            │           │     └─ button_icon (Code Embed)
            │           └─ board_offer (Code Embed with CMS fields: counter-offer)
            ├─ board_empty (Div)                           [hidden, data-empty]
            │  ├─ Paragraph: "No bounties match these filters yet."
            │  └─ Code Embed: <button> Clear filters
            ├─ board_cta (Div)
            │  └─ button (Link Block → #): "See all open bounties" + button_icon
            └─ board_script (Code Embed: CSS + script; see "Custom code")
```

**Collection List settings:** Limit items 6 · Sort by Sort order, ascending.

**Meta icons** (Code Embeds):

```html
<!-- level --><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M6 19v-5M12 19V9M18 19V5"/></svg>
<!-- clock --><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>
```

### Styles per breakpoint

**Desktop (base)**

| Class | Styles |
|---|---|
| `section_board` | Background canvas · Colour ink |
| `board_header` | Grid, 2 columns `1fr auto` · Gap 24px · Align items end |
| `board_title` | Weight 600 |
| `board_title-line` | Display block |
| `board_lede` | Margin top 16px · Max width 34rem · Size 1.0625rem · Colour ink-muted |
| `board_filters` | Margin top `clamp(32px, 4vw, 48px)` · Grid, 2 columns auto auto · Justify start · Column gap 48px · Row gap 16px |
| `board_filter` | Grid · Gap 8px · Min width 0 |
| `board_filter-label` | Size 0.8125rem · Weight 600 · Letter spacing 0.06em · Uppercase · Colour ink-muted |
| `board_chips` | Flex, wrap · Gap 8px · Padding 6px 0 (room for focus rings) |
| `board_list-wrapper` | Margin top `clamp(24px, 3vw, 36px)` · Padding top 8px |
| `board_list` | Grid, 3 columns · Gap `clamp(14px, 1.6vw, 24px)` (fallback 24px) |
| `board_item` | (no styles; the embed CSS adds the filter fade) |
| `board_card` | Position relative · Flex vertical · Height 100% · Padding `clamp(22px, 2.2vw, 30px)` · Background surface · Border 1px line · Radius radius-lg |
| `board_card-tags` | Flex, wrap · Gap 6px · No list style · Padding 0 · Margin 0 |
| `board_card-repo` | Margin top 18px · Font font-code · Size 0.8125rem · Colour ink-muted |
| `board_card-title` | Margin top 6px · Size `clamp(1.25rem, 1.1rem + 0.45vw, 1.5rem)` (fallback 1.375rem) · Weight 600 · Line height 1.2 · Letter spacing −0.01em |
| `board_card-desc` | Margin top 10px · Size 0.9375rem · Line height 1.5 · Colour ink-muted (2-line clamp in the embed CSS) |
| `board_card-meta` | Margin top 16px, bottom 24px · Flex, wrap · Gap 18px · Size 0.875rem · No list style · Padding 0 |
| `board_card-meta-item` | Inline-flex · Align center · Gap 6px (the icon colour comes from the embed CSS) |
| `board_card-footer` | Margin top auto · Padding top 20px · Border top 1px line · Flex, wrap · Space between · Align center · Gap 12px |
| `board_card-price` | Grid · Line height 1.1 |
| `board_card-amount` | Font font-display · Size 2rem · Weight 700 · Letter spacing −0.02em · Colour ink |
| `board_card-paid` | Margin top 4px · Size 0.8125rem · Weight 600 · Colour payout |
| `board_empty` | Margin top 8px · Padding 32px · Grid, centred · Gap 16px · Text align center · Border 1.5px dashed ink-muted · Radius radius-lg · Colour ink-muted |
| `board_cta` | Margin top `clamp(28px, 4vw, 48px)` · Flex · Justify center |

**Tablet**

| Class | Changes |
|---|---|
| `board_header` | 1 column · Justify items start |
| `board_filters` | 1 column |
| `board_list-wrapper` | Overflow: scroll horizontally · Margin left/right −32px · Padding 8px 32px 16px · Custom properties: `scroll-snap-type: x mandatory`, `scroll-padding-inline: 32px`, `overscroll-behavior-x: contain` |
| `board_list` | **Flex**, horizontal, no wrap |
| `board_item` | Width 45% · Flex shrink 0 · Display flex · Custom property `scroll-snap-align: start` |
| `board_cta` > `button` | Width 100% |

**Mobile landscape**

| Class | Changes |
|---|---|
| `board_chips` | No wrap · Overflow: scroll horizontally · Margin left/right −24px · Padding 6px 24px (one sideways-scrolling row of chips) |
| `board_list-wrapper` | Margin left/right −24px · Padding 8px 24px 16px · `scroll-padding-inline: 24px` |
| `board_item` | Width 85% |

**Mobile portrait**

| Class | Changes |
|---|---|
| `board_chips` | Margin left/right −16px · Padding 6px 16px |
| `board_list-wrapper` | Margin left/right −16px · Padding 8px 16px 16px · `scroll-padding-inline: 16px` |

Astro switches the chips to one sideways-scrolling row below 768px, so in Webflow they wrap down to Tablet and scroll from Mobile landscape.

### Content

- **H2:** Open bounties, / live now.
- **Lede:** Real issues from robotics, space, and AI agent projects. Paid on merge, via PayPal.
- **Header button:** See all 24 bounties → `#` (placeholder)
- **Filter labels:** Language · Difficulty
- **Chips** (generated): All + each Language in the CMS · All, Beginner, Intermediate, Advanced
- **Card fixed text:** "paid on merge" · "Claim bounty" · "Counter-offer"
- **Empty state:** No bounties match these filters yet. · Button: Clear filters
- **Counter-offer:** label "Your counter-offer" · hint "AI fair range: {range} based on this issue's complexity" · error "Enter an amount in dollars." · note "Above the AI fair range. Maintainers accept these less often." · buttons "Send offer" / "Cancel" · confirmation "Offer sent: ${amount}. You'll hear back when the maintainer responds."
- **Bottom button:** See all open bounties → `#` (placeholder)

### Filters: Finsweet Attributes vs custom embed

| | Finsweet Attributes List Filter | Custom embed |
|---|---|---|
| Setup | Add the library script plus about 10 attributes; filter controls are form inputs (radio buttons styled as chips) | One embed; chips are generated from the CMS values |
| Combining two filters | Yes | Yes |
| Live result count, empty state, clear | Built in | Built in (in the script) |
| Fade/scale out, then hide | Has its own animation options | Exactly Astro's two-phase fade, plus instant under reduced motion |
| Reset carousel scroll after filtering | No | Yes |
| New language added in CMS | You add a new radio input in Designer | Automatic |
| Updates | Depends on Finsweet's version and attribute names | Code you own |

**Recommendation: the custom embed.** It's one paste, it's already written, it keeps the chips in sync with the CMS automatically, and it behaves exactly like the Astro version (fade timing, carousel reset, announcements).

Use Finsweet if you expect to add more filter types (search, ranges, sorting) without writing code. In that case:

1. Add before `</body>` in Page settings:

   ```html
   <script async type="module" src="https://cdn.jsdelivr.net/npm/@finsweet/attributes@2/attributes.js" fs-list></script>
   ```

2. Add these attributes. **These are from Finsweet's v2 List naming. Check them against the docs for the version you install**, because v1 used `fs-cmsfilter-*` instead.

| Element | Attribute | Value |
|---|---|---|
| board_list (Collection List) | `fs-list-element` | `list` |
| A Form Block wrapping both filter groups | `fs-list-element` | `filters` |
| Each radio input (one per language, plus "All") | `fs-list-field` | `language` |
| Each radio input | `fs-list-value` | e.g. `C++` |
| The Language tag inside each card | `fs-list-field` | `language` |
| Same pattern for difficulty | `fs-list-field` | `difficulty` |
| board_empty | `fs-list-element` | `empty` |
| board_count | `fs-list-element` | `items-count` |
| Clear button | `fs-list-element` | `clear` |

### Counter-offer embed (inside each card)

Add a Code Embed as the last child of `board_card`. In the embed editor, wherever you see `{{Field}}` below, click **"+ Add Field"** and insert that CMS field. Don't type the braces yourself.

```html
<button type="button" class="board_counter" aria-expanded="false" aria-controls="offer-{{Slug}}" data-offer-toggle>
  Counter-offer<span class="sr-only">: {{Name}}</span>
</button>

<!-- Collapsible panel. Its height animates via grid-template-rows 0fr -> 1fr (see board_script CSS). -->
<div class="board_offer" id="offer-{{Slug}}" data-offer data-max="{{Fair range max}}">
  <div class="board_offer-clip">
    <form class="board_offer-form" novalidate data-offer-form>
      <label class="board_offer-label" for="amount-{{Slug}}">Your counter-offer</label>
      <div class="board_offer-field">
        <span class="board_offer-prefix" aria-hidden="true">$</span>
        <input class="board_offer-input" id="amount-{{Slug}}" name="amount" type="text" inputmode="decimal"
               autocomplete="off" value="{{Price}}" aria-describedby="hint-{{Slug}}" data-offer-input>
      </div>
      <p class="board_offer-hint" id="hint-{{Slug}}">AI fair range: {{Fair range label}} based on this issue's complexity</p>
      <p class="board_offer-error" id="error-{{Slug}}" hidden data-offer-error>Enter an amount in dollars.</p>
      <p class="board_offer-note" id="note-{{Slug}}" hidden data-offer-note>Above the AI fair range. Maintainers accept these less often.</p>
      <div class="board_offer-actions">
        <button type="submit" class="button is-small">Send offer</button>
        <button type="button" class="board_offer-cancel" data-offer-cancel>Cancel</button>
      </div>
    </form>
  </div>
</div>

<p class="board_offer-sent" role="status" tabindex="-1" hidden data-offer-sent></p>
```

**Why an embed:** Webflow's Form Block posts to Webflow's form backend and only offers its own input types. This is a demo with no backend, and it needs exact control over `aria-*` attributes, so plain HTML is simpler.

**Clear filters button** (Code Embed inside `board_empty`):

```html
<button type="button" class="button is-secondary is-small" data-clear>Clear filters</button>
```

The `button` classes come from the Designer's styles, so they work inside embeds. Make sure at least one element on the page uses `button is-secondary` and `button is-small`, or Webflow may not publish those combo styles.

### Custom code (`board_script` embed, last in the section)

```html
<style>
/* Filter fade: matching cards fade back in, others fade and shrink out (the script adds .is-out). */
.board_item { transition: opacity 200ms ease, transform 200ms ease; }
.board_item.is-out { opacity: 0; transform: scale(0.96); }

/* Filter chips (built by the script). Pressed = dark fill. Border is ink-muted (3:1 for controls). */
.chip { flex: none; min-height: 40px; padding: 0 16px; cursor: pointer;
  border: 1px solid var(--colors--ink-muted, #5A5F7A); border-radius: 999px;
  background: var(--colors--surface, #FFF); color: var(--colors--ink, #14162B);
  font-family: inherit; font-size: 0.9375rem; font-weight: 500; transition: background-color 160ms ease, color 160ms ease, border-color 160ms ease; }
.chip:hover { border-color: var(--colors--brand, #0E6B47); color: var(--colors--brand, #0E6B47); }
.chip[aria-pressed="true"] { background: var(--colors--ink, #14162B); border-color: var(--colors--ink, #14162B); color: var(--colors--surface, #FFF); }

/* Card details the Style panel can't express. */
.board_card-desc { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; overflow: hidden; }
.board_card-meta-item svg { color: var(--colors--ink-muted, #5A5F7A); }
.board_list-wrapper:focus-visible { outline-offset: -3px; border-radius: 8px; }

/* Desktop: subgrid keeps tags, titles, price rows and the counter-offer row aligned
   across the cards in a row, even when one card's panel is open. 7 rows = the 7
   children of board_card (tags, repo, title, desc, meta, footer, offer embed). */
@media (min-width: 992px) {
  .board_item, .board_card { display: grid; grid-row: span 7; grid-template-rows: subgrid; row-gap: 0; }
  .board_card > * { min-width: 0; }
  .board_card-footer { margin-top: 0; }
}

/* Counter-offer toggle. */
.board_counter, .board_offer-cancel { padding: 8px 0; border: 0; background: none; cursor: pointer;
  font-size: 0.875rem; font-weight: 500; color: var(--colors--ink-muted, #5A5F7A); text-underline-offset: 0.2em; }
.board_counter { margin-top: 10px; }
.board_counter:hover, .board_offer-cancel:hover { color: var(--colors--ink, #14162B); text-decoration: underline; }
.board_counter[aria-expanded="true"] { color: var(--colors--ink, #14162B); }

/* Panel height animation without measuring: a one-row grid whose row goes from
   0fr (no height) to 1fr (content height). visibility:hidden while closed keeps
   the fields out of the tab order and away from screen readers. */
.board_offer { display: grid; grid-template-rows: 0fr; visibility: hidden;
  transition: grid-template-rows 260ms ease, visibility 0s linear 260ms; }
.board_offer.is-open { grid-template-rows: 1fr; visibility: visible; transition: grid-template-rows 260ms ease, visibility 0s; }
.board_offer-clip { min-height: 0; overflow: hidden; margin: -6px; padding: 6px; } /* padding keeps focus rings visible */
.board_offer-form { margin-top: 8px; padding: 16px; border-radius: 8px; background: var(--colors--canvas, #F6F7FB); }
.board_offer-label { display: block; font-size: 0.875rem; font-weight: 600; }
.board_offer-field { margin-top: 6px; display: flex; align-items: center; border-radius: 8px;
  border: 1px solid var(--colors--ink-muted, #5A5F7A); background: var(--colors--surface, #FFF); }
.board_offer-field:focus-within { outline: 3px solid var(--colors--brand, #0E6B47); outline-offset: 2px; }
.board_offer-field:has([aria-invalid="true"]) { border-color: var(--colors--removed, #B42318); }
.board_offer-prefix { padding-left: 12px; font-weight: 600; color: var(--colors--ink-muted, #5A5F7A); }
.board_offer-input { flex: 1; min-width: 0; min-height: 44px; padding: 0 12px 0 4px; border: 0; background: transparent;
  font-size: 1rem; font-variant-numeric: tabular-nums; }
.board_offer-input:focus-visible { outline: none; } /* the field wrapper shows the ring */
.board_offer-input[aria-invalid="true"] { color: var(--colors--removed, #B42318); }
.board_offer-hint, .board_offer-error, .board_offer-note { margin: 8px 0 0; font-size: 0.8125rem; line-height: 1.45; }
.board_offer-hint { color: var(--colors--ink-muted, #5A5F7A); }
.board_offer-error { font-weight: 600; color: var(--colors--removed, #B42318); }
.board_offer-actions { margin-top: 14px; display: flex; align-items: center; gap: 16px; }
.board_offer-sent { margin-top: 12px; font-size: 0.875rem; font-weight: 600; color: var(--colors--payout, #0E6B47); }
.board_offer-sent:focus { outline: none; }
</style>

<script>
(() => {
  const section = document.querySelector('[data-board]');
  if (!section) return;
  const track = section.querySelector('[data-track]');
  const cards = [...section.querySelectorAll('[data-card]')];
  const count = section.querySelector('[data-count]');
  const empty = section.querySelector('[data-empty]');
  const clear = section.querySelector('[data-clear]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const wide = matchMedia('(min-width: 992px)');
  const FADE_MS = 200;
  const ORDER = { difficulty: ['Beginner', 'Intermediate', 'Advanced'] }; // fixed order; languages keep CMS order

  /* ---------- 1. Carousel region only below 992px (on desktop it's a plain grid) ---------- */
  function applyLayout() {
    if (wide.matches) {
      ['role', 'aria-label', 'tabindex'].forEach((a) => track.removeAttribute(a));
    } else {
      track.setAttribute('role', 'region');
      track.setAttribute('aria-label', 'Open bounties');
      track.setAttribute('tabindex', '0');
    }
  }
  applyLayout();
  wide.addEventListener('change', applyLayout);

  /* ---------- 2. Build the chips from the values on the cards ---------- */
  const state = {};   // e.g. { language: 'all', difficulty: 'Beginner' }
  const chips = [];
  section.querySelectorAll('[data-filter-group]').forEach((group) => {
    const key = group.dataset.filterGroup;
    state[key] = 'all';
    const values = [...new Set(cards.map((c) => c.dataset[key]).filter(Boolean))];
    if (ORDER[key]) values.sort((a, b) => ORDER[key].indexOf(a) - ORDER[key].indexOf(b));
    ['all', ...values].forEach((value) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.textContent = value === 'all' ? 'All' : value;
      b.dataset.filter = key;
      b.dataset.value = value;
      b.setAttribute('aria-pressed', String(value === 'all'));
      b.addEventListener('click', () => setFilter(key, value));
      group.append(b);
      chips.push(b);
    });
  });

  /* ---------- 3. Filtering: a card shows only if it passes EVERY filter ---------- */
  const matches = (card) => Object.keys(state).every((k) => state[k] === 'all' || card.dataset[k] === state[k]);
  let run = 0; // bumps on every change, so a stale timer from a quick double click does nothing

  function applyFilters() {
    const id = ++run;
    const show = cards.map(matches);
    const n = show.filter(Boolean).length;
    count.textContent = n === 0 ? 'No bounties match these filters.' : `Showing ${n} ${n === 1 ? 'bounty' : 'bounties'}`;
    cards.forEach((card, i) => { if (!show[i]) closeOffer(card, false); });

    // Phase 2: hide non-matching cards, fade matching ones in, reset the carousel.
    const finish = () => {
      cards.forEach((card, i) => {
        if (show[i] && card.hidden) { card.classList.add('is-out'); card.hidden = false; }
        else if (!show[i]) card.hidden = true;
      });
      empty.hidden = n !== 0;
      track.scrollLeft = 0;
      void track.offsetWidth; // force layout so the .is-out start state applies before removing it
      cards.forEach((card, i) => { if (show[i]) card.classList.remove('is-out'); });
    };

    if (reduce.matches) { cards.forEach((c) => c.classList.remove('is-out')); finish(); return; }

    // Phase 1: fade out the cards that no longer match, while they still hold their place.
    let leaving = 0;
    cards.forEach((card, i) => {
      if (!show[i] && !card.hidden) { card.classList.add('is-out'); leaving++; }
      if (show[i] && !card.hidden) card.classList.remove('is-out');
    });
    setTimeout(() => { if (id === run) finish(); }, leaving ? FADE_MS : 0);
  }

  function setFilter(key, value) {
    state[key] = value;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(state[c.dataset.filter] === c.dataset.value)));
    applyFilters();
  }

  clear.addEventListener('click', () => {
    Object.keys(state).forEach((k) => { state[k] = 'all'; });
    setFilter(Object.keys(state)[0], 'all');
    chips[0].focus(); // the Clear button is about to disappear
  });

  /* ---------- 4. Counter-offer panels ---------- */
  const parts = (card) => ({
    toggle: card.querySelector('[data-offer-toggle]'),
    panel: card.querySelector('[data-offer]'),
    input: card.querySelector('[data-offer-input]'),
    error: card.querySelector('[data-offer-error]'),
    note: card.querySelector('[data-offer-note]'),
    sent: card.querySelector('[data-offer-sent]'),
  });

  // Returns a positive dollar amount, or null.
  const parseAmount = (raw) => {
    const clean = raw.trim().replace(/[$,\s]/g, '');
    if (!/^\d+(\.\d{1,2})?$/.test(clean)) return null;
    const v = Number(clean);
    return v > 0 ? v : null;
  };

  // aria-describedby = hint, plus the error or note while it's visible.
  const describe = (p) => {
    const ids = [p.input.dataset.hint];
    if (!p.error.hidden) ids.push(p.error.id);
    if (!p.note.hidden) ids.push(p.note.id);
    p.input.setAttribute('aria-describedby', ids.join(' '));
  };

  const updateNote = (p) => {
    const v = parseAmount(p.input.value);
    p.note.hidden = !(v !== null && v > Number(p.panel.dataset.max));
    describe(p);
  };

  function closeOffer(card, returnFocus) {
    const p = parts(card);
    if (!p.panel || !p.panel.classList.contains('is-open')) return;
    p.panel.classList.remove('is-open');
    p.toggle.setAttribute('aria-expanded', 'false');
    if (returnFocus) p.toggle.focus();
  }

  function openOffer(card) {
    cards.forEach((other) => { if (other !== card) closeOffer(other, false); }); // one panel at a time
    const p = parts(card);
    p.panel.classList.add('is-open');
    p.toggle.setAttribute('aria-expanded', 'true');
    updateNote(p);
    p.input.focus({ preventScroll: true });
    p.input.select();
  }

  cards.forEach((card) => {
    const p = parts(card);
    if (!p.panel) return;
    p.input.dataset.hint = p.input.getAttribute('aria-describedby');

    p.toggle.addEventListener('click', () => p.panel.classList.contains('is-open') ? closeOffer(card, true) : openOffer(card));
    card.querySelector('[data-offer-cancel]').addEventListener('click', () => closeOffer(card, true));
    p.panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); closeOffer(card, true); } });

    p.input.addEventListener('input', () => {
      if (!p.error.hidden && parseAmount(p.input.value) !== null) { // clear the error once it's valid
        p.error.hidden = true;
        p.input.removeAttribute('aria-invalid');
      }
      updateNote(p);
    });

    card.querySelector('[data-offer-form]').addEventListener('submit', (e) => {
      e.preventDefault();
      const v = parseAmount(p.input.value);
      if (v === null) {
        p.error.hidden = false;
        p.input.setAttribute('aria-invalid', 'true');
        describe(p);
        p.input.focus();
        return;
      }
      // Demo only: nothing is sent. The confirmation replaces the toggle and panel.
      const amount = v % 1 ? v.toFixed(2) : v.toLocaleString('en-US');
      p.sent.textContent = `Offer sent: $${amount}. You'll hear back when the maintainer responds.`;
      p.panel.classList.remove('is-open');
      p.panel.hidden = true;
      p.toggle.setAttribute('aria-expanded', 'false');
      p.toggle.hidden = true;
      p.sent.hidden = false;
      p.sent.focus(); // the button that had focus is gone
    });
  });
})();
</script>
```

### Interactions

None native. The filter fade and the panel's height animation are CSS transitions driven by the script, and both turn instant under reduced motion (global CSS).

### Accessibility

| Element | Attribute | Value |
|---|---|---|
| section_board | `aria-labelledby` | `board-title` |
| section_board | `data-board` | `true` |
| board_title | ID | `board-title` |
| board_filter (language) | `role` / `aria-labelledby` | `group` / `filter-language` |
| board_filter (difficulty) | `role` / `aria-labelledby` | `group` / `filter-difficulty` |
| board_filter-label | ID | `filter-language` / `filter-difficulty` |
| board_chips | `data-filter-group` | `language` / `difficulty` |
| board_count | `aria-live` | `polite` |
| board_count | `data-count` | `true` |
| board_list-wrapper | `data-track` | `true` (the script adds `role`, `aria-label` and `tabindex` below 992px) |
| board_item | `data-card` | `true` |
| board_item | `data-language` | bind to **Language** (click the purple CMS icon in the value field) |
| board_item | `data-difficulty` | bind to **Difficulty** |
| board_card | Tag (Element settings) | `article`. No `aria-labelledby` needed: the H3 inside is its heading |
| board_empty | `hidden` | `hidden` |
| board_empty | `data-empty` | `true` |

The "Claim bounty" link's accessible name is "Claim bounty" followed by the bounty title (from the `sr-only` text), so a list of links stays unambiguous. The counter-offer toggle does the same inside the embed.

### Checklist

- [ ] Chips show All, C++, Python, Rust, Go, TypeScript and All, Beginner, Intermediate, Advanced. Add a CMS item with a new language and republish: its chip appears.
- [ ] TypeScript + Intermediate → 1 card. Rust + Beginner → empty state. Clear filters → 6 cards, and focus moves to the first "All" chip.
- [ ] Screen reader: each filter change announces "Showing N bounties".
- [ ] Cards fade out, then the matching ones fade in. With reduced motion, the change is instant.
- [ ] 1440: 3 × 2 grid; price rows line up; opening a counter-offer keeps the rows aligned across the row.
- [ ] Counter-offer: focus goes to the input; empty, `abc`, `-5` and `0` show the red error; `1200` on the arm bounty shows the "less often" note; Escape and Cancel close it and return focus; opening another card's panel closes the first; Send shows the green confirmation, which is focused and announced.
- [ ] 768 and 375: swipeable cards with the next one peeking; filtering scrolls back to the first card; chips scroll sideways on phones; no horizontal page scroll.
- [ ] Tab order: chips → (carousel region below 992px) → card links and toggles → Claim buttons.

---

## Final pass (whole page)

- [ ] Section order on the page: Hero, WaysToEarn, Paths, BountyBoard (then the remaining sections, built later).
- [ ] Every colour in the Style panel is a Variable; no raw hex values in the Designer.
- [ ] Lighthouse accessibility score ≥ 95; no contrast warnings. The Astro build passed WCAG AA with these exact tokens.
- [ ] "Payouts via PayPal" wording is used, and no PayPal brand colours appear.
- [ ] Only the hero has a load animation; no other section fades in on scroll.
- [ ] Test once with the keyboard only, and once with VoiceOver or NVDA, at Desktop and Mobile portrait.
