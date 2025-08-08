import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.18.28',
        port: '8000',
        pathname: '/storage/**',
      },
    ],
  },
};

export default nextConfig;
