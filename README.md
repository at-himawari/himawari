# Himawari ブログ

Himawari は、React + TypeScript + Vite を使用して構築された個人ブログ・ポートフォリオサイトです。静的サイト生成（SSG）により高速で SEO フレンドリーなサイトを実現しています。

## ✨ 主な機能

- 📝 **Markdown + HTML サポート**: リッチなコンテンツ作成が可能
- 🔒 **セキュリティ重視**: XSS 攻撃を防ぐ多層防御システム
- 🎨 **Tailwind CSS**: 美しいレスポンシブデザイン
- 📱 **CMS 統合**: Decap CMS による直感的なコンテンツ管理
- ⚡ **高速表示**: Vite による最適化されたビルド
- 🌐 **SEO 最適化**: メタタグ、OpenGraph 対応

## 🚀 技術スタック

### コアフレームワーク

- **Vike** (旧 vite-plugin-ssr) - フルスタックフレームワーク
- **React 19** + **TypeScript** - UI フレームワークと型安全性
- **Vite** - ビルドツールと開発サーバー

### スタイリング・UI

- **Tailwind CSS** - ユーティリティファースト CSS
- **@tailwindcss/typography** - プロースコンテンツ用プラグイン
- **PostCSS** + **Autoprefixer** - CSS 処理

### コンテンツ・Markdown

- **ReactMarkdown** - React での Markdown レンダリング
- **rehype-raw** - HTML タグサポート
- **rehype-sanitize** - セキュリティサニタイゼーション
- **remark-gfm** - GitHub Flavored Markdown
- **remark-math** + **rehype-katex** - 数式レンダリング

## 📖 ドキュメント

### HTML コンテンツ使用ガイド

Markdown 内で HTML タグを安全に使用するための包括的なドキュメントを用意しています：

- **[📚 ドキュメント概要](docs/README.md)** - 全ドキュメントの概要
- **[🏷️ HTML タグ使用ガイド](docs/HTML_USAGE_GUIDE.md)** - HTML タグの使用方法と実例
- **[🔒 セキュリティガイドライン](docs/SECURITY_GUIDELINES.md)** - セキュリティ対策と制限事項
- **[🔧 トラブルシューティング](docs/TROUBLESHOOTING_GUIDE.md)** - 問題解決方法

## 🛠️ 開発環境のセットアップ

### 前提条件

- Node.js 18.0 以上
- npm または yarn

### インストール

```bash
# リポジトリのクローン
git clone <repository-url>
cd himawari-blog

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### よく使用するコマンド

```bash
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run preview      # ビルド結果のプレビュー
npm run lint         # ESLint 実行
npm run test         # テスト実行
```

## 📁 プロジェクト構造

```
src/
├── components/          # 再利用可能な React コンポーネント
│   ├── Header.tsx       # サイトナビゲーション
│   ├── Footer.tsx       # サイトフッター
│   ├── MarkdownComponents.tsx  # カスタム Markdown レンダラー
│   └── SafeMarkdownRenderer.tsx # セキュアな Markdown レンダリング
├── content/             # 静的コンテンツとデータ
│   ├── blog/
│   │   └─ article/     # Markdown ブログ記事
│   └── *.md            # 静的ページ
├── pages/               # Vike ルート定義
│   ├── index/           # ホームページ (/)
│   ├── blog/            # ブログ一覧 (/blog)
│   │   └── @slug/       # 動的ブログ記事 (/blog/[slug])
│   └── ...
├── utils/               # ユーティリティ関数
│   ├── sanitizeConfig.ts    # HTML サニタイゼーション設定
│   ├── contentSecurity.ts   # コンテンツセキュリティ
│   └── markdownErrorHandler.ts # エラーハンドリング
└── types/               # TypeScript 型定義
```

## 🔒 セキュリティ機能

### 多層防御システム

1. **事前サニタイゼーション**: 危険なタグ・属性の除去
2. **rehype-sanitize**: ホワイトリスト方式での HTML 検証
3. **ランタイム検証**: iframe ドメイン制限、コンテンツ長制限

### 許可されている HTML タグ

- テキスト装飾: `<strong>`, `<em>`, `<u>`, `<mark>` など
- レイアウト: `<div>`, `<section>`, `<article>` など
- メディア: `<img>`, `<video>`, `<audio>`, `<iframe>` (制限付き)
- テーブル: `<table>`, `<tr>`, `<td>` など

詳細は [セキュリティガイドライン](docs/SECURITY_GUIDELINES.md) を参照してください。

## 💳 Stripe 決済ページ

このプロジェクトには、Stripe Checkout の決済フロー用の静的ページが含まれています。

### 利用可能なページ

#### 決済成功ページ (`/lineat_ai/account/success`)

- **URL**: `https://yourdomain.com/lineat_ai/account/success`
- **用途**: Stripe Checkout の成功時リダイレクト先
- **表示内容**:
  - 決済完了メッセージ
  - 感謝のメッセージ
  - ホームページへのリンク

