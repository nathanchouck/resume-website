import "katex/dist/katex.min.css";
import fs from "fs";
import path from "path";
import PageWrapper from "@/components/PageWrapper";
import { MONO, SERIF } from "@/utils/constants";
import { Emphasis, Marker, stripEmphasis } from "@/components/NotebookMarkers";
import graph from "@/data/notebook-graph.json";

/*
 * Static, crawlable permalink for a single Notebook note.
 *
 * A server component: at build time (output:'export') it reads the note's
 * pre-rendered JSON straight off disk — the same fs+process.cwd() pattern the
 * Musings lib uses for posts — so every note ships as its own HTML page with
 * real <a> links out to its neighbours, letting crawlers walk the whole graph.
 * The interactive graph/panel at /notebook is unchanged; this is its indexable
 * twin.
 */

const NOTES_DIR = path.join(process.cwd(), "public", "notebook", "notes");

export function generateStaticParams() {
  return graph.nodes.map((n) => ({ id: n.id }));
}

function readNote(id) {
  try {
    const raw = fs.readFileSync(path.join(NOTES_DIR, `${id}.json`), "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Plain text from the pre-rendered note HTML, for the meta description. KaTeX
// emits a MathML twin plus a raw-TeX <annotation> alongside the visual render;
// both are dropped first so math contributes its rendered glyphs once (or, more
// commonly, not at all — the ledes are prose and the 150-char cut lands before
// any formula).
function htmlToText(html) {
  return String(html || "")
    .replace(/<math[^>]*>[\s\S]*?<\/math>/g, " ")
    .replace(/<annotation[^>]*>[\s\S]*?<\/annotation>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#36;/g, "$")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function makeDescription(html, max = 150) {
  const text = htmlToText(html);
  if (text.length <= max) return text;
  let cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > 60) cut = cut.slice(0, lastSpace);
  return cut.replace(/[\s,.;:—-]+$/, "") + "…";
}

// On the interactive page, in-body wiki-links are hash anchors (href="#<id>")
// the panel intercepts to swap content. On these static pages those hashes
// scroll nowhere, so rewrite each data-note-link anchor to the neighbour's real
// permalink. Only anchors carrying data-note-link are touched; the build always
// emits them as href-then-data-note-link, so this single pass is exact.
function staticizeLinks(html) {
  return String(html || "").replace(
    /href="#([^"]*)"(\s+data-note-link="[^"]*")/g,
    'href="/notebook/n/$1/"$2'
  );
}

export async function generateMetadata({ params: paramsPromise }) {
  const { id } = await paramsPromise;
  const note = readNote(id);
  if (!note) return {};

  const title = stripEmphasis(note.title);
  const description = makeDescription(note.html);
  const url = `https://nathanhouck.com/notebook/n/${id}/`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
    },
  };
}

function LinkList({ title, items }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="mt-8">
      <div className="flex items-center gap-3 mb-2">
        <h2 className={`${MONO.className} text-[11px] tracking-[0.15em] uppercase text-(--tertiary-text)`}>
          {title}
        </h2>
        <span aria-hidden="true" className="flex-1 h-px bg-(--border)" />
      </div>
      <ul className="flex flex-col">
        {items.map((l) => (
          <li key={l.id}>
            <a
              href={`/notebook/n/${l.id}/`}
              className="group flex items-center gap-2.5 min-h-11 py-2"
            >
              <Marker type={l.type} />
              <span className={`${SERIF.className} text-[14px] text-(--primary-text) group-hover:text-(--active) transition-colors`}>
                <Emphasis text={l.title} />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function NotebookNotePage({ params: paramsPromise }) {
  const { id } = await paramsPromise;
  const note = readNote(id);

  if (!note) {
    return (
      <PageWrapper>
        <main className="w-full max-w-[68ch] px-5 sm:px-8 pt-24 pb-32">
          <p className={`${SERIF.className} text-[17px] text-(--secondary-text)`}>
            This note could not be found.{" "}
            <a href="/notebook" className="text-(--accent) hover:opacity-80 transition-opacity">
              Back to the Notebook →
            </a>
          </p>
        </main>
      </PageWrapper>
    );
  }

  const tagCount = (note.tags || []).length;
  const meta = [
    String(note.type || "").toUpperCase(),
    `${tagCount} ${tagCount === 1 ? "TAG" : "TAGS"}`,
    note.lastReviewed ? `REVIEWED ${note.lastReviewed}` : "UNREVIEWED",
  ].join(" · ");

  const bodyHtml = staticizeLinks(note.html);

  return (
    <PageWrapper>
      <main className="w-full max-w-[68ch] px-5 sm:px-8 pt-14 pb-32 lg:pt-20">
        {/* Quiet return to the interactive graph, anchored on this note. */}
        <a
          href={`/notebook#${id}`}
          className={`${MONO.className} anim-rise inline-block text-[11px] tracking-[0.15em] uppercase text-(--tertiary-text) hover:text-(--primary-text) transition-colors`}
          style={{ "--d": "0s" }}
        >
          ← View in the graph
        </a>

        {/* Metadata line */}
        <p
          className={`${MONO.className} anim-rise mt-6 text-[11px] tracking-[0.15em] uppercase text-(--tertiary-text)`}
          style={{ "--d": "0.05s" }}
        >
          {meta}
        </p>

        {/* Title */}
        <h1
          className={`${SERIF.className} anim-rise mt-2 text-[clamp(1.7rem,3vw,2rem)] leading-[1.2] font-medium text-(--primary-text)`}
          style={{ "--d": "0.1s" }}
        >
          <Emphasis text={note.title} />
        </h1>

        {/* Cover */}
        {note.cover && (
          <img
            src={note.cover}
            alt=""
            loading="lazy"
            decoding="async"
            width={note.coverWidth || undefined}
            height={note.coverHeight || undefined}
            className="w-full h-auto mt-6 border border-(--border) bg-(--button-highlight)"
            style={
              note.coverWidth && note.coverHeight
                ? { aspectRatio: `${note.coverWidth} / ${note.coverHeight}` }
                : undefined
            }
          />
        )}

        {/* Body */}
        <div
          className={`${SERIF.className} notebook-prose anim-rise mt-6`}
          style={{ "--d": "0.15s" }}
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        {/* Graph neighbours as real, crawlable links */}
        <LinkList title="Links" items={note.links} />
        <LinkList title="Referenced by" items={note.backlinks} />

        {/* Colophon — same words/voice as the interactive panel */}
        <div className="mt-10 pt-6 border-t border-(--border)">
          <p className={`${MONO.className} text-[11px] tracking-[0.15em] uppercase text-(--tertiary-text)`}>
            AI-SYNTHESIZED FROM ORIGINAL NOTES &amp; COURSEWORK
          </p>
        </div>
      </main>
    </PageWrapper>
  );
}
