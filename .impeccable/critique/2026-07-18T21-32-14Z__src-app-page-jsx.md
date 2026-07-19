---
target: home page (fountain pen)
total_score: 34
p0_count: 0
p1_count: 2
timestamp: 2026-07-18T21-32-14Z
slug: src-app-page-jsx
---
# Critique — Home page ("fountain pen" restyle), 2026-07-18, cycle 2

Method: dual-agent (A: design review, Opus · B: detector + browser evidence, Sonnet)

## Design Health Score — 34/40 (Good, up from 31)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Nav mark + theme feedback fine; downloads rely on native UI |
| 2 | Match System / Real World | 4 | Human, domain-correct language throughout |
| 3 | User Control and Freedom | 3 | Skip link, real hrefs, reversible theme |
| 4 | Consistency and Standards | 4 | Type roles + one-accent rule disciplined |
| 5 | Error Prevention | 3 | Minimal error surface; email-in-JS is the gap |
| 6 | Recognition Rather Than Recall | 4 | Nav now labeled (aria + tooltips + mobile micro-labels) |
| 7 | Flexibility and Efficiency | 3 | Keyboard clean; nothing extra needed at this scale |
| 8 | Aesthetic and Minimalist Design | 4 | Strongest axis: one accent, one artifact, generous air |
| 9 | Error Recovery | 3 | n/a on this surface |
| 10 | Help and Documentation | 3 | Self-documenting; tooltips assist |
| **Total** | | **34/40** | **Good (28–35)** |

Last-cycle fixes re-verified independently: theme toggle is a real tabbable button; Projects icon is drafting-compass; mobile micro-labels render at 375px; no-JS content is complete in SSR (only the email link remains JS-injected).

## Anti-Patterns Verdict

Not slop, both scans agree: CLI detector exit 0 with zero findings across 6 files; in-browser detector "No anti-patterns found" (zero overlay nodes created — nothing to show); console clean. Ground-level tells all pass; paper verified cool ink-tinted (blue channel highest), not cream. Second-order, honestly: the page sits in the refined editorial-serif lane and is describable from a prompt — what pulls it out is the physically-literate nozzle drawing, the cool-not-cream inversion, and mono quarantined inside the drawing. The personality is concentrated in one artifact; strip the nozzle and it's a very good generic elegant portfolio. Last cycle's all-caps-body finding is gone (location line now normal case).

## Priority Issues

- **[P1] Mobile nozzle half-hidden, no scroll affordance.** At 375px only ~52% shows; the throat callout sits at the edge, the exit bell + M>1 off-screen with zero hint. The most personality-bearing element is truncated and undiscoverable. Fix: edge fade + scroll cue, or a scaled/re-laid-out narrow variant. Suggested: /impeccable adapt.
- **[P1] Unoptimized hero portrait.** Raw 1052×1315 JPG, no srcset/sizes/priority — heavy LCP on slow connections (static export: use pre-generated variants + srcset, not next/image default loader). Suggested: /impeccable optimize.
- **[P2] Desktop nav icon-only.** Micro-labels are lg:hidden; drafting-compass and clock not self-evident; tooltips hover-only. Fix: persistent or focus-visible labels on desktop. Suggested: /impeccable clarify.
- **[P2] Email requires JS.** Assembled in useEffect, absent from SSR. Fix: static obfuscation (reversed-text + CSS or accept plain mailto). Suggested: /impeccable harden.
- **[P3] A11y polish.** Contents links' accessible name runs on ("1Projects") — add space/aria-label; 9px mobile labels → 10–11px.

## Emotional Journey & Taste

Warm enough, back-loaded: headline is the peak, lede + "— N.H." carry warmth, nozzle is the intellectual peak. Upper third reads austere to a non-reader. Verdict on the taste question: reads as carefully engineered elegance, not under-designed — but personality is concentrated in the nozzle. Carriers: nozzle drawing, headline/writer-voice copy, ink-paper + ink-blue. Thinnest: desktop nav rail (inherited lucide icons, least-engineered surface), italic-label+hairline (template-adjacent), cold upper third.

## Persona Red Flags

- Jordan: content path excellent; desktop nav is five unlabeled icons.
- Casey: thumb-friendly; nozzle truncation + heavy portrait are her two P1s.
- Riley: no-JS passes (email only gap); keyboard passes; 200% zoom passes; "1Projects" name run-on.
- Recruiter (45s): trajectory + fit land fast; depth is now earned-on-inspection of one drawing vs the costume's instant whole-page signal — stronger for hiring engineers who look, weaker for the 10-second scanner.

## Questions to Consider

1. If the nozzle were removed, would anything distinguish this from a well-made elegant-serif template? Is one artifact enough?
2. "The range is the claim," but AI/memory-systems has zero visual artifact while propulsion gets the hero drawing. Would a memory-graph figure earn its place?
3. Elegance traded the instant technical signal for depth-on-inspection — is the primary reader patient enough for the drawing the depth rung is betting on?
