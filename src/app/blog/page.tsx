import type { Metadata } from "next";
import BlogPage from "../../views/blog/+Page";
import { data } from "../../views/blog/+data";

export const metadata: Metadata = {
  title: "Blog | Himawari Project",
  description: "のんびり仕事するブログ記事一覧",
  openGraph: {
    title: "Blog | Himawari Project",
    description: "のんびり仕事するブログ記事一覧",
    url: "/blog",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Blog | Himawari Project",
    description: "のんびり仕事するブログ記事一覧",
  },
};

export default async function Page() {
  const { posts } = await data();
  return <BlogPage posts={posts} />;
}
