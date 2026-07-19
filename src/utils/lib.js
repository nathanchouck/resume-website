//posts.js

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
    // Get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
        // Remove ".md" from file name to get id
        const slug = fileName.replace(/\.mdx$/, '');

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);

        // Combine the data with the id
        return {
            slug,
            ...matterResult.data,
        };
    });
    // Sort posts by date
    const sortedPosts = allPostsData.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    return sortedPosts;
}

export function getAllPostSlugs() {
    const fileNames = fs.readdirSync(postsDirectory);
    const slugs = fileNames.map((fileName) => 
        fileName.replace(/\.mdx$/, "")
    );
    return slugs;
}
export async function getPostData(slug) {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string
    // Combine the data with the slug and contentHtml
    return {
        slug,
        content: matterResult.content,
        ...matterResult.data,
    };
}