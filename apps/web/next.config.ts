import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  transpilePackages: ['@parselayer/config'],
  experimental: { typedRoutes: true },
};

export default nextConfig;
