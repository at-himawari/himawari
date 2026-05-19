"use strict";

const crypto = require("node:crypto");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  TransactWriteCommand,
} = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = process.env.TABLE_NAME;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "*";
const COMMENT_AUTO_PUBLISH = process.env.COMMENT_AUTO_PUBLISH !== "false";
const VISITOR_COOKIE_NAME = "himawari_vid";
const MAX_COMMENTS = 50;

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

exports.handler = async (event) => {
  try {
    const method = event.requestContext?.http?.method || "GET";
    const route = normalizePath(event.rawPath || "/");
    const visitorCookie = getCookie(event.cookies || [], VISITOR_COOKIE_NAME);
    const visitorId = visitorCookie || crypto.randomUUID();
    const slug = getSlugFromPath(route);
    const setVisitorCookie = !visitorCookie;

    if (method === "OPTIONS") {
      return response(204, null, { setVisitorCookie, visitorId });
    }

    if (route === "/health" && method === "GET") {
      return response(200, { ok: true }, { setVisitorCookie, visitorId });
    }

    if (!slug) {
      return response(
        404,
        { message: "Not Found" },
        { setVisitorCookie, visitorId },
      );
    }

    if (route === `/articles/${slug}/engagement` && method === "GET") {
      const body = await getEngagement(slug, visitorId);
      return response(200, body, { setVisitorCookie, visitorId });
    }

    if (route === `/articles/${slug}/likes` && method === "POST") {
      const body = await likeArticle(slug, visitorId);
      return response(200, body, { setVisitorCookie, visitorId });
    }

    if (route === `/articles/${slug}/likes` && method === "DELETE") {
      const body = await unlikeArticle(slug, visitorId);
      return response(200, body, { setVisitorCookie, visitorId });
    }

    if (route === `/articles/${slug}/comments` && method === "POST") {
      const payload = parseJson(event.body);
      const body = await createComment(slug, visitorId, payload);
      return response(201, body, { setVisitorCookie, visitorId });
    }

    return response(
      404,
      { message: "Not Found" },
      { setVisitorCookie, visitorId },
    );
  } catch (error) {
    const statusCode =
      typeof error?.statusCode === "number" ? error.statusCode : 500;

    return response(statusCode, {
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

async function getEngagement(slug, visitorId) {
  const [metaResult, likeResult, commentsResult] = await Promise.all([
    client.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: articleMetaKey(slug),
      }),
    ),
    client.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: likeKey(slug, visitorId),
      }),
    ),
    client.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :commentPrefix)",
        ExpressionAttributeValues: {
          ":pk": articlePartitionKey(slug),
          ":commentPrefix": "COMMENT#",
          ":published": "published",
        },
        FilterExpression: "#status = :published",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ScanIndexForward: false,
        Limit: MAX_COMMENTS,
      }),
    ),
  ]);

  const meta = metaResult.Item || {};
  const comments = (commentsResult.Items || []).map(serializeComment);

  return {
    slug,
    likeCount: meta.likeCount || 0,
    commentCount: meta.commentCount || comments.length,
    viewerHasLiked: Boolean(likeResult.Item),
    comments,
  };
}

async function likeArticle(slug, visitorId) {
  const now = new Date().toISOString();

  try {
    await client.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Put: {
              TableName: TABLE_NAME,
              Item: {
                ...likeKey(slug, visitorId),
                entityType: "like",
                createdAt: now,
                articleSlug: slug,
                visitorId,
              },
              ConditionExpression:
                "attribute_not_exists(PK) AND attribute_not_exists(SK)",
            },
          },
          {
            Update: {
              TableName: TABLE_NAME,
              Key: articleMetaKey(slug),
              UpdateExpression:
                "SET entityType = :entityType, articleSlug = :slug, updatedAt = :updatedAt, likeCount = if_not_exists(likeCount, :zero) + :inc, commentCount = if_not_exists(commentCount, :zero)",
              ExpressionAttributeValues: {
                ":entityType": "article-meta",
                ":slug": slug,
                ":updatedAt": now,
                ":zero": 0,
                ":inc": 1,
              },
            },
          },
        ],
      }),
    );
  } catch (error) {
    if (isConditionalFailure(error)) {
      const current = await getEngagement(slug, visitorId);
      return {
        ...current,
        alreadyLiked: true,
      };
    }
    throw error;
  }

  return getEngagement(slug, visitorId);
}

