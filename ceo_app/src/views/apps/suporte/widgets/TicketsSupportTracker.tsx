'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'

// Third Party Imports
import classnames from 'classnames'
import type { ApexOptions } from 'apexcharts'

// Types Imports
import type { ThemeColor } from '@core/types'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'

// API Imports
import { ticketsAPI } from '@/libs/api/suporte/api'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

type DataType = {
  title: string
  subtitle: string
  avatarIcon: string
  avatarColor?: ThemeColor
}

const TicketsSupportTracker = () => {
  // Hooks
  const theme = useTheme()

  // State
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
          total: data?.total || 0,
          novos: data?.novos || 0,
          abertos: data?.abertos || 0,
          slaCumprido: data?.slaCumprido || 0
        })
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Vars
  const disabledText = 'var(--mui-palette-text-disabled)'

  const data: DataType[] = [
    {
      title: 'Novos Tickets',
      subtitle: stats.novos.toString(),
      avatarColor: 'primary',
      avatarIcon: 'tabler-ticket'
    },
    {
      title: 'Tickets Abertos',
      subtitle: stats.abertos.toString(),
      avatarColor: 'info',
      avatarIcon: 'tabler-progress'
    },
    {
      title: 'SLA Cumprido',
      subtitle: `${stats.slaCumprido}%`,
      avatarColor: 'success',
      avatarIcon: 'tabler-clock-check'
    }
  ]

  const options: ApexOptions = {
    stroke: { dashArray: 10 },
    labels: ['SLA Compliance'],
    colors: ['var(--mui-palette-success-main)'],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        opacityTo: 0.5,
        opacityFrom: 1,
        shadeIntensity: 0.5,
        stops: [30, 70, 100],
        inverseColors: false,
        gradientToColors: ['var(--mui-palette-success-main)']
      }
    },
    plotOptions: {
      radialBar: {
        endAngle: 130,
        startAngle: -140,
        hollow: { size: '60%' },
        track: { background: 'transparent' },
        dataLabels: {
          name: {
            offsetY: -24,
            color: disabledText,
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.body2.fontSize as string
          },
          value: {
            offsetY: 8,
            fontWeight: 500,
            formatter: value => `${value}%`,
            color: 'var(--mui-palette-text-primary)',
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.h2.fontSize as string
          }
        }
      }
    },
    grid: {
      padding: {
        top: -18,
        left: 0,
        right: 0,
        bottom: 14
      }
    },
    responsive: [
      {
        breakpoint: 1380,
        options: {
          grid: {
            padding: {
              top: 8,
              left: 12
            }
          }
        }
      },
      {
        breakpoint: 1280,
        options: {
          chart: {
            height: 325
          },
          grid: {
            padding: {
              top: 12,
              left: 12
            }
          }
        }
      },
      {
        breakpoint: 1201,
        options: {
          chart: {
            height: 362
          }
        }
      },
      {
        breakpoint: 1135,
        options: {
          chart: {
            height: 350
          }
        }
      },
      {
        breakpoint: 980,
        options: {
          chart: {
            height: 300
          }
        }
      },
      {
        breakpoint: 900,
        options: {
          chart: {
            height: 350
          }
        }
      }
    ]
  }

  if (loading) {
    return (
      <Card>
        <CardHeader title='Gestão de Tickets' subheader='Últimos 30 dias' />
        <CardContent className='flex items-center justify-center' style={{ minHeight: 400 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader title='Gestão de Tickets' subheader='Últimos 30 dias' />
      <CardContent className='flex flex-col sm:flex-row items-center justify-between gap-7'>
        <div className='flex flex-col gap-6 is-full sm:is-[unset]'>
          <div className='flex flex-col'>
            <Typography variant='h2'>{stats.total}</Typography>
            <Typography>Total de Tickets</Typography>
          </div>
          <div className='flex flex-col gap-4 is-full'>
            {data.map((item, index) => (
              <div key={index} className='flex items-center gap-4'>
                <CustomAvatar skin='light' variant='rounded' color={item.avatarColor} size={34}>
                  <i className={classnames(item.avatarIcon, 'text-[22px]')} />
                </CustomAvatar>
                <div className='flex flex-col'>
                  <Typography className='font-medium' color='text.primary'>
                    {item.title}
                  </Typography>
                  <Typography variant='body2'>{item.subtitle}</Typography>
                </div>
              </div>
            ))}
          </div>
        </div>
        <AppReactApexCharts
          type='radialBar'
          height={350}
          width='100%'
          series={[stats.slaCumprido]}
          options={options}
        />
      </CardContent>
    </Card>
  )
}

export default TicketsSupportTracker
