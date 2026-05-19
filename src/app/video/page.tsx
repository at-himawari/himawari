import type { Metadata } from "next";
import VideoPage from "../../views/video/+Page";
import { createPageMetadata } from "../../utils/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Video",
  description: "Himawari Projectの動画コンテンツです。",
  path: "/video",
});

export default function Page() {
  return <VideoPage />;
}
