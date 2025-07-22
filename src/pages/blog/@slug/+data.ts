import posts from "../../../content/blog/posts.json";
import type { PageContext } from "vike/types";

export interface Post {
  slug: string;
  content: string;
  title: string;
  date: string;
  categories?: string[];
  tags?: string[];
  coverImage?: string;
}

export function data(pageContext: PageContext) {
  const post = posts.find((p) => p.slug === pageContext.routeParams?.slug);
  return { post };
}

export type Data = Awaited<ReturnType<typeof data>>;
