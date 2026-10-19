import PageWrapper from "@/components/PageWrapper";
import WorkExperience from "@/containers/WorkExperience";
import Education from "@/containers/Education";
import PageTitle from "@/components/PageTitle";
import PrimaryButton from "@/components/PrimaryButton";
import QuietLink from "@/components/QuietLink";
import { CV_PDF, RESUME_PDF, SANS } from "@/utils/constants";

export const metadata = {
  title: "Résumé",
  description: "Résumé for Nathan Houck: AI Exploration Intern at EPI-USE America, aerodynamics grading assistant at Embry-Riddle, B.S. Aerospace Engineering '27.",
  alternates: { canonical: "https://nathanhouck.com/resume" },
  openGraph: {
    title: "Résumé — Nathan Houck",
    description: "Work experience and education for Nathan Houck.",
    url: "https://nathanhouck.com/resume",
    type: "website",
    images: [{ url: "/headshot-1024x1024.jpg", width: 1024, height: 1024, alt: "Nathan Houck" }],
  },
};

export default function Resume() {
  return (
    <PageWrapper>
      <main className="px-5 sm:px-8 w-full max-w-[800px] pt-14 pb-32 lg:pt-20 lg:pb-20">
        {/* Page title */}
        <PageTitle>Résumé</PageTitle>

        {/* CTA row */}
        <div
          className="anim-rise flex flex-wrap items-center gap-x-6 gap-y-4 mt-8"
          style={{ "--d": "0.07s" }}
        >
          <PrimaryButton href={RESUME_PDF} download="NathanHouck-Resume.pdf">
            Download PDF
          </PrimaryButton>
          <span className={`${SANS.className} text-[13px] text-(--secondary-text)`}>
            <QuietLink href={CV_PDF} download="NathanHouck-CV.pdf">
              CV (PDF)
            </QuietLink>
          </span>
        </div>

        <WorkExperience />
        <Education />
      </main>
    </PageWrapper>
  );
}
