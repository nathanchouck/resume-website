# Design Brief — Home Page Re-skin (confirmed 2026-07-17 · REVISED 2026-07-18)

Status: **Revision 2 confirmed by Nathan** after critique. The v1 "technical report" costume below is SUPERSEDED where it conflicts with this revision.

## Revision 2 — "Fountain pen" (2026-07-18)

Nathan's verdict on v1: not a fan of the document costume ("NH-2026 · REV 07" stamps, ABSTRACT labels) — wants "more elegant things but with that engineering touch... carefully engineered solutions... almost like a fountain pen." Lane: precision instrument, realized through the fountain pen as anchor object (elegant engineering in service of writing).

- **Strip all costume props:** masthead stamp, ABSTRACT/CURRENT STATUS/CONTENTS mono-tracked labels, "Fig. N —" caption prefixes.
- **Palette: paper & ink.** Cool paper tinted 0.005 toward the ink hue; blue-black ink text (oklch ~0.24 0.025 270); ONE accent = saturated fountain-ink blue (~oklch 0.45 0.16 268) for CTA/links/figure annotations/active nav. Dark = midnight desk (deep blue-black paper, lighter ink accent). Red retired.
- **Type: serif-led elegance in a machined frame.** Literata (opsz) carries headline + prose + italic section titles ("Currently", "Contents") — lowercase italic serif, not tracked caps. Archivo for UI (buttons, values, numbers, tabular-nums). Fragment Mono ONLY inside the nozzle drawing (authentic to a technical drawing, not costume).
- **Keeps (Nathan's picks):** the nozzle drawing (restyled: ink strokes, ink-blue annotations, quiet italic caption, no "Fig." number) and the page structure & content (headline → CTA → bio → portrait → figure → status → contents, copy unchanged).
- **Robustness (P1 from critique):** entrances become CSS keyframes with animation-fill-mode: backwards — static state fully visible, no JS required for content. Nozzle draw-in via pathLength/dashoffset keyframes, same principle.
- **Folded-in P2 fixes:** theme toggle becomes a real button; Projects nav icon gear → drafting-compass; persistent micro-labels under nav icons below lg.
- **Closing beat (P3):** quiet italic "— N.H." end mark after Contents.
- **Location line:** normal case (kills the detector's all-caps-body finding).

## Summary

Rebuild the home page as the opening section of a technical report about Nathan — NACA-report / Haynes-manual grammar (title block, abstract, numbered contents, figure plates) carrying the new story: rocket propulsion, AI systems work, writing. Primary reader: a recruiter deciding in under a minute whether to download the résumé.

## Primary user action

Download résumé (filled red button, high on page). Secondary: contents block into Projects / Musings. Email is a quiet ink text link.

## Direction

- **Color: Restrained, print-native.** True off-white paper (chroma ≈ 0 — NOT the cream band), near-black ink, one annotation red (Haynes red, replaces clay `#b8763d`). Red spent only on: structural rules, figure annotations, primary CTA, link underlines, active nav mark. ≤10% coverage.
- **Theme: light becomes the site default** (scene: recruiter at an office desk mid-morning, page reads like a filed technical report). Dark re-derived (charcoal paper, same logic, same red) on the existing next-themes toggle.
- **Anchors:** NACA/NASA technical reports; Haynes workshop manuals; the current site's quiet confidence as temperament check.
- **Type:** Archivo (structure/title block/nav, bold + condensed weights) · Literata (writer voice: abstract + long-form) · Fragment Mono (engineer voice: report header, captions, telemetry, dates). All Google Fonts via next/font.

## Scope

Production-ready. One screen (home), but tokens land globally in `src/app/globals.css` under the existing variable names so other pages inherit coherently; each gets its own pass later. Responsive to 360px, WCAG 2.2 AA, reduced motion honored.

## Layout (top to bottom)

1. **Report header** — mono, one thin rule: identity left, stamp right (`NH-2026 · REV 07`). The page's one labeling system; no per-section eyebrows.
2. **Title block** — headline as manual title (Archivo bold, ≤6rem); mono metadata line (location / ERAU '27) beneath; CTA row at block end.
3. **Abstract** — Literata lede ~60ch: propulsion focus (nozzle theory, cold gas experiment), AI systems work, the writing. This IS the bio; no separate About.
4. **Fig. 1** — portrait, 4:5 editorial crop, off-axis right on desktop, print treatment, mono caption `Fig. 1 — N. Houck, Daytona Beach, 2026.`
5. **Fig. 2** — converging–diverging nozzle contour line drawing (SVG, dimension callouts, red annotation arrows). Engineering artifact, not decoration.
6. **Status table** (Now block) — telemetry mono rows, ruled, no card: RESEARCHING cold gas nozzle experiment · BUILDING AI evaluation prototypes (EPI-USE internship) · READING current title.
7. **Contents** — the one earned numbered sequence: `1 Projects / 2 Résumé / 3 Musings / 4 Now`, ruled ToC rows, hover shift + red arrow.

Sidebar nav stays this pass (restyled by tokens); document-header nav is a deliberate follow-up.

## States

Light + re-derived dark (both AA; red-as-text darkened to pass on paper) · desktop two-col (abstract + Fig. 1) → mobile single col (portrait after title block, contents last) · reduced-motion = instant/crossfade · next/font with metric fallbacks, no CLS · hover/focus: ToC row shift, red underlines, red focus ring.

## Motion

One quiet orchestrated load (rules draw in, title block + figures settle, ease-out-expo; content visible without JS). Calm after load; micro-feedback only. No scroll theatrics.

## Content

- Headline drafts (pick at craft): "Rocket nozzles, memory systems, and carefully made sentences." / "Propulsion student. Systems builder. Writer." / "Building engines and essays with the same care."
- Abstract: 2–3 specific sentences; no "passionate about aerospace."
- Status rows honest: "evaluation prototypes and recommendation briefs for AI practice leaders."
- Assets (all confirmed in `/public/`): portrait `headshot-1052x1315.jpg` (already exactly 4:5 — use as-is for Fig. 1); square `headshot-1024x1024.jpg` available as fallback; CTA href → `NathanHouck-Resume-Generic.pdf` (serve with `download` attr as "NathanHouck-Resume.pdf"); `NathanHouck_CV.pdf` gets a quiet secondary document link beside the email link. Nozzle contour = generated SVG.

## References for implementation

typeset.md, layout.md, animate.md, colorize.md (accent discipline).

## Asserted defaults (not open)

Light default + re-derived dark · global token flip, per-page refinement later · sidebar retained · headline chosen during craft from drafts.
