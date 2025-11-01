'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Skeleton from '@mui/material/Skeleton'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// API Imports
import { usersAPI } from '@/libs/api/users/api'

type DataType = {
  title: string
  value: string
  icon: string
  desc: string
}

const UserListCards = () => {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Hooks
  const isBelowMdScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

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
      <Card>
        <CardContent>
          <Skeleton variant='rectangular' height={150} />
        </CardContent>
      </Card>
    )
  }

  const data: DataType[] = [
    {
      title: 'Total Utilizadores',
      value: stats?.total_utilizadores?.toString() || '0',
      icon: 'tabler-users',
      desc: 'Total de utilizadores'
    },
    {
      title: 'Utilizadores Ativos',
      value: stats?.utilizadores_ativos?.toString() || '0',
      icon: 'tabler-user-check',
      desc: 'Contas ativas'
    },
    {
      title: 'Novos (30 dias)',
      value: stats?.novos_ultimos_30_dias?.toString() || '0',
      icon: 'tabler-user-plus',
      desc: 'Últimos 30 dias'
    },
    {
      title: 'Ativos (7 dias)',
      value: stats?.ativos_ultimos_7_dias?.toString() || '0',
      icon: 'tabler-user-search',
      desc: 'Login nos últimos 7 dias'
    }
  ]

  return (
    <Card>
      <CardContent>
        <Grid container spacing={6}>
          {data.map((item, index) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 3 }}
              key={index}
              className={classnames({
                '[&:nth-of-type(odd)>div]:pie-6 [&:nth-of-type(odd)>div]:border-ie': isBelowMdScreen && !isSmallScreen,
                '[&:not(:last-child)>div]:pie-6 [&:not(:last-child)>div]:border-ie': !isBelowMdScreen
              })}
            >
              <div className='flex flex-col gap-1'>
                <div className='flex justify-between'>
                  <div className='flex flex-col gap-1'>
                    <Typography>{item.title}</Typography>
                    <Typography variant='h4'>{item.value}</Typography>
                  </div>
                  <CustomAvatar variant='rounded' size={44}>
                    <i className={classnames(item.icon, 'text-[28px]')} />
                  </CustomAvatar>
                </div>
                <Typography>{item.desc}</Typography>
              </div>
              {isBelowMdScreen && !isSmallScreen && index < data.length - 2 && (
                <Divider
                  className={classnames('mbs-6', {
                    'mie-6': index % 2 === 0
                  })}
                />
              )}
              {isSmallScreen && index < data.length - 1 && <Divider className='mbs-6' />}
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default UserListCards
