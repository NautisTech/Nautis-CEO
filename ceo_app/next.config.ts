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
        destination: '/en/dashboards/crm',
        permanent: true,
        locale: false
      },
      {
        source: '/:lang(en|pt|es|de|fr|it)',
        destination: '/:lang/dashboards/crm',
        permanent: true,
        locale: false
      },
    ]
  }
}

export default nextConfig
