import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mowdmin.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'mowdmin.vercel.app',
      },
    ],
  },
};

export default nextConfig;
