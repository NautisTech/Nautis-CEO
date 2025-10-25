'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import CircularProgress from '@mui/material/CircularProgress'

// Type Imports
import type { ThemeColor } from '@core/types'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// API Imports
import { conteudosAPI } from '@/libs/api/conteudos/api'

type StatType = {
  icon: string
  stats: string | number
  title: string
  color: ThemeColor
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
            stats: data.estatisticasGerais.total_conteudos || 0,
            title: 'Total Conteúdos',
            color: 'primary',
            icon: 'tabler-file-text'
          },
          {
            color: 'success',
            stats: data.estatisticasGerais.conteudos_publicados || 0,
            title: 'Publicados',
            icon: 'tabler-circle-check'
          },
          {
            color: 'info',
            stats: data.estatisticasGerais.total_visualizacoes || 0,
            title: 'Visualizações',
            icon: 'tabler-eye'
          },
          {
            stats: data.estatisticasGerais.conteudos_destaque || 0,
            color: 'warning',
            title: 'Em Destaque',
            icon: 'tabler-star'
          },
          {
            stats: data.estatisticasGerais.total_comentarios || 0,
            color: 'secondary',
            title: 'Comentários',
            icon: 'tabler-message'
          },
          {
            stats: data.estatisticasGerais.total_favoritos || 0,
            color: 'error',
            title: 'Favoritos',
            icon: 'tabler-heart'
          },
          {
            stats: data.estatisticasGerais.conteudos_rascunho || 0,
            color: 'secondary',
            title: 'Rascunhos',
            icon: 'tabler-file-pencil'
          },
          {
            stats: data.estatisticasGerais.novos_ultimos_7_dias || 0,
            color: 'success',
            title: 'Novos (7 dias)',
            icon: 'tabler-trending-up'
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
    <Card>
      <CardHeader
        title='Estatísticas de Conteúdos'
        action={
          <Typography variant='subtitle2' color='text.disabled'>
            Atualizado agora
          </Typography>
        }
      />
      <CardContent>
        <Grid container spacing={4}>
          {stats.map((item, index) => (
            <Grid key={index} size={{ xs: 6, sm: 4, md: 3 }} className='flex items-center gap-4'>
              <CustomAvatar color={item.color} variant='rounded' size={40} skin='light'>
                <i className={item.icon}></i>
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

export default ConteudosStatisticsCard
