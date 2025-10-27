'use client'

import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2'
import CircularProgress from '@mui/material/CircularProgress'
import Card from '@mui/material/Card'
import CardStatsHorizontalWithAvatar from '@components/card-statistics/HorizontalWithAvatar'
import { usersAPI } from '@/libs/api/users/api'
import type { ThemeColor } from '@core/types'

const AdminStatisticsCard = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await usersAPI.getDashboardStatistics()
        setStats(data)
      } catch (error) {
        console.error('Erro:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <Card className='flex items-center justify-center p-10'><CircularProgress /></Card>

  const cards: Array<{ icon: string; stats: string; title: string; color: ThemeColor; trendNumber?: string; trend?: 'positive' | 'negative' }> = [
    {
      stats: String(stats?.estatisticasUtilizadores?.total_utilizadores || 0),
      title: 'Total Utilizadores',
      color: 'primary',
      icon: 'tabler-users'
    },
    {
      stats: String(stats?.estatisticasUtilizadores?.utilizadores_ativos || 0),
      title: 'Utilizadores Ativos',
      color: 'success',
      icon: 'tabler-user-check'
    },
    {
      stats: String(stats?.estatisticasGrupos?.total_grupos || 0),
      title: 'Grupos',
      color: 'info',
      icon: 'tabler-users-group'
    },
    {
      stats: String(stats?.estatisticasPermissoes?.total_permissoes || 0),
      title: 'Permissões',
      color: 'warning',
      icon: 'tabler-lock'
    },
    {
      stats: String(stats?.estatisticasUtilizadores?.novos_ultimos_7_dias || 0),
      title: 'Novos (7 dias)',
      color: 'success',
      icon: 'tabler-trending-up',
      trend: 'positive'
    },
    {
      stats: String(stats?.estatisticasUtilizadores?.ativos_ultimos_7_dias || 0),
      title: 'Logins (7 dias)',
      color: 'secondary',
      icon: 'tabler-login'
    },
  ]

  return (
    <Grid container spacing={6}>
      {cards.map((item, idx) => (
        <Grid key={idx} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <CardStatsHorizontalWithAvatar {...item} avatarSkin='light' />
        </Grid>
      ))}
    </Grid>
  )
}

export default AdminStatisticsCard
