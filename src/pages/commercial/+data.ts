import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export function data() {
  const filePath = path.join(
    process.cwd(),
    "src",
    "content",
    "commercial.md"
  );
  const fileRawContent = fs.readFileSync(filePath, "utf-8");

  const { content } = matter(fileRawContent);
  return {
      content,
  };
}