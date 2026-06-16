import type { Metadata } from "next";
import JsonLd from "../../components/JsonLd";
import SoftwarePage from "../../views/software/+Page";
import { data } from "../../views/software/+data";
import { absoluteUrl, createPageMetadata } from "../../utils/seo";

export const metadata: Metadata = createPageMetadata({
  title: "ソフトウェア・プロダクト",
  description:
    "Himawari Projectが開発・公開しているAIツール、業務効率化ツール、Webアプリケーション、LINE連携プロダクトの一覧です。",
  path: "/software",
});

export default async function Page() {
  const { content } = await data();
  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${absoluteUrl("/software")}#collection`,
        name: "Himawari Projectのソフトウェア・プロダクト",
        description: metadata.description,
        url: absoluteUrl("/software"),
        inLanguage: "ja",
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
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd id="software-json-ld" data={softwareJsonLd} />
      <SoftwarePage content={content} />
    </>
  );
}
