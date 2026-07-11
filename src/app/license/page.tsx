import type { Metadata } from "next";
import LicensePage from "../../views/license/+Page";
import { data } from "../../views/license/+data";
import { createPageMetadata } from "../../utils/seo";

export const metadata: Metadata = createPageMetadata({
  title: "ライセンス",
  description: "コンテンツやソフトウェアのライセンス情報です。",
  path: "/license",
  noIndex: true,
});

export default async function Page() {
  const { content } = await data();
  return <LicensePage content={content} />;
}
