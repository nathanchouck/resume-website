import fs from "fs/promises";
import path from "path";

const BASE_URL = "https://nathanhouck.com";
const POSTS_DIR = path.join(process.cwd(), "posts");

export const dynamic = "force-static"; // ensures static generation

export default async function sitemap() {
  try {
    const files = await fs.readdir(POSTS_DIR);
    const postUrls = await Promise.all(
      files
        .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
        .map(async (file) => {
          const slug = file.replace(/\.(mdx|md)$/, "");
          const stats = await fs.stat(path.join(POSTS_DIR, file));

          return {
            url: `${BASE_URL}/musings/${slug}`, // blog posts
            lastModified: stats.mtime.toISOString(),
            priority: 0.5,
          };
        })
    );

    const today = new Date().toISOString();
    const staticPages = [
      { url: BASE_URL,                       lastModified: today, priority: 1.0 },
      { url: `${BASE_URL}/projects`,         lastModified: today, priority: 0.8 },
      { url: `${BASE_URL}/resume`,           lastModified: today, priority: 0.8 },
      { url: `${BASE_URL}/musings`,          lastModified: today, priority: 0.7 },
      { url: `${BASE_URL}/notebook`,         lastModified: today, priority: 0.7 },
      { url: `${BASE_URL}/now`,              lastModified: today, priority: 0.6 },
    ];

    return [...postUrls, ...staticPages];
  } catch (err) {
    console.error("Sitemap generation failed:", err);
    return [];
  }
}
