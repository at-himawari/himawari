const { randomUUID, createHash } = require("node:crypto");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, TransactWriteCommand, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const { validate, TYPES } = require("./validation");
const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const sns = new SNSClient({});

/** 応答にキャッシュ禁止とJSON形式を設定する。 */
const reply = (statusCode, message) => ({ statusCode, headers: { "content-type": "application/json", "cache-control": "no-store" }, body: JSON.stringify({ message }) });

/** CAPTCHAを検証し、検証不能時も受け付けない。 */
async function verifyCaptcha(token, ip) {
  const response = await fetch("https://api.hcaptcha.com/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret: process.env.HCAPTCHA_SECRET, sitekey: process.env.HCAPTCHA_SITE_KEY, response: token, remoteip: ip }),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error("captcha_unavailable");
  const result = await response.json();
  return result.success === true && result.hostname === new URL(process.env.FRONTEND_ORIGIN).hostname;
}

/** 検証済み投稿とIP制限を単一トランザクションで保存する。 */
exports.handler = async (event) => {
  if (event.requestContext?.http?.method !== "POST" || event.rawPath !== "/submissions") return reply(404, "ページが見つかりません。");
  if (event.headers?.origin !== process.env.FRONTEND_ORIGIN) return reply(403, "この送信元からは受け付けていません。");
  if (!(event.headers?.["content-type"] || "").startsWith("application/json")) return reply(415, "JSONで送信してください。");
  const raw = event.isBase64Encoded ? Buffer.from(event.body || "", "base64").toString("utf8") : event.body || "";
  if (Buffer.byteLength(raw) > 24000) return reply(413, "入力内容が長すぎます。");
  let data;
  try { data = validate(JSON.parse(raw)); } catch (error) { return reply(400, error instanceof SyntaxError ? "入力内容が不正です。" : error.message); }
  const ip = event.requestContext?.http?.sourceIp;
  if (!ip) return reply(400, "送信元を確認できません。");
  try {
    if (!await verifyCaptcha(data.captchaToken, ip)) return reply(400, "スパム対策の認証をやり直してください。");
    const now = Math.floor(Date.now() / 1000);
    const ipHash = createHash("sha256").update(`${process.env.HCAPTCHA_SECRET}:${ip}`).digest("hex");
    const id = randomUUID();
    await db.send(new TransactWriteCommand({ TransactItems: [
      { Put: { TableName: process.env.TABLE_NAME, Item: { id: `RATE#${ipHash}`, expiresAt: now + 60, ttl: now + 3600 }, ConditionExpression: "attribute_not_exists(id) OR expiresAt <= :now", ExpressionAttributeValues: { ":now": now } } },
      { Put: { TableName: process.env.TABLE_NAME, Item: { id, type: data.type, radioName: data.radioName, name: data.name, email: data.email, content: data.content, createdAt: new Date().toISOString(), notificationStatus: "pending" }, ConditionExpression: "attribute_not_exists(id)" } },
    ] }));
    return reply(201, "投稿を受け付けました。ありがとうございます。");
  } catch (error) {
    if (error.name === "TransactionCanceledException" && error.CancellationReasons?.[0]?.Code === "ConditionalCheckFailed") return reply(429, "連続投稿はできません。1分ほど待ってからお試しください。");
    console.error("submission_failed", { errorName: error.name });
    return reply(503, "現在送信できません。時間をおいて再度お試しください。");
  }
};

/** 保存後に管理者へ通知し、失敗したレコードのみ再試行する。 */
exports.notify = async (event) => {
  const batchItemFailures = [];
  for (const record of event.Records) {
    if (record.eventName !== "INSERT" || record.dynamodb.Keys.id.S.startsWith("RATE#")) continue;
    try {
      const { Item: item } = await db.send(new GetCommand({ TableName: process.env.TABLE_NAME, Key: { id: record.dynamodb.Keys.id.S }, ConsistentRead: true }));
      if (!item || item.notificationStatus === "published") continue;
      await sns.send(new PublishCommand({
        TopicArn: process.env.NOTIFICATION_TOPIC_ARN,
        Subject: `[Himawari Project] ${TYPES[item.type]}`,
        Message: `受付ID: ${item.id}\n受付日時: ${item.createdAt}\n種類: ${TYPES[item.type]}\n${item.type === "idea" ? `ラジオネーム（公開可）: ${item.radioName}` : `氏名（非公開）: ${item.name}`}\n返信先メール（非公開）: ${item.email}\n\n${item.content}`,
      }));
      await db.send(new UpdateCommand({ TableName: process.env.TABLE_NAME, Key: { id: item.id }, UpdateExpression: "SET notificationStatus = :published", ExpressionAttributeValues: { ":published": "published" } }));
    } catch (error) {
      console.error("notification_failed", { errorName: error.name });
      batchItemFailures.push({ itemIdentifier: record.dynamodb.SequenceNumber });
    }
  }
  return { batchItemFailures };
};
