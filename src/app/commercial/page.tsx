import type { Metadata } from "next";
import CommercialPage from "../../views/commercial/+Page";
import { data } from "../../views/commercial/+data";
import { createPageMetadata } from "../../utils/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Commercial",
  description: "Himawari Projectへの制作依頼、商用利用、お仕事の相談について。",
  path: "/commercial",
});

export default async function Page() {
  const { content } = await data();
  return <CommercialPage content={content} />;
}
