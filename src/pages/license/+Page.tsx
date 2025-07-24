/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ReactMarkdown from "react-markdown";
import { usePageContext } from "vike-react/usePageContext";
import { PageContext } from "../../types/pageContext";
import { markdownComponents } from "../../components/MarkdownComponents";

const License: React.FC = () => {
  const pageContext = usePageContext() as { data: PageContext };
  const content = pageContext.data?.content || "読み込み中...";
  
  return (
    <>
      <Header />
      <section id="license" className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default License;
