// src/utils/getPosts.ts (Strapi v4/v5 リレーション対応・認証なし版)
import type { Post } from "../types/Post";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  process.env.VITE_STRAPI_URL ||
  "http://localhost:1337";

// Category/Tagの型定義
interface StrapiTerm {
  id?: number;
  documentId?: string;
  name?: string;
  attributes?: {
    name: string;
  };
}

interface StrapiArticleItem {
  id?: number;
  documentId?: string;
  slug?: string;
  title?: string;
  date?: string;
  content?: string;
  coverImage?: string;
  // リレーションはネストされた構造で返ってきます
  categories?: { data?: StrapiTerm[] } | StrapiTerm[];
  tags?: { data?: StrapiTerm[] } | StrapiTerm[];
  // v4対応用
  attributes?: Omit<StrapiArticleItem, "attributes" | "id">;
}

interface StrapiResponse {
  data: StrapiArticleItem[];
  meta?: {
    pagination?: {
      page?: number;
      pageSize?: number;
      pageCount?: number;
      total?: number;
    };
  };
}

const ARTICLE_PAGE_SIZE = 100;
const ARTICLE_REVALIDATE_SECONDS = 60 * 60;

async function fetchArticlePage(page: number): Promise<StrapiResponse> {
  const params = new URLSearchParams({
    sort: "date:desc",
    populate: "*",
    "pagination[page]": String(page),
    "pagination[pageSize]": String(ARTICLE_PAGE_SIZE),
  });

  const response = await fetch(`${STRAPI_URL}/api/articles?${params}`, {
    next: { revalidate: ARTICLE_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.statusText}`);
  }

  return (await response.json()) as StrapiResponse;
}

export async function getPosts(): Promise<Post[]> {
  try {
    const firstPage = await fetchArticlePage(1);
    const firstPageItems = Array.isArray(firstPage.data) ? firstPage.data : [];
    const allItems = [...firstPageItems];
    const pageCount = firstPage.meta?.pagination?.pageCount || 1;

    for (let page = 2; page <= pageCount; page += 1) {
      const pageData = await fetchArticlePage(page);
      const pageItems = Array.isArray(pageData.data) ? pageData.data : [];
      allItems.push(...pageItems);
    }

    if (!Array.isArray(firstPage.data)) {
      console.warn("Strapiからのレスポンス形式が想定と異なります");
      return [];
    }

    return allItems.map((item) => {
      const attrs = item.attributes || item;

      // Strapiから返ってきたリレーションオブジェクトの配列を文字列の配列(string[])に変換する
      const categoriesData = Array.isArray(attrs.categories)
        ? attrs.categories
        : attrs.categories?.data || [];
      const extractedCategories = categoriesData.map(
        (c) => c.attributes?.name || c.name || "",
      );

      const tagsData = Array.isArray(attrs.tags)
        ? attrs.tags
        : attrs.tags?.data || [];
      const extractedTags = tagsData.map(
        (t) => t.attributes?.name || t.name || "",
      );

      return {
        slug: attrs.slug || "",
        title: attrs.title || "No Title",
        date: attrs.date || new Date().toISOString(),
        content: attrs.content || "",
        categories: extractedCategories, // 抽出した文字列配列をセット
        tags: extractedTags, // 抽出した文字列配列をセット
        coverImage: attrs.coverImage || "",
      };
    });
  } catch (error) {
    if (error instanceof Error) {
      console.warn("Posts are unavailable from Strapi:", error.message);
    } else {
      console.warn("Posts are unavailable from Strapi");
    }
    return [];
  }
}
