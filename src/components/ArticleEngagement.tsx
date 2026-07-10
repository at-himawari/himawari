"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type {
  CommentSubmissionResponse,
  EngagementComment,
  EngagementResponse,
  GoogleAuthUser,
} from "../types/engagement";
import { sendGAEvent } from "../utils/analytics";
import { BsChat, BsHeart, BsHeartFill } from "react-icons/bs";

type Props = {
  slug: string;
};

type ErrorResponse = {
  message?: string;
};

type GoogleCredentialResponse = {
  credential?: string;
};

type GoogleJwtPayload = {
  aud?: string | string[];
  iss?: string;
  name?: string;
  email?: string;
  email_verified?: boolean;
  picture?: string;
  exp?: number;
};

type GoogleAccountsApi = {
  accounts?: {
    id?: {
      initialize: (options: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
        auto_select?: boolean;
        cancel_on_tap_outside?: boolean;
      }) => void;
      renderButton: (
        parent: HTMLElement,
        options: {
          theme?: "outline" | "filled_blue" | "filled_black";
          size?: "large" | "medium" | "small";
          text?: "signin_with" | "signup_with" | "continue_with" | "signin";
          shape?: "rectangular" | "pill" | "circle" | "square";
          width?: number;
        },
      ) => void;
      prompt: () => void;
      cancel: () => void;
      disableAutoSelect: () => void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleAccountsApi;
  }
}

const EMPTY_ENGAGEMENT: EngagementResponse = {
  slug: "",
  likeCount: 0,
  commentCount: 0,
  viewerHasLiked: false,
  comments: [],
};
const GOOGLE_AUTH_STORAGE_KEY = "himawari.google-id-token";
const GOOGLE_TOKEN_EXPIRY_BUFFER_MS = 30_000;
const GOOGLE_TOKEN_ISSUERS = new Set([
  "accounts.google.com",
  "https://accounts.google.com",
]);

function normalizeApiBaseUrl(value = "") {
  return value.replace(/\/$/, "");
}

