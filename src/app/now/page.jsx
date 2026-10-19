import PageWrapper from "@/components/PageWrapper";
import PageTitle from "@/components/PageTitle";
import { SANS, SERIF } from "@/utils/constants";

const UPDATED = "October 2026";

const SECTIONS = [
  {
    label: "Integrating",
    heading: "Project SENTINEL — Senior Spacecraft Design",
    paragraphs: [
      "I'm the integration engineer on Project SENTINEL, a 3U CubeSat designed to autonomously catalog resident space objects in the GEO belt. I coordinate five subteams, wrote the CONOPS from the mission needs document, and I'm deriving requirements from both ahead of our System Requirements Review.",
    ],
  },
  {
    label: "Testing",
    heading: "Aerospace Structures and Instrumentation Lab — AE 416/417",
    paragraphs: [
      "I'm installing strain gages on test specimens and checking our static load test results against theory.",
    ],
  },
  {
    label: "Looking for",
    heading: "An entry-level systems engineering role",
    paragraphs: [
      "I graduate in May 2027 with a B.S. in Aerospace Engineering, astronautics concentration, and I'm looking for an entry-level systems engineering position.",
    ],
  },
  {
    label: "Recently finished",
    heading: "AI Exploration Intern — EPI-USE America",
    paragraphs: [
      "From May to September I was an AI Exploration Intern at EPI-USE America. I compared build-versus-buy options for software and wrote recommendation briefs that practice leaders used to make decisions, built a Python tool that scrapes public procurement portals and found 5× more relevant opportunities, and built an AWS workflow that scores a proposal request requirement by requirement.",
      "I was particularly interested in how AI fits inside engineering workflows specifically, not productivity software in general. The design-analyze-test loop in aerospace has different constraints than text-based knowledge work, and most existing AI tooling doesn't reflect that yet.",
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
