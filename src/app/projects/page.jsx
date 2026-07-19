import PageWrapper from "@/components/PageWrapper";
import ProjectsContainer from "@/containers/Projects";

export const metadata = {
  title: "Projects",
  description: "Propulsion and engineering projects by Nathan Houck: cold gas nozzle design, afterburner cooling, submarine hardware, and aerodynamics research.",
  alternates: { canonical: "https://nathanhouck.com/projects" },
  openGraph: {
    title: "Projects — Nathan Houck",
    description: "Cold gas nozzle design, afterburner cooling, submarine hardware, and aerodynamics research.",
    url: "https://nathanhouck.com/projects",
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
