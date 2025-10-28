'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'
import type { ApexOptions } from 'apexcharts'
import OptionMenu from '@core/components/option-menu'
import { conteudosAPI } from '@/libs/api/conteudos/api'
import { getDictionary } from '@/utils/getDictionary'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const ConteudosPorCategoria = ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])
  const theme = useTheme()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await conteudosAPI.getDashboardStatistics()
        setData(response.estatisticasPorCategoria || [])
      } catch (error) {
        console.error(dictionary['dashboards']?.conteudos.errorLoadingStats, error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <Card className='flex items-center justify-center p-10'><CircularProgress /></Card>

  const series = data.map(cat => cat.total_conteudos)
  const labels = data.map(cat => cat.nome)

  const options: ApexOptions = {
    labels: labels,
    stroke: {
      width: 0
    },
    colors: [
      'var(--mui-palette-success-main)',
      'rgba(var(--mui-palette-success-mainChannel) / 0.8)',
      'rgba(var(--mui-palette-success-mainChannel) / 0.6)',
      'rgba(var(--mui-palette-success-mainChannel) / 0.4)',
      'rgba(var(--mui-palette-success-mainChannel) / 0.2)'
    ],
    dataLabels: {
      enabled: false,
      formatter(val: string) {
        return `${Number.parseInt(val)}%`
      }
    },
    legend: {
      show: true,
      position: 'bottom',
      offsetY: 10,
      markers: {
        width: 8,
        height: 8,
        offsetY: 1,
        offsetX: theme.direction === 'rtl' ? 8 : -4
      },
      itemMargin: {
        horizontal: 15,
        vertical: 5
      },
      fontSize: '13px',
      fontWeight: 400,
      labels: {
        colors: 'var(--mui-palette-text-secondary)',
        useSeriesColors: false
      }
    },
    grid: {
      padding: {
        top: 15
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            value: {
              fontSize: '24px',
              color: 'var(--mui-palette-text-primary)',
              fontWeight: 500,
              offsetY: -20
            },
            name: { offsetY: 20 },
            total: {
              show: true,
              fontSize: '0.9375rem',
              fontWeight: 400,
              label: dictionary['dashboards']?.conteudos.byCategory.total,
              color: 'var(--mui-palette-text-secondary)',
              formatter() {
                return String(series.reduce((acc, val) => acc + val, 0))
              }
            }
          }
        }
      }
    }
  }

  return (
    <Card className='bs-full'>
      <CardHeader title={dictionary['dashboards']?.conteudos.byCategory.title} action={<OptionMenu options={['Atualizar', 'Ver Todas', 'Gerir']} />} />
      <CardContent>
        <AppReactApexCharts type='donut' height={370} width='100%' series={series} options={options} />
      </CardContent>
    </Card>
  )
}

export default ConteudosPorCategoria
