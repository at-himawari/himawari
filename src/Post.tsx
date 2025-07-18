import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Header from './components/Header';
import Footer from './components/Footer';
import { Helmet } from 'react-helmet-async';
import matter from 'gray-matter';
import remarkGfm from 'remark-gfm';

const Post: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<{ content: string; data: { [key: string]: any } } | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/content/blog/article/${slug}.md`);
        const text = await res.text();
        const { content, data } = matter(text);
        setPost({ content, data });
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
        <title>{post.data.title} - Himawari Project</title>
        <meta name="description" content={`Blog post about ${post.data.title}`} />
      </Helmet>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <article className="prose lg:prose-xl">
          <h1 className="text-4xl font-bold mb-2">{post.data.title}</h1>
          <p className="text-gray-600 mb-8">{new Date(post.data.date).toLocaleDateString()}</p>
           <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </article>
      </div>
      <Footer />
    </>
  );
};

export default Post;