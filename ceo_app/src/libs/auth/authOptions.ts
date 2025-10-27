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
                    // Verificar variáveis de ambiente
                    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9832'

                    // Construir URL final
                    const finalUrl = `${apiUrl}/auth/login`

                    // Payload
                    const payload = {
                        email: credentials.email,
                        password: credentials.password,
                        tenant_slug: credentials.tenant_slug,
                    }

                    // Fazer requisição
                    const res = await fetch(finalUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload),
                    })

                    // Ler resposta
                    const data = await res.json()

                    if (!res.ok || !data.accessToken) {
                        return null
                    }

                    return {
                        id: data.user.id.toString(),
                        email: data.user.email,
                        name: data.user.username,
                        image: data.user.fotoUrl,
                        tipo_utilizador: data.user.tipo_utilizador,
                        cliente_id: data.user.cliente_id,
                        funcionario_id: data.user.funcionario_id,
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                        tenant: data.tenant,
                        empresas: data.empresas,
                    }
                } catch (error: any) {
                    return null
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken
                token.refreshToken = user.refreshToken
                token.tenant = user.tenant
                token.empresas = user.empresas
                token.tipo_utilizador = user.tipo_utilizador
                token.cliente_id = user.cliente_id
                token.funcionario_id = user.funcionario_id
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.sub!
                session.accessToken = token.accessToken as string
                session.refreshToken = token.refreshToken as string
                session.tenant = token.tenant as any
                session.empresas = token.empresas as any;
                (session.user as any).tipo_utilizador = token.tipo_utilizador;
                (session.user as any).cliente_id = token.cliente_id;
                (session.user as any).funcionario_id = token.funcionario_id
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