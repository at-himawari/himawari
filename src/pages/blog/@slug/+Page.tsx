/* eslint-disable @typescript-eslint/no-explicit-any */
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { FaXTwitter } from "react-icons/fa6";
import  HatenaIcon from "../../../components/HatenaIcon";
import { PageContextPost } from "../../../types/pageContextPost";
import { usePageContext } from "vike-react/usePageContext";
import { markdownComponents } from "../../../components/MarkdownComponents";


// コンポーネント本体
export default function Page() {
  const pageContext = usePageContext() as { data: PageContextPost };
  const post = pageContext.data?.post || "読み込み中...";
  
  if (!post) return <div>記事が見つかりません</div>;
  const postUrl = typeof window !== "undefined" ? window.location.href : "";
  const { title, date, tags, coverImage, content } = post;

  return (
    <>
      <Header />
      <main className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 relative">
          <ShareButtons postUrl={postUrl} title={title} />
          <article className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-10">
            {coverImage && (
              <img
                src={coverImage}
                alt={title}
                className="w-full h-auto rounded-lg mb-6"
              />
            )}
            <header className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                {title}
              </h1>
              <p className="text-gray-500">
                {new Date(date).toLocaleDateString()}
              </p>
              <div className="mt-4 flex justify-center flex-wrap gap-2">
                {tags?.map((tag) => (
                  <Tag key={tag} tag={tag} />
                ))}
              </div>
            </header>
            <section className="prose lg:prose-xl max-w-none">
              <ReactMarkdown
                rehypePlugins={[rehypeKatex]}
                remarkPlugins={[remarkGfm, remarkMath]}
                components={markdownComponents}
              >
                {content}
              </ReactMarkdown>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}

// シェアボタンのコンポーネント
function ShareButtons({ postUrl, title }: { postUrl: string; title: string }) {
  return (
    <div className="absolute top-32 -left-4 hidden lg:block">
      <div className="sticky top-32 flex flex-col items-center space-y-4">
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
            postUrl
          )}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-blue-500 transition-colors p-2 rounded-full bg-white shadow"
          aria-label="Xでシェア"
        >
          <FaXTwitter size={20} />
        </a>
        <a
          href={`https://b.hatena.ne.jp/entry/${encodeURIComponent(postUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-blue-400 transition-colors p-2 rounded-full bg-white shadow"
          aria-label="はてなブックマークに追加"
        >
          <HatenaIcon size={20} />
        </a>
      </div>
    </div>
  );
}

// タグ表示のコンポーネント
function Tag({ tag }: { tag: string }) {
  return (
    <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
      #{tag}
    </span>
  );
}

