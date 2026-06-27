import { getPosts } from "../../utils/getPosts";
import { Post } from "../../types/Post";

type BlogDataOptions = {
  throwOnError?: boolean;
};

export async function data(options: BlogDataOptions = {}) {
  const allPosts = await getPosts(options);

  // content を除外したメタデータのみを渡す
  const posts: Omit<Post, "content">[] = allPosts.map(
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
