import type { Metadata } from "next";
import JsonLd from "../../../components/JsonLd";
import AwsBeginnerCoursePage from "../../../views/blog/aws-beginner-course/+Page";
import {
  AWS_BEGINNER_COURSE_PATH,
  isAwsBeginnerCoursePost,
  sortAwsBeginnerCoursePosts,
} from "../../../utils/awsBeginnerCourse";
import { getPosts } from "../../../utils/getPosts";
import { absoluteUrl, createPageMetadata } from "../../../utils/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "AWS入門講座",
  description:
    "AWSの基礎から実践的な使い方まで、初心者向けに順を追って学べる講座です。",
  path: AWS_BEGINNER_COURSE_PATH,
});

export default async function Page() {
  const posts = sortAwsBeginnerCoursePosts(
    (await getPosts({ throwOnError: true })).filter(isAwsBeginnerCoursePost),
  );
  const pageUrl = absoluteUrl(AWS_BEGINNER_COURSE_PATH);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#collection`,
        name: "AWS入門講座",
        description: metadata.description,
        url: pageUrl,
        inLanguage: "ja",
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#articles`,
        name: "AWS入門講座 講座一覧",
        itemListElement: posts.map((post, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: post.title,
          url: absoluteUrl(`/blog/${post.slug}`),
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd id="aws-beginner-course-json-ld" data={jsonLd} />
      <AwsBeginnerCoursePage posts={posts} />
    </>
  );
}
