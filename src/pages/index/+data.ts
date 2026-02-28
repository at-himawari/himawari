import { getPosts } from "../../utils/getPosts";
import { getFeaturedPosts } from "../../utils/featuredPosts";
import type { Post } from "../../types/Post";

// ホームページ用の軽量版Post型（contentを除外）
export type PostSummary = Omit<Post, "content">;

export interface HomePageData {
  latestPosts: PostSummary[];
  featuredPosts: PostSummary[];
  error?: string;
}

export async function data(): Promise<HomePageData> {
  try {
    console.info("Loading blog data for homepage...");

    // 全記事を取得
    const allPosts = await getPosts();
    console.info(`Loaded ${allPosts.length} total posts`);

    if (!allPosts || allPosts.length === 0) {
      console.warn("No posts found");
      return {
        latestPosts: [],
        featuredPosts: [],
        error: "記事が見つかりませんでした",
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
          console.warn("Null or undefined post encountered");
          return null;
        }

        if (!post.slug || !post.title) {
          console.warn("Post missing required fields:", {
            slug: post.slug,
            title: post.title,
          });
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
        console.error("Error simplifying post:", post, error);
        return null;
      }
    };

    const simplifiedLatestPosts = latestPosts
      .map(simplifyPost)
      .filter((post): post is PostSummary => post !== null);
    const simplifiedFeaturedPosts = featuredPosts
      .map(simplifyPost)
      .filter((post): post is PostSummary => post !== null);

    console.info(
      `Successfully processed ${simplifiedLatestPosts.length} latest posts and ${simplifiedFeaturedPosts.length} featured posts`,
    );

    return {
      latestPosts: simplifiedLatestPosts,
      featuredPosts: simplifiedFeaturedPosts,
    };
  } catch (error) {
    console.error("Failed to load blog data for homepage:", error);

    // エラーの詳細をログに記録
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }

    return {
      latestPosts: [],
      featuredPosts: [],
      error:
        "ブログデータの読み込みに失敗しました。しばらく時間をおいて再度お試しください。",
    };
  }
}
