import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        tenantSlug: { label: 'tenant_slug', type: 'text' }
      },
      async authorize(credentials) {

        if (!credentials?.email || !credentials?.password) {
          console.error('[Auth] Missing credentials')
          return null
        }

        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9832'
          const tenantSlug = credentials.tenantSlug || process.env.NEXT_PUBLIC_TENANT_SLUG || 'nautis'
          const response = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              tenant_slug: tenantSlug
            }),
          })


          // Lê o body uma vez
          const responseText = await response.text()

          if (!response.ok) {
            console.error('[Auth] API error')

            let errorMessage = 'Credenciais inválidas'
            try {
              const errorData = JSON.parse(responseText)
              errorMessage = errorData.message || errorMessage
            } catch {
              console.error('[Auth] Could not parse error response')
            }

            throw new Error(JSON.stringify({
              message: errorMessage,
              status: response.status
            }))
          }

          let data
          try {
            data = JSON.parse(responseText)
          } catch (parseError) {
            console.error('[Auth] Failed to parse response:', parseError)
            throw new Error(JSON.stringify({
              message: 'Invalid response from server',
              status: 500
            }))
          }

          if (!data.accessToken || !data.user) {
            console.error('[Auth] Invalid response structure:', data)
            throw new Error(JSON.stringify({
              message: 'Invalid response from server',
              status: 500
            }))
          }

          return {
            id: data.user.id.toString(),
            email: data.user.email,
            name: data.user.username,
            image: data.user.fotoUrl || null,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            tenant: data.tenant,
            empresas: data.empresas
          }
        } catch (error: any) {
          console.error('[Auth] Authorization error:', error)

          // Se já é um erro formatado, retorna null (NextAuth vai mostrar o erro)
          if (error.message && error.message.startsWith('{')) {
            return null
          }

          // Erro de rede ou outro
          return null
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    })
  ],

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },

  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.userId = user.id
        token.tenant = user.tenant
        token.empresas = user.empresas
      }

      if (trigger === 'update') {
      }

      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId as string
        session.accessToken = token.accessToken as string
        session.refreshToken = token.refreshToken as string
        session.tenant = token.tenant as any
        session.empresas = token.empresas as any
      }

      return session
    },

    async redirect({ url, baseUrl }) {

      // Se a URL começa com /, adiciona o baseUrl
      if (url.startsWith('/')) {
        const redirectUrl = `${baseUrl}${url}`
        return redirectUrl
      }

      // Se é do mesmo origin, permite
      if (new URL(url).origin === baseUrl) {
        return url
      }

      return baseUrl
    }
  },

  events: {
    async signIn({ user }) {
    },
    async signOut() {
    },
  },

  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }