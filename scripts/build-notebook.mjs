#!/usr/bin/env node
// Builds the Notebook section's data files from a second-brain knowledge-graph export.
//
// Reads:
//   <export>/graph.json
//   <export>/03_Entities/{Courses,Organizations,Sources,Topics}/*.md
//   <export>/04_Assets/covers/*
//
// Writes:
//   src/data/notebook-graph.json          (lean graph for the force-directed UI)
//   public/notebook/notes/<id>.json       (one per published note)
//   public/notebook/covers/<file>         (copied cover images, if any are used)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { marked } from 'marked';
import katex from 'katex';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCollide,
  forceCenter,
  forceX,
  forceY,
} from 'd3-force';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

// Math rendering. Rather than a marked inline extension, math is extracted to
// placeholders *before* markdown runs, rendered to static KaTeX HTML, and
// reinserted afterward — the way Obsidian itself processes `$…$`. This is the
// only robust ordering: any in-lexer math extension can be pre-empted by an
// emphasis span that opened earlier in the paragraph, e.g. an italic figure
// caption `_… the constant $q_{s0}$ correction …_` where marked pairs the
// leading `_` with the `_` *inside* `$q_{s0}$`, shredding the formula into
// `$q<em>{s0}$`. Extraction removes math from the text entirely, so emphasis,
// links, and lists can never touch it, while code and currency stay literal.

// Currency dollars (`$6.64 million`, `$1 trillion`, `$600 per pound`) must not
// be read as math. They always take the shape `$<number> <unit-word>`; math
// values that open with a digit (`$2\times2$`, `$10\text{V}$`) are followed
// immediately by a LaTeX token, never a space + unit-word — so this guard never
// touches real math. Escaping to the entity keeps it rendering as a literal `$`.
const CURRENCY_RE =
  /\$(?=\d[\d,]*(?:\.\d+)?\s+(?:million|billion|trillion|thousand|per)\b)/gi;

// Trim incidental whitespace around a TeX span without eating a trailing KaTeX
// escaped space (`\ `) — a plain `.trim()` turns `\ddot\theta = 0\ ` into
// `…= 0\`, a dangling backslash that KaTeX rejects as a parse error.
function trimTex(tex) {
  return tex.replace(/^\s+/, '').replace(/(?<!\\)\s+$/, '');
}

