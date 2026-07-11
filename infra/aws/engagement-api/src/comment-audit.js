"use strict";

const MAX_USER_AGENT_LENGTH = 512;

function getRequestAuditContext(event) {
  return {
    sourceIp: normalizeLogValue(event?.requestContext?.http?.sourceIp, 64),
    requestId: normalizeLogValue(event?.requestContext?.requestId, 128),
    userAgent: normalizeLogValue(
      getHeader(event?.headers || {}, "user-agent"),
      MAX_USER_AGENT_LENGTH,
    ),
  };
}

function createCommentAuditEvent({
  slug,
  commentId,
  name,
  body,
  status,
  createdAt,
  visitorId,
  user,
  request,
}) {
  return {
    schemaVersion: 1,
    eventType: "comment.created",
    occurredAt: createdAt,
    articleSlug: slug,
    commentId,
    commentName: name,
    commentBody: body,
    commentStatus: status,
    sourceIp: request.sourceIp,
    email: user.email,
    googleSub: user.googleSub,
    visitorId,
    requestId: request.requestId,
    userAgent: request.userAgent,
  };
}

function createCommentDeletedAuditEvent({
  slug,
  comment,
  deletedAt,
  user,
  request,
}) {
  return {
    schemaVersion: 1,
    eventType: "comment.deleted",
    occurredAt: deletedAt,
    articleSlug: slug,
    commentId: comment.commentId,
    commentName: comment.name,
    commentBody: comment.body,
    commentStatus: comment.status,
    commentCreatedAt: comment.createdAt,
    sourceIp: request.sourceIp,
    email: user.email,
    googleSub: user.googleSub,
    visitorId: comment.visitorId,
    requestId: request.requestId,
    userAgent: request.userAgent,
  };
}

function writeCommentAuditLog(event, logger = console.info) {
  logger(event);
}

function getHeader(headers, targetName) {
  const entry = Object.entries(headers).find(
    ([name]) => name.toLowerCase() === targetName,
  );
  return entry?.[1];
}

function normalizeLogValue(value, maxLength) {
  if (typeof value !== "string") {
    return "unknown";
  }

  const normalized = value.trim();
  return normalized ? normalized.slice(0, maxLength) : "unknown";
}

module.exports = {
  createCommentAuditEvent,
  createCommentDeletedAuditEvent,
  getRequestAuditContext,
  writeCommentAuditLog,
};
