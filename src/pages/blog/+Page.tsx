import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { usePageContext } from "vike-react/usePageContext";
import { PageContextPost } from "../../types/pageContextPosts";
import { useState, useMemo } from "react";

export default function Page() {
  const pageContext = usePageContext() as { data: PageContextPost };
  // `posts` は content を含むようになる
  const posts = pageContext.data.posts;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    if (!posts) return [];
    const allCategories = posts.flatMap(post => post.categories || []);
    return [...new Set(allCategories)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    
    // 検索キーワードを小文字に変換
    const lowercasedQuery = searchQuery.toLowerCase();

    return posts.filter(post => {
      // タイトルと本文(content)の両方を検索対象にする
      const matchesSearch =
        post.title.toLowerCase().includes(lowercasedQuery) ||
        post.content.toLowerCase().includes(lowercasedQuery);

      const matchesCategory = selectedCategory ? post.categories?.includes(selectedCategory) : true;
      
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  if (!posts) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p>記事を読み込んでいます...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-left text-orange-600 title-ja">
          ブログ
        </h1>
        <h2 className="text-2xl font-bold mb-8 text-left text-gray-800 section-h2">
          Blog
        </h2>

        {/* 検索フォームとカテゴリフィルター */}
        <div className="mb-2 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="記事を検索..."
            className="border p-2 rounded-md w-full md:w-1/2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`py-1 px-3 rounded-full text-sm ${
                selectedCategory === null ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              すべて
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`py-1 px-3 rounded-full text-sm ${
                  selectedCategory === category ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={post.coverImage || "/himawari.png"}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <p className="text-gray-500 text-sm mb-2">
                  {new Date(post.date).toLocaleDateString()}
                </p>
                <h2 className="text-xl font-bold text-gray-800 group-hover:text-orange-500 transition-colors duration-300">
                  {post.title}
                </h2>
                <div className="mt-4">
                  {post.tags?.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-block bg-orange-100 text-orange-800 rounded-full px-3 py-1 text-xs font-semibold mr-2 mb-2"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}