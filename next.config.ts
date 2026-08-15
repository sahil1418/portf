import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['three'],
  images: {
    domains: ['avatars.githubusercontent.com', 'raw.githubusercontent.com'],
  },
};

export default nextConfig;
