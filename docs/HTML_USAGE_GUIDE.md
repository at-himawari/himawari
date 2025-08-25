# HTML タグ使用ガイド

このドキュメントでは、Himawari ブログで Markdown コンテンツ内で HTML タグを使用する方法について説明します。

## 概要

Himawari ブログでは、Markdown コンテンツ内で HTML タグを使用して、より豊かで柔軟なコンテンツを作成できます。セキュリティを保ちながら、幅広い HTML タグとスタイリングオプションをサポートしています。

## 基本的な使用方法

### Markdown と HTML の混在

```markdown
# 通常の Markdown タイトル

これは通常の Markdown テキストです。

<div class="bg-blue-100 p-4 rounded-lg">
  <h3>HTMLコンテナ内のタイトル</h3>
  <p>このテキストはHTMLのdiv要素内にあります。</p>
</div>

**Markdown の強調**と<strong>HTML の強調</strong>を混在できます。
```

### 基本的なテキスト装飾

```html
<!-- 基本的なテキスト装飾 -->
<p>これは<strong>太字</strong>、<em>斜体</em>、<u>下線</u>のテキストです。</p>
<p><mark>ハイライト</mark>や<del>取り消し線</del>も使用できます。</p>
<p>上付き文字: E=mc<sup>2</sup>、下付き文字: H<sub>2</sub>O</p>
```

## サポートされている HTML タグ

### テキスト装飾タグ

| タグ       | 説明           | 例                                      |
| ---------- | -------------- | --------------------------------------- |
| `<strong>` | 太字           | `<strong>重要なテキスト</strong>`       |
| `<em>`     | 斜体           | `<em>強調されたテキスト</em>`           |
| `<u>`      | 下線           | `<u>下線付きテキスト</u>`               |
| `<mark>`   | ハイライト     | `<mark>ハイライトされたテキスト</mark>` |
| `<del>`    | 取り消し線     | `<del>削除されたテキスト</del>`         |
| `<ins>`    | 挿入テキスト   | `<ins>挿入されたテキスト</ins>`         |
| `<small>`  | 小さなテキスト | `<small>小さなテキスト</small>`         |
| `<sub>`    | 下付き文字     | `H<sub>2</sub>O`                        |
| `<sup>`    | 上付き文字     | `E=mc<sup>2</sup>`                      |

### 見出しタグ

```html
<h1>レベル1見出し</h1>
<h2>レベル2見出し</h2>
<h3>レベル3見出し</h3>
<h4>レベル4見出し</h4>
<h5>レベル5見出し</h5>
<h6>レベル6見出し</h6>
```

### リストタグ

```html
<!-- 順序なしリスト -->
<ul>
  <li>項目1</li>
  <li>項目2</li>
  <li>項目3</li>
</ul>

<!-- 順序付きリスト -->
<ol>
  <li>最初の項目</li>
  <li>2番目の項目</li>
  <li>3番目の項目</li>
</ol>

<!-- 定義リスト -->
<dl>
  <dt>用語1</dt>
  <dd>用語1の定義</dd>
  <dt>用語2</dt>
  <dd>用語2の定義</dd>
</dl>
```

### レイアウトコンテナ

```html
<!-- 基本的なコンテナ -->
<div class="bg-gray-100 p-4 rounded">
  <p>コンテナ内のコンテンツ</p>
</div>

<!-- セマンティックコンテナ -->
<section>
  <header>
    <h2>セクションタイトル</h2>
  </header>
  <article>
    <p>記事の内容</p>
  </article>
  <footer>
    <p>フッター情報</p>
  </footer>
</section>
```

### メディア要素

#### 画像

```html
<img src="image.jpg" alt="画像の説明" width="500" height="300" />

<!-- レスポンシブ画像 -->
<img
  src="image.jpg"
  alt="画像の説明"
  class="w-full h-auto rounded-lg shadow-md"
  loading="lazy"
/>
```

#### 動画

```html
<video controls width="640" height="480">
  <source src="video.mp4" type="video/mp4" />
  <source src="video.webm" type="video/webm" />
  お使いのブラウザは動画タグをサポートしていません。
</video>
```

#### 音声

```html
<audio controls>
  <source src="audio.mp3" type="audio/mpeg" />
  <source src="audio.ogg" type="audio/ogg" />
  お使いのブラウザは音声タグをサポートしていません。
</audio>
```

### テーブル

```html
<table class="w-full border-collapse border border-gray-300">
  <thead>
    <tr class="bg-gray-100">
      <th class="border border-gray-300 px-4 py-2">ヘッダー1</th>
      <th class="border border-gray-300 px-4 py-2">ヘッダー2</th>
      <th class="border border-gray-300 px-4 py-2">ヘッダー3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-300 px-4 py-2">データ1</td>
      <td class="border border-gray-300 px-4 py-2">データ2</td>
      <td class="border border-gray-300 px-4 py-2">データ3</td>
    </tr>
  </tbody>
</table>
```

### 埋め込みコンテンツ

#### YouTube 動画

```html
<iframe
  src="https://www.youtube.com/embed/VIDEO_ID"
  width="560"
  height="315"
  frameborder="0"
  allowfullscreen
>
</iframe>
```

#### CodePen

```html
<iframe
  src="https://codepen.io/username/embed/pen-id"
  width="100%"
  height="400"
  frameborder="0"
>
</iframe>
```

### インタラクティブ要素

```html
<!-- ボタン -->
<button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
  クリックしてください
</button>

<!-- 詳細/要約 -->
<details>
  <summary>詳細を表示</summary>
  <p>ここに詳細な情報が表示されます。</p>
</details>
```

## Tailwind CSS クラスの使用

