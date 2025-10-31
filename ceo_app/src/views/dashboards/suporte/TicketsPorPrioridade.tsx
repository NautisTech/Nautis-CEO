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

const TicketsPorPrioridade = () => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any[]>([])
    const theme = useTheme()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ticketsAPI.getDashboardStatistics()
                setData(response.ticketsPorPrioridade || [])
            } catch (error) {
                console.error('Erro:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return <Card className='flex items-center justify-center p-10'><CircularProgress /></Card>

    const prioridadeLabels: Record<string, string> = {
        urgente: 'Urgente',
        alta: 'Alta',
        media: 'Média',
        baixa: 'Baixa'
    }

    const prioridadeColors: Record<string, string> = {
        urgente: 'var(--mui-palette-error-main)',
        alta: 'var(--mui-palette-warning-main)',
        media: 'var(--mui-palette-info-main)',
        baixa: 'var(--mui-palette-success-main)'
    }

    const series = data.map(item => item.total)
    const labels = data.map(item => prioridadeLabels[item.prioridade] || item.prioridade)
    const colors = data.map(item => prioridadeColors[item.prioridade] || 'var(--mui-palette-primary-main)')

    const options: ApexOptions = {
        labels: labels,
        stroke: {
            width: 0
        },
        colors: colors,
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
                            label: 'Total',
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
            <CardHeader title='Tickets por Prioridade' />
            <CardContent>
                <AppReactApexCharts type='donut' height={370} width='100%' series={series} options={options} />
            </CardContent>
        </Card>
    )
}

export default TicketsPorPrioridade
