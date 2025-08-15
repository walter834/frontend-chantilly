import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'chantilly-app-px74f.ondigitalocean.app',
        port: '',
        pathname: '/storage/product/**',
      },
      {
        protocol: 'https',
        hostname: 'chantilly-app-px74f.ondigitalocean.app',
        port: '',
        pathname: '/storage/product/**',
      },
    ],
  },
  
};

export default nextConfig;