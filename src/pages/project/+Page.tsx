/* eslint-disable @typescript-eslint/no-unused-vars */
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { usePageContext } from "vike-react/usePageContext";
import type { PageContext } from "../../types/pageContext";
import { markdownComponents } from "../../components/MarkdownComponents";

export default function Page() {
  const pageContext = usePageContext() as { data: PageContext };
  const content = pageContext.data?.content || "Loading...";

  return (
    <>
      <Header />
      <section id="project-policy" className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-100">
            <ReactMarkdown
              components={markdownComponents}
              rehypePlugins={[rehypeRaw]}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
