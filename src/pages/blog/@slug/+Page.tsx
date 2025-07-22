/* eslint-disable @typescript-eslint/no-explicit-any */
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { FaXTwitter } from "react-icons/fa6";
import HatenaIcon from "../../../components/HatenaIcon";
import matter from "gray-matter";
import { generateHash } from "../../../utils/hash";
import type { PageContext } from "vike/types";

// 型定義を明示的に整理
interface BlogMetadata {
  title: string;
  date: string;
  categories?: string[];
  tags?: string[];
  coverImage?: string;
}

interface Post {
  hash: string;
  markdown: string;
  metadata: BlogMetadata;
}

const modules = import.meta.glob("../../../content/blog/article/*.md", {
  as: "raw",
});

// Markdownから全記事を読み込み、ハッシュマップに格納
async function getAllPosts(): Promise<Record<string, Post>> {
  const posts: Record<string, Post> = {};
  for (const [_, loader] of Object.entries(modules)) {
    const raw = await loader();
    const { content, data } = matter(raw);
    const hash = await generateHash(raw);
    posts[hash] = { hash, markdown: content, metadata: data as BlogMetadata };
  }
  return posts;
}

// コンポーネント本体
export default function Page({ post }: { post: Post }) {
  if (!post) return <div>記事が見つかりません</div>;
  const postUrl = typeof window !== "undefined" ? window.location.href : "";
  const { title, date, tags, coverImage } = post.metadata;

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
                {post.markdown}
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

// Markdownの表示カスタマイズ
const markdownComponents = {
  h1: (props: any) => (
    <h1 className="text-3xl font-bold mt-8 mb-4 underline decoration-slate-300" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-2xl font-bold mt-6 mb-3 underline decoration-slate-300" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="text-xl font-bold mt-4 mb-2 underline decoration-slate-300" {...props} />
  ),
  h4: (props: any) => <h4 className="text-xl mt-4 mb-2" {...props} />,
  p: (props: any) => <p className="text-base leading-relaxed mb-4" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-6 mb-4" {...props} />,
  li: (props: any) => <li className="mb-2 text-base leading-relaxed list-disc" {...props} />,
  a: (props: any) => (
    <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
  ),
};

// Vike 用のデータ取得関数
Page.getPageProps = async ({ routeParams }: PageContext<{ slug: string }>) => {
  const posts = await getAllPosts();
  const post = posts[routeParams.slug];
  if (!post) {
    throw new Error(`記事が見つかりません (slug: ${routeParams.slug})`);
  }
  return { pageProps: { post } };
};

// SSG用のエントリ定義
export const prerender = {
  entries: async () => {
    const posts = await getAllPosts();
    return Object.keys(posts).map((hash) => `/blog/${hash}`);
  },
};
