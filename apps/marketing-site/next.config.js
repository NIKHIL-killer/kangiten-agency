/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: 'avatars.githubusercontent.com' },
      { hostname: 'images.unsplash.com' },
      { hostname: 'cdn.sanity.io' },
    ],
  },
  experimental: {
    mdxRs: true,
  },
}

module.exports = nextConfig