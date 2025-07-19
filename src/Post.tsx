/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Helmet } from "react-helmet-async";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { FaXTwitter } from "react-icons/fa6"; // Xアイコン
import HatenaIcon from "./components/HatenaIcon";

interface PostData {
  content: string;
  title: string;
  date: string;
  coverImage?: string;
  tags?: string[];
  categories?: string[];
}

const Post: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostData | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/content/blog/json/${slug}.json`);
        const data: PostData = await res.json();
        setPost(data);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      }
    };
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>読み込み中...</div>
      </div>
    );
  }

  const metaDescription = post.content.substring(0, 120) + "...";
  const postUrl = window.location.href;

  return (
    <>
      <Helmet>
        <title>{post.title} - Himawari Project</title>
        <meta name="description" content={`Blog post about ${post.title}`} />
        {/* OGPタグ (Facebook, etc.) */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
        
        {/* ▼▼▼ ここからTwitter Card用のメタタグを追加 ▼▼▼ */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@at_himawari" />
        <meta name="twitter:creator" content="@at_himawari" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={metaDescription} />
        {post.coverImage && (
          <meta name="twitter:image" content={post.coverImage} />
        )}
        {/* ▲▲▲ ここまで追加 ▲▲▲ */}
      </Helmet>
      <Header />
      <div className="bg-gray-50 py-8">
        {/* ▼▼▼ 全体を囲むラッパーを追加 ▼▼▼ */}
        <div className="container mx-auto px-4 relative">
          {/* 1. フローティングするシェアボタン */}
          {/* lg以上の画面サイズで表示 */}
          <div className="absolute top-32 -left-4 hidden lg:block">
            <div className="sticky top-32 flex flex-col items-center space-y-4">
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  postUrl
                )}`} // textパラメータを削除
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-500 transition-colors p-2 rounded-full bg-white shadow"
                aria-label="Xでシェア"
              >
                <FaXTwitter size={20} />
              </a>
              <a
                href={`https://b.hatena.ne.jp/entry/${encodeURIComponent(
                  postUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-400 transition-colors p-2 rounded-full bg-white shadow"
                aria-label="はてなブックマークに追加"
              >
                <HatenaIcon size={20} />
              </a>
            </div>
          </div>
          {/* ▲▲▲ シェアボタンここまで ▲▲▲ */}

          <article className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-10">
            {/* カバー画像 */}
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-auto rounded-lg mb-6"
              />
            )}

            {/* タイトルとメタ情報 */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                {post.title}
              </h1>
              <p className="text-gray-500 text-right">
                {new Date(post.date).toLocaleDateString()}
              </p>
              <div className="mt-4 flex  flex-wrap gap-2">
                {post.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 本文 */}
            <div className="prose lg:prose-xl max-w-none">
              <ReactMarkdown
                rehypePlugins={[rehypeKatex]}
                remarkPlugins={[remarkGfm, remarkMath]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-3xl font-bold mt-8 mb-4 underline decoration-slate-300"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-2xl font-bold mt-6 mb-3 underline decoration-slate-300"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-xl font-bold mt-4 mb-2 underline decoration-slate-300"
                      {...props}
                    />
                  ),
                  h4: ({ node, ...props }) => (
                    <h4 className="text-xl mt-4 mb-2" {...props} />
                  ),
                  // 本文の段落
                  p: ({ node, ...props }) => (
                    <p className="text-base leading-relaxed mb-4" {...props} />
                  ),
                  // Markdownのリスト (数字リスト)
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal pl-6 mb-4" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li
                      className="mb-2 text-base leading-relaxed list-disc"
                      {...props}
                    />
                  ),
                  // Markdown内のリンク
                  a: ({ node, ...props }) => (
                    <a
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </article>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Post;
