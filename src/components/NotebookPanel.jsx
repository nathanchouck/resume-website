"use client";

/*
 * NotebookPanel — a container for the secondary thing (the note), not a modal
 * takeover. Desktop (lg+): a fixed right-hand complementary panel with its own
 * scroll; the page stays interactive. Mobile: an 85dvh bottom sheet dialog with
 * a scrim and body-scroll lock. Content is fetched per note and pre-rendered
 * HTML is styled by .notebook-prose (see globals.css) to echo the Musings body.
 */

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { MONO, SERIF } from "@/utils/constants";
import { Emphasis, Marker } from "@/components/NotebookMarkers";

function LinkList({ title, items, onNavigate }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="mt-8">
      <div className="flex items-center gap-3 mb-2">
        <h3 className={`${MONO.className} text-[11px] tracking-[0.15em] uppercase text-(--tertiary-text)`}>
          {title}
        </h3>
        <span aria-hidden="true" className="flex-1 h-px bg-(--border)" />
      </div>
      <ul className="flex flex-col">
        {items.map((l) => (
          <li key={l.id}>
            <button
              type="button"
              onClick={() => onNavigate(l.id)}
              className="group flex items-center gap-2.5 w-full text-left min-h-11 py-2"
            >
              <Marker type={l.type} />
              <span className={`${SERIF.className} text-[14px] text-(--primary-text) group-hover:text-(--active) transition-colors`}>
                <Emphasis text={l.title} />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function NotebookPanel({ id, onClose, onNavigate }) {
  const [state, setState] = useState("loading"); // loading | loaded | error
  const [note, setNote] = useState(null);
  const [retryKey, setRetryKey] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  const panelRef = useRef(null);
  const headingRef = useRef(null);

  // Track viewport class for role/scrim/scroll-lock (can't vary role via CSS).
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setIsDesktop(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Fetch the note whenever the id (or a retry) changes.
  useEffect(() => {
    let aborted = false;
    setState("loading");
    setNote(null);
    fetch(`/notebook/notes/${id}.json`)
      .then((r) => {
        if (!r.ok) throw new Error("not ok");
        return r.json();
      })
      .then((data) => {
        if (aborted) return;
        setNote(data);
        setState("loaded");
      })
      .catch(() => {
        if (!aborted) setState("error");
      });
    return () => {
      aborted = true;
    };
  }, [id, retryKey]);

  // Move focus into the panel on open / content load.
  useEffect(() => {
    if (state === "loaded") headingRef.current?.focus();
    else panelRef.current?.focus();
  }, [state, id]);

  // ESC closes.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Body scroll lock — mobile sheet only.
  useEffect(() => {
    if (isDesktop) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isDesktop]);

  // Light focus trap for the mobile dialog.
  useEffect(() => {
    if (isDesktop) return undefined;
    const el = panelRef.current;
    if (!el) return undefined;
    const onKey = (e) => {
      if (e.key !== "Tab") return;
      const f = el.querySelectorAll('button, a[href], input, [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [isDesktop, state]);

  // In-body wiki-links (data-note-link) navigate within the same panel.
  const onBodyClick = (e) => {
    const a = e.target.closest("[data-note-link]");
    if (a) {
      e.preventDefault();
      onNavigate(a.getAttribute("data-note-link"));
    }
  };

  const meta = note
    ? [
        String(note.type || "").toUpperCase(),
        `${(note.tags || []).length} ${(note.tags || []).length === 1 ? "TAG" : "TAGS"}`,
        note.lastReviewed ? `REVIEWED ${note.lastReviewed}` : "UNREVIEWED",
      ].join(" · ")
    : "";

  return (
    <>
      {!isDesktop && (
        <div
          aria-hidden="true"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40"
        />
      )}

      <div
        ref={panelRef}
        tabIndex={-1}
        role={isDesktop ? "complementary" : "dialog"}
        aria-modal={isDesktop ? undefined : true}
        aria-label="Note"
        className="fixed z-50 bg-(--fg) overflow-y-auto outline-none
          left-0 right-0 bottom-0 h-[85dvh] border-t
          lg:left-auto lg:right-0 lg:top-0 lg:bottom-0 lg:h-screen lg:w-[min(440px,40vw)] lg:border-t-0 lg:border-l
          border-(--border)"
      >
        {/* Close control */}
        <div className="sticky top-0 z-10 flex justify-end p-3 bg-(--fg)">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close note"
            className="flex items-center justify-center w-9 h-9 text-(--tertiary-text) hover:text-(--primary-text) hover:bg-(--button-highlight) transition-colors"
          >
            <X size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        <div className="px-6 pb-20 -mt-1">
          {state === "loading" && (
            <div className="flex flex-col gap-3 pt-3">
              <div className="notebook-skeleton h-2.5 w-1/2" />
              <div className="notebook-skeleton h-6 w-4/5 mt-3" />
              <div className="notebook-skeleton h-3 w-full mt-5" />
              <div className="notebook-skeleton h-3 w-full" />
              <div className="notebook-skeleton h-3 w-2/3" />
            </div>
          )}

          {state === "error" && (
            <div className="flex flex-col items-start gap-4 pt-4">
              <p className={`${SERIF.className} text-[15px] text-(--secondary-text)`}>
                Couldn&rsquo;t load this note.
              </p>
              <button
                type="button"
                onClick={() => setRetryKey((k) => k + 1)}
                className={`${MONO.className} text-[11px] tracking-[0.15em] uppercase text-(--accent) border border-(--border) px-3 py-1.5 hover:bg-(--button-highlight) transition-colors`}
              >
                Retry
              </button>
            </div>
          )}

          {state === "loaded" && note && (
            <>
              <p className={`${MONO.className} text-[11px] tracking-[0.15em] uppercase text-(--tertiary-text)`}>
                {meta}
              </p>

              <h2
                ref={headingRef}
                tabIndex={-1}
                className={`${SERIF.className} mt-2 text-[1.5rem] leading-[1.25] font-medium text-(--primary-text) outline-none`}
              >
                <Emphasis text={note.title} />
              </h2>

              {note.cover && (
                <img
                  src={note.cover}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={note.coverWidth || undefined}
                  height={note.coverHeight || undefined}
                  className="w-full h-auto mt-5 border border-(--border) bg-(--button-highlight)"
                  style={
                    note.coverWidth && note.coverHeight
                      ? { aspectRatio: `${note.coverWidth} / ${note.coverHeight}` }
                      : undefined
                  }
                />
              )}

              <div
                onClick={onBodyClick}
                className={`${SERIF.className} notebook-prose mt-5`}
                dangerouslySetInnerHTML={{ __html: note.html || "" }}
              />

              <LinkList title="Links" items={note.links} onNavigate={onNavigate} />
              <LinkList title="Referenced by" items={note.backlinks} onNavigate={onNavigate} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
