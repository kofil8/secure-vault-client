import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  images: {
    domains: ["localhost", "srv880652.hstgr.cloud"],
  },
};

export default nextConfig;