export default function ArticleEngagement({ slug }: Props) {
  const apiBaseUrl = useMemo(
    () => normalizeApiBaseUrl(process.env.NEXT_PUBLIC_ENGAGEMENT_API_URL || ""),
    [],
  );
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [engagement, setEngagement] = useState<EngagementResponse>({
    ...EMPTY_ENGAGEMENT,
    slug,
  });
  const [isLoading, setIsLoading] = useState(Boolean(apiBaseUrl));
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [error, setError] = useState("");
  const [isSubmittingLike, setIsSubmittingLike] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState("");
  const [isAuthRestored, setIsAuthRestored] = useState(false);
  const [idToken, setIdToken] = useState("");
  const [authUser, setAuthUser] = useState<GoogleAuthUser | null>(null);
  const [commentName, setCommentName] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [commentNotice, setCommentNotice] = useState("");
  const isSignedIn = Boolean(idToken && authUser);

  useEffect(() => {
    const storedToken = getStoredGoogleCredential();
    const storedUser = storedToken
      ? getGoogleAuthUser(storedToken, googleClientId)
      : null;

    if (storedToken && storedUser) {
      setIdToken(storedToken);
      setAuthUser(storedUser);
      setCommentName(storedUser.name);
    } else {
      clearStoredGoogleCredential();
    }

    setIsAuthRestored(true);
  }, [googleClientId]);

  useEffect(() => {
    if (!googleClientId) {
      return;
    }

    if (window.google?.accounts?.id) {
      setIsGoogleReady(true);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      "script[src='https://accounts.google.com/gsi/client']",
    );

    const handleLoad = () => setIsGoogleReady(true);

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad);
      return () => existingScript.removeEventListener("load", handleLoad);
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.addEventListener("load", handleLoad);
    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", handleLoad);
    };
  }, [googleClientId]);

  useEffect(() => {
    const googleId = window.google?.accounts?.id;

    if (
      !googleClientId ||
      !isAuthRestored ||
      !isGoogleReady ||
      !googleId ||
      !googleButtonRef.current
    ) {
      return;
    }

    googleId.initialize({
      client_id: googleClientId,
      callback: (response) => {
        if (!response.credential) {
          setError("Googleログインに失敗しました。もう一度お試しください。");
          return;
        }

        const user = getGoogleAuthUser(response.credential, googleClientId);
        if (!user) {
          setError("Googleアカウントのメールアドレスを確認できませんでした。");
          return;
        }

        storeGoogleCredential(response.credential);
        setIdToken(response.credential);
        setAuthUser(user);
        setCommentName((current) => current || user.name);
        setError("");
        setCommentNotice("");
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    googleButtonRef.current.replaceChildren();
    googleId.renderButton(googleButtonRef.current, {
      theme: "outline",
      size: "large",
      text: "signin_with",
      shape: "rectangular",
      width: 240,
    });
  }, [googleClientId, isAuthRestored, isGoogleReady, isSignedIn]);

  useEffect(() => {
    if (!idToken) {
      return;
    }

    const payload = decodeGoogleCredential(idToken);
    if (!payload?.exp) {
      return;
    }

    const expiresInMs =
      payload.exp * 1000 - Date.now() - GOOGLE_TOKEN_EXPIRY_BUFFER_MS;
    if (expiresInMs <= 0) {
      handleSignOut();
      return;
    }

    const timeoutId = window.setTimeout(handleSignOut, expiresInMs);
    return () => window.clearTimeout(timeoutId);
  }, [idToken]);

  useEffect(() => {
    if (!apiBaseUrl || !isAuthRestored) {
      return;
    }

    let aborted = false;

    async function loadEngagement() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(`${apiBaseUrl}/articles/${slug}/engagement`, {
          headers: idToken
            ? {
                authorization: `Bearer ${idToken}`,
              }
            : undefined,
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("反応データを取得できませんでした。");
        }

        const data = (await response.json()) as EngagementResponse;

        if (!aborted) {
          setEngagement(data);
        }
      } catch (fetchError) {
        if (!aborted) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "反応データを取得できませんでした。",
          );
        }
      } finally {
        if (!aborted) {
          setIsLoading(false);
        }
      }
    }

    loadEngagement();

    return () => {
      aborted = true;
    };
  }, [apiBaseUrl, idToken, isAuthRestored, slug]);

  async function handleToggleLike() {
    if (!apiBaseUrl || isSubmittingLike) {
      return;
    }

    if (!idToken) {
      requestGoogleSignIn();
      setError("いいねするにはGoogleログインが必要です。");
      return;
    }

    setIsSubmittingLike(true);
    setError("");

    try {
      const method = engagement.viewerHasLiked ? "DELETE" : "POST";
      const response = await fetch(`${apiBaseUrl}/articles/${slug}/likes`, {
        method,
        headers: {
          authorization: `Bearer ${idToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as ErrorResponse;
        throw new Error(payload.message || "いいねを更新できませんでした。");
      }

      const data = (await response.json()) as EngagementResponse;
      setEngagement(data);
      sendGAEvent(engagement.viewerHasLiked ? "remove_like" : "like", {
        content_type: "article",
        item_id: slug,
      });
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "いいねを更新できませんでした。",
      );
    } finally {
      setIsSubmittingLike(false);
    }
  }

  async function handleSubmitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!apiBaseUrl || isSubmittingComment) {
      return;
    }

    if (!idToken || !authUser) {
      requestGoogleSignIn();
      setError("コメントを送信するにはGoogleログインが必要です。");
      return;
    }

    setIsSubmittingComment(true);
    setError("");
    setCommentNotice("");

    try {
      const response = await fetch(`${apiBaseUrl}/articles/${slug}/comments`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${idToken}`,
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: commentName,
          body: commentBody,
          website: "",
        }),
      });

      const payload = (await response.json()) as
        | CommentSubmissionResponse
        | ErrorResponse;

      if (!response.ok) {
        const message =
          "message" in payload ? payload.message : undefined;
        throw new Error(message || "コメントを送信できませんでした。");
      }

      const result = payload as CommentSubmissionResponse;

      if (result.moderation) {
        setCommentNotice("コメントを受け付けました。公開まで少しお待ちください。");
      } else {
        setEngagement((current) => ({
          ...current,
          commentCount: current.commentCount + 1,
          comments: [result.comment, ...current.comments].slice(0, 50),
        }));
        setCommentNotice("コメントを投稿しました。");
      }

      sendGAEvent("post_comment", {
        content_type: "article",
        item_id: slug,
        moderation: Boolean(result.moderation),
      });

      setCommentName("");
      setCommentBody("");
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "コメントを送信できませんでした。",
      );
    } finally {
      setIsSubmittingComment(false);
    }
  }

  async function handleDeleteComment(commentId: string) {
    if (!apiBaseUrl || deletingCommentId) {
      return;
    }

    if (!idToken) {
      requestGoogleSignIn();
      setError("コメントを削除するにはGoogleログインが必要です。");
      return;
    }

    setDeletingCommentId(commentId);
    setError("");
    setCommentNotice("");

    try {
      const response = await fetch(
        `${apiBaseUrl}/articles/${slug}/comments/${encodeURIComponent(commentId)}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${idToken}`,
          },
          credentials: "include",
        },
      );

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as ErrorResponse;
        throw new Error(payload.message || "コメントを削除できませんでした。");
      }

      const data = (await response.json()) as EngagementResponse;
      setEngagement(data);
      setCommentNotice("コメントを削除しました。");
      sendGAEvent("delete_comment", {
        content_type: "article",
        item_id: slug,
      });
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "コメントを削除できませんでした。",
      );
    } finally {
      setDeletingCommentId("");
    }
  }

  function handleSignOut() {
    window.google?.accounts?.id?.disableAutoSelect();
    window.google?.accounts?.id?.cancel();
    clearStoredGoogleCredential();
    setIdToken("");
    setAuthUser(null);
    setCommentNotice("");
    setEngagement((current) => ({
      ...current,
      viewerHasLiked: false,
    }));
  }

  function requestGoogleSignIn() {
    window.google?.accounts?.id?.prompt();
  }

  if (!apiBaseUrl) {
    return null;
  }

  if (!googleClientId) {
    return null;
  }

  const signedInUser = isSignedIn ? authUser : null;

  return (
    <section className="mt-12 border-t border-gray-200 pt-8" aria-label="記事への反応">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-semibold text-gray-900">この記事への反応</h2>
        {isLoading ? (
          <span className="text-sm text-gray-500">読み込み中...</span>
        ) : (
          <EngagementSummary
            likeCount={engagement.likeCount}
            commentCount={engagement.commentCount}
            viewerHasLiked={engagement.viewerHasLiked}
            isSubmittingLike={isSubmittingLike}
            onLike={handleToggleLike}
          />
        )}
      </div>

      {!isAuthRestored ? null : !signedInUser ? (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div ref={googleButtonRef} />
        </div>
      ) : (
        <>
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-4">
            {signedInUser.picture ? (
              <img
                src={signedInUser.picture}
                alt=""
                className="h-8 w-8 rounded-full"
                referrerPolicy="no-referrer"
              />
            ) : null}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">
                {signedInUser.name}
              </p>
              <p className="truncate text-xs text-gray-500">
                {signedInUser.email}
              </p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="ml-auto rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100"
            >
              ログアウト
            </button>
          </div>

          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

          <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <form className="space-y-4" onSubmit={handleSubmitComment}>
              <div>
                <label
                  htmlFor="comment-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  名前
                </label>
                <input
                  id="comment-name"
                  name="name"
                  value={commentName}
                  onChange={(event) => setCommentName(event.target.value)}
                  maxLength={40}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
                />
              </div>

              <div className="hidden" aria-hidden="true">
                <label htmlFor="comment-website">Website</label>
                <input
                  id="comment-website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label
                  htmlFor="comment-body"
                  className="block text-sm font-medium text-gray-700"
                >
                  コメント
                </label>
                <textarea
                  id="comment-body"
                  name="body"
                  value={commentBody}
                  onChange={(event) => setCommentBody(event.target.value)}
                  maxLength={1000}
                  required
                  rows={5}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingComment}
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmittingComment ? "送信中..." : "コメントを送信"}
              </button>

              {commentNotice ? (
                <p className="text-sm text-green-700">{commentNotice}</p>
              ) : null}
            </form>

            <CommentsList
              comments={engagement.comments}
              isLoading={isLoading}
              deletingCommentId={deletingCommentId}
              onDeleteComment={handleDeleteComment}
            />
          </div>
        </>
      )}

      {!signedInUser && error ? (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      ) : null}

      {!signedInUser ? (
        <div className="mt-10">
          <CommentsList
            comments={engagement.comments}
            isLoading={isLoading}
            deletingCommentId={deletingCommentId}
            onDeleteComment={handleDeleteComment}
          />
        </div>
      ) : null}
    </section>
  );
}

