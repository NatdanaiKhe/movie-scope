import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable strict mode for better error handling
  reactStrictMode: true,
  
  // Image optimization configuration
  images: {
    domains: [], // Add external image domains here
    remotePatterns: [
      // Example:
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      }
    ],
  },
  
  // Environment variables available to the browser (prefix with NEXT_PUBLIC_)
  env: {
    // Add public env variables here if needed
  },
  
  // API routes configuration
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

export default nextConfig;
