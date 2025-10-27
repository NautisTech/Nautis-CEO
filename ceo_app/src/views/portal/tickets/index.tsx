'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'

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

// Component Imports
import { portalAPI } from '@/libs/api/portal'
import type { PortalTicket } from '@/libs/api/portal'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import SLABadge from '@/components/SLABadge'

// Filter function
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const columnHelper = createColumnHelper<PortalTicket>()

const PortalTickets = () => {
  const [tickets, setTickets] = useState<PortalTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [prioridadeFilter, setPrioridadeFilter] = useState('')
  const [selectedTicket, setSelectedTicket] = useState<PortalTicket | null>(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)

  const handleOpenDetails = (ticket: PortalTicket) => {
    setSelectedTicket(ticket)
    setDetailsModalOpen(true)
  }

  const handleCloseDetails = () => {
    setDetailsModalOpen(false)
    setSelectedTicket(null)
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
      columnHelper.accessor('numero_ticket', {
        header: 'Número',
        cell: ({ row }) => (
          <Typography
            component='a'
            href={`/tickets/${row.original.id}`}
            color='primary'
            className='font-medium hover:underline'
          >
            #{row.original.numero_ticket}
          </Typography>
        )
      }),
      columnHelper.accessor('assunto', {
        header: 'Assunto',
        cell: ({ row }) => (
          <Typography className='font-medium'>{row.original.assunto}</Typography>
        )
      }),
      columnHelper.accessor('prioridade', {
        header: 'Prioridade',
        cell: ({ row }) => (
          <Chip
            label={row.original.prioridade.toUpperCase()}
            color={getPrioridadeColor(row.original.prioridade)}
            size='small'
          />
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => <Chip label={row.original.status} size='small' variant='outlined' />
      }),
      columnHelper.accessor('sla_status', {
        header: 'SLA',
        cell: ({ row }) =>
          row.original.sla_status ? (
            <SLABadge
              slaStatus={row.original.sla_status}
              dataLimite={row.original.data_limite}
              tempoRestanteMinutos={row.original.tempo_restante_minutos}
            />
          ) : null
      }),
      columnHelper.accessor('atribuido_nome', {
        header: 'Atribuído a',
        cell: ({ row }) => (
          <Typography variant='body2'>{row.original.atribuido_nome || 'Não atribuído'}</Typography>
        )
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
          <Button
            variant='text'
            size='small'
            onClick={() => handleOpenDetails(row.original)}
          >
            Ver Detalhes
          </Button>
        )
      })
    ],
    [handleOpenDetails]
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
      <CardHeader title='Meus Tickets' />
      <CardContent>
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
          <table className='min-w-full'>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className='px-4 py-2 text-left'>
                      {header.isPlaceholder ? null : (
                        <div
                          className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className='border-t'>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className='px-4 py-3'>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {table.getRowModel().rows.length === 0 && (
          <div className='text-center py-8'>
            <Typography color='text.secondary'>Nenhum ticket encontrado</Typography>
          </div>
        )}

        <TablePaginationComponent table={table} />
      </CardContent>

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
