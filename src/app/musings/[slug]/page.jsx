import PageWrapper from "@/components/PageWrapper";
import { getPostData, getAllPostSlugs, getSortedPostsData } from "@/utils/lib";
import { SANS, SERIF } from "@/utils/constants";
import { MDXRemote } from "next-mdx-remote/rsc";
import mdxComponents from "@/components/mdx-components";
import Panel from "./containers/Panel";
import JsonLd from "@/components/JsonLd";

export function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params: paramsPromise }) {
  const params = await paramsPromise;
  const post = await getPostData(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description || "",
    keywords: post.keywords || [],
    alternates: {
      canonical: `https://nathanhouck.com/musings/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description || "",
      url: `https://nathanhouck.com/musings/${post.slug}`,
      type: "article",
      images: [{ url: "/headshot-1024x1024.jpg", width: 800, alt: "Nathan Houck" }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description || "",
    },
  };
}

function readingTime(content) {
  const words = content.trim().split(/\s+/).length;
  return `${Math.ceil(words / 200)} min read`;
}

export default async function PostPage({ params: paramsPromise }) {
  const params = await paramsPromise;
  if (!params || !params.slug) return <p>Error: missing slug</p>;

  const post = await getPostData(params.slug);
  const posts = getSortedPostsData();

  const currentIndex = posts.findIndex((p) => p.slug === post.slug);
  const nextPost = posts[currentIndex + 1] || null;

  const postUrl = `https://nathanhouck.com/musings/${post.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description || "",
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "Nathan Houck",
      url: "https://nathanhouck.com",
    },
    mainEntityOfPage: postUrl,
  };

  return (
    <PageWrapper>
      <JsonLd data={articleJsonLd} />
      <Panel currentPost={post} posts={posts} />

      <main className="min-h-screen w-screen lg:ml-85 flex items-center justify-center pt-16 pb-32 lg:pt-0 lg:pb-0 lg:mb-16">
        <article className="w-full max-w-[62ch]">
          <div className="flex flex-col pt-10 px-5">
            {/* Title */}
            <h1
              className={`${SERIF.className} anim-lift text-(--primary-text) text-[26px] tracking-[-0.01em] font-medium mb-2`}
              style={{ "--d": "0s" }}
            >
              {post.title}
            </h1>

            {/* Date + reading time */}
            <div
              className={`${SANS.className} anim-rise text-[12px] tabular-nums text-(--tertiary-text) flex gap-4 mb-6`}
              style={{ "--d": "0.07s" }}
            >
              <span>{post.date}</span>
              <span>{readingTime(post.content)}</span>
            </div>

            {/* MDX content */}
            <div
              className={`${SERIF.className} anim-lift leading-[1.7] text-[17px] text-(--primary-text)`}
              style={{ "--d": "0.14s" }}
            >
              <MDXRemote source={post.content} components={mdxComponents} />
            </div>

            {/* Author bio */}
            <div className="mt-16 pt-8 border-t border-(--border) flex flex-col gap-2">
              <p className={`${SANS.className} text-[12px] font-medium text-(--tertiary-text) mb-1`}>
                About the author
              </p>
              <p className={`${SERIF.className} text-[15px] leading-[1.65] text-(--secondary-text)`}>
                Nathan Houck is an aerospace engineering student at Embry-Riddle (Daytona Beach) studying astronautics, aerodynamics, and experimental methods.{" "}
                <a href="/" className="text-(--accent) hover:opacity-80 transition-opacity">
                  More about Nathan →
                </a>
              </p>
            </div>

            {/* Next article */}
            {nextPost && (
              <div className="mt-16 pt-8 border-t border-(--border)">
                <p className={`${SANS.className} text-[12px] font-medium text-(--tertiary-text) mb-2`}>
                  Next
                </p>
                <a
                  href={`/musings/${nextPost.slug}`}
                  className={`${SERIF.className} text-[20px] font-medium text-(--primary-text) hover:text-(--accent) transition-colors`}
                >
                  {nextPost.title} →
                </a>
              </div>
            )}
          </div>
        </article>
      </main>
    </PageWrapper>
  );
}
