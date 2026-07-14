import { describe, expect, it } from "vitest";
import {
  isAwsBeginnerCoursePost,
  sortAwsBeginnerCoursePosts,
} from "../awsBeginnerCourse";

describe("isAwsBeginnerCoursePost", () => {
  it.each([
    { slug: "aws-nyuumon-kouza-7", title: "AWS 入門講座 7" },
    { slug: "custom-slug", title: "AWS入門講座 8" },
    { slug: "aws-nyuumon-kouza-9", title: "Amazon S3 の基礎" },
  ])("講座記事を判定する: $title", (post) => {
    expect(isAwsBeginnerCoursePost(post)).toBe(true);
  });

  it.each([
    { slug: "aws-lambda-basics", title: "AWS Lambda の基礎" },
    { slug: "cloud-introduction", title: "AWS 入門" },
    { slug: "nextjs-strapi-local-dev", title: "Next.js と Strapi" },
  ])("通常記事は対象外にする: $title", (post) => {
    expect(isAwsBeginnerCoursePost(post)).toBe(false);
  });
});

describe("sortAwsBeginnerCoursePosts", () => {
  it("全体概要の後に講座番号の昇順で並べる", () => {
    const posts = [
      { slug: "aws-nyuumon-kouza-10", title: "AWS入門講座10" },
      { slug: "aws-nyuumon-kouza-2", title: "AWS入門講座2" },
      { slug: "aws-nyuumon-kouza-0", title: "AWS入門講座 全体概要" },
      { slug: "aws-nyuumon-kouza-1", title: "AWS入門講座1" },
    ];

    expect(sortAwsBeginnerCoursePosts(posts).map((post) => post.slug)).toEqual([
      "aws-nyuumon-kouza-0",
      "aws-nyuumon-kouza-1",
      "aws-nyuumon-kouza-2",
      "aws-nyuumon-kouza-10",
    ]);
    expect(posts[0].slug).toBe("aws-nyuumon-kouza-10");
  });

  it("タイトルに番号がない場合はスラッグの番号を使う", () => {
    const posts = [
      { slug: "aws-nyuumon-kouza-9", title: "Amazon S3 の基礎" },
      { slug: "aws-nyuumon-kouza-3", title: "AWSのコスト管理" },
    ];

    expect(sortAwsBeginnerCoursePosts(posts).map((post) => post.slug)).toEqual([
      "aws-nyuumon-kouza-3",
      "aws-nyuumon-kouza-9",
    ]);
  });
});
