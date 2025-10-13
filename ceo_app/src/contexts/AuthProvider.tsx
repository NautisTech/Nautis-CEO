'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/libs/api/client'

interface User {
  id: number
  email: string
  nome: string
  tenant_slug: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string, tenant_slug: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Verificar sessão ao carregar
  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        setLoading(false)
        return
      }

      // Configurar token no client
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`

      // Buscar dados do usuário
      const response = await apiClient.get('/auth/me')
      setUser(response.data)
    } catch (error) {
      console.error('Error checking session:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('tenant_slug')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string, tenant_slug: string) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
        tenant_slug,
      }, {
        successMessage: 'Login realizado com sucesso!',
        errorMessage: 'Erro ao fazer login. Verifique suas credenciais.'
      })

      const { access_token, user: userData } = response.data

      // Salvar token
      localStorage.setItem('token', access_token)
      localStorage.setItem('tenant_slug', tenant_slug.toString())

      // Configurar token no client
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

      // Atualizar estado
      setUser(userData)

    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer login')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('tenant_slug')
    delete apiClient.defaults.headers.common['Authorization']
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}