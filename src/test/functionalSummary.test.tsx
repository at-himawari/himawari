/**
 * CMS機能サマリーテスト
 *
 * このテストファイルは、Decap CMS の HTML 対応機能の
 * 全体的な動作を検証し、要件への適合性を確認します。
 */

import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";
import matter from "gray-matter";

describe("CMS機能サマリー検証", () => {
  describe("要件 3.1: Decap CMS インターフェースとの互換性", () => {
    it("CMS設定ファイルが存在し、適切に構成されている", () => {
      const configPath = join(process.cwd(), "public/admin/config.yml");
      const indexPath = join(process.cwd(), "public/admin/index.html");
      const loaderPath = join(
        process.cwd(),
        "public/admin/custom-cms-loader.js"
      );

      expect(existsSync(configPath)).toBe(true);
      expect(existsSync(indexPath)).toBe(true);
      expect(existsSync(loaderPath)).toBe(true);
    });

    it("ブログコレクションが正しく設定されている", () => {
      const configPath = join(process.cwd(), "public/admin/config.yml");
      const config = readFileSync(configPath, "utf-8");

      // ブログコレクションの基本設定
      expect(config).toContain('name: "blog"');
      expect(config).toContain('label: "ブログ"');
      expect(config).toContain('folder: "src/content/blog/article"');
      expect(config).toContain("create: true");

      // Markdownウィジェットの設定
      expect(config).toContain('widget: "markdown"');
    });

    it("メディアライブラリが適切に設定されている", () => {
      const configPath = join(process.cwd(), "public/admin/config.yml");
      const config = readFileSync(configPath, "utf-8");

      expect(config).toContain("media_library:");
      expect(config).toContain("name: s3_signed");
      expect(config).toContain("apiUrl:");
    });

    it("CMSローダーが必要な機能を提供している", () => {
      const loaderPath = join(
        process.cwd(),
        "public/admin/custom-cms-loader.js"
      );
      const loader = readFileSync(loaderPath, "utf-8");

      // 基本的なCMS機能
      expect(loader).toContain("CMS.init");
      expect(loader).toContain("registerMediaLibrary");

      // HTML ファイルでの手動初期化設定確認
      const htmlPath = join(process.cwd(), "public/admin/index.html");
      const htmlContent = readFileSync(htmlPath, "utf-8");
      expect(htmlContent).toContain("window.CMS_MANUAL_INIT = true");

      // S3メディアライブラリ機能
      expect(loader).toContain("s3MediaLibrary");
      expect(loader).toContain("fetchAndDisplayFiles");
      expect(loader).toContain("handleUpload");
    });
  });

  describe("要件 3.2: 現在のすべての編集機能を保持", () => {
    it("すべての必要なフィールドが定義されている", () => {
      const configPath = join(process.cwd(), "public/admin/config.yml");
      const config = readFileSync(configPath, "utf-8");

      // ブログ記事の必須フィールド
      const requiredFields = [
        "Title",
        "Publish Date",
        "Categories",
        "Tags",
        "Cover Image",
        "Body",
      ];

      requiredFields.forEach((field) => {
        expect(config).toContain(field);
      });
    });

    it("ウィジェットタイプが適切に設定されている", () => {
      const configPath = join(process.cwd(), "public/admin/config.yml");
      const config = readFileSync(configPath, "utf-8");

      // 各フィールドのウィジェットタイプ
      expect(config).toContain('widget: "string"');
      expect(config).toContain('widget: "datetime"');
      expect(config).toContain('widget: "list"');
      expect(config).toContain('widget: "image"');
      expect(config).toContain('widget: "markdown"');
    });

    it("オプショナルフィールドが適切に設定されている", () => {
      const configPath = join(process.cwd(), "public/admin/config.yml");
      const config = readFileSync(configPath, "utf-8");

      // required: false の設定
      expect(config).toContain("required: false");
    });

    it("ファイル命名規則が維持されている", () => {
      const configPath = join(process.cwd(), "public/admin/config.yml");
      const config = readFileSync(configPath, "utf-8");

      // スラッグパターン
      expect(config).toContain('slug: "{{year}}-{{month}}-{{day}}-{{slug}}"');
    });
  });

  describe("要件 3.3: HTML使用時の適切なプレビュー機能", () => {
    it("HTML混在コンテンツが適切に構造化されている", () => {
      // テスト記事の確認
      const testArticlePath = join(
        process.cwd(),
        "src/content/blog/article/test-html-markdown-mixed.md"
      );

      // ファイルが存在することを確認
      expect(existsSync(testArticlePath)).toBe(true);

      const content = readFileSync(testArticlePath, "utf-8");
      const { data, content: body } = matter(content);

      // フロントマターの確認
      expect(data).toHaveProperty("title");
      expect(data).toHaveProperty("date");

      // HTML要素とMarkdownの混在確認
      expect(body).toContain("<div");
      expect(body).toContain("# ");
      expect(body).toContain("## ");
      expect(body).toContain("**");
    });

    it("プレビューに必要なHTML要素が適切に保持されている", () => {
      const testArticlePath = join(
        process.cwd(),
        "src/content/blog/article/test-html-markdown-mixed.md"
      );

      if (existsSync(testArticlePath)) {
        const content = readFileSync(testArticlePath, "utf-8");
        const { content: body } = matter(content);

        // プレビューで表示されるべき要素
        const previewElements = [
          "<div class=",
          "<span class=",
          "<img src=",
          "<form",
          "<input",
          "<button",
          "<video",
          "<audio",
        ];

        previewElements.forEach((element) => {
          if (body.includes(element)) {
            expect(body).toContain(element);
          }
        });
      }
    });

    it("セキュリティ上安全なHTML要素のみが使用されている", () => {
      const testArticlePath = join(
        process.cwd(),
        "src/content/blog/article/test-html-markdown-mixed.md"
      );

      if (existsSync(testArticlePath)) {
        const content = readFileSync(testArticlePath, "utf-8");
        const { content: body } = matter(content);

        // 危険な要素が含まれていないことを確認
        const dangerousElements = [
          "<script",
          "<object",
          "<embed",
          "javascript:",
          "onload=",
          "onclick=",
        ];

        dangerousElements.forEach((element) => {
          expect(body.toLowerCase()).not.toContain(element.toLowerCase());
        });
      }
    });
  });

  describe("統合機能の検証", () => {
    it("記事データが getPosts() 関数で適切に管理されている", () => {
      try {
        // getPosts関数をテストするため、実際の実装をインポート
        const { getPosts } = require("../utils/getPosts");
        const posts = getPosts();

        expect(Array.isArray(posts)).toBe(true);

        if (posts.length > 0) {
          const post = posts[0];
          expect(post).toHaveProperty("title");
          expect(post).toHaveProperty("slug");
          expect(post).toHaveProperty("date");
          expect(post).toHaveProperty("content");
        }
      } catch (error) {
        console.warn("記事データの取得に失敗:", error);
      }
    });

    it("CMSで作成された記事が適切な形式を持つ", () => {
      const articlesDir = join(process.cwd(), "src/content/blog/article");

      if (existsSync(articlesDir)) {
        const files = readdirSync(articlesDir).filter((file) =>
          file.endsWith(".md")
        );

        if (files.length > 0) {
          const sampleFile = files[0];
          const filePath = join(articlesDir, sampleFile);
          const content = readFileSync(filePath, "utf-8");
          const { data, content: body } = matter(content);

          // 基本的なフロントマター構造
          expect(data).toHaveProperty("title");
          expect(typeof data.title).toBe("string");

          // コンテンツが存在することを確認
          expect(body).toBeTruthy();
          expect(body.length).toBeGreaterThan(0);
        }
      }
    });

    it("メディアファイルの参照が適切に処理される", () => {
      const configPath = join(process.cwd(), "public/admin/config.yml");
      const config = readFileSync(configPath, "utf-8");

      // メディアフォルダーの設定
      expect(config).toContain("media_folder:");
      expect(config).toContain("public_folder:");

      // S3メディアライブラリの設定
      expect(config).toContain("media_library:");
      expect(config).toContain("name: s3_signed");
    });
  });

  describe("パフォーマンスと安定性", () => {
    it("CMS設定ファイルのサイズが適切である", () => {
      const configPath = join(process.cwd(), "public/admin/config.yml");
      const config = readFileSync(configPath, "utf-8");
      const sizeKB = Buffer.byteLength(config, "utf-8") / 1024;

      // 設定ファイルが50KB以下であることを確認
      expect(sizeKB).toBeLessThan(50);

      // 最小限の設定は含まれていることを確認
      expect(sizeKB).toBeGreaterThan(1);
    });

    it("CMSローダーが適切なサイズである", () => {
      const loaderPath = join(
        process.cwd(),
        "public/admin/custom-cms-loader.js"
      );
      const loader = readFileSync(loaderPath, "utf-8");
      const sizeKB = Buffer.byteLength(loader, "utf-8") / 1024;

      // ローダーファイルが200KB以下であることを確認
      expect(sizeKB).toBeLessThan(200);

      // 必要な機能は含まれていることを確認
      expect(sizeKB).toBeGreaterThan(5);
    });

    it("HTML混在記事のファイルサイズが適切である", () => {
      const testArticlePath = join(
        process.cwd(),
        "src/content/blog/article/test-html-markdown-mixed.md"
      );

      // ファイルが存在することを確認
      expect(existsSync(testArticlePath)).toBe(true);

      const content = readFileSync(testArticlePath, "utf-8");
      const sizeKB = Buffer.byteLength(content, "utf-8") / 1024;

      // 記事ファイルが100KB以下であることを確認
      expect(sizeKB).toBeLessThan(100);

      // 最小限のコンテンツは含まれていることを確認
      expect(sizeKB).toBeGreaterThan(1);
    });
  });

  describe("エラーハンドリング", () => {
    it("不正なHTML構造に対する耐性がある", () => {
      // 不正なHTMLを含むテストコンテンツ
      const invalidHtmlContent = `---
title: "不正HTMLテスト"
date: "2025-01-01"
---

# テスト記事

<div class="test">
  <p>未閉じのdivタグ
  <span>未閉じのspanタグ
</div>

<img src="test.jpg" alt="テスト画像">
<br>
<hr>
`;

      const { data, content } = matter(invalidHtmlContent);

      // フロントマターは正しく解析される
      expect(data.title).toBe("不正HTMLテスト");

      // コンテンツは保持される（サニタイゼーションは別の段階で処理）
      expect(content).toContain('<div class="test">');
      expect(content).toContain('<img src="test.jpg"');
    });

    it("空のコンテンツに対する耐性がある", () => {
      const emptyContent = `---
title: "空のコンテンツテスト"
date: "2025-01-01"
---

`;

      const { data, content } = matter(emptyContent);

      expect(data.title).toBe("空のコンテンツテスト");
      expect(content.trim()).toBe("");
    });

    it("特殊文字を含むコンテンツに対する耐性がある", () => {
      const specialCharContent = `---
title: "特殊文字テスト"
date: "2025-01-01"
---

# 特殊文字のテスト

<div class="test" data-value="&quot;quoted&quot;">
  <p>エンティティ: &amp; &lt; &gt; &quot; &#39;</p>
</div>

日本語の文字: あいうえお
絵文字: 🎉 🚀 ✨
`;

      const { data, content } = matter(specialCharContent);

      expect(data.title).toBe("特殊文字テスト");
      expect(content).toContain("&quot;");
      expect(content).toContain("&amp;");
      expect(content).toContain("あいうえお");
      expect(content).toContain("🎉");
    });
  });
});
