'use client'

import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import dynamic from 'next/dynamic'
import classnames from 'classnames'
import type { ApexOptions } from 'apexcharts'
import type { ThemeColor } from '@core/types'
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'
import { usersAPI } from '@/libs/api/users/api'
import { getDictionary } from '@/utils/getDictionary'
import { formatWeekdayShort } from '@/utils/dateFormatter'
import type { Locale } from '@configs/i18n'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

type SummaryDataType = {
  stats: string
  title: string
  progress: number
  avatarIcon: string
  avatarColor?: ThemeColor
  progressColor?: ThemeColor
}

const AtividadeLogin = ({ dictionary, lang }: { dictionary: Awaited<ReturnType<typeof getDictionary>>, lang: Locale }) => {
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<{ categories: string[], series: number[] }>({ categories: [], series: [] })
  const [summaryStats, setSummaryStats] = useState<SummaryDataType[]>([])
  const [totalLogins, setTotalLogins] = useState(0)
  const [growthPercentage, setGrowthPercentage] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await usersAPI.getDashboardStatistics()
        const data = response.atividadeLogin || []

        // Calculate last 7 days data
        const last7Days = data.slice(-7)
        const previous7Days = data.slice(-14, -7)

        const last7DaysTotal = last7Days.reduce((sum: number, d: any) => sum + d.total_logins, 0)
        const previous7DaysTotal = previous7Days.reduce((sum: number, d: any) => sum + d.total_logins, 0)

        const growth = previous7DaysTotal > 0
          ? ((last7DaysTotal - previous7DaysTotal) / previous7DaysTotal * 100).toFixed(1)
          : 0

        setTotalLogins(last7DaysTotal)
        setGrowthPercentage(Number(growth))

        setChartData({
          categories: last7Days.map((d: any) => formatWeekdayShort(d.data, lang)),
          series: last7Days.map((d: any) => d.total_logins)
        })

        // Calculate summary stats
        const avgLogins = Math.round(last7DaysTotal / 7)
        const maxLogins = Math.max(...last7Days.map((d: any) => d.total_logins))
        const minLogins = Math.min(...last7Days.map((d: any) => d.total_logins))

        setSummaryStats([
          {
            title: dictionary['dashboards']?.admin.loginActivity.dailyAvg,
            stats: String(avgLogins),
            progress: 75,
            progressColor: 'primary',
            avatarColor: 'primary',
            avatarIcon: 'tabler-chart-line'
          },
          {
            title: dictionary['dashboards']?.admin.loginActivity.max,
            stats: String(maxLogins),
            progress: 85,
            progressColor: 'success',
            avatarColor: 'success',
            avatarIcon: 'tabler-trending-up'
          },
          {
            title: dictionary['dashboards']?.admin.loginActivity.min,
            stats: String(minLogins),
            progress: 45,
            progressColor: 'info',
            avatarColor: 'info',
            avatarIcon: 'tabler-trending-down'
          }
        ])
      } catch (error) {
        console.error('Erro:', error)
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
        left: 15,
        right: 15,
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
      categories: chartData.categories,
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
        title={dictionary['dashboards']?.admin.loginActivity.title}
        subheader={dictionary['dashboards']?.admin.loginActivity.title}
        // action={<OptionMenu options={['Última Semana', 'Último Mês', 'Último Ano']} />}
        className='pbe-0'
      />
      <CardContent className='flex flex-col gap-5 max-md:gap-5 max-[1015px]:gap-[62px] max-[1051px]:gap-10 max-[1200px]:gap-5 max-[1310px]:gap-10'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-8'>
          <div className='flex flex-col gap-3 is-full sm:is-[unset]'>
            <div className='flex items-center gap-2.5'>
              <Typography variant='h2'>{totalLogins}</Typography>
              <Chip
                size='small'
                variant='tonal'
                color={growthPercentage >= 0 ? 'success' : 'error'}
                label={`${growthPercentage >= 0 ? '+' : ''}${growthPercentage}%`}
              />
            </div>
            <Typography variant='body2' className='text-balance'>
              {dictionary['dashboards']?.admin.loginActivity.chipTooltip}
            </Typography>
          </div>
          <AppReactApexCharts
            type='bar'
            height={163}
            width='100%'
            series={[{ data: chartData.series }]}
            options={options}
          />
        </div>
        <div className='flex flex-col sm:flex-row gap-6 p-5 border rounded'>
          {summaryStats.map((item, index) => (
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

export default AtividadeLogin
