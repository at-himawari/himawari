import { describe, expect, it } from "vitest";
import { isAwsBeginnerCoursePost } from "../awsBeginnerCourse";

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
