"use client";

import { useState } from "react";
import { PROJECTS_INFO, SANS, SERIF } from "@/utils/constants";
import PageTitle from "@/components/PageTitle";

const CATEGORIES = ["All", "Research", "Team", "Patent"];

function renderBold(text) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i} className="font-semibold text-(--primary-text)">{part.slice(2, -2)}</strong>
      : part
  );
}

function ProjectEntry({ project, index, featured }) {
  return (
    <article
      className={`anim-rise py-10 first:pt-0 border-b border-(--border) ${
        project.image ? "flex flex-col gap-5 md:grid md:grid-cols-[1fr_300px] md:gap-x-12 md:items-start" : ""
      }`}
      style={{ "--d": `${0.08 + index * 0.06}s` }}
    >
      {project.image && (
        <img
          src={project.image}
          srcSet={project.imageSrcSet}
          sizes="(min-width: 768px) 300px, 92vw"
          alt={project.imageAlt || project.title}
          loading="lazy"
          width={800}
          height={project.image.includes("amra-sub") ? 400 : project.image.includes("ae315-lab") ? 600 : undefined}
          className="w-full aspect-video md:aspect-4/3 object-cover border border-(--border) md:order-2"
        />
      )}

      <div className="flex flex-col gap-2 md:order-1 max-w-[70ch]">
        <p className="flex items-baseline gap-2">
          <span className={`${SANS.className} text-[12px] font-medium text-(--active)`}>
            {project.category}
          </span>
          <span className={`${SANS.className} text-[12px] text-(--tertiary-text)`}>
            {project.inProgress && (
              <span
                aria-hidden="true"
                className="anim-breathe inline-block w-1.5 h-1.5 rounded-full bg-(--accent-ink) mr-2 align-middle"
              />
            )}
            {project.time}
          </span>
        </p>

        <h2
          className={`${SERIF.className} ${featured ? "text-[24px]" : "text-[21px]"} leading-snug font-medium tracking-[-0.005em] text-(--primary-text)`}
        >
          {project.url ? (
            <a href={project.url} className="inline-block py-2 -my-2 hover:text-(--active) transition-colors">
              {project.title}
            </a>
          ) : (
            project.title
          )}
        </h2>

        <p className={`${SANS.className} text-[13px] text-(--tertiary-text)`}>
          {project.org} · {project.role}
        </p>

        <p className={`${SERIF.className} text-[15px] leading-[1.65] text-(--secondary-text) [text-wrap:pretty]`}>
          {renderBold(project.summary)}
        </p>

        <p className={`${SANS.className} text-[12px] text-(--tertiary-text) pt-1`}>
          {project.tags.join(" · ")}
        </p>
      </div>
    </article>
  );
}

export default function Projects() {
  const [active, setActive] = useState("All");

  const filtered = active === "All"
    ? PROJECTS_INFO
    : PROJECTS_INFO.filter((p) => p.category === active);

  return (
    <main className="flex flex-col w-full">
      {/* Page title */}
      <PageTitle>Projects</PageTitle>

      {/* Filter row */}
      <div
        className={`${SANS.className} anim-rise flex flex-wrap gap-x-6 gap-y-2 text-[13px] mt-8 pb-4 border-b border-(--border)`}
        style={{ "--d": "0.07s" }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            aria-pressed={active === cat}
            className={`cursor-pointer transition-colors px-1 py-3.5 -my-3.5 ${
              active === cat
                ? "text-(--active) underline underline-offset-6 decoration-1"
                : "text-(--tertiary-text) hover:text-(--primary-text)"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Entries — single ruled column; images sit as right-hand plates */}
      <div key={active} className="flex flex-col pt-10">
        {filtered.map((project, i) => (
          <ProjectEntry
            key={project.id}
            project={project}
            index={i}
            featured={project.inProgress}
          />
        ))}
      </div>
    </main>
  );
}
