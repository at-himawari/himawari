"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { markdownComponents } from "../../../components/MarkdownComponents";
import { sanitizeConfig } from "../../../utils/sanitizeConfig";

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      rehypePlugins={[
        rehypeRaw,
        rehypeKatex,
        [rehypeSanitize, sanitizeConfig],
      ]}
      remarkPlugins={[remarkGfm, remarkMath]}
      components={markdownComponents}
    >
      {content}
    </ReactMarkdown>
  );
}
