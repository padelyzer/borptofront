/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: 'https://botpro-2p7g.onrender.com/:path*',
      },
    ]
  },
}

module.exports = nextConfig