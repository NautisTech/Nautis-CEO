'use client'

import { useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Card from '@mui/material/Card'
import TicketsSupportTracker from '@/views/apps/suporte/widgets/TicketsSupportTracker'
import { ticketsAPI } from '@/libs/api/suporte'

const TicketsSupportTrackerWrapper = () => {
    const [stats, setStats] = useState({
        total: 0,
        novos: 0,
        abertos: 0,
        slaCumprido: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await ticketsAPI.getEstatisticas()
                setStats({
                    total: data.total || 0,
                    novos: data.novos || 0,
                    abertos: data.abertos || 0,
                    slaCumprido: data.slaCumprido || 0
                })
            } catch (error) {
                console.error('Erro ao carregar estatísticas de tickets:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    if (loading) {
        return (
            <Card className='flex items-center justify-center p-10'>
                <CircularProgress />
            </Card>
        )
    }

    return <TicketsSupportTracker stats={stats} />
}

export default TicketsSupportTrackerWrapper
