import { useState, memo, useCallback } from "react";
import type { Post } from "../types/Post";

interface PostCardProps {
  post: Omit<Post, "content">;
  compact?: boolean;
  featured?: boolean;
}

const DEFAULT_IMAGE =
  "https://dq7c5b6uxkdk2.cloudfront.net/posts/images/himawari.png";

const PostCard = memo(
  function PostCard({
    post,
    compact = false,
    featured = false,
  }: PostCardProps) {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const baseCardClasses =
      "bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-200";

    const cardClasses = compact
      ? `flex ${baseCardClasses} h-24 sm:h-28`
      : `${baseCardClasses} max-w-sm mx-auto`;

    const handleImageError = useCallback(() => {
      if (!imageError) {
        console.warn(
          `Failed to load image for post "${post.title}": ${post.coverImage}`
        );
        setImageError(true);
        setImageLoading(false);
      }
    }, [imageError, post.title, post.coverImage]);

    const handleImageLoad = useCallback(() => {
      setImageLoading(false);
    }, []);

    const getImageSrc = useCallback(() => {
      if (imageError || !post.coverImage) {
        return DEFAULT_IMAGE;
      }
      return post.coverImage;
    }, [imageError, post.coverImage]);

    return (
      <a
        href={`/blog/${post.slug}`}
        className={`block ${cardClasses} group contain-layout gpu-accelerated`}
      >
        {compact ? (
          <>
            {/* Compact layout - horizontal */}
            <div className="w-20 sm:w-24 md:w-28 flex-shrink-0 relative">
              {imageLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="w-6 h-6 text-gray-400">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              )}
              <img
                src={getImageSrc()}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 will-change-transform"
                loading="lazy"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
              {featured && (
                <div className="absolute top-1 right-1">
                  <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full shadow-sm">
                    ★
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 p-3 sm:p-4 min-w-0">
              <div className="flex items-start justify-between mb-1.5">
                <time className="text-xs sm:text-sm text-gray-500 flex-shrink-0">
                  {new Date(post.date).toLocaleDateString("ja-JP", {
                    month: "short",
                    day: "numeric",
                  })}
                </time>
                {featured && (
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full ml-2 hidden sm:inline">
                    おすすめ
                  </span>
                )}
              </div>
              <h4 className="font-semibold text-gray-800 group-hover:text-orange-500 transition-colors duration-200 text-sm sm:text-base leading-tight mb-2 line-clamp-2">
                {post.title}
              </h4>
              {post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded truncate max-w-20 sm:max-w-none">
                    {post.categories[0]}
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Full layout - vertical */}
            <div className="relative h-48 sm:h-52 overflow-hidden">
              {imageLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="w-12 h-12 text-gray-400">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              )}
              <img
                src={getImageSrc()}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 will-change-transform"
                loading="lazy"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
              {featured && (
                <div className="absolute top-3 right-3">
                  <span className="bg-orange-500 text-white text-sm px-2 py-1 rounded-full shadow-lg">
                    おすすめ
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 will-change-opacity"></div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <time className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString("ja-JP")}
                </time>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-orange-500 transition-colors duration-200 mb-3 leading-tight">
                {post.title}
              </h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {post.categories && post.categories.length > 0 && (
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {post.categories[0]}
                  </span>
                )}
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full hover:bg-orange-200 transition-colors duration-200"
                    >
                      #{tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-xs text-gray-500 px-2 py-1">
                      +{post.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </a>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for memo optimization
    return (
      prevProps.post.slug === nextProps.post.slug &&
      prevProps.post.title === nextProps.post.title &&
      prevProps.post.date === nextProps.post.date &&
      prevProps.post.coverImage === nextProps.post.coverImage &&
      prevProps.compact === nextProps.compact &&
      prevProps.featured === nextProps.featured &&
      JSON.stringify(prevProps.post.categories) ===
        JSON.stringify(nextProps.post.categories) &&
      JSON.stringify(prevProps.post.tags) ===
        JSON.stringify(nextProps.post.tags)
    );
  }
);

export default PostCard;
