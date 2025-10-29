'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

// Next Imports
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Badge from '@mui/material/Badge'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

// Third-party Imports
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import classnames from 'classnames'

// Component Imports
import { portalAPI } from '@/libs/api/portal'
import type { PortalTicket } from '@/libs/api/portal'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import SLABadge from '@/components/SLABadge'
import CustomAvatar from '@core/components/mui/Avatar'

// Type Imports
import type { Locale } from '@configs/i18n'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Filter function
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const columnHelper = createColumnHelper<PortalTicket>()

const PortalTickets = () => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const [tickets, setTickets] = useState<PortalTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [prioridadeFilter, setPrioridadeFilter] = useState('')
  const [selectedTicket, setSelectedTicket] = useState<PortalTicket | null>(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [criarTicketModalOpen, setCriarTicketModalOpen] = useState(false)

  // Estados do formulário de criação
  const [novoTicket, setNovoTicket] = useState({
    tipo_ticket_id: '',
    assunto: '',
    descricao: '',
    prioridade: 'media' as 'baixa' | 'media' | 'alta' | 'urgente',
    localizacao: ''
  })
  const [criandoTicket, setCriandoTicket] = useState(false)
  const [erroForm, setErroForm] = useState<string | null>(null)
  const [tiposTicket, setTiposTicket] = useState<Array<{ id: number; nome: string }>>([])

  // Contar tickets com aprovações pendentes
  const ticketsComAprovacaoPendente = tickets.filter(t => t.precisa_aprovacao === true)

  const handleOpenDetails = (ticket: PortalTicket) => {
    setSelectedTicket(ticket)
    setDetailsModalOpen(true)
  }

  const handleCloseDetails = () => {
    setDetailsModalOpen(false)
    setSelectedTicket(null)
  }

  const handleViewIntervencoes = (ticketId: number) => {
    router.push(getLocalizedUrl(`/apps/portal/tickets/${ticketId}/intervencoes`, locale as Locale))
  }

  const handleOpenCriarTicket = () => {
    // Resetar formulário
    setNovoTicket({
      tipo_ticket_id: '',
      assunto: '',
      descricao: '',
      prioridade: 'media',
      localizacao: ''
    })
    setErroForm(null)
    setCriarTicketModalOpen(true)

    // Carregar tipos de ticket (mock - você deve buscar da API)
    setTiposTicket([
      { id: 1, nome: 'Suporte Técnico' },
      { id: 2, nome: 'Manutenção' },
      { id: 3, nome: 'Instalação' },
      { id: 4, nome: 'Outros' }
    ])
  }

  const handleCloseCriarTicket = () => {
    setCriarTicketModalOpen(false)
    setErroForm(null)
  }

  const handleCriarTicket = async () => {
    try {
      // Validação
      if (!novoTicket.tipo_ticket_id || !novoTicket.assunto || !novoTicket.descricao) {
        setErroForm('Por favor, preencha todos os campos obrigatórios')
        return
      }

      setCriandoTicket(true)
      setErroForm(null)

      await portalAPI.criarTicket({
        tipo_ticket_id: Number(novoTicket.tipo_ticket_id),
        assunto: novoTicket.assunto,
        descricao: novoTicket.descricao,
        prioridade: novoTicket.prioridade,
        localizacao: novoTicket.localizacao || undefined
      })

      // Recarregar lista de tickets
      const data = await portalAPI.listarTickets({
        status: statusFilter || undefined,
        prioridade: prioridadeFilter || undefined
      })
      setTickets(Array.isArray(data) ? data : [])

      handleCloseCriarTicket()
    } catch (error) {
      console.error('Erro ao criar ticket:', error)
      setErroForm('Erro ao criar ticket. Por favor, tente novamente.')
    } finally {
      setCriandoTicket(false)
    }
  }

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await portalAPI.listarTickets({
          status: statusFilter || undefined,
          prioridade: prioridadeFilter || undefined
        })
        setTickets(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Erro ao carregar tickets:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [statusFilter, prioridadeFilter])

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

  const columns = useMemo<ColumnDef<PortalTicket, any>[]>(
    () => [
      columnHelper.accessor('equipamento_numero', {
        header: 'Equipamento',
        cell: ({ row }) => {
          const hasApprovalPending = row.original.precisa_aprovacao === true
          return (
            <div className='flex items-center gap-2'>
              {hasApprovalPending && (
                <Tooltip title='Tem intervenções pendentes de aprovação'>
                  <Badge
                    color='warning'
                    variant='dot'
                    sx={{
                      '& .MuiBadge-badge': {
                        width: 12,
                        height: 12,
                        borderRadius: '50%'
                      }
                    }}
                  >
                    <i className='tabler-alert-circle text-warning' style={{ fontSize: '1.25rem' }} />
                  </Badge>
                </Tooltip>
              )}
              <div className='flex flex-col items-start'>
                <Typography className='font-medium' color='text.primary'>
                  {row.original.equipamento_numero || 'N/A'}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {row.original.numero_ticket}
                </Typography>
              </div>
            </div>
          )
        }
      }),
      columnHelper.accessor('assunto', {
        header: 'Assunto',
        cell: ({ row }) => (
          <div className='flex flex-col items-start'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.assunto}
            </Typography>
            {row.original.equipamento_nome && (
              <Typography variant='body2' color='text.secondary'>
                {row.original.equipamento_nome}
              </Typography>
            )}
          </div>
        )
      }),
      columnHelper.accessor('prioridade', {
        header: 'Prioridade',
        cell: ({ row }) => {
          const prioridadeLabels: Record<string, string> = {
            baixa: 'Baixa',
            media: 'Média',
            alta: 'Alta',
            urgente: 'Urgente'
          }
          return (
            <Chip
              label={prioridadeLabels[row.original.prioridade] || row.original.prioridade}
              color={getPrioridadeColor(row.original.prioridade)}
              size='small'
              variant='tonal'
            />
          )
        }
      }),
      columnHelper.accessor('status', {
        header: 'Estado',
        cell: ({ row }) => {
          const statusLabels: Record<string, string> = {
            aberto: 'Aberto',
            em_progresso: 'Em Progresso',
            aguardando: 'Aguardando',
            resolvido: 'Resolvido',
            fechado: 'Fechado',
            cancelado: 'Cancelado'
          }
          const statusColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
            aberto: 'info',
            em_progresso: 'primary',
            aguardando: 'warning',
            resolvido: 'success',
            fechado: 'default',
            cancelado: 'error'
          }
          return (
            <Chip
              label={statusLabels[row.original.status] || row.original.status}
              color={statusColors[row.original.status] || 'default'}
              size='small'
              variant='tonal'
            />
          )
        }
      }),
      columnHelper.accessor('atribuido_nome', {
        header: 'Atribuído a',
        cell: ({ row }) => {
          const nome = row.original.atribuido_nome || 'Não atribuído'
          return (
            <div className='flex items-center gap-3'>
              {row.original.atribuido_nome && (
                <CustomAvatar skin='light' color='primary' size={34}>
                  {nome.charAt(0)}
                </CustomAvatar>
              )}
              <Typography variant='body2'>{nome}</Typography>
            </div>
          )
        }
      }),
      columnHelper.accessor('criado_em', {
        header: 'Criado em',
        cell: ({ row }) => (
          <Typography variant='body2'>{new Date(row.original.criado_em).toLocaleDateString('pt-PT')}</Typography>
        )
      }),
      columnHelper.display({
        id: 'acoes',
        header: 'Ações',
        cell: ({ row }) => (
          <div className='flex items-center gap-1'>
            <Tooltip title='Ver detalhes'>
              <IconButton size='small' onClick={() => handleOpenDetails(row.original)}>
                <i className='tabler-eye text-textSecondary' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Ver intervenções'>
              <IconButton size='small' onClick={() => handleViewIntervencoes(row.original.id)}>
                <i className='tabler-tool text-textSecondary' />
              </IconButton>
            </Tooltip>
          </div>
        )
      })
    ],
    []
  )

  const table = useReactTable({
    data: tickets,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      globalFilter
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10
      }
    }
  })

  if (loading) {
    return <Typography>Carregando...</Typography>
  }

  return (
    <Card>
      <CardHeader
        title='Meus Tickets'
        action={
          <Button
            variant='contained'
            startIcon={<i className='tabler-plus' />}
            onClick={handleOpenCriarTicket}
          >
            Novo Ticket
          </Button>
        }
      />
      <CardContent>
        {ticketsComAprovacaoPendente.length > 0 && (
          <Card
            variant='outlined'
            sx={{
              mb: 4,
              borderColor: 'warning.main',
              bgcolor: 'warning.lighter'
            }}
          >
            <CardContent>
              <div className='flex items-center gap-3'>
                <Badge
                  badgeContent={ticketsComAprovacaoPendente.length}
                  color='warning'
                  max={99}
                >
                  <i className='tabler-alert-circle text-warning' style={{ fontSize: '2rem' }} />
                </Badge>
                <div className='flex-1'>
                  <Typography variant='h6' color='warning.main'>
                    Tickets com Intervenções por Aprovar
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {ticketsComAprovacaoPendente.length === 1
                      ? 'Existe 1 ticket com intervenções aguardando a sua aprovação'
                      : `Existem ${ticketsComAprovacaoPendente.length} tickets com intervenções aguardando a sua aprovação`}
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className='flex items-center gap-4 mb-4'>
          <TextField
            fullWidth
            size='small'
            placeholder='Pesquisar tickets...'
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
          />
          <TextField
            select
            size='small'
            label='Status'
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className='min-w-[150px]'
          >
            <MenuItem value=''>Todos</MenuItem>
            <MenuItem value='aberto'>Aberto</MenuItem>
            <MenuItem value='em_progresso'>Em Progresso</MenuItem>
            <MenuItem value='concluido'>Concluído</MenuItem>
            <MenuItem value='cancelado'>Cancelado</MenuItem>
          </TextField>
          <TextField
            select
            size='small'
            label='Prioridade'
            value={prioridadeFilter}
            onChange={e => setPrioridadeFilter(e.target.value)}
            className='min-w-[150px]'
          >
            <MenuItem value=''>Todas</MenuItem>
            <MenuItem value='baixa'>Baixa</MenuItem>
            <MenuItem value='media'>Média</MenuItem>
            <MenuItem value='alta'>Alta</MenuItem>
            <MenuItem value='urgente'>Urgente</MenuItem>
          </TextField>
        </div>

        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={classnames({
                            'flex items-center': header.column.getIsSorted(),
                            'cursor-pointer select-none': header.column.getCanSort()
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <i className='tabler-chevron-up text-xl' />,
                            desc: <i className='tabler-chevron-down text-xl' />
                          }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    <Typography>Nenhum ticket encontrado</Typography>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePaginationComponent table={table} />
      </CardContent>

      {/* Modal de Criação de Ticket */}
      <Dialog open={criarTicketModalOpen} onClose={handleCloseCriarTicket} maxWidth='sm' fullWidth>
        <DialogTitle>
          <div className='flex items-center justify-between'>
            <Typography variant='h5'>Novo Ticket</Typography>
            <IconButton onClick={handleCloseCriarTicket} size='small'>
              <i className='tabler-x' />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          {erroForm && (
            <Alert severity='error' className='mb-4'>
              {erroForm}
            </Alert>
          )}

          <Grid container spacing={3} className='mt-2'>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label='Tipo de Ticket'
                value={novoTicket.tipo_ticket_id}
                onChange={(e) => setNovoTicket({ ...novoTicket, tipo_ticket_id: e.target.value })}
                required
              >
                {tiposTicket.map((tipo) => (
                  <MenuItem key={tipo.id} value={tipo.id}>
                    {tipo.nome}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Assunto'
                value={novoTicket.assunto}
                onChange={(e) => setNovoTicket({ ...novoTicket, assunto: e.target.value })}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Descrição'
                value={novoTicket.descricao}
                onChange={(e) => setNovoTicket({ ...novoTicket, descricao: e.target.value })}
                multiline
                rows={4}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label='Prioridade'
                value={novoTicket.prioridade}
                onChange={(e) => setNovoTicket({ ...novoTicket, prioridade: e.target.value as any })}
              >
                <MenuItem value='baixa'>Baixa</MenuItem>
                <MenuItem value='media'>Média</MenuItem>
                <MenuItem value='alta'>Alta</MenuItem>
                <MenuItem value='urgente'>Urgente</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Localização (opcional)'
                value={novoTicket.localizacao}
                onChange={(e) => setNovoTicket({ ...novoTicket, localizacao: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCriarTicket} color='secondary'>
            Cancelar
          </Button>
          <Button
            onClick={handleCriarTicket}
            variant='contained'
            disabled={criandoTicket}
            startIcon={criandoTicket && <CircularProgress size={20} />}
          >
            {criandoTicket ? 'Criando...' : 'Criar Ticket'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Detalhes do Ticket */}
      <Dialog open={detailsModalOpen} onClose={handleCloseDetails} maxWidth='md' fullWidth>
        <DialogTitle>
          <div className='flex items-center justify-between'>
            <Typography variant='h5'>Detalhes do Ticket</Typography>
            <Chip
              label={`#${selectedTicket?.numero_ticket}`}
              color='primary'
              size='small'
            />
          </div>
        </DialogTitle>
        <DialogContent>
          {selectedTicket && (
            <Grid container spacing={3} className='mt-2'>
              {/* Informações Principais */}
              <Grid item xs={12}>
                <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                  Assunto
                </Typography>
                <Typography variant='body1' className='font-medium'>
                  {selectedTicket.assunto}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                  Descrição
                </Typography>
                <Typography variant='body1' className='whitespace-pre-wrap'>
                  {selectedTicket.descricao}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              {/* Informações do Ticket */}
              <Grid item xs={6}>
                <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                  Tipo de Ticket
                </Typography>
                <Typography variant='body1'>{selectedTicket.tipo_ticket_nome}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                  Prioridade
                </Typography>
                <Chip
                  label={selectedTicket.prioridade.toUpperCase()}
                  color={getPrioridadeColor(selectedTicket.prioridade)}
                  size='small'
                />
              </Grid>

              <Grid item xs={6}>
                <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                  Status
                </Typography>
                <Chip label={selectedTicket.status} size='small' variant='outlined' />
              </Grid>

              <Grid item xs={6}>
                <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                  Atribuído a
                </Typography>
                <Typography variant='body1'>
                  {selectedTicket.atribuido_nome || 'Não atribuído'}
                </Typography>
              </Grid>

              {/* Equipamento e Localização */}
              {(selectedTicket.equipamento_id || selectedTicket.localizacao) && (
                <>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  {selectedTicket.equipamento_id && (
                    <>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                          Equipamento
                        </Typography>
                        <Typography variant='body1'>
                          {selectedTicket.equipamento_numero} - {selectedTicket.equipamento_nome}
                        </Typography>
                      </Grid>
                    </>
                  )}

                  {selectedTicket.localizacao && (
                    <Grid item xs={selectedTicket.equipamento_id ? 6 : 12}>
                      <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                        Localização
                      </Typography>
                      <Typography variant='body1'>{selectedTicket.localizacao}</Typography>
                    </Grid>
                  )}
                </>
              )}

              {/* Datas */}
              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={6}>
                <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                  Criado em
                </Typography>
                <Typography variant='body1'>
                  {new Date(selectedTicket.criado_em).toLocaleString('pt-PT')}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                  Última Atualização
                </Typography>
                <Typography variant='body1'>
                  {new Date(selectedTicket.atualizado_em).toLocaleString('pt-PT')}
                </Typography>
              </Grid>

              {selectedTicket.data_limite && (
                <Grid item xs={12}>
                  <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                    SLA
                  </Typography>
                  <SLABadge
                    slaStatus={selectedTicket.sla_status}
                    dataLimite={selectedTicket.data_limite}
                    tempoRestanteMinutos={selectedTicket.tempo_restante_minutos}
                  />
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default PortalTickets