function renderMarkdownWithMath(rawBody) {
  // 1. Stash code (fenced + inline) so its literal `$` (e.g. the spreadsheet
  //    reference `$B$1`) is never mistaken for a math delimiter. Restored before
  //    marked so it still renders as code.
  const codeStore = [];
  let body = rawBody.replace(/(^|\n)(```|~~~)[\s\S]*?\n\2[ \t]*(?=\n|$)/g, (m) => {
    codeStore.push(m);
    return `CODESTASHx${codeStore.length - 1}x`;
  });
  body = body.replace(/`[^`\n]*`/g, (m) => {
    codeStore.push(m);
    return `CODESTASHx${codeStore.length - 1}x`;
  });

  // 2. Neutralize currency dollars.
  body = body.replace(CURRENCY_RE, '&#36;');

  // 3. Extract math to placeholders. Display `$$…$$` (often multi-line) first,
  //    then inline `$…$` (collapsing soft newlines, respecting escaped `\$`).
  const mathStore = [];
  body = body.replace(/\$\$([\s\S]+?)\$\$/g, (_m, tex) => {
    mathStore.push({ tex: trimTex(tex), display: true });
    return `\n\nMATHSTASHx${mathStore.length - 1}x\n\n`;
  });
  body = body.replace(/(?<![\\$])\$(?!\$)((?:\\.|[^$])+?)\$(?!\$)/g, (m, tex) => {
    if (/\n[ \t]*\n/.test(tex)) return m; // spans a blank line → not one span
    mathStore.push({ tex: trimTex(tex.replace(/\s*\n\s*/g, ' ')), display: false });
    return `MATHSTASHx${mathStore.length - 1}x`;
  });

  // 4. Restore code, run markdown (no `$` remains to interfere).
  body = body.replace(/CODESTASHx(\d+)x/g, (_m, i) => codeStore[Number(i)]);
  let html = marked.parse(body);

  // 5. Swap placeholders for rendered KaTeX. Unwrap the paragraph marked put
  //    around a standalone display block so it isn't nested in a <p>. KaTeX runs
  //    with throwOnError:false so a malformed formula (e.g. a stray `}` typo in
  //    the source TeX) renders as a red error node rather than aborting the
  //    build; collect those so the caller can surface them in the summary
  //    instead of shipping the typo silently.
  const errors = [];
  const render = (i) => {
    const { tex, display } = mathStore[Number(i)];
    const out = katex.renderToString(tex, { throwOnError: false, displayMode: display });
    if (out.includes('katex-error')) errors.push(tex);
    return out;
  };
  html = html.replace(/<p>\s*MATHSTASHx(\d+)x\s*<\/p>/g, (_m, i) => render(i));
  html = html.replace(/MATHSTASHx(\d+)x/g, (_m, i) => render(i));
  return { html, errors };
}

// Minimal intrinsic-dimension reader for the cover formats in use (PNG, JPEG),
// so the note JSON can carry width/height and the panel reserves the exact box
// (no layout shift when the lazy image loads). Returns null if unreadable.
function imageSize(buf) {
  // PNG: 8-byte signature, then IHDR with width/height as big-endian uint32.
  if (buf.length >= 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  // JPEG: walk the marker segments to the Start-Of-Frame, read its dimensions.
  if (buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let off = 2;
    while (off + 9 < buf.length) {
      if (buf[off] !== 0xff) { off++; continue; }
      const marker = buf[off + 1];
      // SOF0-3, SOF5-7, SOF9-11, SOF13-15 carry the frame size.
      if (
        (marker >= 0xc0 && marker <= 0xc3) ||
        (marker >= 0xc5 && marker <= 0xc7) ||
        (marker >= 0xc9 && marker <= 0xcb) ||
        (marker >= 0xcd && marker <= 0xcf)
      ) {
        return { height: buf.readUInt16BE(off + 5), width: buf.readUInt16BE(off + 7) };
      }
      off += 2 + buf.readUInt16BE(off + 2); // skip this segment
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// 1. Resolve the export directory
// ---------------------------------------------------------------------------

const LOCAL_FALLBACK = "C:/Users/Nathan/Documents/Nathan's Second Brain/outputs/site-export";

function resolveExportRoot() {
  const candidates = [process.env.BRAIN_EXPORT_PATH, LOCAL_FALLBACK].filter(Boolean);
  for (const candidate of candidates) {
    const graphPath = path.join(candidate, 'graph.json');
    if (fs.existsSync(graphPath)) return candidate;
  }
  console.error(
    'build-notebook: could not find a second-brain export (looked for graph.json in ' +
      candidates.join(' and ') +
      '). Set BRAIN_EXPORT_PATH to the export directory and try again.'
  );
  process.exit(1);
}

const exportRoot = resolveExportRoot();
const entitiesRoot = path.join(exportRoot, '03_Entities');
const entityDirs = ['Courses', 'Organizations', 'Sources', 'Topics'];

// ---------------------------------------------------------------------------
// 2. Load graph + per-note frontmatter/content
// ---------------------------------------------------------------------------

const graph = JSON.parse(fs.readFileSync(path.join(exportRoot, 'graph.json'), 'utf8'));

/** id -> { id, title, type, data, content, published } */
const records = new Map();

for (const dir of entityDirs) {
  const full = path.join(entitiesRoot, dir);
  if (!fs.existsSync(full)) continue;
  for (const file of fs.readdirSync(full)) {
    if (!file.endsWith('.md')) continue;
    const id = file.replace(/\.md$/, '');
    const graphNode = graph.nodes.find((n) => n.id === id);
    if (!graphNode) continue; // not part of the graph export; skip
    const raw = fs.readFileSync(path.join(full, file), 'utf8');
    const { data, content } = matter(raw);
    const published = data.publish === true || data.status === 'published';
    records.set(id, {
      id,
      title: graphNode.title,
      type: graphNode.type,
      data,
      content,
      published,
    });
  }
}

const publishedMap = new Map(
  [...records.values()].filter((r) => r.published).map((r) => [r.id, { id: r.id, title: r.title, type: r.type }])
);

const totalNotes = records.size;
const skippedUnpublished = totalNotes - publishedMap.size;

// ---------------------------------------------------------------------------
// 3. Edges: keep only edges between two published nodes
// ---------------------------------------------------------------------------

const directedEdges = graph.edges.filter(
  (e) => publishedMap.has(e.source) && publishedMap.has(e.target)
);

// Dedupe as undirected for the graph-render edge list + degree count.
const dedupedEdgeMap = new Map();
for (const e of directedEdges) {
  const key = [e.source, e.target].sort().join('|');
  if (!dedupedEdgeMap.has(key)) dedupedEdgeMap.set(key, { source: e.source, target: e.target });
}
const dedupedEdges = [...dedupedEdgeMap.values()];

const degree = new Map();
for (const e of dedupedEdges) {
  degree.set(e.source, (degree.get(e.source) || 0) + 1);
  degree.set(e.target, (degree.get(e.target) || 0) + 1);
}

// ---------------------------------------------------------------------------
// 4. Headless force simulation to lay out node positions
// ---------------------------------------------------------------------------

// Small deterministic PRNG (mulberry32) so layout is stable across runs.
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);

// Weak quadrant anchors per type so types loosely band together.
const TYPE_ANCHORS = {
  topic: { x: -200, y: -200 },
  course: { x: 200, y: -200 },
  source: { x: -200, y: 200 },
  organization: { x: 200, y: 200 },
};

const simNodes = [...publishedMap.values()].map((n) => {
  const anchor = TYPE_ANCHORS[n.type] || { x: 0, y: 0 };
  return {
    id: n.id,
    type: n.type,
    x: anchor.x + (rand() - 0.5) * 100,
    y: anchor.y + (rand() - 0.5) * 100,
  };
});

// forceLink mutates its link objects' source/target into node references,
// so give it disposable copies rather than our output edge list.
const simLinks = dedupedEdges.map((e) => ({ source: e.source, target: e.target }));

const simulation = forceSimulation(simNodes)
  .force(
    'link',
    forceLink(simLinks)
      .id((d) => d.id)
      .distance(40)
  )
  .force('charge', forceManyBody().strength(-30))
  .force(
    'collide',
    forceCollide().radius((d) => 4 + Math.sqrt(degree.get(d.id) || 0) * 2)
  )
  .force('center', forceCenter(0, 0))
  .force(
    'x',
    forceX((d) => (TYPE_ANCHORS[d.type] || { x: 0 }).x).strength(0.05)
  )
  .force(
    'y',
    forceY((d) => (TYPE_ANCHORS[d.type] || { y: 0 }).y).strength(0.05)
  )
  .stop();

for (let i = 0; i < 300; i++) simulation.tick();

// Rescale to fit a 0-1000 x 0-620 viewBox with 40px padding.
const VIEW_W = 1000;
const VIEW_H = 620;
const PAD = 40;
const xs = simNodes.map((n) => n.x);
const ys = simNodes.map((n) => n.y);
const minX = Math.min(...xs);
const maxX = Math.max(...xs);
const minY = Math.min(...ys);
const maxY = Math.max(...ys);
const spanX = maxX - minX || 1;
const spanY = maxY - minY || 1;
const scaleX = (VIEW_W - 2 * PAD) / spanX;
const scaleY = (VIEW_H - 2 * PAD) / spanY;

function round1(v) {
  return Math.round(v * 10) / 10;
}

const positionById = new Map();
for (const n of simNodes) {
  positionById.set(n.id, {
    x: round1(PAD + (n.x - minX) * scaleX),
    y: round1(PAD + (n.y - minY) * scaleY),
  });
}

// ---------------------------------------------------------------------------
// 5. Assemble src/data/notebook-graph.json
// ---------------------------------------------------------------------------

const graphNodesOut = [...publishedMap.values()]
  .map((n) => {
    const pos = positionById.get(n.id);
    return {
      id: n.id,
      title: n.title,
      type: n.type,
      degree: degree.get(n.id) || 0,
      x: pos.x,
      y: pos.y,
    };
  })
  .sort((a, b) => a.id.localeCompare(b.id));

const counts = { topic: 0, course: 0, source: 0, organization: 0 };
for (const n of publishedMap.values()) {
  if (counts[n.type] !== undefined) counts[n.type]++;
}
counts.notes = publishedMap.size;
counts.edges = dedupedEdges.length;

const notebookGraph = {
  generated: new Date().toISOString(),
  counts,
  nodes: graphNodesOut,
  edges: dedupedEdges.map((e) => ({ source: e.source, target: e.target })),
};

const dataDir = path.join(repoRoot, 'src', 'data');
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(
  path.join(dataDir, 'notebook-graph.json'),
  JSON.stringify(notebookGraph, null, 2)
);

// ---------------------------------------------------------------------------
// 6. Per-note JSON: render markdown, resolve wiki-links, copy covers
// ---------------------------------------------------------------------------

const notesDir = path.join(repoRoot, 'public', 'notebook', 'notes');
const coversDir = path.join(repoRoot, 'public', 'notebook', 'covers');
fs.mkdirSync(notesDir, { recursive: true });

let notesWritten = 0;
let unresolvedLinkCount = 0;
let coversCopied = 0;
const mathErrors = []; // { id, tex } for each formula KaTeX flagged as invalid

const WIKILINK_RE = /\[\[([^\]|]+)(\|([^\]]+))?\]\]/g;
const EMBED_LINE_RE = /^!\[\[.*\]\]\s*$/gm;

for (const record of records.values()) {
  if (!record.published) continue;

  let body = record.content;

  // Strip image/asset embeds (![[...]]) — they point at vault-local assets
  // (covers, lab photos under 01_Sources) that aren't part of the web export.
  body = body.replace(EMBED_LINE_RE, '');

  // Drop a leading H1 that duplicates the title (the UI renders its own heading).
  const lines = body.split('\n');
  const firstIdx = lines.findIndex((l) => l.trim().length > 0);
  if (firstIdx !== -1 && lines[firstIdx].trim() === `# ${record.title}`) {
    lines.splice(firstIdx, 1);
  }
  body = lines.join('\n');

  // Resolve wiki-links.
  body = body.replace(WIKILINK_RE, (_match, rawTarget, _pipe, rawLabel) => {
    const target = rawTarget.trim();
    const label = rawLabel ? rawLabel.trim() : null;
    const targetNode = publishedMap.get(target);
    if (targetNode) {
      const text = label || targetNode.title;
      return `<a href="#${target}" data-note-link="${target}">${text}</a>`;
    }
    unresolvedLinkCount++;
    return label || target;
  });

  const { html, errors: noteMathErrors } = renderMarkdownWithMath(body);
  for (const tex of noteMathErrors) mathErrors.push({ id: record.id, tex });

  const links = directedEdges
    .filter((e) => e.source === record.id)
    .map((e) => publishedMap.get(e.target))
    .sort((a, b) => a.title.localeCompare(b.title));

  const backlinks = directedEdges
    .filter((e) => e.target === record.id)
    .map((e) => publishedMap.get(e.source))
    .sort((a, b) => a.title.localeCompare(b.title));

  let cover = null;
  let coverWidth = null;
  let coverHeight = null;
  if (record.data.cover) {
    const coverSrc = path.join(exportRoot, record.data.cover);
    if (fs.existsSync(coverSrc)) {
      const fileName = path.basename(record.data.cover);
      fs.mkdirSync(coversDir, { recursive: true });
      const buf = fs.readFileSync(coverSrc);
      fs.writeFileSync(path.join(coversDir, fileName), buf);
      cover = `/notebook/covers/${fileName}`;
      const dims = imageSize(buf);
      if (dims && dims.width && dims.height) {
        coverWidth = dims.width;
        coverHeight = dims.height;
      }
      coversCopied++;
    }
  }

  const lastReviewed = record.data.last_reviewed
    ? new Date(record.data.last_reviewed).toISOString().slice(0, 10)
    : null;

  const noteOut = {
    id: record.id,
    title: record.title,
    type: record.type,
    tags: Array.isArray(record.data.tags) ? record.data.tags : [],
    lastReviewed,
    cover,
    coverWidth,
    coverHeight,
    html,
    links,
    backlinks,
  };

  fs.writeFileSync(path.join(notesDir, `${record.id}.json`), JSON.stringify(noteOut, null, 2));
  notesWritten++;
}

// ---------------------------------------------------------------------------
// 7. Summary
// ---------------------------------------------------------------------------

console.log(
  `notebook: ${notesWritten} notes written, ${dedupedEdges.length} edges kept, ` +
    `${skippedUnpublished} notes skipped (unpublished), ${coversCopied} covers copied, ` +
    `${unresolvedLinkCount} unresolved wiki-link warning(s), ${mathErrors.length} math error(s).`
);

// Surface invalid TeX (a red katex-error node shipped) so content typos are
// caught here rather than discovered on the live page.
for (const { id, tex } of mathErrors) {
  const snippet = tex.replace(/\s+/g, ' ').slice(0, 50);
  console.warn(`  math error in ${id}: "${snippet}${tex.length > 50 ? '…' : ''}"`);
}
