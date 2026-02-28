import { getPosts } from "../../../utils/getPosts";

export default async function onBeforePrerenderStart() {
  const posts = await getPosts();
  const blogUrls = posts.map((post) => `/blog/${post.slug}`);
  return blogUrls;
}