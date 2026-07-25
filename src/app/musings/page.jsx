import { getSortedPostsData } from "@/utils/lib";
import PageWrapper from "@/components/PageWrapper";
import MusingsIndex from "./containers/MusingsIndex";

export const metadata = {
  title: "Musings",
  description: "Essays, short stories, and poems by Nathan Houck.",
  alternates: { canonical: "https://nathanhouck.com/musings" },
  openGraph: {
    title: "Musings — Nathan Houck",
    description: "Essays, short stories, and poems by Nathan Houck.",
    url: "https://nathanhouck.com/musings",
    type: "website",
    images: [{ url: "/headshot-1024x1024.jpg", width: 1024, height: 1024, alt: "Nathan Houck" }],
  },
};

export default function MusingsLanding() {
  const posts = getSortedPostsData();
  return (
    <PageWrapper>
      <MusingsIndex posts={posts} />
    </PageWrapper>
  );
}
