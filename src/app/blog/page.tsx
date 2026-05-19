import type { Metadata } from "next";
import BlogPage from "../../views/blog/+Page";
import { data } from "../../views/blog/+data";
import { createPageMetadata } from "../../utils/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Blog",
  description: "のんびり仕事するブログ記事一覧",
  path: "/blog",
});

export default async function Page() {
  const { posts } = await data();
  return <BlogPage posts={posts} />;
}
