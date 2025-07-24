/* eslint-disable @typescript-eslint/no-unused-vars */
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ReactMarkdown from "react-markdown";
import { usePageContext } from "vike-react/usePageContext";
import { PageContext } from "../../types/pageContext";
import { markdownComponents } from "../../components/MarkdownComponents";

const PrivacyPolicy: React.FC = () => {
  const pageContext = usePageContext() as { data: PageContext };
  const content = pageContext.data?.content || "Loading...";
  return (
    <>
      <Header />
      <section id="privacy-policy" className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ReactMarkdown
            components={markdownComponents}
          >
            {content}
          </ReactMarkdown>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
