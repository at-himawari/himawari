/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { generateHash } from "../../utils/hash";

// --- このファイル内で型とデータ取得関数を完結させます ---

// Postの型定義
interface Post {
  slug: string;
  content: string;
  title: string;
  date: string;
  categories?: string[];
  tags?: string[];
  coverImage?: string;
}

// 記事を全て取得する関数
async function getAllPosts(): Promise<Post[]> {
  const postsDirectory = path.join(process.cwd(), "src/content/blog/article");
  const filenames = fs.readdirSync(postsDirectory);

  const postsPromises = filenames
    .filter((filename) => filename.endsWith(".md"))
    .map(async (filename) => {
      const filePath = path.join(postsDirectory, filename);
      const rawContent = fs.readFileSync(filePath, "utf8");

      const { content, data } = matter(rawContent);
      const slug = await generateHash(rawContent);

      return {
        slug,
        content,
        ...(data as Omit<Post, "slug" | "content">),
      };
    });

  const posts = await Promise.all(postsPromises);

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// --- Vikeのdataフック ---

// ページコンポーネントに渡す記事情報の型（本文なし）
export type PostInfo = Omit<Post, "content">;

export async function data() {
  const allPosts = await getAllPosts();

  // 記事一覧ページには本文は不要なため、`content`プロパティを除外します
  const posts: PostInfo[] = allPosts.map(({ content, ...rest }) => rest);

  return {
    pageProps: {
      posts,
    },
  };
}
