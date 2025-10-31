'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'
import type { ApexOptions } from 'apexcharts'
import { ticketsAPI } from '@/libs/api/suporte/api'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const TicketsPorDia = () => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any[]>([])
    const theme = useTheme()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ticketsAPI.getDashboardStatistics()
                const ticketsPorDia = response.ticketsPorDia || []
                // Sort by date ascending
                ticketsPorDia.sort((a: any, b: any) => new Date(a.data).getTime() - new Date(b.data).getTime())
                setData(ticketsPorDia)
            } catch (error) {
                console.error('Erro:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return <Card className='flex items-center justify-center p-10'><CircularProgress /></Card>

    const primaryColor = theme.palette.primary.main
    const successColor = theme.palette.success.main

    const series = [
        {
            name: 'Abertos',
            data: data.map(item => item.total_abertos)
        },
        {
            name: 'Fechados',
            data: data.map(item => item.total_fechados)
        }
    ]

    const categories = data.map(item => {
        const date = new Date(item.data)
        return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })
    })

    const options: ApexOptions = {
        chart: {
            parentHeightOffset: 0,
            toolbar: { show: false }
        },
        tooltip: { enabled: true },
        dataLabels: { enabled: false },
        stroke: {
            width: 2,
            curve: 'smooth'
        },
        grid: {
            show: true,
            borderColor: 'var(--mui-palette-divider)',
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10
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
        theme: {
            monochrome: {
                enabled: false
            }
        },
        xaxis: {
            categories: categories,
            labels: {
                style: {
                    colors: 'var(--mui-palette-text-disabled)',
                    fontSize: '13px'
                }
            },
            axisTicks: { show: false },
            axisBorder: { show: false }
        },
        yaxis: {
            labels: {
                style: {
                    colors: 'var(--mui-palette-text-disabled)',
                    fontSize: '13px'
                }
            }
        },
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

    return (
        <Card className='bs-full'>
            <CardHeader title='Tickets por Dia' subheader='Últimos 30 dias' />
            <CardContent>
                <AppReactApexCharts type='area' height={350} width='100%' series={series} options={options} />
            </CardContent>
        </Card>
    )
}

export default TicketsPorDia
