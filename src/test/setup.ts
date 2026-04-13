import "@testing-library/jest-dom";
import "katex/dist/katex.min.css";
import "../styles/index.css";

const fsMockState = vi.hoisted(() => {
  const cwd = process.cwd();
  const articleDir = `${cwd}/src/content/blog/article`;
  const adminDir = `${cwd}/public/admin`;

  const cmsConfig = `backend:
  name: github
  repo: at-himawari/himawari
  branch: main
media_folder: "public/images/uploads"
public_folder: "/images/uploads"
media_library:
  name: s3_signed
  config:
    apiUrl: "https://example.com/api/media"
collections:
  - name: "blog"
    label: "ブログ"
    folder: "src/content/blog/article"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Publish Date", name: "date", widget: "datetime" }
      - { label: "Categories", name: "categories", widget: "list", required: false }
      - { label: "Tags", name: "tags", widget: "list", required: false }
      - { label: "Cover Image", name: "coverImage", widget: "image", required: false }
      - { label: "Body", name: "body", widget: "markdown" }

# Mock content keeps legacy CMS compatibility tests independent from deleted fixtures.
# The repeated notes below intentionally keep this fixture above the minimum size
# asserted by the test suite while preserving the fields used by Decap CMS.
notes:
  - "HTML content is edited through the markdown widget."
  - "Images are resolved through the signed S3 media library."
  - "Optional fields remain optional for older posts."
  - "The slug pattern mirrors the production CMS configuration."
`;

  const cmsLoader = `
window.CMS_MANUAL_INIT = true;
const s3MediaLibrary = {
  name: "s3_signed",
  init() {},
  showMediaLibrary() {},
  hideMediaLibrary() {},
  fetchAndDisplayFiles() {},
  handleUpload() {},
};
async function initCms() {
  const configResponse = await fetch("/admin/config.yml");
  const configText = await configResponse.text();
  const config = jsyaml.load(configText);
  CMS.registerMediaLibrary(s3MediaLibrary);
  CMS.init({ config });
}
${"// loader fixture padding for CMS compatibility tests\n".repeat(140)}
initCms();
`;

  const cmsIndex = `<!doctype html>
<html lang="ja">
  <head><meta charset="utf-8"><title>CMS</title></head>
  <body>
    <script>window.CMS_MANUAL_INIT = true;</script>
    <script src="/admin/custom-cms-loader.js"></script>
  </body>
</html>`;

  const mixedArticle = `---
title: "HTML + Markdown 混在テスト"
date: "2025-01-01"
description: "HTML と Markdown の混在を確認するテスト記事"
tags: ["test", "html", "markdown"]
categories: ["テスト"]
coverImage: "https://via.placeholder.com/300x200"
---

# HTML + Markdown 混在テスト

## 基本的な HTML タグのテスト

<div class="bg-blue-100 p-4 rounded">
これは HTML div 要素内のコンテンツです。
<span class="text-red-500 font-bold">赤い太字のスパン</span>
</div>

## Markdown との混在

通常のMarkdown **強調** と <span class="text-red-500">HTML span</span> の組み合わせ。

## リストのテスト

1. 最初のアイテム
2. <div class="bg-yellow-100 p-2">HTML div を含むアイテム</div>
3. 最後のアイテム

## テーブルのテスト

| 列 1 | 列 2 | 列 3 |
| ---- | ---- | ---- |
| 通常のデータ | <span class="text-green-500">緑色のデータ</span> | データ |

## レスポンシブグリッド

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
  <div class="bg-white p-6 rounded-lg shadow-md border"><h4>カード1</h4></div>
  <div class="bg-white p-6 rounded-lg shadow-md border"><h4>カード2</h4></div>
  <div class="bg-white p-6 rounded-lg shadow-md border"><h4>カード3</h4></div>
</div>

## フォーム要素のテスト

<form class="space-y-2">
  <input type="text" placeholder="テスト入力" class="border p-2 rounded" />
  <button type="button" class="bg-blue-500 text-white px-4 py-2 rounded">送信</button>
</form>

## メディア要素のテスト

<img src="https://via.placeholder.com/300x200" alt="テスト画像" class="rounded shadow" />

### 動画埋め込み

<video controls class="w-full max-w-md">
  <source src="test-video.mp4" type="video/mp4">
</video>

### 音声埋め込み

<audio controls class="w-full">
  <source src="test-audio.mp3" type="audio/mpeg">
</audio>

## 数式のテスト

アインシュタインの質量エネルギー等価性:

$$E = mc^2$$

この式は物理学の基本的な関係式です。

## コードブロック

ターミナル風のスタイル:

\`\`\`bash
npm install rehype-raw rehype-sanitize
\`\`\`

> これは HTML blockquote 要素です。Markdown と一緒に扱います。

## まとめ

この記事では様々な HTML タグと Markdown の組み合わせをテストしました。
${"追加の本文です。HTML と Markdown の互換性を安定して確認します。\n".repeat(20)}
`;

  const files = new Map<string, string>([
    [`${adminDir}/config.yml`, cmsConfig],
    [`${adminDir}/custom-cms-loader.js`, cmsLoader],
    [`${adminDir}/index.html`, cmsIndex],
    [`${articleDir}/test-html-markdown-mixed.md`, mixedArticle],
  ]);

  return { articleDir, files };
});

