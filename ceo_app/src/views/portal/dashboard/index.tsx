'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'

// Component Imports
import { portalAPI } from '@/libs/api/portal'
import type { PortalDashboardStats } from '@/libs/api/portal'
import CustomAvatar from '@core/components/mui/Avatar'
import NewsCarousel from '../NewsCarousel'

const PortalDashboard = () => {
  const [stats, setStats] = useState<PortalDashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await portalAPI.getDashboard()
        setStats(data)
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'baixa':
        return 'success'
      case 'media':
        return 'warning'
      case 'alta':
        return 'error'
      case 'urgente':
        return 'error'
      default:
        return 'default'
    }
  }

  const getSLAColor = (slaStatus: string) => {
    switch (slaStatus) {
      case 'ok':
        return 'success'
      case 'warning':
        return 'warning'
      case 'overdue':
        return 'error'
      default:
        return 'default'
    }
  }

  if (loading) {
    return <Typography>Carregando...</Typography>
  }

  if (!stats) {
    return <Typography>Erro ao carregar dashboard</Typography>
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Typography variant='h4'>Portal do Cliente</Typography>
        <Typography variant='body2' color='text.secondary'>
          Bem-vindo ao portal de suporte
        </Typography>
      </Grid>

      {/* News Carousel - Central Banner */}
      <Grid size={{ xs: 12 }}>
        <NewsCarousel />
      </Grid>

      {/* Statistics Cards */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <CustomAvatar color='primary' variant='rounded'>
                <i className='tabler-ticket' />
              </CustomAvatar>
              <Typography variant='h4'>{stats.totalTickets}</Typography>
            </div>
            <Typography variant='body2'>Total de Tickets</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <CustomAvatar color='warning' variant='rounded'>
                <i className='tabler-clock' />
              </CustomAvatar>
              <Typography variant='h4'>{stats.ticketsAbertos}</Typography>
            </div>
            <Typography variant='body2'>Tickets Abertos</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <CustomAvatar color='info' variant='rounded'>
                <i className='tabler-reload' />
              </CustomAvatar>
              <Typography variant='h4'>{stats.ticketsEmProgresso}</Typography>
            </div>
            <Typography variant='body2'>Em Progresso</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <CustomAvatar color='success' variant='rounded'>
                <i className='tabler-check' />
              </CustomAvatar>
              <Typography variant='h4'>{stats.ticketsConcluidos}</Typography>
            </div>
            <Typography variant='body2'>Concluídos</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Últimos Tickets */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader
            title='Últimos Tickets'
            action={
              <Button variant='contained' href='/apps/portal/tickets'>
                Ver Todos
              </Button>
            }
          />
          <CardContent>
            {stats.ultimosTickets && stats.ultimosTickets.length > 0 ? (
              <div className='flex flex-col gap-4'>
                {stats.ultimosTickets.map(ticket => (
                  <div key={ticket.id} className='flex items-center justify-between p-4 border rounded'>
                    <div className='flex flex-col gap-2'>
                      <div className='flex items-center gap-2'>
                        <Typography variant='body1' fontWeight='bold'>
                          #{ticket.numero_ticket}
                        </Typography>
                        <Chip
                          label={ticket.prioridade.toUpperCase()}
                          color={getPrioridadeColor(ticket.prioridade)}
                          size='small'
                        />
                        <Chip label={ticket.status} size='small' variant='outlined' />
                      </div>
                      <Typography variant='body2'>{ticket.assunto}</Typography>
                      <div className='flex items-center gap-2'>
                        <Typography variant='caption' color='text.secondary'>
                          {ticket.tipo_ticket_nome}
                        </Typography>
                        {ticket.sla_status && (
                          <Chip
                            label={ticket.sla_status === 'ok' ? 'Dentro do SLA' : ticket.sla_status === 'warning' ? 'Atenção' : 'Atrasado'}
                            color={getSLAColor(ticket.sla_status)}
                            size='small'
                          />
                        )}
                      </div>
                    </div>
                    <Button size='small' href={`/apps/portal/tickets/${ticket.id}`}>
                      Ver Detalhes
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <Typography variant='body2' color='text.secondary'>
                Nenhum ticket encontrado
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default PortalDashboard
