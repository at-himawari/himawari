import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";

const ProjectPolicy: React.FC = () => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    fetch("/content/project-policy.md")
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, []);

  return (
    <>
      <Helmet>
        <title>Himawari Project - プロジェクトポリシー </title>
        <meta property="og:title" content="プロジェクトポリシー" />
        <meta
          property="og:description"
          content="Himawari Projectのプロジェクトポリシーを説明します"
        />
        <meta property="og:image" content="https://at-himawari.com/avatar.jpg" />
        <meta property="og:url" content="https://at-himawari.com/project-policy" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Header />
      <section id="project-policy" className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ProjectPolicy;
