import posts from "../../../content/blog/posts.json";
import type { PageContext } from "vike/types";



export function data(pageContext: PageContext) {
  const post = posts.find((p) => p.slug === pageContext.routeParams?.slug);
  // こちらも pageProps でラップします
  return {
    post,
  };
}
