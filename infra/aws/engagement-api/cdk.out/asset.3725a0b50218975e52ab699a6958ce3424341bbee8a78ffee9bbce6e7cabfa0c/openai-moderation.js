"use strict";

const MODERATION_ENDPOINT = "https://api.openai.com/v1/moderations";
const MODERATION_MODEL = "omni-moderation-latest";
const MODERATION_TIMEOUT_MS = 4_000;

function getOpenAiApiKey() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return apiKey;
}

async function moderateComment(
  { name, body },
  {
    fetchImpl = fetch,
    getApiKey = getOpenAiApiKey,
    signal = AbortSignal.timeout(MODERATION_TIMEOUT_MS),
  } = {},
) {
  const apiKey = await getApiKey();
  const response = await fetchImpl(MODERATION_ENDPOINT, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODERATION_MODEL,
      input: `表示名: ${name}\nコメント: ${body}`,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`OpenAI moderation request failed with ${response.status}`);
  }

  const result = await response.json();
  const flagged = result?.results?.[0]?.flagged;
  if (typeof flagged !== "boolean") {
    throw new Error("OpenAI moderation response is invalid");
  }

  return { allowed: !flagged };
}

module.exports = {
  MODERATION_ENDPOINT,
  MODERATION_MODEL,
  moderateComment,
};
