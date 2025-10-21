import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { authOptions } from '@/libs/auth/authOptions'


const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }