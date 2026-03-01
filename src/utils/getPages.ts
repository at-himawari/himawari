// src/utils/getPages.ts

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

export async function getPageContent(slug: string): Promise<string> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/fixed-pages?filters[slug][$eq]=${slug}`
    );
    if (!response.ok) throw new Error(`Fetch error: ${response.statusText}`);
    
    const { data } = await response.json();
    // 該当するslugのデータがあればそのcontentを返す
    return data[0]?.attributes?.content || data[0]?.content || "内容がありません。";
  } catch (error) {
    console.error(`Error fetching page ${slug}:`, error);
    return "データの取得に失敗しました。";
  }
}