import type { Metadata } from "next";
import YoutubePage from "../../views/youtube/+Page";
import { data } from "../../views/youtube/+data";
import { createPageMetadata } from "../../utils/seo";

export const metadata: Metadata = createPageMetadata({
  title: "YouTube",
  description: "Himawari ProjectのYouTube動画一覧です。",
  path: "/youtube",
});

export default async function Page() {
  const { videoItems } = await data();
  return <YoutubePage videoItems={videoItems} />;
}
