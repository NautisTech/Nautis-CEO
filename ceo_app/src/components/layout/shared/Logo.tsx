'use client'

// React Imports
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

// Third-party Imports
import styled from '@emotion/styled'

// Type Imports
import type { VerticalNavContextProps } from '@menu/contexts/verticalNavContext'

// Component Imports
import VuexyLogo from '@core/svg/Logo'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'
import { useTenantConfig } from '@/hooks/useTenantConfig'

type LogoTextProps = {
  isHovered?: VerticalNavContextProps['isHovered']
  isCollapsed?: VerticalNavContextProps['isCollapsed']
  transitionDuration?: VerticalNavContextProps['transitionDuration']
  isBreakpointReached?: VerticalNavContextProps['isBreakpointReached']
  color?: CSSProperties['color']
}

const LogoText = styled.span<LogoTextProps>`
  color: ${({ color }) => color ?? 'var(--mui-palette-text-primary)'};
  font-size: 1.375rem;
  line-height: 1.09091;
  font-weight: 700;
  letter-spacing: 0.25px;
  transition: ${({ transitionDuration }) =>
    `margin-inline-start ${transitionDuration}ms ease-in-out, opacity ${transitionDuration}ms ease-in-out`};

  ${({ isHovered, isCollapsed, isBreakpointReached }) =>
    !isBreakpointReached && isCollapsed && !isHovered
      ? 'opacity: 0; margin-inline-start: 0;'
      : 'opacity: 1; margin-inline-start: 12px;'}
`

const Logo = ({ color }: { color?: CSSProperties['color'] }) => {
  // Refs
  const logoTextRef = useRef<HTMLSpanElement>(null)

  // Hooks
  const { isHovered, transitionDuration, isBreakpointReached } = useVerticalNav()
  const { settings } = useSettings()
  const { config: tenantConfig, loading: configLoading } = useTenantConfig()

  // State para forçar re-render quando tema muda
  const [currentLogoSrc, setCurrentLogoSrc] = useState<string | null>(null)

  // Vars
  const { layout, mode } = settings

  useEffect(() => {
    if (layout !== 'collapsed') {
      return
    }

    if (logoTextRef && logoTextRef.current) {
      if (!isBreakpointReached && layout === 'collapsed' && !isHovered) {
        logoTextRef.current?.classList.add('hidden')
      } else {
        logoTextRef.current.classList.remove('hidden')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, layout, isBreakpointReached])

  // Atualizar logo quando modo ou config mudar
  useEffect(() => {
    if (configLoading || !tenantConfig?.useTenantLogo) {
      setCurrentLogoSrc(null)
      return
    }

    if (mode === 'dark' && tenantConfig.tenantLogoPathDark) {
      setCurrentLogoSrc(tenantConfig.tenantLogoPathDark)
    } else {
      setCurrentLogoSrc(tenantConfig.tenantLogoPath)
    }
  }, [mode, tenantConfig, configLoading])

  return (
    <div className='flex items-center'>
      {currentLogoSrc ? (
        <img
          key={currentLogoSrc}
          src={currentLogoSrc}
          alt='Logo'
          style={{ height: '40px', maxWidth: '180px', objectFit: 'contain' }}
          onError={(e) => {
            console.warn('Erro ao carregar logo do tenant, usando logo padrão')
            // Em caso de erro, esconder a imagem e mostrar o logo padrão
            e.currentTarget.style.display = 'none'
          }}
        />
      ) : (
        <VuexyLogo className='text-2xl text-primary' style={{ width: '2.8583em', height: '2em' }} />
      )}
      {/* <LogoText
        color={color}
        ref={logoTextRef}
        isHovered={isHovered}
        isCollapsed={layout === 'collapsed'}
        transitionDuration={transitionDuration}
        isBreakpointReached={isBreakpointReached}
      >
        {themeConfig.templateName}
      </LogoText> */}
    </div>
  )
}

export default Logo
