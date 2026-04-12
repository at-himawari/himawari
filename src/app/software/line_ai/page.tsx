import type { Metadata } from "next";
import LineAiPage from "../../../views/software/line_ai/+Page";
import { ogImageUrl, postUrl } from "../../../const/pageConstants";

export const metadata: Metadata = {
  title: "あざらし君@AI LINE公式アカウント",
  description: "あなたのとなりのAI",
  openGraph: {
    title: "あざらし君@AI LINE公式アカウント",
    description: "あなたのとなりのAI",
    url: `${postUrl}/software/line_ai`,
    images: [ogImageUrl],
  },
  twitter: {
    title: "あざらし君@AI LINE公式アカウント",
    description: "あなたのとなりのAI",
    images: [ogImageUrl],
  },
};

export default function Page() {
  return <LineAiPage />;
}
