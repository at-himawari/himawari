import YoutubePage from "../../views/youtube/+Page";
import { data } from "../../views/youtube/+data";

export default async function Page() {
  const { videoItems } = await data();
  return <YoutubePage videoItems={videoItems} />;
}
