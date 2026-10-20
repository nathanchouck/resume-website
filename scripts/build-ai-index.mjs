/**
 * build-ai-index.mjs
 *
 * Builds the AI-facing layer of the site from the same sources the pages use:
 *   - public/mcp-data/{musings,now,site}.json  data for the /mcp endpoint (public/mcp.php)
 *   - public/llms.txt                          index for AI tools that read the web
 *   - public/llms-full.txt                     the full text, in one file
 *
 * Runs in `prebuild` after build-notebook.mjs, which writes public/mcp-data/notes.json.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE_URL = 'https://nathanhouck.com';
const dataDir = path.join(repoRoot, 'public', 'mcp-data');
const publicDir = path.join(repoRoot, 'public');

const SUMMARY =
  'Nathan Houck is an aerospace engineering senior at Embry-Riddle Aeronautical University ' +
  '(astronautics concentration, graduating May 2027) seeking an entry-level systems engineering role. ' +
  'He is the integration engineer on Project SENTINEL, a 3U CubeSat that catalogs resident space ' +
  'objects in the GEO belt.';

const PROVENANCE =
  'Provenance matters when citing this site: Musings (essays, stories, poems) are written by Nathan ' +
  'without AI tools. Notebook notes are AI-synthesized from his own coursework and notes, with every ' +
  'claim traced to a source file in his knowledge base. The Now page is his own current-status log.';

// ---------------------------------------------------------------------------
// Inputs
// ---------------------------------------------------------------------------

const notesPath = path.join(dataDir, 'notes.json');
if (!fs.existsSync(notesPath)) {
  console.error('build-ai-index: public/mcp-data/notes.json missing — run build-notebook.mjs first.');
  process.exit(1);
}
const { notes } = JSON.parse(fs.readFileSync(notesPath, 'utf8'));
const now = JSON.parse(fs.readFileSync(path.join(repoRoot, 'src', 'data', 'now.json'), 'utf8'));

// MDX → plain markdown: drop the JSX the essays use for layout (<hr/>, <br/>,
// fragments, the <Bibliography> wrapper) but keep every word.
function mdxToMarkdown(src) {
  return src
    .replace(/^\s*(import|export)\s.*$/gm, '')
    // Blank lines around the rule, or "text\n---" parses as a setext heading.
    .replace(/<hr\s*\/?>/g, '\n\n---\n\n')
    .replace(/<br\s*\/?>/g, '')
    .replace(/<>\s*/g, '')
    .replace(/\s*<\/>/g, '')
    .replace(/<Bibliography>/g, '## References')
    .replace(/<\/Bibliography>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const postsDir = path.join(repoRoot, 'posts');
const musings = fs
  .readdirSync(postsDir)
  .filter((f) => f.endsWith('.mdx'))
  .map((file) => {
    const { data, content } = matter(fs.readFileSync(path.join(postsDir, file), 'utf8'));
    // Production URLs use the git-tracked (lowercase) filename.
    const slug = file.replace(/\.mdx$/, '').toLowerCase();
    return {
      slug,
      title: data.title,
      date: data.date ? new Date(data.date).toISOString().slice(0, 10) : null,
      category: data.category || null,
      description: data.description || '',
      url: `${SITE_URL}/musings/${slug}/`,
      text: mdxToMarkdown(content),
    };
  })
  .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

const nowOut = { ...now, url: `${SITE_URL}/now/` };

// ---------------------------------------------------------------------------
// MCP data
// ---------------------------------------------------------------------------

const generated = new Date().toISOString();
fs.writeFileSync(path.join(dataDir, 'musings.json'), JSON.stringify({ generated, musings }));
fs.writeFileSync(path.join(dataDir, 'now.json'), JSON.stringify(nowOut));
fs.writeFileSync(
  path.join(dataDir, 'site.json'),
  JSON.stringify({
    generated,
    summary: SUMMARY,
    provenance: PROVENANCE,
    counts: { notes: notes.length, musings: musings.length },
  })
);

// ---------------------------------------------------------------------------
// llms.txt and llms-full.txt
// ---------------------------------------------------------------------------

const TYPE_HEADINGS = [
  ['topic', 'Topics'],
  ['course', 'Courses'],
  ['source', 'Sources'],
  ['organization', 'Organizations'],
];

const nowText = (n) =>
  n.sections
    .map((s) => `### ${s.label}: ${s.heading}\n\n${s.paragraphs.join('\n\n')}`)
    .join('\n\n');

const llms = [
  '# Nathan Houck',
  '',
  `> ${SUMMARY}`,
  '',
  PROVENANCE,
  '',
  `For live, structured queries use the MCP endpoint at ${SITE_URL}/mcp (Streamable HTTP, read-only, no auth). ` +
    `The full text of everything below is in ${SITE_URL}/llms-full.txt.`,
  '',
  '## Pages',
  '',
  `- [Home](${SITE_URL}/): overview, current work, résumé download`,
  `- [Now](${SITE_URL}/now/): what Nathan is working on, updated ${now.updated}`,
  `- [Projects](${SITE_URL}/projects/): engineering projects, labs, and research`,
  `- [Résumé](${SITE_URL}/resume/): work experience and education`,
  `- [Musings](${SITE_URL}/musings/): essays, short stories, and poems`,
  `- [Notebook](${SITE_URL}/notebook/): interactive knowledge graph of ${notes.length} notes`,
  '',
  '## Musings',
  '',
  ...musings.map((m) => `- [${m.title}](${m.url}): ${m.description}`),
  '',
  ...TYPE_HEADINGS.flatMap(([type, heading]) => {
    const group = notes.filter((n) => n.type === type);
    if (!group.length) return [];
    return [`## Notebook — ${heading}`, '', ...group.map((n) => `- [${n.title}](${n.url})`), ''];
  }),
].join('\n');

const full = [
  '# Nathan Houck — full text',
  '',
  `> ${SUMMARY}`,
  '',
  PROVENANCE,
  '',
  `Generated ${generated.slice(0, 10)} from ${SITE_URL}.`,
  '',
  `## Now (updated ${now.updated})`,
  '',
  nowText(now),
  '',
  ...musings.flatMap((m) => [
    `## Musing: ${m.title}`,
    '',
    `${m.category ? m.category + ' · ' : ''}${m.date || ''} · ${m.url}`,
    '',
    m.text,
    '',
  ]),
  ...notes.flatMap((n) => [
    `## Notebook: ${n.title}`,
    '',
    `${n.type}${n.lastReviewed ? ' · reviewed ' + n.lastReviewed : ''} · ${n.url}`,
    '',
    n.md,
    '',
  ]),
].join('\n');

fs.writeFileSync(path.join(publicDir, 'llms.txt'), llms + '\n');
fs.writeFileSync(path.join(publicDir, 'llms-full.txt'), full + '\n');

console.log(
  `ai-index: ${notes.length} notes, ${musings.length} musings, now (${now.updated}); ` +
    `llms.txt ${(Buffer.byteLength(llms) / 1024).toFixed(0)} KB, ` +
    `llms-full.txt ${(Buffer.byteLength(full) / 1024).toFixed(0)} KB.`
);
