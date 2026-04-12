// src/views/youtube/+data.ts
import { getVideos } from "../../utils/getVideos";

export async function data() {
  const videoItems = await getVideos();
  return {
    videoItems,
  };
}
