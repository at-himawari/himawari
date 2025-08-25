import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { createHash } from "node:crypto";
import type { Post } from "../types/Post";
import {
  shouldShowTestPosts,
  isTestPost,
  logTestPostsStatus,
} from "./testPostsManager";

// generateHash関数
function generateHash(content: string) {
  return createHash("sha256").update(content).digest("hex").slice(0, 8);
}

const postsDirectory = path.join(process.cwd(), "src/content/blog/article");

export function getPosts(): Post[] {
  // 開発環境でのテスト記事表示状態をログ出力
  logTestPostsStatus();

  const filenames = fs.readdirSync(postsDirectory);
  const showTests = shouldShowTestPosts();

  const posts = filenames
    .filter((filename) => {
      // .mdファイルのみを対象とする
      if (!filename.endsWith(".md")) return false;

      // READMEファイルを除外
      if (filename.toLowerCase() === "readme.md") return false;

      // テスト記事の表示制御
      if (isTestPost(filename) && !showTests) {
        return false;
      }

      return true;
    })
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
