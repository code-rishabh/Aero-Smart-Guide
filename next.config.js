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
  }
}

module.exports = nextConfig 