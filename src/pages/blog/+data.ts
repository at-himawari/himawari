/* eslint-disable @typescript-eslint/no-unused-vars */
import postsData from "../../content/blog/posts.json";
import { Post } from "../../types/Post";


export type PostInfo = Omit<Post, "content">;

export function data() {
  const posts: PostInfo[] = postsData.map(({ content, ...rest }) => rest);
  return {
    posts,
  };
}
