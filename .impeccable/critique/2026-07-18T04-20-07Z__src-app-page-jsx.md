---
target: home page
total_score: 31
p0_count: 0
p1_count: 1
timestamp: 2026-07-18T04-20-07Z
slug: src-app-page-jsx
---
# Critique — Home page (post re-skin), 2026-07-18

Method: dual-agent (A: design review, Opus · B: detector + browser evidence, Sonnet)

## Design Health Score — 31/40 (Good)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | No confirmation beyond native download UI for résumé CTA |
| 2 | Match System / Real World | 3 | Projects nav icon is a gear (reads "Settings"); "Abstract" over first-person bio |
| 3 | User Control and Freedom | 3 | Theme toggle not keyboard-operable |
| 4 | Consistency and Standards | 4 | Disciplined 3-voice type + red budget held |
| 5 | Error Prevention | 3 | Minimal error surface; nothing risky |
| 6 | Recognition Rather Than Recall | 2 | Icon-only nav; tooltips hover-only and hidden on mobile |
| 7 | Flexibility and Efficiency | 3 | Skip link + ToC good; theme toggle keyboard gap |
| 8 | Aesthetic and Minimalist Design | 4 | Print-native restraint; every element earns its place |
| 9 | Error Recovery | 3 | n/a — no error states on this surface |
| 10 | Help and Documentation | 3 | Self-documenting except unlabeled nav |
| **Total** | | **31/40** | **Good (28–35)** |

## Anti-Patterns Verdict

Not slop. LLM assessment: all hard bans pass (no side-stripes, no gradient text, no glass, no hero-metric, no card grids, chroma-0 paper verified rgb(245,245,245), no overflow at 375/1280). Report grammar (ABSTRACT/CURRENT STATUS/CONTENTS + Fig. captions + masthead) judged a coherent named system, not eyebrow scaffolding; CONTENTS numbers are a real ToC. Second-order: "technical-manual aerospace portfolio" is an emerging second reflex, but the nozzle figure's genuine engineering specificity (correct C-D geometry, M=1 throat, d*/de callouts, expansion characteristics) clears it.

Deterministic scan: CLI clean (exit 0, 5 files). Browser detector found exactly 1: `all-caps-body` on the 60-char uppercase mono location line — technically accurate, judged a deliberate exception (report meta line, tracked, tertiary). Overlays: injection succeeded but overlay divs carried display:none; NOT user-visible this session.

## Priority Issues

- **[P1] Page is blank without/before JavaScript.** SSR HTML bakes opacity:0 (+translate/blur) on all 9 major blocks; content invisible until Motion hydrates. Violates the brief's "content visible without JS"; worst for the time-boxed recruiter on slow connections. Fix: visible default state, animate from a mount-applied hidden class (or `js` class gate). Email link is also JS-assembled — no mailto without JS. Suggested: /impeccable harden.
- **[P2] Theme toggle not keyboard-accessible.** Renders as `<a>` without href/role/tabindex; absent from focus order (WCAG 2.1.1). Fix: real `<button>`. Suggested: /impeccable audit or harden.
- **[P2] Icon-only nav + wrong gear icon.** Projects uses "settings" gear; tooltips hover-only and `hidden lg:block` (no labels at all on mobile). Fix: projects-appropriate glyph + persistent micro-labels below lg. Suggested: /impeccable clarify + adapt.
- **[P3] Peak-end weakness.** Strongest artifact (nozzle) mid-scroll; page ends on utilitarian ToC. Fix: closing beat in the writer's voice. Suggested: /impeccable delight.
- **[P3] "Abstract" label over first-person bio.** Genre friction: report costume vs warmth. Decide: keep or relabel. Suggested: /impeccable clarify.

## Persona Red Flags

- Jordan (first-timer): gear icon reads Settings; relies wholly on in-page Contents; persistent nav is dead weight for him.
- Casey (mobile): blank-until-JS worst on slow connections; nozzle clipped in 335px scroll container with no scroll hint; zero nav labels on mobile.
- Riley (stress tester): no-JS = fully blank (confirmed); keyboard order otherwise solid (14 stops, skip link works); theme toggle unreachable.
- Recruiter (45s, depth→trajectory→fit): delivers within 45s; 10-second memory lands ("the rocket guy who also writes carefully"). Depth rests on specificity until summer proof arrives; mobile weakens nozzle signal to text-only.

## Minor Observations

- Tooltip.jsx uses legacy classes (text-pg/border-border/bg-fg) that may not map to current tokens.
- REV 07 stamp arbitrary (harmless).
- Headline 56.8px at 1280 — under cap. Nav tap targets 48×48.
- Console clean on all pages; both themes AA on every measured pair (worst 4.95:1).

## Questions to Consider

1. The nozzle is the strongest proof — why mid-scroll and clipped on mobile while the REV stamp owns the top slot?
2. Should the recruiter feel they're reading a document, or meeting Nathan? "Abstract" over "I'm a junior…" is the seam.
3. Until summer proof lands, specificity carries the whole claim — should the résumé corroborate harder, or the page hedge less?
