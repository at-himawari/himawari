import { getPosts } from "../../../utils/getPosts";
import type { PageContext } from "vike/types";

export function data(pageContext: PageContext) {
  const posts = getPosts();
  const post = posts.find((p) => p.slug === pageContext.routeParams?.slug);
  return {
    post,
  };
}