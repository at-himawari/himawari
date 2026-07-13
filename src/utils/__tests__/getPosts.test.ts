import { afterEach, describe, expect, test, vi } from "vitest";
import { getPosts } from "../getPosts";

describe("getPosts", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("Strapi の記事をキャッシュせずに取得する", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            slug: "new-article",
            title: "New article",
            date: "2026-07-13",
          },
        ],
        meta: {
          pagination: {
            page: 1,
            pageSize: 100,
            pageCount: 1,
            total: 1,
          },
        },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const posts = await getPosts({ throwOnError: true });

    expect(posts).toHaveLength(1);
    expect(posts[0]?.slug).toBe("new-article");
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/articles?"),
      { cache: "no-store" },
    );
  });
});
