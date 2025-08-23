import { getPosts } from "../../utils/getPosts";
import { Post } from "../../types/Post";

export function data() {
  const allPosts = getPosts();

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
