# nathanhouck.com

Next.js 15 (App Router, JSX) + Tailwind 4. Personal portfolio for Nathan Houck with the Musings writing section at `/musings`. Theme tokens live in `src/app/globals.css` (CSS variables, `.light` / `.dark` classes via next-themes).

## Build & data

- `npm run build` runs `prebuild`: `scripts/build-notebook.mjs` (Notebook data from the second-brain export; `BRAIN_EXPORT_PATH` in CI) then `scripts/build-ai-index.mjs` (AI layer). Static export to `out/`; GitHub Actions rsyncs it to Hostinger on push to `master` and on `brain-updated` dispatches from `second-brain`.
- Never run `npm run build` while the dev server is up — they share `.next` and the dev server starts returning 500s.
- **AI layer:** `public/mcp.php` is a read-only MCP endpoint at `/mcp` (dual-era: 2026-07-28 stateless + legacy `initialize`), reading build-generated `public/mcp-data/*.json`; `llms.txt` / `llms-full.txt` are generated alongside. All generated files are gitignored.
- The Now page's content lives in `src/data/now.json` (shared by the page and the AI layer). Musings are `posts/*.mdx`; production slugs are the lowercase, git-tracked filenames.
- Any résumé PDF published to `public/` must have the phone number removed from the text layer first.

## Design Context

- **`PRODUCT.md` is the authority** on brand strategy, audience, positioning, and content direction (written July 2026 from a live interview with Nathan). Read it before any design or content work.
- `NATHAN_CONTEXT.md` remains useful for biographical facts (education, awards, employment), but its content emphasis (leading with wind-tunnel / experimental-aerodynamics work) is superseded by PRODUCT.md: since October 2026 the story leads with systems engineering (Project SENTINEL CubeSat integration, requirements, CONOPS), backed by test and measurement work, with the writing as a first-class pillar. The résumé PDF in `public/` is the source of truth for facts.
- `Redesign_Report.md` holds detailed page-by-page design critique; treat its recommendations as input, filtered through PRODUCT.md.
- `DESIGN.md` documents the visual system (ink-and-instrument tokens, type voices, components).
