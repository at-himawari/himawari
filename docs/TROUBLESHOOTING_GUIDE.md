# トラブルシューティングガイド

このドキュメントでは、Himawari ブログで HTML コンテンツを使用する際に発生する可能性のある問題と解決方法について説明します。

## 目次

1. [よくある問題](#よくある問題)
2. [レンダリング問題](#レンダリング問題)
3. [セキュリティ関連の問題](#セキュリティ関連の問題)
4. [スタイリング問題](#スタイリング問題)
5. [パフォーマンス問題](#パフォーマンス問題)
6. [CMS 関連の問題](#cms関連の問題)
7. [デバッグ方法](#デバッグ方法)
8. [エラーコードリファレンス](#エラーコードリファレンス)

## よくある問題

### Q1: HTML タグが文字列として表示される

**症状:**

```
<div>Hello World</div>
```

上記のように HTML タグがそのまま表示される。

**原因:**

- ReactMarkdown で HTML レンダリングが有効になっていない
- rehype-raw プラグインが正しく設定されていない

**解決方法:**

```typescript
// src/pages/blog/@slug/+Page.tsx を確認
import rehypeRaw from "rehype-raw";

const markdownOptions = {
  rehypePlugins: [
    rehypeRaw, // この行が必要
    // その他のプラグイン...
  ],
};
```

### Q2: 一部の HTML タグが表示されない

**症状:**
特定の HTML タグ（例：`<button>`、`<iframe>`）が表示されない。

**原因:**

- セキュリティ設定により許可されていないタグが使用されている
- サニタイゼーション設定で除去されている

**解決方法:**

1. [許可されている HTML タグ一覧](HTML_USAGE_GUIDE.md#サポートされているhtmlタグ)を確認
2. 開発者ツールのコンソールでセキュリティ警告を確認
3. 必要に応じて代替タグを使用

```html
<!-- 除去される可能性があるタグ -->
<button onclick="alert('test')">ボタン</button>

<!-- 安全な代替案 -->
<button class="bg-blue-500 text-white px-4 py-2 rounded">ボタン</button>
```

### Q3: スタイルが適用されない

**症状:**
HTML タグに CSS クラスを指定してもスタイルが適用されない。

**原因:**

- Tailwind CSS クラス名の間違い
- カスタム CSS の使用（サポートされていない）
- クラス名の競合

**解決方法:**

```html
<!-- 正しいTailwind CSSクラスの使用 -->
<div class="bg-blue-100 p-4 rounded-lg shadow-md">
  <p class="text-blue-800 font-semibold">正しいスタイリング</p>
</div>

<!-- 間違った例（カスタムCSS） -->
<div style="background-color: blue; padding: 16px;">
  <p>カスタムCSSは制限される場合があります</p>
</div>
```

## レンダリング問題

### エラー: "Markdown rendering failed"

**症状:**

```
Error: Unable to render content
Fallback Mode: safe
```

**原因:**

- 不正な HTML 構造
- 未閉じタグ
- 大きすぎるコンテンツ

**解決方法:**

1. **HTML 構造の確認**

```html
<!-- 悪い例：未閉じタグ -->
<div>
  <p>テキスト</p>
</div>

<!-- 良い例：正しい構造 -->
<div>
  <p>テキスト</p>
</div>
```

2. **コンテンツサイズの確認**

```bash
# ファイルサイズを確認
ls -lh src/content/blog/article/your-post.md

# 1MB以上の場合は分割を検討
```

3. **段階的なデバッグ**

```markdown
<!-- 最小限のHTMLから開始 -->
<div>
  <p>テスト</p>
</div>

<!-- 徐々に複雑な構造を追加 -->
```

### フォールバックモードの対処

**症状:**
コンテンツが「Safe Mode」や「Plain Text Mode」で表示される。

**対処法:**

1. **開発環境での詳細確認**

```typescript
// 開発環境でエラー詳細を表示
<SafeMarkdownRenderer
  content={content}
  showErrorDetails={true}
  onError={(errors) => console.log("Errors:", errors)}
/>
```

2. **エラーログの確認**

```bash
# ブラウザの開発者ツールでコンソールを確認
# セキュリティ警告やエラーメッセージを探す
```

## セキュリティ関連の問題

### セキュリティ警告の対処

**警告例:**

```
[Security Warning] Script tags detected and will be removed
[Security Warning] Event handlers detected and will be removed
```

**対処方法:**

1. **スクリプトタグの除去**

````html
<!-- 除去される -->
<script>
  console.log("test");
</script>

<!-- 代替案：コードブロックとして表示 -->
```javascript console.log('test');
````

2. **イベントハンドラーの除去**

```html
<!-- 除去される -->
<button onclick="alert('test')">ボタン</button>

<!-- 代替案：CSSのみでインタラクション -->
<button class="hover:bg-blue-600 transition-colors">ボタン</button>
```

### iframe が表示されない

**症状:**
YouTube や CodePen の埋め込みが表示されない。

**原因:**

- 許可されていないドメインからの埋め込み
- 不正な URL 形式

**解決方法:**

1. **許可されているドメインの確認**

```html
<!-- 許可されている -->
<iframe src="https://www.youtube.com/embed/VIDEO_ID"></iframe>
<iframe src="https://codepen.io/user/embed/pen-id"></iframe>

<!-- 許可されていない -->
<iframe src="https://unknown-site.com/embed/123"></iframe>
```

2. **URL 形式の確認**

```html
<!-- 正しい形式 -->
<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>

<!-- 間違った形式 -->
<iframe src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"></iframe>
```

## スタイリング問題

### Tailwind CSS クラスが効かない

**症状:**
Tailwind CSS クラスを指定してもスタイルが適用されない。

**原因と解決方法:**

1. **クラス名の間違い**

```html
<!-- 間違い -->
<div class="bg-blue text-white">テキスト</div>

<!-- 正しい -->
<div class="bg-blue-500 text-white">テキスト</div>
```

2. **クラスの競合**

```html
<!-- 競合する可能性 -->
<div class="p-4 p-8">テキスト</div>

<!-- 正しい（後のクラスが優先される） -->
<div class="p-8">テキスト</div>
```

3. **レスポンシブクラスの使用**

```html
<!-- モバイルファーストで記述 -->
<div class="w-full md:w-1/2 lg:w-1/3">レスポンシブコンテンツ</div>
```

### カスタムスタイルの制限

**症状:**
`style`属性で指定した CSS が適用されない。

**原因:**
セキュリティ上の理由で一部の CSS プロパティが制限されている。

**解決方法:**

```html
<!-- 制限される可能性 -->
<div style="background: url(image.jpg); transform: rotate(45deg);">
  コンテンツ
</div>

<!-- Tailwind CSSクラスを使用 -->
<div
  class="bg-cover bg-center transform rotate-45"
  style="background-image: url(image.jpg);"
>
  コンテンツ
</div>
```

## パフォーマンス問題

### ページ読み込みが遅い

**症状:**
HTML コンテンツを含むページの読み込みが遅い。

**原因と解決方法:**

1. **大きな画像の最適化**

```html
<!-- 最適化前 -->
<img src="large-image.jpg" alt="説明" />

<!-- 最適化後 -->
<img
  src="optimized-image.webp"
  alt="説明"
  width="800"
  height="600"
  loading="lazy"
  class="w-full h-auto"
/>
```

2. **iframe の遅延読み込み**

```html
<iframe
  src="https://www.youtube.com/embed/VIDEO_ID"
  loading="lazy"
  width="560"
  height="315"
>
</iframe>
```

3. **コンテンツの分割**

```markdown
<!-- 長いコンテンツは複数の記事に分割 -->

# 記事タイトル（パート 1）

内容...

---

# 記事タイトル（パート 2）

続きの内容...
```

### ビルド時間が長い

**症状:**
HTML コンテンツを追加後、ビルド時間が大幅に増加。

**解決方法:**

1. **不要なプラグインの除去**

```typescript
// vite.config.ts で必要最小限のプラグインのみ使用
export default {
  plugins: [
    // 必要なプラグインのみ
  ],
};
```

2. **コンテンツのキャッシュ**

```bash
# ビルドキャッシュの活用
npm run build -- --cache
```

## CMS 関連の問題

### Decap CMS で HTML が正しく表示されない

**症状:**
CMS エディターで HTML タグが正しくプレビューされない。

**解決方法:**

1. **CMS 設定の確認**

```yaml
# public/admin/config.yml
collections:
  - name: "blog"
    fields:
      - name: "body"
        widget: "markdown"
        # HTMLプレビューを有効化
        editor_components: ["image", "code-block"]
```

2. **段階的な編集**

```markdown
<!-- まずMarkdownで構造を作成 -->

# タイトル

基本的なテキスト

<!-- その後HTMLを追加 -->
<div class="bg-blue-100 p-4">
  <p>HTMLコンテンツ</p>
</div>
```

### CMS プレビューとサイト表示の違い

**症状:**
CMS のプレビューと実際のサイトでの表示が異なる。

**原因:**

- CMS とサイトで異なる CSS 設定
- プレビュー環境でのプラグイン設定の違い

**解決方法:**

```javascript
// public/admin/custom-cms-loader.js でプレビュー設定を調整
CMS.registerPreviewStyle("/styles/index.css");
```

## デバッグ方法

### 開発環境でのデバッグ

1. **詳細エラー表示の有効化**

```typescript
// 開発環境でのみ詳細エラーを表示
<SafeMarkdownRenderer
  content={content}
  showErrorDetails={process.env.NODE_ENV === "development"}
/>
```

2. **コンソールログの確認**

```bash
# 開発サーバー起動
npm run dev

# ブラウザの開発者ツールでコンソールを確認
# セキュリティ警告やエラーメッセージを探す
```

3. **段階的なテスト**

```markdown
<!-- 最小限のHTMLから開始 -->
<p>テスト</p>

<!-- 徐々に複雑化 -->
<div>
  <p>テスト</p>
</div>

<!-- 最終的な複雑な構造 -->
<div class="bg-blue-100 p-4">
  <h3>タイトル</h3>
  <p>内容</p>
</div>
```

### プロダクション環境でのデバッグ

1. **ビルドログの確認**

```bash
# ビルド時のエラーを確認
npm run build 2>&1 | grep -i error

# 詳細なビルドログ
npm run build -- --verbose
```

2. **静的ファイルの確認**

```bash
# 生成されたHTMLファイルを確認
cat dist/blog/your-post/index.html
```

## エラーコードリファレンス

### MARKDOWN_PARSE_ERROR

**説明:** Markdown の解析に失敗
**対処法:** Markdown 構文の確認、特殊文字のエスケープ

### HTML_SANITIZATION_ERROR

**説明:** HTML サニタイゼーション処理でエラー
**対処法:** 許可されていないタグ・属性の除去

### SECURITY_VIOLATION

**説明:** セキュリティ違反が検出された
**対処法:** 危険なコンテンツの除去、許可されたタグの使用

### RENDERING_TIMEOUT

**説明:** レンダリング処理がタイムアウト
**対処法:** コンテンツサイズの削減、複雑な構造の簡素化

### UNKNOWN_ERROR

**説明:** 予期しないエラーが発生
**対処法:** エラーログの詳細確認、段階的なデバッグ

## サポートとヘルプ

### 問題が解決しない場合

1. **エラーログの収集**

```bash
# ブラウザのコンソールログをコピー
# ビルドエラーログを保存
# 問題のあるMarkdownコンテンツを特定
```

2. **最小再現例の作成**

```markdown
<!-- 問題を再現する最小限のコンテンツ -->
<div class="problematic-class">
  <p>問題のあるコンテンツ</p>
</div>
```

3. **環境情報の確認**

```bash
# Node.js バージョン
node --version

# npm バージョン
npm --version

# パッケージバージョン
npm list react-markdown rehype-raw rehype-sanitize
```

### 追加リソース

- [HTML タグ使用ガイド](HTML_USAGE_GUIDE.md) - 基本的な使用方法
- [セキュリティガイドライン](SECURITY_GUIDELINES.md) - セキュリティ関連の詳細
- [Tailwind CSS ドキュメント](https://tailwindcss.com/docs) - スタイリングリファレンス
- [ReactMarkdown ドキュメント](https://github.com/remarkjs/react-markdown) - プラグイン詳細

## まとめ

このトラブルシューティングガイドでは、HTML コンテンツ使用時の一般的な問題と解決方法を説明しました。問題が発生した場合は：

1. **エラーメッセージを確認**
2. **段階的にデバッグ**
3. **セキュリティ制限を理解**
4. **適切な代替案を使用**

これらの手順に従うことで、ほとんどの問題を解決できます。
