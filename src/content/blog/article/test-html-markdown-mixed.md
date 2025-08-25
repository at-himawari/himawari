---
title: "HTML + Markdown 混在テスト記事"
date: "2025-01-01"
description: "HTML タグと Markdown の混在コンテンツをテストするための記事です。"
tags: ["test", "html", "markdown"]
---

# HTML + Markdown 混在テスト

この記事は HTML タグと Markdown の混在コンテンツをテストするためのものです。

## 基本的な HTML タグのテスト

### Div コンテナ

<div class="bg-blue-100 p-4 rounded-lg border">
  <p>これは HTML div 要素内のコンテンツです。</p>
  <p>**Markdown の強調**も正しく動作するはずです。</p>
</div>

### スパン要素

通常のテキストの中に <span class="text-red-500 font-bold">赤い太字のスパン</span> を含めることができます。

### 画像タグ

<img src="https://via.placeholder.com/300x200" alt="テスト画像" class="rounded-lg shadow-md" />

## Markdown との混在

### リストと HTML の組み合わせ

1. 最初のアイテム
2. <div class="bg-yellow-100 p-2 rounded">HTML div を含むアイテム</div>
3. 最後のアイテム

### テーブルと HTML

| 列 1     | 列 2                                             | 列 3                          |
| -------- | ------------------------------------------------ | ----------------------------- |
| データ 1 | <span class="text-green-600">緑色のデータ</span> | データ 3                      |
| データ 4 | データ 5                                         | <strong>太字のデータ</strong> |

## レスポンシブデザインのテスト

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div class="bg-gray-100 p-4 rounded">
    <h4>カード1</h4>
    <p>モバイルでは1列、タブレットでは2列、デスクトップでは3列で表示されます。</p>
  </div>
  <div class="bg-gray-100 p-4 rounded">
    <h4>カード2</h4>
    <p>レスポンシブグリッドのテストです。</p>
  </div>
  <div class="bg-gray-100 p-4 rounded">
    <h4>カード3</h4>
    <p>画面サイズに応じてレイアウトが変わります。</p>
  </div>
</div>

## フォーム要素のテスト

<form class="space-y-4">
  <div>
    <label for="test-input" class="block text-sm font-medium">テスト入力:</label>
    <input type="text" id="test-input" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="テキストを入力してください" />
  </div>
  <div>
    <label for="test-textarea" class="block text-sm font-medium">テキストエリア:</label>
    <textarea id="test-textarea" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="複数行のテキストを入力してください"></textarea>
  </div>
  <button type="button" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    送信ボタン
  </button>
</form>

## メディア要素のテスト

### 動画埋め込み

<video controls class="w-full max-w-md mx-auto">
  <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
  お使いのブラウザは動画タグをサポートしていません。
</video>

### 音声埋め込み

<audio controls class="w-full max-w-md mx-auto">
  <source src="https://www.w3schools.com/html/horse.ogg" type="audio/ogg">
  <source src="https://www.w3schools.com/html/horse.mp3" type="audio/mpeg">
  お使いのブラウザは音声タグをサポートしていません。
</audio>

## 数式との組み合わせ

HTML div 内での数式レンダリング:

<div class="bg-gray-50 p-4 rounded-lg">
  <p>アインシュタインの質量エネルギー等価性:</p>
  
  $E = mc^2$
  
  <p>この式は物理学の基本的な関係式です。</p>
</div>

## コードブロックとの組み合わせ

<div class="bg-black text-green-400 p-4 rounded-lg font-mono">
  <p>ターミナル風のスタイル:</p>
  
```bash
npm install react-markdown
npm install rehype-raw rehype-sanitize
```
</div>

## 引用との組み合わせ

<blockquote class="border-l-4 border-blue-500 pl-4 italic">
  > これは HTML blockquote 要素です。
  > 
  > **Markdown の強調**も含まれています。
</blockquote>

## まとめ

この記事では様々な HTML タグと Markdown の組み合わせをテストしました。すべての要素が適切にレンダリングされ、セキュリティが保たれていることを確認してください。
