export const metadata = {
  title: "Now",
  description: "What Nathan Houck is currently researching, building, and reading — updated monthly.",
  alternates: { canonical: "https://nathanhouck.com/now" },
  openGraph: {
    title: "Now — Nathan Houck",
    description: "What Nathan Houck is currently researching, building, and reading.",
    url: "https://nathanhouck.com/now",
    type: "website",
    images: [{ url: "/headshot-1024x1024.jpg", width: 1024, height: 1024, alt: "Nathan Houck" }],
  },
};

export default function NowLayout({ children }) {
  return children;
}
