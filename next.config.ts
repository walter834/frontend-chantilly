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
        protocol: 'https',
        hostname: 'chantilly-app-px74f.ondigitalocean.app',
        port: '',
        pathname: '/storage/**',
      },
    ],
  },
};

export default nextConfig;
