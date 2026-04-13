# Himawari

Himawari は、Next.js App Router、React、TypeScript で構築されたポートフォリオ兼ブログサイトです。トップページ、ブログ、制作実績、サービス紹介、動画関連ページ、LINE AI サービスページを提供します。

コンテンツは主に Strapi API から取得し、API が利用できない環境でも空データへフォールバックしてビルドできるようになっています。

## 主な機能

- トップページ: プロダクト紹介、ニュース、ブログ、プロフィールを表示
- ニュース: Strapi の `news-items` から取得し、トップページでページネーション表示
- ブログ: Strapi の `articles` から取得し、一覧と記事詳細を表示
- 動画: Strapi の `video-items` から取得
- 固定ページ: `project`、`commercial`、`software`、`license`、`privacy` などを Strapi から取得
- Markdown/HTML レンダリング: `react-markdown`、`rehype-raw`、`rehype-sanitize`、`remark-gfm`、`remark-math`、`rehype-katex` を使用
- セキュリティ: HTML サニタイズ、Markdown エラーハンドリング、危険なコンテンツの検証
- テスト: Vitest + Testing Library によるコンポーネント、Markdown、CMS 互換、セキュリティ、パフォーマンステスト

## 技術スタック

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- React Markdown
- Vitest
- Testing Library
- ESLint

## セットアップ

### 必要なもの

- Node.js 18 以上
- npm

### インストール

```bash
npm install
```

### 環境変数

Strapi の URL は次の順で参照されます。

```bash
NEXT_PUBLIC_STRAPI_URL=https://your-strapi.example.com
# または
VITE_STRAPI_URL=https://your-strapi.example.com
```

未設定の場合は `http://localhost:1337` が使用されます。Strapi に接続できない場合、各取得関数は警告を出しつつ空データへフォールバックします。

## 開発コマンド

```bash
npm run dev          # 開発サーバーを起動
npm run build        # 本番ビルド
npm run preview      # next start でビルド済みアプリを起動
npm run lint         # ESLint
npm run test         # Vitest の watch モード
npm run test:run     # 全テストを一度だけ実行
npm run perf:test    # パフォーマンステスト
npm run perf:benchmark
npm run perf:bundle
```

## ルート

主な App Router のルートは次の通りです。

```text
/
/blog
/blog/[slug]
/commercial
/license
/privacy
/project
/software
/software/line_ai
/software/line_ai/account/success
/software/line_ai/account/cancel
/video
/youtube
```

`src/app/*/page.tsx` はルート定義を担当し、画面本体とデータ取得は `src/views/*` 配下に分けています。

## プロジェクト構成

```text
src/
├── app/                  # Next.js App Router
├── components/           # 共通 React コンポーネント
├── const/                # 定数
├── styles/               # グローバル CSS
├── test/                 # Vitest テスト
├── types/                # TypeScript 型
├── utils/                # データ取得、Markdown、セキュリティ関連
└── views/                # ページ単位の表示・データ取得
```

主なファイル:

- `src/utils/getPosts.ts`: Strapi の `articles` からブログ記事を取得
- `src/utils/getNewsItem.ts`: Strapi の `news-items` からニュースを取得
- `src/utils/getPages.ts`: 固定ページを取得
- `src/utils/getVideos.ts`: 動画項目を取得
- `src/components/NewsSection.tsx`: トップページのニュース表示とページネーション
- `src/components/SafeMarkdownRenderer.tsx`: 安全な Markdown/HTML レンダリング
- `src/utils/sanitizeConfig.ts`: HTML サニタイズ設定

## Strapi データ

### ブログ記事

`getPosts()` は次の API を参照します。

```text
/api/articles?sort=date:desc&populate=*
```

期待する主なフィールド:

- `slug`
- `title`
- `date`
- `content`
- `coverImage`
- `categories`
- `tags`

### ニュース

`getNewsItem()` は次の API を参照します。

```text
/api/news-items?sort=date:desc
```

期待する主なフィールド:

- `title`
- `date`
- `content`
- `link`

`content` は文字列だけでなく Strapi のリッチテキスト配列/オブジェクトでも受け取り、表示前にプレーンテキストへ正規化します。これにより、トップページのニュース 2 ページ目など、特定の項目がリッチテキスト形式でも React の描画エラーを避けられます。

## Markdown と HTML

ブログ本文などの Markdown は、HTML 混在を許可しつつ `rehype-sanitize` で安全性を担保しています。

関連ドキュメント:

- [docs/README.md](docs/README.md)
- [docs/HTML_USAGE_GUIDE.md](docs/HTML_USAGE_GUIDE.md)
- [docs/SECURITY_GUIDELINES.md](docs/SECURITY_GUIDELINES.md)
- [docs/TROUBLESHOOTING_GUIDE.md](docs/TROUBLESHOOTING_GUIDE.md)

## テスト

全テストは次で実行します。

```bash
npm run test:run
```

現在のテスト対象には、Markdown/HTML レンダリング、セキュリティ、CMS 互換性、レスポンシブ、パフォーマンス、ニュースページネーションが含まれます。

CMS 互換テストは、過去の Decap CMS 用ファイルがリポジトリに存在しない環境でも検証できるよう、`src/test/setup.ts` で `public/admin/*` と `src/content/blog/article/*` のテスト用パスだけを `fs` 部分モックしています。それ以外のファイル操作は実ファイルへフォールバックします。

ニュースの回帰テストは `src/test/NewsSection.test.tsx` にあり、2 ページ目に表示されるニュース本文が Strapi リッチテキスト形式でも落ちないことを確認します。

## ビルドとデプロイ

```bash
npm run build
```

Next.js の通常ビルドを行います。`next.config.ts` では `trailingSlash: true` と `images.unoptimized: true` を設定しています。

デプロイ先は Next.js に対応したホスティングを想定しています。

- Vercel
- Netlify
- Cloudflare Pages
- Node.js で `next start` を実行できる環境

## LINE AI 決済関連ページ

LINE AI アカウント関連の完了/キャンセルページを提供しています。

```text
/software/line_ai/account/success
/software/line_ai/account/cancel
```

Stripe Checkout などのリダイレクト先に使う場合は、現在のルートに合わせて次のように設定してください。

```ts
const session = await stripe.checkout.sessions.create({
  success_url: "https://yourdomain.com/software/line_ai/account/success",
  cancel_url: "https://yourdomain.com/software/line_ai/account/cancel",
  // ...
});
```

## ライセンス

このプロジェクトは MIT ライセンスです。詳細は [LICENSE](LICENSE) を参照してください。
