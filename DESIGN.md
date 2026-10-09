---
name: Nex-Gen Management
description: Multifamily property management in TN, KY and AL, shown through its real portfolio.
colors:
  ink-teal: "#073545"
  ink-teal-raised: "#145265"
  harbor-teal: "#136277"
  deep-teal: "#0b7a93"
  scooter-cyan: "#1ddef3"
  scooter-cyan-base: "#01c5de"
  scooter-cyan-soft: "#63f0fd"
  cyan-mist: "#cefcff"
  cyan-wash: "#a3f8fe"
  cyan-frost: "#ecffff"
  mineral-ground: "oklch(0.972 0.005 200)"
  paper-white: "#ffffff"
  ash-50: "#fafafa"
  ash-100: "#f5f5f5"
  ash-200: "#e5e5e5"
  ash-500: "#737373"
  ash-600: "#525252"
  ash-700: "#404040"
  ash-950: "#0a0a0a"
typography:
  display:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5.6vw, 5.2rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  figure:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 6vw, 5.5rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.04em"
    fontFeature: "\"tnum\" 1"
  headline:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 4.6vw, 4rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.035em"
  headline-sm:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3.4rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  title-sm:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  lead:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.43
  caption:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
rounded:
  field: "8px"
  logo-plate: "14px"
  tile: "18px"
  table: "20px"
  inset: "22px"
  stat-chip: "26px"
  card: "28px"
  pill: "9999px"
spacing:
  gutter: "12px"
  gutter-sm: "16px"
  card-pad: "28px"
  card-pad-md: "40px"
  card-pad-lg: "56px"
  section: "96px"
  section-md: "128px"
  container: "1440px"
components:
  pill-brand:
    backgroundColor: "{colors.scooter-cyan}"
    textColor: "{colors.ink-teal}"
    rounded: "{rounded.pill}"
    height: "48px"
    padding: "0 6px 0 20px"
  pill-brand-hover:
    backgroundColor: "{colors.scooter-cyan-soft}"
  pill-dark:
    backgroundColor: "{colors.ink-teal}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.pill}"
    height: "48px"
    padding: "0 6px 0 20px"
  pill-dark-hover:
    backgroundColor: "{colors.ink-teal-raised}"
  pill-light:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink-teal}"
    rounded: "{rounded.pill}"
    height: "48px"
    padding: "0 6px 0 20px"
  pill-light-hover:
    backgroundColor: "{colors.cyan-frost}"
  pill-ghost-light:
    textColor: "{colors.paper-white}"
    rounded: "{rounded.pill}"
    height: "48px"
    padding: "0 6px 0 20px"
  pill-lg:
    height: "56px"
    padding: "0 8px 0 24px"
  card-ink:
    backgroundColor: "{colors.ink-teal}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-pad-lg}"
  card-paper:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink-teal}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-pad-md}"
  card-cyan:
    backgroundColor: "{colors.scooter-cyan}"
    textColor: "{colors.ink-teal}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-pad-md}"
  path-rail-item:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink-teal}"
    rounded: "{rounded.inset}"
    padding: "20px 24px"
  path-rail-item-lead:
    backgroundColor: "{colors.scooter-cyan}"
    textColor: "{colors.ink-teal}"
  community-tag:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink-teal}"
    padding: "10px 24px 10px 44px"
  filter-tabs:
    backgroundColor: "{colors.ash-100}"
    textColor: "{colors.ash-600}"
    rounded: "{rounded.pill}"
    padding: "4px"
  filter-tab-selected:
    backgroundColor: "{colors.ink-teal}"
    textColor: "{colors.paper-white}"
  state-chip:
    backgroundColor: "{colors.scooter-cyan}"
    textColor: "{colors.ink-teal}"
    rounded: "{rounded.pill}"
    size: "32px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.ash-950}"
    rounded: "{rounded.field}"
    height: "44px"
    padding: "0 12px"
  photo-caption:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink-teal}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
---

# Design System: Nex-Gen Management

## Overview

**Creative North Star: "The Key Ring"**

The site is a set of heavy, well-made objects laid on a pale mineral table: deep teal-ink slabs carry the weight, white paper cards hold the working detail, and one bright cyan picks out whatever you can act on or count. Every block is a large soft-cornered card sitting 12px from its neighbours, so a page reads as a tray of tiles rather than a scroll of bands. The community logos are cut as key tags, with a punched hole and a pointed end, because the portfolio of named properties is the proof the whole system exists to show.

