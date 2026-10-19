export const metadata = {
  title: "Now",
  description: "What Nathan Houck is working on now: CubeSat integration, structural testing, and the search for a systems engineering role.",
  alternates: { canonical: "https://nathanhouck.com/now" },
  openGraph: {
    title: "Now — Nathan Houck",
    description: "CubeSat integration, structural testing, and the search for a systems engineering role.",
    url: "https://nathanhouck.com/now",
    type: "website",
    images: [{ url: "/headshot-1024x1024.jpg", width: 1024, height: 1024, alt: "Nathan Houck" }],
  },
};

export default function NowLayout({ children }) {
  return children;
}
