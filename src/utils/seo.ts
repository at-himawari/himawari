import type { Metadata } from "next";
import {
  description as siteDescription,
  ogImageUrl,
  postUrl,
  title as siteTitle,
  twitterSite,
} from "../const/pageConstants";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  tags?: string[];
  noIndex?: boolean;
};

const defaultImage = ogImageUrl;

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  if (path === "/") {
    return `${postUrl}/`;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalPath = normalizedPath.endsWith("/")
    ? normalizedPath
    : `${normalizedPath}/`;

  return `${postUrl}${canonicalPath}`;
}

export function toPlainText(value = ""): string {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[#>*_~|-]/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function createDescription(value = siteDescription, maxLength = 150) {
  const text = toPlainText(value) || siteDescription;

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trim()}...`;
}

export function createPageMetadata({
  title,
  description,
  path,
  image = defaultImage,
  type = "website",
  publishedTime,
  tags,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const pageTitle = title.replace(` | ${siteTitle}`, "");
  const fullTitle = pageTitle === siteTitle ? siteTitle : `${pageTitle} | ${siteTitle}`;

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteTitle,
      images: [image],
      type,
      publishedTime,
      tags,
      locale: "ja_JP",
    },
    twitter: {
      card: image === defaultImage ? "summary" : "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      site: twitterSite,
    },
  };
}
