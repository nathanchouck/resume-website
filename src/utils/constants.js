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

export const LOCATION_TEXT = "Daytona Beach, FL · West Chester, PA · ERAU Aerospace Engineering '27";
export const LEDE_TEXT =
  "I'm a senior in aerospace engineering at Embry-Riddle, astronautics concentration, graduating May 2027. On Project SENTINEL I'm the integration engineer for a 3U CubeSat that catalogs objects in the GEO belt: I coordinate five subteams, wrote the CONOPS, and derive the requirements. I'm looking for an entry-level systems engineering role. The essays, stories, and poems live in Musings, all written by hand.";

export const NOW_ITEMS = [
  { label: "Integrating", value: "Project SENTINEL, a 3U CubeSat: CONOPS and requirements" },
  { label: "Testing", value: "Strain gages and static load tests, AE 416/417" },
  { label: "Seeking", value: "Entry-level systems engineering roles" },
];

export const PROJECTS_INFO = [
  {
    id: 6,
    title: "Project SENTINEL — 3U CubeSat",
    org: "Senior Spacecraft Design, Embry-Riddle",
    role: "Integration Engineer",
    time: "Aug 2026 – Present",
    category: "Design",
    inProgress: true,
    summary: "Integration engineer on a 3U CubeSat that autonomously catalogs resident space objects (RSOs) in the GEO belt. I coordinate **five subteams**, wrote the CONOPS from the mission needs document, and derive requirements from both ahead of the System Requirements Review.",
    tags: ["Systems engineering", "Requirements", "CONOPS", "CubeSat"],
  },
  {
    id: 7,
    title: "Strain Gages & Static Load Testing",
    org: "Aerospace Structures and Instrumentation Lab (AE 416/417)",
    role: "Structural Testing and Instrumentation",
    time: "Aug 2026 – Present",
    category: "Labs",
    inProgress: true,
    summary: "Installing strain gages on test specimens and checking static load test results against theory.",
    tags: ["Structures", "Instrumentation", "Strain gages"],
  },
  {
    id: 1,
    title: "Supersonic Nozzle & Wind Tunnel Testing",
    org: "Experimental Aerodynamics Laboratory (AE 314/315)",
    role: "Wind Tunnel and Supersonic Tunnel Testing",
    time: "Jan 2026 – Apr 2026",
    url: "https://daytonabeach.erau.edu/about/labs",
    category: "Labs",
    image: "/images/ae315-lab-800.jpg",
    imageSrcSet: "/images/ae315-lab-800.jpg 800w, /images/ae315-lab-1200.jpg 1200w",
    imageAlt: "Wind tunnel test section in the ERAU aerodynamics lab",
    summary: "Ran six wind tunnel and supersonic tunnel experiments start to finish: setup, data collection, MATLAB data reduction, and uncertainty analysis. Located a shock in an overexpanded supersonic nozzle by comparing **16 pressure readings** against Schlieren images, and designed a boundary-layer tripping experiment on a NACA 0012 airfoil.",
    tags: ["Test & measurement", "MATLAB", "Uncertainty analysis"],
  },
  {
    id: 8,
    title: "Phase Change Material Test Section",
    org: "Thermal Science Laboratory, with Instituto Tecnológico de Aeronáutica (Brazil)",
    role: "Undergraduate Researcher",
    time: "Aug 2025 – Dec 2025",
    category: "Labs",
    summary: "Designed a tilting test section in Inventor, with one heated wall and one fixed-temperature wall, to study the behavior of phase change materials (PCMs).",
    tags: ["Thermal", "Test design", "Inventor"],
  },
  {
    id: 2,
    title: "RoboSub — Submarine Cooling & Hardware",
    org: "Autonomous Maritime Robotics Association",
    role: "Heat Transfer Team Lead, Mechanical Engineering Team",
    time: "Aug 2024 – Aug 2025",
    url: "https://amraerau.org",
    category: "Design",
    image: "/images/amra-sub-800.jpg",
    imageSrcSet: "/images/amra-sub-800.jpg 800w, /images/amra-sub-1200.jpg 1200w",
    imageAlt: "CAD render of the AMRA autonomous submarine with cooling and propulsion hardware",
    summary: "Led a study of cooling options (heat pipes, thermoelectric coolers, PCMs) that cut the ~190°F hull peak by **over 60°F**. Designed and built an improved thruster mount with three teammates, and a torpedo launcher and dropper.",
    tags: ["Thermal", "Trade study", "Hardware"],
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
    company: "EPI-USE America",
    time: "May 2026 – Sep 2026",
    url: "https://epiuse.com",
    summary: "Compared build-versus-buy options for software on cost, upkeep, and integration, and wrote recommendation briefs practice leaders used to make decisions. Designed a Python tool that scrapes public procurement portals through one interface and ranks the results in a single spreadsheet, finding 5× more opportunities, each more relevant to the company's expertise. Built an AWS workflow that splits a proposal request into individual requirements and scores how well the company meets each one, rejecting the bid if a required item is missed.",
  },
  {
    id: 2,
    title: "Grading Assistant — AE 319 Aerodynamics",
    company: "Embry-Riddle Aeronautical University",
    time: "Jan 2026 – Aug 2026",
    url: "https://erau.edu",
    summary: "Graded and gave written feedback on homework for AE 319 Aerodynamics.",
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
    gpa: "3.72 / 4.00",
    url: "https://erau.edu",
    honors: [
      "Dean's List: 5 semesters",
      "Honor Roll: Fall '24",
      "Exceptional Eagles Award, ERAU Student Involvement Awards: 2025",
    ],
    activities: [
      "B.S. Aerospace Engineering — Astronautics Concentration",
      "Coursework: Spacecraft Systems, Spacecraft Attitude Dynamics, Space Propulsion, Aerospace Structures, Experimental Aerodynamics Lab, Computing for Engineers",
      "Studying Habitats and Reef Kingdoms — Conservation Officer (reef and mangrove programs)",
      "Autonomous Maritime Robotics Association (RoboSub) — Heat Transfer Team Lead",
      "Experimental Jet Engine Propulsion Club (XJEP) — Member",
      "American Institute of Aeronautics and Astronautics (AIAA)",
      "Flight student — 28.1 hours",
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
