'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

// Third-party Imports
import classnames from 'classnames'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// API Imports
import { ticketsAPI, type Ticket, PrioridadeTicket } from '@/libs/api/suporte'
import { funcionariosAPI, type Funcionario } from '@/libs/api/funcionarios'

// Type Imports
import type { Locale } from '@configs/i18n'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

type TicketWithActionsType = Ticket & {
  actions?: string
}

const prioridadeColorMap: Record<PrioridadeTicket, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
  [PrioridadeTicket.BAIXA]: 'success',
  [PrioridadeTicket.MEDIA]: 'warning',
  [PrioridadeTicket.ALTA]: 'error',
  [PrioridadeTicket.URGENTE]: 'error'
}

const prioridadeLabelMap: Record<PrioridadeTicket, string> = {
  [PrioridadeTicket.BAIXA]: 'Baixa',
  [PrioridadeTicket.MEDIA]: 'Média',
  [PrioridadeTicket.ALTA]: 'Alta',
  [PrioridadeTicket.URGENTE]: 'Urgente'
}

const columnHelper = createColumnHelper<TicketWithActionsType>()

const TriagemTable = () => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const [data, setData] = useState<Ticket[]>([])
  const [totalRows, setTotalRows] = useState(0)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [isLoading, setIsLoading] = useState(false)

  // Assign dialog state
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [selectedFuncionario, setSelectedFuncionario] = useState<number>(0)
  const [assigning, setAssigning] = useState(false)

  useEffect(() => {
    fetchData()
  }, [pagination.pageIndex, pagination.pageSize])

  useEffect(() => {
    fetchFuncionarios()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      // Fetch only tickets without assigned technician
      const result = await ticketsAPI.list({
        atribuido_id: undefined,
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize
      })

      if ('data' in result) {
        // Filter tickets without atribuido_id
        const unassignedTickets = result.data.filter(t => !t.atribuido_id)
        setData(unassignedTickets)
        setTotalRows(unassignedTickets.length)
      } else {
        const unassignedTickets = result.filter(t => !t.atribuido_id)
        setData(unassignedTickets)
        setTotalRows(unassignedTickets.length)
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
      setData([])
      setTotalRows(0)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchFuncionarios = async () => {
    try {
      const result = await funcionariosAPI.list({ ativo: true })

      if (Array.isArray(result)) {
        setFuncionarios(result)
      } else if ('data' in result) {
        setFuncionarios(result.data)
      }
    } catch (error) {
      console.error('Error fetching funcionarios:', error)
    }
  }

  const handleAssignClick = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setSelectedFuncionario(0)
    setAssignDialogOpen(true)
  }

  const handleAssignConfirm = async () => {
    if (!selectedTicket || !selectedFuncionario) return

    try {
      setAssigning(true)
      await ticketsAPI.update(selectedTicket.id, {
        tipo_ticket_id: selectedTicket.tipo_ticket_id,
        equipamento_id: selectedTicket.equipamento_id,
        titulo: selectedTicket.titulo,
        descricao: selectedTicket.descricao,
        prioridade: selectedTicket.prioridade,
        status: selectedTicket.status,
        solicitante_id: selectedTicket.solicitante_id,
        atribuido_id: selectedFuncionario,
        localizacao: selectedTicket.localizacao
      })

      setAssignDialogOpen(false)
      fetchData() // Refresh list
    } catch (error) {
      console.error('Error assigning ticket:', error)
    } finally {
      setAssigning(false)
    }
  }

  const columns = useMemo<ColumnDef<TicketWithActionsType, any>[]>(
    () => [
      columnHelper.accessor('numero_ticket', {
        header: 'Número',
        cell: ({ row }) => (
          <Typography className='font-medium' color='primary.main'>
            {row.original.numero_ticket}
          </Typography>
        )
      }),
      columnHelper.accessor('equipamento_numero', {
        header: 'Equipamento',
        cell: ({ row }) => (
          <Typography variant='body2' color='text.secondary'>
            {row.original.equipamento_numero || 'N/A'}
          </Typography>
        )
      }),
      columnHelper.accessor('solicitante_nome', {
        header: 'Solicitante',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <CustomAvatar skin='light' color='primary' size={34}>
              {row.original.solicitante_nome?.charAt(0) || 'U'}
            </CustomAvatar>
            <Typography color='text.primary'>
              {row.original.solicitante_nome || 'N/A'}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('titulo', {
        header: 'Ticket',
        cell: ({ row }) => (
          <div className='flex flex-col gap-1'>
            <Typography className='font-medium' color='text.primary'>
              {row.original.titulo}
            </Typography>
            <Typography variant='body2' className='text-wrap line-clamp-2' color='text.secondary'>
              {row.original.descricao}
            </Typography>
            <Chip
              label={prioridadeLabelMap[row.original.prioridade]}
              variant='tonal'
              color={prioridadeColorMap[row.original.prioridade]}
              size='small'
              className='w-fit mt-1'
            />
          </div>
        )
      }),
      columnHelper.accessor('data_abertura', {
        header: 'Data Abertura',
        cell: ({ row }) => {
          const date = new Date(row.original.data_abertura).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })

          return <Typography>{date}</Typography>
        }
      }),
      columnHelper.accessor('actions', {
        header: 'Ações',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Button
              variant='contained'
              size='small'
              startIcon={<i className='tabler-user-check' />}
              onClick={() => handleAssignClick(row.original)}
            >
              Atribuir
            </Button>
            <IconButton
              size='small'
              onClick={() => router.push(getLocalizedUrl(`/apps/suporte/tickets/${row.original.id}`, locale as Locale))}
            >
              <i className='tabler-eye text-[22px] text-textSecondary' />
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    [data, router]
  )

  const table = useReactTable({
    data: data as Ticket[],
    columns,
    pageCount: Math.ceil(totalRows / pagination.pageSize),
    state: {
      pagination
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true
  })

  return (
    <>
      <Card>
        <div className='flex flex-wrap justify-between gap-4 p-6'>
          <div className='flex flex-col gap-2'>
            <Typography variant='h5'>Triagem de Tickets</Typography>
            <Typography variant='body2' color='text.secondary'>
              Tickets aguardando atribuição de responsável
            </Typography>
          </div>
          <Button
            variant='tonal'
            startIcon={<i className='tabler-refresh' />}
            onClick={fetchData}
            disabled={isLoading}
          >
            Atualizar
          </Button>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
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
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {isLoading ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    Carregando...
                  </td>
                </tr>
              </tbody>
            ) : table.getRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    Nenhum ticket aguardando triagem
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table.getRowModel().rows.map(row => {
                  return (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            )}
          </table>
        </div>
        <TablePaginationComponent table={table} totalRows={totalRows} />
      </Card>

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Atribuir Ticket</DialogTitle>
        <DialogContent>
          <div className='flex flex-col gap-4 pt-4'>
            <Typography variant='body2' color='text.secondary'>
              Ticket: <strong>{selectedTicket?.numero_ticket}</strong> - {selectedTicket?.titulo}
            </Typography>
            <CustomTextField
              select
              fullWidth
              label='Selecione o Responsável'
              value={selectedFuncionario}
              onChange={e => setSelectedFuncionario(Number(e.target.value))}
            >
              <MenuItem value={0} disabled>
                Selecione um funcionário
              </MenuItem>
              {funcionarios.map(func => (
                <MenuItem key={func.id} value={func.id}>
                  {func.nomeCompleto} - {func.nomeAbreviado}
                </MenuItem>
              ))}
            </CustomTextField>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)} disabled={assigning}>
            Cancelar
          </Button>
          <Button
            variant='contained'
            onClick={handleAssignConfirm}
            disabled={!selectedFuncionario || assigning}
          >
            {assigning ? <CircularProgress size={24} /> : 'Atribuir'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TriagemTable
