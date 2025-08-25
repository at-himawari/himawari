/**
 * Test Article Integration Tests
 *
 * Tests the actual test article we created to ensure it renders correctly
 */

import { render, screen } from "@testing-library/react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { markdownComponents } from "../components/MarkdownComponents";
import { sanitizeConfig } from "../utils/sanitizeConfig";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

describe("Test Article Integration", () => {
  let testArticleContent: string;

  beforeAll(() => {
    // Read the test article we created
    const filePath = path.join(
      process.cwd(),
      "src",
      "content",
      "blog",
      "article",
      "test-html-markdown-mixed.md"
    );
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { content } = matter(fileContent);
    testArticleContent = content;
  });

  const renderMarkdown = (content: string) => {
    return render(
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeRaw,
          rehypeKatex,
          [rehypeSanitize, sanitizeConfig],
        ]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    );
  };

  test("should render the test article without errors", () => {
    expect(() => renderMarkdown(testArticleContent)).not.toThrow();
  });

  test("should render main headings from test article", () => {
    renderMarkdown(testArticleContent);

    expect(screen.getByText("HTML + Markdown 混在テスト")).toBeInTheDocument();
    expect(screen.getByText("基本的な HTML タグのテスト")).toBeInTheDocument();
    expect(screen.getByText("Markdown との混在")).toBeInTheDocument();
  });

  test("should render HTML content within the article", () => {
    renderMarkdown(testArticleContent);

    // Check for HTML div content
    expect(
      screen.getByText("これは HTML div 要素内のコンテンツです。")
    ).toBeInTheDocument();

    // Check for span content
    expect(screen.getByText("赤い太字のスパン")).toBeInTheDocument();
  });

  test("should render mixed HTML and Markdown lists", () => {
    renderMarkdown(testArticleContent);

    expect(screen.getByText("最初のアイテム")).toBeInTheDocument();
    expect(screen.getByText("最後のアイテム")).toBeInTheDocument();
  });

  test("should render table content with HTML elements", () => {
    renderMarkdown(testArticleContent);

    expect(screen.getByText("列 1")).toBeInTheDocument();
    expect(screen.getByText("列 2")).toBeInTheDocument();
    expect(screen.getByText("列 3")).toBeInTheDocument();
    expect(screen.getByText("緑色のデータ")).toBeInTheDocument();
  });

  test("should render responsive grid content", () => {
    renderMarkdown(testArticleContent);

    expect(screen.getByText("カード1")).toBeInTheDocument();
    expect(screen.getByText("カード2")).toBeInTheDocument();
    expect(screen.getByText("カード3")).toBeInTheDocument();
  });

  test("should render form elements section", () => {
    renderMarkdown(testArticleContent);

    // フォーム要素はサニタイズされるため、セクションタイトルの存在を確認
    expect(screen.getByText("フォーム要素のテスト")).toBeInTheDocument();
  });

  test("should render media elements section", () => {
    renderMarkdown(testArticleContent);

    // メディア要素のセクションタイトルを確認
    expect(screen.getByText("メディア要素のテスト")).toBeInTheDocument();
    expect(screen.getByText("動画埋め込み")).toBeInTheDocument();
    expect(screen.getByText("音声埋め込み")).toBeInTheDocument();
  });

  test("should render mathematical equations", () => {
    renderMarkdown(testArticleContent);

    expect(
      screen.getByText("アインシュタインの質量エネルギー等価性:")
    ).toBeInTheDocument();
    expect(
      screen.getByText("この式は物理学の基本的な関係式です。")
    ).toBeInTheDocument();
  });

  test("should render code blocks", () => {
    renderMarkdown(testArticleContent);

    expect(screen.getByText("ターミナル風のスタイル:")).toBeInTheDocument();
  });

  test("should render blockquotes", () => {
    renderMarkdown(testArticleContent);

    expect(
      screen.getByText(/これは HTML blockquote 要素です/)
    ).toBeInTheDocument();
  });

  test("should render summary section", () => {
    renderMarkdown(testArticleContent);

    expect(screen.getByText("まとめ")).toBeInTheDocument();
    expect(
      screen.getByText(
        /この記事では様々な HTML タグと Markdown の組み合わせをテストしました/
      )
    ).toBeInTheDocument();
  });

  test("should not contain any script tags (security)", () => {
    renderMarkdown(testArticleContent);

    // Ensure no script tags are present in the rendered content
    expect(document.querySelector("script")).not.toBeInTheDocument();
  });

  test("should preserve important HTML attributes", () => {
    renderMarkdown(testArticleContent);

    // Check that images have proper attributes
    const images = document.querySelectorAll("img");
    expect(images.length).toBeGreaterThan(0);

    const testImage = Array.from(images).find(
      (img) => img.getAttribute("alt") === "テスト画像"
    );
    expect(testImage).toBeTruthy();
    if (testImage) {
      expect(testImage).toHaveAttribute(
        "src",
        "https://via.placeholder.com/300x200"
      );
    }
  });
});
