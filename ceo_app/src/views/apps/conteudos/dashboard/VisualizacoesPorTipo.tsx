'use client'

// React Imports
import { useState, useEffect } from 'react'
import type { SyntheticEvent } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import type { Theme } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'

// Third Party Imports
import classnames from 'classnames'
import type { ApexOptions } from 'apexcharts'

// Components Imports
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'

// API Imports
import { conteudosAPI } from '@/libs/api/conteudos/api'

// Types Imports
import type { ThemeColor } from '@core/types'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

type ApexChartSeries = NonNullable<ApexOptions['series']>
type ApexChartSeriesData = Exclude<ApexChartSeries[0], number>

type TabType = {
  type: string
  label: string
  avatarIcon: string
  color: ThemeColor
  series: ApexChartSeries
}

const tipoIcons: Record<string, string> = {
  'Notícia': 'tabler-news',
  'Artigo': 'tabler-file-text',
  'Vídeo': 'tabler-video',
  'Documento': 'tabler-file-description',
  'Imagem': 'tabler-photo',
  'default': 'tabler-file'
}

const tipoColors: Record<string, ThemeColor> = {
  'Notícia': 'error',
  'Artigo': 'primary',
  'Vídeo': 'success',
  'Documento': 'info',
  'Imagem': 'warning',
  'default': 'secondary'
}

const renderTabs = (value: string, tabData: TabType[]) => {
  return tabData.map((item, index) => (
    <Tab
      key={index}
      value={item.type}
      className='mie-4'
      label={
        <div
          className={classnames(
            'flex flex-col items-center justify-center gap-2 is-[110px] bs-[100px] border rounded-xl',
            item.type === value ? 'border-solid border-[var(--mui-palette-primary-main)]' : 'border-dashed'
          )}
        >
          <CustomAvatar
            variant='rounded'
            skin='light'
            size={38}
            {...(item.type === value && { color: item.color })}
          >
            <i className={classnames('text-[22px]', { 'text-textSecondary': item.type !== value }, item.avatarIcon)} />
          </CustomAvatar>
          <Typography className='font-medium capitalize' color='text.primary'>
            {item.label}
          </Typography>
        </div>
      }
    />
  ))
}

const renderTabPanels = (value: string, tabData: TabType[], theme: Theme, options: ApexOptions, colors: string[]) => {
  return tabData.map((item, index) => {
    const max = Math.max(...((item.series[0] as ApexChartSeriesData).data as number[]))
    const seriesIndex = ((item.series[0] as ApexChartSeriesData).data as number[]).indexOf(max)

    const finalColors = colors.map((color, i) => (seriesIndex === i ? 'var(--mui-palette-primary-main)' : color))

    return (
      <TabPanel key={index} value={item.type} className='!p-0'>
        <AppReactApexCharts
          type='bar'
          height={230}
          width='100%'
          options={{ ...options, colors: finalColors }}
          series={item.series}
        />
      </TabPanel>
    )
  })
}

const VisualizacoesPorTipo = () => {
  // States
  const [loading, setLoading] = useState(true)
  const [tabData, setTabData] = useState<TabType[]>([])
  const [value, setValue] = useState<string>('')

  // Hooks
  const theme = useTheme()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await conteudosAPI.getDashboardStatistics()
        const maisVisualizados = response.maisVisualizados || []

        // Group by type and aggregate monthly data (mock monthly data for now)
        const tipoMap = new Map<string, number[]>()

        maisVisualizados.forEach((item: any) => {
          const tipo = item.tipo_conteudo_nome
          const views = item.visualizacoes

          if (!tipoMap.has(tipo)) {
            // Generate mock monthly data based on total views
            const monthlyData = Array(9)
              .fill(0)
              .map(() => Math.floor(Math.random() * (views / 3)) + 5)
            tipoMap.set(tipo, monthlyData)
          }
        })

        // Convert to tab data format
        const tabs: TabType[] = Array.from(tipoMap.entries()).map(([tipo, data]) => ({
          type: tipo.toLowerCase().replace(/\s+/g, '_'),
          label: tipo,
          avatarIcon: tipoIcons[tipo] || tipoIcons.default,
          color: tipoColors[tipo] || tipoColors.default,
          series: [{ data }]
        }))

        setTabData(tabs)
        if (tabs.length > 0) {
          setValue(tabs[0].type)
        }
      } catch (error) {
        console.error('Erro:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Vars
  const disabledText = 'var(--mui-palette-text-disabled)'

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const colors = Array(9).fill('var(--mui-palette-primary-lightOpacity)')

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        distributed: true,
        columnWidth: '33%',
        borderRadiusApplication: 'end',
        dataLabels: { position: 'top' }
      }
    },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: {
      offsetY: -11,
      formatter: val => `${val}`,
      style: {
        fontWeight: 500,
        colors: ['var(--mui-palette-text-primary)'],
        fontSize: theme.typography.body1.fontSize as string
      }
    },
    colors,
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    grid: {
      show: false,
      padding: {
        top: -19,
        left: -4,
        right: 0,
        bottom: -11
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { color: 'var(--mui-palette-divider)' },
      categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'],
      labels: {
        style: {
          colors: disabledText,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize as string
        }
      }
    },
    yaxis: {
      labels: {
        offsetX: -18,
        formatter: val => `${val}`,
        style: {
          colors: disabledText,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize as string
        }
      }
    },
    responsive: [
      {
        breakpoint: 1450,
        options: {
          plotOptions: {
            bar: { columnWidth: '45%' }
          }
        }
      },
      {
        breakpoint: 600,
        options: {
          dataLabels: {
            style: {
              fontSize: theme.typography.body2.fontSize as string
            }
          },
          plotOptions: {
            bar: { columnWidth: '58%' }
          }
        }
      },
      {
        breakpoint: 500,
        options: {
          plotOptions: {
            bar: { columnWidth: '70%' }
          }
        }
      }
    ]
  }

  if (loading) {
    return (
      <Card className='flex items-center justify-center p-10'>
        <CircularProgress />
      </Card>
    )
  }

  if (tabData.length === 0) {
    return (
      <Card>
        <CardHeader title='Relatório de Visualizações' subheader='Visualizações Anuais por Tipo' />
        <CardContent>
          <Typography>Sem dados disponíveis</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader
        title='Relatório de Visualizações'
        subheader='Visualizações Anuais por Tipo'
        action={<OptionMenu options={['Última Semana', 'Último Mês', 'Último Ano']} />}
      />
      <CardContent>
        <TabContext value={value}>
          <TabList
            variant='scrollable'
            scrollButtons='auto'
            onChange={handleChange}
            aria-label='earning report tabs'
            className='!border-0 mbe-10'
            sx={{
              '& .MuiTabs-indicator': { display: 'none !important' },
              '& .MuiTab-root': { padding: '0 !important', border: '0 !important' }
            }}
          >
            {renderTabs(value, tabData)}
            <Tab
              disabled
              value='add'
              label={
                <div className='flex flex-col items-center justify-center is-[110px] bs-[100px] border border-dashed rounded-xl'>
                  <CustomAvatar variant='rounded' size={34}>
                    <i className='tabler-plus text-textSecondary' />
                  </CustomAvatar>
                </div>
              }
            />
          </TabList>
          {renderTabPanels(value, tabData, theme, options, colors)}
        </TabContext>
      </CardContent>
    </Card>
  )
}

export default VisualizacoesPorTipo