Density is generous but not airy. Cards are big (up to 780px tall in the hero), headlines are large and tightly tracked, and the space between sections (96px, 128px from md up) is the only open air. Inside cards, information is set tight: figures, ticked service lists, tabular rows. Photography is real-estate interiors and exteriors, always clipped into a rounded card or pill, never full-bleed.

Motion is calm and physical: lines of the hero headline rise out of masks, figures count up once, bars grow from the baseline, photos drift slightly with scroll, and every arrow nudges toward its destination on hover. Nothing loops except the community-tag marquee, which pauses on hover and stops under reduced motion.

**Key Characteristics:**
- Mineral off-white ground, teal-ink mass, cyan as the single live accent.
- 28px-radius cards on a 12px gutter grid, inside a 1440px container.
- Pill buttons with a nested circular arrow that rotates 45 degrees on hover.
- Hanken Grotesk display at weight 600 with negative tracking; Inter for everything read.
- Flat surfaces separated by hairline rings; shadow only where something floats.
- Community logos as die-cut key tags.

## Colors

One ink, one light, one ground: a deep teal-ink family, a single scooter cyan, and a neutral grey ramp on a barely-tinted off-white.

### Primary
- **Scooter Cyan** (scooter-cyan): the live accent. Primary pill background, the lead path-rail item, the communities stat chip, state chips, check marks and icons on ink, the arrow pill in the "We manage homes" row, and the Residents card. If it is cyan, you can press it or it is a number that matters.
- **Scooter Cyan Base** (scooter-cyan-base): the brand token (`--color-brand`). Used for the current-week bar and bullet dots in the sample report, the one place cyan marks data rather than action.
- **Soft Cyan** (scooter-cyan-soft): hover state of cyan surfaces and the highlighted second clause of headlines and arrow glyphs set on ink.

### Secondary
- **Ink Teal** (ink-teal): the structural mass. Hero card, footprint band, proposal card, quote card, footer, utility bar, mobile menu, dark pills, the selected filter tab, and the arrow disc inside light pills. Also the text color on every light and cyan surface, instead of black.
- **Raised Ink** (ink-teal-raised): hover state of ink surfaces; the photo card's loading background.
- **Harbor Teal** (harbor-teal): the third material in the lifecycle cards; initials text in team avatars.
- **Deep Teal** (deep-teal): small positive deltas and icons on cyan-frost discs; it is the readable teal on white.

### Tertiary
- **Cyan Mist** (cyan-mist): the stage behind the sample report sheet; on ink, at 75 to 85% opacity, the body text color.
- **Cyan Wash** (cyan-wash): non-current bars in the report chart.
- **Cyan Frost** (cyan-frost): icon discs, avatar discs, light-pill hover and row hover (at 60%).

### Neutral
- **Mineral Ground** (mineral-ground): the page background, an off-white with a trace of the brand teal. The canonical value is OKLCH.
- **Paper White** (paper-white): paper cards, path-rail items, community tags, logo plates.
- **Ash 50 / 100 / 200** (ash-50, ash-100, ash-200): KPI tiles and table header (50), filter track and state pills (100), borders, inputs and logo-plate rings (200).
- **Ash 500 / 600 / 700** (ash-500, ash-600, ash-700): captions and metadata (500), supporting paragraphs on white (600), nav links and report notes (700).
- **Ash 950** (ash-950): the token foreground for form text; display text uses Ink Teal instead.

### Named Rules
**The One Live Color Rule.** Cyan is the only saturated hue on the page. It marks the primary action, the lead choice and the headline figure; a second accent is never introduced. The one exception is the amber "Sample · illustrative figures" flag, which is a status warning, not decoration.

**The Ink-Not-Black Rule.** Text on light and cyan surfaces is Ink Teal, not neutral black. Hairlines are Ink Teal at 6 to 15% opacity, not grey borders.

## Typography

**Display Font:** Hanken Grotesk (with ui-sans-serif, system-ui), self-hosted through the Astro Fonts API, weights 400 to 800.
**Body Font:** Inter (with ui-sans-serif, system-ui), self-hosted through the Astro Fonts API with a metric-adjusted fallback, variable 100 to 900.

**Character:** A compact, slightly rounded grotesk set heavy and tight for anything spoken in the brand's voice, over a neutral Inter for everything read at length. The contrast is weight and tracking, not style.

