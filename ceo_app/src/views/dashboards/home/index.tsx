'use client'

// React Imports
import { useEffect, useState } from 'react'

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

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// API Imports
import { conteudosAPI } from '@/libs/api/conteudos/api'
import { usersAPI } from '@/libs/api/users/api'

// Type Imports
import type { ThemeColor } from '@core/types'

const HomeDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [conteudosData, setConteudosData] = useState<any>(null)
  const [adminData, setAdminData] = useState<any>(null)

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
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Card className='flex items-center justify-center p-20'>
        <CircularProgress size={60} />
        <Typography className='mli-4' variant='h6'>A carregar dashboard...</Typography>
      </Card>
    )
  }

  // Cards de estatísticas principais
  const mainStats: Array<{ icon: string; stats: number; title: string; color: ThemeColor; subtitle: string }> = []

  if (conteudosData) {
    mainStats.push(
      {
        stats: conteudosData.estatisticasGerais?.total_conteudos || 0,
        title: 'Total Conteúdos',
        subtitle: `${conteudosData.estatisticasGerais?.conteudos_publicados || 0} publicados`,
        color: 'primary',
        icon: 'tabler-file-text'
      },
      {
        stats: conteudosData.estatisticasGerais?.total_visualizacoes || 0,
        title: 'Visualizações',
        subtitle: 'Total acumulado',
        color: 'info',
        icon: 'tabler-eye'
      }
    )
  }

  if (adminData) {
    mainStats.push(
      {
        stats: adminData.estatisticasUtilizadores?.total_utilizadores || 0,
        title: 'Utilizadores',
        subtitle: `${adminData.estatisticasUtilizadores?.utilizadores_ativos || 0} ativos`,
        color: 'success',
        icon: 'tabler-users'
      },
      {
        stats: adminData.estatisticasGrupos?.total_grupos || 0,
        title: 'Grupos',
        subtitle: `${adminData.estatisticasGrupos?.grupos_ativos || 0} ativos`,
        color: 'warning',
        icon: 'tabler-users-group'
      }
    )
  }

  return (
    <Grid container spacing={6}>
      {/* Welcome Card */}
      <Grid size={{ xs: 12 }}>
        <Card className='relative overflow-visible'>
          <CardContent className='flex items-center justify-between'>
            <div>
              <Typography variant='h4' className='mb-2'>
                Bem-vindo ao Dashboard! 🎉
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                Aqui está uma visão geral das suas estatísticas principais
              </Typography>
            </div>
            <div className='flex items-center'>
              <CustomAvatar size={80} skin='light' color='primary'>
                <i className='tabler-chart-line text-[40px]' />
              </CustomAvatar>
            </div>
          </CardContent>
        </Card>
      </Grid>

      {/* Main Statistics Cards */}
      {mainStats.map((item, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent className='flex items-center gap-4'>
              <CustomAvatar color={item.color} variant='rounded' size={50} skin='light'>
                <i className={`${item.icon} text-[28px]`} />
              </CustomAvatar>
              <div className='flex flex-col flex-1'>
                <Typography variant='h4'>{item.stats}</Typography>
                <Typography variant='body2' fontWeight={600}>{item.title}</Typography>
                <Typography variant='caption' color='text.secondary'>{item.subtitle}</Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
      ))}

      {/* Conteúdos por Tipo */}
      {conteudosData?.estatisticasPorTipo && (
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader title='Conteúdos por Tipo' />
            <CardContent>
              <div className='flex flex-col gap-4'>
                {conteudosData.estatisticasPorTipo.slice(0, 5).map((tipo: any, idx: number) => (
                  <div key={idx} className='flex items-center justify-between gap-4'>
                    <div className='flex items-center gap-3 flex-1'>
                      <CustomAvatar size={38} skin='light' color='primary'>
                        <i className={tipo.icone || 'tabler-file-text'} />
                      </CustomAvatar>
                      <div className='flex-1'>
                        <Typography variant='body2' fontWeight={600}>{tipo.nome}</Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {tipo.publicados} publicados
                        </Typography>
                      </div>
                    </div>
                    <Typography variant='h6' color='primary'>{tipo.total_conteudos}</Typography>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Grupos Principais */}
      {adminData?.gruposMaisUtilizadores && (
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader title='Grupos Principais' />
            <CardContent>
              <div className='flex flex-col gap-4'>
                {adminData.gruposMaisUtilizadores.slice(0, 5).map((grupo: any, idx: number) => (
                  <div key={idx} className='flex justify-between items-center gap-4'>
                    <div className='flex-1'>
                      <Typography variant='body2' fontWeight={600}>{grupo.nome}</Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {grupo.total_permissoes} permissões
                      </Typography>
                    </div>
                    <Chip
                      label={`${grupo.total_utilizadores} users`}
                      size='small'
                      variant='tonal'
                      color='primary'
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Conteúdos Recentes */}
      {conteudosData?.atividadeRecente && (
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardHeader title='Atividade Recente - Conteúdos' />
            <CardContent>
              <div className='flex flex-col gap-4'>
                {conteudosData.atividadeRecente.slice(0, 5).map((item: any, idx: number) => {
                  const statusColors: Record<string, ThemeColor> = {
                    rascunho: 'secondary',
                    publicado: 'success',
                    arquivado: 'error',
                    agendado: 'warning',
                    em_revisao: 'info'
                  }

                  return (
                    <div key={idx} className='flex justify-between items-center gap-3'>
                      <div className='flex-1 min-w-0'>
                        <Typography variant='body2' fontWeight={600} className='truncate'>
                          {item.titulo}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {item.tipo_conteudo_nome} • {item.autor_nome}
                        </Typography>
                      </div>
                      <Chip
                        label={item.status}
                        size='small'
                        color={statusColors[item.status] || 'default'}
                      />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Utilizadores Recentes */}
      {adminData?.utilizadoresRecentes && (
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardHeader title='Utilizadores Recentes' />
            <CardContent>
              <div className='flex flex-col gap-4'>
                {adminData.utilizadoresRecentes.slice(0, 5).map((user: any, idx: number) => (
                  <div key={idx} className='flex justify-between items-center gap-3'>
                    <div className='flex items-center gap-3 flex-1 min-w-0'>
                      <Avatar src={user.foto_url} alt={user.username}>
                        {user.username?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      <div className='flex-1 min-w-0'>
                        <Typography variant='body2' fontWeight={600} className='truncate'>
                          {user.username}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {new Date(user.criado_em).toLocaleDateString('pt-PT')}
                        </Typography>
                      </div>
                    </div>
                    <Chip
                      label={user.ativo ? 'Ativo' : 'Inativo'}
                      size='small'
                      color={user.ativo ? 'success' : 'error'}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Permissões por Módulo */}
      {adminData?.permissoesPorModulo && (
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Permissões por Módulo' />
            <CardContent>
              <Grid container spacing={4}>
                {adminData.permissoesPorModulo.slice(0, 6).map((mod: any, idx: number) => {
                  const maxPermissoes = Math.max(
                    ...adminData.permissoesPorModulo.map((m: any) => m.total_permissoes)
                  )
                  const percentage = (mod.total_permissoes / maxPermissoes) * 100

                  return (
                    <Grid key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
                      <div>
                        <div className='flex justify-between items-center mb-2'>
                          <Typography variant='body2' fontWeight={600}>{mod.modulo}</Typography>
                          <Typography variant='body2' color='primary'>
                            {mod.total_permissoes}
                          </Typography>
                        </div>
                        <LinearProgress
                          variant='determinate'
                          value={percentage}
                          className='h-2 rounded'
                        />
                        <Typography variant='caption' color='text.secondary' className='mt-1'>
                          {mod.grupos_com_acesso} grupos com acesso
                        </Typography>
                      </div>
                    </Grid>
                  )
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  )
}

export default HomeDashboard
