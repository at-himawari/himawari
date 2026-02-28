import { getPosts } from "../../../utils/getPosts";
import type { PageContext } from "vike/types";

export async function data(pageContext: PageContext) {
  const posts = await getPosts();
  const post = posts.find((p) => p.slug === pageContext.routeParams?.slug);
  return {
    post,
  };
}