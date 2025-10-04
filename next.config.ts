import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'backend.feetf1rst.tech',
      },
      {
        // local host
        protocol: 'http',
        hostname: '192.168.4.3',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'signals-hopefully-diverse-ranges.trycloudflare.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
