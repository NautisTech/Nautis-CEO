'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'
import type { ApexOptions } from 'apexcharts'
import { equipamentosAPI } from '@/libs/api/equipamentos/api'
import { getDictionary } from '@/utils/getDictionary'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const EquipamentosPorEstado = ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any[]>([])
    const theme = useTheme()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await equipamentosAPI.getDashboardStatistics()
                setData(response.equipamentosPorEstado || [])
            } catch (error) {
                console.error('Erro:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return <Card className='flex items-center justify-center p-10'><CircularProgress /></Card>

    const series = data.map(item => item.total)
    const labels = data.map(item => {
        const statusLabels: Record<string, string> = {
            'operacional': 'Operacional',
            'em manutenção': 'Em Manutenção',
            'em_manutencao': 'Em Manutenção',
            'inativo': 'Inativo',
            'descartado': 'Descartado'
        }
        return statusLabels[item.estado.toLowerCase()] || item.estado
    })

    // Define appropriate colors for each estado (matching EditEquipamentoDialog)
    const getColorForEstado = (estado: string) => {
        const normalizedEstado = estado.toLowerCase()
        if (normalizedEstado === 'operacional') return 'var(--mui-palette-success-main)'
        if (normalizedEstado === 'em manutenção' || normalizedEstado === 'em_manutencao') return 'var(--mui-palette-warning-main)'
        if (normalizedEstado === 'inativo') return 'var(--mui-palette-secondary-main)'
        if (normalizedEstado === 'descartado') return 'var(--mui-palette-error-main)'
        return 'var(--mui-palette-primary-main)'
    }
    const colors = data.map(item => getColorForEstado(item.estado))

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
            <CardHeader title='Equipamentos por Estado' />
            <CardContent>
                <AppReactApexCharts type='donut' height={370} width='100%' series={series} options={options} />
            </CardContent>
        </Card>
    )
}

export default EquipamentosPorEstado
