'use client'

import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import { styled } from '@mui/material/styles'
import MuiTimeline from '@mui/lab/Timeline'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import type { TimelineProps } from '@mui/lab/Timeline'
import CustomAvatar from '@core/components/mui/Avatar'
import { conteudosAPI } from '@/libs/api/conteudos/api'
import { getDictionary } from '@/utils/getDictionary'
import { formatDateShort } from '@/utils/dateFormatter'
import type { Locale } from '@configs/i18n'

const statusColors: any = {
  rascunho: 'secondary',
  publicado: 'success',
  arquivado: 'error',
  agendado: 'warning',
  em_revisao: 'info'
}

const statusIcons: any = {
  rascunho: 'tabler-file-pencil',
  publicado: 'tabler-circle-check',
  arquivado: 'tabler-archive',
  agendado: 'tabler-clock',
  em_revisao: 'tabler-file-search'
}

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})

const AtividadeRecente = ({ dictionary, lang }: { dictionary: Awaited<ReturnType<typeof getDictionary>>, lang: Locale }) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await conteudosAPI.getDashboardStatistics()
        setData(response.atividadeRecente || [])
      } catch (error) {
        console.error('Erro:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getTimeDiff = (date: string) => {
    const now = new Date()
    const updated = new Date(date)
    const diffInMs = now.getTime() - updated.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 60) return dictionary['dashboards']?.conteudos.recentActivity.timeDiff.minutes.replace("{{count}}", diffInMinutes.toString())
    if (diffInHours < 24) return dictionary['dashboards']?.conteudos.recentActivity.timeDiff.hours.replace("{{count}}", diffInHours.toString())
    if (diffInDays === 0) return dictionary['dashboards']?.conteudos.recentActivity.timeDiff.today
    if (diffInDays === 1) return dictionary['dashboards']?.conteudos.recentActivity.timeDiff.yesterday
    if (diffInDays < 7) return dictionary['dashboards']?.conteudos.recentActivity.timeDiff.days.replace("{{count}}", diffInDays.toString())
    return formatDateShort(date, lang)
  }

  if (loading) return <Card className='flex items-center justify-center p-10'><CircularProgress /></Card>

  return (
    <Card>
      <CardHeader
        avatar={<i className='tabler-activity text-xl' />}
        title={dictionary['dashboards']?.conteudos.recentActivity.title}
        titleTypographyProps={{ variant: 'h5' }}
        sx={{ '& .MuiCardHeader-avatar': { mr: 3 } }}
      />
      <CardContent className='flex flex-col gap-6 pbe-5'>
        <Timeline>
          {data.slice(0, 6).map((item, idx) => (
            <TimelineItem key={idx}>
              <TimelineSeparator>
                <TimelineDot color={statusColors[item.status] || 'primary'} />
                {idx < data.slice(0, 6).length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                  <Typography className='font-medium' color='text.primary'>
                    {item.titulo}
                  </Typography>
                  <Typography variant='caption'>{getTimeDiff(item.atualizado_em)}</Typography>
                </div>
                <Typography className='mbe-2'>
                  {item.tipo_conteudo_nome} • {item.autor_nome}
                </Typography>
                <div className='flex items-center gap-2.5'>
                  <CustomAvatar
                    skin='light'
                    variant='rounded'
                    color={statusColors[item.status] || 'primary'}
                    size={30}
                  >
                    <i className={statusIcons[item.status] || 'tabler-file'} />
                  </CustomAvatar>
                  <Chip
                    label={item.status}
                    size='small'
                    variant='tonal'
                    color={statusColors[item.status] || 'default'}
                  />
                </div>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  )
}

export default AtividadeRecente