### Hierarchy
- **Display** (600, clamp(2.5rem, 5.6vw, 5.2rem), 0.98): the hero headline only, max 16ch, balanced, second clause in Soft Cyan.
- **Figure** (600, clamp(3rem, 6vw, 5.5rem), 1, tabular): the counted stats in the footprint band.
- **Headline** (600, clamp(2.2rem, 4.6vw, 4rem), 1): section headlines (owners, communities, proposal), balanced, at most about 7/12 columns wide.
- **Headline Small** (600, clamp(2rem, 4vw, 3.4rem), 1.02): headlines inside a card (footprint, report, residents).
- **Title** (600, 1.75rem, 1.25): lifecycle stage names. **Title Small** (600, 1.125rem): path-rail labels, list item heads, row names.
- **Lead** (400, 1.125rem, 1.625): the paragraph next to a headline, held to 40 to 46ch.
- **Body** (400, 1rem, 1.5): running text; on cards often 0.95rem.
- **Label** (500, 0.875rem): buttons at 0.95rem to 1rem, filter tabs, chips, photo captions.
- **Caption** (400, 0.75rem): table heads, KPI labels, metadata.

### Named Rules
**The Display Voice Rule.** Every heading, figure, stat and named item (community, team member, list head) is set in Hanken Grotesk at 600 or above with negative tracking (-0.025em to -0.04em). Inter never carries a heading.

**The Tabular Figures Rule.** Any number that can change or be compared (counts, percentages, state totals) uses tabular figures.

## Layout

A 12-column grid inside a 1440px container, with a 12px gutter (16px from sm up) used both as the page edge and the gap between cards. Sections stack as rows of cards: the dominant split is 7/5 (hero, owners intro, report, team), with 5/7 for the proposal and 5/4/3 for the residents bento. Lifecycle stages run 1, 2 and 4 across; the path rail runs 1 then 3 across.

Section rhythm is fixed: 96px above each section, 128px from md up. Card padding steps 28px, 40px (sm) and 56px (lg). Headline blocks sit on the grid with an extra 8 to 24px inset so text aligns inside the card edge rather than on it. Text measures are held by ch-based max widths (16ch display, 40 to 46ch leads, 60ch notes).

On mobile everything collapses to one column of full-width cards with the same 12px gaps; the floating nav keeps its pill and swaps links for a menu disc that opens a 28px-radius ink panel.

## Elevation & Depth

Flat by default. Cards are separated by the 12px gap, by material (ink, paper, cyan) and by a hairline ring of Ink Teal at 6% on paper cards. Shadow appears only on three things that float above the page, and every shadow is tinted with Ink Teal, never grey.

### Shadow Vocabulary
- **Nav lift** (`box-shadow: 0 12px 32px -16px rgb(7 53 69 / 0.35)`): added to the floating pill nav once the page scrolls past 24px.
- **Sheet** (`box-shadow: 0 40px 80px -40px rgb(7 53 69 / 0.45)`): the sample report sheet resting on its cyan-mist stage.
- **Tag drop** (`filter: drop-shadow(0 6px 10px rgb(7 53 69 / 0.12))`): community key tags, as a drop-shadow so it follows the die-cut silhouette.

### Named Rules
**The Floating-Only Shadow Rule.** A shadow means the object is not part of the tray: the sticky nav, a document laid on a stage, a tag hanging in the marquee. Cards in the grid never carry one.

## Shapes

Big soft rectangles and full pills. Outer cards are 28px; cards nested inside another card or sitting as a secondary row (path rail, stat grid, inner sheet) step down to 22px, the directory table to 20px, KPI tiles to 18px, and logo plates to 14px. Everything interactive that is not a field is a full pill or circle: buttons, nav, filter track, chips, icon discs, arrow discs, and the "We manage homes" word tiles. Form fields keep the quieter 8px Starwind radius.

The one non-rectangular silhouette is the community key tag: a pointed left end, chamfered right corners and a real punched hole that shows the ground through it.

**The Nested Radius Rule.** A shape inside a card is always smaller-cornered than the card holding it (28, then 22, 20, 18, 14), so nesting reads at a glance.

## Components

