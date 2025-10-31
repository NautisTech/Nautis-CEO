'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { SystemMode } from '@core/types'
import type { Locale } from '@configs/i18n'
import type { StatusTicket, PrioridadeTicket } from '@/libs/api/suporte/types'
import type { PortalTicket } from '@/libs/api/portal/types'

// Component Imports
import DirectionalIcon from '@components/DirectionalIcon'
import Logo from '@components/layout/shared/Logo'
import SLABadge from '@/components/SLABadge'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { toastService } from '@/libs/notifications/toasterService'
import { getDictionary } from '@/utils/getDictionary'

// API Imports
import { portalAPI } from '@/libs/api/portal'

// Styled Custom Components
const MaskImg = styled('img')({
    blockSize: 'auto',
    maxBlockSize: 355,
    inlineSize: '100%',
    position: 'absolute',
    insetBlockEnd: 0,
    zIndex: -1
})

const statusColorMap: Record<StatusTicket, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
    aberto: 'info',
    em_andamento: 'primary',
    aguardando: 'warning',
    resolvido: 'success',
    fechado: 'default',
    cancelado: 'error'
}

const statusLabelMap: Record<StatusTicket, string> = {
    aberto: 'Aberto',
    em_andamento: 'Em Andamento',
    aguardando: 'Aguardando',
    resolvido: 'Resolvido',
    fechado: 'Fechado',
    cancelado: 'Cancelado'
}

const prioridadeColorMap: Record<PrioridadeTicket, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
    baixa: 'success',
    media: 'warning',
    alta: 'error',
    urgente: 'error'
}

const prioridadeLabelMap: Record<PrioridadeTicket, string> = {
    baixa: 'Baixa',
    media: 'Média',
    alta: 'Alta',
    urgente: 'Urgente'
}

