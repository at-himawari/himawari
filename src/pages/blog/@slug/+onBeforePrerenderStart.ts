import { getPosts } from "../../../utils/getPosts";

export default function onBeforePrerenderStart() {
  const posts = getPosts();
  const blogUrls = posts.map((post) => `/blog/${post.slug}`);
  return blogUrls;
}