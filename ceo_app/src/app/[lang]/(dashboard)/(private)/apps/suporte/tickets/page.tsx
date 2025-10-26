'use client'

import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid2'
import TicketsTable from '@/views/apps/suporte/TicketsTable'
import TicketsSupportTracker from '@/views/apps/suporte/widgets/TicketsSupportTracker'
import TicketsPriorityDistribution from '@/views/apps/suporte/widgets/TicketsPriorityDistribution'
import { ticketsAPI } from '@/libs/api/suporte'

const TicketsPage = () => {
  const [stats, setStats] = useState({
    total: 0,
    novos: 0,
    abertos: 0,
    slaCumprido: 0,
    prioridade_baixa: 0,
    prioridade_media: 0,
    prioridade_alta: 0,
    prioridade_urgente: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await ticketsAPI.getEstatisticas()
        setStats(data)
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return null
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TicketsSupportTracker
          stats={{
            total: stats.total,
            novos: stats.novos,
            abertos: stats.abertos,
            slaCumprido: stats.slaCumprido
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TicketsPriorityDistribution
          stats={{
            baixa: stats.prioridade_baixa,
            media: stats.prioridade_media,
            alta: stats.prioridade_alta,
            urgente: stats.prioridade_urgente
          }}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TicketsTable />
      </Grid>
    </Grid>
  )
}

export default TicketsPage
