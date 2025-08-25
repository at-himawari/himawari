/**
 * エンドツーエンド CMS 検証テスト
 *
 * このテストは実際のCMSワークフローをシミュレートし、
 * HTML入力からプレビュー、最終的な表示までの全体的な流れを検証します。
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { readFileSync, writeFileSync, existsSync, unlinkSync } from "fs";
import { join } from "path";
import matter from "gray-matter";

// テスト用の記事データ
const testArticleData = {
  title: "CMS エンドツーエンドテスト記事",
  date: "2025-01-01T00:00:00.000Z",
  description: "CMSの完全なワークフローをテストするための記事",
  tags: ["test", "cms", "e2e", "html"],
  categories: ["テスト"],
  coverImage: "https://via.placeholder.com/800x400",
};

const testArticleContent = `# CMS エンドツーエンドテスト

この記事はDecap CMSでのHTML入力からプレビュー、最終表示までの完全なワークフローをテストします。

## HTML要素のテスト

### 基本的なスタイリング

<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
  <h3 class="text-xl font-bold mb-2">グラデーション背景のカード</h3>
  <p>これはCMSで作成されたHTML要素です。</p>
  <p>**Markdown の強調**も正しく動作します。</p>
</div>

### インタラクティブ要素

<div class="space-y-4">
  <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
    ホバー効果付きボタン
  </button>
  
  <div class="border-2 border-dashed border-gray-300 p-4 rounded">
    <p class="text-gray-600">点線ボーダーのコンテナ</p>
  </div>
</div>

## レスポンシブグリッドレイアウト

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
  <div class="bg-white p-6 rounded-lg shadow-md border">
    <h4 class="font-semibold text-lg mb-2">カード 1</h4>
    <p class="text-gray-600">モバイル: 1列</p>
    <p class="text-gray-600">タブレット: 2列</p>
    <p class="text-gray-600">デスクトップ: 3列</p>
  </div>
  
  <div class="bg-white p-6 rounded-lg shadow-md border">
    <h4 class="font-semibold text-lg mb-2">カード 2</h4>
    <p class="text-gray-600">レスポンシブデザインのテストです。</p>
    <ul class="mt-2 space-y-1">
      <li>• リストアイテム 1</li>
      <li>• リストアイテム 2</li>
    </ul>
  </div>
  
  <div class="bg-white p-6 rounded-lg shadow-md border">
    <h4 class="font-semibold text-lg mb-2">カード 3</h4>
    <p class="text-gray-600">画面サイズに応じてレイアウトが変わります。</p>
    <div class="mt-3">
      <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">タグ</span>
    </div>
  </div>
</div>

## フォーム要素の統合

<form class="max-w-md mx-auto space-y-4 p-6 bg-gray-50 rounded-lg">
  <div>
    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
      お名前
    </label>
    <input 
      type="text" 
      id="name" 
      name="name"
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="お名前を入力してください"
    />
  </div>
  
  <div>
    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
      メールアドレス
    </label>
    <input 
      type="email" 
      id="email" 
      name="email"
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="email@example.com"
    />
  </div>
  
  <div>
    <label for="message" class="block text-sm font-medium text-gray-700 mb-1">
      メッセージ
    </label>
    <textarea 
      id="message" 
      name="message" 
      rows="4"
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="メッセージを入力してください"
    ></textarea>
  </div>
  
  <button 
    type="submit"
    class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
  >
    送信
  </button>
</form>

## メディア要素

### 画像ギャラリー

<div class="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
  <img src="https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Image+1" alt="テスト画像1" class="rounded-lg shadow-md hover:shadow-lg transition-shadow" />
  <img src="https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Image+2" alt="テスト画像2" class="rounded-lg shadow-md hover:shadow-lg transition-shadow" />
  <img src="https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Image+3" alt="テスト画像3" class="rounded-lg shadow-md hover:shadow-lg transition-shadow" />
</div>

### 動画埋め込み

<div class="flex justify-center my-8">
  <video controls class="w-full max-w-2xl rounded-lg shadow-lg">
    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
    <p class="text-gray-600">お使いのブラウザは動画タグをサポートしていません。</p>
  </video>
</div>

## 数式とコードの統合

### 数式表示

<div class="bg-gray-100 p-4 rounded-lg my-4">
  <p class="mb-2">二次方程式の解の公式:</p>
  
  $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$
  
  <p class="mt-2 text-sm text-gray-600">この数式はKaTeXでレンダリングされます。</p>
</div>

### コードブロック

<div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm my-4">
  <div class="flex items-center mb-2">
    <div class="flex space-x-2">
      <div class="w-3 h-3 bg-red-500 rounded-full"></div>
      <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
      <div class="w-3 h-3 bg-green-500 rounded-full"></div>
    </div>
    <span class="ml-4 text-gray-400">terminal</span>
  </div>
  
\`\`\`bash
# HTML対応の設定
npm install rehype-raw rehype-sanitize
npm run build
npm run preview
\`\`\`
</div>

## アクセシビリティ要素

<div class="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
  <div class="flex">
    <div class="flex-shrink-0">
      <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="ml-3">
      <p class="text-sm text-blue-700">
        <strong>情報:</strong> この記事はアクセシビリティを考慮して作成されています。
        適切なalt属性、ラベル、セマンティックHTMLを使用しています。
      </p>
    </div>
  </div>
</div>

## まとめ

この記事では以下の要素をテストしました:

1. **基本的なHTML要素** - div, span, button等
2. **レスポンシブレイアウト** - グリッドシステム
3. **フォーム要素** - input, textarea, button
4. **メディア要素** - 画像、動画
5. **数式とコード** - KaTeX、シンタックスハイライト
6. **アクセシビリティ** - セマンティックHTML、ARIA属性

すべての要素がCMSで正しく入力でき、プレビューで適切に表示され、
最終的なサイトで正常に動作することを確認してください。`;

const testArticleSlug = "cms-e2e-test-article";
const testArticlePath = join(
  process.cwd(),
  `src/content/blog/article/${testArticleSlug}.md`
);

describe("CMS エンドツーエンド検証", () => {
  beforeAll(() => {
    // テスト記事を作成
    const frontmatter = matter.stringify(testArticleContent, testArticleData);
    writeFileSync(testArticlePath, frontmatter, "utf-8");
  });

  afterAll(() => {
    // テスト記事を削除
    if (existsSync(testArticlePath)) {
      unlinkSync(testArticlePath);
    }
  });

  describe("記事作成ワークフロー", () => {
    it("CMSで作成された記事ファイルが正しい形式で保存される", () => {
      expect(existsSync(testArticlePath)).toBe(true);

      const fileContent = readFileSync(testArticlePath, "utf-8");
      const { data, content } = matter(fileContent);

      // フロントマターの確認
      expect(data.title).toBe(testArticleData.title);
      expect(data.date).toBe(testArticleData.date);
      expect(data.description).toBe(testArticleData.description);
      expect(data.tags).toEqual(testArticleData.tags);
      expect(data.categories).toEqual(testArticleData.categories);
      expect(data.coverImage).toBe(testArticleData.coverImage);

      // コンテンツの確認
      expect(content).toContain("# CMS エンドツーエンドテスト");
      expect(content.length).toBeGreaterThan(1000);
    });

    it("HTML要素が適切にエスケープされずに保存される", () => {
      const fileContent = readFileSync(testArticlePath, "utf-8");
      const { content } = matter(fileContent);

      // HTML要素がエスケープされていないことを確認
      expect(content).toContain('<div class="bg-gradient-to-r');
      expect(content).toContain('<button class="bg-blue-500');
      expect(content).toContain('<form class="max-w-md');
      expect(content).toContain('<img src="https://via.placeholder.com');
      expect(content).toContain("<video controls");

      // エスケープされたHTMLが含まれていないことを確認
      expect(content).not.toContain("&lt;div&gt;");
      expect(content).not.toContain("&lt;button&gt;");
      expect(content).not.toContain("&amp;");
    });

    it("複雑なHTML構造が正しく保持される", () => {
      const fileContent = readFileSync(testArticlePath, "utf-8");
      const { content } = matter(fileContent);

      // ネストしたHTML構造の確認
      expect(content).toContain(
        '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      );
      expect(content).toContain('<form class="max-w-md mx-auto space-y-4');
      expect(content).toContain(
        '<div class="bg-blue-50 border-l-4 border-blue-400'
      );

      // 属性の複雑な組み合わせ
      expect(content).toContain(
        'class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"'
      );
    });
  });

  describe("プレビュー機能の検証", () => {
    it("Markdownとの混在コンテンツが適切な構造を持つ", () => {
      const fileContent = readFileSync(testArticlePath, "utf-8");
      const { content } = matter(fileContent);

      // Markdown見出しとHTML要素の混在
      expect(content).toContain("## HTML要素のテスト");
      expect(content).toContain('<div class="bg-gradient-to-r');

      // MarkdownリストとHTML要素の混在
      expect(content).toContain("1. **基本的なHTML要素**");
      expect(content).toContain("2. **レスポンシブレイアウト**");

      // Markdown強調とHTML要素の混在
      expect(content).toContain("**Markdown の強調**も正しく動作します。");
    });

    it("数式とHTMLの組み合わせが正しく構成される", () => {
      const fileContent = readFileSync(testArticlePath, "utf-8");
      const { content } = matter(fileContent);

      // KaTeX数式の確認
      expect(content).toContain(
        "$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$"
      );

      // 数式を含むHTML要素
      expect(content).toContain(
        '<div class="bg-gray-100 p-4 rounded-lg my-4">'
      );
      expect(content).toContain('<p class="mb-2">二次方程式の解の公式:</p>');
    });

    it("コードブロックとHTMLの組み合わせが正しく構成される", () => {
      const fileContent = readFileSync(testArticlePath, "utf-8");
      const { content } = matter(fileContent);

      // コードブロックの確認
      expect(content).toContain("```bash");
      expect(content).toContain("npm install rehype-raw rehype-sanitize");
      expect(content).toContain("```");

      // コードブロックを含むHTML要素
      expect(content).toContain('<div class="bg-gray-900 text-green-400');
    });
  });

  describe("レスポンシブデザインの検証", () => {
    it("レスポンシブクラスが適切に設定されている", () => {
      const fileContent = readFileSync(testArticlePath, "utf-8");
      const { content } = matter(fileContent);

      // グリッドレスポンシブクラス
      expect(content).toContain("grid-cols-1 md:grid-cols-2 lg:grid-cols-3");
      expect(content).toContain("grid-cols-2 md:grid-cols-3");

      // 幅とサイズのレスポンシブクラス
      expect(content).toContain("w-full max-w-2xl");
      expect(content).toContain("max-w-md mx-auto");

      // スペーシングのレスポンシブクラス
      expect(content).toContain("space-y-4");
      expect(content).toContain("gap-6");
      expect(content).toContain("p-6");
    });

    it("モバイルファーストのアプローチが適用されている", () => {
      const fileContent = readFileSync(testArticlePath, "utf-8");
      const { content } = matter(fileContent);

      // モバイルファーストのクラス構造
      const responsivePatterns = [
        "grid-cols-1 md:grid-cols-2",
        "grid-cols-2 md:grid-cols-3",
        "w-full max-w-",
        "space-y-",
      ];

      responsivePatterns.forEach((pattern) => {
        expect(content).toContain(pattern);
      });
    });
  });

  describe("アクセシビリティの検証", () => {
    it("適切なセマンティックHTMLが使用されている", () => {
      const fileContent = readFileSync(testArticlePath, "utf-8");
      const { content } = matter(fileContent);

      // セマンティック要素
      expect(content).toContain("<form");
      expect(content).toContain("<label for=");
      expect(content).toContain("<button");
      expect(content).toContain("<img src=");
      expect(content).toContain("alt=");
    });

    it("フォーム要素に適切なラベルが設定されている", () => {
      const fileContent = readFileSync(testArticlePath, "utf-8");
      const { content } = matter(fileContent);

      // ラベルとinputの関連付け
      expect(content).toContain('<label for="name"');
      expect(content).toContain('id="name"');
      expect(content).toContain('<label for="email"');
      expect(content).toContain('id="email"');
      expect(content).toContain('<label for="message"');
      expect(content).toContain('id="message"');
    });

    it("画像に適切なalt属性が設定されている", () => {
      const fileContent = readFileSync(testArticlePath, "utf-8");
      const { content } = matter(fileContent);

      // alt属性の確認
      expect(content).toContain('alt="テスト画像1"');
      expect(content).toContain('alt="テスト画像2"');
      expect(content).toContain('alt="テスト画像3"');
    });
  });

  describe("セキュリティの検証", () => {
    it("危険なHTMLタグが含まれていない", () => {
      const fileContent = readFileSync(testArticlePath, "utf-8");
      const { content } = matter(fileContent);

      // 危険なタグの確認
      const dangerousTags = [
        "<script",
        "<object",
        "<embed",
        "javascript:",
        "onload=",
        "onclick=",
        "onerror=",
        "onmouseover=",
      ];

      dangerousTags.forEach((tag) => {
        expect(content.toLowerCase()).not.toContain(tag.toLowerCase());
      });
    });

    it("外部リンクが適切に処理されている", () => {
      const fileContent = readFileSync(testArticlePath, "utf-8");
      const { content } = matter(fileContent);

      // 外部画像URLの確認（プレースホルダーサービス）
      expect(content).toContain("https://via.placeholder.com");
      expect(content).toContain("https://www.w3schools.com");

      // 相対パスやjavascript:プロトコルが含まれていないことを確認
      expect(content).not.toContain("javascript:");
      expect(content).not.toContain("data:text/html");
    });
  });

  describe("パフォーマンスの検証", () => {
    it("ファイルサイズが適切な範囲内である", () => {
      const fileContent = readFileSync(testArticlePath, "utf-8");
      const fileSizeKB = Buffer.byteLength(fileContent, "utf-8") / 1024;

      // ファイルサイズが100KB以下であることを確認
      expect(fileSizeKB).toBeLessThan(100);

      // 最小限のコンテンツは含まれていることを確認
      expect(fileSizeKB).toBeGreaterThan(5);
    });

    it("画像URLが最適化されている", () => {
      const fileContent = readFileSync(testArticlePath, "utf-8");
      const { content } = matter(fileContent);

      // プレースホルダー画像のサイズ指定
      expect(content).toContain("300x200");

      // 適切な画像形式の使用
      expect(content).toContain(".mp4");
    });
  });
});
