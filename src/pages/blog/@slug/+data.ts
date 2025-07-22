/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { generateHash } from "../../../utils/hash";

// 型定義
export interface BlogMetadata {
  title: string;
  date: string;
  categories?: string[];
  tags?: string[];
  coverImage?: string;
}

export interface Post {
  slug: string;
  content: string;
  title: string;
  date: string;
  categories?: string[];
  tags?: string[];
  coverImage?: string;
}

let _posts: Post[] | null = null;

// Node.jsのfsモジュールを使ってファイルを読む
async function getAllPosts(): Promise<Post[]> {
  if (_posts) return _posts;

  const postsDirectory = path.join(process.cwd(), "src/content/blog/article");
  const filenames = fs.readdirSync(postsDirectory);

  const postsPromises = filenames
    .filter((filename) => filename.endsWith(".md"))
    .map(async (filename) => {
      const filePath = path.join(postsDirectory, filename);
      const rawContent = fs.readFileSync(filePath, "utf8");

      const { content, data } = matter(rawContent);
      const metadata = data as BlogMetadata;
      const slug = await generateHash(rawContent);

      return {
        slug,
        content,
        ...metadata,
      };
    });

  const posts = await Promise.all(postsPromises);

  _posts = posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return _posts;
}

// `content`を除いた型を定義
export type PostInfo = Omit<Post, "content">;

export async function data() {
  const allPosts = await getAllPosts();
  // 記事一覧ページには全文は不要なので、contentを除外して渡す
  const posts: PostInfo[] = allPosts.map(({ content, ...rest }) => rest);

  return {
    pageProps: {
      posts,
    },
  };
}
