import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Header from './components/Header';
import Footer from './components/Footer';
import { Helmet } from 'react-helmet-async';
import remarkGfm from 'remark-gfm';

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
          {post.coverImage && <img src={post.coverImage} alt={post.title} className="mb-8 rounded-lg" />}
          <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
          <p className="text-gray-600 mb-8">{new Date(post.date).toLocaleDateString()}</p>
           <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </article>
      </div>
      <Footer />
    </>
  );
};

export default Post;