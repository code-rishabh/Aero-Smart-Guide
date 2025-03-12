/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'tasl.runtimetheory.com',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'tasl.runtimetheory.com',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  output: 'standalone',
}

module.exports = nextConfig 