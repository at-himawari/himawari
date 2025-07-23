/* eslint-disable @typescript-eslint/no-unused-vars */
import postsData from "../../content/blog/posts.json";
import type { Post } from "./@slug/+data";

export type PostInfo = Omit<Post, "content">;

export function data() {
  const posts: PostInfo[] = postsData.map(({ content, ...rest }) => rest);
  return {
    posts,
  };
}
