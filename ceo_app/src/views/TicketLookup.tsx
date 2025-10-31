'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { SystemMode } from '@core/types'
import type { Locale } from '@configs/i18n'

// Component Imports
import DirectionalIcon from '@components/DirectionalIcon'
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { toastService } from '@/libs/notifications/toasterService'
import { getDictionary } from '@/utils/getDictionary'

// Styled Custom Components
const TicketLookupIllustration = styled('img')(({ theme }) => ({
    zIndex: 2,
    blockSize: 'auto',
    maxBlockSize: 650,
    maxInlineSize: '100%',
    margin: theme.spacing(12),
    [theme.breakpoints.down(1536)]: {
        maxBlockSize: 550
    },
    [theme.breakpoints.down('lg')]: {
        maxBlockSize: 450
    }
}))

const MaskImg = styled('img')({
    blockSize: 'auto',
    maxBlockSize: 355,
    inlineSize: '100%',
    position: 'absolute',
    insetBlockEnd: 0,
    zIndex: -1
})

const TicketLookup = ({ mode, dictionary }: { mode: SystemMode; dictionary: Awaited<ReturnType<typeof getDictionary>> }) => {
    // States
    const [ticketCode, setTicketCode] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [tenantName, setTenantName] = useState<string>('')

    // Vars
    const darkImg = '/images/pages/auth-mask-dark.png'
    const lightImg = '/images/pages/auth-mask-light.png'
    const darkIllustration = '/images/illustrations/auth/v2-forgot-password-dark.png'
    const lightIllustration = '/images/illustrations/auth/v2-forgot-password-light.png'

    // Hooks
    const router = useRouter()
    const searchParams = useSearchParams()
    const { lang: locale } = useParams()
    const { settings } = useSettings()
    const theme = useTheme()
    const hidden = useMediaQuery(theme.breakpoints.down('md'))
    const authBackground = useImageVariant(mode, lightImg, darkImg)

    // Get tenant from URL or env
    useEffect(() => {
        const tenantFromUrl = searchParams.get('tenant')
        const tenantSlug = tenantFromUrl || process.env.NEXT_PUBLIC_TENANT_SLUG || 'nautis'
        setTenantName(tenantSlug)
    }, [searchParams])

    const characterIllustration = useImageVariant(mode, lightIllustration, darkIllustration)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!ticketCode.trim()) {
            toastService.error('Por favor, insira um código de ticket')
            return
        }

        setIsLoading(true)

        try {
            // Navigate to the ticket details page with tenant
            router.push(getLocalizedUrl(`/ticket/${ticketCode.trim()}?tenant=${tenantName}`, locale as Locale))
        } catch (error) {
            toastService.error('Erro ao consultar ticket')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='flex bs-full justify-center'>
            <div
                className={classnames(
                    'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
                    {
                        'border-ie': settings.skin === 'bordered'
                    }
                )}
            >
                <TicketLookupIllustration
                    src={characterIllustration}
                    alt='character-illustration'
                    className={classnames({ 'scale-x-[-1]': theme.direction === 'rtl' })}
                />
                {!hidden && (
                    <MaskImg
                        alt='mask'
                        src={authBackground}
                        className={classnames({ 'scale-x-[-1]': theme.direction === 'rtl' })}
                    />
                )}
            </div>
            <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
                <Link
                    href={getLocalizedUrl('/login', locale as Locale)}
                    className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'
                >
                    <Logo />
                </Link>
                <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
                    <div className='flex flex-col gap-1'>
                        <Typography variant='h4'>Consulta de Ticket 🔍</Typography>
                        <Typography>Insira o código do ticket para consultar o seu estado</Typography>
                    </div>
                    <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-6'>
                        <CustomTextField
                            autoFocus
                            fullWidth
                            label='Código do Ticket'
                            placeholder='Insira o código do ticket'
                            value={ticketCode}
                            onChange={(e) => setTicketCode(e.target.value)}
                            disabled={isLoading}
                        />
                        <Button
                            fullWidth
                            variant='contained'
                            type='submit'
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <CircularProgress size={20} color='inherit' className='mr-2' />
                                    A consultar...
                                </>
                            ) : (
                                'Consultar Ticket'
                            )}
                        </Button>
                        <Typography className='flex justify-center items-center' color='primary.main'>
                            <Link
                                href={getLocalizedUrl('/login', locale as Locale)}
                                className='flex items-center gap-1.5'
                            >
                                <DirectionalIcon
                                    ltrIconClass='tabler-chevron-left'
                                    rtlIconClass='tabler-chevron-right'
                                    className='text-xl'
                                />
                                <span>Voltar ao login</span>
                            </Link>
                        </Typography>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default TicketLookup
