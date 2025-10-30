'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import classnames from 'classnames'
import type { ApexOptions } from 'apexcharts'
import type { ThemeColor } from '@core/types'
import CustomAvatar from '@core/components/mui/Avatar'
import { conteudosAPI } from '@/libs/api/conteudos/api'
import { getDictionary } from '@/utils/getDictionary'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

type TipoConteudoStats = {
  stats: string
  title: string
  progress: number
  avatarIcon: string
  avatarColor?: ThemeColor
  progressColor?: ThemeColor
}

const tipoIcons: Record<string, string> = {
  'Notícia': 'tabler-news',
  'Artigo': 'tabler-file-text',
  'Vídeo': 'tabler-video',
  'Documento': 'tabler-file-description',
  'Imagem': 'tabler-photo',
  'default': 'tabler-file'
}

const tipoColors: Record<string, ThemeColor> = {
  'Notícia': 'error',
  'Artigo': 'primary',
  'Vídeo': 'success',
  'Documento': 'info',
  'Imagem': 'warning',
  'default': 'secondary'
}

const ConteudosMaisVisualizados = ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) => {
  const [loading, setLoading] = useState(true)
  const [tipoStats, setTipoStats] = useState<TipoConteudoStats[]>([])
  const [totalViews, setTotalViews] = useState(0)
  const [chartSeries, setChartSeries] = useState<number[]>([])
  const [chartCategories, setChartCategories] = useState<string[]>([])
  const [growthPercentage, setGrowthPercentage] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await conteudosAPI.getDashboardStatistics()
        const maisVisualizados = response.maisVisualizados || []

        // Aggregate views by content type
        const tipoMap = new Map<string, number>()
        let total = 0

        maisVisualizados.forEach((item: any) => {
          const tipo = item.tipo_conteudo_nome
          const views = item.visualizacoes
          tipoMap.set(tipo, (tipoMap.get(tipo) || 0) + views)
          total += views
        })

        setTotalViews(total)

        // Calculate growth (mock for now, you can add real comparison data from API)
        setGrowthPercentage(12.5)

        // Prepare chart data - top 7 types
        const sortedTipos = Array.from(tipoMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 7)

        setChartCategories(sortedTipos.map(([tipo]) => tipo))
        setChartSeries(sortedTipos.map(([, views]) => views))

        // Prepare tipo stats - top 3 types
        const topTipos = sortedTipos.slice(0, 3)
        const maxViews = Math.max(...topTipos.map(([, views]) => views))

        const stats: TipoConteudoStats[] = topTipos.map(([tipo, views]) => ({
          title: tipo,
          stats: String(views),
          progress: Math.round((views / maxViews) * 100),
          avatarIcon: tipoIcons[tipo] || tipoIcons.default,
          avatarColor: tipoColors[tipo] || tipoColors.default,
          progressColor: tipoColors[tipo] || 'secondary'
        }))

        setTipoStats(stats)
      } catch (error) {
        console.error(dictionary['dashboards']?.conteudos.errorLoadingStats, error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const primaryColorWithOpacity = 'var(--mui-palette-primary-lightOpacity)'

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    tooltip: { enabled: false },
    grid: {
      show: false,
      padding: {
        top: -31,
        left: 0,
        right: 0,
        bottom: -9
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        distributed: true,
        columnWidth: '42%'
      }
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    colors: [
      primaryColorWithOpacity,
      primaryColorWithOpacity,
      primaryColorWithOpacity,
      primaryColorWithOpacity,
      'var(--mui-palette-primary-main)',
      primaryColorWithOpacity,
      primaryColorWithOpacity
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      categories: chartCategories,
      axisTicks: { show: false },
      axisBorder: { show: false },
      labels: {
        style: {
          fontSize: '13px',
          colors: 'var(--mui-palette-text-disabled)'
        }
      }
    },
    yaxis: { show: false }
  }

  if (loading) return <Card className='flex items-center justify-center p-10'><CircularProgress /></Card>

  return (
    <Card>
      <CardHeader
        title={dictionary['dashboards']?.conteudos.mostViewed.title}
        subheader={dictionary['dashboards']?.conteudos.mostViewed.subtitle}
        className='pbe-0'
      />
      <CardContent className='flex flex-col gap-5 max-md:gap-5 max-[1015px]:gap-[62px] max-[1051px]:gap-10 max-[1200px]:gap-5 max-[1310px]:gap-10'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-8'>
          <div className='flex flex-col gap-3 is-full sm:is-[unset]'>
            <div className='flex items-center gap-2.5'>
              <Typography variant='h2'>{totalViews}</Typography>
              <Chip size='small' variant='tonal' color='success' label={`+${growthPercentage}%`} />
            </div>
            <Typography variant='body2' className='text-balance'>
              {dictionary['dashboards']?.conteudos.mostViewed.highlightedViews || 'Total de visualizações dos conteúdos mais acessados'}
            </Typography>
          </div>
          <AppReactApexCharts type='bar' height={163} width='100%' series={[{ data: chartSeries }]} options={options} />
        </div>
        <div className='flex flex-col sm:flex-row gap-6 p-5 border rounded'>
          {tipoStats.map((item, index) => (
            <div key={index} className='flex flex-col gap-2 is-full'>
              <div className='flex items-center gap-2'>
                <CustomAvatar skin='light' variant='rounded' color={item.avatarColor} size={26}>
                  <i className={classnames(item.avatarIcon, 'text-lg')} />
                </CustomAvatar>
                <Typography variant='h6' className='leading-6 font-normal'>
                  {item.title}
                </Typography>
              </div>
              <Typography variant='h4'>{item.stats}</Typography>
              <LinearProgress
                value={item.progress}
                variant='determinate'
                color={item.progressColor}
                className='max-bs-1'
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ConteudosMaisVisualizados
