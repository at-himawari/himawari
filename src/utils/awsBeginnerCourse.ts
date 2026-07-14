import type { Post } from "../types/Post";

export const AWS_BEGINNER_COURSE_PATH = "/blog/aws-beginner-course";

export const isAwsBeginnerCoursePost = (
  post: Pick<Post, "slug" | "title">,
) =>
  /^AWS\s*入門講座(?:\s|\d|$)/i.test(post.title.trim()) ||
  /^aws-nyuumon-kouza(?:-|$)/i.test(post.slug.trim());

const getCourseOrder = (post: Pick<Post, "slug" | "title">) => {
  if (post.title.includes("全体概要")) {
    return 0;
  }

  const titleNumber = post.title.match(/AWS\s*入門講座\s*(\d+)/i)?.[1];
  const slugNumber = post.slug.match(
    /^aws-nyuumon-kouza-(\d+)(?:-|$)/i,
  )?.[1];
  const courseNumber = Number(titleNumber ?? slugNumber);

  return Number.isFinite(courseNumber) && courseNumber > 0
    ? courseNumber
    : Number.POSITIVE_INFINITY;
};

export const sortAwsBeginnerCoursePosts = <
  T extends Pick<Post, "slug" | "title">,
>(
  posts: T[],
): T[] =>
  posts
    .map((post, originalIndex) => ({
      originalIndex,
      order: getCourseOrder(post),
      post,
    }))
    .sort(
      (left, right) =>
        left.order - right.order || left.originalIndex - right.originalIndex,
    )
    .map(({ post }) => post);
