import PageWrapper from "@/components/PageWrapper";
import PageTitle from "@/components/PageTitle";
import { SANS, SERIF } from "@/utils/constants";

const UPDATED = "May 2026";

const SECTIONS = [
  {
    label: "Researching",
    heading: "AI tools in engineering workflows",
    paragraphs: [
      "This summer I'm at EPI-USE America as an AI Exploration Intern, where I evaluate AI tools across their practice areas. The work is hands-on: testing tools, building lightweight prototypes, and writing recommendation briefs for practice leaders. It's an unusual internship role: less \"ship the feature\" and more \"figure out what's actually useful here,\" which requires a more skeptical eye than most software work.",
      "I'm particularly interested in how AI fits inside engineering workflows specifically, not productivity software in general. The design-analyze-test loop in aerospace has different constraints than text-based knowledge work, and most existing AI tooling doesn't reflect that yet. I don't have a clean answer, which is the point of the summer.",
    ],
  },
  {
    label: "Grading",
    heading: "AE319 Aerodynamics, Embry-Riddle",
    paragraphs: [
      "I grade and provide written feedback on homework for AE319 Aerodynamics. It's my second semester doing this. Grading something forces a cleaner kind of understanding than studying does. You notice quickly which concepts you actually know versus which ones you just pattern-matched through enough problem sets to pass the exam. It helps reinforce the concepts I learned over a year ago.",
    ],
  },
  {
    label: "Reading",
    heading: "Schaub & Junkins — Analytical Mechanics of Space Systems",
    paragraphs: [
      "I'm working through this for my Spacecraft Attitude Dynamics coursework. It is so interesting; spacecraft rotation is a richer problem than it first appears. I find that the concepts from this book have led to a much broader understanding of physics, even with how specific this book gets. There are a lot of things I previously struggled with that now make a lot more sense.",
    ],
  },
];

export default function NowPage() {
  return (
    <PageWrapper>
      <main className="px-5 sm:px-8 w-full max-w-[800px] pt-14 pb-32 lg:pt-20 lg:pb-20">
        {/* Page title */}
        <PageTitle>Now</PageTitle>

        <p
          className={`${SANS.className} text-[12px] tabular-nums text-(--tertiary-text) mt-4 anim-rise`}
          style={{ "--d": "0.07s" }}
        >
          Updated {UPDATED}
        </p>

        {/* Log */}
        <div className="flex flex-col mt-12 lg:mt-14">
          {SECTIONS.map((section, i) => (
            <div
              key={section.label}
              className="anim-rise py-4 border-b border-(--border)"
              style={{ "--d": `${0.13 + i * 0.06}s` }}
            >
              <p className={`${SANS.className} text-[13px] font-medium text-(--secondary-text)`}>
                {section.label}
              </p>
              <h2 className={`${SERIF.className} font-medium text-[15.5px] text-(--primary-text) mt-1`}>
                {section.heading}
              </h2>
              <div className="flex flex-col gap-3 mt-2.5">
                {section.paragraphs.map((para, pi) => (
                  <p
                    key={pi}
                    className={`${SERIF.className} text-[15px] leading-relaxed text-(--secondary-text) max-w-[62ch]`}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Caption */}
        <p
          className={`${SERIF.className} italic text-[13px] text-(--tertiary-text) mt-8 pt-6 border-t border-(--border) anim-rise`}
          style={{ "--d": `${0.13 + SECTIONS.length * 0.06}s` }}
        >
          Updated monthly. Last updated {UPDATED}.
        </p>
      </main>
    </PageWrapper>
  );
}
