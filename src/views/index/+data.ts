import { getPosts } from "../../utils/getPosts";
import { getNewsItem } from "../../utils/getNewsItem";
import { getFeaturedPosts } from "../../utils/featuredPosts";
import type { Post } from "../../types/Post";
import type { NewsItem } from "../../components/NewsSection";

// ホームページ用の軽量版Post型（contentを除外）
export type PostSummary = Omit<Post, "content">;

export interface HomePageData {
  latestPosts: PostSummary[];
  featuredPosts: PostSummary[];
  newsItems: NewsItem[];
  error?: string;
}

export async function data(): Promise<HomePageData> {
  try {
    console.info("Loading blog data for homepage...");

    // 全記事を取得
    const [allPosts, newsItems] = await Promise.all([
      getPosts(),
      getNewsItem()
    ]);
    console.info(`Loaded ${allPosts.length} total posts`);

    if (!allPosts || allPosts.length === 0) {
      return {
        latestPosts: [],
        featuredPosts: [],
        newsItems,
      };
    }

    // 最新記事（日付順で上位3件）
    const latestPosts = allPosts.slice(0, 6);
    console.info(`Selected ${latestPosts.length} latest posts`);

    // おすすめ記事（スコア順で上位5件）
    const featuredPosts = getFeaturedPosts(allPosts, 5);
    console.info(`Selected ${featuredPosts.length} featured posts`);

    // contentフィールドを除外してPostSummaryに変換
    const simplifyPost = (post: Post): PostSummary | null => {
      try {
        if (!post) {
          return null;
        }

        if (!post.slug || !post.title) {
          return null;
        }

        return {
          slug: post.slug,
          title: post.title,
          date: typeof post.date === "string" ? post.date : String(post.date),
          categories: post.categories || [],
          tags: post.tags || [],
          coverImage: post.coverImage,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : "unknown error";
        console.warn("Post summary could not be created:", message);
        return null;
      }
    };

    const simplifiedLatestPosts = latestPosts
      .map(simplifyPost)
      .filter((post:PostSummary | null): post is PostSummary => post !== null);
    const simplifiedFeaturedPosts = featuredPosts
      .map(simplifyPost)
      .filter((post: PostSummary | null): post is PostSummary => post !== null);

    console.info(
      `Successfully processed ${simplifiedLatestPosts.length} latest posts and ${simplifiedFeaturedPosts.length} featured posts`,
    );

    return {
      latestPosts: simplifiedLatestPosts,
      featuredPosts: simplifiedFeaturedPosts,
      newsItems,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    console.warn("Homepage blog data is unavailable:", message);

    return {
      latestPosts: [],
      featuredPosts: [],
      newsItems: [],
    };
  }
}
