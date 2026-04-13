"use client";

import { useEffect } from "react";
import { useRef } from "react";

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
  const adRef = useRef<HTMLModElement | null>(null);
  const hasPushedRef = useRef(false);

  useEffect(() => {
    const pushAd = () => {
      if (hasPushedRef.current) return;

      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        hasPushedRef.current = true;
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.warn("Failed to load Google ad:", error);
        }
      }
    };

    if (!adRef.current || !("IntersectionObserver" in window)) {
      pushAd();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          pushAd();
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(adRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <ins
      ref={adRef}
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
