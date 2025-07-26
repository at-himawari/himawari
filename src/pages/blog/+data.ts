/* eslint-disable @typescript-eslint/no-unused-vars */
import postsData from "../../content/blog/posts.json";
import { Post } from "../../types/Post";


export function data() {
  const posts: Post[] = postsData;
  return {
    posts,
  };
}
