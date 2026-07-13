import type { MetadataRoute } from "next";
import { getPosts } from "../utils/getPosts";
import { absoluteUrl } from "../utils/seo";

const staticRoutes = [
  { path: "/", priority: 1 },
  { path: "/blog", priority: 0.9 },
  { path: "/software", priority: 0.8 },
  { path: "/software/line_ai", priority: 0.8 },
  { path: "/project", priority: 0.7 },
  { path: "/youtube", priority: 0.7 },
  { path: "/video", priority: 0.6 },
  { path: "/commercial", priority: 0.6 },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const posts = await getPosts({ throwOnError: true });

  const staticItems = staticRoutes.map(({ path, priority }) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority,
  }));

  const postItems = posts
    .filter((post) => post.slug)
    .map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [...staticItems, ...postItems];
}
