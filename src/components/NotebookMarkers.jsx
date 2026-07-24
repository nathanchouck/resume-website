/*
 * Shared vocabulary for the Notebook: the four plot-marker glyphs (drawn to
 * match NotebookGraph exactly), the type labels, and the title helpers.
 *
 * Note titles arrive from build-time frontmatter carrying inline markdown
 * emphasis (e.g. "Bertin & Cummings — *Aerodynamics for Engineers*"). This is
 * trusted content, so <Emphasis> renders *text* / _text_ as real <em>; plain
 * spots (SVG labels, aria-labels, placeholders) use stripEmphasis().
 */

export const TYPES = ["topic", "course", "source", "organization"];

export const TYPE_LABEL = {
  topic: "Topics",
  course: "Courses",
  source: "Sources",
  organization: "Organizations",
};

export const LEGEND_LABEL = {
  topic: "Topic",
  course: "Course",
  source: "Source",
  organization: "Organization",
};

/* Strip markdown emphasis markers for plain-text contexts. */
export function stripEmphasis(s) {
  return String(s ?? "").replace(/(\*|_)(.+?)\1/g, "$2");
}

/* Render *text* / _text_ as <em>; trusted build-time data, no HTML injection. */
export function Emphasis({ text }) {
  const s = String(text ?? "");
  const re = /(\*|_)(.+?)\1/g;
  const parts = [];
  let last = 0;
  let key = 0;
  let m;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) parts.push(s.slice(last, m.index));
    parts.push(<em key={key++}>{m[2]}</em>);
    last = m.index + m[0].length;
  }
  if (last < s.length) parts.push(s.slice(last));
  return <>{parts.length ? parts : s}</>;
}

/*
 * Inline legend/list glyph — a 12×12 plot marker matching the graph shapes.
 * topic: filled circle · course: open ink circle · source: filled square ·
 * organization: filled diamond.
 */
export function Marker({ type, size = 12, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`}
      fill="none"
    >
      {type === "topic" && <circle cx="6" cy="6" r="3.4" fill="var(--primary-text)" />}
      {type === "course" && (
        <circle cx="6" cy="6" r="3.1" fill="none" stroke="var(--accent-ink)" strokeWidth="1.3" />
      )}
      {type === "source" && <rect x="3" y="3" width="6" height="6" fill="var(--secondary-text)" />}
      {type === "organization" && (
        <path d="M6 1.8 L10.2 6 L6 10.2 L1.8 6 Z" fill="var(--accent)" />
      )}
    </svg>
  );
}
