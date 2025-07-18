/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Helmet } from "react-helmet-async";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import Twemoji from "./Twemoji";
import remarkMath from "remark-math";

interface PostData {
  content: string;
  title: string;
  date: string;
  coverImage?: string;
}

const Post: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostData | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Markdownではなく、生成されたJSONファイルを読み込みます
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
    return <div>Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - Himawari Project</title>
        <meta name="description" content={`Blog post about ${post.title}`} />
      </Helmet>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <article className="prose lg:prose-xl max-w-none">
          {post.coverImage && <Twemoji/>}
          <h1 className="text-4xl text-center font-bold mb-2">{post.title}</h1>
          <p className="text-gray-600 mb-8 text-right">
            {new Date(post.date).toLocaleDateString()}
          </p>
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
                <li className="mb-2 text-base leading-relaxed list-disc" {...props} />
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
        </article>
      </div>
      <Footer />
    </>
  );
};

export default Post;
