'use client'
import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import dynamic from 'next/dynamic'
import { useTheme } from '@mui/material/styles'
import type { ApexOptions } from 'apexcharts'
import { usersAPI } from '@/libs/api/users/api'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const UtilizadoresPorMes = () => {
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<{ categories: string[], series: number[] }>({ categories: [], series: [] })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await usersAPI.getDashboardStatistics()
        const data = response.utilizadoresPorMes || []
        setChartData({
          categories: data.map((d: any) => d.mes),
          series: data.map((d: any) => d.total_criados)
        })
      } catch (error) {
        console.error('Erro:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const options: ApexOptions = {
    chart: { type: 'line', toolbar: { show: false } },
    xaxis: { categories: chartData.categories },
    colors: [theme.palette.success.main],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    markers: { size: 5 }
  }

  if (loading) return <Card className='flex items-center justify-center p-10'><CircularProgress /></Card>

  return (
    <Card>
      <CardHeader title='Crescimento de Utilizadores (Últimos 12 meses)' />
      <CardContent>
        <AppReactApexCharts type='line' height={300} options={options} series={[{ name: 'Novos Utilizadores', data: chartData.series }]} />
      </CardContent>
    </Card>
  )
}

export default UtilizadoresPorMes
