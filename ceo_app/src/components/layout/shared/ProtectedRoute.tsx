'use client'

import { useAuth } from '@/contexts/AuthProvider'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { useParams } from 'next/navigation'

interface ProtectedRouteProps {
  children: ReactNode
  requireAuth?: boolean
  requiredPermissions?: string[]
  fallbackUrl?: string
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requiredPermissions = [],
  fallbackUrl = ''
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasAllPermissions } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const { lang: locale } = params

  if (!fallbackUrl || fallbackUrl.trim() === '') {
    fallbackUrl = locale ? `\\${locale}\\login` : '\\'
  }

  useEffect(() => {
    if (!isLoading && requireAuth) {
      // Não está autenticado
      if (!isAuthenticated) {
        // Salva a URL atual para redirecionar depois do login
        const redirectUrl = `${fallbackUrl}?redirectTo=${encodeURIComponent(pathname)}`
        router.push(redirectUrl)
        return
      }

      // Verifica permissões se necessário
      if (requiredPermissions.length > 0 && !hasAllPermissions(requiredPermissions)) {
        router.push(`\\${locale}\\unauthorized`)
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, requiredPermissions, router, pathname, fallbackUrl, hasAllPermissions])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <CircularProgress size={48} />
          <p className="mt-4 text-gray-600">A carregar...</p>
        </div>
      </div>
    )
  }

  // Não autenticado
  if (requireAuth && !isAuthenticated) {
    return null
  }

  // Sem permissões necessárias
  if (requiredPermissions.length > 0 && !hasAllPermissions(requiredPermissions)) {
    return null
  }

  // Tudo OK - mostra o conteúdo
  return <>{children}</>
}