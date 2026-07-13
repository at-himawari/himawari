import type { Metadata } from "next";
import JsonLd from "../../components/JsonLd";
import BlogPage from "../../views/blog/+Page";
import { data } from "../../views/blog/+data";
import { absoluteUrl, createPageMetadata } from "../../utils/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "技術ブログ",
  description:
    "AI活用、ソフトウェア開発、Web制作、クラウド、映像制作の実践知をまとめたHimawari Projectの技術ブログです。",
  path: "/blog",
});

export default async function Page() {
  const { posts } = await data({ throwOnError: true });
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${absoluteUrl("/blog")}#collection`,
        name: "Himawari Project 技術ブログ",
        description: metadata.description,
        url: absoluteUrl("/blog"),
        inLanguage: "ja",
      },
      {
        "@type": "ItemList",
        "@id": `${absoluteUrl("/blog")}#posts`,
        name: "最新記事",
        itemListElement: posts.slice(0, 20).map((post, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: post.title,
          url: absoluteUrl(`/blog/${post.slug}`),
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: absoluteUrl("/blog"),
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd id="blog-json-ld" data={blogJsonLd} />
      <BlogPage posts={posts} />
    </>
  );
}
