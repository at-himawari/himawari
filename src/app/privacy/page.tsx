import type { Metadata } from "next";
import PrivacyPage from "../../views/privacy/+Page";
import { data } from "../../views/privacy/+data";
import { createPageMetadata } from "../../utils/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "Himawari Projectのプライバシーポリシーです。",
  path: "/privacy",
  noIndex: true,
});

export default async function Page() {
  const { content } = await data();
  return <PrivacyPage content={content} />;
}
