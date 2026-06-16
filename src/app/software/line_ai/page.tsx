import type { Metadata } from "next";
import JsonLd from "../../../components/JsonLd";
import LineAiPage from "../../../views/software/line_ai/+Page";
import { ogImageUrl } from "../../../const/pageConstants";
import { absoluteUrl, createPageMetadata } from "../../../utils/seo";

export const metadata: Metadata = createPageMetadata({
  title: "あざらし君@AI LINE公式アカウント",
  description:
    "あざらし君@AIは、LINEから自然な会話、画像解析、相談、アイデア出しを利用できるAIアシスタントです。",
  path: "/software/line_ai",
  image: ogImageUrl,
});

export default function Page() {
  const lineAiJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${absoluteUrl("/software/line_ai")}#software`,
        name: "あざらし君@AI",
        applicationCategory: "AIApplication",
        operatingSystem: "LINE",
        description: metadata.description,
        image: ogImageUrl,
        url: absoluteUrl("/software/line_ai"),
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          url: "https://lin.ee/45Fuxvc",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Software",
            item: absoluteUrl("/software"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "あざらし君@AI",
            item: absoluteUrl("/software/line_ai"),
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd id="line-ai-json-ld" data={lineAiJsonLd} />
      <LineAiPage />
    </>
  );
}