#### 決済キャンセルページ (`/lineat_ai/account/cancel`)

- **URL**: `https://yourdomain.com/lineat_ai/account/cancel`
- **用途**: Stripe Checkout のキャンセル時リダイレクト先
- **表示内容**:
  - キャンセル確認メッセージ
  - 再試行リンク
  - ホームページへのリンク

### Stripe 設定手順

1. **Stripe ダッシュボードにログイン**

   - [Stripe Dashboard](https://dashboard.stripe.com/) にアクセス

2. **Checkout セッションの設定**

   - Checkout セッション作成時に以下の URL を指定：

   ```javascript
   const session = await stripe.checkout.sessions.create({
     success_url: "https://yourdomain.com/lineat_ai/account/success",
     cancel_url: "https://yourdomain.com/lineat_ai/account/cancel",
     // その他の設定...
   });
   ```

3. **環境変数の設定**

   - `.env.local` ファイルに以下を追加：

   ```bash
   STRIPE_SUCCESS_URL=https://yourdomain.com/lineat_ai/account/success
   STRIPE_CANCEL_URL=https://yourdomain.com/lineat_ai/account/cancel
   ```

4. **本番環境での確認**
   - デプロイ後、実際の決済フローで両ページが正しく表示されることを確認
   - レスポンシブデザインの動作確認（モバイル、タブレット、デスクトップ）

### ページの特徴

- **静的生成**: 両ページは静的に生成され（SSG）、高速に配信されます
- **レスポンシブデザイン**: すべてのデバイスで最適な表示
- **日本語対応**: 日本語フォントで読みやすく表示
- **サイト統一デザイン**: 既存のヘッダー・フッターと統合

## 📝 コンテンツ作成

### ブログ記事の作成

1. `src/content/blog/article/` に Markdown ファイルを作成
2. フロントマターでメタデータを設定
3. HTML タグを使用してリッチなコンテンツを作成

**記事ファイルの例**:

```markdown
---
title: "記事タイトル"
date: "2024-01-01"
description: "記事の説明"
tags: ["tag1", "tag2"]
coverImage: "https://example.com/image.jpg"
---

# 記事の内容

通常の Markdown と HTML タグを混在できます。

<div class="bg-blue-100 p-4 rounded-lg">
  <p>HTML コンテンツの例</p>
</div>
```

**重要**:

- 記事データは Markdown ファイルから直接取得されます
- 記事の slug は Markdown ファイルの内容から自動生成されます

```markdown
# 記事タイトル

通常の Markdown テキスト。

<div class="bg-blue-100 p-4 rounded-lg">
  <h3>HTML コンテナ</h3>
  <p>HTML と Markdown を組み合わせたコンテンツ</p>
</div>

**Markdown の強調**と<strong>HTML の強調</strong>を混在できます。
```

### CMS を使用した編集

Decap CMS を使用してブラウザから直接コンテンツを編集できます：

1. `/admin` にアクセス
2. GitHub でログイン
3. 記事の作成・編集・プレビュー

## 🔧 データ管理の仕組み

### ブログ記事の処理フロー

```
Markdown ファイル → getPosts() → ハッシュ生成 → 静的ページ生成
```

1. **記事読み込み**: `src/utils/getPosts.ts` が `src/content/blog/article/` から Markdown ファイルを読み込み
2. **メタデータ解析**: `gray-matter` でフロントマターを解析
3. **Slug 生成**: ファイル内容のハッシュから一意の slug を生成
4. **静的ページ生成**: Vike が各記事の静的 HTML を生成

## 🧪 テスト

```bash
# 全テスト実行
npm run test

# セキュリティテスト
npm run test:security

# パフォーマンステスト
npm run test:performance

# CMS 互換性テスト
npm run test:cms
```

## 🚀 デプロイ

### 静的サイトとしてデプロイ

```bash
# ビルド
npm run build

# dist/ フォルダを静的ホスティングサービスにデプロイ
```

### 推奨ホスティングサービス

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## 🤝 コントリビューション

1. Fork このリポジトリ
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Request を作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 🙏 謝辞

- [Vike](https://vike.dev/) - 素晴らしい SSG フレームワーク
- [ReactMarkdown](https://github.com/remarkjs/react-markdown) - Markdown レンダリング
- [Tailwind CSS](https://tailwindcss.com/) - 美しい CSS フレームワーク
- [Decap CMS](https://decapcms.org/) - 使いやすい CMS
