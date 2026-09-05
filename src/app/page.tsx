import type { Metadata } from "next";
import JsonLd from "../components/JsonLd";
import HomePage from "../views/index/+Page";
import { data } from "../views/index/+data";
import { description, title } from "../const/pageConstants";
import { absoluteUrl, createPageMetadata } from "../utils/seo";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/",
});

export default async function Page() {
  const pageData = await data();
  const homeJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${absoluteUrl("/")}#home`,
        name: title,
        description,
        url: absoluteUrl("/"),
        inLanguage: "ja",
        about: [
          "AI活用",
          "ソフトウェア開発",
          "Web制作",
          "映像制作",
          "技術ブログ",
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${absoluteUrl("/")}#featured-products`,
        name: "Himawari Projectのプロダクト",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "議事録メーカー",
            url: "https://gijiroku-maker.at-himawari.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "AI面接コーチ",
            url: "https://aimensetsu.at-himawari.com/",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "あざらし君@AI LINE公式アカウント",
            url: absoluteUrl("/software/line_ai"),
          },
          {
            "@type": "ListItem",
            position: 4,
            name: "ポモドーロタイマー",
            url: "https://pomodoro.at-himawari.com/",
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd id="home-json-ld" data={homeJsonLd} />
      <HomePage data={pageData} />
    </>
  );
}
