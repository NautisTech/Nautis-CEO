'use client'

// React Imports
import { useCallback, useRef, useState, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import IconButton from '@mui/material/IconButton'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid2'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Theme } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'

// Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { Locale } from '@configs/i18n'
import type { getDictionary } from '@/utils/getDictionary'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import { useModules } from '@/contexts/AuthProvider'
import { useTiposConteudo } from '@/libs/api/conteudos'
import { useShortcuts } from '@/hooks/useShortcuts'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Data Imports
import { generateAvailableShortcuts } from '@/data/shortcutsData'
import type { ShortcutData } from '@/data/shortcutsData'

export type ShortcutsType = ShortcutData

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <div className='overflow-x-hidden bs-full'>{children}</div>
  } else {
    return (
      <PerfectScrollbar className='bs-full' options={{ wheelPropagation: false, suppressScrollX: true }}>
        {children}
      </PerfectScrollbar>
    )
  }
}

const ShortcutsDropdown = ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) => {
  // States
  const [open, setOpen] = useState(false)
  const [manageDialogOpen, setManageDialogOpen] = useState(false)

  // Refs
  const anchorRef = useRef<HTMLButtonElement>(null)
  const ref = useRef<HTMLDivElement | null>(null)

  // Hooks
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const { settings } = useSettings()
  const { lang: locale } = useParams()
  const { modulos } = useModules()
  const { data: tiposConteudo } = useTiposConteudo()

  // Generate available shortcuts based on permissions (memoized to prevent infinite loops)
  const availableShortcuts = useMemo(() => {
    return generateAvailableShortcuts(dictionary, modulos, tiposConteudo || [])
  }, [dictionary, modulos, tiposConteudo])

  // Use shortcuts hook
  const {
    shortcuts,
    toggleShortcut,
    isShortcutSelected,
    resetToDefaults,
    isLoaded,
    canAddMore
  } = useShortcuts(availableShortcuts)

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  const handleToggle = useCallback(() => {
    setOpen(prevOpen => !prevOpen)
  }, [])

  const handleManageClick = useCallback(() => {
    setManageDialogOpen(true)
    setOpen(false)
  }, [])

  const handleManageClose = useCallback(() => {
    setManageDialogOpen(false)
  }, [])

  const handleShortcutToggle = (shortcutId: string) => {
    toggleShortcut(shortcutId)
  }

  useEffect(() => {
    const adjustPopoverHeight = () => {
      if (ref.current) {
        // Calculate available height, subtracting any fixed UI elements' height as necessary
        const availableHeight = window.innerHeight - 100

        ref.current.style.height = `${Math.min(availableHeight, 550)}px`
      }
    }

    window.addEventListener('resize', adjustPopoverHeight)

    return () => window.removeEventListener('resize', adjustPopoverHeight)
  }, [])

  if (!isLoaded) {
    return (
      <IconButton className='text-textPrimary'>
        <i className='tabler-layout-grid-add' />
      </IconButton>
    )
  }

  return (
    <>
      <IconButton ref={anchorRef} onClick={handleToggle} className='text-textPrimary'>
        <i className='tabler-layout-grid-add' />
      </IconButton>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        ref={ref}
        anchorEl={anchorRef.current}
        {...(isSmallScreen
          ? {
            className: 'is-full  !mbs-3 z-[1] max-bs-[517px]',
            modifiers: [
              {
                name: 'preventOverflow',
                options: {
                  padding: themeConfig.layoutPadding
                }
              }
            ]
          }
          : { className: 'is-96  !mbs-3 z-[1] max-bs-[517px]' })}
      >
        {({ TransitionProps, placement }) => (
          <Fade {...TransitionProps} style={{ transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top' }}>
            <Paper className={classnames('bs-full', settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg')}>
              <ClickAwayListener onClickAway={handleClose}>
                <div className='bs-full flex flex-col'>
                  <div className='flex items-center justify-between plb-3.5 pli-4 is-full gap-2'>
                    <Typography variant='h6' className='flex-auto'>
                      {(dictionary as any)['navigation']?.shortcuts || 'Shortcuts'}
                    </Typography>
                    <Tooltip
                      title={(dictionary as any)['navigation']?.manageShortcuts || 'Manage Shortcuts'}
                      placement={placement === 'bottom-end' ? 'left' : 'right'}
                      slotProps={{
                        popper: {
                          sx: {
                            '& .MuiTooltip-tooltip': {
                              transformOrigin:
                                placement === 'bottom-end' ? 'right center !important' : 'right center !important'
                            }
                          }
                        }
                      }}
                    >
                      <IconButton size='small' className='text-textPrimary' onClick={handleManageClick}>
                        <i className='tabler-settings' />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <Divider />
                  <ScrollWrapper hidden={hidden}>
                    {shortcuts.length === 0 ? (
                      <div className='flex flex-col items-center justify-center p-6 gap-2'>
                        <i className='tabler-layout-grid-add text-4xl text-textDisabled' />
                        <Typography variant='body2' color='text.disabled'>
                          {(dictionary as any)['navigation']?.noShortcuts || 'No shortcuts added'}
                        </Typography>
                        <Button
                          variant='outlined'
                          size='small'
                          onClick={handleManageClick}
                          startIcon={<i className='tabler-plus' />}
                        >
                          {(dictionary as any)['navigation']?.addShortcuts || 'Add Shortcuts'}
                        </Button>
                      </div>
                    ) : (
                      <Grid container>
                        {shortcuts.map((shortcut, index) => (
                          <Grid
                            size={{ xs: 6 }}
                            key={shortcut.id}
                            onClick={handleClose}
                            className='[&:not(:last-of-type):not(:nth-last-of-type(2))]:border-be odd:border-ie'
                          >
                            <Link
                              href={getLocalizedUrl(shortcut.url, locale as Locale)}
                              className='flex items-center flex-col p-6 gap-3 bs-full hover:bg-actionHover'
                            >
                              <CustomAvatar size={50} className='bg-actionSelected text-textPrimary'>
                                <i className={classnames('text-[1.625rem]', shortcut.icon)} />
                              </CustomAvatar>
                              <div className='flex flex-col items-center text-center'>
                                <Typography className='font-medium' color='text.primary'>
                                  {shortcut.title}
                                </Typography>
                                <Typography variant='body2'>{shortcut.subtitle}</Typography>
                              </div>
                            </Link>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </ScrollWrapper>
                </div>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>

      {/* Manage Shortcuts Dialog */}
      <Dialog
        open={manageDialogOpen}
        onClose={handleManageClose}
        maxWidth='sm'
        fullWidth
        scroll='paper'
      >
        <DialogTitle>
          <div className='flex items-center justify-between'>
            <Typography variant='h5'>
              {(dictionary as any)['navigation']?.manageShortcuts || 'Manage Shortcuts'}
            </Typography>
            <IconButton size='small' onClick={handleManageClose}>
              <i className='tabler-x' />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant='body2' color='text.secondary' className='mbe-4'>
            {(dictionary as any)['navigation']?.shortcutsDescription || 'Select up to 8 shortcuts to display in the quick access menu.'}
          </Typography>
          <List>
            {availableShortcuts.map((shortcut) => {
              const isSelected = isShortcutSelected(shortcut.id)
              const isDisabled = !isSelected && !canAddMore

              return (
                <ListItem key={shortcut.id} disablePadding>
                  <ListItemButton
                    onClick={() => !isDisabled && handleShortcutToggle(shortcut.id)}
                    disabled={isDisabled}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge='start'
                        checked={isSelected}
                        tabIndex={-1}
                        disableRipple
                        disabled={isDisabled}
                      />
                    </ListItemIcon>
                    <ListItemIcon>
                      <CustomAvatar size={40} className='bg-actionSelected text-textPrimary'>
                        <i className={classnames('text-xl', shortcut.icon)} />
                      </CustomAvatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={shortcut.title}
                      secondary={shortcut.subtitle}
                      primaryTypographyProps={{ className: 'font-medium' }}
                    />
                  </ListItemButton>
                </ListItem>
              )
            })}
          </List>
        </DialogContent>
        <DialogActions className='gap-2'>
          <Button
            variant='outlined'
            color='secondary'
            onClick={resetToDefaults}
          >
            {(dictionary as any)['navigation']?.resetDefaults || 'Reset to Defaults'}
          </Button>
          <Button
            variant='contained'
            onClick={handleManageClose}
          >
            {(dictionary as any)['navigation']?.done || 'Done'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ShortcutsDropdown
