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
const { moderateComment } = require("./openai-moderation");

const TABLE_NAME = process.env.TABLE_NAME;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "*";
const COMMENT_AUTO_PUBLISH = process.env.COMMENT_AUTO_PUBLISH !== "false";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CERTS_URL = "https://www.googleapis.com/oauth2/v3/certs";
const GOOGLE_ISSUERS = new Set([
  "accounts.google.com",
  "https://accounts.google.com",
]);
const VISITOR_COOKIE_NAME = "himawari_vid";
const MAX_COMMENTS = 50;

let googleJwksCache = {
  expiresAt: 0,
  keys: [],
};

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
      const user = await getAuthenticatedUser(event, { required: false });
      const body = await getEngagement(slug, user?.googleSub);
      return response(200, body, { setVisitorCookie, visitorId });
    }

    if (route === `/articles/${slug}/likes` && method === "POST") {
      const user = await getAuthenticatedUser(event, { required: true });
      const body = await likeArticle(slug, user);
      return response(200, body, { setVisitorCookie, visitorId });
    }

    if (route === `/articles/${slug}/likes` && method === "DELETE") {
      const user = await getAuthenticatedUser(event, { required: true });
      const body = await unlikeArticle(slug, user);
      return response(200, body, { setVisitorCookie, visitorId });
    }

    if (route === `/articles/${slug}/comments` && method === "POST") {
      const user = await getAuthenticatedUser(event, { required: true });
      const payload = parseJson(event.body);
      const body = await createComment(slug, visitorId, user, payload);
      return response(201, body, { setVisitorCookie, visitorId });
    }

    const commentId = getCommentIdFromPath(route);
    if (commentId && method === "DELETE") {
      const user = await getAuthenticatedUser(event, { required: true });
      const body = await deleteComment(slug, commentId, user);
      return response(200, body, { setVisitorCookie, visitorId });
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

async function getEngagement(slug, googleSub) {
  const [metaResult, likeResult, commentsResult] = await Promise.all([
    client.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: articleMetaKey(slug),
      }),
    ),
    googleSub
      ? client.send(
          new GetCommand({
            TableName: TABLE_NAME,
            Key: likeKey(slug, googleSub),
          }),
        )
      : Promise.resolve({ Item: null }),
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
  const comments = (commentsResult.Items || []).map((comment) =>
    serializeComment(comment, googleSub),
  );

  return {
    slug,
    likeCount: meta.likeCount || 0,
    commentCount: meta.commentCount || comments.length,
    viewerHasLiked: Boolean(likeResult.Item),
    comments,
  };
}

async function likeArticle(slug, user) {
  const now = new Date().toISOString();

  try {
    await client.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Put: {
              TableName: TABLE_NAME,
              Item: {
                ...likeKey(slug, user.googleSub),
                entityType: "like",
                createdAt: now,
                articleSlug: slug,
                googleSub: user.googleSub,
                email: user.email,
                emailVerified: user.emailVerified,
                name: user.name,
                picture: user.picture,
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
      const current = await getEngagement(slug, user.googleSub);
      return {
        ...current,
        alreadyLiked: true,
      };
    }
    throw error;
  }

  return getEngagement(slug, user.googleSub);
}

async function unlikeArticle(slug, user) {
  const now = new Date().toISOString();

  try {
    await client.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Delete: {
              TableName: TABLE_NAME,
              Key: likeKey(slug, user.googleSub),
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
      const current = await getEngagement(slug, user.googleSub);
      return {
        ...current,
        alreadyUnliked: true,
      };
    }
    throw error;
  }

  return getEngagement(slug, user.googleSub);
}

async function createComment(slug, visitorId, user, payload) {
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

  let moderation;
  try {
    moderation = await moderateComment({ name, body });
  } catch (error) {
    console.error("Comment moderation failed", error);
    throw serviceUnavailable(
      "コメントを現在審査できません。しばらくしてから再度お試しください。",
    );
  }
  if (!moderation.allowed) {
    throw unprocessableEntity(
      "コメントに不適切な表現が含まれているため、投稿できません。",
    );
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
        googleSub: user.googleSub,
        email: user.email,
        emailVerified: user.emailVerified,
        googleName: user.name,
        picture: user.picture,
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
    comment: serializeComment(
      {
        commentId,
        name,
        body,
        createdAt: now,
        status,
        googleSub: user.googleSub,
      },
      user.googleSub,
    ),
  };
}

async function deleteComment(slug, commentId, user) {
  const comment = await findCommentById(slug, commentId);

  if (!comment) {
    throw notFound("Comment not found");
  }
  if (comment.googleSub !== user.googleSub) {
    throw forbidden("You cannot delete this comment");
  }

  const now = new Date().toISOString();
  const transactionItems = [
    {
      Delete: {
        TableName: TABLE_NAME,
        Key: {
          PK: comment.PK,
          SK: comment.SK,
        },
        ConditionExpression:
          "attribute_exists(PK) AND attribute_exists(SK) AND googleSub = :googleSub",
        ExpressionAttributeValues: {
          ":googleSub": user.googleSub,
        },
      },
    },
  ];

  if (comment.status === "published") {
    transactionItems.push({
      Update: {
        TableName: TABLE_NAME,
        Key: articleMetaKey(slug),
        ConditionExpression:
          "attribute_exists(PK) AND commentCount >= :minComments",
        UpdateExpression:
          "SET updatedAt = :updatedAt, commentCount = commentCount - :dec",
        ExpressionAttributeValues: {
          ":updatedAt": now,
          ":dec": 1,
          ":minComments": 1,
        },
      },
    });
  }

  try {
    await client.send(
      new TransactWriteCommand({
        TransactItems: transactionItems,
      }),
    );
  } catch (error) {
    if (isConditionalFailure(error)) {
      throw forbidden("You cannot delete this comment");
    }
    throw error;
  }

  return getEngagement(slug, user.googleSub);
}

async function findCommentById(slug, commentId) {
  const result = await client.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :commentPrefix)",
      FilterExpression: "commentId = :commentId",
      ExpressionAttributeValues: {
        ":pk": articlePartitionKey(slug),
        ":commentPrefix": "COMMENT#",
        ":commentId": commentId,
      },
    }),
  );

  return result.Items?.[0] || null;
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

