"use client";

/*
 * NotebookView — client orchestration for the Notebook page: title + lede,
 * the plot-marker legend that doubles as type filters, a quiet search box, the
 * graph, the grouped index list, and the note panel. Owns the shared state
 * (disabled types, query, selected note) and the #<id> hash routing so the
 * panel participates in back/forward navigation.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import PageTitle from "@/components/PageTitle";
import SectionTitle from "@/components/SectionTitle";
import NotebookGraph from "@/components/NotebookGraph";
import NotebookPanel from "@/components/NotebookPanel";
import {
  Emphasis,
  LEGEND_LABEL,
  Marker,
  stripEmphasis,
  TYPES,
  TYPE_LABEL,
} from "@/components/NotebookMarkers";
import { MONO, SANS, SERIF } from "@/utils/constants";

function ymdOf(g) {
  try {
    return new Date(g).toISOString().slice(0, 10);
  } catch {
    return String(g ?? "").slice(0, 10);
  }
}

export default function NotebookView({ graph }) {
  const { nodes, edges, counts, generated } = graph;

  const [disabledTypes, setDisabledTypes] = useState(() => new Set());
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const triggerRef = useRef(null);

  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  // Active = passes the type filter AND the search query. Used for both the
  // graph dimming and the list membership, so they never disagree.
  const activeIds = useMemo(() => {
    const q = query.trim().toLowerCase();
    const set = new Set();
    nodes.forEach((n) => {
      if (disabledTypes.has(n.type)) return;
      if (q && !stripEmphasis(n.title).toLowerCase().includes(q)) return;
      set.add(n.id);
    });
    return set;
  }, [nodes, disabledTypes, query]);

  const grouped = useMemo(() => {
    const g = Object.fromEntries(TYPES.map((t) => [t, []]));
    nodes.forEach((n) => {
      if (activeIds.has(n.id) && g[n.type]) g[n.type].push(n);
    });
    TYPES.forEach((t) => g[t].sort((a, b) => (b.degree || 0) - (a.degree || 0)));
    return g;
  }, [nodes, activeIds]);

  const toggleType = (type) =>
    setDisabledTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });

  // --- Panel open/close + hash routing ---------------------------------
  const openNote = (id, { push = true } = {}) => {
    setSelectedId(id);
    if (push && typeof window !== "undefined") {
      window.history.pushState(null, "", `#${encodeURIComponent(id)}`);
    }
  };

  const closeNote = () => {
    setSelectedId(null);
    if (typeof window !== "undefined" && window.location.hash) {
      window.history.pushState(null, "", window.location.pathname + window.location.search);
    }
    triggerRef.current?.focus?.();
  };

  useEffect(() => {
    const applyHash = () => {
      const h = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (h && nodeById.has(h)) setSelectedId(h);
      else setSelectedId(null);
    };
    applyHash();
    window.addEventListener("popstate", applyHash);
    return () => window.removeEventListener("popstate", applyHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGraphSelect = (id, el) => {
    triggerRef.current = el;
    openNote(id);
  };

  const nothingMatches = activeIds.size === 0;

  return (
    <main className="w-full max-w-[1120px] px-5 sm:px-8 pt-14 pb-32 lg:pt-20 lg:pb-24">
      {/* 1 — Title + lede */}
      <PageTitle>Notebook</PageTitle>

      <p
        className={`${SERIF.className} anim-rise mt-6 max-w-[68ch] text-[17px] leading-[1.7] text-(--primary-text)`}
        style={{ "--d": "0.05s" }}
      >
        This is what I know — or at least, what I&rsquo;ve written down. Every course I&rsquo;ve
        taken, every topic I&rsquo;ve chased, and every source worth keeping, exported from the
        notes I actually work in. The lines are cross-references; the dense regions are where
        I&rsquo;ve spent the most time. The summaries are AI-synthesized from my real notes and
        coursework — the deliberate counterpart to the Musings, where no AI touches a word.
      </p>

      <p
        className={`${MONO.className} anim-rise mt-4 text-[11px] tracking-[0.15em] uppercase text-(--tertiary-text)`}
        style={{ "--d": "0.1s" }}
      >
        {counts.notes} Entries · {counts.edges} Cross-references · Exported {ymdOf(generated)}
      </p>

      {/* 2 — Legend / filter row */}
      <div className="anim-rise mt-8 flex flex-wrap items-center gap-x-5 gap-y-3" style={{ "--d": "0.15s" }}>
        {TYPES.map((type) => {
          const off = disabledTypes.has(type);
          return (
            <button
              key={type}
              type="button"
              onClick={() => toggleType(type)}
              aria-pressed={!off}
              className={`${MONO.className} group flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase transition-opacity`}
              style={{ opacity: off ? 0.4 : 1 }}
            >
              <Marker type={type} />
              <span className="text-(--secondary-text) group-hover:text-(--primary-text) transition-colors">
                {LEGEND_LABEL[type]}
              </span>
              <span className="text-(--tertiary-text)">{counts[type]}</span>
            </button>
          );
        })}

        <span className="flex-1" />

        <label className="flex items-center">
          <span className="sr-only">Filter notebook entries</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="FILTER…"
            className={`${MONO.className} w-40 bg-transparent border-b border-(--border) py-1 text-[11px] tracking-[0.15em] uppercase text-(--primary-text) placeholder:text-(--tertiary-text) outline-none focus:border-(--accent) transition-colors`}
          />
        </label>
      </div>

      {/* 3 — The graph */}
      <div className="anim-fig mt-8" style={{ "--d": "0.2s" }}>
        <NotebookGraph
          nodes={nodes}
          edges={edges}
          activeIds={activeIds}
          selectedId={selectedId}
          onSelect={handleGraphSelect}
        />
      </div>

      {/* 4 — The index list */}
      <section className="mt-16 lg:mt-20">
        <SectionTitle>Index</SectionTitle>

        {nothingMatches ? (
          <p className={`${MONO.className} mt-8 text-[13px] tracking-[0.1em] text-(--secondary-text)`}>
            Nothing matches.
          </p>
        ) : (
          <div className="mt-8 columns-[18rem] gap-x-10">
            {TYPES.map((type) => {
              const items = grouped[type];
              if (!items.length) return null;
              return (
                <div key={type} className="break-inside-avoid mb-8">
                  <div className="flex items-baseline gap-3 mb-1.5">
                    <h3 className={`${SANS.className} text-[13px] font-semibold text-(--primary-text)`}>
                      {TYPE_LABEL[type]}
                    </h3>
                    <span className={`${MONO.className} text-[11px] tracking-[0.12em] text-(--tertiary-text)`}>
                      {items.length}
                    </span>
                  </div>
                  <ul>
                    {items.map((n) => (
                      <li key={n.id}>
                        <button
                          type="button"
                          aria-current={selectedId === n.id ? "true" : undefined}
                          onClick={(e) => {
                            triggerRef.current = e.currentTarget;
                            openNote(n.id);
                          }}
                          className="group flex items-center gap-2.5 w-full text-left min-h-11 py-1.5 border-b border-(--border) hover:bg-(--button-highlight) transition-colors"
                        >
                          <Marker type={n.type} />
                          <span className={`${SERIF.className} flex-1 min-w-0 truncate text-[15px] text-(--primary-text) group-hover:text-(--active) transition-colors`}>
                            <Emphasis text={n.title} />
                          </span>
                          <span className={`${MONO.className} shrink-0 text-[10px] tracking-[0.1em] text-(--tertiary-text)`}>
                            {n.degree} {n.degree === 1 ? "REF" : "REFS"}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5 — The note panel */}
      {selectedId && (
        <NotebookPanel id={selectedId} onClose={closeNote} onNavigate={(id) => openNote(id)} />
      )}
    </main>
  );
}
