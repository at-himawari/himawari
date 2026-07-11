import type { Metadata } from "next";
import CommercialPage from "../../views/commercial/+Page";
import { data } from "../../views/commercial/+data";
import { createPageMetadata } from "../../utils/seo";

export const metadata: Metadata = createPageMetadata({
  title: "特定商取引法に基づく表記",
  description: "特定商取引法に基づく表記",
  path: "/commercial",
});

export default async function Page() {
  const { content } = await data();
  return <CommercialPage content={content} />;
}
