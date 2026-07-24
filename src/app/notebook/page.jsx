import "katex/dist/katex.min.css";
import PageWrapper from "@/components/PageWrapper";
import NotebookView from "./containers/NotebookView";
import graph from "@/data/notebook-graph.json";

export const metadata = {
  title: "Notebook",
  description:
    "An interactive knowledge graph of everything Nathan Houck has studied — courses, topics, and sources, exported from his working notes and plotted as a technical chart.",
  alternates: { canonical: "https://nathanhouck.com/notebook" },
  openGraph: {
    title: "Notebook — Nathan Houck",
    description:
      "An interactive knowledge graph of everything Nathan Houck has studied — courses, topics, and sources, exported from his working notes.",
    url: "https://nathanhouck.com/notebook",
  },
};

export default function NotebookPage() {
  return (
    <PageWrapper>
      <NotebookView graph={graph} />
    </PageWrapper>
  );
}
