/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: { 
    unoptimized: true,
    domains: ['image.tmdb.org', 'images.pexels.com']
  },
  webpack: (config, { isServer }) => {
    // Force Webpack to use in-memory cache to avoid file system issues
    config.cache = { type: 'memory' };
    return config;
  }
};

module.exports = nextConfig;