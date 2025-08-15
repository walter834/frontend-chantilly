import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Allow production builds to successfully complete even if
    // there are ESLint warnings or errors. We'll fix them incrementally.
    ignoreDuringBuilds: true,
  },
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