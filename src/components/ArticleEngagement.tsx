"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type {
  CommentSubmissionResponse,
  EngagementComment,
  EngagementResponse,
  GoogleAuthUser,
} from "../types/engagement";
import { sendGAEvent } from "../utils/analytics";

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
  name?: string;
  email?: string;
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
  const [idToken, setIdToken] = useState("");
  const [authUser, setAuthUser] = useState<GoogleAuthUser | null>(null);
  const [commentName, setCommentName] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [commentNotice, setCommentNotice] = useState("");
  const isSignedIn = Boolean(idToken && authUser);

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

    if (!googleClientId || !isGoogleReady || !googleId || !googleButtonRef.current) {
      return;
    }

    googleId.initialize({
      client_id: googleClientId,
      callback: (response) => {
        if (!response.credential) {
          setError("Googleログインに失敗しました。もう一度お試しください。");
          return;
        }

        const payload = decodeGoogleCredential(response.credential);
        if (!payload?.email) {
          setError("Googleアカウントのメールアドレスを確認できませんでした。");
          return;
        }

        const email = payload.email;
        const displayName = payload.name || email;
        setIdToken(response.credential);
        setAuthUser({
          name: displayName,
          email,
          picture: payload.picture,
        });
        setCommentName((current) => current || displayName);
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
  }, [googleClientId, isGoogleReady]);

  useEffect(() => {
    if (!idToken) {
      return;
    }

    const payload = decodeGoogleCredential(idToken);
    if (!payload?.exp) {
      return;
    }

    const expiresInMs = payload.exp * 1000 - Date.now() - 30_000;
    if (expiresInMs <= 0) {
      handleSignOut();
      return;
    }

    const timeoutId = window.setTimeout(handleSignOut, expiresInMs);
    return () => window.clearTimeout(timeoutId);
  }, [idToken]);

  useEffect(() => {
    if (!apiBaseUrl) {
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
  }, [apiBaseUrl, idToken, slug]);

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

  function handleSignOut() {
    window.google?.accounts?.id?.disableAutoSelect();
    window.google?.accounts?.id?.cancel();
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

  return (
    <section className="mt-12 border-t border-gray-200 pt-8" aria-label="記事への反応">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-semibold text-gray-900">この記事への反応</h2>
        {isLoading ? (
          <span className="text-sm text-gray-500">読み込み中...</span>
        ) : (
          <span className="text-sm text-gray-500">
            {engagement.likeCount} いいね / {engagement.commentCount} コメント
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-4">
        {authUser ? (
          <>
            {authUser.picture ? (
              <img
                src={authUser.picture}
                alt=""
                className="h-8 w-8 rounded-full"
                referrerPolicy="no-referrer"
              />
            ) : null}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">
                {authUser.name}
              </p>
              <p className="truncate text-xs text-gray-500">
                {authUser.email}
              </p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="ml-auto rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100"
            >
              ログアウト
            </button>
          </>
        ) : (
          <>
            <div ref={googleButtonRef} />
            <span className="text-sm text-gray-600">
              いいねとコメントにはGoogleログインが必要です。
            </span>
          </>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleToggleLike}
          disabled={isLoading || isSubmittingLike}
          className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
            engagement.viewerHasLiked
              ? "border-orange-500 bg-orange-50 text-orange-700"
              : "border-gray-300 bg-white text-gray-700"
          }`}
        >
          <span aria-hidden="true">{engagement.viewerHasLiked ? "♥" : "♡"}</span>
          {engagement.viewerHasLiked ? "いいね済み" : "いいね"}
        </button>
        <span className="text-sm text-gray-500">
          同じGoogleアカウントでは1回までです。
        </span>
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
            disabled={isSubmittingComment || !isSignedIn}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmittingComment
              ? "送信中..."
              : isSignedIn
                ? "コメントを送信"
                : "Googleログイン後に送信"}
          </button>

          {commentNotice ? (
            <p className="text-sm text-green-700">{commentNotice}</p>
          ) : null}
        </form>

        <CommentsList comments={engagement.comments} isLoading={isLoading} />
      </div>
    </section>
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

function CommentsList({
  comments,
  isLoading,
}: {
  comments: EngagementComment[];
  isLoading: boolean;
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
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-gray-700">
            {comment.body}
          </p>
        </article>
      ))}
    </div>
  );
}
