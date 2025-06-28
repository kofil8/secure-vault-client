import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  images: {
    domains: ["localhost"],
  },
  pdf: {
    enabled: true,
    output: "export",
  },
};

export default nextConfig;
