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
import { groupsAPI } from '@/libs/api/groups/api'

const RoleCardsNew = () => {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await groupsAPI.getStatistics()
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
      title: 'Total Grupos',
      stats: stats?.total_grupos?.toString() || '0',
      avatarIcon: 'tabler-users-group',
      avatarColor: 'primary',
      subtitle: 'Total de grupos'
    },
    {
      title: 'Grupos Ativos',
      stats: stats?.grupos_ativos?.toString() || '0',
      avatarIcon: 'tabler-user-check',
      avatarColor: 'success',
      subtitle: 'Grupos ativos no sistema'
    },
    {
      title: 'Utilizadores com Grupos',
      stats: stats?.utilizadores_com_grupos?.toString() || '0',
      avatarIcon: 'tabler-user-shield',
      avatarColor: 'info',
      subtitle: 'Utilizadores atribuídos'
    },
    {
      title: 'Média por Grupo',
      stats: stats?.media_utilizadores_por_grupo ? Math.round(stats.media_utilizadores_por_grupo).toString() : '0',
      avatarIcon: 'tabler-chart-pie',
      avatarColor: 'warning',
      subtitle: 'Utilizadores por grupo'
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

export default RoleCardsNew
