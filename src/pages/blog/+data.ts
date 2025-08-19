/* eslint-disable @typescript-eslint/no-unused-vars */
import postsData from "../../content/blog/posts.json";
import { Post } from "../../types/Post";

export function data() {
  // 記事の全文(content)を含まないようにデータを加工する
  const posts: Omit<Post, "content">[] = postsData.map(
    ({ slug, title, date, categories, tags, coverImage }) => ({
      slug,
      title,
      date,
      categories,
      tags,
      coverImage,
    })
  );
  return {
    posts,
  };
}
