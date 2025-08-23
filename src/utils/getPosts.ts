import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { createHash } from "node:crypto";
import type { Post } from "../types/Post";

// generateHash関数
function generateHash(content: string) {
  return createHash("sha256").update(content).digest("hex").slice(0, 8);
}

const postsDirectory = path.join(process.cwd(), "src/content/blog/article");

export function getPosts(): Post[] {
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename);
      const rawContent = fs.readFileSync(filePath, "utf8");

      const { content, data } = matter(rawContent);
      const slug = generateHash(rawContent);

      return {
        slug,
        content,
        ...data,
      } as Post;
    });

  // 日付でソート
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}