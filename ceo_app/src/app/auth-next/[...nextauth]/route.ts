import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { apiClient } from '@/libs/api/client'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        tenantSlug: { label: 'tentant_slug', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        try {
          // Chama a TUA API no backend
          const response = await apiClient.login(
            credentials.email,
            credentials.password,
            credentials.tenantSlug
          )

          return {
            id: response.user.id.toString(),
            email: response.user.email,
            name: response.user.username,
            image: response.user.fotoUrl ?? undefined,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            tenant: response.tenant,
            empresas: response.empresas
          }
        } catch (error: any) {
          console.error('Login error:', error)
          throw new Error(JSON.stringify(error.response?.data || { message: 'Login failed' }))
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
    signOut: '/login',
    error: '/login'
  },

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // 24 horas
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.userId = user.id
        token.tenant = user.tenant
        token.empresas = user.empresas
      }

      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId as string
        session.accessToken = token.accessToken as string
        session.refreshToken = token.refreshToken as string
        session.tenant = token.tenant as any
        session.empresas = token.empresas as any
      }

      return session
    }
  },

  events: {
    async signOut() {
      try {
        await apiClient.logout()
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }