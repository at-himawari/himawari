import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "../../../components/JsonLd";
import BlogPostPage from "../../../views/blog/@slug/+Page";
import { getPosts } from "../../../utils/getPosts";
import {
  absoluteUrl,
  createDescription,
  createPageMetadata,
} from "../../../utils/seo";
import { title as siteTitle } from "../../../const/pageConstants";

type Params = {
  slug: string;
};

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const posts = await getPosts();
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    return {
      title: "記事が見つかりません",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description = createDescription(post.content || post.title);
  const image =
    post.coverImage ||
    "https://dq7c5b6uxkdk2.cloudfront.net/posts/images/avatar.jpg";

  return createPageMetadata({
    title: post.title,
    description,
    path: `/blog/${post.slug}`,
    image,
    type: "article",
    publishedTime: new Date(post.date).toISOString(),
    tags: post.tags,
  });
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const posts = await getPosts();
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const url = absoluteUrl(`/blog/${post.slug}`);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: createDescription(post.content || post.title),
        image: post.coverImage ? [post.coverImage] : undefined,
        datePublished: new Date(post.date).toISOString(),
        dateModified: new Date(post.date).toISOString(),
        mainEntityOfPage: url,
        keywords: post.tags,
        articleSection: post.categories,
        inLanguage: "ja",
        author: {
          "@type": "Organization",
          name: siteTitle,
          url: absoluteUrl("/"),
        },
        publisher: {
          "@type": "Organization",
          name: siteTitle,
          url: absoluteUrl("/"),
        },
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
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: url,
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd id="article-json-ld" data={articleJsonLd} />
      <BlogPostPage data={{ post }} url={url} />
    </>
  );
}
