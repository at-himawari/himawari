/**
 * Tests for Featured Posts Selection Logic
 *
 * Verifies the scoring algorithm and post selection functionality
 * for the homepage blog features.
 */

import { getFeaturedPosts } from "../featuredPosts";
import type { Post } from "../../types/Post";

describe("getFeaturedPosts", () => {
  // Mock posts for testing
  const mockPosts: Post[] = [
    {
      slug: "recent-tech-post",
      title: "最新のReact開発技術",
      date: "2025-08-20", // Recent date
      categories: ["プログラミング", "React"],
      tags: ["React", "TypeScript", "フロントエンド", "開発"],
      coverImage: "https://example.com/react.jpg",
    },
    {
      slug: "old-tech-post",
      title: "古いJavaScript技術",
      date: "2025-07-15", // Older but not too old to be filtered out
      categories: ["プログラミング"],
      tags: ["JavaScript", "レガシー"],
      coverImage: "https://example.com/js.jpg",
    },
    {
      slug: "non-tech-post",
      title: "旅行記：東京散歩",
      date: "2025-08-15", // Recent but non-tech
      categories: ["旅行", "ライフスタイル"],
      tags: ["旅行", "東京", "散歩", "写真", "グルメ"],
      coverImage: "https://example.com/travel.jpg",
    },
    {
      slug: "minimal-post",
      title: "シンプルな記事",
      date: "2025-08-10",
      categories: ["その他"],
      tags: ["テスト"],
    },
    {
      slug: "no-categories-post",
      title: "カテゴリなしの記事",
      date: "2025-08-05",
      tags: ["タグ1", "タグ2", "タグ3", "タグ4"],
    },
  ];

  describe("Basic Functionality", () => {
    test("should return featured posts in correct order", () => {
      const result = getFeaturedPosts(mockPosts, 3);

      expect(result).toHaveLength(3);
      expect(result[0]).toBeDefined();
      expect(result[0].title).toBeDefined();

      // First result should be the recent tech post (highest score)
      expect(result[0].slug).toBe("recent-tech-post");
    });

    test("should respect the limit parameter", () => {
      const result = getFeaturedPosts(mockPosts, 2);
      expect(result).toHaveLength(2);

      const resultAll = getFeaturedPosts(mockPosts, 10);
      expect(resultAll.length).toBeLessThanOrEqual(mockPosts.length);
    });

    test("should return posts with highest scores first", () => {
      const result = getFeaturedPosts(mockPosts, 5);

      // Recent tech post should score higher than old tech post
      const recentTechIndex = result.findIndex(
        (p) => p.slug === "recent-tech-post"
      );
      const oldTechIndex = result.findIndex((p) => p.slug === "old-tech-post");

      // Both posts should be found in results
      expect(recentTechIndex).toBeGreaterThanOrEqual(0);
      expect(oldTechIndex).toBeGreaterThanOrEqual(0);
      expect(recentTechIndex).toBeLessThan(oldTechIndex);
    });
  });

  describe("Edge Cases", () => {
    test("should handle empty posts array", () => {
      const result = getFeaturedPosts([], 5);
      expect(result).toEqual([]);
    });

    test("should handle null/undefined posts array", () => {
      const resultNull = getFeaturedPosts(null as any, 5);
      expect(resultNull).toEqual([]);

      const resultUndefined = getFeaturedPosts(undefined as any, 5);
      expect(resultUndefined).toEqual([]);
    });

    test("should handle invalid limit values", () => {
      const resultZero = getFeaturedPosts(mockPosts, 0);
      expect(resultZero).toEqual([]);

      const resultNegative = getFeaturedPosts(mockPosts, -1);
      expect(resultNegative).toEqual([]);
    });

    test("should handle posts with missing required fields", () => {
      const invalidPosts: Post[] = [
        {
          slug: "valid-post",
          title: "Valid Post",
          date: "2025-08-20",
        },
        {
          slug: "no-title-post",
          title: "", // Empty title
          date: "2025-08-19",
        },
        {
          slug: "no-date-post",
          title: "No Date Post",
          date: "", // Empty date
        },
        {
          slug: "invalid-date-post",
          title: "Invalid Date Post",
          date: "not-a-date", // Invalid date format
        },
      ];

      const result = getFeaturedPosts(invalidPosts, 5);

      // Should only return posts with valid data
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((post) => post.title && post.title.length > 0)).toBe(
        true
      );
    });

    test("should handle posts with null/undefined properties", () => {
      const postsWithNulls: Post[] = [
        {
          slug: "post-with-nulls",
          title: "Post with Nulls",
          date: "2025-08-20",
          categories: null as any,
          tags: undefined as any,
        },
      ];

      const result = getFeaturedPosts(postsWithNulls, 1);
      expect(result).toHaveLength(1);
    });
  });

  describe("Scoring Algorithm", () => {
    test("should prioritize recent tech posts", () => {
      const recentTechPost: Post = {
        slug: "recent-tech",
        title: "最新React技術",
        date: "2025-08-25", // Very recent
        categories: ["プログラミング"],
        tags: ["React", "TypeScript", "開発"],
      };

      const oldNonTechPost: Post = {
        slug: "old-non-tech",
        title: "古い旅行記",
        date: "2025-07-01", // Older but not too old to be filtered out
        categories: ["旅行"],
        tags: ["旅行"],
      };

      const posts = [oldNonTechPost, recentTechPost];
      const result = getFeaturedPosts(posts, 2);

      expect(result).toHaveLength(2);
      expect(result[0].slug).toBe("recent-tech");
      expect(result[1].slug).toBe("old-non-tech");
    });

    test("should handle posts with optimal tag count", () => {
      const optimalTagPost: Post = {
        slug: "optimal-tags",
        title: "Optimal Tags Post",
        date: "2025-08-20",
        categories: ["プログラミング"],
        tags: ["tag1", "tag2", "tag3", "tag4"], // 4 tags (optimal range)
      };

      const tooManyTagsPost: Post = {
        slug: "too-many-tags",
        title: "Too Many Tags Post",
        date: "2025-08-20",
        categories: ["プログラミング"],
        tags: [
          "tag1",
          "tag2",
          "tag3",
          "tag4",
          "tag5",
          "tag6",
          "tag7",
          "tag8",
          "tag9",
        ], // 9 tags
      };

      const posts = [tooManyTagsPost, optimalTagPost];
      const result = getFeaturedPosts(posts, 2);

      // Optimal tag count should score higher
      expect(result[0].slug).toBe("optimal-tags");
    });

    test("should recognize tech categories correctly", () => {
      const techCategories = [
        "プログラミング",
        "技術",
        "Web開発",
        "React",
        "TypeScript",
        "JavaScript",
        "開発",
        "エンジニア",
        "フロントエンド",
        "バックエンド",
        "AWS",
        "クラウド",
      ];

      techCategories.forEach((category) => {
        const techPost: Post = {
          slug: `tech-post-${category}`,
          title: `Tech Post ${category}`,
          date: "2025-08-20",
          categories: [category],
          tags: ["tag1", "tag2", "tag3"],
        };

        const nonTechPost: Post = {
          slug: "non-tech-post",
          title: "Non Tech Post",
          date: "2025-08-20",
          categories: ["旅行"],
          tags: ["tag1", "tag2", "tag3"],
        };

        const posts = [nonTechPost, techPost];
        const result = getFeaturedPosts(posts, 2);

        // Tech post should score higher
        expect(result[0].slug).toBe(`tech-post-${category}`);
      });
    });
  });

  describe("Date Handling", () => {
    test("should handle various date formats", () => {
      const validDateFormats: Post[] = [
        {
          slug: "iso-date",
          title: "ISO Date",
          date: "2025-08-20T10:00:00Z",
        },
        {
          slug: "simple-date",
          title: "Simple Date",
          date: "2025-08-20",
        },
        {
          slug: "slash-date",
          title: "Slash Date",
          date: "2025/08/20",
        },
      ];

      const result = getFeaturedPosts(validDateFormats, 3);
      expect(result).toHaveLength(3);
    });

    test("should handle invalid date formats gracefully", () => {
      const invalidDatePosts: Post[] = [
        {
          slug: "invalid-date-1",
          title: "Invalid Date 1",
          date: "not-a-date",
        },
        {
          slug: "invalid-date-2",
          title: "Invalid Date 2",
          date: "2025-13-45", // Invalid month/day
        },
        {
          slug: "valid-date",
          title: "Valid Date",
          date: "2025-08-20",
        },
      ];

      const result = getFeaturedPosts(invalidDatePosts, 3);

      // Should only return posts with valid dates
      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe("valid-date");
    });

    test("should prioritize recent posts over old ones", () => {
      const now = new Date();
      const recentDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
      const oldDate = new Date(now.getTime() - 200 * 24 * 60 * 60 * 1000); // 200 days ago

      const recentPost: Post = {
        slug: "recent",
        title: "Recent Post",
        date: recentDate.toISOString().split("T")[0],
        categories: ["プログラミング"],
        tags: ["tag1", "tag2", "tag3"],
      };

      const oldPost: Post = {
        slug: "old",
        title: "Old Post",
        date: oldDate.toISOString().split("T")[0],
        categories: ["プログラミング"],
        tags: ["tag1", "tag2", "tag3"],
      };

      const posts = [oldPost, recentPost];
      const result = getFeaturedPosts(posts, 2);

      expect(result[0].slug).toBe("recent");
    });
  });

  describe("Console Logging", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    test("should log info when no posts are available", () => {
      const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});

      getFeaturedPosts([], 5);

      expect(consoleSpy).toHaveBeenCalledWith(
        "No posts available for featured posts selection"
      );

      consoleSpy.mockRestore();
    });

    test("should log warning for invalid limit", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      getFeaturedPosts(mockPosts, -1);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Invalid limit for featured posts:",
        -1
      );

      consoleSpy.mockRestore();
    });

    test("should log selection results", () => {
      const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});

      getFeaturedPosts(mockPosts, 3);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Selected") &&
          expect.stringContaining("featured posts from") &&
          expect.stringContaining("total posts")
      );

      consoleSpy.mockRestore();
    });
  });

  describe("Performance and Stability", () => {
    test("should handle large arrays efficiently", () => {
      const largePosts: Post[] = Array.from({ length: 1000 }, (_, i) => ({
        slug: `post-${i}`,
        title: `Post ${i}`,
        date: `2025-08-${String((i % 28) + 1).padStart(2, "0")}`,
        categories: i % 2 === 0 ? ["プログラミング"] : ["その他"],
        tags: [`tag${i}`, `tag${i + 1}`, `tag${i + 2}`],
      }));

      const start = performance.now();
      const result = getFeaturedPosts(largePosts, 10);
      const end = performance.now();

      expect(result).toHaveLength(10);
      expect(end - start).toBeLessThan(1000); // Should complete within 1 second
    });

    test("should not mutate original posts array", () => {
      const originalPosts = [...mockPosts];
      const originalFirstPost = { ...mockPosts[0] };

      getFeaturedPosts(mockPosts, 3);

      expect(mockPosts).toEqual(originalPosts);
      expect(mockPosts[0]).toEqual(originalFirstPost);
    });

    test("should handle concurrent calls safely", async () => {
      const promises = Array.from({ length: 10 }, () =>
        Promise.resolve(getFeaturedPosts(mockPosts, 3))
      );

      const results = await Promise.all(promises);

      // All results should be identical
      results.forEach((result) => {
        expect(result).toHaveLength(3);
        expect(result[0].slug).toBe(results[0][0].slug);
      });
    });
  });
});
