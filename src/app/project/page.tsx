import type { Metadata } from "next";
import ProjectPage from "../../views/project/+Page";
import { data } from "../../views/project/+data";
import { createPageMetadata } from "../../utils/seo";

export const metadata: Metadata = createPageMetadata({
  title: "プロジェクトポリシー",
  description: "本プロジェクトのポリシー。",
  path: "/project",
});

export default async function Page() {
  const { content } = await data();
  return <ProjectPage content={content} />;
}
