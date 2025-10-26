'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import classnames from 'classnames'

import { ticketsAPI } from '@/libs/api/suporte'
import type { Ticket, PrioridadeTicket, StatusTicket } from '@/libs/api/suporte/types'
import { useAuth } from '@/contexts/AuthProvider'
import { getLocalizedUrl } from '@/utils/i18n'
import { useParams } from 'next/navigation'
import type { Locale } from '@/configs/i18n'
import SLABadge from '@components/SLABadge'

// Styles Imports
import styles from '../kanban/styles.module.css'

type ColumnType = {
  prioridade: PrioridadeTicket
  title: string
  color: 'success' | 'warning' | 'error'
}

const TicketsKanban = () => {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [menuOpen, setMenuOpen] = useState<number | null>(null)
  const { user } = useAuth()
  const router = useRouter()
  const { lang: locale } = useParams()

  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    const fetchTickets = async () => {
      try {
        const data = await ticketsAPI.list({
          atribuido_id: user.id
        })

        setTickets(Array.isArray(data) ? data : data.data)
      } catch (error) {
        console.error('Erro ao carregar tickets:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [user?.id])

  const statusColorMap: Record<
    StatusTicket,
    'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
  > = {
    aberto: 'info',
    em_progresso: 'warning',
    aguardando_cliente: 'secondary',
    aguardando_terceiros: 'secondary',
    resolvido: 'success',
    fechado: 'default',
    cancelado: 'error'
  }

  const statusLabelMap: Record<StatusTicket, string> = {
    aberto: 'Aberto',
    em_progresso: 'Em Progresso',
    aguardando_cliente: 'Aguardando Cliente',
    aguardando_terceiros: 'Aguardando Terceiros',
    resolvido: 'Resolvido',
    fechado: 'Fechado',
    cancelado: 'Cancelado'
  }

  const columns: ColumnType[] = [
    { prioridade: 'baixa' as PrioridadeTicket, title: 'Baixa', color: 'success' },
    { prioridade: 'media' as PrioridadeTicket, title: 'Média', color: 'warning' },
    { prioridade: 'alta' as PrioridadeTicket, title: 'Alta', color: 'error' },
    { prioridade: 'urgente' as PrioridadeTicket, title: 'Urgente', color: 'error' }
  ]

  const getTicketsByPriority = (prioridade: PrioridadeTicket) => {
    return tickets.filter(ticket => ticket.prioridade === prioridade)
  }

  const handleTicketClick = (ticketId: number) => {
    router.push(getLocalizedUrl(`/apps/suporte/tickets/edit/${ticketId}`, locale as Locale))
  }

  const handleMenuClick = (e: React.MouseEvent<HTMLElement>, ticketId: number) => {
    e.stopPropagation()
    setMenuOpen(ticketId)
    setAnchorEl(e.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setMenuOpen(null)
  }

  const handleMarcarConcluido = async (ticket: Ticket) => {
    handleMenuClose()
    try {
      await ticketsAPI.update(ticket.id, {
        ...ticket,
        status: 'resolvido'
      })
      // Refresh tickets
      const data = await ticketsAPI.list({ atribuido_id: user.id })
      setTickets(Array.isArray(data) ? data : data.data)
    } catch (error) {
      console.error('Erro ao marcar ticket como concluído:', error)
    }
  }

  const handleRegistarIntervencao = (ticketId: number) => {
    handleMenuClose()
    router.push(getLocalizedUrl(`/apps/suporte/intervencoes/create?ticket_id=${ticketId}`, locale as Locale))
  }

  const handleEditarTicket = (ticketId: number) => {
    handleMenuClose()
    router.push(getLocalizedUrl(`/apps/suporte/tickets/edit/${ticketId}`, locale as Locale))
  }

  const handleContactarSolicitador = (ticket: Ticket) => {
    handleMenuClose()
    if (ticket.solicitante_email) {
      window.location.href = `mailto:${ticket.solicitante_email}?subject=Ticket ${ticket.numero_ticket}: ${ticket.titulo}`
    }
  }

  if (loading) {
    return <Typography>A carregar...</Typography>
  }

  return (
    <div className='flex items-start gap-6'>
      {columns.map(column => {
        const columnTickets = getTicketsByPriority(column.prioridade)

        return (
          <div key={column.prioridade} className='flex flex-col is-[16.5rem]'>
            <div
              className={classnames(
                'flex items-center justify-between is-[16.5rem] bs-[2.125rem] mbe-4',
                styles.kanbanColumn
              )}
            >
              <Typography variant='h5' noWrap className='max-is-[80%]'>
                {column.title}
              </Typography>
              <Chip label={columnTickets.length} size='small' color={column.color} />
            </div>

            {columnTickets.length === 0 ? (
              <Typography variant='body2' color='text.secondary' className='text-center pli-4 plb-8'>
                Sem tickets
              </Typography>
            ) : (
              columnTickets.map(ticket => (
                <Card
                  key={ticket.id}
                  className={classnames('is-[16.5rem] cursor-pointer overflow-visible mbe-4', styles.card)}
                  onClick={() => handleTicketClick(ticket.id)}
                >
                  <CardContent className='flex flex-col gap-y-2 items-start relative overflow-hidden'>
                    <div className='absolute block-start-4 inline-end-3' onClick={e => e.stopPropagation()}>
                      <IconButton
                        aria-label='more'
                        size='small'
                        className={classnames(styles.menu, {
                          [styles.menuOpen]: menuOpen === ticket.id
                        })}
                        onClick={e => handleMenuClick(e, ticket.id)}
                      >
                        <i className='tabler-dots-vertical' />
                      </IconButton>
                    </div>

                    <div className='flex flex-wrap items-center justify-start gap-2 is-full max-is-[85%]'>
                      <Chip
                        variant='tonal'
                        label={statusLabelMap[ticket.status]}
                        size='small'
                        color={statusColorMap[ticket.status]}
                      />
                      {ticket.sla_status && (
                        <SLABadge
                          slaStatus={ticket.sla_status}
                          tempoRestanteMinutos={ticket.sla_tempo_restante_minutos}
                          slaHoras={ticket.sla_horas}
                        />
                      )}
                    </div>

                    <Typography variant='body2' color='text.secondary'>
                      {ticket.numero_ticket}
                    </Typography>

                    <Typography color='text.primary' className='max-is-[85%] break-words font-medium'>
                      {ticket.titulo}
                    </Typography>

                    {ticket.descricao && (
                      <Typography variant='body2' color='text.secondary' className='line-clamp-2'>
                        {ticket.descricao}
                      </Typography>
                    )}

                    <div className='flex flex-col gap-2 is-full mbs-2'>
                      {ticket.tipo_ticket_nome && (
                        <div className='flex items-center gap-1'>
                          <i className='tabler-tag text-base text-textSecondary' />
                          <Typography variant='body2' color='text.secondary'>
                            {ticket.tipo_ticket_nome}
                          </Typography>
                        </div>
                      )}

                      {ticket.atribuido_nome && (
                        <div className='flex items-center gap-1'>
                          <i className='tabler-user text-base text-textSecondary' />
                          <Typography variant='body2' color='text.secondary'>
                            {ticket.atribuido_nome}
                          </Typography>
                        </div>
                      )}

                      {ticket.equipamento_nome && (
                        <div className='flex items-center gap-1'>
                          <i className='tabler-device-laptop text-base text-textSecondary' />
                          <Typography variant='body2' color='text.secondary'>
                            {ticket.equipamento_nome}
                          </Typography>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )
      })}

      <Menu
        id='ticket-menu'
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {menuOpen && tickets.find(t => t.id === menuOpen) && (
          <>
            <MenuItem
              onClick={() => {
                const ticket = tickets.find(t => t.id === menuOpen)
                if (ticket) handleMarcarConcluido(ticket)
              }}
            >
              <i className='tabler-check mie-2' />
              Marcar como Concluído
            </MenuItem>
            <MenuItem onClick={() => menuOpen && handleRegistarIntervencao(menuOpen)}>
              <i className='tabler-tool mie-2' />
              Registar Intervenção
            </MenuItem>
            <MenuItem onClick={() => menuOpen && handleEditarTicket(menuOpen)}>
              <i className='tabler-pencil mie-2' />
              Editar Ticket
            </MenuItem>
            {tickets.find(t => t.id === menuOpen)?.solicitante_email && (
              <MenuItem
                onClick={() => {
                  const ticket = tickets.find(t => t.id === menuOpen)
                  if (ticket) handleContactarSolicitador(ticket)
                }}
              >
                <i className='tabler-mail mie-2' />
                Contactar Solicitador
              </MenuItem>
            )}
          </>
        )}
      </Menu>
    </div>
  )
}

export default TicketsKanban
