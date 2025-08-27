import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker production builds
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  
  // Note: API configuration moved to individual API routes in Next.js 13+
  
  // Environment variables for client-side
  env: {
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
  },
  
  // Server external packages for Docker support
  serverExternalPackages: ['typeorm', 'pg'],
  
  // Image optimization for Docker
  images: {
    // Allow all domains for flexibility in development
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Disable optimization in development for better compatibility
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
