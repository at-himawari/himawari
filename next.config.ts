import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
