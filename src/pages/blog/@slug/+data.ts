import fs from "fs";
import path from "path";

// このファイルが返すデータの型をエクスポートします
export type Data = Awaited<ReturnType<typeof data>>;

export async function data(pageContext: { routeParams: { slug: string } }) {
  const { slug } = pageContext.routeParams;
  const filePath = path.join(
    process.cwd(),
    "public",
    "content",
    "blog",
    "json",
    `${slug}.json`
  );
  const postData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  // meta情報をここで生成
  const metaDescription = postData.content.substring(0, 120) + "...";
  const absoluteCoverImageUrl = postData.coverImage
    ? new URL(postData.coverImage, "https://at-himawari.com").href
    : "https://at-himawari.com/avatar.png";

  return {
    pageProps: {
      ...postData,
    },
    // ▼▼▼ metaオブジェクトの値を { value: '...' } で囲む ▼▼▼
    meta: {
      title: { value: `${postData.title} - Himawari Project` },
      description: { value: metaDescription },
      coverImage: { value: absoluteCoverImageUrl },
    },
  };
}
