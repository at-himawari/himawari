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

  // NODE_ENVが未定義の場合（ビルド時など）は環境変数を直接チェック
  if (!process.env.NODE_ENV && process.env.SHOW_TEST_POSTS === "true") {
    return true;
  }

  // ビルド時に環境変数が読み込まれない場合の対応
  // .env.local ファイルを直接読み込んで確認
  try {
    const fs = require("fs");
    const path = require("path");
    const envPath = path.join(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf8");
      if (envContent.includes("SHOW_TEST_POSTS=true")) {
        return true;
      }
    }
  } catch (error) {
    // ファイル読み込みエラーは無視
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
  // Logging removed for production
}
