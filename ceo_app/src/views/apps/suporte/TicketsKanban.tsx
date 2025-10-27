'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'

import { ticketsAPI } from '@/libs/api/suporte'
import type { Ticket, PrioridadeTicket, StatusTicket } from '@/libs/api/suporte/types'
import { useAuth } from '@/contexts/AuthProvider'
import { getLocalizedUrl } from '@/utils/i18n'
import { useParams } from 'next/navigation'
import type { Locale } from '@/configs/i18n'
import SLABadge from '@components/SLABadge'

type ColumnData = {
  prioridade: PrioridadeTicket
  title: string
  color: 'success' | 'warning' | 'error'
  tickets: Ticket[]
}

const TicketsKanban = () => {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [columns, setColumns] = useState<ColumnData[]>([])
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
        if (!user.funcionario_id) {
          setTickets([])
          setLoading(false)
          return
        }

        const data = await ticketsAPI.list({
          atribuido_id: user.funcionario_id
        })

        const ticketsData = Array.isArray(data) ? data : data.data
        setTickets(ticketsData)
      } catch (error) {
        console.error('Erro ao carregar tickets:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [user?.id, user?.funcionario_id])

  // Organize tickets into columns
  useEffect(() => {
    const columnDefinitions: Array<{ prioridade: PrioridadeTicket; title: string; color: 'success' | 'warning' | 'error' }> = [
      { prioridade: 'baixa', title: 'Baixa', color: 'success' },
      { prioridade: 'media', title: 'Média', color: 'warning' },
      { prioridade: 'alta', title: 'Alta', color: 'error' },
      { prioridade: 'urgente', title: 'Urgente', color: 'error' }
    ]

    const newColumns: ColumnData[] = columnDefinitions.map(def => ({
      ...def,
      tickets: tickets.filter(t => t.prioridade === def.prioridade)
    }))

    setColumns(newColumns)
  }, [tickets])

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

  const handleMenuClick = (e: React.MouseEvent<HTMLElement>, ticketId: number) => {
    e.stopPropagation()
    setMenuOpen(ticketId)
    setAnchorEl(e.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setMenuOpen(null)
  }

  const handleFecharTicket = async (ticketId: number) => {
    handleMenuClose()
    try {
      await ticketsAPI.fechar(ticketId)
      // Refresh tickets
      const data = await ticketsAPI.list({ atribuido_id: user.funcionario_id })
      setTickets(Array.isArray(data) ? data : data.data)
    } catch (error) {
      console.error('Erro ao fechar ticket:', error)
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

  if (!user?.funcionario_id) {
    return (
      <Card>
        <CardContent className='flex flex-col items-center gap-4 pbs-12 pbe-12'>
          <i className='tabler-user-x text-[64px] text-textDisabled' />
          <Typography variant='h6' color='text.primary'>
            Sem Funcionário Associado
          </Typography>
          <Typography variant='body2' color='text.secondary' className='text-center max-is-md'>
            O seu utilizador não tem um funcionário associado. Para ver os seus tickets atribuídos, é necessário:
          </Typography>
          <ol className='mbs-2 mbe-2 pis-6'>
            <li>
              <Typography variant='body2' color='text.secondary'>
                Ter um registo de funcionário criado
              </Typography>
            </li>
            <li>
              <Typography variant='body2' color='text.secondary'>
                Associar o utilizador ao funcionário
              </Typography>
            </li>
            <li>
              <Typography variant='body2' color='text.secondary'>
                Fazer logout e login novamente
              </Typography>
            </li>
          </ol>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='overflow-x-auto'>
      <div className='flex items-start gap-6 min-w-max'>
        {columns.map(column => (
          <div key={column.prioridade} className='flex flex-col is-[16.5rem]'>
            <div className='flex items-center justify-between is-[16.5rem] bs-[2.125rem] mbe-4'>
              <Typography variant='h5' noWrap className='max-is-[80%]'>
                {column.title}
              </Typography>
              <Chip label={column.tickets.length} size='small' color={column.color} />
            </div>

            {column.tickets.length === 0 ? (
              <Typography variant='body2' color='text.secondary' className='text-center pli-4 plb-8'>
                Sem tickets
              </Typography>
            ) : (
              column.tickets.map(ticket => (
                <Card key={ticket.id} className='is-[16.5rem] overflow-visible mbe-4'>
                  <CardContent className='flex flex-col gap-y-2 items-start relative overflow-hidden'>
                    <div className='absolute block-start-4 inline-end-3' onClick={e => e.stopPropagation()}>
                      <IconButton
                        aria-label='more'
                        size='small'
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
        ))}
      </div>

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
            <MenuItem onClick={() => menuOpen && handleFecharTicket(menuOpen)}>
              <i className='tabler-check mie-2' />
              Marcar como Fechado
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
