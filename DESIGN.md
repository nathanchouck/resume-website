---
name: nathanhouck.com
description: Ink-and-paper portfolio for an engineer who writes — precision without costume.
colors:
  iron-gall-blue: "oklch(0.45 0.16 268)"
  iron-gall-bright: "oklch(0.72 0.12 265)"
  blue-black-ink: "oklch(0.24 0.025 270)"
  ink-secondary: "oklch(0.38 0.02 270)"
  ink-tertiary: "oklch(0.5 0.015 270)"
  cool-paper: "oklch(0.97 0.005 265)"
  paper-raised: "oklch(0.94 0.006 265)"
  hairline: "oklch(0.88 0.008 265)"
  midnight-desk: "oklch(0.22 0.02 268)"
  paper-white: "oklch(0.985 0.002 265)"
typography:
  display:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "clamp(2.15rem, 4.8vw, 3.4rem)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.72
  title:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "16px"
    fontWeight: 400
    letterSpacing: "normal"
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.3
  mono:
    fontFamily: "'Fragment Mono', monospace"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: "0.15em"
rounded:
  none: "0px"
spacing:
  xs: "8px"
  sm: "14px"
  md: "24px"
  lg: "56px"
  xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.iron-gall-blue}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.none}"
    padding: "12px 24px"
  link-quiet:
    textColor: "{colors.ink-secondary}"
  section-title:
    textColor: "{colors.ink-tertiary}"
    typography: "{typography.title}"
---

# Design System: nathanhouck.com

## 1. Overview

**Creative North Star: "Ink & Instrument"**

The system pairs the writer's ink with the engineer's instrument. Every surface is cool paper carrying blue-black ink; every accent is one archival blue; every structural line is a hairline drawn with intent. The engineering is expressed through precision — exact alignment, weighted line-work in real technical drawings, tabular numbers — never through costume. This system explicitly rejects the props it once wore: no fake report stamps, no document-larp labels, no "NH-2026 · REV 07". If an element pretends to be a physical document artifact rather than simply being well-made, it is off-system.

It equally rejects the saturated defaults of its category (per PRODUCT.md): the LinkedIn-template student portfolio, bright SaaS marketing, AI-template aesthetics (cream-and-serif defaults, eyebrow labels, glassmorphism), and sci-fi/space kitsch. Space and AI appear as authentic artifacts — a converging–diverging nozzle section, an agent memory graph — drawn in the system's own ink.

**Key Characteristics:**
- Cool paper, never warm cream; midnight desk (dark) is the first-load default, cool paper on the toggle
- One accent (Iron-Gall Blue) doing every colored job on the page
- Serif-led voice (Literata) framed by machined UI (Archivo); mono quarantined inside figures
- Hairline rules and sharp corners; flat surfaces; depth by tint, not shadow
- Two living line drawings as the personality anchors, ambient and reduced-motion-safe

## 2. Colors

An ink system: two or three values of one blue-black on cool paper, with a single saturated archival blue as the only voice.

### Primary
- **Iron-Gall Blue** (oklch(0.45 0.16 268)): the one accent. Primary CTA fill, link hover, active nav mark, figure annotations (dimension callouts, retrieval path, query node), status labels, Contents numbers. In dark theme it brightens to **Iron-Gall Bright** (oklch(0.72 0.12 265)).

### Neutral
- **Blue-Black Ink** (oklch(0.24 0.025 270)): primary text and figure contours. Reads black; carries a blue soul.
- **Ink Secondary** (oklch(0.38 0.02 270)): prose and quiet document links.
- **Ink Tertiary** (oklch(0.5 0.015 270)): captions, metadata, section titles. Floor: never lighter than this for text (5.5:1 on paper).
- **Cool Paper** (oklch(0.97 0.005 265)): the body. Tinted 0.005 toward the ink hue — deliberately cool, never the warm-cream band.
- **Paper Raised** (oklch(0.94 0.006 265)) and **Hairline** (oklch(0.88 0.008 265)): surfaces and rules.
- **Midnight Desk** (oklch(0.22 0.02 268)): dark theme body; the same system after dark.

### Named Rules
**The One Ink Rule.** Iron-Gall Blue is the only chromatic voice, on ≤10% of any screen. If a second hue appears anywhere outside a photograph, it is a bug. The retired red must not return.

## 3. Typography

**Display Font:** Literata (variable, optical sizing; Georgia fallback)
**Body Font:** Literata
**Label/UI Font:** Archivo (system-ui fallback)
**Figure Mono:** Fragment Mono

**Character:** A writer's serif carried in a machinist's frame. Literata speaks where prose lives: the headline, body paragraphs, quoted questions, and captions. Archivo measures everything else: labels, section titles, values, numbers, nav. The pairing contrasts serif warmth against grotesque precision.

### Hierarchy
- **Display** (500, clamp(2.15rem, 4.8vw, 3.4rem), 1.12): the headline sentence. One per page.
- **Body** (400, 17px, 1.72): prose at ≤62ch, `text-wrap: pretty`.
- **Title** (Archivo 600, 13px, normal case, ink): section titles with a trailing hairline ("Currently", "Contents", "Ask the memory") — an instrument label, not an eyebrow. Status labels and nav rows are Archivo too; UI is the engineer's voice.
- **Label** (500, 13px / 10px in the nav rail): Archivo UI text; values in status rows at 14px; `tabular-nums` for any number that aligns.
- **Mono** (400, 11–12px, letter-spacing 0.15em): ONLY inside figures — station labels, dimension symbols, QUERY/MATCH.

