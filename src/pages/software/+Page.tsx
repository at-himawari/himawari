import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { usePageContext } from "vike-react/usePageContext";
import type { PageContext } from "../../types/pageContext";
import { markdownComponents } from "../../components/MarkdownComponents";

export default function Page() {
  const pageContext = usePageContext() as { data: PageContext };
  const content = pageContext.data?.content || "読み込み中...";

  return (
    <>
      <Header />
      <section id="software" className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <ReactMarkdown
              components={markdownComponents}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}