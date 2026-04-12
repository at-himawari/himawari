import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostPage from "../../../views/blog/@slug/+Page";
import { getPosts } from "../../../utils/getPosts";
import { postUrl } from "../../../const/pageConstants";

type Params = {
  slug: string;
};

export const dynamicParams = false;
export const dynamic = "force-static";

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getPosts();
  return posts
    .filter((post) => post.slug)
    .map((post) => ({
      slug: post.slug,
    }));
}

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
      title: "記事が見つかりません | Himawari Project",
    };
  }

  const description =
    post.content?.substring(0, 120).replace(/\n/g, " ").replace("#", "") +
    "...";
  const image =
    post.coverImage ||
    "https://dq7c5b6uxkdk2.cloudfront.net/posts/images/avatar.jpg";
  const url = `${postUrl}/blog/${post.slug}`;

  return {
    title: `${post.title} | Himawari Project`,
    description,
    openGraph: {
      title: post.title,
      description,
      url,
      type: "article",
      images: [image],
      publishedTime: new Date(post.date).toISOString(),
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [image],
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const posts = await getPosts();
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <BlogPostPage
      data={{ post }}
      url={`${postUrl}/blog/${post.slug}`}
    />
  );
}
