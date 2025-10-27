'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import CircularProgress from '@mui/material/CircularProgress'
import Card from '@mui/material/Card'

// Type Imports
import type { ThemeColor } from '@core/types'

// Component Imports
import CardStatsHorizontalWithAvatar from '@components/card-statistics/HorizontalWithAvatar'

// API Imports
import { conteudosAPI } from '@/libs/api/conteudos/api'

type StatType = {
  icon: string
  stats: string
  title: string
  color: ThemeColor
  trendNumber?: string
  trend?: 'positive' | 'negative'
}

const ConteudosStatisticsCard = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<StatType[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await conteudosAPI.getDashboardStatistics()

        const statsData: StatType[] = [
          {
            stats: String(data.estatisticasGerais.total_conteudos || 0),
            title: 'Total Conteúdos',
            color: 'primary',
            icon: 'tabler-file-text'
          },
          {
            color: 'success',
            stats: String(data.estatisticasGerais.conteudos_publicados || 0),
            title: 'Publicados',
            icon: 'tabler-circle-check'
          },
          {
            color: 'info',
            stats: String(data.estatisticasGerais.total_visualizacoes || 0),
            title: 'Visualizações',
            icon: 'tabler-eye'
          },
          {
            stats: String(data.estatisticasGerais.conteudos_destaque || 0),
            color: 'warning',
            title: 'Em Destaque',
            icon: 'tabler-star'
          },
          {
            stats: String(data.estatisticasGerais.total_comentarios || 0),
            color: 'secondary',
            title: 'Comentários',
            icon: 'tabler-message'
          },
          {
            stats: String(data.estatisticasGerais.total_favoritos || 0),
            color: 'error',
            title: 'Favoritos',
            icon: 'tabler-heart'
          },
          {
            stats: String(data.estatisticasGerais.conteudos_rascunho || 0),
            color: 'secondary',
            title: 'Rascunhos',
            icon: 'tabler-file-pencil'
          },
          {
            stats: String(data.estatisticasGerais.novos_ultimos_7_dias || 0),
            color: 'success',
            title: 'Novos (7 dias)',
            icon: 'tabler-trending-up',
            trend: 'positive'
          }
        ]

        setStats(statsData)
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
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

  return (
    <Grid container spacing={6}>
      {stats.map((item, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <CardStatsHorizontalWithAvatar {...item} avatarSkin='light' />
        </Grid>
      ))}
    </Grid>
  )
}

export default ConteudosStatisticsCard
