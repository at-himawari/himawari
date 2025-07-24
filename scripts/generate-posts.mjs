import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { createHash } from "node:crypto";

// generateHash関数をスクリプト内に定義
function generateHash(content) {
  return createHash("sha256").update(content).digest("hex").slice(0, 8);
}

// 記事ディレクトリと出力先JSONファイル
const postsDirectory = path.join(process.cwd(), "src/content/blog/article");
const outputFile = path.join(process.cwd(), "src/content/blog/posts.json");

function generatePostsData() {
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
      };
    });

  // 日付でソート
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // JSONファイルとして書き出す
  fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
  console.log("✅ ブログ記事のJSONファイルを生成しました！");
}

generatePostsData();
