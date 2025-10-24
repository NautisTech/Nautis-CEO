'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Skeleton from '@mui/material/Skeleton'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// Type Imports
import type { UserDataType } from '@components/card-statistics/HorizontalWithSubtitle'

// Component Imports
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'

// API Imports
import { usersAPI } from '@/libs/api/users/api'

const UserListCards = () => {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await usersAPI.getStatistics()
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
    return (
      <Grid container spacing={6}>
        {[1, 2, 3, 4].map((i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Skeleton variant='rectangular' height={100} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    )
  }

  const data: UserDataType[] = [
    {
      title: 'Total Utilizadores',
      stats: stats?.total_utilizadores?.toString() || '0',
      avatarIcon: 'tabler-users',
      avatarColor: 'primary',
      subtitle: 'Total de utilizadores'
    },
    {
      title: 'Utilizadores Ativos',
      stats: stats?.utilizadores_ativos?.toString() || '0',
      avatarIcon: 'tabler-user-check',
      avatarColor: 'success',
      subtitle: 'Contas ativas'
    },
    {
      title: 'Novos (30 dias)',
      stats: stats?.novos_ultimos_30_dias?.toString() || '0',
      avatarIcon: 'tabler-user-plus',
      avatarColor: 'info',
      subtitle: 'Últimos 30 dias'
    },
    {
      title: 'Ativos (7 dias)',
      stats: stats?.ativos_ultimos_7_dias?.toString() || '0',
      avatarIcon: 'tabler-user-search',
      avatarColor: 'warning',
      subtitle: 'Login nos últimos 7 dias'
    }
  ]

  return (
    <Grid container spacing={6}>
      {data.map((item, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
          <HorizontalWithSubtitle {...item} />
        </Grid>
      ))}
    </Grid>
  )
}

export default UserListCards