function serializeComment(item, viewerGoogleSub) {
  const comment = {
    id: item.commentId,
    name: item.name,
    body: item.body,
    createdAt: item.createdAt,
    status: item.status,
  };

  if (viewerGoogleSub && item.googleSub === viewerGoogleSub) {
    comment.canDelete = true;
  }

  return comment;
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
  const match = path.match(
    /^\/articles\/([^/]+)\/(?:engagement|likes|comments(?:\/[^/]+)?)$/,
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function getCommentIdFromPath(path) {
  const match = path.match(/^\/articles\/[^/]+\/comments\/([^/]+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

async function getAuthenticatedUser(event, { required }) {
  const token = getBearerToken(event.headers || {});

  if (!token) {
    if (required) {
      throw unauthorized("Google login is required");
    }
    return null;
  }

  return verifyGoogleIdToken(token);
}

function getBearerToken(headers) {
  const authorization =
    headers.authorization || headers.Authorization || headers.AUTHORIZATION || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : "";
}

async function verifyGoogleIdToken(token) {
  if (!GOOGLE_CLIENT_ID) {
    throw serverError("GOOGLE_CLIENT_ID is not configured");
  }

  const tokenParts = token.split(".");
  if (tokenParts.length !== 3) {
    throw unauthorized("Invalid Google ID token");
  }

  const [encodedHeader, encodedPayload, encodedSignature] = tokenParts;
  const header = parseJwtPart(encodedHeader);
  const payload = parseJwtPart(encodedPayload);

  if (header.alg !== "RS256" || !header.kid) {
    throw unauthorized("Invalid Google ID token");
  }
  if (!GOOGLE_ISSUERS.has(payload.iss)) {
    throw unauthorized("Invalid Google token issuer");
  }
  if (payload.aud !== GOOGLE_CLIENT_ID) {
    throw unauthorized("Invalid Google token audience");
  }
  if (!payload.exp || payload.exp * 1000 <= Date.now()) {
    throw unauthorized("Google ID token has expired");
  }
  if (!payload.sub || !payload.email || payload.email_verified !== true) {
    throw unauthorized("Google account email is not verified");
  }

  const key = await findGoogleJwk(header.kid);
  const publicKey = crypto.createPublicKey({
    key,
    format: "jwk",
  });
  const isValidSignature = crypto.verify(
    "RSA-SHA256",
    Buffer.from(`${encodedHeader}.${encodedPayload}`),
    publicKey,
    base64UrlToBuffer(encodedSignature),
  );

  if (!isValidSignature) {
    throw unauthorized("Invalid Google ID token signature");
  }

  return {
    googleSub: payload.sub,
    email: payload.email,
    emailVerified: payload.email_verified,
    name: payload.name || payload.email,
    picture: payload.picture,
  };
}

async function findGoogleJwk(kid) {
  const now = Date.now();

  if (googleJwksCache.expiresAt <= now || !googleJwksCache.keys.length) {
    const response = await fetch(GOOGLE_CERTS_URL);
    if (!response.ok) {
      throw serverError("Failed to fetch Google public keys");
    }

    const cacheControl = response.headers.get("cache-control") || "";
    const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
    const maxAgeMs = maxAgeMatch ? Number(maxAgeMatch[1]) * 1000 : 60 * 60 * 1000;
    const body = await response.json();

    googleJwksCache = {
      expiresAt: now + maxAgeMs,
      keys: Array.isArray(body.keys) ? body.keys : [],
    };
  }

  const key = googleJwksCache.keys.find((candidate) => candidate.kid === kid);
  if (!key) {
    throw unauthorized("Unknown Google ID token key");
  }

  return key;
}

function parseJwtPart(value) {
  try {
    return JSON.parse(base64UrlToBuffer(value).toString("utf8"));
  } catch {
    throw unauthorized("Invalid Google ID token");
  }
}

function base64UrlToBuffer(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );
  return Buffer.from(padded, "base64");
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
    "access-control-allow-headers": "authorization,content-type",
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

function unauthorized(message) {
  const error = new Error(message);
  error.statusCode = 401;
  return error;
}

function forbidden(message) {
  const error = new Error(message);
  error.statusCode = 403;
  return error;
}

function notFound(message) {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
}

function unprocessableEntity(message) {
  const error = new Error(message);
  error.statusCode = 422;
  return error;
}

function serverError(message) {
  const error = new Error(message);
  error.statusCode = 500;
  return error;
}

function serviceUnavailable(message) {
  const error = new Error(message);
  error.statusCode = 503;
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
