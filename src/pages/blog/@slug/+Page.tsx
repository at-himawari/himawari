/* eslint-disable @typescript-eslint/no-unused-vars */
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { FaXTwitter } from "react-icons/fa6";
import HatenaIcon from "../../../components/HatenaIcon";

interface PostPageProps {
  title: string;
  date: string;
  content: string;
  coverImage?: string;
  tags?: string[];
}

export function meta(pageProps: PostPageProps) {
    const metaDescription = pageProps.content.substring(0, 120) + '...';
    const absoluteCoverImageUrl = pageProps.coverImage
        ? new URL(pageProps.coverImage, "https://at-himawari.com").href
        : "https://at-himawari.com/avatar.png";

    return {
        title: `${pageProps.title} - Himawari Project`,
        description: metaDescription,
        coverImage: absoluteCoverImageUrl,
    };
}

export default function Page(props: PostPageProps) {
  const { title, date, content, coverImage, tags } = props;
  const postUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <>
      <Header />
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 relative">
          <div className="absolute top-32 -left-4 hidden lg:block">
            <div className="sticky top-32 flex flex-col items-center space-y-4">
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(title)}`}
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
          <article className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-10">
            {coverImage && (
              <img
                src={coverImage}
                alt={title}
                className="w-full h-auto rounded-lg mb-6"
              />
            )}
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                {title}
              </h1>
              <p className="text-gray-500">
                {new Date(date).toLocaleDateString()}
              </p>
              <div className="mt-4 flex justify-center flex-wrap gap-2">
                {tags?.map((tag) => (
                  <span
                    key={tag}
                    className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="prose lg:prose-xl max-w-none">
            <ReactMarkdown
              rehypePlugins={[rehypeKatex]}
              remarkPlugins={[remarkGfm, remarkMath]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1
                    className="text-3xl font-bold mt-8 mb-4 underline decoration-slate-300"
                    {...props}
                  />
                ),
                h2: ({ node, ...props }) => (
                  <h2
                    className="text-2xl font-bold mt-6 mb-3 underline decoration-slate-300"
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3
                    className="text-xl font-bold mt-4 mb-2 underline decoration-slate-300"
                    {...props}
                  />
                ),
                h4: ({ node, ...props }) => (
                  <h4 className="text-xl mt-4 mb-2" {...props} />
                ),
                // 本文の段落
                p: ({ node, ...props }) => (
                  <p className="text-base leading-relaxed mb-4" {...props} />
                ),
                // Markdownのリスト (数字リスト)
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal pl-6 mb-4" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li
                    className="mb-2 text-base leading-relaxed list-disc"
                    {...props}
                  />
                ),
                // Markdown内のリンク
                a: ({ node, ...props }) => (
                  <a
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
            </div>
          </article>
        </div>
      </div>
      <Footer />
    </>
  );
}