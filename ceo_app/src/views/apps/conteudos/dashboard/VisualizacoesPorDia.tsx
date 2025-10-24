'use client'

import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import dynamic from 'next/dynamic'
import { useTheme } from '@mui/material/styles'
import type { ApexOptions } from 'apexcharts'
import { conteudosAPI } from '@/libs/api/conteudos/api'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const VisualizacoesPorDia = () => {
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<{ categories: string[], series: number[] }>({ categories: [], series: [] })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await conteudosAPI.getDashboardStatistics()
        const data = response.visualizacoesPorDia || []
        setChartData({
          categories: data.map((d: any) => new Date(d.data).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' })),
          series: data.map((d: any) => d.total_visualizacoes)
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
    chart: { type: 'area', toolbar: { show: false } },
    xaxis: { categories: chartData.categories },
    colors: [theme.palette.primary.main],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: { type: 'gradient', gradient: { opacityFrom: 0.5, opacityTo: 0.1 } }
  }

  if (loading) return <Card className='flex items-center justify-center p-10'><CircularProgress /></Card>

  return (
    <Card>
      <CardHeader title='Visualizações (Últimos 30 dias)' />
      <CardContent>
        <AppReactApexCharts type='area' height={300} options={options} series={[{ name: 'Visualizações', data: chartData.series }]} />
      </CardContent>
    </Card>
  )
}

export default VisualizacoesPorDia
