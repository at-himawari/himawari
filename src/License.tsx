import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";

const License: React.FC = () => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    fetch("/content/license.md")
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, []);

  return (
    <>
      <Helmet>
        <title>Himawari Project - License </title>
        <meta property="og:title" content="ライセンス" />
        <meta
          property="og:description"
          content="Himawari Projectのライセンスです。"
        />
        <meta property="og:image" content="https://at-himawari.com/avatar.jpg" />
        <meta property="og:url" content="https://at-himawari.com/license" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Header />
      <section id="license" className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default License;
