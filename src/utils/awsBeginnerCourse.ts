import type { Post } from "../types/Post";

export const AWS_BEGINNER_COURSE_PATH = "/blog/aws-beginner-course";

export const isAwsBeginnerCoursePost = (
  post: Pick<Post, "slug" | "title">,
) =>
  /^AWS\s*入門講座(?:\s|\d|$)/i.test(post.title.trim()) ||
  /^aws-nyuumon-kouza(?:-|$)/i.test(post.slug.trim());
