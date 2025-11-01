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
import { ticketsAPI } from '@/libs/api/suporte/api'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const TicketsPorDia = () => {
    const theme = useTheme()
    const [loading, setLoading] = useState(true)
    const [chartData, setChartData] = useState<{ abertos: number[], fechados: number[] }>({ abertos: [], fechados: [] })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ticketsAPI.getDashboardStatistics()
                const ticketsPorDia = response.ticketsPorDia || []
                // Sort by date ascending
                ticketsPorDia.sort((a: any, b: any) => new Date(a.data).getTime() - new Date(b.data).getTime())

                setChartData({
                    abertos: ticketsPorDia.map((d: any) => d.total_abertos || 0),
                    fechados: ticketsPorDia.map((d: any) => d.total_fechados || 0)
                })
            } catch (error) {
                console.error('Erro ao carregar dados:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const primaryColor = theme.palette.primary.main
    const successColor = theme.palette.success.main

    const options: ApexOptions = {
        chart: {
            parentHeightOffset: 0,
            toolbar: { show: false },
            sparkline: { enabled: true }
        },
        tooltip: { enabled: true },
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
                            color: primaryColor
                        },
                        {
                            opacity: 0,
                            offset: 100,
                            color: 'var(--mui-palette-background-paper)'
                        }
                    ],
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
        colors: [primaryColor, successColor],
        xaxis: {
            labels: { show: false },
            axisTicks: { show: false },
            axisBorder: { show: false }
        },
        yaxis: { show: false },
        legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'left',
            fontSize: '13px',
            fontWeight: 400,
            labels: {
                colors: 'var(--mui-palette-text-secondary)'
            },
            markers: {
                width: 8,
                height: 8,
                offsetY: 1,
                offsetX: theme.direction === 'rtl' ? 8 : -4
            },
            itemMargin: {
                horizontal: 15
            }
        }
    }

    if (loading) return <Card className='flex items-center justify-center p-10'><CircularProgress /></Card>

    const totalAbertos = chartData.abertos.reduce((acc, val) => acc + val, 0)
    const totalFechados = chartData.fechados.reduce((acc, val) => acc + val, 0)
    const avgAbertosPerDay = chartData.abertos.length > 0 ? (totalAbertos / chartData.abertos.length).toFixed(1) : '0'

    return (
        <Card style={{ minHeight: '400px' }}>
            <CardHeader title='Atividade de Tickets' subheader='Últimos 30 dias' className='pbe-0' />
            <AppReactApexCharts
                type='area'
                height={220}
                width='100%'
                options={options}
                series={[
                    { name: 'Abertos', data: chartData.abertos },
                    { name: 'Fechados', data: chartData.fechados }
                ]}
            />
            <CardContent className='flex flex-col pbs-0'>
                <div className='flex items-center justify-between flex-wrap gap-x-4 gap-y-0.5'>
                    <div className='flex flex-col gap-1'>
                        <Typography variant='h4' color='text.primary'>
                            {totalAbertos}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            Tickets Abertos
                        </Typography>
                    </div>
                    <div className='flex flex-col gap-1 items-end'>
                        <Typography variant='h4' color='success.main'>
                            {totalFechados}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            Tickets Fechados
                        </Typography>
                    </div>
                </div>
                <Typography variant='body2' color='text.secondary' className='mbs-4'>
                    Média de {avgAbertosPerDay} tickets abertos por dia
                </Typography>
            </CardContent>
        </Card>
    )
}

export default TicketsPorDia

