'use client'

import { useEffect, useState } from 'react'

export interface TenantConfig {
  tenantName: string
  clientPortal: boolean
  supplierPortal: boolean
  ticketPortal: boolean
  useTenantLogo: boolean
  tenantLogoPath: string | null
  tenantLogoPathDark: string | null
}

export const useTenantConfig = () => {
  const [config, setConfig] = useState<TenantConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchConfig = async () => {
      const tenantSlug = process.env.NEXT_PUBLIC_TENANT_SLUG

      if (!tenantSlug) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/configuracoes/public/${tenantSlug}/tenant-config`
        )

        if (!response.ok) {
          throw new Error('Erro ao carregar configurações do tenant')
        }

        const result = await response.json()
        setConfig(result.data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro desconhecido'))
        console.error('Erro ao carregar configurações do tenant:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [])

  return { config, loading, error }
}
