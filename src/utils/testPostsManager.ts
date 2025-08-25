/**
 * テスト記事の管理ユーティリティ
 */

/**
 * テスト記事を表示するかどうかを判定する
 */
export function shouldShowTestPosts(): boolean {
  // テスト環境では常に表示
  if (process.env.NODE_ENV === "test") {
    return true;
  }

  // 開発環境では環境変数で制御
  if (process.env.NODE_ENV === "development") {
    return process.env.SHOW_TEST_POSTS === "true";
  }

  // 本番環境では表示しない
  return false;
}

/**
 * ファイル名がテスト記事かどうかを判定する
 */
export function isTestPost(filename: string): boolean {
  return filename.startsWith("test-");
}

/**
 * テスト記事をフィルタリングする
 */
export function filterTestPosts<T extends { filename?: string }>(
  items: T[],
  includeTests: boolean = shouldShowTestPosts()
): T[] {
  if (includeTests) {
    return items;
  }

  return items.filter((item) => {
    if (!item.filename) return true;
    return !isTestPost(item.filename);
  });
}

/**
 * 開発環境でのテスト記事表示状態をログ出力
 */
export function logTestPostsStatus(): void {
  if (process.env.NODE_ENV === "development") {
    const showTests = shouldShowTestPosts();
    console.log(`🧪 Test posts: ${showTests ? "VISIBLE" : "HIDDEN"}`);
    if (!showTests) {
      console.log("💡 To show test posts, set SHOW_TEST_POSTS=true");
    }
  }
}
