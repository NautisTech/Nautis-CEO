'use client'

import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import MuiTimeline from '@mui/lab/Timeline'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import type { TimelineProps } from '@mui/lab/Timeline'
import { ticketsAPI } from '@/libs/api/suporte/api'
import type { ThemeColor } from '@core/types'

const Timeline = styled(MuiTimeline)<TimelineProps>({
    paddingLeft: 0,
    paddingRight: 0,
    '& .MuiTimelineItem-root': {
        width: '100%',
        '&:before': {
            display: 'none'
        }
    }
})

const TicketActivity = () => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ticketsAPI.getDashboardStatistics()
                setData(response.atividadeRecente || [])
            } catch (error) {
                console.error('Erro:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const getActivityColor = (campo: string): ThemeColor => {
        const colorMap: Record<string, ThemeColor> = {
            status_alterado: 'success',
            prioridade_alterada: 'warning',
            atribuicao: 'info',
            criacao: 'primary',
            fechamento: 'secondary',
            comentario: 'success',
            anexo: 'info'
        }
        return colorMap[campo] || 'primary'
    }

    const getTimeDiff = (date: string) => {
        const now = new Date()
        const updated = new Date(date)
        const diffInMs = now.getTime() - updated.getTime()
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

        if (diffInMinutes < 1) return 'Agora mesmo'
        if (diffInMinutes < 60) return `há ${diffInMinutes} min${diffInMinutes !== 1 ? 's' : ''}`
        if (diffInHours < 24) return `há ${diffInHours} hora${diffInHours !== 1 ? 's' : ''}`
        if (diffInDays === 1) return 'Ontem'
        if (diffInDays < 7) return `há ${diffInDays} dias`
        return new Date(date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })
    }

    const getActivityText = (item: any) => {
        if (item.campo_alterado === 'status_alterado') {
            return `Status: ${item.valor_anterior} → ${item.valor_novo}`
        }
        if (item.campo_alterado === 'prioridade_alterada') {
            return `Prioridade: ${item.valor_anterior} → ${item.valor_novo}`
        }
        if (item.campo_alterado === 'atribuicao') {
            return 'Ticket atribuído'
        }
        return item.observacao || item.campo_alterado || 'Atualização'
    }

    if (loading) return <Card className='flex items-center justify-center p-10'><CircularProgress /></Card>

    return (
        <Card className='bs-full'>
            <CardHeader
                avatar={<i className='tabler-list-details text-xl' />}
                title='Atividade Recente'
                titleTypographyProps={{ variant: 'h5' }}
                sx={{ '& .MuiCardHeader-avatar': { mr: 3 } }}
            />
            <CardContent className='flex flex-col gap-6 pbe-5'>
                <Timeline>
                    {data.slice(0, 10).map((item: any, idx: number) => (
                        <TimelineItem key={idx}>
                            <TimelineSeparator>
                                <TimelineDot color={getActivityColor(item.campo_alterado)} />
                                {idx < Math.min(data.length, 10) - 1 && <TimelineConnector />}
                            </TimelineSeparator>
                            <TimelineContent>
                                <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                                    <Typography className='font-medium' color='text.primary'>
                                        {item.numero_ticket} - {item.ticket_titulo}
                                    </Typography>
                                    <Typography variant='caption' color='text.secondary'>
                                        {getTimeDiff(item.criado_em)}
                                    </Typography>
                                </div>
                                <Typography variant='body2' color='text.secondary' className='mbe-2'>
                                    {item.usuario_nome || 'Sistema'}
                                </Typography>
                                <Typography variant='body2'>
                                    {getActivityText(item)}
                                </Typography>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </Timeline>
            </CardContent>
        </Card>
    )
}

export default TicketActivity
