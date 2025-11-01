'use client'

import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import { equipamentosAPI } from '@/libs/api/equipamentos/api'

const EquipamentosComMaisTickets = () => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await equipamentosAPI.getDashboardStatistics()
                setData(response.equipamentosComMaisTickets || [])
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
            <CardHeader
                title='Equipamentos com Mais Tickets'
                subheader='Equipamentos que requerem mais atenção'
            />
            <CardContent className='flex flex-col gap-y-6'>
                {data.map((equipamento, idx) => (
                    <div key={idx} className='flex flex-col gap-2'>
                        <div className='flex items-center justify-between gap-3'>
                            <Typography variant='h6'>
                                {equipamento.numero_interno || equipamento.numero_serie}
                            </Typography>
                            <Chip
                                variant='tonal'
                                label={`${equipamento.tickets_abertos}/${equipamento.total_tickets} abertos`}
                                size='small'
                                color='success'
                            />
                        </div>
                        <div>
                            <div className='flex items-center justify-between gap-3'>
                                <Typography>
                                    {equipamento.marca_nome} {equipamento.modelo_nome}
                                </Typography>
                                <Typography variant='body2' color='text.disabled'>
                                    {equipamento.total_tickets > 0
                                        ? Math.round((equipamento.tickets_abertos / equipamento.total_tickets) * 100)
                                        : 0}%
                                </Typography>
                            </div>
                            <LinearProgress
                                variant='determinate'
                                value={equipamento.total_tickets > 0
                                    ? (equipamento.tickets_abertos / equipamento.total_tickets) * 100
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

export default EquipamentosComMaisTickets
