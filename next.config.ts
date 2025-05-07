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
  images: {
    domains: [
      "services-testbucket.s3.us-east-1.amazonaws.com",
      "another-bucket.s3.amazonaws.com",
      "cdn.example.com",
     
    ],
  },
};

export default nextConfig;
