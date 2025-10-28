'use client'
import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import dynamic from 'next/dynamic'
import { useTheme } from '@mui/material/styles'
import type { ApexOptions } from 'apexcharts'
import { usersAPI } from '@/libs/api/users/api'
import { getDictionary } from '@/utils/getDictionary'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const UtilizadoresPorMes = ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) => {
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<number[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await usersAPI.getDashboardStatistics()
        const data = response.utilizadoresPorMes || []
        setChartData(data.map((d: any) => d.total_criados))
      } catch (error) {
        console.error(dictionary['dashboards']?.admin.errorLoadingStats, error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const successColor = theme.palette.success.main

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      sparkline: { enabled: true }
    },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    grid: {
      show: false,
      padding: {
        top: 10,
        bottom: 20
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityTo: 0,
        opacityFrom: 1,
        shadeIntensity: 1,
        stops: [0, 100],
        colorStops: [
          [
            {
              offset: 0,
              opacity: 0.4,
              color: successColor
            },
            {
              opacity: 0,
              offset: 100,
              color: 'var(--mui-palette-background-paper)'
            }
          ]
        ]
      }
    },
    theme: {
      monochrome: {
        enabled: true,
        shadeTo: 'light',
        shadeIntensity: 1,
        color: successColor
      }
    },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: { show: false }
  }

  if (loading) return <Card className='flex items-center justify-center p-10'><CircularProgress /></Card>

  const totalUsers = chartData.reduce((acc, val) => acc + val, 0)
  const avgPerMonth = chartData.length > 0 ? Math.round(totalUsers / chartData.length) : 0

  return (
    <Card className='bs-full'>
      <CardHeader title={dictionary['dashboards']?.admin.userGrowth.title} subheader={dictionary['dashboards']?.admin.userGrowth.subtitle} className='pbe-0' />
      <AppReactApexCharts type='area' height={98} width='100%' options={options} series={[{ data: chartData }]} />
      <CardContent className='flex flex-col pbs-0'>
        <div className='flex items-center justify-between flex-wrap gap-x-4 gap-y-0.5'>
          <Typography variant='h4' color='text.primary'>
            {totalUsers}
          </Typography>
          <Typography variant='body2' color='success.main'>
            {dictionary['dashboards']?.admin.userGrowth.monthlyAvg.replace("{{avg}}", String(avgPerMonth)) || `+${avgPerMonth}/mês`}
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default UtilizadoresPorMes