function EngagementSummary({
  likeCount,
  commentCount,
  viewerHasLiked,
  isSubmittingLike,
  onLike,
}: {
  likeCount: number;
  commentCount: number;
  viewerHasLiked: boolean;
  isSubmittingLike: boolean;
  onLike: () => void;
}) {
  return (
    <div
      className="flex items-center gap-5 text-gray-500"
      aria-label={`${likeCount} いいね、${commentCount} コメント`}
    >
      <button
        type="button"
        onClick={onLike}
        disabled={isSubmittingLike}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full border-2 text-base transition disabled:cursor-not-allowed disabled:opacity-60 ${
          viewerHasLiked
            ? "border-rose-500 bg-rose-50 text-rose-500"
            : "border-rose-500 bg-white text-rose-500 hover:bg-rose-50"
        }`}
        aria-label={viewerHasLiked ? "いいねを取り消す" : "いいね"}
      >
        {viewerHasLiked ? (
          <BsHeartFill aria-hidden="true" />
        ) : (
          <BsHeart aria-hidden="true" />
        )}
      </button>
      <span className="text-2xl font-medium tabular-nums text-gray-600">
        {likeCount}
      </span>
      <span className="text-2xl text-gray-400">
        <BsChat aria-hidden="true" />
      </span>
      <span className="text-2xl font-medium tabular-nums text-gray-600">
        {commentCount}
      </span>
    </div>
  );
}

function decodeGoogleCredential(token: string): GoogleJwtPayload | null {
  const [, payload] = token.split(".");
  if (!payload) {
    return null;
  }

  try {
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const json = decodeURIComponent(
      Array.from(decoded)
        .map((character) =>
          `%${character.charCodeAt(0).toString(16).padStart(2, "0")}`,
        )
        .join(""),
    );
    return JSON.parse(json) as GoogleJwtPayload;
  } catch {
    return null;
  }
}

function getGoogleAuthUser(
  token: string,
  googleClientId: string,
): GoogleAuthUser | null {
  const payload = decodeGoogleCredential(token);
  if (
    !payload?.email ||
    !payload.exp ||
    !payload.aud ||
    !payload.iss ||
    payload.email_verified === false
  ) {
    return null;
  }

  const audienceMatches = Array.isArray(payload.aud)
    ? payload.aud.includes(googleClientId)
    : payload.aud === googleClientId;
  const expiresAt = payload.exp * 1000;

  if (
    !audienceMatches ||
    !GOOGLE_TOKEN_ISSUERS.has(payload.iss) ||
    expiresAt <= Date.now() + GOOGLE_TOKEN_EXPIRY_BUFFER_MS
  ) {
    return null;
  }

  return {
    name: payload.name || payload.email,
    email: payload.email,
    picture: payload.picture,
  };
}

function getStoredGoogleCredential() {
  try {
    return window.sessionStorage.getItem(GOOGLE_AUTH_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function storeGoogleCredential(token: string) {
  try {
    window.sessionStorage.setItem(GOOGLE_AUTH_STORAGE_KEY, token);
  } catch {
    // Storage may be unavailable in privacy-restricted browser contexts.
  }
}

function clearStoredGoogleCredential() {
  try {
    window.sessionStorage.removeItem(GOOGLE_AUTH_STORAGE_KEY);
  } catch {
    // Storage may be unavailable in privacy-restricted browser contexts.
  }
}

function CommentsList({
  comments,
  isLoading,
  deletingCommentId,
  onDeleteComment,
}: {
  comments: EngagementComment[];
  isLoading: boolean;
  deletingCommentId: string;
  onDeleteComment: (commentId: string) => void;
}) {
  if (isLoading) {
    return <p className="text-sm text-gray-500">コメントを読み込んでいます。</p>;
  }

  if (!comments.length) {
    return <p className="text-sm text-gray-500">まだコメントはありません。</p>;
  }

  return (
    <div className="space-y-5">
      {comments.map((comment) => (
        <article
          key={comment.id}
          className="border-b border-gray-100 pb-5 last:border-none last:pb-0"
        >
          <div className="flex flex-wrap items-baseline gap-3">
            <h3 className="text-sm font-semibold text-gray-900">{comment.name}</h3>
            <time className="text-xs text-gray-500" dateTime={comment.createdAt}>
              {new Date(comment.createdAt).toLocaleDateString("ja-JP")}
            </time>
            {comment.canDelete ? (
              <button
                type="button"
                onClick={() => onDeleteComment(comment.id)}
                disabled={deletingCommentId === comment.id}
                aria-label="コメントを削除"
                className="ml-auto rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingCommentId === comment.id ? "削除中..." : "削除"}
              </button>
            ) : null}
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-gray-700">
            {comment.body}
          </p>
        </article>
      ))}
    </div>
  );
}
