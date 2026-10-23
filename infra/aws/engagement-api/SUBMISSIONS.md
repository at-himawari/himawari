# 投稿フォーム

`/submit` → API Gateway `POST /submissions` → 受付Lambda → 専用DynamoDB → DynamoDB Streams → 通知Lambda → Amazon SNS（メール購読）。
氏名・メール・本文を取得する公開APIは設けない。既存のコメントAPIとはテーブル・権限を分離する。

## 入力と対策

- 種類はネタ投稿／サイトに対する意見／業務委託等。
- ネタ投稿はラジオネーム（公開、80文字まで）・メール（非公開、254文字まで）・内容（20〜2000文字）が必須。サイトへの意見と業務委託等は氏名（非公開、100文字まで）・メール（非公開、254文字まで）・内容（20〜2000文字）が必須。名前欄は種別に応じて切り替え、対象外の名前は保存しない。
- 本文の文字数はUnicodeコードポイント数。サーバーで型・長さ・必須・メール形式も検証する。
- hCaptchaのトークンをサーバーで検証し、sitekeyとhostnameも確認する。検証障害時は保存しない。
- ハニーポット、API Gatewayのスロットル、API Gatewayの送信元IPに基づく1分間隔の制限を使用する。IPは秘密値を加えてハッシュ化し、制限レコードのみ約1時間後にTTL削除する。共有回線の利用者も同じ制限を受ける。
- 個人情報や投稿本文はアプリケーションログに出力しない。ラジオネームの「公開」は掲載時に利用できるという意味で、自動公開はしない。

## 設定とデプロイ

1. hCaptcha管理画面で本番ホスト用のサイトを作成し、サイトキーとシークレットを取得する。
2. 通知先メールアドレスを決める。送信元メールアドレスの設定・SES認証は不要。SNS標準の送信元を使用する。
3. デプロイ後、通知先に届くSNSの購読確認メールから購読を承認する。承認前の投稿通知は届かないため、受付を公開する前に必ず承認を完了する。
4. 次を実行する（既存スタックへの影響を避けるため必ずスタック名を指定）。

```sh
cd infra/aws/engagement-api
npm ci
npm ci --prefix submissions
npx cdk synth HimawariSubmissionsStack
# HCAPTCHA_SECRET はシェル履歴に直書きせず環境変数等から渡す。
npx cdk deploy HimawariSubmissionsStack \
  --parameters FrontendOrigin=https://yourdomain.com \
  --parameters HcaptchaSiteKey=YOUR_SITE_KEY \
  --parameters HcaptchaSecret="$HCAPTCHA_SECRET" \
  --parameters NotificationTo=recipient@example.com
```

5. フロントエンドの環境変数 `NEXT_PUBLIC_SUBMISSION_API_URL` に出力された `SubmissionApiUrl`、`NEXT_PUBLIC_HCAPTCHA_SITE_KEY` に同じサイトキーを設定し、フロントエンドを再ビルド・デプロイする。シークレットはフロントエンドへ渡さない。
6. 本番ホストでCAPTCHAを完了し、受付→DynamoDB保存→メール受信、本文内の返信先メールアドレス、連続投稿制限、公開APIから個人情報を取得できないことを確認する。

未設定時はフォームに準備中と表示し送信できない。ローカル表示は可能だが、受付APIは本番HTTPS Originに限定する。

## 通知障害と保存

受付成功はDynamoDBへの保存完了を示し、メール到達を示さない。SNSのPublish成功もメール到達を保証しない。通知は別Lambdaで非同期処理し、失敗は最大10回（最大23時間）再試行する。SNSへの発行成功時は `notificationStatus=published` を記録する。SNS発行後・状態更新前の障害では重複メールがあり得る。通信切断後の手動再送も重複投稿になる場合があるため、フロントエンドは結果不明を表示する。

再試行が尽きた場合はSQSへ失敗メタデータを保持（14日）しCloudWatch Alarmを発報する。アラームの通知先は運用環境で設定する。SQSのストリーム情報とテーブルの `notificationStatus=pending` の投稿を照合し、SNS設定・権限を修正後、管理者が該当レコードの通知を再実行する。投稿はテーブルに残るが、ストリーム自体は24時間で失効する。

投稿データは自動削除しない。運用開始前に保存期間と閲覧権限を決め、Strapi管理のプライバシーポリシーへ利用目的・保存・メール通知・hCaptcha利用を反映する。テーブルには暗号化、PITR、スタック削除時の保持を設定する。

## 公式資料

- https://docs.hcaptcha.com/ （サーバー検証）
- https://docs.aws.amazon.com/lambda/latest/dg/with-ddb.html （非同期処理と再試行）
- https://docs.aws.amazon.com/sns/latest/dg/sns-email-notifications.html （SNSメール購読と承認）

SNSの通知は標準形式のメールであり、送信元やReply-Toは変更しない。投稿者への返信は本文に記載されたメールアドレス宛てに行う。通知トピックには投稿内容と個人情報が含まれるため、購読追加権限は管理者に限定する。購読承認の状態とSNSの配信失敗メトリクスは別途監視する。Lambdaの再試行・失敗キューはSNSへの発行失敗を対象とし、発行成功後のメール配送失敗は対象外である。
