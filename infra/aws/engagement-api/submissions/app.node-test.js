const { test, beforeEach, mock } = require("node:test");
const assert = require("node:assert/strict");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const { SNSClient } = require("@aws-sdk/client-sns");
const { handler, notify } = require("./app");
const body = { type: "idea", radioName: "読者", email: "reader@example.com", content: "提案", captchaToken: "token" };
const event = () => ({ rawPath: "/submissions", headers: { origin: "https://example.com", "content-type": "application/json" }, requestContext: { http: { method: "POST", sourceIp: "192.0.2.1" } }, body: JSON.stringify(body) });
beforeEach(() => {
  mock.restoreAll();
  Object.assign(process.env, { FRONTEND_ORIGIN: "https://example.com", HCAPTCHA_SECRET: "secret", HCAPTCHA_SITE_KEY: "key", TABLE_NAME: "table", NOTIFICATION_TOPIC_ARN: "arn:aws:sns:ap-northeast-1:123456789012:submissions" });
});
test("CAPTCHA検証後にのみ保存し、個人情報を返さない", async () => {
  mock.method(global, "fetch", async () => ({ ok: true, json: async () => ({ success: true, hostname: "example.com" }) }));
  const send = mock.method(DynamoDBDocumentClient.prototype, "send", async (command) => {
    const items = command.input.TransactItems;
    assert.equal(items[1].Put.Item.notificationStatus, "pending");
    assert.equal(items[1].Put.Item.captchaToken, undefined);
    assert.match(items[0].Put.ConditionExpression, /expiresAt/);
  });
  const result = await handler(event());
  assert.equal(result.statusCode, 201); assert.equal(send.mock.callCount(), 1);
  assert.doesNotMatch(result.body, /読者|提案/);
});
test("CAPTCHA失敗、別ホスト、障害時は保存しない", async () => {
  const send = mock.method(DynamoDBDocumentClient.prototype, "send", async () => {});
  for (const result of [{ success: false }, { success: true, hostname: "evil.example" }]) {
    mock.method(global, "fetch", async () => ({ ok: true, json: async () => result }));
    assert.equal((await handler(event())).statusCode, 400);
  }
  mock.method(global, "fetch", async () => { throw new Error("timeout"); });
  assert.equal((await handler(event())).statusCode, 503); assert.equal(send.mock.callCount(), 0);
});
test("Origin不一致と不正JSONは拒否する", async () => {
  assert.equal((await handler({ ...event(), headers: { origin: "https://evil.example" } })).statusCode, 403);
  assert.equal((await handler({ ...event(), body: "{" })).statusCode, 400);
});
test("IP制限の競合は429を返す", async () => {
  mock.method(global, "fetch", async () => ({ ok: true, json: async () => ({ success: true, hostname: "example.com" }) }));
  mock.method(DynamoDBDocumentClient.prototype, "send", async () => { throw Object.assign(new Error(), { name: "TransactionCanceledException", CancellationReasons: [{ Code: "ConditionalCheckFailed" }] }); });
  assert.equal((await handler(event())).statusCode, 429);
});
const record = { eventName: "INSERT", dynamodb: { Keys: { id: { S: "id" } }, SequenceNumber: "123" } };
test("通知失敗は再試行対象として返す", async () => {
  mock.method(DynamoDBDocumentClient.prototype, "send", async () => ({ Item: { id: "id", type: "idea", email: "reader@example.com", notificationStatus: "pending" } }));
  mock.method(SNSClient.prototype, "send", async () => { throw new Error("sns"); });
  assert.deepEqual(await notify({ Records: [record] }), { batchItemFailures: [{ itemIdentifier: "123" }] });
});
test("通知済みのレコードとIP制限レコードは送信しない", async () => {
  mock.method(DynamoDBDocumentClient.prototype, "send", async () => ({ Item: { notificationStatus: "published" } }));
  const send = mock.method(SNSClient.prototype, "send", async () => {});
  assert.deepEqual(await notify({ Records: [record, { ...record, dynamodb: { Keys: { id: { S: "RATE#ip" } } } }] }), { batchItemFailures: [] });
  assert.equal(send.mock.callCount(), 0);
});
test("SNSへの発行成功後に発行済み状態を保存する", async () => {
  const commands = [];
  mock.method(DynamoDBDocumentClient.prototype, "send", async (command) => { commands.push(command); return { Item: { id: "id", type: "idea", email: "reader@example.com", notificationStatus: "pending" } }; });
  mock.method(SNSClient.prototype, "send", async (command) => { assert.match(command.input.Message, /返信先メール（非公開）: reader@example.com/); assert.equal(command.input.TopicArn, process.env.NOTIFICATION_TOPIC_ARN); });
  assert.deepEqual(await notify({ Records: [record] }), { batchItemFailures: [] });
  assert.equal(commands[1].input.ExpressionAttributeValues[":published"], "published");
});
for (const type of ["feedback", "business"]) {
  test(`${type}の通知には氏名を記載しラジオネームを含めない`, async () => {
    mock.method(DynamoDBDocumentClient.prototype, "send", async () => ({ Item: { id: "id", type, name: "担当者", email: "reader@example.com", notificationStatus: "pending" } }));
    mock.method(SNSClient.prototype, "send", async (command) => {
      assert.match(command.input.Message, /氏名（非公開）: 担当者/);
      assert.doesNotMatch(command.input.Message, /ラジオネーム/);
    });
    assert.deepEqual(await notify({ Records: [record] }), { batchItemFailures: [] });
  });
}
