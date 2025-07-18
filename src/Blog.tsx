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
  coverImage?: string; // coverImageプロパティを追加
}

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<PostInfo[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/content/blog/index.json`);
        const postsData: PostInfo[] = await res.json();
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
        <h1 className="text-4xl font-bold mb-12 text-gray-800">ブログ</h1>
        {/* ▼▼▼ ここからレイアウトを変更 ▼▼▼ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link 
              key={post.slug} 
              to={`/blog/${post.slug}`} 
              className="group block bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              {/* カバー画像の表示 */}
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.coverImage || '/default-cover.jpg'} // デフォルト画像も指定可能
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              
              <div className="p-6">
                {/* 日付 */}
                <p className="text-gray-500 text-sm mb-2">
                  {new Date(post.date).toLocaleDateString()}
                </p>
                {/* タイトル */}
                <h2 className="text-xl font-bold text-gray-800 group-hover:text-orange-500 transition-colors duration-300">
                  {post.title}
                </h2>
                {/* タグ */}
                <div className="mt-4">
                  {post.tags?.map((tag: string) => (
                    <span key={tag} className="inline-block bg-orange-100 text-orange-800 rounded-full px-3 py-1 text-xs font-semibold mr-2 mb-2">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
        {/* ▲▲▲ ここまで ▲▲▲ */}
      </div>
      <Footer />
    </>
  );
};

export default Blog;