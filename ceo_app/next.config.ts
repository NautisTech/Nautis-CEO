import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH,

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:9832/:path*',
      },
    ]
  },

  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/pt/dashboards/crm',
        permanent: true,
        locale: false
      },
      {
        source: '/:lang(en|pt|es|de|fr|it|mn)',
        destination: '/:lang/dashboards/crm',
        permanent: true,
        locale: false
      },
    ]
  },

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9832',
        pathname: '/api/uploads/**',
      },
      // {
      //   protocol: 'https',
      //   hostname: 'your-production-domain.com',
      //   pathname: '/api/uploads/**',
      // },
    ],
  },
}

export default nextConfig