async function unlikeArticle(slug, visitorId) {
  const now = new Date().toISOString();

  try {
    await client.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Delete: {
              TableName: TABLE_NAME,
              Key: likeKey(slug, visitorId),
              ConditionExpression: "attribute_exists(PK) AND attribute_exists(SK)",
            },
          },
          {
            Update: {
              TableName: TABLE_NAME,
              Key: articleMetaKey(slug),
              ConditionExpression:
                "attribute_exists(PK) AND likeCount >= :minLikes",
              UpdateExpression:
                "SET updatedAt = :updatedAt, likeCount = likeCount - :dec",
              ExpressionAttributeValues: {
                ":updatedAt": now,
                ":dec": 1,
                ":minLikes": 1,
              },
            },
          },
        ],
      }),
    );
  } catch (error) {
    if (isConditionalFailure(error)) {
      const current = await getEngagement(slug, visitorId);
      return {
        ...current,
        alreadyUnliked: true,
      };
    }
    throw error;
  }

  return getEngagement(slug, visitorId);
}

async function createComment(slug, visitorId, payload) {
  const name = String(payload?.name || "").trim();
  const body = String(payload?.body || "").trim();
  const website = String(payload?.website || "").trim();

  if (website) {
    throw badRequest("Invalid comment");
  }
  if (!name || name.length > 40) {
    throw badRequest("Name must be between 1 and 40 characters");
  }
  if (!body || body.length > 1000) {
    throw badRequest("Comment must be between 1 and 1000 characters");
  }

  const now = new Date().toISOString();
  const commentId = crypto.randomUUID();
  const status = COMMENT_AUTO_PUBLISH ? "published" : "pending";

  await client.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: articlePartitionKey(slug),
        SK: `COMMENT#${now}#${commentId}`,
        entityType: "comment",
        articleSlug: slug,
        commentId,
        name,
        body,
        status,
        createdAt: now,
        visitorId,
      },
    }),
  );

  if (status === "published") {
    await client.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Update: {
              TableName: TABLE_NAME,
              Key: articleMetaKey(slug),
              UpdateExpression:
                "SET entityType = :entityType, articleSlug = :slug, updatedAt = :updatedAt, likeCount = if_not_exists(likeCount, :zero), commentCount = if_not_exists(commentCount, :zero) + :inc",
              ExpressionAttributeValues: {
                ":entityType": "article-meta",
                ":slug": slug,
                ":updatedAt": now,
                ":zero": 0,
                ":inc": 1,
              },
            },
          },
        ],
      }),
    );
  }

  return {
    accepted: true,
    moderation: status === "pending",
    comment: serializeComment({
      commentId,
      name,
      body,
      createdAt: now,
      status,
    }),
  };
}

function articlePartitionKey(slug) {
  return `ARTICLE#${slug}`;
}

function articleMetaKey(slug) {
  return {
    PK: articlePartitionKey(slug),
    SK: "META",
  };
}

function likeKey(slug, visitorId) {
  return {
    PK: articlePartitionKey(slug),
    SK: `LIKE#${visitorId}`,
  };
}

function serializeComment(item) {
  return {
    id: item.commentId,
    name: item.name,
    body: item.body,
    createdAt: item.createdAt,
    status: item.status,
  };
}

function normalizePath(path) {
  if (!path) {
    return "/";
  }

  const normalized =
    path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

function getSlugFromPath(path) {
  const match = path.match(/^\/articles\/([^/]+)\/(engagement|likes|comments)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function parseJson(body) {
  if (!body) {
    return {};
  }

  try {
    return JSON.parse(body);
  } catch {
    throw badRequest("Request body must be valid JSON");
  }
}

function getCookie(cookies, name) {
  for (const cookie of cookies) {
    const [cookieName, ...rest] = cookie.split("=");
    if (cookieName === name) {
      return rest.join("=");
    }
  }

  return null;
}

function response(statusCode, body, options = {}) {
  const headers = {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": FRONTEND_ORIGIN,
    "access-control-allow-credentials": "true",
    "access-control-allow-methods": "GET,POST,DELETE,OPTIONS",
    "access-control-allow-headers": "content-type",
    vary: "origin",
  };

  return {
    statusCode,
    headers,
    cookies:
      options.setVisitorCookie && options.visitorId
        ? [
            serializeCookie(
              VISITOR_COOKIE_NAME,
              options.visitorId,
              60 * 60 * 24 * 365,
            ),
          ]
        : undefined,
    body: body === null ? "" : JSON.stringify(body),
  };
}

function serializeCookie(name, value, maxAge) {
  const attributes = [
    `${name}=${value}`,
    "Path=/",
    `Max-Age=${maxAge}`,
    "HttpOnly",
    "SameSite=Lax",
  ];

  if (FRONTEND_ORIGIN.startsWith("https://")) {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}

function badRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function isConditionalFailure(error) {
  const transactionReasons = error?.CancellationReasons || [];
  return (
    error?.name === "ConditionalCheckFailedException" ||
    error?.name === "TransactionCanceledException" ||
    transactionReasons.some((reason) => reason?.Code === "ConditionalCheckFailed")
  );
}
