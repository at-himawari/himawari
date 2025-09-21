import type { Post } from "../types/Post";

/**
 * おすすめ記事を選定してスコア順で返す
 * @param posts 全記事の配列
 * @param limit 返す記事数の上限
 * @returns スコア順でソートされたおすすめ記事の配列
 */
export function getFeaturedPosts(posts: Post[], limit: number): Post[] {
  try {
    if (!posts || posts.length === 0) {
      console.info("No posts available for featured posts selection");
      return [];
    }

    if (limit <= 0) {
      console.warn("Invalid limit for featured posts:", limit);
      return [];
    }

    const scoredPosts = posts
      .map((post) => {
        try {
          return {
            post,
            score: calculateFeaturedScore(post),
          };
        } catch (error) {
          console.error(
            `Error calculating score for post "${post.title}":`,
            error
          );
          return {
            post,
            score: 0, // デフォルトスコア
          };
        }
      })
      .filter((item) => item.score > 0 && !isNaN(item.score)) // スコアが0または無効な記事を除外
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    console.info(
      `Selected ${scoredPosts.length} featured posts from ${posts.length} total posts`
    );

    return scoredPosts.map((item) => item.post);
  } catch (error) {
    console.error("Error in getFeaturedPosts:", error);
    return [];
  }
}

/**
 * 記事のおすすめ度スコアを計算する
 * @param post 記事オブジェクト
 * @returns 0-1の範囲のスコア値
 */
function calculateFeaturedScore(post: Post): number {
  try {
    if (!post) {
      console.warn("Invalid post object provided to calculateFeaturedScore");
      return 0;
    }

    if (!post.title) {
      console.warn("Post missing title:", post);
      return 0;
    }

    // 日付の新しさ（50%）
    const recencyScore = getRecencyScore(post.date);

    // 無効な日付の場合は即座に0を返す
    if (recencyScore === 0) {
      return 0;
    }

    // カテゴリの重要度（30%）
    const categoryScore = getCategoryScore(post.categories || []);

    // タグの多様性（20%）
    const tagScore = getTagScore(post.tags || []);

    const finalScore =
      recencyScore * 0.5 + categoryScore * 0.3 + tagScore * 0.2;

    // スコアが異常値でないかチェック
    if (isNaN(finalScore) || finalScore < 0 || finalScore > 1) {
      console.warn(
        `Invalid score calculated for post "${post.title}": ${finalScore}`
      );
      return 0;
    }

    return finalScore;
  } catch (error) {
    console.error(
      `Error calculating featured score for post "${
        post?.title || "unknown"
      }":`,
      error
    );
    return 0;
  }
}

/**
 * 記事の新しさに基づくスコアを計算する
 * @param dateString 記事の日付文字列
 * @returns 0-1の範囲のスコア値（新しいほど高い）
 */
function getRecencyScore(dateString: string): number {
  try {
    const postDate = new Date(dateString);
    const now = new Date();

    // 無効な日付の場合は最低スコア
    if (isNaN(postDate.getTime())) {
      console.warn(`Invalid date format: ${dateString}`);
      return 0;
    }

    const daysDiff =
      (now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24);

    // 30日以内は満点、それ以降は徐々に減点（1年で0になる）
    if (daysDiff <= 30) {
      return 1;
    }

    return Math.max(0, 1 - daysDiff / 365);
  } catch (error) {
    console.warn(`Invalid date format: ${dateString}`);
    return 0;
  }
}

/**
 * カテゴリに基づくスコアを計算する
 * @param categories 記事のカテゴリ配列
 * @returns 0-1の範囲のスコア値
 */
function getCategoryScore(categories: string[]): number {
  if (!categories || categories.length === 0) {
    return 0.3; // カテゴリなしの場合は中間値
  }

  // 技術系カテゴリに高いスコアを付与
  const techCategories = [
    "プログラミング",
    "技術",
    "Web開発",
    "React",
    "TypeScript",
    "JavaScript",
    "開発",
    "エンジニア",
    "フロントエンド",
    "バックエンド",
    "AWS",
    "クラウド",
  ];

  const hasTechCategory = categories.some((cat) =>
    techCategories.some(
      (tech) =>
        cat.toLowerCase().includes(tech.toLowerCase()) ||
        tech.toLowerCase().includes(cat.toLowerCase())
    )
  );

  return hasTechCategory ? 1 : 0.5;
}

/**
 * タグの多様性に基づくスコアを計算する
 * @param tags 記事のタグ配列
 * @returns 0-1の範囲のスコア値
 */
function getTagScore(tags: string[]): number {
  if (!tags || tags.length === 0) {
    return 0.3; // タグなしの場合は中間値
  }

  const tagCount = tags.length;

  // 適切なタグ数（3-6個）で最高スコア
  if (tagCount >= 3 && tagCount <= 6) {
    return 1;
  }

  // やや少ない/多い（2個または7個）で中程度のスコア
  if (tagCount >= 2 && tagCount <= 7) {
    return 0.8;
  }

  // 極端に少ない/多い場合は低スコア
  return 0.5;
}
