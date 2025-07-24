import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { usePageContext } from "vike-react/usePageContext";
import { PageContextPost } from "../../types/pageContextPosts";

export default function Page() {
  const pageContext = usePageContext() as { data: PageContextPost };
  const posts = pageContext.data.posts;

  // postsがない場合の表示を追加
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
        <h1 className="text-4xl font-bold mb-12 text-left text-gray-800">
          ブログ
        </h1>
        <h2 className="text-2xl font-bold mb-12 text-left text-gray-800">
          Blog
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
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
