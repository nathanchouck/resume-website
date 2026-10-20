import PageWrapper from "@/components/PageWrapper";
import PageTitle from "@/components/PageTitle";
import { SANS, SERIF } from "@/utils/constants";
// Shared with the AI layer (llms.txt and /mcp) — edit the Now log there.
import NOW from "@/data/now.json";

const UPDATED = NOW.updated;
const SECTIONS = NOW.sections;

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
