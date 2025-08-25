# Himawari ブログ HTML サポート ドキュメント

このディレクトリには、Himawari ブログで HTML コンテンツを安全に使用するための包括的なドキュメントが含まれています。

## 📚 ドキュメント一覧

### [🏷️ HTML タグ使用ガイド](HTML_USAGE_GUIDE.md)

HTML タグの基本的な使用方法、サポートされているタグ一覧、実用的な例、ベストプラクティスについて説明しています。

**主な内容:**

- サポートされている HTML タグ一覧
- Tailwind CSS クラスの使用方法
- 実用的なコンポーネント例
- レスポンシブデザインの実装
- アクセシビリティの考慮事項

### [🔒 セキュリティガイドライン](SECURITY_GUIDELINES.md)

HTML コンテンツを安全に使用するためのセキュリティ対策、禁止されているタグ・属性、セキュリティベストプラクティスについて説明しています。

**主な内容:**

- 3 層のセキュリティ防御システム
- 許可・禁止されているタグと属性
- 信頼できる iframe ドメイン一覧
- セキュリティ警告の対処方法
- インシデント対応手順

### [🔧 トラブルシューティングガイド](TROUBLESHOOTING_GUIDE.md)

HTML コンテンツ使用時に発生する可能性のある問題と解決方法について詳しく説明しています。

**主な内容:**

- よくある問題と解決方法
- レンダリング・セキュリティ・スタイリング問題の対処
- パフォーマンス最適化
- CMS 関連の問題解決
- デバッグ方法とエラーコードリファレンス

## 🚀 クイックスタート

### 1. 新しい記事の作成

```markdown
---
title: "記事タイトル"
date: "2024-01-01"
description: "記事の説明"
tags: ["html", "markdown"]
---

# 記事の内容

<div class="bg-blue-100 p-4 rounded-lg">
  <h3 class="text-lg font-semibold text-blue-800">タイトル</h3>
  <p class="text-blue-700">HTMLとMarkdownを組み合わせたコンテンツです。</p>
</div>
```

### 2. セキュリティを意識した使用

```html
<!-- ✅ 安全な例 -->
<img src="https://trusted-cdn.com/image.jpg" alt="説明" loading="lazy" />

<!-- ❌ 危険な例（自動的に除去される） -->
<script>
  alert("XSS");
</script>
<img src="x" onerror="alert('XSS')" />
```

### 3. 問題が発生した場合

1. [トラブルシューティングガイド](TROUBLESHOOTING_GUIDE.md)を確認
2. ブラウザの開発者ツールでエラーログを確認
3. 段階的に HTML を簡素化してテスト

## 📋 要件との対応

このドキュメントは以下の要件を満たしています：

### 要件 6.2: 拡張されたフォーマットオプション

- **HTML タグ使用ガイド**: カスタムレイアウト、メディア埋め込み、インタラクティブ要素の使用方法を詳細に説明
- **実用的な例**: カード形式、2 カラムレイアウト、警告ボックスなどの実装例を提供

### 要件 6.3: インタラクティブ要素のサポート

- **セキュリティガイドライン**: 安全なフォーム要素とボタンの使用方法を説明
- **トラブルシューティングガイド**: インタラクティブ要素に関する問題の解決方法を提供

## 🛡️ セキュリティ重要事項

### 自動的に除去される危険な要素

- `<script>` タグ
- `on*` イベントハンドラー
- `javascript:` プロトコル
- 信頼できないドメインからの `<iframe>`

### 推奨される安全な使用方法

- ホワイトリストに含まれるタグのみ使用
- Tailwind CSS クラスでスタイリング
- 信頼できるドメインからのメディア埋め込み
- 適切な alt 属性とアクセシビリティ対応

## 🎨 スタイリングガイドライン

### Tailwind CSS の活用

```html
<!-- レスポンシブデザイン -->
<div class="w-full md:w-1/2 lg:w-1/3">
  <img src="image.jpg" alt="説明" class="w-full h-auto rounded-lg shadow-md" />
</div>

<!-- カスタムコンポーネント風のスタイリング -->
<div
  class="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-6 rounded-xl"
>
  <h3 class="text-2xl font-bold">美しいグラデーション</h3>
</div>
```

### アクセシビリティの考慮

```html
<!-- 適切なセマンティック構造 -->
<article>
  <header>
    <h1>記事タイトル</h1>
    <time datetime="2024-01-01">2024年1月1日</time>
  </header>
  <section>
    <p>記事の内容...</p>
  </section>
</article>
```

## 🔄 更新履歴

### v1.0.0 (2024-01-01)

- 初回リリース
- HTML タグ使用ガイドの作成
- セキュリティガイドラインの策定
- トラブルシューティングガイドの作成

## 🔧 技術的な詳細

### データ管理の仕組み

現在のシステムでは、以下の方法でブログ記事を管理しています：

1. **記事ファイル**: `src/content/blog/article/*.md` に Markdown ファイルとして保存
2. **メタデータ**: 各ファイルのフロントマターで管理
3. **Slug 生成**: ファイル内容のハッシュから自動生成
4. **データ取得**: `src/utils/getPosts.ts` で直接 Markdown ファイルを読み込み

### 重要な注意事項

- **`posts.json` は現在使用されていません**
- 記事の追加・編集は Markdown ファイルを直接編集してください
- 記事の slug は自動生成されるため、手動で設定する必要はありません

## 📞 サポート

### 問題報告

問題を発見した場合は、以下の情報を含めて報告してください：

1. **問題の詳細**: 何が期待されていて、何が起こったか
2. **再現手順**: 問題を再現するための具体的な手順
3. **環境情報**: ブラウザ、OS、Node.js バージョンなど
4. **エラーログ**: ブラウザの開発者ツールからのエラーメッセージ
5. **コンテンツ例**: 問題を再現する最小限の Markdown/HTML コード

### 追加リソース

#### 外部ドキュメント

- [ReactMarkdown](https://github.com/remarkjs/react-markdown) - Markdown レンダリングライブラリ
- [rehype-raw](https://github.com/rehypejs/rehype-raw) - HTML タグサポートプラグイン
- [rehype-sanitize](https://github.com/rehypejs/rehype-sanitize) - HTML サニタイゼーションプラグイン
- [Tailwind CSS](https://tailwindcss.com/docs) - CSS フレームワーク

#### 内部技術ドキュメント

- [セキュリティ機能詳細](../src/utils/SECURITY_FEATURES.md) - 実装レベルのセキュリティ詳細
- [テストレポート](../src/test/TEST_REPORT.md) - 機能テスト結果
- [CMS 互換性レポート](../src/test/CMS_COMPATIBILITY_REPORT.md) - Decap CMS 互換性確認結果

## 🎯 次のステップ

1. **[HTML タグ使用ガイド](HTML_USAGE_GUIDE.md)** を読んで基本的な使用方法を学ぶ
2. **[セキュリティガイドライン](SECURITY_GUIDELINES.md)** でセキュリティ要件を理解する
3. 実際に HTML タグを使用してコンテンツを作成してみる
4. 問題が発生した場合は **[トラブルシューティングガイド](TROUBLESHOOTING_GUIDE.md)** を参照する

---

**注意**: このドキュメントは blog-data-externalization 機能の実装完了に伴い作成されました。HTML コンテンツを使用する前に、必ずセキュリティガイドラインを確認してください。
