import type { Metadata } from "next";
import LineAiPage from "../../../views/software/line_ai/+Page";
import { ogImageUrl } from "../../../const/pageConstants";
import { createPageMetadata } from "../../../utils/seo";

export const metadata: Metadata = createPageMetadata({
  title: "あざらし君@AI LINE公式アカウント",
  description: "あなたのとなりのAI",
  path: "/software/line_ai",
  image: ogImageUrl,
});

export default function Page() {
  return <LineAiPage />;
}
