'use client'

import { useEffect, useState } from 'react'
import Badge from '@mui/material/Badge'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'
import classnames from 'classnames'
import { useKeenSlider } from 'keen-slider/react'
import type { KeenSliderPlugin } from 'keen-slider/react'
import CustomAvatar from '@core/components/mui/Avatar'
import AppKeenSlider from '@/libs/styles/AppKeenSlider'
import { ticketsAPI } from '@/libs/api/suporte/api'
import { getDictionary } from '@/utils/getDictionary'

const SuporteStatisticsCard = ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) => {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<any>(null)
    const [loaded, setLoaded] = useState<boolean>(false)
    const [currentSlide, setCurrentSlide] = useState<number>(0)

    const theme = useTheme()

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await ticketsAPI.getDashboardStatistics()
                setStats(data.estatisticasGerais)
            } catch (error) {
                console.error('Erro ao carregar estatísticas:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const ResizePlugin: KeenSliderPlugin = slider => {
        const observer = new ResizeObserver(function () {
            slider.update()
        })

        slider.on('created', () => {
            observer.observe(slider.container)
        })
        slider.on('destroyed', () => {
            observer.unobserve(slider.container)
        })
    }

    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
        {
            loop: true,
            rtl: theme.direction === 'rtl',
            slideChanged(slider) {
                setCurrentSlide(slider.track.details.rel)
            },
            created() {
                setLoaded(true)
            }
        },
        [ResizePlugin]
    )

    if (loading) return <Card className='flex items-center justify-center p-10'><CircularProgress /></Card>

    const slides = [
        {
            title: 'Tickets por Status',
            img: '/images/cards/graphic-illustration-1.png',
            details: {
                'Total': String(stats?.total_tickets || 0),
                'Abertos': String(stats?.tickets_abertos || 0),
                'Em Andamento': String(stats?.tickets_em_andamento || 0),
                'Fechados': String(stats?.tickets_fechados || 0)
            }
        },
        {
            title: 'Prioridade & Resolução',
            img: '/images/cards/graphic-illustration-2.png',
            details: {
                'Urgente': String(stats?.prioridade_urgente || 0),
                'Alta': String(stats?.prioridade_alta || 0),
                'Média': String(stats?.prioridade_media || 0),
                'Baixa': String(stats?.prioridade_baixa || 0)
            }
        }
    ]

    return (
        <AppKeenSlider>
            <Card className='bg-primary'>
                <div ref={sliderRef} className='keen-slider relative'>
                    {loaded && instanceRef.current && (
                        <div className='swiper-dots absolute top-1 inline-end-6'>
                            {[...Array(instanceRef.current.track.details.slides.length).keys()].map(idx => {
                                return (
                                    <Badge
                                        key={idx}
                                        variant='dot'
                                        component='div'
                                        className={classnames({
                                            active: currentSlide === idx
                                        })}
                                        onClick={() => {
                                            instanceRef.current?.moveToIdx(idx)
                                        }}
                                        sx={{
                                            '& .MuiBadge-dot': {
                                                width: '8px !important',
                                                height: '8px !important',
                                                backgroundColor: 'var(--mui-palette-common-white) !important',
                                                opacity: 0.4
                                            },
                                            '&.active .MuiBadge-dot': {
                                                opacity: 1
                                            }
                                        }}
                                    ></Badge>
                                )
                            })}
                        </div>
                    )}
                    {slides.map((slide, index) => (
                        <div key={index} className={classnames('keen-slider__slide p-6 pbe-3 is-full')}>
                            <Typography variant='h5' className='mbe-0.5 text-[var(--mui-palette-common-white)]'>
                                Análises de Suporte
                            </Typography>
                            <Typography variant='subtitle2' className='mbe-3 text-[var(--mui-palette-common-white)]'>
                                Dashboard de Suporte
                            </Typography>
                            <Grid container spacing={4} className='relative'>
                                <Grid size={{ xs: 12, sm: 8 }} className='order-2 sm:order-1'>
                                    <div className='flex flex-col gap-4 pbs-5 sm:plb-6'>
                                        <Typography className='font-medium text-[var(--mui-palette-common-white)]'>{slide.title}</Typography>
                                        <Grid container spacing={4}>
                                            {Object.keys(slide.details).map((key: string, idx: number) => {
                                                return (
                                                    <Grid key={idx} size={{ xs: 6 }}>
                                                        <div className='flex items-center gap-0.5'>
                                                            <CustomAvatar
                                                                color='primary'
                                                                variant='rounded'
                                                                className='font-medium mie-2 text-white bg-[var(--mui-palette-primary-dark)] bs-[30px] is-12'
                                                            >
                                                                {slide.details[key]}
                                                            </CustomAvatar>
                                                            <Typography noWrap className='text-[var(--mui-palette-common-white)]'>
                                                                {key}
                                                            </Typography>
                                                        </div>
                                                    </Grid>
                                                )
                                            })}
                                        </Grid>
                                    </div>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }} className='flex justify-center order-1 sm:order-2'>
                                    <img
                                        src={slide.img}
                                        height={150}
                                        className='max-bs-[150px] md:bs-[120px] xl:bs-[150px] drop-shadow-[0_4px_60px_rgba(0,0,0,0.5)] sm:absolute bottom-3 end-0'
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    ))}
                </div>
            </Card>
        </AppKeenSlider>
    )
}

export default SuporteStatisticsCard
