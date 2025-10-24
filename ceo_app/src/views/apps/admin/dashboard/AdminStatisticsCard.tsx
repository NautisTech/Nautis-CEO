'use client'

import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import CircularProgress from '@mui/material/CircularProgress'
import CustomAvatar from '@core/components/mui/Avatar'
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

  const cards: Array<{ icon: string; stats: number; title: string; color: ThemeColor }> = [
    { stats: stats?.estatisticasUtilizadores?.total_utilizadores || 0, title: 'Utilizadores', color: 'primary', icon: 'tabler-users' },
    { stats: stats?.estatisticasUtilizadores?.utilizadores_ativos || 0, title: 'Ativos', color: 'success', icon: 'tabler-user-check' },
    { stats: stats?.estatisticasGrupos?.total_grupos || 0, title: 'Grupos', color: 'info', icon: 'tabler-users-group' },
    { stats: stats?.estatisticasPermissoes?.total_permissoes || 0, title: 'Permissões', color: 'warning', icon: 'tabler-lock' },
    { stats: stats?.estatisticasUtilizadores?.novos_ultimos_7_dias || 0, title: 'Novos (7 dias)', color: 'success', icon: 'tabler-trending-up' },
    { stats: stats?.estatisticasUtilizadores?.ativos_ultimos_7_dias || 0, title: 'Login (7 dias)', color: 'secondary', icon: 'tabler-login' },
  ]

  return (
    <Card>
      <CardHeader title='Estatísticas de Administração' />
      <CardContent>
        <Grid container spacing={4}>
          {cards.map((item, idx) => (
            <Grid key={idx} size={{ xs: 6, sm: 4, md: 2 }} className='flex items-center gap-4'>
              <CustomAvatar color={item.color} variant='rounded' size={40} skin='light'>
                <i className={item.icon} />
              </CustomAvatar>
              <div className='flex flex-col'>
                <Typography variant='h5'>{item.stats}</Typography>
                <Typography variant='body2'>{item.title}</Typography>
              </div>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AdminStatisticsCard
