// ceo_app/src/contexts/AuthContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { apiClient } from '@/libs/api/client'

// ==================== INTERFACES ====================
interface User {
  id: number
  email: string
  username: string
  fotoUrl: string | null
}

export interface Tenant {
  id: number
  nome: string
  slug: string
}

export interface Empresa {
  id: number
  nome: string
  principal: boolean
}

interface AuthContextType {
  // Estado de autenticação
  isAuthenticated: boolean
  isLoading: boolean
  
  // Dados do utilizador
  user: User | null
  tenant: Tenant | null
  empresas: Empresa[]
  empresaPrincipal: Empresa | null
  permissions: string[]
  
  // Tokens
  accessToken: string | null
  
  // Métodos
  refreshUserData: () => Promise<void>
  setEmpresaPrincipal: (empresaId: number) => void
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  hasAllPermissions: (permissions: string[]) => boolean
  logout: () => Promise<void>
}

// ==================== CONTEXT ====================
const AuthContext = createContext<AuthContextType>({} as AuthContextType)

// ==================== PROVIDER ====================
export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [empresaPrincipal, setEmpresaPrincipalState] = useState<Empresa | null>(null)
  const [permissions, setPermissions] = useState<string[]>([])

  // ========== Sincronizar com NextAuth Session ==========
  useEffect(() => {
    if (status === 'authenticated' && session) {
      // Atualizar user
      if (session.user) {
        setUser({
          id: parseInt(session.user.id),
          email: session.user.email || '',
          username: session.user.name || '',
          fotoUrl: session.user.image || null
        })
      }

      // Atualizar tenant
      if (session.tenant) {
        setTenant(session.tenant)
      }

      // Atualizar empresas
      if (session.empresas) {
        setEmpresas(session.empresas)
        const principal = session.empresas.find((e: Empresa) => e.principal)
        setEmpresaPrincipalState(principal || session.empresas[0] || null)
      }

      // Atualizar permissões (se existirem no JWT)
      if ('permissions' in session) {
        setPermissions((session as any).permissions || [])
      }

      // Sincronizar tokens com localStorage
      if (session.accessToken) {
        localStorage.setItem('accessToken', session.accessToken)
      }
      if (session.refreshToken) {
        localStorage.setItem('refreshToken', session.refreshToken)
      }
    } else if (status === 'unauthenticated') {
      // Limpar dados quando não autenticado
      setUser(null)
      setTenant(null)
      setEmpresas([])
      setEmpresaPrincipalState(null)
      setPermissions([])
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }, [session, status])

  // ========== Refresh User Data ==========
  const refreshUserData = async () => {
    try {
      const response = await apiClient.getProfile()
      if (response.user) {
        setUser({
          id: response.user.id,
          email: response.user.email,
          username: response.user.username,
          fotoUrl: response.user.fotoUrl || null
        })
      }
    } catch (error) {
      console.error('Error refreshing user data:', error)
    }
  }

  // ========== Set Empresa Principal ==========
  const setEmpresaPrincipal = (empresaId: number) => {
    const empresa = empresas.find(e => e.id === empresaId)
    if (empresa) {
      setEmpresaPrincipalState(empresa)
      
      // Persistir no localStorage
      localStorage.setItem('empresaPrincipalId', empresaId.toString())
      
      // Opcional: persistir no backend
      apiClient.post('/user/empresa-principal', { empresaId }).catch(console.error)
    }
  }

  // ========== Permission Checks ==========
  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission)
  }

  const hasAnyPermission = (perms: string[]): boolean => {
    return perms.some(p => permissions.includes(p))
  }

  const hasAllPermissions = (perms: string[]): boolean => {
    return perms.every(p => permissions.includes(p))
  }

  // ========== Logout ==========
  const logout = async () => {
    try {
      // Chamar API de logout
      await apiClient.logout()
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      // Limpar localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('empresaPrincipalId')
      
      // Fazer signOut do NextAuth
      await signOut({ redirect: true, callbackUrl: '/login' })
    }
  }

  // ========== Context Value ==========
  const value: AuthContextType = {
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    user,
    tenant,
    empresas,
    empresaPrincipal,
    permissions,
    accessToken: session?.accessToken || null,
    refreshUserData,
    setEmpresaPrincipal,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ==================== HOOKS ====================

// Hook principal
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

// Hook para empresa atual
export function useEmpresaAtual() {
  const { empresaPrincipal, setEmpresaPrincipal, empresas } = useAuth()
  
  return {
    empresaAtual: empresaPrincipal,
    setEmpresaAtual: setEmpresaPrincipal,
    empresas,
    todasEmpresas: empresas
  }
}

// Hook para permissões
export function usePermissions() {
  const { hasPermission, hasAnyPermission, hasAllPermissions, permissions } = useAuth()
  
  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions,
    // Helpers CRUD
    canCreate: (resource: string) => hasPermission(`${resource}.create`),
    canRead: (resource: string) => hasPermission(`${resource}.read`),
    canUpdate: (resource: string) => hasPermission(`${resource}.update`),
    canDelete: (resource: string) => hasPermission(`${resource}.delete`),
    canManage: (resource: string) => hasPermission(`${resource}.manage`)
  }
}

// Hook para verificar autenticação
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()
  
  return {
    isAuthenticated,
    isLoading,
    isReady: !isLoading && isAuthenticated
  }
}