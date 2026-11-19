# Fairmerge in Webflow: build guide

How to rebuild every section of the Astro site in Webflow (**Hero, WaysToEarn, Paths, BountyBoard, Contributors, HowItWorks, FAQ and FinalCTA**), using Client-First naming. The site header and footer aren't covered yet.

The Astro source is the reference. When something here is unclear, open the matching file in `src/components/` and `src/styles/global.css`.

**Contents**

- [Before you start](#before-you-start)
- [Part 1: Global setup](#part-1-global-setup)
- [Part 2.1: Hero](#part-21-hero)
- [Part 2.2: WaysToEarn](#part-22-waystoearn)
- [Part 2.3: Paths](#part-23-paths)
- [Part 2.4: BountyBoard](#part-24-bountyboard)
- [Part 2.5: Contributors](#part-25-contributors)
- [Part 2.6: HowItWorks](#part-26-howitworks)
- [Part 2.7: FAQ](#part-27-faq)
- [Part 2.8: FinalCTA](#part-28-finalcta)
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

Go to **Variables panel** (the "Variables" icon in the left bar) → create these collections. Names match the tokens in `src/styles/global.css`, so a value in the Astro code like `var(--space-4)` maps to the variable **space-4** here.

Token names describe roles, not colours (`brand`, not `green`), so the palette can change later without renaming anything.

**Collection: Colors**

| Variable | Value | Used for |
|---|---|---|
| ink | `#14162B` | Main text, FinalCTA panel, footer |
| ink-soft | `rgba(20,22,43,0.82)` | Emphasised secondary text |
| ink-muted | `#5A5F7A` | Secondary text, input borders |
| canvas | `#F6F7FB` | Page background, Hero, BountyBoard, FAQ panel |
| surface | `#FFFFFF` | Cards, text on dark |
| surface-frosted | `rgba(255,255,255,0.85)` | Header after scrolling |
| line | `#DADDEA` | Borders, dividers |
| ink-overlay | `rgba(20,22,43,0.06)` | Icon-button hover on light backgrounds |
| scrim | `rgba(20,22,43,0.4)` | Backdrop behind the mobile menu |
| brand | `#0E6B47` | Brand, merged state, primary buttons, links, focus ring |
| brand-hover | `#0A5537` | Button and link hover |
| brand-tint | `#E3F1EA` | WaysToEarn background, tints, focus ring on dark |
| brand-soft | `#BFE3CF` | Hero decorative shape |
| accent | `#F2A93B` | Bounty highlights and badges only. Text on it is always ink, never white |
| accent-tint | `#FCEFD6` | Badge backgrounds (bounty domain tag), hero decorative shape |
| accent-ink | `#6B4206` | Text on accent-tint |
| payout | `#0E6B47` | "paid on merge", payout amounts (same as brand) |
| payout-tint | `#E6F4EC` | Added diff lines, HowItWorks background |
| removed | `#B42318` | Errors, rejected, removed lines |
| removed-tint | `#FBEAEA` | Removed diff lines |
| path-earn-bg | `#0B3B2C` | Paths: Earn |
| path-grow-bg | `#102F3A` | Paths: Grow |
| path-ship-bg | `#3A2A0E` | Paths: Ship, FinalCTA overlay |
| on-dark-watermark | `rgba(255,255,255,0.05)` | Footer and FinalCTA watermark |
| on-dark-surface | `rgba(255,255,255,0.06)` | Translucent cards on dark |
| on-dark-hover | `rgba(255,255,255,0.1)` | Hover on dark |
| on-dark-line | `rgba(255,255,255,0.12)` | Borders on dark |
| on-dark-frame | `rgba(255,255,255,0.35)` | Thin frames on dark |
| on-dark-control | `rgba(255,255,255,0.4)` | Inactive carousel segments (3:1 contrast) |
| on-dark-border | `rgba(255,255,255,0.6)` | Outline buttons on dark |
| on-dark-muted | `rgba(255,255,255,0.72)` | Muted text on dark |
| on-dark-strong | `rgba(255,255,255,0.85)` | Strong secondary text on dark |

Colour meanings: **green** = brand, merged and money. **Amber** = bounty highlights only. **Red** = errors. Focus rings use **brand** on light backgrounds and **brand-tint** on dark ones.

The hero image is exported as a finished file (shapes in brand-soft and accent-tint), so you upload it rather than rebuild it.

**Collection: Typography**

| Variable | Type | Value | Use |
|---|---|---|---|
| font-display | Font family | Bricolage Grotesque (fallback: Helvetica Neue, Arial, sans-serif) | Headings, big numbers |
| font-body | Font family | IBM Plex Sans (fallback: Helvetica Neue, Arial, sans-serif) | Everything else, including prices and counters |
| font-code | Font family | IBM Plex Mono (fallback: Menlo, monospace) | Code, repo names, file paths, handles only |
| text-display | Size | `clamp(2.5rem, 1.5rem + 4vw, 4.5rem)` | Hero and FinalCTA headings (40 → 72px) |
| text-h1 | Size | `clamp(2rem, 1.4rem + 2.6vw, 3.25rem)` | Section titles (32 → 52px) |
| text-h2 | Size | `clamp(1.5rem, 1.2rem + 1.2vw, 2.25rem)` | Panel titles, big card words, prices (24 → 36px) |
| text-h3 | Size | `clamp(1.25rem, 1.1rem + 0.5vw, 1.5rem)` | Card titles, questions, labels (20 → 24px) |
| text-body-lg | Size | `clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)` | Ledes, quotes (17 → 20px) |
| text-body | Size | `1rem` | Body, buttons (16px) |
| text-small | Size | `0.875rem` | Secondary text, chips, nav (14px) |
| text-caption | Size | `0.75rem` | Meta, eyebrows, badges (12px) |
| leading-tight | Number | `1.05` | Display and section headings |
| leading-snug | Number | `1.25` | Smaller headings, buttons, UI |
| leading-normal | Number | `1.55` | Body text |
| leading-code | Number | `1.8` | Diff and code lines |
| tracking-tight | Size | `-0.02em` | Headings |
| tracking-wide | Size | `0.06em` | Uppercase eyebrows |

Numbers (prices, payouts, counters) use **font-body** with tabular figures, so the digits line up. Add the `is-tabular` combo class (Part 1.5) to them.

If your Designer has no Number variable type, type the line heights directly on each class.

**Collection: Spacing**

| Variable | Type | Value |
|---|---|---|
| space-1 | Size | `4px` |
| space-2 | Size | `8px` |
| space-3 | Size | `12px` |
| space-4 | Size | `16px` |
| space-5 | Size | `24px` |
| space-6 | Size | `32px` |
| space-7 | Size | `40px` |
| space-8 | Size | `48px` |
| space-9 | Size | `64px` |
| space-10 | Size | `80px` |
| section-pad | Size | `clamp(4rem, 2.4rem + 6.8vw, 8rem)` (64 → 128px) |
| gap-section-head | Size | `clamp(32px, 4vw, 48px)` (space below a section's header) |
| content-width | Size | `1240px` |
| content-pad | Size | `clamp(16px, 4vw, 56px)` |
| measure-narrow | Size | `32rem` (ledes, short intros) |
| measure | Size | `40rem` (longer text blocks) |
| measure-wide | Size | `48rem` |

Every padding, margin and gap in this guide is one of the space variables. When a section lists "Padding space-2 space-3", pick **space-2** for top/bottom and **space-3** for left/right.

**Collection: Radius**

| Variable | Value | Use |
|---|---|---|
| radius-xs | `4px` | Tiny marks, code highlights |
| radius-sm | `8px` | Buttons, inputs, small cards |
| radius-md | `12px` | Cards inside cards, vignettes |
| radius-lg | `20px` | Cards |
| radius-xl | `clamp(24px, 3vw, 32px)` | Large section panels (HowItWorks, FAQ, FinalCTA) |
| radius-pill | `999px` | Chips, tags, round buttons |

**Shadows and motion (not variables).** Webflow Variables can't hold shadows or easing curves. They're defined as CSS custom properties in the global CSS (Part 1.6) for code embeds, and typed into the Style panel by value:

| Token | Value | Use |
|---|---|---|
| shadow-sm | `0 2px 6px rgba(20,22,43,0.06)` | Chips, small raised elements |
| shadow-md | `0 16px 32px -20px rgba(20,22,43,0.4)` | Cards on hover, floating cards |
| shadow-lg | `0 24px 48px -28px rgba(20,22,43,0.45)` | Large floating UI cards |
| dur-fast | `160ms` | Hover colours, underlines, arrow nudge |
| dur-base | `250ms` | State changes, small reveals |
| dur-slow | `400ms` | Panels, cards, accordions |
| dur-slower | `600ms` | Background colour fades |
| ease-out | `cubic-bezier(0.22, 1, 0.36, 1)` | Everything entering or growing (the default) |
| ease-in | `cubic-bezier(0.4, 0, 1, 1)` | Things leaving or shrinking |

In a Style panel transition or an Interaction, choose **Custom (cubic-bezier)** and enter the ease-out curve `0.22, 1, 0.36, 1` instead of Webflow's preset "ease". In code embeds, write `var(--dur-fast) var(--ease-out)`.

**Value fallbacks per breakpoint** (only if a Size variable won't accept `clamp()`; store the Desktop value in the variable and type the others directly on the class at each breakpoint):

| Variable | Desktop | Tablet | Mobile L | Mobile P |
|---|---|---|---|---|
| text-display | 4.5rem | 4rem | 3.375rem | 2.5rem |
| text-h1 | 3.25rem | 3rem | 2.625rem | 2rem |
| text-h2 | 2.25rem | 1.9375rem | 1.75rem | 1.5rem |
| text-h3 | 1.5rem | 1.375rem | 1.3125rem | 1.25rem |
| text-body-lg | 1.25rem | 1.1875rem | 1.125rem | 1.0625rem |
| section-pad | 128px | 104px | 88px | 64px |
| gap-section-head | 48px | 40px | 32px | 32px |
| content-pad | 48px | 32px | 24px | 16px |
| radius-xl | 32px | 30px | 24px | 24px |

**Why one variable per section background instead of `--section-bg`:** in Astro, `.section` reads `--section-bg` so every section changes colour in one place. In Webflow you get the same result by picking a Colors variable as each section's Background. Changing the variable updates every section that uses it.

**Only tokens.** Every colour, size, spacing, radius, shadow and timing on the site comes from this list. If you need a value that isn't here, add a variable rather than typing a one-off.

### 1.2 Fonts

Go to **Site settings → Fonts → Google Fonts**, then add:

| Family | Weights |
|---|---|
| Bricolage Grotesque | 400, 500, 600, 700 |
| IBM Plex Sans | 400, 500, 600 |
| IBM Plex Mono | 400, 500 |

- **Headings use weight 600.** 700 is only for prices, the "fairmerge" watermark and avatar initials.
- **Bricolage's optical sizing:** Astro loads Bricolage as a variable font with an `opsz` axis. Webflow's Google Fonts picker loads static weights, so very large headings will look slightly less tight than on the Astro site. That's acceptable. For an exact match, upload the variable font file under **Custom fonts** instead.

### 1.3 Base styles

Select the **Body (All Pages)** tag in the Style panel's selector field, then set the styles below. Do the same for each heading tag (select "All H1 Headings" and so on).

| Tag | Styles |
|---|---|
| Body (All Pages) | Font: font-body · Size: text-body · Line height: leading-normal · Colour: ink · Background: canvas |
| All H1–H4 | Font: font-display · Weight 600 · Line height: leading-tight · Margin 0 |
| All H1 | Size: text-display · Letter spacing: tracking-tight |
| All H2 | Size: text-h1 · Letter spacing: tracking-tight |
| All H3, All H4 | Size: text-h3 · Line height: leading-snug |
| All Paragraphs | Margin 0 |
| All Links | Colour: brand · Hover state: brand-hover · Underline offset: see Part 1.6 |

Note the shift: an **H2** (section title) uses **text-h1**, because there's one H1 per page and section titles take the next size down from the hero. H3s that need to be big (the Paths card words) get **text-h2** on their own class.

`text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs and `text-underline-offset` go into the global CSS (Part 1.6). Add them in **Style panel → Custom properties** instead if your Designer shows that section.

### 1.4 Page structure (Client-First)

```
Body
└─ page-wrapper (Div)
   ├─ global-styles (Code Embed: Part 1.6)   ← or put the CSS in Site settings → Head code
   └─ main-wrapper (Div, tag: main)
      ├─ section_hero
      ├─ section_ways
      ├─ section_paths
      ├─ section_board
      ├─ section_contrib
      ├─ section_hiw
      ├─ section_faq
      └─ section_cta
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
| `button` | Display inline-flex · Align center · Justify center · Gap space-2 · Min height 48px · Padding 0 space-5 · Radius radius-sm · Font font-body · Size text-body · Weight 600 · Line height leading-snug · No underline · No wrap · Background transparent · Transition: background-colour, colour and box-shadow, dur-fast, ease-out |
| `button` + `is-primary` | Background brand · Colour surface. **Hover:** Background brand-hover · Colour surface. The main action on light backgrounds |
| `button` + `is-secondary` | Colour ink · Box shadow inset 0 0 0 1.5px ink. **Hover:** Background ink · Colour surface |
| `button` + `is-on-dark` | Background surface · Colour ink. **Hover:** Background brand-tint. The main action on a dark panel (FinalCTA) |
| `button` + `is-outline-on-dark` | Colour surface · Box shadow inset 0 0 0 1px on-dark-border. **Hover:** Background on-dark-hover · Box shadow inset 0 0 0 1px surface |
| `button` + `is-small` | Min height 40px · Padding 0 space-4 · Size text-small. Header buttons, buttons inside cards |
| `button` + `is-large` | Min height 52px. Hero, BountyBoard and FinalCTA calls to action |
| `button_icon` | The arrow inside a button. Width/height 18px (16px in `is-small`) · Transition transform dur-fast ease-out. The global CSS moves it 4px right when the button is hovered |
| `tag` | Padding 2px space-2 · Border 1px line · Radius radius-pill · Size text-caption · Colour ink-muted |
| `tag` + `is-domain` | The bounty's highlight badge. Background accent-tint · Border colour accent-tint · Colour accent-ink · Weight 600 |
| `card` | Background surface · Border 1px line · Radius radius-lg · Padding space-5 (Desktop space-6) |
| `chip` | Built by script in BountyBoard, styled in its embed (Part 2.4). WaysToEarn's chips are `ways_panel-chip` and `ways_lang` |
| `is-tabular` | Combo class for numbers (prices, payouts, counters): tabular figures (rule in Part 1.6) |
| `sr-only` | Visually hidden text that screen readers still read (rules in Part 1.6) |
| `link-stretched` | Makes a link's click area cover its whole card (rules in Part 1.6) |

Every button is `button` plus one colour combo class, plus a size combo class if it isn't the default 48px. Section classes only add layout (full width on mobile, alignment); they never set button colours.

**Why `container-large` is 1128px and not 1240px:** in Astro, `--content-width` is the outer width *including* padding. Client-First puts the padding on `padding-global`, outside the container, so the container's max width is the inner width.

### 1.6 Global CSS

Put this in **Site settings → Custom code → Head code**, or in the `global-styles` Code Embed (Client-First's convention, which also previews in the Designer). It holds only what the Style panel can't do.

```html
<style>
/* 0. Tokens Webflow Variables can't hold: shadows and motion. */
:root {
  --shadow-sm: 0 2px 6px rgba(20, 22, 43, 0.06);
  --shadow-md: 0 16px 32px -20px rgba(20, 22, 43, 0.4);
  --shadow-lg: 0 24px 48px -28px rgba(20, 22, 43, 0.45);
  --dur-fast: 160ms;
  --dur-base: 250ms;
  --dur-slow: 400ms;
  --dur-slower: 600ms;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
}

/* 1. Keyboard focus ring on everything (Webflow can't style :focus-visible globally).
      brand on light backgrounds, brand-tint on dark ones. */
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
.is-tabular { font-variant-numeric: tabular-nums; }

/* 5. Stretched link: the link's ::after covers the nearest positioned parent (the card). */
.link-stretched::after { content: ''; position: absolute; inset: 0; border-radius: inherit; }
.link-stretched:focus-visible { outline: none; }
.link-stretched:focus-visible::after { outline: 3px solid var(--colors--brand, #0E6B47); outline-offset: 3px; }

/* 6. Button arrow nudge on hover. */
.button:hover .button_icon { transform: translateX(4px); }

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
         │     ├─ button is-primary is-large (Link Block → #bounties)
         │     │  ├─ Text: "Find a bounty"
         │     │  └─ button_icon (Code Embed: arrow SVG)
         │     └─ button is-secondary is-large (Link Block → #paths)
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
| `hero_title` | Size `min(var(--typography--text-display), 8.4svh)`: text-display, capped so it fits short screens (fallback 4rem) · Line height leading-tight · Max width 14ch · Colour ink |
| `hero_lede` | Margin top `clamp(12px, 2.4svh, 24px)` · Max width measure · Size text-body-lg · Colour ink-muted |
| `hero_button-group` | Margin top `clamp(18px, 3.6svh, 36px)` · Flex, wrap · Gap space-3 |
| `hero_visual` | Flex · Justify center · Align self center |
| `hero_quote` | Max width measure-narrow · Padding space-5 space-5 space-4 · Background surface · Border 1px line · Radius radius-lg |
| `hero_quote-slides` | Grid, 1 column. Put **all three slides in row 1 / col 1** (Manual) so they overlap and the card keeps the tallest slide's height |
| `hero_quote-slide` | Opacity 0 (the slide transitions are in the embed CSS) |
| `hero_quote-slide` + `is-active` | Opacity 1 |
| `hero_quote-text` | Size text-body · Line height leading-normal · Colour ink · No border, padding 0, margin 0 (Webflow styles Block Quote by default) |
| `hero_quote-person` | Margin top space-3 · Flex · Align center · Gap space-2 |
| `hero_avatar` | 36 × 36px · Radius 50% · Grid, centred · Background brand-tint · Colour brand · Font font-display · Weight 700 · Size text-small |
| `hero_quote-name` | Weight 600 · Size text-small · Line height leading-snug · Colour ink |
| `hero_quote-meta` | Size text-caption · Colour ink-muted |

**Tablet**

| Class | Changes |
|---|---|
| `section_hero` | Min height auto · Padding top/bottom `clamp(40px, 7vw, 88px)` (fallback 64px) |
| `hero_component` | 1 column · Row gap `clamp(40px, 8vw, 56px)` (fallback 48px). Children: content row 1, visual row 2 |
| `hero_title` | Size text-display · Line height leading-tight |
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
| 2 | hero_title | Opacity + Move | → 100 %, Y 0 · 400ms (dur-slow) · delay 0 |
| 3 | hero_lede | Opacity + Move | → 100 %, Y 0 · 400ms · delay 80ms |
| 4 | hero_button-group | Opacity + Move | → 100 %, Y 0 · 400ms · delay 160ms |

- **Easing:** the shared ease-out curve, Custom `cubic-bezier(0.22, 1, 0.36, 1)`, if your Interactions panel has custom bezier, otherwise **Out Quart** (the closest preset).
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
  .hero_quote-slide { visibility: hidden; transition: opacity var(--dur-slow) var(--ease-out), visibility 0s linear var(--dur-slow); }
  .hero_quote-slide.is-active { visibility: visible; transition: opacity var(--dur-slow) var(--ease-out), visibility 0s; }

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
    background: var(--colors--ink-muted, #5A5F7A); transition: width var(--dur-fast) var(--ease-out), background-color var(--dur-fast) var(--ease-out); }
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
            │  │              │  └─ button is-primary + ways_cta (Link Block → #bounties) [data-anim]
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
| `vig` + `is-card` | Max width 440px · Padding space-4 space-5 · Radius radius-lg · Shadow 0 24px 48px −28px rgba(20,22,43,0.4) · Size text-small |
| `vig_meta`, `vig_text` | Colour ink-muted · Size text-caption |
| `vig_pr-meta` | Margin top space-3 · Padding top 12px · Border top 1px line · Flex · Space between |
| `vig_tests` | No list style · Padding space-2 0 0 |
| `vig_test` | Flex · Align center · Gap space-2 · Padding space-2 0 |
| `vig_check` | 18 × 18px · Radius 50% · Grid centred · Background payout-tint · Colour payout |
| `vig_result` | Margin top space-2 · Padding top 10px · Border top 1px line |
| `vig_code`, `vig_codeline` | Margin top space-3 · Padding space-2 space-3 · Radius radius-sm · Background canvas · Font font-code 0.8125rem · White space pre · Overflow hidden |
| `vig_comment` | Margin top space-3 · Padding space-3 · Border 1px line · Radius radius-sm |
| `vig_badge` | Margin left auto · Inline-flex · Gap space-1 · Padding 2px space-2 · Radius radius-pill · Background payout-tint · Colour payout · Size text-caption · Weight 600 |

### Styles per breakpoint

The Designer holds the **accordion** look, the base for every breakpoint. The Desktop tab layout only applies after the script adds `is-tabs`, so it lives in the embed CSS (below), not in the Style panel.

**Desktop (base)**

| Class | Styles |
|---|---|
| `section_ways` | Background brand-tint |
| `ways_header` | Grid, 2 columns `1fr auto` · Gap space-5 · Align end · Padding bottom `clamp(32px, 4vw, 48px)` · Border bottom 1px line |
| `ways_title` | Size text-h1 · Weight 600 · Line height leading-tight · Letter spacing tracking-tight |
| `ways_title-line` | Display block |
| `ways_intro` | Max width measure-narrow · Justify self end · Text align right · Colour ink-muted |
| `ways_browse` | Margin top space-4 · Inline-flex · Gap space-2 · Padding bottom 3px · Border bottom 1.5px solid ink · Weight 600 · Size text-small · Colour ink · No underline. **Hover:** colour brand |
| `ways_item` | Border bottom 1px line |
| `ways_panel` | Grid, 1 row (the embed CSS animates its row) |
| `ways_panel-clip` | Min height 0 · Overflow hidden · Margin 0 −6px · Padding 0 space-2 (keeps focus rings visible) |
| `ways_panel-body` | Grid, 1 column · Gap space-5 · Padding space-1 0 space-6 |
| `ways_panel-text` | Flex vertical · Align start · Gap space-4 |
| `ways_panel-title` | Display none (shown on Desktop by the embed CSS) |
| `ways_panel-desc` | Max width measure-narrow · Colour ink-muted |
| `ways_panel-chips` | Flex, wrap · Gap space-2 · No list style · Padding 0 |
| `ways_panel-chip` | Inline-flex · Align center · Gap space-2 · Padding space-1 space-3 · Border 1px line · Radius radius-pill · Background surface · Size text-small. The green dot is the embed CSS's `::before` |
| `ways_cta` | Combo on `button is-primary` (default 48px size). Layout only: Align self stretch. The arrow inside is a `button_icon` |
| `ways_langs` | Margin top `clamp(32px, 4vw, 48px)` · Grid, 2 columns `auto 1fr` · Align center · Gap space-4 |
| `ways_langs-label` | Size text-caption · Weight 600 · Letter spacing tracking-wide · Uppercase · Colour ink-muted |
| `ways_lang-list` | Flex, no wrap · Gap space-2 · No list style · Padding space-1 |
| `ways_lang` | Inline-flex · Align center · Min height 36px · Padding 0 space-3 · Border 1px line · Radius radius-pill · Background surface · Size text-small · Colour ink · No underline · No wrap. **Hover:** Border and colour brand |

**Tablet**

| Class | Changes |
|---|---|
| `ways_header` | 1 column |
| `ways_intro` | Justify self start · Text align left |
| `ways_lang-list` | Wrap |

**Mobile landscape**

| Class | Changes |
|---|---|
| `ways_langs` | 1 column · Gap space-3 |
| `ways_lang-list` | No wrap · Overflow: scroll horizontally · Margin left/right −24px · Padding space-1 space-5 (one sideways-scrolling row) |

**Mobile portrait**

| Class | Changes |
|---|---|
| `ways_lang-list` | Margin left/right −16px · Padding space-1 space-4 |

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
| Centre-out line | `::after` with `scaleX(0)` → `scaleX(1)` and `transform-origin: center`; dur-slow ease-out to grow, dur-base ease-in to shrink |
| Hover preview | Inactive tab hover: `scaleX(0.3)` at 40% opacity |
| Desktop panel swap | Old panel fades out over dur-fast; new panel's pieces rise 12px and fade in over dur-base, staggered 50ms; the visual scales from 0.96 |
| Accordion height | `grid-template-rows: 0fr` → `1fr` over dur-base; the chevron rotates 180° |
| Reduced motion | The global CSS (Part 1.6) cuts every transition to 0.01ms, so all of this becomes instant |

**Why not Interactions:** the active state is decided by the script, and so are the rules ("can't close", keyboard, ARIA). Class-driven CSS transitions keep the motion and the state in one place, and they respect reduced motion through the global CSS automatically.

### Custom code (`ways_script`, last child of `ways_component`)

```html
<style>
/* ---------- Header buttons (tab / accordion header) ---------- */
.ways_h { margin: 0; font: inherit; }
.ways_tab { position: relative; width: 100%; min-height: 56px; display: flex; align-items: center; gap: 14px;
  padding: 16px 0; border: 0; background: none; text-align: left; cursor: pointer;
  font-family: var(--typography--font-display, 'Bricolage Grotesque', sans-serif); font-size: var(--typography--text-h3, 1.25rem); font-weight: 500;
  color: var(--colors--ink-muted, #5A5F7A); transition: color var(--dur-fast) var(--ease-out); }
.ways_tab.is-active { color: var(--colors--ink, #14162B); cursor: default; } /* can't be closed: don't look clickable */
.ways_icon { flex: none; display: grid; color: var(--colors--brand, #0E6B47); }
.ways_chevron { flex: none; margin-left: auto; color: var(--colors--ink-muted, #5A5F7A); transition: transform var(--dur-base) var(--ease-out); }
.ways_tab.is-active .ways_chevron { transform: rotate(180deg); }
.ways_tab:focus-visible { outline-offset: -3px; border-radius: 8px; }

/* The centre-out line: full width, squashed to nothing with scaleX(0);
   transform-origin: center makes it grow (and shrink) from the middle. */
.ways_tab::after { content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px;
  background: var(--colors--brand, #0E6B47); transform: scaleX(0); transform-origin: center;
  transition: transform var(--dur-base) var(--ease-in), opacity var(--dur-base) var(--ease-in); }
.ways_tab.is-active::after { transform: scaleX(1); opacity: 1; transition: transform var(--dur-slow) var(--ease-out); }
@media (hover: hover) {
  .ways_tab:not(.is-active):hover { color: var(--colors--ink, #14162B); }
  .ways_tab:not(.is-active):hover::after { transform: scaleX(0.3); opacity: 0.4; }
}

/* Chip dot */
.ways_panel-chip::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--colors--brand, #0E6B47); }

/* ---------- Accordion: height via grid rows 0fr -> 1fr ---------- */
.is-accordion .ways_panel { grid-template-rows: 0fr; visibility: hidden;
  transition: grid-template-rows var(--dur-base) var(--ease-out), visibility 0s linear var(--dur-base); }
.is-accordion .ways_panel.is-open { grid-template-rows: 1fr; visibility: visible;
  transition: grid-template-rows var(--dur-base) var(--ease-out), visibility 0s; }
.ways_panels:empty { display: none; }
.is-instant, .is-instant *, .is-instant *::after { transition: none !important; } /* first frame / layout switch */

/* ---------- Desktop tabs (the script adds .is-tabs at >= 992px) ---------- */
@media (min-width: 992px) {
  .ways_tabs.is-tabs { display: grid; grid-template-columns: 28% minmax(0, 1fr); }
  .is-tabs .ways_list { border-right: 1px solid var(--colors--line, #DADDEA); }
  .is-tabs .ways_item:last-child { border-bottom: 0; }
  .is-tabs .ways_tab { padding: 28px 24px 28px 0; font-size: var(--typography--text-h3, 1.25rem); }
  .is-tabs .ways_chevron { display: none; }
  .is-tabs .ways_panels { display: grid; align-items: center; padding: 40px 0 40px clamp(32px, 4vw, 64px); }
  .is-tabs .ways_panel { grid-area: 1 / 1; transition: opacity var(--dur-fast) var(--ease-out); }  /* panels share one cell */
  .is-tabs .ways_panel.is-leaving { opacity: 0; }
  .is-tabs .ways_panel-body { grid-template-columns: minmax(0, 1fr) minmax(0, .95fr); align-items: center;
    gap: clamp(32px, 4vw, 56px); padding: 4px 0; }
  .is-tabs .ways_panel-text { gap: 20px; }
  .is-tabs .ways_panel-title { display: block; font-family: var(--typography--font-display, 'Bricolage Grotesque', sans-serif);
    font-size: var(--typography--text-h2, 2.25rem); font-weight: 400; line-height: 1.05; letter-spacing: -0.02em; }
  .is-tabs .ways_cta { align-self: flex-start; }
  .is-tabs .vig.is-card { margin-left: auto; }

  /* Incoming panel: pieces rise 12px and fade in, staggered by --d; visual scales from .96. */
  .is-tabs [data-anim] { transition: opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out); }
  .is-tabs [data-anim]:nth-child(2) { transition-delay: 50ms; }
  .is-tabs [data-anim]:nth-child(3) { transition-delay: 100ms; }
  .is-tabs [data-anim]:nth-child(4) { transition-delay: 150ms; }
  .is-tabs .ways_visual { transition: opacity var(--dur-base) var(--ease-out) 100ms, transform var(--dur-base) var(--ease-out) 100ms; }
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
    }, 160); // = --dur-fast, the old panel's fade-out
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
| `vig` | Padding space-3 space-4 · Background surface · Radius radius-md · Colour ink · Size text-small · Shadow 0 20px 40px −24px rgba(20,22,43,0.8) |
| `vig_head` | Flex · Space between · Align center · Gap space-3 · Padding bottom 10px · Border bottom 1px line · Weight 600 |
| `vig_head` + `is-code` | Font font-code · Weight 500 · Size text-caption · Colour ink-muted |
| `vig_tag` | Padding 2px space-2 · Radius radius-pill · Background canvas · Size text-caption · Weight 500 · Colour ink-muted |
| `vig_plus` | Colour payout |
| `vig_rows` | No list style · Padding 0 · Margin 0 |
| `vig_row` | Flex · Space between · Padding space-2 0 · Border bottom 1px line (last one: none; use the `:last-child` state in the selector menu) |
| `vig_pr` | Colour ink-muted |
| `vig_amount` | Font font-code · Weight 600 · Colour payout |
| `vig_diff` | Margin top space-2 · Font font-code · Size text-caption · Line height leading-code · Radius radius-sm · Overflow hidden |
| `vig_line` | Grid, columns `1.6em 1fr` · Padding right 8px · White space pre |
| `vig_line` + `is-add` | Background payout-tint |
| `vig_sign` | Text align center · Colour ink-muted (`is-add` → payout) |
| `vig_bubble` | Margin top space-3 · Padding space-2 space-3 · Radius radius-sm · Background brand-tint · Size text-caption · Line height leading-normal |
| `vig_bubble-label` | Block · Margin bottom 2px · Size text-caption · Weight 600 · Letter spacing tracking-wide · Uppercase · Colour brand |
| `vig_title` | Font font-display · Size text-body · Weight 600 |
| `vig_ai` | Margin top space-2 · Padding space-2 space-2 · Radius radius-sm · Background brand-tint · Size text-caption |
| `vig_ai-strong` | Colour brand |
| `vig_posted` | Margin top space-2 · Flex · Space between · Padding space-2 0 · Border top and bottom 1px line · Colour ink-muted |
| `vig_posted-amount` | Font font-code · Weight 600 · Colour ink |
| `vig_counter` | Margin top space-2 · Flex, wrap · Align center · Gap space-2 · Size text-caption |
| `vig_avatar` | 22 × 22px · Radius 50% · Grid centred · Background brand-tint · Colour brand · Size text-caption · Weight 700 |
| `vig_chips` | Margin left auto · Flex · Gap space-2 |
| `vig_chip` | Padding space-1 space-2 · Radius radius-pill · Border 1px line · Size text-caption · Weight 600 · Colour ink-muted |
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
| `paths_lede` | Margin top space-4 · Max width measure-narrow · Size text-body-lg · Colour on-dark-muted |
| `paths_bg-list` | Display none |
| `paths_media-list` | Grid, 1 column. Set **every `paths_media` to row 1 / col 1** (Manual) so they stack |
| `paths_media` | Flex vertical · Gap space-5 · Padding `clamp(16px, 2vw, 24px)` · Background on-dark-surface · Border 1px on-dark-line · Radius radius-lg |
| `paths_media-stage` | Flex grow 1 · Grid · Align center |
| `paths_media-caption` | Font font-display · Size text-h3 · Weight 500 · Line height leading-snug · Colour surface |
| `paths_media-sub` | Margin top space-1 · Size text-small · Colour on-dark-muted |
| `paths_card-list` | Grid, 1 column. Set **every `paths_card` to row 1 / col 1** (Manual) |
| `paths_card` | Flex vertical · Padding `clamp(20px, 2.4vw, 32px)` (fallback 32px) · Background on-dark-surface · Border 1px on-dark-line · Radius radius-lg |
| `paths_card-meta` | Flex · Align center · Gap space-3 · Padding bottom 18px · Border bottom 1px on-dark-line · Size text-small |
| `paths_card-num` | Font font-code · Weight 500 |
| `paths_line` | Position relative · Flex grow 1 · Height 1px · Overflow hidden · Background on-dark-line |
| `paths_line-fill` | Position absolute, Full (inset 0) · Background surface · **Transform origin: left center** (Style panel → Transforms → settings) |
| `paths_card-title` | Margin top space-5 · Font font-display · Size text-h2 · Weight 400 · Line height leading-tight · Letter spacing tracking-tight |
| `paths_card-quote` | Margin top space-5 · Grid, columns `auto 1fr` · Gap space-3 · Size text-body-lg · Line height leading-normal · Padding 0 · Border none |
| `paths_card-mark` | Colour brand-tint · Margin top 2px |
| `paths_card-who` | Margin top space-2 · Padding left 34px, bottom 20px · Border bottom 1px on-dark-line · Size text-caption · Colour on-dark-muted |
| `paths_card-body` | Margin top space-5 · Size text-small · Line height leading-normal · Colour on-dark-muted |
| `paths_controls` | No styles. Its bar starts with `hidden`, and the script shows it only below 992px |

The Interaction sets every opacity and the line scale, so leave those at their defaults in the Style panel.

**Sticky gotcha:** `position: sticky` stops working if *any* ancestor has `overflow: hidden` (or auto). Check `page-wrapper`, `main-wrapper` and `section_paths`: their overflow must be Visible. That's why the global CSS uses `overflow: clip` on the hero only, never on wrappers.

**Tablet**

| Class | Changes |
|---|---|
| `section_paths` | Height auto · Padding top/bottom `clamp(64px, 10vw, 112px)` (fallback 88px) |
| `paths_pin` | Position static · Height auto · Display block · Overflow visible |
| `paths_component` | 1 column · Gap `clamp(28px, 5vw, 40px)` (fallback 36px) |
| `paths_card-list` | **Flex**, horizontal, no wrap · Gap space-3 · Overflow: scroll horizontally · Margin left/right `-32px` · Padding space-1 space-6 (the negative margin lets the row run edge to edge) · Custom properties: `scroll-snap-type: x mandatory`, `scroll-padding-inline: 32px`, `overscroll-behavior-x: contain` |
| `paths_card` | Width `min(86%, 440px)` · Flex shrink 0 · Custom property `scroll-snap-align: start` |
| `paths_card-title` | Size fallback 3rem |

**Mobile landscape**

| Class | Changes |
|---|---|
| `paths_card-list` | Margin left/right −24px · Padding space-1 space-5 · `scroll-padding-inline: 24px` |

**Mobile portrait**

| Class | Changes |
|---|---|
| `paths_card-list` | Margin left/right −16px · Padding space-1 space-4 · `scroll-padding-inline: 16px` |
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
  border-radius: 999px; background: var(--colors--on-dark-control, rgba(255,255,255,.4)); transition: background-color var(--dur-base) var(--ease-out); }
.paths_seg[aria-current="true"]::before { background: var(--colors--surface, #FFF); }
.paths_counter { flex: none; margin: 0; font-family: var(--typography--font-code, 'IBM Plex Mono', monospace);
  font-size: var(--typography--text-small, 0.875rem); color: var(--colors--on-dark-muted, rgba(255,255,255,.72)); }
.paths_counter span { color: var(--colors--surface, #FFF); }

/* ---------- Tablet & mobile carousel ----------
   !important beats any inline styles the desktop Interaction left behind
   (e.g. after resizing a desktop window down). */
@media (max-width: 991px) {
  .section_paths { transition: background-color var(--dur-slower) var(--ease-out);
    background-color: var(--colors--path-earn-bg, #0B3B2C) !important; }
  .section_paths[data-active="1"] { background-color: var(--colors--path-grow-bg, #102F3A) !important; }
  .section_paths[data-active="2"] { background-color: var(--colors--path-ship-bg, #3A2A0E) !important; }

  /* Only the active media card shows; it wipes in from the top. */
  .paths_media { transition: opacity var(--dur-slow) var(--ease-out); }
  .paths_media.is-active { opacity: 1 !important; }
  .paths_media:not(.is-active) { opacity: 0 !important; pointer-events: none; }
  .paths_media-stage { clip-path: inset(0 0 0 0 round 12px);
    transition: opacity var(--dur-slow) var(--ease-out), transform var(--dur-slower) var(--ease-out), clip-path var(--dur-slower) var(--ease-out); }
  .paths_media:not(.is-active) .paths_media-stage { opacity: 0; transform: scale(.96); clip-path: inset(0 0 100% 0 round 12px); }
  .paths_media-caption, .paths_media-sub { transition: opacity var(--dur-slow) var(--ease-out), transform var(--dur-slow) var(--ease-out); }
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
            │  └─ button is-secondary is-large (Link Block → #): "See all 24 bounties" + button_icon
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
            │           │  └─ button is-primary is-small (Link Block ← Claim URL)
            │           │     ├─ Text Block: "Claim bounty"
            │           │     ├─ sr-only (Text Block) ← Name
            │           │     └─ button_icon (Code Embed)
            │           └─ board_offer (Code Embed with CMS fields: counter-offer)
            ├─ board_empty (Div)                           [hidden, data-empty]
            │  ├─ Paragraph: "No bounties match these filters yet."
            │  └─ Code Embed: <button> Clear filters
            ├─ board_cta (Div)
            │  └─ button is-primary is-large (Link Block → #): "See all open bounties" + button_icon
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
| `board_header` | Grid, 2 columns `1fr auto` · Gap space-5 · Align items end |
| `board_title` | Weight 600 |
| `board_title-line` | Display block |
| `board_lede` | Margin top space-4 · Max width measure-narrow · Size text-body-lg · Colour ink-muted |
| `board_filters` | Margin top gap-section-head · Grid, 2 columns auto auto · Justify start · Column gap space-8 · Row gap space-4 |
| `board_filter` | Grid · Gap space-2 · Min width 0 |
| `board_filter-label` | Size text-caption · Weight 600 · Letter spacing tracking-wide · Uppercase · Colour ink-muted |
| `board_chips` | Flex, wrap · Gap space-2 · Padding space-2 0 (room for focus rings) |
| `board_list-wrapper` | Margin top `clamp(24px, 3vw, 36px)` · Padding top 8px |
| `board_list` | Grid, 3 columns · Gap `clamp(14px, 1.6vw, 24px)` (fallback 24px) |
| `board_item` | (no styles; the embed CSS adds the filter fade) |
| `board_card` | Position relative · Flex vertical · Height 100% · Padding `clamp(22px, 2.2vw, 30px)` · Background surface · Border 1px line · Radius radius-lg |
| `board_card-tags` | Flex, wrap · Gap space-2 · No list style · Padding 0 · Margin 0 |
| `board_card-repo` | Margin top space-4 · Font font-code · Size text-caption · Colour ink-muted |
| `board_card-title` | Margin top space-2 · Size text-h3 · Weight 600 · Line height leading-snug · Letter spacing tracking-tight |
| `board_card-desc` | Margin top space-2 · Size text-small · Line height leading-normal · Colour ink-muted (2-line clamp in the embed CSS) |
| `board_card-meta` | Margin top space-4, bottom 24px · Flex, wrap · Gap space-4 · Size text-small · No list style · Padding 0 |
| `board_card-meta-item` | Inline-flex · Align center · Gap space-2 (the icon colour comes from the embed CSS) |
| `board_card-footer` | Margin top auto · Padding top 20px · Border top 1px line · Flex, wrap · Space between · Align center · Gap space-3 |
| `board_card-price` | Grid · Line height leading-tight |
| `board_card-amount` | Font font-display · Size text-h2 · Weight 700 · Letter spacing tracking-tight · Colour ink |
| `board_card-paid` | Margin top space-1 · Size text-caption · Weight 600 · Colour payout |
| `board_empty` | Margin top space-2 · Padding space-6 · Grid, centred · Gap space-4 · Text align center · Border 1.5px dashed ink-muted · Radius radius-lg · Colour ink-muted |
| `board_cta` | Margin top `clamp(28px, 4vw, 48px)` · Flex · Justify center |

**Tablet**

| Class | Changes |
|---|---|
| `board_header` | 1 column · Justify items start |
| `board_filters` | 1 column |
| `board_list-wrapper` | Overflow: scroll horizontally · Margin left/right −32px · Padding space-2 space-6 space-4 · Custom properties: `scroll-snap-type: x mandatory`, `scroll-padding-inline: 32px`, `overscroll-behavior-x: contain` |
| `board_list` | **Flex**, horizontal, no wrap |
| `board_item` | Width 45% · Flex shrink 0 · Display flex · Custom property `scroll-snap-align: start` |
| `board_cta` > `button` | Width 100% |

**Mobile landscape**

| Class | Changes |
|---|---|
| `board_chips` | No wrap · Overflow: scroll horizontally · Margin left/right −24px · Padding space-2 space-5 (one sideways-scrolling row of chips) |
| `board_list-wrapper` | Margin left/right −24px · Padding space-2 space-5 space-4 · `scroll-padding-inline: 24px` |
| `board_item` | Width 85% |

**Mobile portrait**

| Class | Changes |
|---|---|
| `board_chips` | Margin left/right −16px · Padding space-2 space-4 |
| `board_list-wrapper` | Margin left/right −16px · Padding space-2 space-4 space-4 · `scroll-padding-inline: 16px` |

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
        <button type="submit" class="button is-primary is-small">Send offer</button>
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

The `button` classes come from the Designer's styles, so they work inside embeds. Make sure at least one element on the page uses `button is-primary is-small` and `button is-secondary is-small`, or Webflow may not publish those combo styles.

### Custom code (`board_script` embed, last in the section)

```html
<style>
/* Filter fade: matching cards fade back in, others fade and shrink out (the script adds .is-out). */
.board_item { transition: opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out); }
.board_item.is-out { opacity: 0; transform: scale(0.96); }

/* Filter chips (built by the script). Pressed = dark fill. Border is ink-muted (3:1 for controls). */
.chip { flex: none; min-height: 40px; padding: 0 16px; cursor: pointer;
  border: 1px solid var(--colors--ink-muted, #5A5F7A); border-radius: 999px;
  background: var(--colors--surface, #FFF); color: var(--colors--ink, #14162B);
  font-family: inherit; font-size: var(--typography--text-small, 0.875rem); font-weight: 500; transition: background-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out); }
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
  font-size: var(--typography--text-small, 0.875rem); font-weight: 500; color: var(--colors--ink-muted, #5A5F7A); text-underline-offset: 0.2em; }
.board_counter { margin-top: 10px; }
.board_counter:hover, .board_offer-cancel:hover { color: var(--colors--ink, #14162B); text-decoration: underline; }
.board_counter[aria-expanded="true"] { color: var(--colors--ink, #14162B); }

/* Panel height animation without measuring: a one-row grid whose row goes from
   0fr (no height) to 1fr (content height). visibility:hidden while closed keeps
   the fields out of the tab order and away from screen readers. */
.board_offer { display: grid; grid-template-rows: 0fr; visibility: hidden;
  transition: grid-template-rows var(--dur-base) var(--ease-out), visibility 0s linear 260ms; }
.board_offer.is-open { grid-template-rows: 1fr; visibility: visible; transition: grid-template-rows var(--dur-base) var(--ease-out), visibility 0s; }
.board_offer-clip { min-height: 0; overflow: hidden; margin: -6px; padding: 6px; } /* padding keeps focus rings visible */
.board_offer-form { margin-top: 8px; padding: 16px; border-radius: 8px; background: var(--colors--canvas, #F6F7FB); }
.board_offer-label { display: block; font-size: var(--typography--text-small, 0.875rem); font-weight: 600; }
.board_offer-field { margin-top: 6px; display: flex; align-items: center; border-radius: 8px;
  border: 1px solid var(--colors--ink-muted, #5A5F7A); background: var(--colors--surface, #FFF); }
.board_offer-field:focus-within { outline: 3px solid var(--colors--brand, #0E6B47); outline-offset: 2px; }
.board_offer-field:has([aria-invalid="true"]) { border-color: var(--colors--removed, #B42318); }
.board_offer-prefix { padding-left: 12px; font-weight: 600; color: var(--colors--ink-muted, #5A5F7A); }
.board_offer-input { flex: 1; min-width: 0; min-height: 44px; padding: 0 12px 0 4px; border: 0; background: transparent;
  font-size: var(--typography--text-body, 1rem); font-variant-numeric: tabular-nums; }
.board_offer-input:focus-visible { outline: none; } /* the field wrapper shows the ring */
.board_offer-input[aria-invalid="true"] { color: var(--colors--removed, #B42318); }
.board_offer-hint, .board_offer-error, .board_offer-note { margin: 8px 0 0; font-size: var(--typography--text-caption, 0.75rem); line-height: 1.45; }
.board_offer-hint { color: var(--colors--ink-muted, #5A5F7A); }
.board_offer-error { font-weight: 600; color: var(--colors--removed, #B42318); }
.board_offer-actions { margin-top: 14px; display: flex; align-items: center; gap: 16px; }
.board_offer-sent { margin-top: 12px; font-size: var(--typography--text-small, 0.875rem); font-weight: 600; color: var(--colors--payout, #0E6B47); }
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
  const FADE_MS = 200; // a little longer than --dur-fast (160ms), so the fade always finishes
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

## Part 2.5: Contributors

**Background:** surface.

- Quote-led stories from contributors and maintainers, in a horizontal scroll-snap carousel: 3 cards in view on Desktop, 2 on Tablet, 1 plus a peek of the next on phones.
- The track runs to the right edge of the screen (full bleed), while the first card lines up with the heading.
- Prev and next buttons move one page, dots show the page, arrow keys move one card, and a mouse can drag the track. Swiping works without any JavaScript.

**Webflow vs native:** Webflow's Slider element hides off-screen slides, doesn't snap like a native scroll, and its arrows aren't real `<button>`s. Here the cards are a CMS Collection List that scrolls natively, and a small script adds the buttons, dots and keyboard support.

### CMS Collection: "Contributors"

**CMS panel → Create collection → "Contributors"** (singular item name "Contributor").

| Field | Webflow type | Required | Notes |
|---|---|---|---|
| Name | Plain text (built-in) | ✓ | e.g. `Amara O.` |
| Slug | Slug (built-in) | ✓ | |
| Repo | Plain text | ✓ | Shown in the code font |
| Stat | Plain text | ✓ | e.g. `Merged in 3 hrs` |
| Quote | Plain text | ✓ | Without quotation marks: the CSS adds them |
| Role | Plain text | ✓ | e.g. `Robotics engineer` |
| Country | Plain text | ✓ | Shown on its own line under the role |
| Avatar | Image | | Square photo, at least 88 × 88px. When empty, the initial shows instead |
| Initial | Plain text | ✓ | First letter of the name, shown when there's no Avatar |
| PR URL | Link | | Where "View PR" goes (defaults to `#`) |
| Sort order | Number | ✓ | Controls the card order |

**Items** (sample demo content: fictional people, repos and numbers):

| Sort | Name | Initial | Repo | Stat | Role | Country | Quote |
|---|---|---|---|---|---|---|---|
| 1 | Amara O. | A | openarm/gripper-sim | Merged in 3 hrs | Robotics engineer | Nigeria | I've debugged flaky robot sims for years. An AI tool wrote the fix in minutes, but knowing the gripper raced the physics step was the real work. |
| 2 | Lena W. | L | orbitkit/propagator | Merged in 5 hrs | Flight software engineer | Germany | The issue sat open for two months. It was a batching bottleneck I'd fixed in flight software before. PR up before lunch, paid by dinner. |
| 3 | Tomás R. | T | groundlink/telemetry | Merged in 1 day | Embedded developer | Argentina | I'm no Go expert, but I've decoded satellite beacons for years. AI helped with the syntax. I knew what those AX.25 frames actually meant. |
| 4 | Kenji T. | K | openarm/motion-planner | Merged same day | Robotics developer | Japan | No proposal, no invoice. I picked the arm-jitter bounty, shipped the smoothing fix, and the payout landed minutes after the merge. |
| 5 | Priya S. | P | relaykit/agents | 30 issues closed | Agent framework maintainer | India | I don't care if a PR was written with AI. I care that it solves the issue, and the review checks exactly that. |
| 6 | Sofia R. | S | trailbot/nav-stack | 18 PRs merged | Junior robotics developer | Mexico | Every review told me what was missing and why. My merged simulation tests became the portfolio that got me interviews. |

### Element tree

The heading sits in the normal container, but the card track sits **outside** it, directly in the section, so it can run to the screen edge.

```
section_contrib (Section, id: contributors)            [aria-labelledby, data-contrib]
├─ padding-global
│  └─ container-large
│     └─ contrib_header (Div)
│        ├─ contrib_title (H2, id: contrib-title): "Expertise gets merged. However you write the code."
│        ├─ contrib_lede (Paragraph)
│        └─ contrib_nav-embed (Code Embed: prev, dots, next)
├─ contrib_collection (Collection List Wrapper → Contributors)
│  └─ contrib_list (Collection List)                    [data-track, role, aria-roledescription, aria-label, tabindex]
│     └─ contrib_item (Collection Item)                 [data-slide, role, aria-roledescription]
│        └─ contrib_card (Div, tag: article)
│           ├─ contrib_card-top (Div)
│           │  ├─ contrib_card-repo (Text Block) ← Repo
│           │  └─ contrib_card-stat (Div)
│           │     ├─ Code Embed: merge icon
│           │     └─ Text Block ← Stat
│           ├─ contrib_card-quote (Block Quote) ← Quote
│           └─ contrib_card-foot (Div)
│              ├─ contrib_card-person (Div)
│              │  ├─ contrib_card-avatar (Image ← Avatar)          [visible when Avatar is set]
│              │  ├─ contrib_card-initial (Div) ← Initial          [visible when Avatar is not set]
│              │  └─ contrib_card-who (Div)
│              │     ├─ contrib_card-name (Paragraph) ← Name
│              │     └─ contrib_card-role (Paragraph)
│              │        ├─ contrib_card-role-part (Text Span) ← Role
│              │        ├─ sr-only (Text Span): " · "
│              │        └─ contrib_card-role-part (Text Span) ← Country
│              └─ contrib_card-link (Link Block ← PR URL)
│                 ├─ Text Span: "View PR"
│                 ├─ sr-only (Text Span): " by "
│                 ├─ sr-only (Text Span) ← Name
│                 └─ Code Embed: arrow icon
├─ contrib_live (Paragraph, class sr-only)             [aria-live=polite, data-live]
└─ contrib_script (Code Embed: CSS + script; see "Custom code")
```

**Collection List settings:** Sort by Sort order, ascending. No limit.

**Conditional visibility:** select `contrib_card-avatar` → Element settings → Conditional visibility → *Avatar is set*. Select `contrib_card-initial` → *Avatar is not set*. On the avatar image, set the Alt text to the **Name** field.

**Icons** (Code Embeds):

```html
<!-- merge icon (in contrib_card-stat) -->
<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true" focusable="false"><circle cx="4.5" cy="3.5" r="1.75"/><circle cx="4.5" cy="12.5" r="1.75"/><circle cx="11.5" cy="8" r="1.75"/><path d="M4.5 5.25v5.5M4.5 5.25c0 2.4 2 2.75 5.25 2.75"/></svg>

<!-- arrow icon (in contrib_card-link) -->
<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
```

### Styles per breakpoint

The track, the card box (width, snapping, background, hover shadow, divider) and the navigation are styled by the CSS in `contrib_script`, because they need `calc()`, scroll snapping and a container query. Style the text in the Style panel:

**Desktop (base)**

| Class | Styles |
|---|---|
| `section_contrib` | Background surface · Colour ink · Padding top/bottom section-pad |
| `contrib_title` | Weight 600 · Max width 22ch (size comes from All H2: text-h1) |
| `contrib_lede` | Margin top space-4 · Max width measure · Size text-body-lg · Colour ink-muted |
| `contrib_card-top` | Flex, wrap · Align center · Justify space-between · Row gap space-2 · Column gap space-4 · Size text-caption |
| `contrib_card-repo` | Font font-code · Colour ink |
| `contrib_card-stat` | Margin left auto · Inline-flex · Align center · Gap space-2 · Colour ink-muted. The icon inside: Colour brand |
| `contrib_card-quote` | Margin 0 · Padding 0 · Border none · Font font-display · Size text-body-lg · Weight 500 · Line height leading-normal · Colour ink |
| `contrib_card-person` | Flex · Align center · Gap space-3 · Min width 0 |
| `contrib_card-avatar` | 44 × 44px · Radius 50% · Object fit cover · Flex none |
| `contrib_card-initial` | 44 × 44px · Radius 50% · Grid, centred · Flex none · Background canvas · Border 1px line · Font font-display · Weight 600 · Colour ink |
| `contrib_card-name` | Size text-small · Weight 600 · Line height leading-snug |
| `contrib_card-role` | Size text-caption · Line height leading-normal · Colour ink-muted |
| `contrib_card-role-part` | Display block (role and country on their own lines, so every card breaks the same way) |
| `contrib_card-link` | Flex none · Inline-flex · Align center · Gap space-1 · Padding top/bottom space-2 · Size text-small · Weight 600 · Colour ink · No underline. **Hover:** Colour ink · Underline |

### Custom code

**1. `contrib_nav-embed`** (last child of `contrib_header`). Hidden until the script runs. Without JavaScript the track still scrolls and snaps, so the buttons would do nothing.

```html
<div class="contrib_nav" data-nav hidden>
  <button class="contrib_btn" type="button" aria-label="Previous stories" data-prev>
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M15 6l-6 6 6 6"/></svg>
  </button>
  <div class="contrib_dots" data-dots></div>
  <button class="contrib_btn" type="button" aria-label="Next stories" data-next>
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9 6l6 6-6 6"/></svg>
  </button>
</div>
```

**2. `contrib_script`** (last child of `section_contrib`). The CSS starts with a **token bridge**: it maps short names like `--brand` to your Webflow Variables (with the hex values as fallbacks), so the rest reads like the Astro source. If your Variables have different CSS names, change them in the bridge only. The HowItWorks, FAQ and FinalCTA embeds work the same way.

```html
<style>
/* ---------- Token bridge: Webflow Variables -> short names ---------- */
.section_contrib {
  --ink: var(--colors--ink, #14162B);
  --ink-muted: var(--colors--ink-muted, #5A5F7A);
  --canvas: var(--colors--canvas, #F6F7FB);
  --surface: var(--colors--surface, #FFFFFF);
  --line: var(--colors--line, #DADDEA);
  --brand: var(--colors--brand, #0E6B47);
  --space-2: var(--spacing--space-2, 8px);
  --space-3: var(--spacing--space-3, 12px);
  --space-4: var(--spacing--space-4, 16px);
  --space-5: var(--spacing--space-5, 24px);
  --space-7: var(--spacing--space-7, 40px);
  --content-width: var(--spacing--content-width, 1240px);
  --content-pad: var(--spacing--content-pad, clamp(16px, 4vw, 56px));
  --radius-sm: var(--radius--radius-sm, 8px);
  --radius-lg: var(--radius--radius-lg, 20px);
  --radius-pill: var(--radius--radius-pill, 999px);

  /* Left edge of the page container, also when the screen is wider than it. */
  --edge: max(var(--content-pad), calc((100% - var(--content-width)) / 2 + var(--content-pad)));
  --gap: var(--space-4);
}
@media (min-width: 768px) { .section_contrib { --gap: 20px; } }

/* ---------- Navigation: prev, dots, next ---------- */
.contrib_nav { margin-top: var(--space-5); display: flex; align-items: center; gap: var(--space-2); }
.contrib_btn {
  flex: none; display: grid; place-items: center; width: 44px; height: 44px; padding: 0; cursor: pointer;
  border: 1px solid var(--line); border-radius: 50%; background: var(--surface); color: var(--ink);
  transition: border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
}
.contrib_btn:hover:not(:disabled), .contrib_btn:focus-visible { border-color: var(--brand); color: var(--brand); }
.contrib_btn:disabled { cursor: not-allowed; opacity: 0.4; }
.contrib_dots { display: flex; align-items: center; }
/* Dots are built by the script: 24px hit area, the visible dot is ::before. */
.contrib_dot { display: grid; place-items: center; width: 24px; height: 24px; padding: 0; border: 0; background: transparent; cursor: pointer; }
.contrib_dot::before {
  content: ''; width: 8px; height: 8px; border-radius: var(--radius-pill); background: var(--ink-muted);
  transition: width var(--dur-fast) var(--ease-out), background-color var(--dur-fast) var(--ease-out);
}
.contrib_dot[aria-current='true'] { width: 36px; }
.contrib_dot[aria-current='true']::before { width: 24px; background: var(--brand); }

/* ---------- Track: the Collection List scrolls sideways ---------- */
.contrib_list {
  position: relative;             /* cards' offsetLeft is measured from here */
  container-type: inline-size;    /* 100cqi = the track's content width */
  display: flex; gap: var(--gap);
  margin-top: var(--space-7);
  padding: var(--space-2) var(--edge) var(--space-5);  /* the padding lines the first card up with the heading */
  overflow-x: auto; overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory; scroll-padding-inline: var(--edge);
  scrollbar-width: none;
}
.contrib_list::-webkit-scrollbar { display: none; }
.contrib_list:focus-visible { outline: 3px solid var(--brand); outline-offset: -3px; border-radius: var(--radius-sm); }
@media (hover: hover) and (pointer: fine) {
  .contrib_list { cursor: grab; }
  .contrib_list.is-dragging { cursor: grabbing; user-select: none; scroll-snap-type: none; }
}

/* ---------- Card: width = cards per view (N cards + N-1 gaps fill the track) ---------- */
.contrib_item {
  flex: 0 0 calc((100cqi - var(--gap)) / 1.1);  /* phones: about 1.1 cards in view */
  scroll-snap-align: start;
  display: flex;
}
@media (min-width: 768px) { .contrib_item { flex-basis: calc((100cqi - var(--gap)) / 2); } }       /* tablet: 2 */
@media (min-width: 992px) { .contrib_item { flex-basis: calc((100cqi - 2 * var(--gap)) / 3); } }   /* desktop: 3 */

.contrib_card {
  --pad: 20px;
  container-type: inline-size;   /* the footer adapts to the card's own width */
  width: 100%;
  display: flex; flex-direction: column; gap: var(--space-4);
  padding: var(--pad);
  background: linear-gradient(to bottom, var(--canvas), var(--surface));
  border: 1px solid var(--line); border-radius: var(--radius-lg);
  transition: box-shadow var(--dur-fast) var(--ease-out);
}
@media (min-width: 768px) { .contrib_card { --pad: var(--space-5); } }
.contrib_card:hover { box-shadow: var(--shadow-md); }

.contrib_card-quote::before { content: '“'; }
.contrib_card-quote::after { content: '”'; }

/* Divider + person row: margin-top auto pins the footer to the bottom so it lines
   up across cards; the negative side margins let the dashed line run edge to edge. */
.contrib_card-foot {
  margin: auto calc(-1 * var(--pad)) 0;
  padding: var(--space-4) var(--pad) 0;
  border-top: 1px dashed var(--line);
  display: flex; align-items: center; justify-content: space-between; gap: var(--space-4);
}
/* Narrow cards: "View PR" drops under the name, lined up with it. */
@container (max-width: 299px) {
  .contrib_card-foot { flex-wrap: wrap; row-gap: 0; }
  .contrib_card-link { flex-basis: 100%; padding-left: calc(44px + var(--space-3)); }  /* avatar + gap */
}
</style>

<script>
(() => {
  const section = document.querySelector('[data-contrib]');
  if (!section) return;

  const track = section.querySelector('[data-track]');
  const slides = [...section.querySelectorAll('[data-slide]')];
  const prev = section.querySelector('[data-prev]');
  const next = section.querySelector('[data-next]');
  const dotsBox = section.querySelector('[data-dots]');
  const live = section.querySelector('[data-live]');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const count = slides.length;

  section.querySelector('[data-nav]').hidden = false;

  // Each card announces its position: "1 of 6: Amara O."
  slides.forEach((s, i) => {
    const name = s.querySelector('.contrib_card-name')?.textContent.trim() ?? '';
    s.setAttribute('aria-label', `${i + 1} of ${count}: ${name}`);
  });

  // Cards per page: phones 1, tablet 2, desktop 3 (widest match first).
  const breakpoints = [[992, 3], [768, 2], [0, 1]].map(([min, n]) => ({ n, mq: matchMedia(`(min-width: ${min}px)`) }));
  const cardsPerPage = () => Math.min(count, breakpoints.find((b) => b.mq.matches).n);

  let per = cardsPerPage();
  let pages = 0;
  let first = -1;      // index of the card at the start edge
  let dots = [];
  let lockUntil = 0;   // while a button scroll animates, ignore in-between positions

  const maxFirst = () => Math.max(0, count - per);
  const pageOf = (i) => (i >= maxFirst() ? pages - 1 : Math.floor(i / per));
  const padStart = () => parseFloat(getComputedStyle(track).paddingLeft) || 0;
  const maxScroll = () => track.scrollWidth - track.clientWidth;
  const stride = () => (count > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth);
  // Which card is at the start edge? At the very end, the last page.
  const readScroll = () => (track.scrollLeft >= maxScroll() - 2 ? maxFirst() : Math.round(track.scrollLeft / stride()));

  function buildDots() {
    pages = Math.ceil(count / per);
    dots = Array.from({ length: pages }, (_, p) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'contrib_dot';
      b.setAttribute('aria-label', `Go to page ${p + 1}`);
      b.addEventListener('click', () => goTo(p * per));
      return b;
    });
    dotsBox.replaceChildren(...dots);
  }

  function render(i, { announce = false, force = false } = {}) {
    const target = Math.max(0, Math.min(maxFirst(), i));
    if (target !== first || force) {
      first = target;
      dots.forEach((d, p) => (p === pageOf(first) ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')));
    }
    prev.disabled = first <= 0;
    next.disabled = first >= maxFirst();
    if (announce) {
      const last = Math.min(count, first + per) - 1;
      live.textContent = first === last ? `Showing story ${first + 1} of ${count}` : `Showing stories ${first + 1} to ${last + 1} of ${count}`;
    }
  }

  // Scroll so card i sits at the start edge.
  function goTo(i, announce = true) {
    const target = Math.max(0, Math.min(maxFirst(), i));
    const left = Math.min(slides[target].offsetLeft - padStart(), maxScroll());
    lockUntil = performance.now() + 1000;
    track.scrollTo({ left, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    render(target, { announce });
  }

  prev.addEventListener('click', () => goTo(first - per));   // one page back
  next.addEventListener('click', () => goTo(first + per));   // one page on

  track.addEventListener('keydown', (e) => {                 // arrow keys: one card
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(first + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(first - 1); }
  });

  // Swipes and trackpads: follow the scroll position, once per frame.
  let ticking = false;
  track.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      if (performance.now() >= lockUntil) render(readScroll());
    });
  }, { passive: true });
  track.addEventListener('scrollend', () => { lockUntil = 0; render(readScroll()); });

  // Mouse drag-to-scroll (touch already scrolls natively).
  let drag = null;
  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    drag = { x: e.clientX, left: track.scrollLeft, id: e.pointerId, moved: false };
  });
  track.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 4) {   // past 4px it's a drag, not a click
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
    goTo(readScroll(), false);               // settle on the nearest card
  };
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);

  // Resizing can change cards-per-page, so rebuild the dots.
  new ResizeObserver(() => {
    const n = cardsPerPage();
    if (n !== per) { per = n; buildDots(); }
    render(readScroll(), { force: true });
  }).observe(track);

  buildDots();
  render(0, { force: true });
})();
</script>
```

**How the carousel works, in plain language.** The sliding itself is the browser's own sideways scrolling: the list scrolls horizontally, and "scroll snap" makes it stop with a card neatly at the left edge. That's why swiping works even without the script. The script only adds what scrolling can't do on its own. It works out which card is at the edge from the scroll position, so it knows the page for the dots. It scrolls to an exact card when you press a button, a dot or an arrow key, and it disables "previous" on the first page and "next" on the last.

### Interactions

None native. The card hover shadow and the dots are CSS transitions; button scrolling is smooth unless reduced motion is on.

### Accessibility

| Element | Attribute | Value |
|---|---|---|
| section_contrib | ID | `contributors` |
| section_contrib | `aria-labelledby` | `contrib-title` |
| section_contrib | `data-contrib` | `true` |
| contrib_title | ID | `contrib-title` |
| contrib_list | `data-track` | `true` |
| contrib_list | `role` | `region` |
| contrib_list | `aria-roledescription` | `carousel` |
| contrib_list | `aria-label` | `Contributor stories` |
| contrib_list | `tabindex` | `0` (so keyboard users can focus it and use the arrow keys) |
| contrib_item | `data-slide` | `true` |
| contrib_item | `role` | `group` |
| contrib_item | `aria-roledescription` | `slide` (the script adds `aria-label`, e.g. "1 of 6: Amara O.") |
| contrib_card | Tag (Element settings) | `article` |
| contrib_card-initial | `role` / `aria-label` | `img` / bind to **Name** |
| contrib_live | `aria-live` | `polite` |
| contrib_live | `data-live` | `true` |

The "View PR" link's accessible name is "View PR by" plus the person's name (from the `sr-only` spans), so a list of links stays unambiguous.

### Checklist

- [ ] 1440: three cards in view; the first card lines up with the heading; the track runs to the right edge of the screen.
- [ ] Next and previous move one page; the dots follow; "previous" is disabled on the first page and "next" on the last.
- [ ] Click into the track, then use Left/Right: one card at a time. A screen reader announces "Showing stories 4 to 6 of 6".
- [ ] Drag with the mouse: the track follows and settles on the nearest card.
- [ ] 768: two cards. 375: one card with the next peeking; swiping snaps to each card; no horizontal page scroll.
- [ ] Each card's footer (divider, person, View PR) lines up across cards, and on narrow cards "View PR" sits under the name.
- [ ] Cards without an Avatar show the initial in a circle.
- [ ] Disable JavaScript: the buttons are hidden and the track still scrolls and snaps.

---

## Part 2.6: HowItWorks

**Background:** payout-tint, with the content in a white (surface) panel.

- Four steps from open issue to payout: post a bounty → ship a pull request → AI review → merged and paid.
- Left: a decorative "stage" that swaps one small UI card per step. Right: the step list.
- Each step has a thin progress line that fills over 5 seconds, then the next step starts. After step 4 it holds for 1.5 seconds and loops.
- The timer runs only while the section is on screen, and pauses on hover, on keyboard focus, and with the pause button. Clicking a step stops it for good.
- Not scroll-pinned. No load or scroll reveal.

**Webflow vs native:** Webflow Tabs can't do a timed progress line that pauses on hover and focus, and their tab links aren't real `<button>`s. So the step list and the stage live in Code Embeds, and one script drives both. The header and the panel are native elements.

### Element tree

```
section_hiw (Section, id: how-it-works)                [aria-labelledby, data-hiw]
└─ padding-global
   └─ container-large
      └─ padding-section-large
         └─ hiw_component (Div)                        ← the white panel
            ├─ hiw_header (Div, tag: header)
            │  ├─ hiw_title (H2, id: hiw-title): "From open issue to paid, in four steps"
            │  └─ hiw_lede (Paragraph)
            ├─ hiw_grid (Div, Grid)                     [data-comp]
            │  ├─ hiw_stage-embed (Code Embed: the stage, decorative)
            │  └─ hiw_side (Div)
            │     └─ hiw_steps-embed (Code Embed: step list + pause button)
            └─ hiw_script (Code Embed: CSS + script; see "Custom code")
```

`hiw_script` must be the **last child** of `hiw_component`, so the stage and the steps exist when the script runs.

### Styles per breakpoint

Only the native elements are styled in the Style panel. Everything inside the embeds is styled by the CSS in `hiw_script`.

**Desktop (base)**

| Class | Styles |
|---|---|
| `section_hiw` | Background payout-tint · Colour ink |
| `hiw_component` | Background surface · Radius radius-lg · Padding `clamp(24px, 5vw, 64px)` (fallback 64px) |
| `hiw_header` | Max width measure · Margin left/right auto · Text align center |
| `hiw_title` | Weight 600 (size comes from All H2: text-h1) |
| `hiw_lede` | Margin top space-4 · Size text-body-lg · Colour ink-muted |
| `hiw_grid` | Margin top gap-section-head · Grid, 2 columns `45fr 55fr` · Align items center · Column gap `clamp(40px, 5vw, 80px)` (fallback 64px) |
| `hiw_grid` > children | Min width 0 (so the diff's long code lines can't widen a column). Set it on `hiw_side` here; the embed wrappers get it from the CSS |

**Tablet**

| Class | Changes |
|---|---|
| `hiw_component` | Padding space-8 |
| `hiw_grid` | 1 column · Row gap `clamp(32px, 4vw, 40px)` (fallback 40px) |

**Mobile landscape**

| Class | Changes |
|---|---|
| `hiw_component` | Padding space-7 |
| `hiw_grid` | Row gap space-6 |

**Mobile portrait**

| Class | Changes |
|---|---|
| `hiw_component` | Padding space-5 |

### Content

| # | Step title | Description | Tile colour |
|---|---|---|---|
| 1 | Post a bounty | A maintainer turns an issue into a bounty. AI reads the issue and suggests a fair price based on its complexity. | brand |
| 2 | Ship a pull request | Claim a bounty that matches your expertise. It's reserved for you while you work. Use any tools you like, AI included: you're accountable for the PR. | brand |
| 3 | AI reviews it | Within minutes, the review checks your PR against the bounty's requirements and runs the project's tests. If anything's missing, it tells you exactly what. | brand |
| 4 | Merged and paid | The maintainer's merge is the final check. Your payout goes out via PayPal right away, wherever you are. | payout |

- **Lede:** No proposals, no invoices, no waiting 30 days. Just merged code and a payout.
- **Stage cards (sample demo content):** the same fictional bounty as the hero image: `openarm/motion-planner`, "Fix arm jitter near joint limits", AI range $800–$1,050, posted at $900, PR #482 by `amara-o`.

The step texts appear twice in the embeds: once in the stage's label pill and once in the step list. Change both when you edit a title.

### Custom code

**1. `hiw_stage-embed`** (first child of `hiw_grid`). The whole stage is `aria-hidden`: everything it shows is also in the step list as real text.

```html
<div class="hiw_stage" aria-hidden="true" data-stage data-active="0">
  <div class="hiw_glow"></div>

  <!-- Label pill: slides between left and right; its text crossfades. -->
  <div class="hiw_pill">
    <span class="hiw_pill-texts">
      <span class="hiw_pill-text is-active" data-pill-text>Post a bounty</span>
      <span class="hiw_pill-text" data-pill-text>Ship a pull request</span>
      <span class="hiw_pill-text" data-pill-text>AI reviews it</span>
      <span class="hiw_pill-text" data-pill-text>Merged and paid</span>
    </span>
    <svg class="hiw_arrow" viewBox="0 0 48 40" width="48" height="40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M6 4c4 18 16 28 34 30"/><path d="M33 28l7 6-8 3"/></svg>
  </div>

  <!-- Step 1: the bounty card -->
  <div class="hiw_card is-active" data-card>
    <div class="ui">
      <p class="ui_repo"><code>openarm/motion-planner</code></p>
      <p class="ui_title">Fix arm jitter near joint limits</p>
      <p class="ui_ai">
        <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor" focusable="false"><path d="M8 1.5l1.6 4.1 4.1 1.6-4.1 1.6L8 12.9 6.4 8.8 2.3 7.2l4.1-1.6z"/></svg>
        AI suggested: <strong>$800–$1,050</strong>
      </p>
      <div class="ui_row"><span>Bounty posted</span><strong class="ui_price">$900</strong></div>
    </div>
  </div>

  <!-- Step 2: the code diff -->
  <div class="hiw_card" data-card>
    <div class="ui is-flush">
      <div class="ui_diff-head">
        <span class="ui_opened">
          <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" focusable="false"><circle cx="4.5" cy="3.5" r="1.75"/><circle cx="4.5" cy="12.5" r="1.75"/><circle cx="11.5" cy="12.5" r="1.75"/><path d="M4.5 5.25v5.5M11.5 10.75V7a2 2 0 0 0-2-2H7.5"/></svg>
          PR #482 opened
        </span>
        <span><span class="ui_add">+3</span> <span class="ui_del">−2</span></span>
      </div>
      <p class="ui_file"><code>src/control/ik_solver.cpp</code></p>
      <div class="ui_diff">
        <div class="ui_line is-del"><span class="ui_num">88</span><span class="ui_sign">−</span><code>  q_cmd = ik.solve(target);</code></div>
        <div class="ui_line is-del"><span class="ui_num">89</span><span class="ui_sign">−</span><code>  arm.send(q_cmd);</code></div>
        <div class="ui_line is-add"><span class="ui_num">88</span><span class="ui_sign">+</span><code>  q_cmd = ik.solve(target, limits);</code></div>
        <div class="ui_line is-add"><span class="ui_num">89</span><span class="ui_sign">+</span><code>  q_cmd = smooth(q_prev, q_cmd, 0.2);</code></div>
        <div class="ui_line is-add"><span class="ui_num">90</span><span class="ui_sign">+</span><code>  arm.send(clamp(q_cmd, limits));</code></div>
      </div>
    </div>
  </div>

  <!-- Step 3: the PR card while the AI review runs (ticks draw in one by one) -->
  <div class="hiw_card" data-card>
    <div class="ui">
      <div class="ui_top">
        <span class="ui_badge" data-badge>
          <span class="ui_badge-review">In review</span>
          <span class="ui_badge-merged">Merged</span>
        </span>
        <span class="ui_muted"><code>PR #482</code></span>
      </div>
      <p class="ui_title">Fix arm jitter near joint limits</p>
      <p class="ui_author"><span class="ui_avatar">A</span><code>amara-o</code> into main</p>
      <div class="ui_review">
        <p class="ui_review-title">
          <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" focusable="false"><path d="M8 1.5l1.6 4.1 4.1 1.6-4.1 1.6L8 12.9 6.4 8.8 2.3 7.2l4.1-1.6z"/></svg>
          AI review
        </p>
        <ul class="ui_checks">
          <li class="ui_check" data-check><span class="ui_box"><svg viewBox="0 0 16 16" width="11" height="11" focusable="false"><path d="M3.5 8.5l3 3 6-7" pathLength="1"/></svg></span>Meets bounty requirements</li>
          <li class="ui_check" data-check><span class="ui_box"><svg viewBox="0 0 16 16" width="11" height="11" focusable="false"><path d="M3.5 8.5l3 3 6-7" pathLength="1"/></svg></span>Simulation tests pass</li>
          <li class="ui_check" data-check><span class="ui_box"><svg viewBox="0 0 16 16" width="11" height="11" focusable="false"><path d="M3.5 8.5l3 3 6-7" pathLength="1"/></svg></span>No safety regressions</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Step 4: the same PR card, merged, with the payout toast -->
  <div class="hiw_card" data-card>
    <div class="ui">
      <div class="ui_top">
        <span class="ui_badge" data-badge>
          <span class="ui_badge-review">In review</span>
          <span class="ui_badge-merged">
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" focusable="false"><circle cx="4.5" cy="3.5" r="1.75"/><circle cx="4.5" cy="12.5" r="1.75"/><circle cx="11.5" cy="8" r="1.75"/><path d="M4.5 5.25v5.5M4.5 5.25c0 2.4 2 2.75 5.25 2.75"/></svg>
            Merged
          </span>
        </span>
        <span class="ui_muted"><code>PR #482</code></span>
      </div>
      <p class="ui_title">Fix arm jitter near joint limits</p>
      <p class="ui_author"><span class="ui_avatar">A</span><code>amara-o</code> into main</p>
      <div class="ui_review">
        <p class="ui_review-title">
          <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" focusable="false"><path d="M8 1.5l1.6 4.1 4.1 1.6-4.1 1.6L8 12.9 6.4 8.8 2.3 7.2l4.1-1.6z"/></svg>
          AI review
        </p>
        <ul class="ui_checks">
          <li class="ui_check is-done"><span class="ui_box"><svg viewBox="0 0 16 16" width="11" height="11" focusable="false"><path d="M3.5 8.5l3 3 6-7" pathLength="1"/></svg></span>Meets bounty requirements</li>
          <li class="ui_check is-done"><span class="ui_box"><svg viewBox="0 0 16 16" width="11" height="11" focusable="false"><path d="M3.5 8.5l3 3 6-7" pathLength="1"/></svg></span>Simulation tests pass</li>
          <li class="ui_check is-done"><span class="ui_box"><svg viewBox="0 0 16 16" width="11" height="11" focusable="false"><path d="M3.5 8.5l3 3 6-7" pathLength="1"/></svg></span>No safety regressions</li>
        </ul>
      </div>
    </div>
    <div class="ui_toast" data-toast>
      <span class="ui_toast-icon"><svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M8 12.5v-9M4 7.5l4-4 4 4"/></svg></span>
      <span><span class="ui_toast-amount" data-amount="900">+$900.00</span> sent via PayPal</span>
    </div>
  </div>
</div>
```

**2. `hiw_steps-embed`** (inside `hiw_side`). Real `<button>`s, so every step is reachable with the keyboard. `is-brand` / `is-payout` picks the colour of the active step's tile.

```html
<ol class="hiw_steps" role="list" data-steps>
  <li>
    <button type="button" class="hiw_step is-brand is-active" aria-current="step" data-step>
      <span class="hiw_track" aria-hidden="true"><span class="hiw_fill" data-fill></span></span>
      <span class="hiw_tile" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg></span>
      <span class="hiw_text">
        <span class="hiw_step-title">Post a bounty</span>
        <span class="hiw_step-desc">A maintainer turns an issue into a bounty. AI reads the issue and suggests a fair price based on its complexity.</span>
      </span>
    </button>
  </li>
  <li>
    <button type="button" class="hiw_step is-brand" data-step>
      <span class="hiw_track" aria-hidden="true"><span class="hiw_fill" data-fill></span></span>
      <span class="hiw_tile" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" focusable="false"><circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M6 8.5v7M18 15.5V9a3 3 0 0 0-3-3h-4M13 3.5 10.5 6 13 8.5"/></svg></span>
      <span class="hiw_text">
        <span class="hiw_step-title">Ship a pull request</span>
        <span class="hiw_step-desc">Claim a bounty that matches your expertise. It’s reserved for you while you work. Use any tools you like, AI included: you’re accountable for the PR.</span>
      </span>
    </button>
  </li>
  <li>
    <button type="button" class="hiw_step is-brand" data-step>
      <span class="hiw_track" aria-hidden="true"><span class="hiw_fill" data-fill></span></span>
      <span class="hiw_tile" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M10 3l1.6 3.9L15.5 8.5l-3.9 1.6L10 14l-1.6-3.9L4.5 8.5l3.9-1.6z"/><path d="M14 18l2.2 2.2L21 15.5"/></svg></span>
      <span class="hiw_text">
        <span class="hiw_step-title">AI reviews it</span>
        <span class="hiw_step-desc">Within minutes, the review checks your PR against the bounty’s requirements and runs the project’s tests. If anything’s missing, it tells you exactly what.</span>
      </span>
    </button>
  </li>
  <li>
    <button type="button" class="hiw_step is-payout" data-step>
      <span class="hiw_track" aria-hidden="true"><span class="hiw_fill" data-fill></span></span>
      <span class="hiw_tile" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" focusable="false"><circle cx="12" cy="12" r="8.5"/><path d="M14.6 9.4c-.5-.9-1.5-1.4-2.6-1.4-1.4 0-2.5.8-2.5 2s1.1 1.6 2.5 1.9 2.5.8 2.5 2-1.1 2.1-2.5 2.1c-1.1 0-2.1-.5-2.6-1.4M12 6.5V8M12 16v1.5"/></svg></span>
      <span class="hiw_text">
        <span class="hiw_step-title">Merged and paid</span>
        <span class="hiw_step-desc">The maintainer’s merge is the final check. Your payout goes out via PayPal right away, wherever you are.</span>
      </span>
    </button>
  </li>
</ol>

<!-- Pause/play for the timer. Hidden until the script shows it (and for good with reduced motion). -->
<button class="hiw_toggle" type="button" aria-pressed="false" data-toggle hidden>
  <svg class="hiw_icon-pause" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><path d="M5.5 3.5v9M10.5 3.5v9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
  <svg class="hiw_icon-play" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><path d="M5 3.2v9.6L12.5 8z" fill="currentColor"/></svg>
  <span class="sr-only">Pause step animation</span>
</button>
```

**3. `hiw_script`** (last child of `hiw_component`).

The CSS starts with a **token bridge**: it maps short names like `--brand` to your Webflow Variables (with the hex values as fallbacks), so the rest of the CSS reads like the Astro source. Shadow and motion tokens come straight from the global CSS (Part 1.6). If your Variables have different CSS names, change them in the bridge only.

```html
<style>
/* ---------- Token bridge: Webflow Variables -> short names ---------- */
.section_hiw {
  --ink: var(--colors--ink, #14162B);
  --ink-soft: var(--colors--ink-soft, rgba(20, 22, 43, 0.82));
  --ink-muted: var(--colors--ink-muted, #5A5F7A);
  --canvas: var(--colors--canvas, #F6F7FB);
  --surface: var(--colors--surface, #FFFFFF);
  --line: var(--colors--line, #DADDEA);
  --brand: var(--colors--brand, #0E6B47);
  --brand-tint: var(--colors--brand-tint, #E3F1EA);
  --payout: var(--colors--payout, #0E6B47);
  --payout-tint: var(--colors--payout-tint, #E6F4EC);
  --removed: var(--colors--removed, #B42318);
  --removed-tint: var(--colors--removed-tint, #FBEAEA);
  --font-display: var(--typography--font-display, 'Bricolage Grotesque', sans-serif);
  --font-code: var(--typography--font-code, 'IBM Plex Mono', monospace);
  --text-caption: var(--typography--text-caption, 0.75rem);
  --text-small: var(--typography--text-small, 0.875rem);
  --text-body: var(--typography--text-body, 1rem);
  --text-h3: var(--typography--text-h3, 1.5rem);
  --space-1: var(--spacing--space-1, 4px);
  --space-2: var(--spacing--space-2, 8px);
  --space-3: var(--spacing--space-3, 12px);
  --space-4: var(--spacing--space-4, 16px);
  --space-6: var(--spacing--space-6, 32px);
  --radius-xs: var(--radius--radius-xs, 4px);
  --radius-sm: var(--radius--radius-sm, 8px);
  --radius-md: var(--radius--radius-md, 12px);
  --radius-lg: var(--radius--radius-lg, 20px);
  --radius-pill: var(--radius--radius-pill, 999px);
}

.hiw_grid > .w-embed { min-width: 0; }

/* ---------- Stage: fixed size, cards stacked on top of each other ---------- */
.hiw_stage {
  position: relative;
  container-type: inline-size;  /* lets the pill measure the stage width (cqw) */
  width: 100%;
  aspect-ratio: 4 / 3;
  min-height: 372px;            /* the tallest card (PR + checklist + toast) must fit on phones */
  border-radius: var(--radius-lg);
  background: var(--canvas);
  overflow: hidden;
}
@media (min-width: 992px) { .hiw_stage { aspect-ratio: auto; height: 460px; } }

.hiw_glow {
  position: absolute; width: 70%; aspect-ratio: 1; left: 15%; top: 22%;
  border-radius: 50%; background: var(--payout-tint); filter: blur(32px);
}

.hiw_card {
  position: absolute;
  inset: 60px 0 28px;           /* room for the pill above and the toast below */
  margin: auto;
  width: min(94%, 380px);
  height: fit-content;
  opacity: 0;
  transform: translateY(12px) scale(0.98);  /* waiting: a little low and small */
  pointer-events: none;
}
.hiw_card.is-active {
  opacity: 1; transform: none;
  transition: opacity var(--dur-slow) var(--ease-out) 80ms, transform var(--dur-slow) var(--ease-out) 80ms;
}
.hiw_card.is-leaving {
  opacity: 0; transform: translateY(-8px);
  transition: opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out);
}

/* ---------- Label pill ---------- */
.hiw_pill {
  --x: 6cqw;
  position: absolute; top: 16px; left: 0; z-index: 2;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-pill);
  background: var(--brand); color: var(--surface);
  font-size: var(--text-caption); font-weight: 600; white-space: nowrap;
  transform: translateX(var(--x));
  transition: transform var(--dur-slow) var(--ease-out);
}
/* Steps 2 and 4 move it right: 94% of the stage minus the pill's own width. */
.hiw_stage[data-active='1'] .hiw_pill,
.hiw_stage[data-active='3'] .hiw_pill { --x: calc(94cqw - 100%); }
.hiw_pill-texts { display: grid; }  /* all labels share one cell: the pill fits the longest */
.hiw_pill-text { grid-area: 1 / 1; opacity: 0; transition: opacity var(--dur-base) var(--ease-out); }
.hiw_pill-text.is-active { opacity: 1; }
.hiw_arrow {
  position: absolute; top: calc(100% - 4px); left: 40%;
  color: var(--brand);
  transition: transform var(--dur-slow) var(--ease-out);
}
.hiw_stage[data-active='1'] .hiw_arrow,
.hiw_stage[data-active='3'] .hiw_arrow { transform: scaleX(-1); }

/* ---------- UI cards ---------- */
.ui {
  padding: var(--space-4);
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-md);
  font-size: var(--text-caption); color: var(--ink);
  box-shadow: var(--shadow-lg);
}
.ui.is-flush { padding: 0; overflow: hidden; }
.ui code { font-family: var(--font-code); font-size: var(--text-caption); }
.ui_repo, .ui_muted { color: var(--ink-muted); }
.ui_title {
  margin-top: var(--space-2);
  font-family: var(--font-display); font-size: var(--text-body); font-weight: 600; line-height: 1.25;
}
.ui_ai {
  margin-top: var(--space-3);
  display: flex; align-items: center; gap: var(--space-2);
  padding: var(--space-2); border-radius: var(--radius-sm); background: var(--brand-tint);
}
.ui_ai svg, .ui_ai strong { color: var(--brand); }
.ui_row {
  margin-top: var(--space-3); padding-top: var(--space-3); border-top: 1px solid var(--line);
  display: flex; justify-content: space-between; align-items: center; color: var(--ink-muted);
}
.ui_price { font-family: var(--font-display); font-size: var(--text-h3); color: var(--ink); }

.ui_diff-head {
  display: flex; justify-content: space-between; align-items: center;
  padding: var(--space-2) var(--space-3);
  background: var(--canvas); border-bottom: 1px solid var(--line);
}
.ui_opened { display: inline-flex; align-items: center; gap: var(--space-2); font-weight: 600; }
.ui_opened svg, .ui_add { color: var(--payout); }
.ui_add, .ui_del { font-weight: 600; }
.ui_del { color: var(--removed); }
.ui_file { padding: var(--space-2) var(--space-3) var(--space-1); color: var(--ink-muted); }
.ui_diff { padding: var(--space-1) 0 var(--space-2); line-height: 1.8; }
.ui_line { display: grid; grid-template-columns: 2.6em 1.4em minmax(0, 1fr); padding-right: var(--space-2); white-space: pre; }
.ui_line code { overflow: hidden; }
.ui_num { padding-right: 0.5em; text-align: right; color: var(--ink-muted); font-family: var(--font-code); }
.ui_sign { text-align: center; }
.ui_line.is-del { background: var(--removed-tint); }
.ui_line.is-del .ui_sign { color: var(--removed); }
.ui_line.is-add { background: var(--payout-tint); }
.ui_line.is-add .ui_sign { color: var(--payout); }

.ui_top { display: flex; justify-content: space-between; align-items: center; }
/* Badge: "In review" by default; .is-merged swaps to the green "Merged" state. */
.ui_badge {
  display: inline-grid;
  padding: var(--space-1) var(--space-2); border-radius: var(--radius-pill);
  background: var(--canvas); box-shadow: inset 0 0 0 1px var(--line);
  color: var(--ink-muted); font-weight: 600;
  transition: background-color var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out);
}
.ui_badge > span {
  grid-area: 1 / 1; display: inline-flex; align-items: center; gap: var(--space-1);
  transition: opacity var(--dur-base) var(--ease-out);
}
.ui_badge-merged { opacity: 0; }
.ui_badge.is-merged { background: var(--brand); box-shadow: none; color: var(--surface); }
.ui_badge.is-merged .ui_badge-review { opacity: 0; }
.ui_badge.is-merged .ui_badge-merged { opacity: 1; }

.ui_author { margin-top: var(--space-2); display: flex; align-items: center; gap: var(--space-2); color: var(--ink-muted); }
.ui_author code { color: var(--ink); font-weight: 500; }
.ui_avatar {
  display: grid; place-items: center; width: 18px; height: 18px; border-radius: 50%;
  background: var(--brand-tint); color: var(--brand); font-weight: 700;
}
.ui_review { margin-top: var(--space-3); padding-top: var(--space-2); border-top: 1px solid var(--line); }
.ui_review-title {
  display: flex; align-items: center; gap: var(--space-1);
  font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-muted);
}
.ui_review-title svg { color: var(--brand); }
.ui_checks { list-style: none; margin: var(--space-2) 0 0; padding: 0; display: grid; gap: var(--space-2); }
.ui_check { display: flex; align-items: center; gap: var(--space-2); color: var(--ink-muted); transition: color var(--dur-base) var(--ease-out); }
.ui_box {
  display: grid; place-items: center; width: 17px; height: 17px; border-radius: 50%;
  background: var(--canvas); box-shadow: inset 0 0 0 1.5px var(--line); color: var(--payout);
  transition: background-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out);
}
/* The tick is "drawn": the stroke is one dash as long as the path, pushed fully out of view. */
.ui_box path {
  fill: none; stroke: currentColor; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round;
  stroke-dasharray: 1; stroke-dashoffset: 1;
  transition: stroke-dashoffset var(--dur-slow) var(--ease-out);
}
.ui_check.is-done { color: var(--ink); }
.ui_check.is-done .ui_box { background: var(--payout-tint); box-shadow: none; }
.ui_check.is-done .ui_box path { stroke-dashoffset: 0; }

.ui_toast {
  position: absolute; right: 12px; bottom: -18px;
  display: flex; align-items: center; gap: var(--space-2);
  padding: var(--space-2) var(--space-3) var(--space-2) var(--space-2);
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-pill);
  font-size: var(--text-caption); white-space: nowrap;
  box-shadow: var(--shadow-md);
  opacity: 0; transform: translateY(16px);
  transition: opacity var(--dur-slow) var(--ease-out), transform var(--dur-slow) var(--ease-out);
}
.ui_toast.is-shown { opacity: 1; transform: none; }
.ui_toast-icon {
  display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%;
  background: var(--payout); color: var(--surface);
}
.ui_toast-amount {
  display: inline-block; min-width: 7.5ch;
  font-weight: 600; font-variant-numeric: tabular-nums; color: var(--payout);
}

/* ---------- Step list ---------- */
.hiw_steps { list-style: none; margin: 0; padding: 0; }
.hiw_step {
  width: 100%; min-height: 56px;
  display: grid; grid-template-columns: 2px 44px minmax(0, 1fr); gap: var(--space-4); align-items: start;
  padding: 0; border: 0; background: none; text-align: left; color: inherit; font: inherit; cursor: pointer;
}
.hiw_step.is-active { cursor: default; }
.hiw_step:focus-visible { outline-offset: 4px; border-radius: var(--radius-sm); }

/* Track: the step's own 2px line. Fill: scaled from the top by the script (the timer). */
.hiw_track {
  position: relative; align-self: stretch; margin-block: var(--space-1);
  background: var(--line); border-radius: var(--radius-xs); overflow: hidden;
}
.hiw_fill {
  position: absolute; inset: 0; background: var(--ink);
  transform: scaleY(0); transform-origin: top;
  transition: opacity var(--dur-base) var(--ease-out);
}
.hiw_steps.is-resetting .hiw_fill { opacity: 0; }  /* loop restart: all lines fade out first */

.hiw_tile {
  display: grid; place-items: center; width: 44px; height: 44px; margin-block: var(--space-1);
  border-radius: var(--radius-sm); background: var(--surface); border: 1px solid var(--line); color: var(--ink-muted);
  transition: background-color var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out);
}
.hiw_text { display: grid; gap: var(--space-2); padding-block: var(--space-3) var(--space-6); }
.hiw_step-title {
  font-family: var(--font-display); font-size: var(--text-h3); font-weight: 500; line-height: 1.25;
  color: var(--ink-muted); transition: color var(--dur-base) var(--ease-out);
}
.hiw_step-desc {
  font-size: var(--text-small); line-height: 1.55;
  color: var(--ink-muted); transition: color var(--dur-base) var(--ease-out);
}
@media (hover: hover) { .hiw_step:not(.is-active):hover .hiw_step-title { color: var(--ink); } }
.hiw_step.is-done .hiw_tile { background: var(--canvas); border-color: var(--canvas); color: var(--ink); }
.hiw_step.is-active .hiw_step-title { color: var(--ink); }
.hiw_step.is-active .hiw_step-desc { color: var(--ink-soft); }
.hiw_step.is-brand.is-active .hiw_tile { background: var(--brand-tint); border-color: var(--brand-tint); color: var(--brand); }
.hiw_step.is-payout.is-active .hiw_tile { background: var(--payout-tint); border-color: var(--payout-tint); color: var(--payout); }

/* ---------- Pause / play ---------- */
.hiw_toggle {
  margin: var(--space-1) 0 0 var(--space-4);  /* under the tiles */
  display: grid; place-items: center; width: 36px; height: 36px; padding: 0;
  border: 1px solid var(--line); border-radius: 50%; background: var(--surface); color: var(--ink); cursor: pointer;
}
.hiw_toggle:hover { background: var(--canvas); }
.hiw_icon-play { display: none; }
.hiw_toggle[aria-pressed='true'] .hiw_icon-play { display: block; }
.hiw_toggle[aria-pressed='true'] .hiw_icon-pause { display: none; }
</style>

<script>
(() => {
  const section = document.querySelector('[data-hiw]');
  if (!section) return;

  const comp = section.querySelector('[data-comp]');
  const stage = section.querySelector('[data-stage]');
  const stepsList = section.querySelector('[data-steps]');
  const buttons = [...section.querySelectorAll('[data-step]')];
  const fills = [...section.querySelectorAll('[data-fill]')];
  const cards = [...section.querySelectorAll('[data-card]')];
  const pillTexts = [...section.querySelectorAll('[data-pill-text]')];
  const toggle = section.querySelector('[data-toggle]');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

  const STEP_MS = 5000;  // how long each step's line takes to fill
  const HOLD_MS = 1500;  // pause after step 4 before looping
  const RESET_MS = 250;  // = --dur-base: all lines fade out before the loop restarts
  const count = buttons.length;

  let active = 0;
  let phase = 'step';    // 'step' | 'hold' | 'reset'
  let elapsed = 0;       // ms spent in the current phase; survives pauses
  let lastTime = null;
  let raf = null;
  let visualTimers = [];

  // Reasons the timer may not run. It runs only when all are false.
  let stopped = false;     // the user clicked a step: auto-advance is off for good
  let userPaused = false;  // pause/play button
  let hovering = false;
  let focusWithin = false;
  let inView = false;

  const setFill = (i, amount) => { fills[i].style.transform = `scaleY(${amount})`; };

  // ---------- Step state (list + stage) ----------
  function setActive(i) {
    const prev = active;
    active = i;
    buttons.forEach((b, n) => {
      b.classList.toggle('is-active', n === i);
      b.classList.toggle('is-done', n < i);
      if (n === i) b.setAttribute('aria-current', 'step');
      else b.removeAttribute('aria-current');
      setFill(n, n < i ? 1 : 0);  // finished steps stay full, later ones empty
    });
    pillTexts.forEach((t, n) => t.classList.toggle('is-active', n === i));
    stage.dataset.active = String(i);  // moves the pill (CSS)
    if (prev !== i) swapCard(prev, i);
    playVisual(i);
  }

  // The outgoing card fades up (--dur-fast); the incoming one rises in (CSS).
  function swapCard(from, to) {
    const out = cards[from];
    out.classList.remove('is-active');
    out.classList.add('is-leaving');
    setTimeout(() => out.classList.remove('is-leaving'), 220);  // a little longer than --dur-fast
    cards[to].classList.add('is-active');
  }

  // ---------- Per-step card animations ----------
  function playVisual(i) {
    visualTimers.forEach(clearTimeout);
    visualTimers = [];
    const card = cards[i];
    const later = (ms, fn) => visualTimers.push(setTimeout(fn, ms));
    const reduce = reduceMotion.matches;

    if (i === 2) {  // AI review: ticks draw in one by one
      const checks = [...card.querySelectorAll('[data-check]')];
      checks.forEach((c) => c.classList.toggle('is-done', reduce));
      if (!reduce) checks.forEach((c, n) => later(400 + n * 500, () => c.classList.add('is-done')));
    }

    if (i === 3) {  // Merged: badge flips, toast slides in, amount counts up
      const badge = card.querySelector('[data-badge]');
      const toast = card.querySelector('[data-toast]');
      const amount = card.querySelector('[data-amount]');
      const target = Number(amount.dataset.amount);
      const format = (n) => '+$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      if (reduce) {
        badge.classList.add('is-merged');
        toast.classList.add('is-shown');
        amount.textContent = format(target);
        return;
      }
      badge.classList.remove('is-merged');
      toast.classList.remove('is-shown');
      amount.textContent = format(0);
      later(350, () => badge.classList.add('is-merged'));
      later(850, () => {
        toast.classList.add('is-shown');
        const start = performance.now();
        const step = (now) => {
          const t = Math.min((now - start) / 900, 1);
          amount.textContent = format(target * (1 - Math.pow(1 - t, 3)));  // ease-out
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }
  }

  // ---------- The timer: requestAnimationFrame + elapsed time ----------
  const running = () =>
    !stopped && !userPaused && !hovering && !focusWithin && inView && !document.hidden && !reduceMotion.matches;

  function tick(now) {
    // Count only the time since the last frame. After a pause lastTime is null,
    // so paused time is never counted: the line continues where it stopped.
    if (lastTime !== null) elapsed += now - lastTime;
    lastTime = now;

    if (phase === 'step') {
      const progress = Math.min(elapsed / STEP_MS, 1);
      setFill(active, progress);
      if (progress >= 1) {
        elapsed = 0;
        if (active < count - 1) setActive(active + 1);
        else phase = 'hold';
      }
    } else if (phase === 'hold' && elapsed >= HOLD_MS) {
      phase = 'reset';
      elapsed = 0;
      stepsList.classList.add('is-resetting');
    } else if (phase === 'reset' && elapsed >= RESET_MS) {
      stepsList.classList.remove('is-resetting');
      phase = 'step';
      elapsed = 0;
      setActive(0);
    }
    raf = requestAnimationFrame(tick);
  }

  // Start or stop the loop whenever one of the reasons changes.
  function sync() {
    if (running() && raf === null) {
      lastTime = null;
      raf = requestAnimationFrame(tick);
    } else if (!running() && raf !== null) {
      cancelAnimationFrame(raf);
      raf = null;
    }
    toggle.setAttribute('aria-pressed', String(userPaused));
  }

  // ---------- User control ----------
  buttons.forEach((b, i) => b.addEventListener('click', () => {
    stopped = true;          // the user chose a step: no more auto-advance
    toggle.hidden = true;    // nothing left to pause
    stepsList.classList.remove('is-resetting');
    phase = 'step';
    elapsed = 0;
    if (i !== active) setActive(i);
    setFill(i, 1);
    sync();
  }));

  toggle.addEventListener('click', () => { userPaused = !userPaused; sync(); });

  comp.addEventListener('pointerenter', () => { hovering = true; sync(); });
  comp.addEventListener('pointerleave', () => { hovering = false; sync(); });
  comp.addEventListener('focusin', () => { focusWithin = true; sync(); });
  comp.addEventListener('focusout', (e) => {
    if (!comp.contains(e.relatedTarget)) { focusWithin = false; sync(); }
  });
  document.addEventListener('visibilitychange', sync);

  // Run only while at least 40% of the section is on screen.
  new IntersectionObserver(([entry]) => {
    inView = entry.intersectionRatio >= 0.4;
    sync();
  }, { threshold: [0, 0.4, 0.6, 1] }).observe(section);

  // ---------- Reduced motion: no timer; active line full; cards show their end state ----------
  function applyMotion() {
    if (reduceMotion.matches) {
      toggle.hidden = true;
      setFill(active, 1);
      playVisual(active);
    } else if (!stopped) {
      toggle.hidden = false;
    }
    sync();
  }

  setActive(0);
  applyMotion();
  reduceMotion.addEventListener('change', applyMotion);
})();
</script>
```

**How the timer works, in plain language.** Each step's line is a 2px bar scaled from 0 to full height (`scaleY`). Every animation frame, the script adds the time since the last frame to a counter and sets the line to "counter ÷ 5 seconds". When the line is full, the next step starts. When the timer is paused (hover, focus, the pause button, the section leaving the screen, or the browser tab hidden), the script simply stops counting. When it resumes, the line continues from where it was instead of restarting. Clicking a step means "I want to read this one", so auto-advance stops for good.

### Interactions

None native. All motion is CSS transitions switched by the script, and the global reduced-motion CSS (Part 1.6) makes them instant. With reduced motion the script also turns the timer off: the active line shows full, the cards show their final state (all ticks, Merged, +$900.00), and the pause button stays hidden.

### Accessibility

| Element | Attribute | Value |
|---|---|---|
| section_hiw | `aria-labelledby` | `hiw-title` |
| section_hiw | `data-hiw` | `true` |
| hiw_title | ID | `hiw-title` |
| hiw_header | Tag (Element settings) | `header` |
| hiw_grid | `data-comp` | `true` |

Inside the embeds (already in the code above): the stage is `aria-hidden="true"`; the steps are an ordered list of real buttons; the current step has `aria-current="step"`; the pause button has `aria-pressed` and a screen-reader label.

### Checklist

- [ ] Scroll the section into view: step 1's line fills over 5 seconds, then step 2 starts and the stage card swaps. After step 4 everything holds for 1.5 seconds, the lines fade out, and it loops.
- [ ] The pill slides left and right between steps, and its arrow flips.
- [ ] Step 3: the three ticks draw in one after another. Step 4: the badge turns green "Merged", the toast slides in and the amount counts up to +$900.00.
- [ ] The active step's tile is green (steps 1 to 3) or payout green (step 4); finished steps have a light grey tile.
- [ ] Hovering the section, or tabbing into it, pauses the line; leaving resumes it from the same point. The pause button toggles, and its label is announced.
- [ ] Clicking a step shows it complete and stops the timer for good; the pause button disappears.
- [ ] Reduced motion: no timer, no pause button, the active line is full, and cards show their final state.
- [ ] 1440: stage left, steps right, vertically centred. 768 and 375: stage above the list; the tallest card (step 4 with the toast) fits; no horizontal page scroll.
- [ ] Screen reader: the stage is skipped; each step reads as a button with its title and description.

---

## Part 2.7: FAQ

**Background:** surface, with the content in a large canvas panel.

- Desktop: a heading block on the left that stays in view (sticky) while the questions scroll past on the right.
- Tablet and smaller: the heading block sits above the questions.
- An accordion: the first answer starts open, and several can be open at once. Each question is a real `<button>`.
- **Works without JavaScript:** every answer is visible until the script runs. The script then collapses all but the first, before the page is first drawn, so nothing flashes.

**Webflow vs native:** Webflow's Dropdown and Tabs elements don't produce real buttons with `aria-expanded`, and Webflow has no accessible accordion element. So each question and answer comes from a CMS item through a small Code Embed, and one script handles opening and closing.

### CMS Collection: "FAQs"

**CMS panel → Create collection → "FAQs"** (singular item name "FAQ").

| Field | Webflow type | Required | Notes |
|---|---|---|---|
| Name | Plain text (built-in) | ✓ | The question |
| Slug | Slug (built-in) | ✓ | Builds the IDs that connect each question to its answer |
| Answer | Plain text (multi-line off) | ✓ | One short paragraph |
| Sort order | Number | ✓ | Controls the order |

**Items** (fee, claim-window and dispute details are placeholder demo policies, not final terms):

| Sort | Name | Answer |
|---|---|---|
| 1 | How and when do I get paid? | As soon as the maintainer merges your pull request, your payout goes out via PayPal. Most arrive within minutes. You always see the bounty amount before you start. |
| 2 | Can I use AI tools to write my PR? | Yes, including coding agents like Claude Code or Codex. You claim the bounty, so you're accountable for the pull request. The review checks whether it solves the issue and meets the bounty's requirements, not how it was written. Understanding the problem is what gets you merged. |
| 3 | How does the AI review work? | It reads your pull request against the bounty's requirements, runs the project's tests, and flags obvious security problems. If something is missing, it tells you exactly what. The maintainer always makes the final decision to merge. |
| 4 | How many people can work on a bounty? | One at a time. When you claim a bounty, it's reserved for you for 72 hours, and the maintainer can extend it. Nobody does the same work for nothing, and maintainers review one pull request instead of ten. If a claim goes quiet, the bounty reopens. |
| 5 | What if my PR isn't merged? | You get specific reasons, and you can push fixes as many times as you need. If your PR meets every requirement and still isn't merged, you can open a dispute and a person will review it. |
| 6 | Can I negotiate the bounty price? | Yes. Every bounty shows an AI fair-price range based on the issue's complexity. If you think the work is bigger than the price, send a counter-offer before you start. |
| 7 | Can I work from anywhere? | Yes, anywhere PayPal can send payouts. Check that PayPal supports receiving money in your country before you claim a bounty. |
| 8 | Do I need a resume or portfolio? | No. Your merged pull requests are your track record, and every one is public on your profile. |
| 9 | What does it cost? | Posting a bounty is free. Maintainers pay a 10% platform fee on top of the bounty, charged only when they merge. Contributors keep 100% of the bounty. |

### Element tree

```
section_faq (Section, id: faq)                          [aria-labelledby]
└─ padding-global
   └─ container-large
      └─ padding-section-large
         └─ faq_component (Div, Grid)                   ← the canvas panel
            ├─ faq_intro (Div)                          ← sticky on Desktop
            │  ├─ faq_title (H2, id: faq-title)
            │  │  ├─ faq_title-line (Text Span): "Questions developers ask"
            │  │  └─ faq_title-line (Text Span): "before their first PR"
            │  ├─ faq_lede (Paragraph): "Straight answers. No fine print."
            │  └─ faq_link (Link Block → Help Center)
            │     ├─ Text Block: "More answers in the Help Center"
            │     └─ Code Embed: arrow icon
            └─ faq_list (Div)                           [data-faq]
               ├─ faq_collection (Collection List Wrapper → FAQs)
               │  └─ faq_collection-list (Collection List)
               │     └─ faq_item (Collection Item)
               │        └─ faq_item-embed (Code Embed with CMS fields: question + answer)
               └─ faq_script (Code Embed: CSS + script; see "Custom code")
```

**Collection List settings:** Sort by Sort order, ascending. No limit.

`faq_script` must be the **last child** of `faq_list`, right after the Collection List. That way it runs as soon as the questions exist, before the browser draws the page.

**Arrow icon** for `faq_link` (Code Embed):

```html
<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
```

### Styles per breakpoint

**Desktop (base)**

| Class | Styles |
|---|---|
| `section_faq` | Background surface · Colour ink |
| `faq_component` | Background canvas · Radius radius-xl · Padding space-10 · Grid, 2 columns `40fr 60fr` · Column gap `clamp(40px, 5vw, 80px)` (fallback 64px) · Align items start |
| `faq_intro` | **Position sticky, top 96px** (the 72px Desktop header + space-5) · Align self start · Min width 0 |
| `faq_title` | Weight 600 · Colour ink (size comes from All H2: text-h1) |
| `faq_title-line` | Display block |
| `faq_lede` | Margin top space-4 · Size text-body-lg · Colour ink-muted |
| `faq_link` | Margin top space-5 · Inline-flex · Align center · Gap space-2 · Padding bottom space-1 · Border bottom 1.5px solid, colour: currentColor (type it in the colour field) · Size text-small · Weight 600 · Colour ink · No underline. **Hover:** Colour brand |
| `faq_list` | Border top 1px line · Min width 0 |
| `faq_item` | Border bottom 1px line |

**Why sticky works here:** `position: sticky` only works if no ancestor has `overflow` set to hidden, scroll or auto. Leave Overflow at its default (visible) on `section_faq`, the Client-First wrappers and `faq_component`. The panel's rounded corners still look right because nothing in it overflows.

**Tablet**

| Class | Changes |
|---|---|
| `faq_component` | 1 column · Row gap space-7 · Padding space-8 |
| `faq_intro` | Position static |

**Mobile landscape**

| Class | Changes |
|---|---|
| `faq_component` | Padding space-6 |

**Mobile portrait**

| Class | Changes |
|---|---|
| `faq_component` | Padding space-5 |

### Custom code

**1. `faq_item-embed`** (inside each Collection Item). Wherever you see `{{Field}}`, click **"+ Add Field"** and insert that CMS field. Don't type the braces yourself.

Every answer starts open (`aria-expanded="true"`, `is-open`). That's the no-JavaScript state.

```html
<h3 class="faq_q">
  <button type="button" class="faq_button" id="faq-q-{{Slug}}" aria-expanded="true" aria-controls="faq-a-{{Slug}}" data-faq-button>
    <span class="faq_q-text">{{Name}}</span>
    <span class="faq_icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" focusable="false"><path d="M12 5v14M5 12h14"/></svg>
    </span>
  </button>
</h3>
<div class="faq_a is-open" id="faq-a-{{Slug}}" role="region" aria-labelledby="faq-q-{{Slug}}" data-faq-panel>
  <div class="faq_a-clip">
    <p class="faq_a-text">{{Answer}}</p>
  </div>
</div>
```

**2. `faq_script`** (last child of `faq_list`).

```html
<style>
/* ---------- Token bridge: Webflow Variables -> short names ---------- */
.section_faq {
  --ink: var(--colors--ink, #14162B);
  --ink-muted: var(--colors--ink-muted, #5A5F7A);
  --brand: var(--colors--brand, #0E6B47);
  --font-display: var(--typography--font-display, 'Bricolage Grotesque', sans-serif);
  --text-h3: var(--typography--text-h3, 1.5rem);
  --space-5: var(--spacing--space-5, 24px);
  --space-6: var(--spacing--space-6, 32px);
  --measure: var(--spacing--measure, 40rem);
  --radius-sm: var(--radius--radius-sm, 8px);
}

/* ---------- Question ---------- */
.faq_q { margin: 0; font: inherit; }
.faq_button {
  width: 100%;
  display: flex; align-items: center; justify-content: space-between; gap: var(--space-5);
  padding: var(--space-5) 0;
  border: 0; background: none; text-align: left; color: var(--ink); font: inherit; cursor: pointer;
}
@media (min-width: 992px) { .faq_button { padding-block: var(--space-6); } }
.faq_button:focus-visible { outline-offset: 2px; border-radius: var(--radius-sm); }
.faq_q-text { font-family: var(--font-display); font-size: var(--text-h3); font-weight: 500; line-height: 1.25; }

.faq_icon {
  flex: none; display: grid; place-items: center; width: 44px; height: 44px;
  border: 1px solid var(--ink-muted); border-radius: var(--radius-sm); color: var(--ink);
  transition: border-color var(--dur-fast) var(--ease-out);
}
.faq_icon svg { transition: transform var(--dur-slow) var(--ease-out); }
.faq_button:hover .faq_icon,
.faq_button:focus-visible .faq_icon { border-color: var(--brand); }
.faq_button[aria-expanded='true'] .faq_icon svg { transform: rotate(45deg); }  /* plus turns into an X */

/* ---------- Answer ---------- */
.faq_a { display: grid; grid-template-rows: 1fr; }  /* open: the no-JS state */
.faq_a-clip { min-height: 0; overflow: hidden; }
.faq_a-text { max-width: var(--measure); margin: 0; padding-bottom: var(--space-5); line-height: 1.55; color: var(--ink-muted); }
@media (min-width: 992px) { .faq_a-text { padding-bottom: var(--space-6); } }

/* After the script runs: closed answers shrink to a 0fr row, open ones grow to 1fr.
   The text fades in slightly after the height starts opening. */
.is-enhanced .faq_a {
  grid-template-rows: 0fr; visibility: hidden;
  transition: grid-template-rows var(--dur-slow) var(--ease-out), visibility 0s linear var(--dur-slow);
}
.is-enhanced .faq_a.is-open {
  grid-template-rows: 1fr; visibility: visible;
  transition: grid-template-rows var(--dur-slow) var(--ease-out), visibility 0s;
}
.is-enhanced .faq_a-text { opacity: 0; transition: opacity var(--dur-fast) var(--ease-out); }
.is-enhanced .faq_a.is-open .faq_a-text { opacity: 1; transition: opacity var(--dur-base) var(--ease-out) 100ms; }

.is-instant *, .is-instant *::before { transition: none !important; }
</style>

<script>
(() => {
  const list = document.querySelector('#faq [data-faq]');
  if (!list) return;
  const buttons = [...list.querySelectorAll('[data-faq-button]')];
  const panels = buttons.map((b) => document.getElementById(b.getAttribute('aria-controls')));

  // Open or close item i. Closed answers are inert: not focusable, not read out.
  const setOpen = (i, open) => {
    buttons[i].setAttribute('aria-expanded', String(open));
    panels[i].classList.toggle('is-open', open);
    panels[i].inert = !open;
  };

  // From here on the collapsing styles apply. Start with the first item open.
  // .is-instant skips the animation for this first setup.
  list.classList.add('is-enhanced', 'is-instant');
  buttons.forEach((_, i) => setOpen(i, i === 0));
  requestAnimationFrame(() => requestAnimationFrame(() => list.classList.remove('is-instant')));

  // Each item toggles on its own; several can be open at once.
  buttons.forEach((b, i) => b.addEventListener('click', () => setOpen(i, b.getAttribute('aria-expanded') !== 'true')));
})();
</script>
```

**How the accordion opens smoothly, in plain language.** Browsers can't animate `height` to "auto". Instead, each answer is a one-row grid. A row of `0fr` takes no space, and a row of `1fr` takes exactly as much as the answer needs. The browser *can* animate between those two, so the answer grows to its real height without the script measuring anything. The inner `faq_a-clip` hides the text while the row is still smaller than the text.

### Interactions

None native. The height and fade are CSS transitions, made instant by the global reduced-motion CSS (Part 1.6).

### Accessibility

| Element | Attribute | Value |
|---|---|---|
| section_faq | ID | `faq` |
| section_faq | `aria-labelledby` | `faq-title` |
| faq_title | ID | `faq-title` |
| faq_list | `data-faq` | `true` |

Inside the embed (already in the code above): each question is an `h3` containing a real button with `aria-expanded` and `aria-controls`; each answer is a `region` labelled by its question. Closed answers are `inert`, so the keyboard and screen readers skip them.

### Checklist

- [ ] On load, only the first answer is open, with no flash of all nine open.
- [ ] Click a question: its answer grows smoothly and the plus turns into an X. Several can be open at once.
- [ ] Tab: focus moves from question to question and skips closed answers. Enter and Space toggle.
- [ ] Disable JavaScript (DevTools → Settings → Debugger) and reload: every answer is visible.
- [ ] 1440: the heading block stays in view while the questions scroll, sitting just below the header, and leaves with the panel. 768 and 375: heading above the questions, nothing sticky.
- [ ] Reduced motion: answers open and close instantly.
- [ ] Screen reader: each question is announced as a heading and a button with its expanded or collapsed state.

---

## Part 2.8: FinalCTA

**Background:** surface, with the content in a dark photo panel (`id: get-started`).

- The panel layers, from back to front:
  1. the photo of a developer on the left;
  2. a dark overlay, from ink to path-ship-bg;
  3. a huge, faint "fairmerge" watermark, cut off by the bottom edge;
  4. a thin inset frame;
  5. the content.
- **The heading lights up letter by letter as the panel scrolls into view.** It's tied to scroll position, so scrolling back dims it again.
- The supporting line and both buttons fade up **once** when the heading is half lit, and never hide again. They stay focusable and clickable the whole time.
- Without JavaScript, or with reduced motion, everything is simply visible.

This is the page's one deliberate exception to "no scroll effects" (see CLAUDE.md, Motion).

### Element tree

```
section_cta (Section, id: get-started)                 [aria-labelledby, data-cta]
└─ padding-global
   └─ container-large
      ├─ cta_panel (Div)
      │  ├─ cta_photo (Image: cta-photo.webp, decorative)
      │  ├─ cta_overlay (Div)
      │  ├─ cta_watermark (Text Block): "fairmerge"
      │  ├─ cta_frame (Div)
      │  └─ cta_content (Div)
      │     ├─ cta_title (H2, id: cta-title)
      │     │  ├─ cta_title-line (Text Span): "Your next merge"
      │     │  └─ cta_title-line (Text Span): "could pay today."
      │     ├─ cta_sub is-reveal (Paragraph)
      │     └─ cta_actions is-reveal (Div)
      │        ├─ button is-on-dark is-large (Link Block → #bounties): "Find a bounty" + button_icon
      │        └─ button is-outline-on-dark is-large (Link Block → #paths): "Post a bounty"
      └─ cta_script (Code Embed: CSS + script; see "Custom code")
```

`cta_script` goes right **after** `cta_panel`, so the heading exists when the script runs and splits it into letters before the first paint.

**Photo:** upload `public/images/cta-photo.webp` (1600 × 1067) from the repository. In the image settings, turn on **Decorative** (empty alt text, the photo carries no information) and set Load to **Lazy**. Photo by Anthony Riera on Unsplash (Unsplash License). If you leave the photo out, the panel shows its dark gradient on its own.

### Styles per breakpoint

The panel's layers, the heading effect and the reveal are styled by the CSS in `cta_script`. They need gradients with transparency, `calc()` with the frame inset, a container query and the `w-mod-js` class. Give the layer elements only their class names in the Designer. In the Style panel:

**Desktop (base)**

| Class | Styles |
|---|---|
| `section_cta` | Background surface · Padding top/bottom `clamp(48px, 8vw, 112px)` (fallback 112px) |
| `cta_title-line` | Display block |
| `cta_sub` | Margin top space-5 · Max width measure-narrow · Size text-body-lg · Line height leading-normal · Colour on-dark-strong |
| `cta_actions` | Margin top space-6 · Flex, wrap · Gap space-3 |

**Mobile portrait**

| Class | Changes |
|---|---|
| `section_cta` | Padding top/bottom space-8 |
| `cta_actions` | Direction vertical |
| `cta_actions` > `button` | Width 100% (use a combo `cta_button` on both buttons, or set it on the elements) |

### Content

- **Heading:** Your next merge / could pay today. (one Text Span per line)
- **Supporting line:** $250 average bounty. About 5 minutes from merge to payout. These are placeholder demo stats, the same as the hero; replace them before launch.
- **Buttons:** Find a bounty (→ `#bounties`), Post a bounty (→ `#paths`)

To change the heading, just edit the two Text Spans. The script splits whatever text is there.

### Custom code: `cta_script`

```html
<style>
/* ---------- Token bridge: Webflow Variables -> short names ---------- */
.section_cta {
  --ink: var(--colors--ink, #14162B);
  --surface: var(--colors--surface, #FFFFFF);
  --path-grow-bg: var(--colors--path-grow-bg, #102F3A);
  --path-ship-bg: var(--colors--path-ship-bg, #3A2A0E);
  --on-dark-watermark: var(--colors--on-dark-watermark, rgba(255, 255, 255, 0.05));
  --on-dark-frame: var(--colors--on-dark-frame, rgba(255, 255, 255, 0.35));
  --brand-tint: var(--colors--brand-tint, #E3F1EA);
  --font-display: var(--typography--font-display, 'Bricolage Grotesque', sans-serif);
  --text-display: var(--typography--text-display, clamp(2.5rem, 1.5rem + 4vw, 4.5rem));
  --space-5: var(--spacing--space-5, 24px);
  --space-7: var(--spacing--space-7, 40px);
  --space-8: var(--spacing--space-8, 48px);
  --radius-md: var(--radius--radius-md, 12px);
  --radius-lg: var(--radius--radius-lg, 20px);
  --radius-xl: var(--radius--radius-xl, clamp(24px, 3vw, 32px));
  --frame-inset: 16px;
}
@media (min-width: 768px) { .section_cta { --frame-inset: 32px; } }

/* ---------- Panel: everything below stacks inside it ---------- */
.cta_panel {
  position: relative;
  overflow: clip;        /* clips the watermark without making a scroll container */
  isolation: isolate;    /* the layers' negative z-index stays inside the panel */
  min-height: 480px;
  display: flex;
  align-items: flex-end; /* phones: content at the bottom */
  border-radius: var(--radius-xl);
  background:
    radial-gradient(120% 90% at 15% 20%, var(--path-grow-bg), transparent 60%),
    linear-gradient(135deg, var(--ink), var(--path-ship-bg));
  color: var(--surface);
}
@media (min-width: 768px) { .cta_panel { min-height: 560px; align-items: center; } }

/* 1. Photo: the person sits in the left third. */
.cta_photo { position: absolute; inset: 0; z-index: -3; width: 100%; height: 100%; object-fit: cover; object-position: 25% 50%; }

/* 2. Overlay. Below 992px it's dark and fairly even, because the text sits over the photo. */
.cta_overlay {
  position: absolute; inset: 0; z-index: -2;
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--ink) 70%, transparent),
    color-mix(in srgb, var(--path-ship-bg) 88%, transparent));
}
/* Desktop: the photo fills the left 62%; the overlay stays light over it and turns
   near-solid where the text starts. */
@media (min-width: 992px) {
  .cta_photo { width: 62%; object-position: 30% 40%; }
  .cta_overlay {
    background: linear-gradient(90deg,
      color-mix(in srgb, var(--ink) 30%, transparent) 0%,
      color-mix(in srgb, var(--ink) 20%, transparent) 28%,
      color-mix(in srgb, var(--path-ship-bg) 88%, transparent) 46%,
      color-mix(in srgb, var(--path-ship-bg) 97%, transparent) 62%);
  }
}

/* 3. Watermark: huge, faint, cut off by the bottom edge. */
.cta_watermark {
  position: absolute; z-index: -1; left: 50%; bottom: 0;
  transform: translate(-50%, 28%);
  font-family: var(--font-display); font-size: clamp(6rem, 22vw, 19rem); font-weight: 700;
  line-height: 1.05; letter-spacing: -0.02em; white-space: nowrap;
  color: var(--on-dark-watermark);
  pointer-events: none; user-select: none;
}

/* 4. Inset frame. */
.cta_frame {
  position: absolute; inset: var(--frame-inset);
  border: 1px solid var(--on-dark-frame); border-radius: var(--radius-md);
  pointer-events: none;
}
@media (min-width: 768px) { .cta_frame { border-radius: var(--radius-lg); } }

/* 5. Content: inside the frame. Phones full width; tablet the right 70%; desktop the right 55%. */
.cta_content {
  position: relative;
  container-type: inline-size;   /* the heading sizes itself to this column */
  width: 100%;
  padding: calc(var(--frame-inset) + var(--space-5));
}
@media (min-width: 768px) and (max-width: 991px) {
  .cta_content { width: 70%; margin-left: 30%; padding-left: 0; }
}
@media (min-width: 992px) {
  .cta_content {
    width: 55%; margin-left: 45%;
    padding: calc(var(--frame-inset) + var(--space-7)) calc(var(--frame-inset) + var(--space-8)) calc(var(--frame-inset) + var(--space-7)) 0;
  }
}

/* ---------- Heading ---------- */
.cta_title {
  font-family: var(--font-display);
  font-size: min(var(--text-display), 11.5cqi);  /* capped so each line always fits on one row */
  font-weight: 400;
  line-height: 1.05; letter-spacing: -0.02em;
  color: var(--surface);
  text-wrap: initial;
}
.cta_word { display: inline-block; white-space: nowrap; }  /* words never break in the middle */

/* Scroll-linked letters. Each letter: (progress x total letters) - its index,
   clamped to 0..1, so the letters light up one after another as progress grows. */
.w-mod-js .cta_title { --progress: 0; }
.w-mod-js .cta_letter { opacity: calc(0.3 + 0.7 * clamp(0, var(--progress) * var(--n) - var(--i), 1)); }

/* ---------- One-time reveal of the supporting line and buttons ----------
   Opacity and transform only, so the buttons stay focusable and clickable. */
.w-mod-js .is-reveal {
  opacity: 0; transform: translateY(16px);
  transition: opacity var(--dur-slow) var(--ease-out), transform var(--dur-slow) var(--ease-out);
}
.w-mod-js .cta_actions.is-reveal { transition-delay: 120ms; }
.w-mod-js .is-revealed .is-reveal { opacity: 1; transform: none; }

/* Light focus ring, clearly visible on the dark panel. */
.cta_actions .button:focus-visible { outline: 3px solid var(--brand-tint); outline-offset: 3px; }

/* Reduced motion: no scroll effect; everything visible straight away. */
@media (prefers-reduced-motion: reduce) {
  .w-mod-js .cta_letter { opacity: 1; }
  .w-mod-js .is-reveal { opacity: 1; transform: none; }
}
</style>

<script>
(() => {
  const section = document.querySelector('[data-cta]');
  if (!section) return;
  const panel = section.querySelector('.cta_panel');
  const title = section.querySelector('.cta_title');
  const content = section.querySelector('.cta_content');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

  // ---------- 1. Split the heading into words and letters ----------
  // Screen readers get the whole sentence from aria-label; the letter spans are hidden from them.
  const lines = [...title.querySelectorAll('.cta_title-line')];
  title.setAttribute('aria-label', lines.map((l) => l.textContent.trim()).join(' '));
  let n = 0;
  lines.forEach((line) => {
    const words = line.textContent.trim().split(/\s+/);
    line.setAttribute('aria-hidden', 'true');
    line.replaceChildren(...words.flatMap((word, w) => {
      const wordEl = document.createElement('span');
      wordEl.className = 'cta_word';
      [...word].forEach((ch) => {
        const letter = document.createElement('span');
        letter.className = 'cta_letter';
        letter.style.setProperty('--i', n++);   // this letter's position in the sentence
        letter.textContent = ch;
        wordEl.append(letter);
      });
      return w > 0 ? [document.createTextNode(' '), wordEl] : [wordEl];
    }));
  });
  title.style.setProperty('--n', n);            // total letters

  // ---------- 2. Scroll progress: 0 when the panel's top is at 85% of the screen, 1 at 35% ----------
  const START = 0.85;
  const END = 0.35;
  let ticking = false;
  let listening = false;

  // Reveal the supporting line and buttons once. Never undone.
  const reveal = () => content.classList.add('is-revealed');

  const update = () => {
    ticking = false;
    const vh = innerHeight;
    const top = panel.getBoundingClientRect().top;
    const startPx = START * vh;
    // On tall screens the page may end before the top reaches 35%: finish there instead.
    const maxScroll = document.documentElement.scrollHeight - vh;
    const topAtPageEnd = top + scrollY - maxScroll;
    const endPx = Math.min(Math.max(END * vh, topAtPageEnd), startPx - 1);
    const progress = Math.min(Math.max((startPx - top) / (startPx - endPx), 0), 1);
    title.style.setProperty('--progress', progress.toFixed(4));  // CSS lights the letters
    if (progress > 0.5) reveal();
  };

  const onScroll = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  };

  // Only listen to scrolling while the section is near the screen.
  const listen = (on) => {
    if (on === listening) return;
    listening = on;
    if (on) {
      addEventListener('scroll', onScroll, { passive: true });
      addEventListener('resize', onScroll);
      update();
    } else {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
    }
  };
  new IntersectionObserver(([entry]) => listen(entry.isIntersecting && !reduceMotion.matches), {
    rootMargin: '25% 0px 25% 0px',
  }).observe(section);

  // Keyboard users who tab to a button before the reveal get it revealed.
  content.addEventListener('focusin', reveal);

  const applyMotion = () => {
    if (reduceMotion.matches) {
      listen(false);
      title.style.setProperty('--progress', '1');
      reveal();
    }
  };
  applyMotion();
  reduceMotion.addEventListener('change', applyMotion);
})();
</script>
```

**How the heading lights up, in plain language.** The script splits the heading into one span per letter and numbers them (0, 1, 2…). While you scroll, it calculates one number, `--progress`: 0 when the panel's top edge is at 85% of the screen height, 1 when it's at 35%. It doesn't touch the letters themselves. The CSS does that. Each letter's brightness is "progress × number of letters, minus my number", kept between 0 and 1. So when progress is 0.5, the first half of the letters are fully lit, the next one is part-way, and the rest are dim. Scrolling back reverses it. Webflow adds the `w-mod-js` class to the page as soon as JavaScript runs, and the dimming only applies with that class. So without JavaScript, the heading is simply fully visible.

### Interactions

None native. Webflow's "While scrolling in view" Interaction could fade the whole heading, but not one letter at a time. The reveal is a CSS transition switched by the script.

### Accessibility

| Element | Attribute | Value |
|---|---|---|
| section_cta | ID | `get-started` |
| section_cta | `aria-labelledby` | `cta-title` |
| section_cta | `data-cta` | `true` |
| cta_title | ID | `cta-title` |
| cta_overlay, cta_watermark, cta_frame | `aria-hidden` | `true` |
| cta_photo | Image settings | Decorative (empty alt) |

The script adds `aria-label` with the full sentence to the heading and hides the letter spans, so screen readers read "Your next merge could pay today." instead of single letters. Contrast: white on the overlay passes AA at every breakpoint, because the overlay is darkest where the text sits.

### Checklist

- [ ] Scroll down slowly: the heading's letters light up one after another from dim to full white, and dim again when you scroll back up.
- [ ] Once the heading is about half lit, the supporting line and buttons fade up, and they stay when you scroll back.
- [ ] Tab to "Find a bounty" before it has appeared: it appears straight away, with a light focus ring.
- [ ] On a tall screen where the page ends early, the heading still reaches full white at the bottom of the page.
- [ ] Reduced motion: the heading is fully lit and the buttons visible from the start.
- [ ] 1440: photo on the left, text on the right 55%, heading on two lines. 768: text over the darker overlay on the right 70%. 375: content at the bottom, buttons full width and stacked.
- [ ] The watermark is cut off by the panel's bottom edge, and there's no horizontal page scroll.
- [ ] Screen reader: the heading reads as one sentence.

---

## Final pass (whole page)

- [ ] Section order on the page: Hero, WaysToEarn, Paths, BountyBoard, Contributors, HowItWorks, FAQ, FinalCTA.
- [ ] Every colour in the Style panel is a Variable; no raw hex values in the Designer.
- [ ] Lighthouse accessibility score ≥ 95; no contrast warnings. The Astro build passed WCAG AA with these exact tokens.
- [ ] "Payouts via PayPal" wording is used, and no PayPal brand colours appear.
- [ ] Only the hero has a load animation; no other section fades in on scroll. The other motion is fixed: the Paths pin, BountyBoard filters and counter-offer, the Contributors carousel, the HowItWorks timer, the FAQ accordion and the FinalCTA heading. All of it respects reduced motion.
- [ ] Test once with the keyboard only, and once with VoiceOver or NVDA, at Desktop and Mobile portrait.
