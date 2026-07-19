import { SANS, SERIF, EDUCATION } from "@/utils/constants";
import SectionTitle from "@/components/SectionTitle";

export default function Education() {
  return (
    <section className="flex flex-col w-full pt-14">
      <SectionTitle>Education</SectionTitle>
      <div className="flex flex-col gap-8 pt-6">
        {EDUCATION.map((edu, i) => (
          <div
            key={edu.id}
            className="anim-rise flex flex-col gap-2"
            style={{ "--d": `${0.4 + i * 0.08}s` }}
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
              <a
                href={edu.url}
                className={`${SERIF.className} text-[17px] font-medium text-(--primary-text) hover:text-(--active) transition-colors`}
              >
                {edu.school}
              </a>
              <p className={`${SANS.className} text-[12px] tabular-nums text-(--tertiary-text) sm:text-right`}>
                GPA {edu.gpa} · {edu.time}
              </p>
            </div>

            {edu.honors.length > 0 && (
              <p className={`${SANS.className} text-[12.5px] font-medium text-(--secondary-text)`}>
                {edu.honors.join(" · ")}
              </p>
            )}

            <ul className="list-disc list-inside flex flex-col gap-1 pt-1">
              {edu.activities.map((activity, i) => (
                <li key={i} className={`${SANS.className} text-[13.5px] text-(--secondary-text)`}>
                  {activity}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
