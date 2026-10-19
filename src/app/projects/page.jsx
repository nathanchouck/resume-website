import PageWrapper from "@/components/PageWrapper";
import ProjectsContainer from "@/containers/Projects";

export const metadata = {
  title: "Projects",
  description: "Projects by Nathan Houck: CubeSat integration on Project SENTINEL, supersonic nozzle and wind tunnel testing, structural testing, and submarine cooling.",
  alternates: { canonical: "https://nathanhouck.com/projects" },
  openGraph: {
    title: "Projects — Nathan Houck",
    description: "CubeSat integration, supersonic nozzle and wind tunnel testing, structural testing, and submarine cooling.",
    url: "https://nathanhouck.com/projects",
    type: "website",
    images: [{ url: "/headshot-1024x1024.jpg", width: 1024, height: 1024, alt: "Nathan Houck" }],
  },
};

export default function Projects() {
  return (
    <PageWrapper>
      <div className="px-5 sm:px-8 w-full max-w-[1100px] pt-14 pb-32 lg:pt-20 lg:pb-20">
        <ProjectsContainer />
      </div>
    </PageWrapper>
  );
}
