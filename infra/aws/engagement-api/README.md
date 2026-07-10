# Engagement API

ブログ記事ごとのいいねとコメントを扱う、`API Gateway HTTP API + Lambda + DynamoDB` の CDK 構成です。

## 構成

- `bin/engagement-api.ts`
  - CDK アプリのエントリーポイント
- `lib/engagement-api-stack.ts`
  - HTTP API、Lambda、DynamoDB の定義
- `src/app.js`
  - 記事ごとのエンゲージメント API
- `src/package.json`
  - Lambda に同梱する AWS SDK v3

## エンドポイント

- `GET /health`
- `GET /articles/{slug}/engagement`
  - いいね数、コメント数、コメント一覧、ログイン中Googleアカウントのいいね状態
- `POST /articles/{slug}/likes`
  - いいね。Googleログイン必須
- `DELETE /articles/{slug}/likes`
  - いいね取り消し。Googleログイン必須
- `POST /articles/{slug}/comments`
  - コメント投稿。Googleログイン必須
- `DELETE /articles/{slug}/comments/{commentId}`
  - コメント削除。Googleログイン必須。投稿したGoogleアカウント本人のみ削除可能

## データモデル

単一テーブルで `PK` / `SK` を使います。

- `PK=ARTICLE#{slug}, SK=META`
  - 記事ごとの集計
- `PK=ARTICLE#{slug}, SK=LIKE#{googleSub}`
  - Googleアカウント単位のいいね
- `PK=ARTICLE#{slug}, SK=COMMENT#{timestamp}#{commentId}`
  - コメント
  - `googleSub`、`email`、`emailVerified` は管理用の非公開情報として保存し、公開レスポンスには含めません。

## デプロイ例

```bash
cd infra/aws/engagement-api
npm install
cd src
npm install
cd ..
npx cdk bootstrap
npx cdk deploy \
  --parameters FrontendOrigin=https://yourdomain.com \
  --parameters CommentAutoPublish=true \
  --parameters GoogleClientId=your-google-oauth-client-id.apps.googleusercontent.com
```

デプロイ後に出力される `EngagementApiUrl` を、フロント側の `NEXT_PUBLIC_ENGAGEMENT_API_URL` に設定します。フロント側の `NEXT_PUBLIC_GOOGLE_CLIENT_ID` と、このスタックの `GoogleClientId` には同じ Google OAuth 2.0 Web クライアント ID を設定してください。
