import { Post } from "../types/Post";

interface StrapiArticle {
  id: number;
  attributes: {
    slug: string;
    title: string;
    date: string;
    content: string;
    categories?: unknown[];
    tags?: unknown[];
    coverImage?: string;
  };
}

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

export async function getPosts(): Promise<Post[]> {
  const url =
    `${STRAPI_URL}/api/articles` +
    `?sort=date:desc` +
    `&filters[publishedAt][$notNull]=true` + // 公開記事のみ
    `&pagination[pageSize]=100`;

  const response = await fetch(url); // ← Authorizationなし

  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.statusText}`);
  }

  const { data } = await response.json();

  return data.map((item: StrapiArticle) => {
    const attrs = item.attributes || item;

    return {
      slug: attrs.slug ?? "",
      title: attrs.title ?? "No Title",
      date: attrs.date ?? "",
      content: attrs.content ?? "",
      categories: attrs.categories ?? [],
      tags: attrs.tags ?? [],
      coverImage: attrs.coverImage ?? "",
    };
  });
}