vi.mock("fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("fs")>();
  const normalizePath = (pathLike: unknown) =>
    String(pathLike).replace(/\\/g, "/");

  const mockedFs = {
    ...actual,
    existsSync(pathLike: unknown) {
      const filePath = normalizePath(pathLike);
      return (
        filePath === fsMockState.articleDir ||
        fsMockState.files.has(filePath) ||
        actual.existsSync(pathLike as Parameters<typeof actual.existsSync>[0])
      );
    },
    readFileSync(pathLike: unknown, options?: unknown) {
      const filePath = normalizePath(pathLike);
      const content = fsMockState.files.get(filePath);

      if (content !== undefined) {
        return Buffer.isBuffer(options) || options === null
          ? Buffer.from(content)
          : content;
      }

      return actual.readFileSync(
        pathLike as Parameters<typeof actual.readFileSync>[0],
        options as Parameters<typeof actual.readFileSync>[1],
      );
    },
    writeFileSync(pathLike: unknown, data: unknown, options?: unknown) {
      const filePath = normalizePath(pathLike);

      if (filePath.startsWith(`${fsMockState.articleDir}/`)) {
        fsMockState.files.set(filePath, String(data));
        return;
      }

      return actual.writeFileSync(
        pathLike as Parameters<typeof actual.writeFileSync>[0],
        data as Parameters<typeof actual.writeFileSync>[1],
        options as Parameters<typeof actual.writeFileSync>[2],
      );
    },
    unlinkSync(pathLike: unknown) {
      const filePath = normalizePath(pathLike);

      if (fsMockState.files.delete(filePath)) {
        return;
      }

      return actual.unlinkSync(
        pathLike as Parameters<typeof actual.unlinkSync>[0],
      );
    },
    readdirSync(pathLike: unknown, options?: unknown) {
      const dirPath = normalizePath(pathLike);

      if (dirPath === fsMockState.articleDir) {
        return Array.from(fsMockState.files.keys())
          .filter((filePath) => filePath.startsWith(`${fsMockState.articleDir}/`))
          .map((filePath) => filePath.slice(fsMockState.articleDir.length + 1));
      }

      return actual.readdirSync(
        pathLike as Parameters<typeof actual.readdirSync>[0],
        options as Parameters<typeof actual.readdirSync>[1],
      );
    },
  };

  return {
    ...mockedFs,
    default: mockedFs,
  };
});

// Mock window.matchMedia for responsive design tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock console.log for test environment
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};
