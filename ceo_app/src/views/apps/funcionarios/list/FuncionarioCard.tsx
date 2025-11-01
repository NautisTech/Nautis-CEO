'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// API Imports
import { funcionariosAPI } from '@/libs/api/funcionarios/api'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'

type DataType = {
  title: string
  value: string
  icon: string
  desc: string
}

const FuncionarioCard = ({
  dictionary,
  tipo
}: {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  tipo?: string
}) => {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Hooks
  const isBelowMdScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await funcionariosAPI.getStatistics()
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
      title: dictionary['funcionarios'].stats.totalEmployees,
      value: stats?.total_funcionarios?.toString() || '0',
      icon: 'tabler-users',
      desc: tipo
        ? dictionary['funcionarios'].stats.typeFilter.replace('{{type}}', tipo)
        : dictionary['funcionarios'].stats.totalEmployeesDesc
    },
    {
      title: dictionary['funcionarios'].stats.activeEmployees,
      value: stats?.funcionarios_ativos?.toString() || '0',
      icon: 'tabler-user-check',
      desc: dictionary['funcionarios'].stats.activeEmployeesDesc
    },
    {
      title: dictionary['funcionarios'].stats.inactiveEmployees,
      value: stats?.funcionarios_inativos?.toString() || '0',
      icon: 'tabler-user-x',
      desc: dictionary['funcionarios'].stats.inactiveEmployeesDesc
    },
    {
      title: dictionary['funcionarios'].stats.newEmployees,
      value: stats?.funcionarios_mes?.toString() || '0',
      icon: 'tabler-user-plus',
      desc: dictionary['funcionarios'].stats.newEmployeesDesc
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

export default FuncionarioCard
