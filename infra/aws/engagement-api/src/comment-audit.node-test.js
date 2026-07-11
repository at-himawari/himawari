"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  createCommentAuditEvent,
  createCommentDeletedAuditEvent,
  getRequestAuditContext,
  writeCommentAuditLog,
} = require("./comment-audit");

test("uses API Gateway source IP instead of forwarded headers", () => {
  assert.deepEqual(
    getRequestAuditContext({
      requestContext: {
        requestId: "request-1",
        http: { sourceIp: "203.0.113.10" },
      },
      headers: {
        "x-forwarded-for": "198.51.100.20",
        "User-Agent": "Audit test browser",
      },
    }),
    {
      sourceIp: "203.0.113.10",
      requestId: "request-1",
      userAgent: "Audit test browser",
    },
  );
});

test("creates an audit event containing the article, comment, IP, and email", () => {
  const event = createCommentAuditEvent({
    slug: "sample-article",
    commentId: "comment-1",
    name: "読者",
    body: "コメント本文",
    status: "published",
    createdAt: "2026-07-11T00:00:00.000Z",
    visitorId: "visitor-1",
    user: { email: "reader@example.com", googleSub: "google-1" },
    request: {
      sourceIp: "203.0.113.10",
      requestId: "request-1",
      userAgent: "Audit test browser",
    },
  });

  assert.equal(event.eventType, "comment.created");
  assert.equal(event.articleSlug, "sample-article");
  assert.equal(event.commentBody, "コメント本文");
  assert.equal(event.sourceIp, "203.0.113.10");
  assert.equal(event.email, "reader@example.com");
  assert.equal("moderation" in event, false);
});

test("creates a deletion audit event with the original comment", () => {
  const event = createCommentDeletedAuditEvent({
    slug: "sample-article",
    comment: {
      commentId: "comment-1",
      name: "読者",
      body: "削除前の本文",
      status: "published",
      createdAt: "2026-07-10T00:00:00.000Z",
      visitorId: "visitor-1",
    },
    deletedAt: "2026-07-11T00:00:00.000Z",
    user: { email: "reader@example.com", googleSub: "google-1" },
    request: {
      sourceIp: "203.0.113.10",
      requestId: "request-2",
      userAgent: "Audit test browser",
    },
  });

  assert.equal(event.eventType, "comment.deleted");
  assert.equal(event.commentBody, "削除前の本文");
  assert.equal(event.commentCreatedAt, "2026-07-10T00:00:00.000Z");
  assert.equal(event.occurredAt, "2026-07-11T00:00:00.000Z");
  assert.equal(event.email, "reader@example.com");
  assert.equal("moderation" in event, false);
});

test("writes one structured object without interpolating user input", () => {
  const calls = [];
  const event = { eventType: "comment.created", commentBody: "line1\nline2" };

  writeCommentAuditLog(event, (value) => calls.push(value));

  assert.deepEqual(calls, [event]);
});