### Named Rules
**The Quarantined Mono Rule.** Fragment Mono may appear only inside a drawing, where a technical annotation is authentic. Mono as UI chrome is forbidden — that is the costume this system already took off once.
**The Two Voices Rule.** Serif (Literata) speaks only where prose lives: the headline, body paragraphs, quoted questions, and captions. Every label, section title, value, and navigation row is Archivo, roman, normal case. Italic serif used as a label is the AI-editorial fingerprint; it is forbidden here.

## 4. Elevation

Flat, absolutely. No box-shadows exist anywhere in the system. Depth is conveyed by tint steps (Cool Paper → Paper Raised) and hairline rules in light; in dark, by slightly lighter surfaces on Midnight Desk. Focus is a 2px Iron-Gall outline, offset 2px — the one glow-adjacent treatment, and it is functional.

### Named Rules
**The Flat Paper Rule.** If an element casts a shadow, it is off-system. Separation is drawn (hairlines) or tinted (paper steps), never floated.

## 5. Components

Precise and unhurried: sharp corners, hairline separations, generous vertical air. Nothing raises its voice; precision carries the feeling. Buttons, quiet links, and page titles are shared components (src/components/PrimaryButton.jsx, QuietLink.jsx, PageTitle.jsx, SectionTitle.jsx); the SPA nav guard lives in src/utils/nav.js.

### Buttons
- **Shape:** sharp (0px radius), machined edges
- **Primary:** Iron-Gall Blue fill, Paper White text (oklch(0.985 0.002 265)), Archivo 14px semibold, 12px × 24px padding, trailing "→"
- **Hover / Focus:** opacity 0.9 on hover; active nudges 1px down; focus ring 2px Iron-Gall
- **Quiet document links:** Ink Secondary with hairline-colored underline (underline-offset 4px); hover floods text and underline with Iron-Gall

### Ruled rows (status + contents)
- **Style:** hairline `border-bottom` per row, no cards, no side-stripes
- **Status row:** Archivo 13px medium label in Ink Secondary (118px column) + Archivo 14px value
- **Contents row:** aria-hidden tabular number in Iron-Gall, Archivo 15px medium title, arrow that gains Iron-Gall and +2px translate on hover; row hover tints to Paper Raised

### Figures (signature)
- Line drawings with weighted strokes: 2.25px ink contours against 0.6–0.9px hairline construction; drafting-tick dimension ends (never filled arrowheads); mono annotations quarantined inside
- **The nozzle lives in the background:** faint ambient line-work (opacity 0.09, no text, streamlines still traveling at 2.1s) behind the hero title block, hidden below md. Drawings as atmosphere, not framed exhibits.
- **The memory graph lives in the "ask the memory" demo:** a question fades in ("asked", italic serif), a one-shot pulse crosses the retrieval curve (1.45s, ease-out), the MATCH ring flares, the answer appears ("recalled", Archivo). Auto-cycles ~7s per pair via JS; first pair is server-rendered so the section reads without JS; auto-cycling is disabled under reduced motion. Fallback ambient mode: looping bead (4.2s) + breathing ring (3.8s).
- All motion is dashoffset/opacity only; entrances use CSS `backwards` fill so content is complete without JS, and reduced motion collapses everything to a finished static drawing
- **Captions:** italic serif 13px, Ink Tertiary, no "Fig." numbering

### Navigation
- Icon rail (64px, left on desktop / bottom bar on mobile), lucide icons at 1.5px stroke with 10px Archivo labels beneath, active item in Iron-Gall with a hairline position marker; theme toggle is a real button

### Inputs
- None exist in the system yet; when one arrives: sharp corners, hairline stroke, Iron-Gall focus ring, paper background.

## 6. Do's and Don'ts

### Do:
- **Do** keep midnight desk (dark) as the first-load default; cool paper is the toggle. Returning visitors keep their stored choice.
- **Do** spend Iron-Gall Blue only on: primary CTA, links/hovers, active nav, figure annotations, status labels, Contents numbers.
- **Do** draw separations with hairlines (oklch(0.88 0.008 265)) and keep every corner sharp (0px).
- **Do** keep both drawings alive (traveling dashes, breathing ring) and complete without JavaScript.
- **Do** hold text contrast: body ≥ Ink Secondary, captions ≥ Ink Tertiary (5.5:1 floor).

### Don't:
- **Don't** reintroduce costume props: report stamps, "REV" numbers, ABSTRACT labels, "Fig." prefixes, or any document-larp detail. (PRODUCT.md: the kitsch ban is not a ban on the subject — artifacts yes, props no.)
- **Don't** use the anti-reference aesthetics PRODUCT.md names: "LinkedIn / generic student portfolio", "bright SaaS marketing", "AI-template aesthetics" (cream-and-serif defaults, eyebrow labels on every section, glassmorphism), "sci-fi / space kitsch" (starfields, planet illustrations, NASA-punk).
- **Don't** warm the paper. The body background never enters the cream band (warm hue 40–100); it stays cool toward the ink hue.
- **Don't** use mono outside a figure, tracked-uppercase section eyebrows, side-stripe borders, gradient text, or box-shadows.
- **Don't** bring back the red. One ink.