Himawari ブログでは Tailwind CSS を使用しているため、豊富なユーティリティクラスを活用できます。

### よく使用されるクラス

```html
<!-- 背景色とパディング -->
<div class="bg-blue-100 p-4 rounded-lg">
  <p class="text-blue-800">青い背景のコンテナ</p>
</div>

<!-- フレックスレイアウト -->
<div class="flex items-center space-x-4">
  <img src="icon.png" alt="アイコン" class="w-8 h-8" />
  <span>アイコン付きテキスト</span>
</div>

<!-- グリッドレイアウト -->
<div class="grid grid-cols-2 gap-4">
  <div class="bg-gray-100 p-4">項目1</div>
  <div class="bg-gray-100 p-4">項目2</div>
</div>

<!-- レスポンシブデザイン -->
<div class="w-full md:w-1/2 lg:w-1/3">
  <p>レスポンシブなコンテナ</p>
</div>
```

### カスタムスタイリング

```html
<!-- カスタムスタイルの適用 -->
<div
  class="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-6 rounded-xl shadow-lg"
>
  <h3 class="text-2xl font-bold mb-2">美しいグラデーション</h3>
  <p class="opacity-90">カスタムスタイリングの例です。</p>
</div>
```

## 実用的な例

### 警告ボックス

```html
<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
  <div class="flex">
    <div class="flex-shrink-0">
      <span class="text-yellow-400">⚠️</span>
    </div>
    <div class="ml-3">
      <p class="text-sm text-yellow-700">
        <strong>注意:</strong> この機能は実験的なものです。
      </p>
    </div>
  </div>
</div>
```

### コードブロック

```html
<div class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
  <pre><code class="language-javascript">
function hello() {
  console.log("Hello, World!");
}
  </code></pre>
</div>
```

### カード形式のコンテンツ

```html
<div class="max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden">
  <img class="w-full h-48 object-cover" src="card-image.jpg" alt="カード画像" />
  <div class="p-6">
    <h3 class="text-xl font-semibold text-gray-900 mb-2">カードタイトル</h3>
    <p class="text-gray-600">カードの説明文がここに入ります。</p>
    <button
      class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      詳細を見る
    </button>
  </div>
</div>
```

### 2 カラムレイアウト

```html
<div class="grid md:grid-cols-2 gap-8">
  <div>
    <h3>左カラム</h3>
    <p>左側のコンテンツがここに入ります。</p>
  </div>
  <div>
    <h3>右カラム</h3>
    <p>右側のコンテンツがここに入ります。</p>
  </div>
</div>
```

## ベストプラクティス

### 1. セマンティックな HTML を使用する

```html
<!-- 良い例 -->
<article>
  <header>
    <h1>記事タイトル</h1>
    <time datetime="2024-01-01">2024年1月1日</time>
  </header>
  <section>
    <p>記事の内容...</p>
  </section>
</article>

<!-- 避けるべき例 -->
<div>
  <div>記事タイトル</div>
  <div>2024年1月1日</div>
  <div>記事の内容...</div>
</div>
```

### 2. アクセシビリティを考慮する

```html
<!-- 画像には必ずalt属性を付ける -->
<img src="chart.png" alt="2024年の売上推移グラフ" />

<!-- ボタンには適切なラベルを付ける -->
<button aria-label="メニューを開く">☰</button>

<!-- フォーム要素にはラベルを関連付ける -->
<label for="email">メールアドレス</label>
<input type="email" id="email" name="email" />
```

### 3. レスポンシブデザインを意識する

```html
<!-- モバイルファーストで考える -->
<div class="w-full sm:w-1/2 lg:w-1/3">
  <p>レスポンシブなコンテンツ</p>
</div>

<!-- 画像もレスポンシブに -->
<img src="image.jpg" alt="説明" class="w-full h-auto" />
```

### 4. パフォーマンスを考慮する

```html
<!-- 画像の遅延読み込み -->
<img src="image.jpg" alt="説明" loading="lazy" />

<!-- 外部リソースの適切な設定 -->
<iframe src="https://example.com" loading="lazy"></iframe>
```

## 注意事項

1. **セキュリティ**: 危険なタグ（`<script>`など）は自動的に除去されます
2. **パフォーマンス**: 大量の HTML コンテンツは読み込み速度に影響する可能性があります
3. **互換性**: すべての HTML タグがサポートされているわけではありません
4. **スタイリング**: カスタム CSS は使用できません。Tailwind CSS クラスを使用してください

## 記事の作成方法

### 1. 新しい記事ファイルの作成

`src/content/blog/article/` ディレクトリに新しい Markdown ファイルを作成します：

```markdown
---
title: "記事のタイトル"
date: "2024-01-01"
description: "記事の説明文"
tags: ["html", "markdown", "tutorial"]
coverImage: "https://example.com/image.jpg"
---

# 記事の内容

ここに記事の本文を書きます。HTML タグと Markdown を混在できます。

<div class="bg-blue-100 p-4 rounded-lg">
  <h3>HTML コンテナの例</h3>
  <p>このように HTML タグを使用できます。</p>
</div>
```

### 2. 重要な技術的詳細

- **記事の識別**: ファイル内容のハッシュから自動的に slug が生成されます
- **メタデータ**: フロントマターで記事の情報を管理します
- **データ取得**: `posts.json` は使用されず、Markdown ファイルから直接データを取得します

## 次のステップ

- [セキュリティガイドライン](SECURITY_GUIDELINES.md)でセキュリティについて詳しく学ぶ
- [トラブルシューティングガイド](TROUBLESHOOTING_GUIDE.md)で問題解決方法を確認する
- 実際に HTML タグを使用してコンテンツを作成してみる
