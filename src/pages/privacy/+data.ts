import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export function data() {
  // プロジェクトのルートディレクトリからの相対パスでMarkdownファイルを読み込みます
  const filePath = path.join(
    process.cwd(),
    "src",
    "content",
    "privacy-policy.md"
  );
  const fileRawContent = fs.readFileSync(filePath, "utf-8");

  // gray-matterでファイル内容をパースし、本文(content)とフロントマター(data)を分離します
  const { content } = matter(fileRawContent);
  return {
      content,
  };
}
