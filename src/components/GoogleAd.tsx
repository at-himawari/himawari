"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type GoogleAdProps = {
  slot: string;
  layout?: string;
  format: string;
  fullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export default function GoogleAd({
  slot,
  layout,
  format,
  fullWidthResponsive,
  className = "",
  style = { display: "block" },
}: GoogleAdProps) {
  useEffect(() => {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("Failed to load Google ad:", error);
      }
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className}`.trim()}
      style={style}
      data-ad-layout={layout}
      data-ad-format={format}
      data-ad-client="ca-pub-6651283997191475"
      data-ad-slot={slot}
      data-full-width-responsive={
        fullWidthResponsive === undefined
          ? undefined
          : String(fullWidthResponsive)
      }
    />
  );
}
