"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  DEFAULT_SEXUAL_SCORE_THRESHOLD,
  MODERATION_ENDPOINT,
  MODERATION_MODEL,
  getSexualScoreThreshold,
  moderateComment,
} = require("./openai-moderation");

function moderationResponse(flagged, sexualScore = 0.01) {
  return {
    ok: true,
    json: async () => ({
      results: [{ flagged, category_scores: { sexual: sexualScore } }],
    }),
  };
}

test("allows a comment when OpenAI does not flag it", async () => {
  const fetchImpl = async () => moderationResponse(false);

  assert.deepEqual(
    await moderateComment(
      { name: "読者", body: "参考になりました。" },
      { fetchImpl, getApiKey: async () => "test-key", signal: undefined },
    ),
    {
      allowed: true,
      flagged: false,
      sexualScore: 0.01,
      sexualThreshold: DEFAULT_SEXUAL_SCORE_THRESHOLD,
    },
  );
});

test("rejects a comment when OpenAI flags it", async () => {
  const fetchImpl = async () => moderationResponse(true);

  assert.deepEqual(
    await moderateComment(
      { name: "読者", body: "攻撃的な投稿" },
      { fetchImpl, getApiKey: async () => "test-key", signal: undefined },
    ),
    {
      allowed: false,
      flagged: true,
      sexualScore: 0.01,
      sexualThreshold: DEFAULT_SEXUAL_SCORE_THRESHOLD,
    },
  );
});

test("rejects sexual content below the model's overall flagging threshold", async () => {
  const fetchImpl = async () => moderationResponse(false, 0.3);

  assert.deepEqual(
    await moderateComment(
      { name: "読者", body: "性的な冗談" },
      { fetchImpl, getApiKey: async () => "test-key", signal: undefined },
    ),
    {
      allowed: false,
      flagged: false,
      sexualScore: 0.3,
      sexualThreshold: DEFAULT_SEXUAL_SCORE_THRESHOLD,
    },
  );
});

test("accepts a custom sexual-content threshold", async () => {
  const fetchImpl = async () => moderationResponse(false, 0.3);

  assert.deepEqual(
    await moderateComment(
      { name: "読者", body: "本文" },
      {
        fetchImpl,
        getApiKey: async () => "test-key",
        getSexualThreshold: async () => 0.5,
        signal: undefined,
      },
    ),
    {
      allowed: true,
      flagged: false,
      sexualScore: 0.3,
      sexualThreshold: 0.5,
    },
  );
});

test("rejects an invalid configured sexual-content threshold", () => {
  const originalValue = process.env.MODERATION_SEXUAL_SCORE_THRESHOLD;
  process.env.MODERATION_SEXUAL_SCORE_THRESHOLD = "1.5";
  try {
    assert.throws(getSexualScoreThreshold, /number between 0 and 1/);
  } finally {
    if (originalValue === undefined) {
      delete process.env.MODERATION_SEXUAL_SCORE_THRESHOLD;
    } else {
      process.env.MODERATION_SEXUAL_SCORE_THRESHOLD = originalValue;
    }
  }
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
