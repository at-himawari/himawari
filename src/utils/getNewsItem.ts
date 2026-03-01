import type { NewsItem } from "../components/NewsSection";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

interface StrapiNewsItem {
  id?: number;
  documentId?: string;
  title?: string;
  date?: string;
  content?: string;
  link?: string;
  attributes?: Omit<StrapiNewsItem, "attributes" | "id">;
}

interface StrapiResponse {
  data: StrapiNewsItem[];
}

export async function getNewsItem(): Promise<NewsItem[]> {
  try {
    // コレクション名が「news」の場合（環境に合わせて変更してください）
    const response = await fetch(`${STRAPI_URL}/api/news-items?sort=date:desc`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.statusText}`);
    }

    const { data } = (await response.json()) as StrapiResponse;

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((item) => {
      // Strapi v4/v5のレスポンス構造の違いを吸収
      const attrs = item.attributes || item;

      return {
        title: attrs.title || "お知らせ",
        date: attrs.date || "",
        content: attrs.content || "",
        link: attrs.link || undefined,
      };
    });
  } catch (error) {
    console.error("Error fetching news from Strapi:", error);
    return [];
  }
}