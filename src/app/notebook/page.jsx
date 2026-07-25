import "katex/dist/katex.min.css";
import PageWrapper from "@/components/PageWrapper";
import NotebookView from "./containers/NotebookView";
import graph from "@/data/notebook-graph.json";

export const metadata = {
  title: "Notebook",
  description:
    "An interactive knowledge graph of everything Nathan Houck has studied — courses, topics, and sources from his working notes.",
  alternates: { canonical: "https://nathanhouck.com/notebook" },
  openGraph: {
    title: "Notebook — Nathan Houck",
    description:
      "An interactive knowledge graph of everything Nathan Houck has studied — courses, topics, and sources from his working notes.",
    url: "https://nathanhouck.com/notebook",
    type: "website",
    images: [{ url: "/headshot-1024x1024.jpg", width: 1024, height: 1024, alt: "Nathan Houck" }],
  },
};

export default function NotebookPage() {
  return (
    <PageWrapper>
      <NotebookView graph={graph} />
    </PageWrapper>
  );
}
