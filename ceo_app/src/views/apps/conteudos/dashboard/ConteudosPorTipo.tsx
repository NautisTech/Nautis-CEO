'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'
import type { ApexOptions } from 'apexcharts'
import { conteudosAPI } from '@/libs/api/conteudos/api'
import { getDictionary } from '@/utils/getDictionary'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const ConteudosPorTipo = ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])
  const theme = useTheme()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await conteudosAPI.getDashboardStatistics()
        setData(response.estatisticasPorTipo || [])
      } catch (error) {
        console.error('Erro:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <Card className='flex items-center justify-center p-10'><CircularProgress /></Card>

  const series = data.map(tipo => tipo.total_conteudos)
  const labels = data.map(tipo => tipo.nome)
  const totalPublicados = data.reduce((acc, tipo) => acc + (tipo.publicados || 0), 0)

  const options: ApexOptions = {
    labels: labels,
    stroke: {
      width: 0
    },
    colors: [
      'var(--mui-palette-primary-main)',
      'rgba(var(--mui-palette-primary-mainChannel) / 0.8)',
      'rgba(var(--mui-palette-primary-mainChannel) / 0.6)',
      'rgba(var(--mui-palette-primary-mainChannel) / 0.4)',
      'rgba(var(--mui-palette-primary-mainChannel) / 0.2)'
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
              fontSize: '2rem',
              fontWeight: 600,
              color: 'var(--mui-palette-text-primary)',
              offsetY: -25,
              formatter(val: string) {
                return val
              }
            },
            name: {
              fontSize: '0.875rem',
              fontWeight: 400,
              color: 'var(--mui-palette-text-secondary)',
              offsetY: 5
            },
            total: {
              show: true,
              showAlways: true,
              label: dictionary['dashboards']?.conteudos.byType.total,
              fontSize: '0.875rem',
              fontWeight: 400,
              color: 'var(--mui-palette-text-secondary)',
              formatter(w: any) {
                const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0)
                return total
              }
            }
          }
        },
        expandOnClick: false
      }
    },
    tooltip: {
      enabled: true,
      y: {
        formatter(val: number, opts: any) {
          const tipoIndex = opts.seriesIndex
          const tipoPublicados = data[tipoIndex]?.publicados || 0
          return dictionary['dashboards']?.conteudos.byType.tooltip.replace('{{total}}', val.toString()).replace('{{published}}', tipoPublicados.toString())
        }
      }
    }
  }

  return (
    <Card className='bs-full'>
      <CardHeader title={dictionary['dashboards']?.conteudos.byType.title} />
      <CardContent className='relative'>
        <AppReactApexCharts type='donut' height={370} width='100%' series={series} options={options} />
        <div className='absolute' style={{ top: '50%', left: '50%', transform: 'translate(-50%, 10%)' }}>
          <Typography variant='caption' color='text.secondary' align='center' display='block'>
            {dictionary['dashboards']?.conteudos.byType.published.replace('{{count}}', totalPublicados.toString())}
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default ConteudosPorTipo
