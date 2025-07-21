import fs from "fs";
import path from "path";
import matter from "gray-matter";
import crypto from "crypto";

const articlesDir = path.join(
  process.cwd(),
  "public",
  "content",
  "blog",
  "article"
);

export interface Post {
  slug: string;
  title: string;
  date: string;
  content: string;
  tags: string[];
  categories: string[];
  coverImage?: string;
}

// 全ての記事のデータを一度だけ読み込むためのキャッシュ
let allPostsCache: Post[] | null = null;

// 全ての記事データを取得する関数
export function getAllPosts(): Post[] {
  if (allPostsCache) {
    return allPostsCache;
  }

  const filenames = fs
    .readdirSync(articlesDir)
    .filter((f) => f.endsWith(".md"));
  const posts = filenames.map((filename) => {
    const filePath = path.join(articlesDir, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);
      
    // ファイル名を元に、衝突しない一意なID（slug）を生成
    const slug = crypto
      .createHash("sha256")
      .update(filename)
      .digest("hex")
      .slice(0, 12);

    return {
      slug,
      title: data.title,
      date: data.date,
      tags: data.tags || [],
      categories: data.categories || [],
      coverImage: data.coverImage || "",
      content,
    };
  });

  // 日付の降順で記事をソート
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  allPostsCache = posts;
  return allPostsCache;
}
