import { memo } from "react";
import PostCard from "./PostCard";
import type { Post } from "../types/Post";

interface BlogSectionProps {
  latestPosts: Omit<Post, "content">[];
  featuredPosts: Omit<Post, "content">[];
  error?: string;
}

const BlogSection = memo(
  function BlogSection({
    latestPosts,
    featuredPosts,
    error,
  }: BlogSectionProps) {
    // エラー状態のハンドリング
    if (error) {
      console.error("BlogSection error:", error);
      return (
        <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                ブログ
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center justify-center mb-3">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <p className="text-red-600 font-medium mb-2">
                  データの読み込みに失敗しました
                </p>
                <p className="text-red-500 text-sm">{error}</p>
                <div className="mt-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    再読み込み
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    // 記事が存在しない場合のハンドリング
    if (!latestPosts.length && !featuredPosts.length) {
      console.info("No blog posts available to display");
      return (
        <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                ブログ
              </h2>
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg font-medium mb-2">
                  記事がまだありません
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  新しい記事が公開されるまでお待ちください
                </p>
                <a
                  href="/blog"
                  className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  ブログページを見る
                </a>
              </div>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* セクションタイトルとサブタイトル */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              ブログ
            </h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
              最新の記事とおすすめ記事をご紹介します
            </p>
            <div className="w-16 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* レスポンシブグリッドレイアウト */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 max-w-7xl mx-auto">
            {/* 最新記事セクション */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
                  <span className="w-2 h-8 bg-orange-500 rounded-full mr-3"></span>
                  最新記事
                </h3>
                <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                  {latestPosts.length}件
                </span>
              </div>

              {latestPosts.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {latestPosts.map((post, index) => (
                    <div
                      key={post.slug}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <PostCard post={post} compact={true} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                  <div className="text-gray-400 mb-2">
                    <svg
                      className="w-12 h-12 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600">最新記事がありません</p>
                </div>
              )}
            </div>

            {/* おすすめ記事セクション */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
                  <span className="w-2 h-8 bg-orange-500 rounded-full mr-3"></span>
                  おすすめ記事
                  <span className="ml-2 text-orange-500">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </span>
                </h3>
                <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                  {featuredPosts.length}件
                </span>
              </div>

              {featuredPosts.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {featuredPosts.map((post, index) => (
                    <div
                      key={post.slug}
                      className="animate-fade-in"
                      style={{
                        animationDelay: `${
                          (index + latestPosts.length) * 100
                        }ms`,
                      }}
                    >
                      <PostCard post={post} compact={true} featured={true} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                  <div className="text-gray-400 mb-2">
                    <svg
                      className="w-12 h-12 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600">おすすめ記事がありません</p>
                </div>
              )}
            </div>
          </div>
          {/* すべての記事を見るリンクボタン */}
          <div className="text-center pt-4">
            <a
              href="/blog"
              className="inline-flex items-center bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
            >
              すべての記事を見る
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>

          {/* モバイル用の追加情報 */}
          <div className="mt-8 sm:mt-12 text-center">
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              技術記事や日常の気づきなどを定期的に更新しています
            </p>
          </div>
        </div>
      </section>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for memo optimization
    return (
      prevProps.error === nextProps.error &&
      prevProps.latestPosts.length === nextProps.latestPosts.length &&
      prevProps.featuredPosts.length === nextProps.featuredPosts.length &&
      prevProps.latestPosts.every(
        (post, index) =>
          post.slug === nextProps.latestPosts[index]?.slug &&
          post.title === nextProps.latestPosts[index]?.title &&
          post.date === nextProps.latestPosts[index]?.date
      ) &&
      prevProps.featuredPosts.every(
        (post, index) =>
          post.slug === nextProps.featuredPosts[index]?.slug &&
          post.title === nextProps.featuredPosts[index]?.title &&
          post.date === nextProps.featuredPosts[index]?.date
      )
    );
  }
);

export default BlogSection;
