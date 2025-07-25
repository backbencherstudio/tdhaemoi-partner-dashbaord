import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'td.signalsmind.com',
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
        hostname: 'date-advanced-electrical-hypothetical.trycloudflare.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
