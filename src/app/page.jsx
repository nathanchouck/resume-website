"use client";

import PageWrapper from "@/components/PageWrapper";
import Main from "@/containers/Main";
import JsonLd from "@/components/JsonLd";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Nathan Houck",
  url: "https://nathanhouck.com",
  image: "https://nathanhouck.com/headshot-1024x1024.jpg",
  description:
    "Aerospace engineering senior at Embry-Riddle: CubeSat integration and requirements, structures and aerodynamics testing, and essays written by hand.",
  knowsAbout: [
    "Systems engineering",
    "Requirements engineering",
    "Spacecraft design",
    "Wind tunnel testing",
    "Structural testing",
  ],
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "Embry-Riddle Aeronautical University",
  },
  sameAs: ["https://www.linkedin.com/in/nathan-houck"],
};

export default function Home() {
  return (
    <PageWrapper>
      <JsonLd data={personJsonLd} />
      <div className="px-5 sm:px-8 w-full max-w-[1100px] pt-14 pb-32 lg:pt-20 lg:pb-20">
        <Main />
      </div>
    </PageWrapper>
  );
}
