import { Archivo, Literata, Fragment_Mono } from "next/font/google";

/*
 * Type system — three voices:
 *   SANS  (Archivo)       structure: title block, nav, buttons, contents
 *   SERIF (Literata)      the writer: abstract, essays, long-form reading
 *   MONO  (Fragment Mono) the engineer: report header, captions, telemetry
 */
export const SANS = Archivo({
  subsets: ["latin"],
  display: "swap",
});

export const SERIF = Literata({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

export const MONO = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

// Legacy aliases — older pages import these names; they now resolve to the
// report system faces. Migrate imports to SANS/SERIF/MONO per-page.
export const FAMILY = SANS;
export const SOURCE_SERIF = SERIF;
export const JETBRAINS_MONO = MONO;

export const LOCATION_TEXT = "Daytona Beach, FL · West Chester, PA · ERAU Astronautics '27";
export const LEDE_TEXT =
  "I'm a junior in aerospace engineering at Embry-Riddle, astronautics track, class of 2027. This summer I'm designing a cold gas nozzle experiment and finishing an AI internship at EPI-USE America, where I evaluate AI tools and build prototypes for practice leaders. The essays, stories, and poems live in Musings, all written by hand.";

export const NOW_ITEMS = [
  { label: "Researching", value: "Cold gas nozzle experiment: design and build" },
  { label: "Building", value: "AI tools and prototypes, EPI-USE America" },
  { label: "Reading", value: "Schaub, Analytical Mechanics of Space Systems" },
];

export const PROJECTS_INFO = [
  {
    id: 5,
    title: "Cold Gas Nozzle — Design & Test",
    org: "Independent",
    role: "Design & build",
    time: "Summer 2026 — in progress",
    category: "Research",
    inProgress: true,
    summary: "Designing a converging-diverging cold gas nozzle and the test plan to characterize it. The nozzle drawing on the home page is this project.",
    tags: ["Propulsion", "Nozzle theory", "Test design"],
  },
  {
    id: 3,
    title: "XJEP — Afterburner Cooling Design",
    org: "Experimental Jet Engine Propulsion Club",
    role: "Member",
    time: "Aug 2025 – Feb 2026",
    url: "https://daytonabeach.erau.edu",
    category: "Team",
    summary: "Designed a cooling solution for a modular afterburner on a KingTech turbine engine. Part of that work is going into an AIAA SciTech paper on afterburner efficiency.",
    tags: ["Propulsion", "Thermal", "CAD"],
  },
  {
    id: 2,
    title: "AMRA Submarine — Cooling & Propulsion",
    org: "Autonomous Maritime Robotics Association",
    role: "Mechanical Engineer",
    time: "Aug 2024 – Aug 2025",
    url: "https://amraerau.org",
    category: "Team",
    image: "/images/amra-sub-800.jpg",
    imageSrcSet: "/images/amra-sub-800.jpg 800w, /images/amra-sub-1200.jpg 1200w",
    imageAlt: "CAD render of the AMRA autonomous submarine with cooling and propulsion hardware",
    summary: "Led design of a minimal-cost cooling system that dropped internal temps **60°F+**. Also built the thruster mount (reduced lateral movement), torpedo launcher, weighted-bag release bin, and an IP68-rated waterproof servo housing.",
    tags: ["Thermal", "Hardware", "CAD"],
  },
  {
    id: 1,
    title: "Aerodynamics Data Processing",
    org: "Embry-Riddle Aeronautical University",
    role: "Undergraduate Researcher",
    time: "Jan 2026 – Apr 2026",
    url: "https://daytonabeach.erau.edu/about/labs",
    category: "Research",
    image: "/images/ae315-lab-800.jpg",
    imageSrcSet: "/images/ae315-lab-800.jpg 800w, /images/ae315-lab-1200.jpg 1200w",
    imageAlt: "Wind tunnel test section in the ERAU aerodynamics lab",
    summary: "Built MATLAB scripts to clean, filter, and normalize wind tunnel sensor data. Designed and ran a boundary layer tripping experiment on a NACA 0012 airfoil to evaluate its effect on drag and boundary layer transition.",
    tags: ["MATLAB", "Aerodynamics", "Experiment"],
  },
  {
    id: 4,
    title: "Houck Airfoil — US 9976421B2",
    org: "Independent Research",
    role: "Inventor",
    time: "2025 – Present",
    url: "https://patents.google.com/patent/US9976421B2",
    category: "Patent",
    summary: "Researching practical uses for a patented lifting foil design and whether it's ready to commercialize.",
    tags: ["Patent", "Aerodynamics"],
  },
]
export const WORK_EXPERIENCES = [
  {
    id: 1,
    title: "AI Exploration Intern",
    company: "EPI-USE America / AdvanceNA",
    time: "Summer 2026",
    url: "https://epiuse.com",
    summary: "Researching and evaluating AI tools, building lightweight prototypes, and writing recommendation briefs for practice leaders.",
  },
  {
    id: 2,
    title: "Grading Assistant — AE319 Aerodynamics",
    company: "Embry-Riddle Aeronautical University",
    time: "Jan 2026 – Present",
    url: "https://erau.edu",
    summary: "Grade and provide written feedback on homework for AE319 Aerodynamics.",
  },
  {
    id: 3,
    title: "Customer Service Associate",
    company: "Wawa, Inc.",
    time: "Jul 2022 – Apr 2026",
    url: "https://www.wawa.com",
    summary: "Day Brightener Award, April 2023. Served 500+ customers per shift; trained new associates.",
  },
  {
    id: 4,
    title: "Lifeguard",
    company: "Greater Philadelphia YMCA",
    time: "Feb 2023 – Aug 2023",
    url: "https://www.philaymca.org",
    summary: "Red Cross CPR/AED certified. Pool safety and inspections.",
  },
];

export const EDUCATION = [
  {
    id: 1,
    school: "Embry-Riddle Aeronautical University",
    time: "Aug 2023 – May 2027",
    gpa: "3.75 / 4.00",
    url: "https://erau.edu",
    honors: [
      "Dean's List: Fall '23, Spring '24, Spring '25, Fall '25",
      "Honor Roll: Fall '24",
      "Exceptional Eagles Award: Spring '25",
    ],
    activities: [
      "B.S. Aerospace Engineering — Astronautics Track",
      "Experimental Jet Engine Propulsion (XJEP)",
      "Autonomous Maritime Robotics Association (AMRA)",
      "Studying Habitats and Reef Kingdoms — Conservation Officer",
      "American Institute of Aeronautics and Astronautics (AIAA)",
    ],
  },
  {
    id: 2,
    school: "West Chester Bayard Rustin High School",
    time: "Aug 2019 – May 2023",
    gpa: "4.40 / 5.00",
    url: "https://rhs.wcasd.net",
    honors: [],
    activities: [
      "National Honor Society",
      "German National Honor Society",
      "Science Olympiad",
      "Academic Team — JV Captain",
    ],
  },
]

export const RESUME_PDF = "/NathanHouck-Resume-Generic.pdf";
export const CV_PDF = "/NathanHouck_CV.pdf";
