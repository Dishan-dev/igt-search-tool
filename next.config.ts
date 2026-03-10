import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* API calls use absolute URLs via NEXT_PUBLIC_API_BASE_URL env var */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
