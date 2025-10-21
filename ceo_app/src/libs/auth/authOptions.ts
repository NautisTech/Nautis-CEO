import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                tenant_slug: { label: "Tenant", type: "text" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password || !credentials?.tenant_slug) {
                    return null
                }

                try {
                    // Chamar sua API de login
                    const res = await fetch(`${process.env.API_URL}/auth/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                            tenant_slug: credentials.tenant_slug,
                        }),
                    })

                    const data = await res.json()

                    if (!res.ok || !data.accessToken) {
                        return null
                    }

                    // Retornar user object
                    return {
                        id: data.user.id.toString(),
                        email: data.user.email,
                        name: data.user.username,
                        image: data.user.fotoUrl,
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                        tenant: data.tenant,
                        empresas: data.empresas,
                    }
                } catch (error) {
                    console.error('Auth error:', error)
                    return null
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken
                token.refreshToken = user.refreshToken
                token.tenant = user.tenant
                token.empresas = user.empresas
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.sub!
                session.accessToken = token.accessToken!
                session.refreshToken = token.refreshToken!
                session.tenant = token.tenant!
                session.empresas = token.empresas!
            }
            return session
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 24 horas
    },
    secret: process.env.NEXTAUTH_SECRET,
}