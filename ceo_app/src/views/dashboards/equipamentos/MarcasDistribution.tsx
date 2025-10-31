'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'
import type { ApexOptions } from 'apexcharts'
import { equipamentosAPI } from '@/libs/api/equipamentos/api'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

type DataType = {
    title: string
    value: number
    colorClass: string
}

const MarcasDistribution = () => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any[]>([])
    const theme = useTheme()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await equipamentosAPI.getDashboardStatistics()
                setData(response.topMarcas || [])
            } catch (error) {
                console.error('Erro:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return <Card className='flex items-center justify-center p-10'><CircularProgress /></Card>

    const series = [{ data: data.map(marca => marca.total_equipamentos) }]
    const labels = data.map(marca => marca.nome)

    const colors = [
        'var(--mui-palette-primary-main)',
        'var(--mui-palette-info-main)',
        'var(--mui-palette-success-main)',
        'var(--mui-palette-secondary-main)',
        'var(--mui-palette-error-main)',
        'var(--mui-palette-warning-main)'
    ]

    const options: ApexOptions = {
        chart: {
            parentHeightOffset: 0,
            toolbar: { show: false }
        },
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: '70%',
                distributed: true,
                borderRadius: 7,
                borderRadiusApplication: 'end'
            }
        },
        colors: colors,
        grid: {
            strokeDashArray: 8,
            borderColor: 'var(--mui-palette-divider)',
            xaxis: {
                lines: { show: true }
            },
            yaxis: {
                lines: { show: false }
            },
            padding: {
                top: -25,
                left: 21,
                right: 25,
                bottom: 0
            }
        },
        dataLabels: {
            enabled: false
        },
        tooltip: {
            enabled: true,
            style: {
                fontSize: '0.75rem'
            },
            onDatasetHover: {
                highlightDataSeries: false
            }
        },
        legend: { show: false },
        states: {
            hover: {
                filter: { type: 'none' }
            },
            active: {
                filter: { type: 'none' }
            }
        },
        xaxis: {
            axisTicks: { show: false },
            axisBorder: { show: false },
            categories: labels,
            labels: {
                formatter: val => val,
                style: {
                    fontSize: '0.8125rem',
                    colors: 'var(--mui-palette-text-disabled)'
                }
            }
        },
        yaxis: {
            labels: {
                align: theme.direction === 'rtl' ? 'right' : 'left',
                style: {
                    fontWeight: 500,
                    fontSize: '0.8125rem',
                    colors: 'var(--mui-palette-text-disabled)'
                },
                offsetX: theme.direction === 'rtl' ? -15 : -20
            }
        }
    }

    // Split data into two columns
    const halfLength = Math.ceil(data.length / 2)
    const data1: DataType[] = data.slice(0, halfLength).map((marca, idx) => ({
        title: marca.nome,
        value: marca.total_equipamentos,
        colorClass: ['text-primary', 'text-info', 'text-success'][idx % 3]
    }))
    const data2: DataType[] = data.slice(halfLength).map((marca, idx) => ({
        title: marca.nome,
        value: marca.total_equipamentos,
        colorClass: ['text-secondary', 'text-error', 'text-warning'][idx % 3]
    }))

    return (
        <Card>
            <CardHeader title='Top Marcas' />
            <CardContent>
                <Grid container>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <AppReactApexCharts type='bar' height={332} width='100%' series={series} options={options} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} className='flex items-center justify-around'>
                        <div className='flex flex-col gap-8'>
                            {data1.map((item, index) => (
                                <div key={index} className='flex items-center gap-2'>
                                    <i className={`tabler-circle-filled text-xs ${item.colorClass}`} />
                                    <div>
                                        <Typography>{item.title}</Typography>
                                        <Typography variant='h6' className={item.colorClass}>
                                            {item.value}
                                        </Typography>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='flex flex-col gap-8'>
                            {data2.map((item, index) => (
                                <div key={index} className='flex items-center gap-2'>
                                    <i className={`tabler-circle-filled text-xs ${item.colorClass}`} />
                                    <div>
                                        <Typography>{item.title}</Typography>
                                        <Typography variant='h6' className={item.colorClass}>
                                            {item.value}
                                        </Typography>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default MarcasDistribution
