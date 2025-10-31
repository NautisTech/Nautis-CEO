'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'
import classnames from 'classnames'
import type { ApexOptions } from 'apexcharts'
import type { ThemeColor } from '@core/types'
import CustomAvatar from '@core/components/mui/Avatar'
import { ticketsAPI } from '@/libs/api/suporte/api'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

type DataType = {
    title: string
    subtitle: string
    avatarIcon: string
    avatarColor?: ThemeColor
}

const SLACompliance = () => {
    const [loading, setLoading] = useState(true)
    const [slaData, setSlaData] = useState<any>(null)
    const theme = useTheme()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ticketsAPI.getDashboardStatistics()
                setSlaData(response.slaCompliance)
            } catch (error) {
                console.error('Erro:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return <Card className='flex items-center justify-center p-10'><CircularProgress /></Card>

    const percentage = slaData?.percentagem || 0

    // Vars
    const disabledText = 'var(--mui-palette-text-disabled)'

    const data: DataType[] = [
        {
            title: 'Cumpridos',
            subtitle: (slaData?.cumpridos || 0).toString(),
            avatarColor: 'success',
            avatarIcon: 'tabler-check'
        },
        {
            title: 'Não Cumpridos',
            subtitle: (slaData?.nao_cumpridos || 0).toString(),
            avatarColor: 'error',
            avatarIcon: 'tabler-x'
        },
        {
            title: 'Total com SLA',
            subtitle: (slaData?.total_com_sla || 0).toString(),
            avatarColor: 'info',
            avatarIcon: 'tabler-clock'
        }
    ]

    const options: ApexOptions = {
        stroke: { dashArray: 10 },
        labels: ['SLA Compliance'],
        colors: [
            percentage >= 90 ? 'var(--mui-palette-success-main)' :
                percentage >= 70 ? 'var(--mui-palette-warning-main)' :
                    'var(--mui-palette-error-main)'
        ],
        states: {
            hover: {
                filter: { type: 'none' }
            },
            active: {
                filter: { type: 'none' }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                opacityTo: 0.5,
                opacityFrom: 1,
                shadeIntensity: 0.5,
                stops: [30, 70, 100],
                inverseColors: false,
                gradientToColors: [
                    percentage >= 90 ? 'var(--mui-palette-success-main)' :
                        percentage >= 70 ? 'var(--mui-palette-warning-main)' :
                            'var(--mui-palette-error-main)'
                ]
            }
        },
        plotOptions: {
            radialBar: {
                endAngle: 130,
                startAngle: -140,
                hollow: { size: '60%' },
                track: { background: 'transparent' },
                dataLabels: {
                    name: {
                        offsetY: -24,
                        color: disabledText,
                        fontFamily: theme.typography.fontFamily,
                        fontSize: theme.typography.body2.fontSize as string
                    },
                    value: {
                        offsetY: 8,
                        fontWeight: 500,
                        formatter: value => `${value}%`,
                        color: 'var(--mui-palette-text-primary)',
                        fontFamily: theme.typography.fontFamily,
                        fontSize: theme.typography.h2.fontSize as string
                    }
                }
            }
        },
        grid: {
            padding: {
                top: -18,
                left: 0,
                right: 0,
                bottom: 14
            }
        },
        responsive: [
            {
                breakpoint: 1380,
                options: {
                    grid: {
                        padding: {
                            top: 8,
                            left: 12
                        }
                    }
                }
            },
            {
                breakpoint: 1280,
                options: {
                    chart: {
                        height: 325
                    },
                    grid: {
                        padding: {
                            top: 12,
                            left: 12
                        }
                    }
                }
            },
            {
                breakpoint: 1201,
                options: {
                    chart: {
                        height: 362
                    }
                }
            },
            {
                breakpoint: 1135,
                options: {
                    chart: {
                        height: 350
                    }
                }
            },
            {
                breakpoint: 980,
                options: {
                    chart: {
                        height: 300
                    }
                }
            },
            {
                breakpoint: 900,
                options: {
                    chart: {
                        height: 350
                    }
                }
            }
        ]
    }

    return (
        <Card>
            <CardHeader title='SLA Compliance' subheader='Percentagem de cumprimento' />
            <CardContent className='flex flex-col sm:flex-row items-center justify-between gap-7'>
                <div className='flex flex-col gap-6 is-full sm:is-[unset]'>
                    <div className='flex flex-col'>
                        <Typography variant='h2'>{slaData?.total_com_sla || 0}</Typography>
                        <Typography>Tickets com SLA</Typography>
                    </div>
                    <div className='flex flex-col gap-4 is-full'>
                        {data.map((item, index) => (
                            <div key={index} className='flex items-center gap-4'>
                                <CustomAvatar skin='light' variant='rounded' color={item.avatarColor} size={34}>
                                    <i className={classnames(item.avatarIcon, 'text-[22px]')} />
                                </CustomAvatar>
                                <div className='flex flex-col'>
                                    <Typography className='font-medium' color='text.primary'>
                                        {item.title}
                                    </Typography>
                                    <Typography variant='body2'>{item.subtitle}</Typography>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <AppReactApexCharts
                    type='radialBar'
                    height={350}
                    width='100%'
                    series={[percentage]}
                    options={options}
                />
            </CardContent>
        </Card>
    )
}

export default SLACompliance
