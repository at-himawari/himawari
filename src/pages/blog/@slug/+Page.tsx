import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { FaXTwitter } from "react-icons/fa6";
import HatenaIcon from "../../../components/HatenaIcon";
import { PageContextPost } from "../../../types/pageContextPost";
import { usePageContext } from "vike-react/usePageContext";
import { secureMarkdownContent } from "../../../utils/contentSecurity";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { sanitizeConfig } from "../../../utils/sanitizeConfig";
import { markdownComponents } from "../../../components/MarkdownComponents";

// コンポーネント本体
export default function Page() {
  const pageContext = usePageContext() as {
    data: PageContextPost;
    urlOriginal: string;
  };
  // サーバーサイドではpageContextから、クライアントサイドではwindow.locationからURLを取得
  const [postUrl, setPostUrl] = useState(
    `https://at-himawari.com${pageContext.urlOriginal}`
  );
  useEffect(() => {
    setPostUrl(window.location.href);
  }, []);

  const post = pageContext.data?.post || "読み込み中...";

  if (!post) return <div>記事が見つかりません</div>;

  const { title, date, tags, coverImage, content } = post;

  // Apply security validation and pre-sanitization
  const securityResult = secureMarkdownContent(content || "");

  // Log security warnings in development
  if (
    process.env.NODE_ENV === "development" &&
    securityResult.hasSecurityIssues
  ) {
    console.warn(
      "Security issues detected in content:",
      securityResult.warnings
    );
  }

  return (
    <>
      <Header />
      <main className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 relative">
          <ShareButtons postUrl={postUrl} title={title} />
          <MobileShareButtons postUrl={postUrl} title={title} />
          <article className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-10">
            {coverImage && (
              <img
                src={coverImage}
                alt={title}
                className="w-full h-auto rounded-lg mb-6"
              />
            )}
            <header className="mb-8 text-center">
              <h1 className="text-start text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                {title}
              </h1>
              <div className="mt-4 flex justify-start flex-wrap gap-2">
                {tags?.map((tag) => (
                  <Tag key={tag} tag={tag} />
                ))}
              </div>
              <p className="text-gray-500 text-start mt-4">
                投稿日 {new Date(date).toLocaleDateString()}
              </p>
            </header>
            <section className="prose max-w-none">
              <ReactMarkdown
                rehypePlugins={[
                  rehypeRaw,
                  rehypeKatex,
                  [rehypeSanitize, sanitizeConfig],
                ]}
                remarkPlugins={[remarkGfm, remarkMath]}
                components={markdownComponents}
              >
                {securityResult.content}
              </ReactMarkdown>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}

// シェアボタンのコンポーネント
function ShareButtons({ postUrl, title }: { postUrl: string; title: string }) {
  const [isVisible, setIsVisible] = useState(true); // 初期状態で表示

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 記事の開始位置（ヘッダーの高さ + マージン）を過ぎたら表示
      const articleStartPosition = 100; // 閾値を下げる
      setIsVisible(currentScrollY > articleStartPosition);
    };

    // 初期スクロール位置をチェック
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed left-4 top-1/2 -translate-y-1/2 z-50 transition-all duration-300 ease-out hidden lg:block ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"
      }`}
    >
      <div className="flex flex-col items-center space-y-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
        <a
          href={`https://twitter.com/intent/tweet?url=${postUrl}&text=${encodeURIComponent(
            title
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-blue-500 transition-all duration-200 p-2 rounded-full hover:bg-blue-50 hover:scale-110"
          aria-label="Xでシェア"
        >
          <FaXTwitter size={20} />
        </a>
        <a
          href={`https://b.hatena.ne.jp/entry/${encodeURIComponent(postUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-blue-400 transition-all duration-200 p-2 rounded-full hover:bg-blue-50 hover:scale-110"
          aria-label="はてなブックマークに追加"
        >
          <HatenaIcon size={20} />
        </a>
      </div>
    </div>
  );
}

// モバイル用シェアボタンのコンポーネント
function MobileShareButtons({
  postUrl,
  title,
}: {
  postUrl: string;
  title: string;
}) {
  const [isVisible, setIsVisible] = useState(true); // 初期状態で表示

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // スクロールが30px以上で表示開始、フッター手前で非表示
      const showThreshold = 30; // 閾値を下げる
      const hideThreshold = documentHeight - windowHeight - 200;

      setIsVisible(
        scrollPosition > showThreshold && scrollPosition < hideThreshold
      );
    };

    // 初期スクロール位置をチェック
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 transition-all duration-300 ease-out lg:hidden ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
      }`}
    >
      <div className="flex items-center space-x-3 bg-white/95 backdrop-blur-sm rounded-full px-4 py-3 shadow-lg border border-gray-200">
        <span className="text-sm font-medium text-gray-700">シェア</span>
        <a
          href={`https://twitter.com/intent/tweet?url=${postUrl}&text=${encodeURIComponent(
            title
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-blue-500 transition-all duration-200 p-2 rounded-full hover:bg-blue-50"
          aria-label="Xでシェア"
        >
          <FaXTwitter size={18} />
        </a>
        <a
          href={`https://b.hatena.ne.jp/entry/${encodeURIComponent(postUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-blue-400 transition-all duration-200 p-2 rounded-full hover:bg-blue-50"
          aria-label="はてなブックマークに追加"
        >
          <HatenaIcon size={18} />
        </a>
      </div>
    </div>
  );
}

// タグ表示のコンポーネント
function Tag({ tag }: { tag: string }) {
  return (
    <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
      #{tag}
    </span>
  );
}
