import { getPosts } from "../../../utils/getPosts";

export async function data(pageContext: { routeParams?: { slug?: string } }) {
  const posts = await getPosts();
  const post = posts.find((p) => p.slug === pageContext.routeParams?.slug);
  return {
    post,
  };
}
