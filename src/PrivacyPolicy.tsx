/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";

const PrivacyPolicy: React.FC = () => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    fetch("/content/privacy-policy.md")
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, []);

  return (
    <>
      <Helmet>
        <title>Himawari Project - プライバシーポリシー </title>
        <meta property="og:title" content="プライバシーポリシー" />
        <meta
          property="og:description"
          content="Himawari Projectのプライバシーポリシーを説明します"
        />
        <meta
          property="og:image"
          content="https://at-himawari.com/avatar.jpg"
        />
        <meta property="og:url" content="https://at-himawari.com/privacy" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Header />
      <section id="privacy-policy" className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ReactMarkdown
            components={{
              // トップレベルの日本語タイトル (画像でオレンジ色の大きな文字)
              h1: ({ node, ...props }) => (
                <h1
                  className="title-ja text-5xl font-bold text-orange-600 mb-2 tracking-wide"
                  {...props}
                />
              ),
              // その下の英語タイトル (画像で少し小さめの灰色文字)
              h2: ({ node, ...props }) => (
                <h2
                  className="section-h2 text-2xl font-bold text-gray-900 mt-8 mb-4"
                  {...props}
                />
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
                <li className="mb-2 text-base leading-relaxed" {...props} />
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
            {content}
          </ReactMarkdown>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
