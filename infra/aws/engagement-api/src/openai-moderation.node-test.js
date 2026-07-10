"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  MODERATION_ENDPOINT,
  MODERATION_MODEL,
  moderateComment,
} = require("./openai-moderation");

function moderationResponse(flagged) {
  return {
    ok: true,
    json: async () => ({ results: [{ flagged }] }),
  };
}

test("allows a comment when OpenAI does not flag it", async () => {
  const fetchImpl = async () => moderationResponse(false);

  assert.deepEqual(
    await moderateComment(
      { name: "読者", body: "参考になりました。" },
      { fetchImpl, getApiKey: async () => "test-key", signal: undefined },
    ),
    { allowed: true },
  );
});

test("rejects a comment when OpenAI flags it", async () => {
  const fetchImpl = async () => moderationResponse(true);

  assert.deepEqual(
    await moderateComment(
      { name: "読者", body: "攻撃的な投稿" },
      { fetchImpl, getApiKey: async () => "test-key", signal: undefined },
    ),
    { allowed: false },
  );
});

test("sends the display name and body to the current moderation model", async () => {
  let request;
  const fetchImpl = async (url, options) => {
    request = { url, options };
    return moderationResponse(false);
  };

  await moderateComment(
    { name: "表示名", body: "本文" },
    { fetchImpl, getApiKey: async () => "secret-key", signal: undefined },
  );

  assert.equal(request.url, MODERATION_ENDPOINT);
  assert.equal(request.options.headers.authorization, "Bearer secret-key");
  assert.deepEqual(JSON.parse(request.options.body), {
    model: MODERATION_MODEL,
    input: "表示名: 表示名\nコメント: 本文",
  });
});

test("fails closed when OpenAI returns an error", async () => {
  await assert.rejects(
    moderateComment(
      { name: "読者", body: "本文" },
      {
        fetchImpl: async () => ({ ok: false, status: 429 }),
        getApiKey: async () => "test-key",
        signal: undefined,
      },
    ),
    /failed with 429/,
  );
});