const TicketDetailsView = ({ mode, code, dictionary }: {
    mode: SystemMode;
    code: string;
    dictionary: Awaited<ReturnType<typeof getDictionary>>;
}) => {
    // States
    const [ticket, setTicket] = useState<PortalTicket | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [tenantName, setTenantName] = useState<string>('')

    // Vars
    const darkImg = '/images/pages/auth-mask-dark.png'
    const lightImg = '/images/pages/auth-mask-light.png'

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

    useEffect(() => {
        const fetchTicket = async () => {
            if (!tenantName) return

            setIsLoading(true)
            setError(null)

            try {
                // Call the portal endpoint with tenant and code
                const ticketData = await portalAPI.obterPorCodigo(code, tenantName)
                setTicket(ticketData)
            } catch (err: any) {
                const errorMessage = err?.message || 'Ticket não encontrado'
                setError(errorMessage)
                toastService.error(errorMessage)
            } finally {
                setIsLoading(false)
            }
        }

        fetchTicket()
    }, [code, tenantName])

    return (
        <div className='flex bs-full justify-center min-bs-[100dvh]'>
            <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:p-12'>
                <Link
                    href={getLocalizedUrl(`/ticket?tenant=${tenantName}`, locale as Locale)}
                    className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'
                >
                    <Logo />
                </Link>
                <div className='flex flex-col gap-6 is-full max-is-[900px] mbs-11 sm:mbs-14 md:mbs-0'>
                    {isLoading ? (
                        <div className='flex justify-center items-center min-bs-[400px]'>
                            <CircularProgress />
                        </div>
                    ) : error ? (
                        <Card>
                            <CardContent className='flex flex-col gap-4 items-center pbs-12 pbe-12'>
                                <Alert severity='error' className='is-full'>
                                    {error}
                                </Alert>
                                <Button
                                    variant='contained'
                                    startIcon={<DirectionalIcon ltrIconClass='tabler-chevron-left' rtlIconClass='tabler-chevron-right' />}
                                    onClick={() => router.push(getLocalizedUrl(`/ticket?tenant=${tenantName}`, locale as Locale))}
                                >
                                    Voltar à Consulta
                                </Button>
                            </CardContent>
                        </Card>
                    ) : ticket ? (
                        <>
                            <div className='flex flex-col gap-1'>
                                <div className='flex items-center justify-between gap-4 flex-wrap'>
                                    <Typography variant='h4'>Detalhes do Ticket</Typography>
                                    <div className='flex gap-2'>
                                        {ticket.codigo_unico && (
                                            <Chip
                                                label={ticket.codigo_unico}
                                                color='secondary'
                                                size='small'
                                                variant='tonal'
                                            />
                                        )}
                                        <Chip
                                            label={`#${ticket.numero_ticket}`}
                                            color='primary'
                                            size='small'
                                        />
                                    </div>
                                </div>
                            </div>

                            <Card>
                                <CardContent>
                                    <div className='flex flex-col gap-4 pbs-2'>
                                        {/* Título */}
                                        <div>
                                            <Typography variant='body2' color='text.secondary' className='mbe-1'>
                                                Título
                                            </Typography>
                                            <Typography variant='body1' className='font-medium'>
                                                {ticket.titulo}
                                            </Typography>
                                        </div>

                                        {/* Descrição */}
                                        <div>
                                            <Typography variant='body2' color='text.secondary' className='mbe-1'>
                                                Descrição
                                            </Typography>
                                            <Typography variant='body1' className='whitespace-pre-wrap'>
                                                {ticket.descricao}
                                            </Typography>
                                        </div>

                                        <Divider />

                                        {/* Informações do Ticket */}
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                            <div>
                                                <Typography variant='body2' color='text.secondary' className='mbe-1'>
                                                    Tipo de Ticket
                                                </Typography>
                                                <Typography variant='body1'>{ticket.tipo_ticket_nome || 'N/A'}</Typography>
                                            </div>

                                            <div>
                                                <Typography variant='body2' color='text.secondary' className='mbe-1'>
                                                    Prioridade
                                                </Typography>
                                                <Chip
                                                    label={prioridadeLabelMap[ticket.prioridade]}
                                                    color={prioridadeColorMap[ticket.prioridade]}
                                                    size='small'
                                                    variant='tonal'
                                                />
                                            </div>

                                            <div>
                                                <Typography variant='body2' color='text.secondary' className='mbe-1'>
                                                    Status
                                                </Typography>
                                                <Chip
                                                    label={statusLabelMap[ticket.status]}
                                                    size='small'
                                                    variant='tonal'
                                                    color={statusColorMap[ticket.status]}
                                                />
                                            </div>

                                            <div>
                                                <Typography variant='body2' color='text.secondary' className='mbe-1'>
                                                    Solicitante
                                                </Typography>
                                                <Typography variant='body1'>
                                                    {ticket.solicitante_nome || 'N/A'}
                                                </Typography>
                                            </div>

                                            <div>
                                                <Typography variant='body2' color='text.secondary' className='mbe-1'>
                                                    Atribuído a
                                                </Typography>
                                                <Typography variant='body1'>
                                                    {ticket.atribuido_nome || 'Não atribuído'}
                                                </Typography>
                                            </div>
                                        </div>

                                        {/* Equipamento e Localização */}
                                        {(ticket.equipamento_id || ticket.equipamento_sn || ticket.localizacao) && (
                                            <>
                                                <Divider />
                                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                                    {(ticket.equipamento_id || ticket.equipamento_sn) && (
                                                        <div className={ticket.localizacao ? '' : 'md:col-span-2'}>
                                                            <Typography variant='body2' color='text.secondary' className='mbe-1'>
                                                                Equipamento
                                                            </Typography>
                                                            {ticket.equipamento_id ? (
                                                                <Typography variant='body1'>
                                                                    {ticket.equipamento_numero} - {ticket.equipamento_nome}
                                                                </Typography>
                                                            ) : (
                                                                <>
                                                                    <Typography variant='body1'>SN: {ticket.equipamento_sn}</Typography>
                                                                    {ticket.equipamento_descritivo && (
                                                                        <Typography variant='body2' color='text.secondary'>
                                                                            {ticket.equipamento_descritivo}
                                                                        </Typography>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    )}

                                                    {ticket.localizacao && (
                                                        <div className={ticket.equipamento_id || ticket.equipamento_sn ? '' : 'md:col-span-2'}>
                                                            <Typography variant='body2' color='text.secondary' className='mbe-1'>
                                                                Localização
                                                            </Typography>
                                                            <Typography variant='body1'>{ticket.localizacao}</Typography>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        {/* Datas e SLA */}
                                        <Divider />
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                            <div>
                                                <Typography variant='body2' color='text.secondary' className='mbe-1'>
                                                    Data de Abertura
                                                </Typography>
                                                <Typography variant='body1'>
                                                    {new Date(ticket.data_abertura).toLocaleString('pt-PT')}
                                                </Typography>
                                            </div>

                                            {ticket.data_prevista && (
                                                <div>
                                                    <Typography variant='body2' color='text.secondary' className='mbe-1'>
                                                        Data Prevista
                                                    </Typography>
                                                    <Typography variant='body1'>
                                                        {new Date(ticket.data_prevista).toLocaleString('pt-PT')}
                                                    </Typography>
                                                </div>
                                            )}

                                            {ticket.data_conclusao && (
                                                <div>
                                                    <Typography variant='body2' color='text.secondary' className='mbe-1'>
                                                        Data de Conclusão
                                                    </Typography>
                                                    <Typography variant='body1'>
                                                        {new Date(ticket.data_conclusao).toLocaleString('pt-PT')}
                                                    </Typography>
                                                </div>
                                            )}

                                            {ticket.sla_status && (
                                                <div className='md:col-span-2'>
                                                    <Typography variant='body2' color='text.secondary' className='mbe-1'>
                                                        SLA
                                                    </Typography>
                                                    <SLABadge
                                                        slaStatus={ticket.sla_status}
                                                        tempoRestanteMinutos={ticket.sla_tempo_restante_minutos}
                                                        slaHoras={ticket.sla_horas}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Avaliação */}
                                        {ticket.avaliacao && (
                                            <>
                                                <Divider />
                                                <div>
                                                    <Typography variant='body2' color='text.secondary' className='mbe-1'>
                                                        Avaliação
                                                    </Typography>
                                                    <Typography variant='body1' className='font-medium'>
                                                        {ticket.avaliacao} / 5
                                                    </Typography>
                                                    {ticket.comentario_avaliacao && (
                                                        <Typography variant='body2' color='text.secondary' className='mbs-2'>
                                                            {ticket.comentario_avaliacao}
                                                        </Typography>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className='flex justify-center'>
                                <Button
                                    variant='outlined'
                                    startIcon={<DirectionalIcon ltrIconClass='tabler-chevron-left' rtlIconClass='tabler-chevron-right' />}
                                    onClick={() => router.push(getLocalizedUrl(`/ticket?tenant=${tenantName}`, locale as Locale))}
                                >
                                    Voltar à Consulta
                                </Button>
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
            {!hidden && <MaskImg alt='mask' src={authBackground} />}
        </div>
    )
}

export default TicketDetailsView
