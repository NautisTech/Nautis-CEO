'use client'

import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import { ticketsAPI } from '@/libs/api/suporte/api'

const TopClientes = () => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ticketsAPI.getDashboardStatistics()
                setData(response.clientesComMaisTickets || [])
            } catch (error) {
                console.error('Erro:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return <Card className='flex items-center justify-center p-10'><CircularProgress /></Card>

    return (
        <Card className='bs-full'>
            <CardHeader title='Clientes com Mais Tickets' subheader='Top clientes por volume de tickets' />
            <CardContent className='flex flex-col gap-y-6'>
                {data.map((cliente, idx) => (
                    <div key={idx} className='flex flex-col gap-2'>
                        <div className='flex items-center justify-between gap-3'>
                            <Typography variant='h6'>{cliente.nome}</Typography>
                            <Chip
                                variant='tonal'
                                label={`${cliente.tickets_abertos} abertos`}
                                size='small'
                                color='success'
                            />
                        </div>
                        <div>
                            <div className='flex items-center justify-between gap-3'>
                                <Typography>{cliente.total_tickets} tickets</Typography>
                                <Typography variant='body2' color='text.disabled'>
                                    {cliente.total_tickets > 0
                                        ? Math.round((cliente.tickets_abertos / cliente.total_tickets) * 100)
                                        : 0}%
                                </Typography>
                            </div>
                            <LinearProgress
                                variant='determinate'
                                value={cliente.total_tickets > 0
                                    ? (cliente.tickets_abertos / cliente.total_tickets) * 100
                                    : 0}
                                className='bs-2 mbs-1'
                                color='primary'
                            />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

export default TopClientes
