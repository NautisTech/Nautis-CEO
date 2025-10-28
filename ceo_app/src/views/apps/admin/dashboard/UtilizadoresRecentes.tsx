'use client'

import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import CircularProgress from '@mui/material/CircularProgress'
import { styled } from '@mui/material/styles'
import MuiTimeline from '@mui/lab/Timeline'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import type { TimelineProps } from '@mui/lab/Timeline'
import OptionMenu from '@core/components/option-menu'
import { usersAPI } from '@/libs/api/users/api'
import { getDictionary } from '@/utils/getDictionary'
import { formatDateLong } from '@/utils/dateFormatter'
import type { Locale } from '@configs/i18n'

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

const UtilizadoresRecentes = ({ dictionary, lang }: { dictionary: Awaited<ReturnType<typeof getDictionary>>, lang: Locale }) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await usersAPI.getDashboardStatistics()
        setData(response.utilizadoresRecentes || [])
      } catch (error) {
        console.error(dictionary['dashboards'].admin.errorLoadingStats, error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getTimeDiff = (date: string) => {
    const now = new Date()
    const created = new Date(date)
    const diffInMs = now.getTime() - created.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return dictionary['dashboards']?.admin.recentUsers.timeDiff.today
    if (diffInDays === 1) return dictionary['dashboards']?.admin.recentUsers.timeDiff.yesterday
    if (diffInDays < 7) return dictionary['dashboards']?.admin.recentUsers.timeDiff.days.replace("{{count}}", diffInDays.toString())
    if (diffInDays < 30) return dictionary['dashboards']?.admin.recentUsers.timeDiff.weeks.replace("{{count}}", (diffInDays / 7).toString())
    return dictionary['dashboards']?.admin.recentUsers.timeDiff.months.replace("{{count}}", Math.round(diffInDays / 30).toString())
  }

  if (loading) return <Card className='flex items-center justify-center p-10'><CircularProgress /></Card>

  return (
    <Card>
      <CardHeader
        avatar={<i className='tabler-users text-xl' />}
        title={dictionary['dashboards']?.admin.recentUsers.title || 'Utilizadores Recentes'}
        titleTypographyProps={{ variant: 'h5' }}
        action={<OptionMenu options={['Atualizar', 'Ver todos', 'Exportar']} />}
        sx={{ '& .MuiCardHeader-avatar': { mr: 3 } }}
      />
      <CardContent className='flex flex-col gap-6 pbe-5'>
        <Timeline>
          {data.slice(0, 5).map((user, idx) => (
            <TimelineItem key={idx}>
              <TimelineSeparator>
                <TimelineDot color={user.ativo ? 'success' : 'error'} />
                {idx < data.slice(0, 5).length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                  <Typography className='font-medium' color='text.primary'>
                    {dictionary['dashboards']?.admin.recentUsers.newUser || 'Novo utilizador registado'}
                  </Typography>
                  <Typography variant='caption'>{getTimeDiff(user.criado_em)}</Typography>
                </div>
                <Typography className='mbe-2'>
                  {user.ativo ? dictionary['dashboards']?.admin.recentUsers.activeVerified : dictionary['dashboards']?.admin.recentUsers.inactiveUnverified}
                </Typography>
                <div className='flex items-center gap-2.5'>
                  <Avatar src={user.foto_url} alt={user.username} className='is-8 bs-8'>
                    {user.username?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <div className='flex flex-col flex-wrap'>
                    <Typography variant='body2' className='font-medium'>
                      {user.username}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {formatDateLong(user.criado_em, lang)}
                    </Typography>
                  </div>
                </div>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  )
}

export default UtilizadoresRecentes
