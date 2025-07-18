const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const articlesDir = path.join(__dirname, "../public/content/blog/article");
const jsonDir = path.join(__dirname, "../public/content/blog/json");
const outputIndexFile = path.join(
  __dirname,
  "../public/content/blog/index.json"
);

try {
  // JSON出力用のディレクトリがなければ作成
  if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir, { recursive: true });
  }

  const filenames = fs
    .readdirSync(articlesDir)
    .filter((f) => f.endsWith(".md"));

  const posts = filenames.map((filename) => {
    const filePath = path.join(articlesDir, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    const slug = filename.replace(/\.md$/, "");

    // 各記事の本文を含んだJSONを保存
    const postJson = {
      title: data.title,
      date: data.date,
      tags: data.tags || [],
      categories: data.categories || [],
      coverImage: data.coverImage || "",
      content: content,
    };
    fs.writeFileSync(
      path.join(jsonDir, `${slug}.json`),
      JSON.stringify(postJson, null, 2)
    );

    // index.jsonには本文を含まない軽量な情報を保存
    return {
      slug: slug,
      title: data.title,
      date: data.date,
      tags: data.tags || [],
      categories: data.categories || [],
      coverImage: data.coverImage || "",
    };
  });

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  fs.writeFileSync(outputIndexFile, JSON.stringify(posts, null, 2));

  console.log("Blog index and individual posts generated successfully!");
} catch (error) {
  console.error("Error generating blog data:", error);
  process.exit(1); // エラーがあった場合はビルドを失敗させる
}
