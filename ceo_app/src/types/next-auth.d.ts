import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    id: string
    email: string
    name: string
    image?: string
    accessToken?: string
    refreshToken?: string
    tenant?: {
      id: number
      nome: string
      slug: string
    }
    empresas?: Array<{
      id: number
      nome: string
      principal: boolean
    }>
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
    }
    accessToken: string
    refreshToken: string
    tenant: {
      id: number
      nome: string
      slug: string
    }
    empresas: Array<{
      id: number
      nome: string
      principal: boolean
    }>
    permissions?: string[]
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string
    accessToken?: string
    refreshToken?: string
    tenant?: {
      id: number
      nome: string
      slug: string
    }
    empresas?: Array<{
      id: number
      nome: string
      principal: boolean
    }>
    permissions?: string[]
  }
}