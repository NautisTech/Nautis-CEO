'use client'

// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import { styled, useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'
import type { Dictionary } from '@/types/dictionary'

// Component Imports
import { Menu, MenuItem, SubMenu } from '@menu/vertical-menu'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

type Props = {
  dictionary: Dictionary
  mode?: 'light' | 'dark' | 'system'
  scrollMenu?: (container: HTMLElement, isPerfectScrollbar: boolean) => void
}

const PortalNavigation = ({ dictionary, mode, scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const { isBreakpointReached, transitionDuration } = useVerticalNav()

  // Refs
  const shadowRef = useRef(null)

  // Vars
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  const scrollMenuFunc = (container: HTMLElement) => {
    scrollMenu?.(container, !isBreakpointReached)
  }

  useEffect(() => {
    if (settings.layout === 'collapsed') {
      const shadowEl = shadowRef.current

      if (shadowEl) {
        shadowEl.style.setProperty('display', 'none')
      }
    }
  }, [settings.layout])

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? { className: 'bs-full overflow-y-auto overflow-x-hidden', onScroll: scrollMenuFunc }
        : { options: { wheelPropagation: false, suppressScrollX: true }, onScrollY: scrollMenuFunc })}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(theme, 'tabler-circle')}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(theme)}
      >
        <MenuItem href={`/dashboard`} icon={<i className='tabler-smart-home' />}>
          Dashboard
        </MenuItem>
        <MenuItem href={`/tickets`} icon={<i className='tabler-ticket' />}>
          Meus Tickets
        </MenuItem>
        <MenuItem href={`/perfil`} icon={<i className='tabler-user' />}>
          Perfil
        </MenuItem>
      </Menu>
    </ScrollWrapper>
  )
}

export default PortalNavigation
