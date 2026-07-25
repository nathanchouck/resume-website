import fs from "fs/promises";
import path from "path";
import graph from "@/data/notebook-graph.json";
import { getSortedPostsData } from "@/utils/lib";

/*
 * Static sitemap. Every URL is emitted in its final, trailing-slash form (the
 * site 301s the bare paths to their slashed variants, so the sitemap should
 * name the destinations directly) — the root is the one exception and stays the
 * bare domain. lastmod is sourced from real content dates: Musings from post
 * frontmatter, /notebook/ from the graph export timestamp, and each note
 * permalink from its own lastReviewed date.
 */

const BASE_URL = "https://nathanhouck.com";
const NOTES_DIR = path.join(process.cwd(), "public", "notebook", "notes");

export const dynamic = "force-static"; // ensures static generation

function toISO(value, fallback) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? fallback : d.toISOString();
}

export default async function sitemap() {
  const now = new Date().toISOString();
  const graphGenerated = toISO(graph.generated, now);

  try {
    // Musings posts — lastmod from frontmatter date.
    const postUrls = getSortedPostsData().map((post) => ({
      url: `${BASE_URL}/musings/${post.slug}/`,
      lastModified: toISO(post.date, now),
      priority: 0.5,
    }));

    // Notebook note permalinks — lastmod from each note's lastReviewed date,
    // falling back to the graph export time when a note is unreviewed.
    const noteUrls = await Promise.all(
      graph.nodes.map(async (n) => {
        let lastReviewed = null;
        try {
          const raw = await fs.readFile(path.join(NOTES_DIR, `${n.id}.json`), "utf8");
          lastReviewed = JSON.parse(raw).lastReviewed;
        } catch {
          /* fall back to the graph timestamp below */
        }
        return {
          url: `${BASE_URL}/notebook/n/${n.id}/`,
          lastModified: lastReviewed ? toISO(lastReviewed, graphGenerated) : graphGenerated,
          priority: 0.5,
        };
      })
    );

    const staticPages = [
      { url: BASE_URL,                   lastModified: now,            priority: 1.0 },
      { url: `${BASE_URL}/projects/`,    lastModified: now,            priority: 0.8 },
      { url: `${BASE_URL}/resume/`,      lastModified: now,            priority: 0.8 },
      { url: `${BASE_URL}/musings/`,     lastModified: now,            priority: 0.7 },
      { url: `${BASE_URL}/notebook/`,    lastModified: graphGenerated, priority: 0.7 },
      { url: `${BASE_URL}/now/`,         lastModified: now,            priority: 0.6 },
    ];

    return [...staticPages, ...postUrls, ...noteUrls];
  } catch (err) {
    console.error("Sitemap generation failed:", err);
    return [];
  }
}
