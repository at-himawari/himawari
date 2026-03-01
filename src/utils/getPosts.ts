// src/utils/getPosts.ts (Strapi v4/v5 リレーション対応・認証なし版)
import type { Post } from "../types/Post";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

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
}

export async function getPosts(): Promise<Post[]> {
  try {
    // URLの最後に &populate=categories,tags を追加してリレーションデータも取得する
    // 認証ヘッダー(headers)を削除しました
    const response = await fetch(
      `${STRAPI_URL}/api/articles?sort=date:desc&populate=*`,
    );
    console.log("Strapiからのレスポンス:", response);

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    const { data } = (await response.json()) as StrapiResponse;

    if (!Array.isArray(data)) {
      console.error("Strapiからのレスポンス形式が想定と異なります:", data);
      return [];
    }

    return data.map((item) => {
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
      console.error("Error fetching posts from Strapi:", error.message);
    } else {
      console.error("Unknown error fetching posts from Strapi:", error);
    }
    return [];
  }
}
