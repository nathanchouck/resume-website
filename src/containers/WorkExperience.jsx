import { SANS, SERIF, WORK_EXPERIENCES } from "@/utils/constants";
import SectionTitle from "@/components/SectionTitle";

export default function WorkExperience() {
  return (
    <section className="flex flex-col w-full pt-12">
      <SectionTitle>Work</SectionTitle>
      <div className="flex flex-col mt-2">
        {WORK_EXPERIENCES.map((exp, i) => (
          <div
            key={exp.id}
            className="anim-rise flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 py-4 border-b border-(--border) last:border-b-0"
            style={{ "--d": `${0.14 + i * 0.06}s` }}
          >
            <div className="flex flex-col gap-0.5 flex-1">
              <p>
                <span className={`${SERIF.className} text-[15.5px] font-medium text-(--primary-text)`}>
                  {exp.title}
                </span>
                <span className="text-(--tertiary-text)"> · </span>
                <a
                  href={exp.url}
                  className={`${SANS.className} text-[13px] text-(--secondary-text) hover:text-(--active) transition-colors`}
                >
                  {exp.company}
                </a>
              </p>
              <p className={`${SERIF.className} text-[14.5px] leading-relaxed text-(--secondary-text)`}>
                {exp.summary}
              </p>
            </div>
            <p className={`${SANS.className} text-[12px] tabular-nums text-(--tertiary-text) sm:text-right sm:pl-8 shrink-0`}>
              {exp.time}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
