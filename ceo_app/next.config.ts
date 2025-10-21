import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH,

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL || 'http://localhost:9833'}/:path*`,
      },
    ];
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
        hostname: new URL(process.env.API_URL || 'http://localhost:9833').hostname,
        port: new URL(process.env.API_URL || 'http://localhost:9833').port,
        pathname: '/api/uploads/**',
      },
    ],
  },

  eslint: {
    // Desativa ESLint durante o build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignora erros de tipo durante o build
    ignoreBuildErrors: true,
  },
}

export default nextConfig
