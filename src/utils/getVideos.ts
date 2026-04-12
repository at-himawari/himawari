const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  process.env.VITE_STRAPI_URL ||
  "http://localhost:1337";

interface Video {
  /** 動画のタイトル */
  title: string;
  /** 動画の説明文 */
  description: string;
  /** YouTubeなどの動画URL */
  videoUrl: string;
}

interface StrapiVideoItem {
  id?: number;
  attributes?: {
    title: string;
    description: string;
    videoUrl: string;
  };
  // Strapi v5 などの直接的な構造にも対応
  title?: string;
  description?: string;
  videoUrl?: string;
}

interface StrapiResponse {
  data: StrapiVideoItem[];
}

/**
 * Strapiから動画一覧を取得し、Video型の配列として返却する
 */
export async function getVideos(): Promise<Video[]> {
  try {
    // StrapiのContent Typeが "video-items" であると仮定
    const response = await fetch(`${STRAPI_URL}/api/video-items`);

    if (!response.ok) {
      throw new Error(`Failed to fetch videos: ${response.statusText}`);
    }

    const { data } = (await response.json()) as StrapiResponse;

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((item): Video => {
      const attrs = item.attributes || item;
      return {
        title: attrs.title || "No Title",
        description: attrs.description || "",
        videoUrl: attrs.videoUrl || "",
      };
    });
  } catch (error) {
    console.error("Error fetching videos from Strapi:", error);
    return [];
  }
}
