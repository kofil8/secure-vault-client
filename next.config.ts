import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "http", // Changed from "https" to "http"
        hostname: "localhost",
        port: "7001", // Added port to match your image src
      },
    ],
  },
};

export default nextConfig;
