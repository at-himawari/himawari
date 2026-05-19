import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ArticleEngagement from "../components/ArticleEngagement";

describe("ArticleEngagement", () => {
  const originalEnv = process.env.NEXT_PUBLIC_ENGAGEMENT_API_URL;
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_ENGAGEMENT_API_URL = originalEnv;
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  test("shows setup notice when API URL is not configured", () => {
    process.env.NEXT_PUBLIC_ENGAGEMENT_API_URL = "";

    render(<ArticleEngagement slug="sample-post" />);

    expect(
      screen.getByText("いいねとコメントは、公開用 API の設定後に有効になります。"),
    ).toBeInTheDocument();
  });

  test("loads engagement summary and allows posting a comment", async () => {
    process.env.NEXT_PUBLIC_ENGAGEMENT_API_URL = "https://api.example.com";

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
          },
        }),
      });

    render(<ArticleEngagement slug="sample-post" />);

    expect(await screen.findByText("2 いいね / 1 コメント")).toBeInTheDocument();
    expect(screen.getByText("最初のコメント")).toBeInTheDocument();

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
    expect(screen.getByText("2 いいね / 2 コメント")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://api.example.com/articles/sample-post/comments",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
      }),
    );
  });
});
