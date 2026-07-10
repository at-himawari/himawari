import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ArticleEngagement from "../components/ArticleEngagement";

describe("ArticleEngagement", () => {
  const originalEnv = process.env.NEXT_PUBLIC_ENGAGEMENT_API_URL;
  const originalGoogleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const fetchMock = vi.fn();
  let googleCallback:
    | ((response: { credential?: string }) => void)
    | undefined;

  beforeEach(() => {
    googleCallback = undefined;
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("google", {
      accounts: {
        id: {
          initialize: vi.fn((options) => {
            googleCallback = options.callback;
          }),
          renderButton: vi.fn((parent: HTMLElement) => {
            const button = document.createElement("button");
            button.textContent = "Sign in with Google";
            parent.appendChild(button);
          }),
          prompt: vi.fn(),
          cancel: vi.fn(),
          disableAutoSelect: vi.fn(),
        },
      },
    });
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_ENGAGEMENT_API_URL = originalEnv;
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = originalGoogleClientId;
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  test("renders nothing when API URL is not configured", () => {
    process.env.NEXT_PUBLIC_ENGAGEMENT_API_URL = "";
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = "google-client-id";

    const { container } = render(<ArticleEngagement slug="sample-post" />);

    expect(container).toBeEmptyDOMElement();
  });

  test("hides engagement controls until Google login and allows posting a comment", async () => {
    process.env.NEXT_PUBLIC_ENGAGEMENT_API_URL = "https://api.example.com";
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = "google-client-id";
    const idToken = createGoogleIdToken({
      email: "taro@example.com",
      name: "太郎",
      picture: "https://example.com/avatar.png",
    });

    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          slug: "sample-post",
          likeCount: 2,
          commentCount: 1,
          viewerHasLiked: false,
          comments: [
            {
              id: "comment-1",
              name: "ひまわり",
              body: "最初のコメント",
              createdAt: "2026-04-18T12:00:00.000Z",
              canDelete: true,
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          slug: "sample-post",
          likeCount: 2,
          commentCount: 1,
          viewerHasLiked: false,
          comments: [
            {
              id: "comment-1",
              name: "ひまわり",
              body: "最初のコメント",
              createdAt: "2026-04-18T12:00:00.000Z",
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          accepted: true,
          moderation: false,
          comment: {
            id: "comment-2",
            name: "太郎",
            body: "こんにちは",
            createdAt: "2026-04-18T13:00:00.000Z",
            canDelete: true,
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          slug: "sample-post",
          likeCount: 2,
          commentCount: 1,
          viewerHasLiked: false,
          comments: [
            {
              id: "comment-1",
              name: "ひまわり",
              body: "最初のコメント",
              createdAt: "2026-04-18T12:00:00.000Z",
              canDelete: true,
            },
          ],
        }),
      });

    render(<ArticleEngagement slug="sample-post" />);

    expect(
      await screen.findByLabelText("2 いいね、1 コメント"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "いいね" })).toBeInTheDocument();
    expect(screen.getByText("Sign in with Google")).toBeInTheDocument();
    expect(screen.queryByText("最初のコメント")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "コメントを送信" }),
    ).not.toBeInTheDocument();

    googleCallback?.({ credential: idToken });

    expect(await screen.findByText("taro@example.com")).toBeInTheDocument();
    expect(screen.getByText("最初のコメント")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "いいね" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("名前"), {
      target: { value: "太郎" },
    });
    fireEvent.change(screen.getByLabelText("コメント"), {
      target: { value: "こんにちは" },
    });
    fireEvent.click(screen.getByRole("button", { name: "コメントを送信" }));

    await waitFor(() => {
      expect(screen.getByText("コメントを投稿しました。")).toBeInTheDocument();
    });

    expect(screen.getByText("こんにちは")).toBeInTheDocument();
    expect(screen.getByLabelText("2 いいね、2 コメント")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      "https://api.example.com/articles/sample-post/comments",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        headers: expect.objectContaining({
          authorization: `Bearer ${idToken}`,
        }),
      }),
    );

    fireEvent.click(screen.getAllByRole("button", { name: "コメントを削除" })[0]);

    await waitFor(() => {
      expect(screen.getByText("コメントを削除しました。")).toBeInTheDocument();
    });

    expect(screen.queryByText("こんにちは")).not.toBeInTheDocument();
    expect(screen.getByLabelText("2 いいね、1 コメント")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenNthCalledWith(
      4,
      "https://api.example.com/articles/sample-post/comments/comment-2",
      expect.objectContaining({
        method: "DELETE",
        credentials: "include",
        headers: expect.objectContaining({
          authorization: `Bearer ${idToken}`,
        }),
      }),
    );
  });
});

function createGoogleIdToken(payload: {
  email: string;
  name: string;
  picture?: string;
}) {
  const header = encodeJwtPart({
    alg: "RS256",
    kid: "test-key",
    typ: "JWT",
  });
  const body = encodeJwtPart({
    ...payload,
    aud: "google-client-id",
    iss: "https://accounts.google.com",
    sub: "google-user-1",
    email_verified: true,
    exp: Math.floor(Date.now() / 1000) + 3600,
  });
  return `${header}.${body}.signature`;
}

function encodeJwtPart(value: unknown) {
  return Buffer.from(JSON.stringify(value))
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}
