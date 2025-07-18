import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { Helmet } from 'react-helmet-async';

interface PostInfo {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  categories: string[];
}

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<PostInfo[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/content/blog/index.json`);
        const postsData: PostInfo[] = await res.json();
        // 日付の降順でソート
        postsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setPosts(postsData);
      } catch (error) {
        console.error("Failed to fetch posts index:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <Helmet>
        <title>Blog - Himawari Project</title>
      </Helmet>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="block p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <p className="text-gray-600 text-sm">{new Date(post.date).toLocaleDateString()}</p>
              <h2 className="text-2xl font-bold text-orange-500 mt-1">{post.title}</h2>
              <div className="mt-3">
                {post.tags?.map((tag: string) => (
                  <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Blog;