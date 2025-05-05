import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, 
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", 
    },
  },
  reactStrictMode: false,
  
};

export default nextConfig;
