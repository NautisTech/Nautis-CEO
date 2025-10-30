'use client'

// React Imports
import { useEffect, useState } from 'react'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import LinearProgress from '@mui/material/LinearProgress'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import MuiTimeline from '@mui/lab/Timeline'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import type { TimelineProps } from '@mui/lab/Timeline'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import CardStatsHorizontalWithAvatar from '@components/card-statistics/HorizontalWithAvatar'
import ConteudosPorTipo from '@views/apps/conteudos/dashboard/ConteudosPorTipo'
import GruposMaisUtilizadores from '@views/apps/admin/dashboard/GruposMaisUtilizadores'
import PermissoesPorModulo from '@views/apps/admin/dashboard/PermissoesPorModulo'

// API Imports
import { conteudosAPI } from '@/libs/api/conteudos/api'
import { usersAPI } from '@/libs/api/users/api'
import { getDictionary } from '@/utils/getDictionary'
import { useDateFormatter } from '@/hooks/useDateFormatter'

// Type Imports
import type { ThemeColor } from '@core/types'

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

const HomeDashboard = ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) => {
  const [loading, setLoading] = useState(true)
  const [conteudosData, setConteudosData] = useState<any>(null)
  const [adminData, setAdminData] = useState<any>(null)
  const { formatDateShort } = useDateFormatter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Buscar dados em paralelo
        const [conteudos, admin] = await Promise.all([
          conteudosAPI.getDashboardStatistics().catch(() => null),
          usersAPI.getDashboardStatistics().catch(() => null)
        ])

        setConteudosData(conteudos)
        setAdminData(admin)
      } catch (error) {
        console.error(dictionary['dashboards']?.errorLoading, error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Locale from route params (app-router style)
  const { lang: locale } = useParams() as { lang?: string }

  if (loading) {
    return (
      <Card className='flex items-center justify-center p-20'>
        <CircularProgress size={60} />
        <Typography className='mli-4' variant='h6'>{dictionary['dashboards']?.loading}</Typography>
      </Card>
    )
  }

  // Cards de estatísticas principais
  const mainStats: Array<{ icon: string; stats: string; title: string; color: ThemeColor }> = []

  if (conteudosData) {
    mainStats.push(
      {
        stats: String(conteudosData.estatisticasGerais?.total_conteudos || 0),
        title: dictionary['dashboards']?.main.mainStats?.content,
        color: 'primary',
        icon: 'tabler-file-text'
      },
      {
        stats: String(conteudosData.estatisticasGerais?.total_visualizacoes || 0),
        title: dictionary['dashboards']?.main.mainStats?.views,
        color: 'info',
        icon: 'tabler-eye'
      }
    )
  }

  if (adminData) {
    mainStats.push(
      {
        stats: String(adminData.estatisticasUtilizadores?.total_utilizadores || 0),
        title: dictionary['dashboards']?.main.mainStats?.users,
        color: 'success',
        icon: 'tabler-users'
      },
      {
        stats: String(adminData.estatisticasGrupos?.total_grupos || 0),
        title: dictionary['dashboards']?.main.mainStats?.groups,
        color: 'warning',
        icon: 'tabler-users-group'
      }
    )
  }

  return (
    <Grid container spacing={6}>
      {/* Welcome Congratulations Card */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Card className='bs-full'>
          <CardContent className='relative'>
            <Typography variant='h5' className='mbe-0.5'>
              {dictionary['dashboards']?.main.title}
            </Typography>
            <Typography variant='subtitle1' className='mbe-3'>
              {dictionary['dashboards']?.main.subtitle}
            </Typography>
            <Typography variant='h4' color='primary.main' className='mbe-1'>
              {dictionary['dashboards']?.main.totalContent.replace('{{count}}', String(conteudosData?.estatisticasGerais?.total_conteudos || 0))}
            </Typography>
            <Button
              variant='contained'
              size='small'
              color='primary'
              component={Link}
              href={getLocalizedUrl('/dashboards/conteudos', (locale as Locale) || 'pt')}
            >
              {dictionary['dashboards']?.main.seeDashboard}
            </Button>
            <img
              alt='Congratulations'
              src='/images/illustrations/characters/8.png'
              className='absolute block-end-0 max-bs-[150px] is-[116px] inline-end-6'
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Main Statistics Card - StatisticsCard Style */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Card className='bs-full'>
          <CardHeader
            title={dictionary['dashboards']?.main.mainStats?.title}
            action={
              <Typography variant='subtitle2' color='text.disabled'>
                {dictionary['dashboards']?.main.mainStats.updatedNow}
              </Typography>
            }
          />
          <CardContent className='flex justify-between flex-wrap gap-4'>
            <Grid container spacing={4} flex={1}>
              {mainStats.map((item, index) => (
                <Grid size={{ xs: 6, md: 3 }} key={index} className='flex gap-4 items-center'>
                  <CustomAvatar color={item.color} variant='rounded' size={40} skin='light'>
                    <i className={item.icon}></i>
                  </CustomAvatar>
                  <div>
                    <Typography variant='h5'>{item.stats}</Typography>
                    <Typography variant='body2'>{item.title}</Typography>
                  </div>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Conteúdos por Tipo - Use dashboard component */}
      <Grid size={{ xs: 12, md: 6 }}>
        <ConteudosPorTipo dictionary={dictionary} />
      </Grid>

      {/* Grupos Principais - Use dashboard component */}
      <Grid size={{ xs: 12, md: 6 }}>
        <GruposMaisUtilizadores dictionary={dictionary} />
      </Grid>

      {/* Permissões por Módulo - Use dashboard component */}
      <Grid size={{ xs: 12 }}>
        <PermissoesPorModulo dictionary={dictionary} />
      </Grid>

      {/* Atividade Recente - Timeline Style */}
      {conteudosData?.atividadeRecente && (
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader
              avatar={<i className='tabler-list-details text-xl' />}
              title={dictionary['dashboards']?.conteudos.recentActivity.title}
              titleTypographyProps={{ variant: 'h5' }}
              sx={{ '& .MuiCardHeader-avatar': { mr: 3 } }}
            />
            <CardContent className='flex flex-col gap-6 pbe-5'>
              <Timeline>
                {conteudosData.atividadeRecente.slice(0, 5).map((item: any, idx: number) => {
                  const statusColors: Record<string, ThemeColor> = {
                    rascunho: 'secondary',
                    publicado: 'success',
                    arquivado: 'error',
                    agendado: 'warning',
                    em_revisao: 'info'
                  }

                  const statusTranslations: Record<string, string> = {
                    rascunho: dictionary['conteudos']?.filter?.status?.draft || 'Rascunho',
                    publicado: dictionary['conteudos']?.filter?.status?.published || 'Publicado',
                    arquivado: dictionary['conteudos']?.filter?.status?.archived || 'Arquivado',
                    agendado: dictionary['conteudos']?.filter?.status?.scheduled || 'Agendado',
                    em_revisao: dictionary['conteudos']?.filter?.status?.underReview || 'Em Revisão',
                    rejeitado: dictionary['conteudos']?.filter?.status?.rejected || 'Rejeitado'
                  }

                  return (
                    <TimelineItem key={idx}>
                      <TimelineSeparator>
                        <TimelineDot color={statusColors[item.status] || 'primary'} />
                        {idx < conteudosData.atividadeRecente.slice(0, 5).length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent>
                        <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                          <Typography className='font-medium' color='text.primary'>
                            {item.titulo}
                          </Typography>
                          <Typography variant='caption'>
                            {formatDateShort(item.criado_em)}
                          </Typography>
                        </div>
                        <Typography className='mbe-2'>
                          {item.tipo_conteudo_nome} • {item.autor_nome}
                        </Typography>
                        <Chip
                          label={statusTranslations[item.status] || item.status}
                          size='small'
                          color={statusColors[item.status] || 'default'}
                          variant='tonal'
                        />
                      </TimelineContent>
                    </TimelineItem>
                  )
                })}
              </Timeline>
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Utilizadores Recentes - List Style */}
      {adminData?.utilizadoresRecentes && (
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader
              title={dictionary['dashboards']?.admin?.recentUsers?.title}
            />
            <CardContent>
              <div className='flex flex-col gap-4'>
                {adminData.utilizadoresRecentes.slice(0, 5).map((user: any, idx: number) => (
                  <div key={idx} className='flex justify-between items-center gap-3'>
                    <div className='flex items-center gap-3 flex-1 min-w-0'>
                      <Avatar src={user.foto_url} alt={user.username} className='is-10 bs-10'>
                        {user.username?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      <div className='flex-1 min-w-0'>
                        <Typography variant='body2' fontWeight={600} className='truncate'>
                          {user.username}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {formatDateShort(user.criado_em)}
                        </Typography>
                      </div>
                    </div>
                    <Chip
                      label={user.ativo ? dictionary['dashboards']?.admin?.recentUsers?.active : dictionary['dashboards']?.admin?.recentUsers?.inactive}
                      size='small'
                      color={user.ativo ? 'success' : 'error'}
                      variant='tonal'
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  )
}

export default HomeDashboard
