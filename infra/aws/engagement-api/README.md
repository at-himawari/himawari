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
  - 表示名と本文を保存前にOpenAI Moderation APIで検査し、該当時は `422` で拒否
  - API全体の `flagged` 判定に加え、`sexual` カテゴリのスコアが設定閾値以上の場合も拒否（初期値 `0.25`）
  - API障害やタイムアウトで審査できない場合は、未審査のまま保存せず `503` で拒否
  - 保存成功後、記事・コメント・IPアドレス・認証済みメールアドレスをCloudWatch Logsへ監査記録
- `DELETE /articles/{slug}/comments/{commentId}`
  - コメント削除。Googleログイン必須。投稿したGoogleアカウント本人のみ削除可能
  - 削除成功後、削除前のコメント内容と削除操作時のIPアドレス・認証済みメールアドレスをCloudWatch Logsへ監査記録

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
export OPENAI_API_KEY='YOUR_OPENAI_API_KEY'
npx cdk bootstrap
npx cdk deploy \
  --parameters FrontendOrigin=https://yourdomain.com \
  --parameters CommentAutoPublish=true \
  --parameters ModerationSexualScoreThreshold=0.25 \
  --parameters OpenAiApiKey="$OPENAI_API_KEY" \
  --parameters GoogleClientId=your-google-oauth-client-id.apps.googleusercontent.com
```

OpenAI APIキーは、`NoEcho`を設定したCloudFormationパラメータを経由してLambdaの `OPENAI_API_KEY` 環境変数へ設定します。審査のため表示名とコメント本文がOpenAIへ送信されますが、Googleアカウントのメールアドレスなどは送信しません。

`ModerationSexualScoreThreshold` は `0` から `1` の範囲で指定します。値を小さくすると性的表現を厳しく判定します。OpenAIのモデル更新によりスコア傾向が変わる可能性があるため、CloudWatch Logsに記録される判定結果とスコアを確認しながら調整してください。通常のモデレーション判定ログには本文や表示名を含めませんが、下記の監査イベントには記録します。

## コメント監査ログ

保存に成功したコメントは `comment.created`、削除に成功したコメントは `comment.deleted` イベントとして、専用CloudWatch Logsロググループ `/himawari/engagement-api` に記録します。保持期間は365日で、ロググループの削除保護を有効にします。記録項目は記事slug、コメントID、表示名、本文、公開状態、API Gatewayが取得した操作時の送信元IPアドレス、Google認証済みメールアドレス、Google subject ID、訪問者ID、User-Agentです。削除イベントには元の投稿日時も含めます。モデレーション情報は監査イベントに含めません。公開APIから監査ログを取得する機能はありません。

CloudWatch Logs Insightsで記事別に確認する例です。

```text
fields @timestamp, message.articleSlug, message.email, message.sourceIp,
  message.commentName, message.commentBody, message.commentId
| filter message.eventType in ["comment.created", "comment.deleted"]
| filter message.articleSlug = "記事slug"
| sort @timestamp desc
```

メールアドレスで検索する場合は、2つ目の `filter` を次のように変更します。

```text
| filter message.email = "reader@example.com"
```

監査ログには個人情報とコメント本文が含まれるため、CloudWatch Logsの閲覧権限は運用上必要な担当者だけに制限してください。サイト上のプライバシーポリシーはStrapiで管理されているため、IPアドレス、メールアドレス、投稿内容、利用目的、保持期間を収集前に反映してください。

デプロイ後に出力される `EngagementApiUrl` を、フロント側の `NEXT_PUBLIC_ENGAGEMENT_API_URL` に設定します。フロント側の `NEXT_PUBLIC_GOOGLE_CLIENT_ID` と、このスタックの `GoogleClientId` には同じ Google OAuth 2.0 Web クライアント ID を設定してください。
