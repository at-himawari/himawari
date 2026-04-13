import type { NewsItem } from "../components/NewsSection";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  process.env.VITE_STRAPI_URL ||
  "http://localhost:1337";

interface StrapiNewsItem {
  id?: number;
  documentId?: string;
  title?: unknown;
  date?: unknown;
  content?: unknown;
  link?: unknown;
  attributes?: Omit<StrapiNewsItem, "attributes" | "id">;
}

interface StrapiResponse {
  data: StrapiNewsItem[];
}

function strapiRichTextToPlainText(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map(strapiRichTextToPlainText)
      .filter(Boolean)
      .join("\n");
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    if (typeof record.text === "string") {
      return record.text;
    }

    if (Array.isArray(record.children)) {
      return strapiRichTextToPlainText(record.children);
    }

    if (Array.isArray(record.content)) {
      return strapiRichTextToPlainText(record.content);
    }
  }

  return "";
}

function optionalString(value: unknown): string | undefined {
  const text = strapiRichTextToPlainText(value).trim();
  return text || undefined;
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
        title: optionalString(attrs.title) || "お知らせ",
        date: optionalString(attrs.date) || "",
        content: optionalString(attrs.content) || "",
        link: optionalString(attrs.link),
      };
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    console.warn("News items are unavailable from Strapi:", message);
    return [];
  }
}
