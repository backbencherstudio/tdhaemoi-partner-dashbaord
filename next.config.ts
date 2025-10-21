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
        hostname: '192.168.7.12',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'apparel-yourself-fairy-citysearch.trycloudflare.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
