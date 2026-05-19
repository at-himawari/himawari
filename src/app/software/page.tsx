import type { Metadata } from "next";
import SoftwarePage from "../../views/software/+Page";
import { data } from "../../views/software/+data";
import { createPageMetadata } from "../../utils/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Software",
  description: "Himawari Projectが公開しているソフトウェアとプロダクトの一覧です。",
  path: "/software",
});

export default async function Page() {
  const { content } = await data();
  return <SoftwarePage content={content} />;
}