### Buttons (Pill Link)
Confident and tactile: a label followed by a circular arrow disc riding inside the pill's right end.
- **Shape:** full pill (9999px); 48px tall with a 36px disc, or 56px with a 40px disc for hero and menu actions.
- **Brand:** Scooter Cyan with Ink Teal text; the disc is Ink Teal with a Soft Cyan arrow. Hover moves to Soft Cyan.
- **Dark:** Ink Teal with white text, disc in Scooter Cyan. Hover to Raised Ink. Used in the nav and on paper cards.
- **Light / Ghost:** white with Ink Teal text, or transparent with a 25% white ring (on ink) or 15% Ink Teal ring (on paper).
- **Hover / Focus:** background eases over 300ms; the disc rotates 45 degrees and nudges up-right over 500ms, both on cubic-bezier(0.32, 0.72, 0, 1). Press scales to 0.98. Focus is a 2px Scooter Cyan outline offset 3px.
- The form's submit button repeats the Dark pill with an inline disc.

### Chips
- **State chip:** a 32px Scooter Cyan disc with the bold state code, inside a translucent white pill on ink (white 8% fill, 12% ring).
- **Stat chip:** a 26px-radius cyan block on the hero photo with a large display figure.
- **Photo caption:** a white 95% pill floating bottom-left on a photo card.
- **Directory state pill:** Ash 100 fill, Ash 700 caption text.

### Cards / Containers
- **Corner Style:** 28px for every section card.
- **Background:** one of three materials: Ink Teal (headline and closing mass), Paper White (working detail), Scooter Cyan (one accent card per view at most).
- **Shadow Strategy:** none; see Elevation.
- **Border:** paper cards carry a 1px Ink Teal ring at 6%; ink and cyan cards carry none.
- **Internal Padding:** 28px, 40px from sm, 56px from lg for hero-weight cards.

### Inputs / Fields
- **Style:** Starwind input: 1px Ash 200 border, transparent fill, 8px radius, 44px tall, 12px horizontal padding, placeholder in Ash 600.
- **Focus:** border turns Scooter Cyan with a 3px cyan ring at 50%.
- **Error / Disabled:** red border and red ring on error; 50% opacity when disabled.

### Navigation
- **Utility bar:** a 40px Ink Teal strip of resident links and the phone number, Cyan Mist text, hover to Soft Cyan.
- **Floating pill nav:** sticky, 12px from the top, 64px tall, white at 85% with a 6% ink ring and backdrop blur; gains the Nav lift shadow on scroll. Logo sits in an ink disc; links are Ash 700 pills that fill with Ink Teal at 5% on hover. The right end holds a Dark pill.
- **Mobile:** an ink menu disc toggles a 28px-radius ink panel with display-size links divided by 10% white rules, opening with a fade and scale from 0.97.

### Path Rail
Three 22px-radius tiles under the hero: a display label, a one-line note and a 44px arrow disc that slides 4px right on hover. The first (owners) is Scooter Cyan; the others are Paper White with a hairline ring.

### Community Key Tag
The signature object: a white die-cut tag (pointed end, chamfered corners, punched hole) holding the community logo on a 14px-radius plate, the name in display type and the city in caption. Tags run in two opposing marquee rows (70s and 80s per loop), pausing on hover.

### Community Directory
A paper card holding a segmented filter (Ash 100 track, an Ink Teal indicator that slides between tabs over 500ms), a 20px-radius table with logo plates, and a 40px ring arrow per row that fills Ink Teal on row hover and turns 45 degrees on its own hover. Filtered rows fade up 8px with a 30ms stagger.

## Do's and Don'ts

### Do:
- **Do** build every section as one or more 28px cards on the 12px gutter, inside the 1440px container.
- **Do** choose each card's material from ink, paper or cyan, and use at most one cyan card per viewport.
- **Do** set every heading, figure and named item in Hanken Grotesk at 600 with negative tracking, and use tabular figures for numbers.
- **Do** end every primary link in a circular arrow disc that turns 45 degrees on hover, eased on cubic-bezier(0.32, 0.72, 0, 1).
- **Do** tint shadows and hairlines with Ink Teal (rgb(7 53 69)) and reserve shadows for floating objects.
- **Do** step radii down when nesting: 28, 22, 20, 18, 14.
- **Do** respect reduced motion: no marquee, no count-up, no parallax, content visible without JS.

### Don't:
- **Don't** introduce a second saturated accent; the amber sample flag is the only non-teal hue, and only for status.
- **Don't** use neutral black or grey borders for text and dividers on light surfaces; use Ink Teal and its alphas.
- **Don't** run photography full-bleed or square-cornered; photos live inside a rounded card or pill.
- **Don't** put a drop shadow on grid cards.
- **Don't** set headings in Inter or in a light weight.
