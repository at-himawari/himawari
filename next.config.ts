import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

initOpenNextCloudflareForDev();

export default nextConfig;
