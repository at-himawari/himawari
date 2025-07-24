/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ReactMarkdown from "react-markdown";
import { usePageContext } from "vike-react/usePageContext";
import { PageContext } from "../../types/pageContext";

const License: React.FC = () => {
  const pageContext = usePageContext() as { data: PageContext };
  const content = pageContext.data?.content || "読み込み中...";
  
  return (
    <>
      <Header />
      <section id="license" className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ReactMarkdown components={{
              // トップレベルの日本語タイトル (画像でオレンジ色の大きな文字)
              h1: ({ node, ...props }) => (
                <h1
                  className="title-ja text-4xl font-bold text-orange-600 mb-2 tracking-wide"
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
            }}>{content}</ReactMarkdown>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default License;
