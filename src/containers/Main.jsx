"use client";

import { useAppContext } from "@/app/provider";
import NozzleFigure from "@/components/NozzleFigure";
import MemoryDemo from "@/components/MemoryDemo";
import {
  CV_PDF,
  LEDE_TEXT,
  LOCATION_TEXT,
  NOW_ITEMS,
  RESUME_PDF,
  SANS,
  SERIF,
} from "@/utils/constants";
import { spaClick } from "@/utils/nav";

const CONTENTS = [
  { n: "1", label: "Projects", href: "/projects" },
  { n: "2", label: "Résumé", href: "/resume" },
  { n: "3", label: "Musings", href: "/musings" },
  { n: "4", label: "Now", href: "/now" },
];

import SectionTitle from "@/components/SectionTitle";
import PrimaryButton from "@/components/PrimaryButton";
import QuietLink from "@/components/QuietLink";

// Assembled at render so the address never appears verbatim in source;
// the prerendered HTML carries it, which is the price of a no-JS mailto.
const EMAIL = ["nathan", "@", "nathanhouck", ".", "com"].join("");

export default function Main() {
  const { handleDirectPageChange } = useAppContext();

  return (
    <main className="w-full flex flex-col">
      {/* ── Header: name + one hairline ─────────────────────────── */}
      <header className="anim-rise" style={{ "--d": "0s" }}>
        <p
          className={`${SANS.className} text-[13px] font-medium tracking-[0.02em] text-(--primary-text) pb-3`}
        >
          Nathan Houck
        </p>
        <div className="anim-rule h-px bg-(--rule)" style={{ "--d": "0.1s" }} />
      </header>

      {/* ── Title block + portrait, over faint nozzle line-work ── */}
      <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 lg:gap-16 pt-12 lg:pt-16 items-start">
        <div
          aria-hidden="true"
          className="hidden md:block pointer-events-none absolute -right-20 top-8 w-[880px] opacity-[0.09] -z-10"
        >
          <NozzleFigure variant="background" className="w-full" />
        </div>
        <div className="flex flex-col min-w-0">
          <h1
            className={`${SERIF.className} font-medium text-[clamp(2.15rem,4.8vw,3.4rem)] leading-[1.12] tracking-[-0.005em] text-(--primary-text) anim-rise`}
            style={{ "--d": "0.07s", fontOpticalSizing: "auto" }}
          >
            Rocket nozzles, memory systems, and carefully made sentences.
          </h1>

          <p
            className={`${SANS.className} text-[13px] text-(--tertiary-text) mt-6 anim-rise`}
            style={{ "--d": "0.14s" }}
          >
            {LOCATION_TEXT}
          </p>

          <div
            className="flex flex-wrap items-center gap-x-6 gap-y-4 mt-9 anim-rise"
            style={{ "--d": "0.21s" }}
          >
            <PrimaryButton href={RESUME_PDF} download="NathanHouck-Resume.pdf">
              Download résumé
            </PrimaryButton>
            <span className={`${SANS.className} text-[13px] text-(--secondary-text)`}>
              <QuietLink href={CV_PDF} download="NathanHouck-CV.pdf">
                CV (PDF)
              </QuietLink>
              <span aria-hidden="true" className="mx-3 text-(--tertiary-text)">
                ·
              </span>
              <QuietLink href={`mailto:${EMAIL}`}>
                {EMAIL}
              </QuietLink>
            </span>
          </div>

          <p
            className={`${SERIF.className} text-[17px] leading-[1.72] text-(--secondary-text) max-w-[62ch] mt-14 [text-wrap:pretty] anim-rise`}
            style={{ "--d": "0.28s" }}
          >
            {LEDE_TEXT}
          </p>
        </div>

        <figure className="w-full max-w-[300px] lg:max-w-none lg:mt-2 anim-fig" style={{ "--d": "0.35s" }}>
          <img
            src="/headshot-600.jpg"
            srcSet="/headshot-400.jpg 400w, /headshot-600.jpg 600w, /headshot-1052x1315.jpg 1052w"
            sizes="300px"
            width={1052}
            height={1315}
            fetchPriority="high"
            alt="Nathan Houck, photographed in Daytona Beach, Florida"
            className="w-full h-auto border border-(--border)"
          />
          <figcaption
            className={`${SERIF.className} italic text-[13px] text-(--tertiary-text) mt-2.5`}
          >
            Daytona Beach, 2026.
          </figcaption>
        </figure>
      </div>

      {/* ── Ask the memory ──────────────────────────────────────── */}
      <section aria-label="Ask the memory" className="anim-rise mt-16 lg:mt-24" style={{ "--d": "0.45s" }}>
        <SectionTitle>Ask the memory</SectionTitle>
        <MemoryDemo />
        <p className={`${SERIF.className} italic text-[13px] text-(--tertiary-text) mt-6`}>
          An agent&rsquo;s memory graph, asked about its author.
        </p>
      </section>

      {/* ── Status + Contents ───────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14 mt-16 lg:mt-24 items-start">
        <section aria-label="Currently" className="anim-rise" style={{ "--d": "0.5s" }}>
          <SectionTitle>Currently</SectionTitle>
          <dl className="mt-2">
            {NOW_ITEMS.map((item) => (
              <div
                key={item.label}
                className="grid grid-cols-[118px_1fr] gap-4 items-baseline py-3.5 border-b border-(--border)"
              >
                <dt className={`${SANS.className} text-[13px] font-medium text-(--secondary-text)`}>
                  {item.label}
                </dt>
                <dd className={`${SANS.className} text-[14px] leading-snug text-(--primary-text)`}>
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
          <a
            href="/now"
            onClick={(e) => spaClick(e, () => handleDirectPageChange("/now"))}
            className={`${SANS.className} inline-block text-[13px] text-(--tertiary-text) hover:text-(--active) transition-colors mt-0.5 py-3.5 -mb-3.5`}
          >
            Full log →
          </a>
        </section>

        <nav aria-label="Site contents" className="anim-rise" style={{ "--d": "0.57s" }}>
          <SectionTitle>Contents</SectionTitle>
          <ol className="mt-2">
            {CONTENTS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-label={item.label}
                  onClick={(e) => spaClick(e, () => handleDirectPageChange(item.href))}
                  className="group flex items-baseline gap-5 py-3.5 -mx-3 px-3 border-b border-(--border) hover:bg-(--button-highlight) transition-colors"
                >
                  <span
                    aria-hidden="true"
                    className={`${SANS.className} text-[12px] tabular-nums text-(--active) w-4 shrink-0`}
                  >
                    {item.n}
                  </span>
                  <span
                    className={`${SANS.className} text-[15px] font-medium text-(--primary-text) flex-1`}
                  >
                    {item.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`${SANS.className} text-[13px] text-(--tertiary-text) group-hover:text-(--active) group-hover:translate-x-0.5 transition-[color,transform]`}
                  >
                    →
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* ── End mark: the pen lifts off the page ────────────────── */}
      <div className="flex justify-center mt-21 anim-rise" style={{ "--d": "0.64s" }} role="presentation">
        <svg viewBox="0 0 140 10" aria-hidden="true" fill="none" className="w-[140px] h-[10px] overflow-visible">
          <line x1="0" y1="5" x2="96" y2="5" stroke="var(--border)" strokeWidth="1" />
          <circle className="anim-breathe" cx="104" cy="5" r="2.75" fill="var(--accent-ink)" />
        </svg>
      </div>
    </main>
  );
}
