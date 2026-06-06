import React from "react";
import { getThumbnailUrl } from "../utils/youtube";
import { trackSelectContent } from "../utils/analytics";

interface VideoCardProps {
  title: string;
  description: string;
  videoUrl: string;
}

const VideoCard: React.FC<VideoCardProps> = ({
  title,
  description,
  videoUrl,
}) => {
  const thumbnailUrl = getThumbnailUrl(videoUrl);
  const trackVideoClick = () => {
    trackSelectContent("video", videoUrl, title);
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-4 bg-white">
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={trackVideoClick}
      >
        <img className="w-full" src={thumbnailUrl} alt={title} />
      </a>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{description}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
          onClick={trackVideoClick}
        >
          動画を見る
        </a>
      </div>
    </div>
  );
};

export default VideoCard;
