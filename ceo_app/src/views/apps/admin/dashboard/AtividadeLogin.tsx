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

const AtividadeLogin = () => {
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<{ categories: string[], series: number[] }>({ categories: [], series: [] })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await usersAPI.getDashboardStatistics()
        const data = response.atividadeLogin || []
        setChartData({
          categories: data.map((d: any) => new Date(d.data).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' })),
          series: data.map((d: any) => d.total_logins)
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
    chart: { type: 'bar', toolbar: { show: false } },
    xaxis: { categories: chartData.categories },
    colors: [theme.palette.primary.main],
    dataLabels: { enabled: false },
    plotOptions: { bar: { borderRadius: 4, columnWidth: '60%' } }
  }

  if (loading) return <Card className='flex items-center justify-center p-10'><CircularProgress /></Card>

  return (
    <Card>
      <CardHeader title='Atividade de Login (Últimos 30 dias)' />
      <CardContent>
        <AppReactApexCharts type='bar' height={300} options={options} series={[{ name: 'Logins', data: chartData.series }]} />
      </CardContent>
    </Card>
  )
}

export default AtividadeLogin
