'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'
import classnames from 'classnames'
import type { ApexOptions } from 'apexcharts'
import { usersAPI } from '@/libs/api/users/api'
import { getDictionary } from '@/utils/getDictionary'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const PermissoesPorModulo = ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])
  const [totalPermissoes, setTotalPermissoes] = useState<number>(0)
  const theme = useTheme()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await usersAPI.getDashboardStatistics()
        setData(response.permissoesPorModulo || [])
        setTotalPermissoes(response.estatisticasPermissoes?.total_permissoes || 0)
      } catch (error) {
        console.error(dictionary['dashboards']?.admin.permissionsPerModule.errorLoading, error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <Card className='flex items-center justify-center p-10'><CircularProgress /></Card>

  // Reverse data for proper chart display (ApexCharts displays from bottom to top)
  const reversedData = [...data].reverse()

  const series = [{ data: reversedData.map(mod => mod.total_permissoes) }]
  const labels = reversedData.map(mod => mod.modulo)

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
  const data1 = data.slice(0, halfLength)
  const data2 = data.slice(halfLength)

  const colorClasses = ['text-primary', 'text-info', 'text-success', 'text-secondary', 'text-error', 'text-warning']

  return (
    <Card>
      <CardHeader
        title={dictionary['dashboards']?.admin.permissionsPerModule.title}
      />
      <CardContent>
        <Grid container>
          <Grid size={{ xs: 12, lg: 6 }} className='max-lg:mbe-6'>
            <AppReactApexCharts type='bar' height={296} width='100%' series={series} options={options} />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }} alignSelf='center'>
            <div className='flex justify-around items-start'>
              <div className='flex flex-col gap-y-12'>
                {data1.map((item, i) => {
                  const percentage = totalPermissoes > 0
                    ? ((item.total_permissoes / totalPermissoes) * 100).toFixed(1)
                    : '0.0'
                  return (
                    <div key={i} className='flex gap-2'>
                      <i className={classnames('tabler-circle-filled text-xs m-[5px]', colorClasses[i % colorClasses.length])} />
                      <div>
                        <Typography>{item.modulo}</Typography>
                        <Typography variant='h5'>{percentage}%</Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {`${item.grupos_com_acesso} ${item.grupos_com_acesso === 1 ? dictionary['dashboards']?.admin.permissionsPerModule.group : dictionary['dashboards']?.admin.permissionsPerModule.groups}`}
                        </Typography>
                      </div>
                    </div>
                  )
                })}
              </div>
              {data2.length > 0 && (
                <div className='flex flex-col gap-y-12'>
                  {data2.map((item, i) => {
                    const percentage = totalPermissoes > 0
                      ? ((item.total_permissoes / totalPermissoes) * 100).toFixed(1)
                      : '0.0'
                    const colorIndex = (halfLength + i) % colorClasses.length
                    return (
                      <div key={i} className='flex gap-2'>
                        <i className={classnames('tabler-circle-filled text-xs m-[5px]', colorClasses[colorIndex])} />
                        <div>
                          <Typography>{item.modulo}</Typography>
                          <Typography variant='h5'>{percentage}%</Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {`${item.grupos_com_acesso} ${item.grupos_com_acesso === 1 ? dictionary['dashboards']?.admin.permissionsPerModule.group : dictionary['dashboards']?.admin.permissionsPerModule.groups}`}
                          </Typography>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default PermissoesPorModulo
