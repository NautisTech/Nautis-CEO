'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import type { TextFieldProps } from '@mui/material/TextField'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Type Imports
import type { Locale } from '@configs/i18n'
import type { Intervencao } from '@/libs/api/intervencoes/types'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'
import TablePaginationComponent from '@components/TablePaginationComponent'

// API Imports
import { intervencoesAPI } from '@/libs/api/intervencoes'
import { ticketsAPI } from '@/libs/api/suporte/api'
import CustosDialog from './CustosDialog'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type IntervencaoWithActionsType = Intervencao & { actions?: string }

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, onChange, debounce])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const columnHelper = createColumnHelper<IntervencaoWithActionsType>()

const IntervencoesTable = () => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<Intervencao[]>([])
  const [totalRows, setTotalRows] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [intervencaoToDelete, setIntervencaoToDelete] = useState<Intervencao | null>(null)
  const [custosDialogOpen, setCustosDialogOpen] = useState(false)
  const [selectedIntervencaoForCustos, setSelectedIntervencaoForCustos] = useState<Intervencao | null>(null)

  // Filter states
  const [tipoFilter, setTipoFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [ticketFilter, setTicketFilter] = useState<number | ''>('')

  // Tickets for filter dropdown
  const [tickets, setTickets] = useState<Array<{ id: number; numero_ticket: string }>>([])

  // Hooks
  const { lang: locale } = useParams()

  // Fetch tickets for filter
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const result = await ticketsAPI.list()
        const ticketsData = 'data' in result ? result.data : result
        setTickets(ticketsData)
      } catch (error) {
        console.error('Erro ao carregar tickets:', error)
      }
    }
    fetchTickets()
  }, [])

  // Fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true)
      const result = await intervencoesAPI.list({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        tipo: tipoFilter || undefined,
        status: statusFilter || undefined,
        ticket_id: ticketFilter || undefined
      })

      if ('data' in result) {
        setData(result.data)
        setTotalRows(result.total)
      } else {
        setData(result)
        setTotalRows(result.length)
      }
    } catch (error) {
      console.error('Erro ao carregar intervenções:', error)
      setData([])
      setTotalRows(0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [pagination.pageIndex, pagination.pageSize, tipoFilter, statusFilter, ticketFilter])

  // Handle custos
  const handleOpenCustos = (intervencao: Intervencao) => {
    setSelectedIntervencaoForCustos(intervencao)
    setCustosDialogOpen(true)
  }

  // Handle delete
  const handleDeleteClick = (intervencao: Intervencao) => {
    setIntervencaoToDelete(intervencao)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!intervencaoToDelete) return

    try {
      await intervencoesAPI.delete(intervencaoToDelete.id)
      setDeleteDialogOpen(false)
      setIntervencaoToDelete(null)
      fetchData()
    } catch (error) {
      console.error('Erro ao deletar intervenção:', error)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setIntervencaoToDelete(null)
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'preventiva':
        return 'info'
      case 'corretiva':
        return 'warning'
      case 'instalacao':
        return 'success'
      case 'upgrade':
        return 'secondary'
      default:
        return 'default'
    }
  }

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'info' => {
    switch (status) {
      case 'agendada':
      case 'pendente':
        return 'warning'
      case 'em_progresso':
      case 'em_andamento':
        return 'info'
      case 'concluida':
        return 'success'
      case 'cancelada':
        return 'error'
      default:
        return 'info'
    }
  }

  const formatCurrency = (value?: number) => {
    if (!value) return '—'
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value)
  }

  const columns = useMemo<ColumnDef<IntervencaoWithActionsType, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      columnHelper.accessor('numero_intervencao', {
        header: 'Nº Intervenção',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.numero_intervencao || '-'}
          </Typography>
        )
      }),
      columnHelper.accessor('titulo', {
        header: 'Título',
        cell: ({ row }) => (
          <div className='flex flex-col min-w-[200px]'>
            <Typography className='font-medium' color='text.primary'>
              {row.original.titulo}
            </Typography>
            {row.original.numero_ticket && (
              <Typography variant='body2' color='text.secondary'>
                Ticket: {row.original.numero_ticket}
              </Typography>
            )}
          </div>
        )
      }),
      columnHelper.accessor('tipo', {
        header: 'Tipo',
        cell: ({ row }) => (
          <Chip
            label={row.original.tipo.toUpperCase()}
            variant='tonal'
            size='small'
            color={getTipoColor(row.original.tipo) as any}
          />
        )
      }),
      columnHelper.accessor('equipamento_nome', {
        header: 'Equipamento',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.equipamento_numero}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {row.original.equipamento_nome}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('tecnico_nome', {
        header: 'Técnico',
        cell: ({ row }) => (
          <Typography color='text.secondary'>
            {row.original.tecnico_nome || '-'}
          </Typography>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => {
          const color = getStatusColor(row.original.status)

          return (
            <Chip
              label={row.original.status.toUpperCase().replace('_', ' ')}
              variant='tonal'
              size='small'
              color={color}
            />
          )
        }
      }),
      columnHelper.accessor('data_inicio', {
        header: 'Data Início',
        cell: ({ row }) => (
          <Typography color='text.secondary'>
            {row.original.data_inicio ? new Date(row.original.data_inicio).toLocaleDateString('pt-PT') : '-'}
          </Typography>
        )
      }),
      columnHelper.accessor('custo_total', {
        header: 'Custo Total',
        cell: ({ row }) => (
          <Typography color='text.secondary' className='font-medium'>
            {formatCurrency(row.original.custo_total)}
          </Typography>
        )
      }),
      columnHelper.accessor('aprovacao_cliente', {
        header: 'Aprovação',
        cell: ({ row }) => {
          if (!row.original.precisa_aprovacao_cliente) {
            return <Chip label='N/A' variant='tonal' size='small' color='default' />
          }

          if (row.original.aprovacao_cliente) {
            return (
              <div className='flex flex-col gap-1'>
                <Chip label='Aprovado' variant='tonal' size='small' color='success' />
                {row.original.data_aprovacao && (
                  <Typography variant='caption' color='text.secondary'>
                    {new Date(row.original.data_aprovacao).toLocaleDateString('pt-PT')}
                  </Typography>
                )}
              </div>
            )
          }

          return <Chip label='Pendente' variant='tonal' size='small' color='warning' />
        }
      }),
      columnHelper.accessor('actions', {
        header: 'Ações',
        cell: ({ row }) => (
          <div className='flex items-center gap-1'>
            <IconButton
              size='small'
              component={Link}
              href={getLocalizedUrl(`/apps/suporte/intervencoes/${row.original.id}`, locale as Locale)}
            >
              <i className='tabler-eye text-[22px] text-textSecondary' />
            </IconButton>
            <IconButton
              size='small'
              component={Link}
              href={getLocalizedUrl(`/apps/suporte/intervencoes/${row.original.id}`, locale as Locale)}
            >
              <i className='tabler-edit text-[22px] text-textSecondary' />
            </IconButton>
            <IconButton size='small' onClick={() => handleOpenCustos(row.original)} title='Ver custos'>
              <i className='tabler-coin text-[22px] text-textSecondary' />
            </IconButton>
            <IconButton size='small' onClick={() => handleDeleteClick(row.original)}>
              <i className='tabler-trash text-[22px] text-textSecondary' />
            </IconButton>
          </div>
        ),
        enableSorting: false,
        size: 100
      })
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(totalRows / pagination.pageSize),
    manualPagination: true,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter,
      pagination
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <Card>
      <CardHeader title='Intervenções' className='pbe-4' />
      <Divider />

      {/* Filters - Same style as conteudos */}
      <CardContent>
        <Grid container spacing={6}>
          {/* Filtro: Tipo */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <CustomTextField
              select
              fullWidth
              label="Tipo"
              value={tipoFilter}
              onChange={e => setTipoFilter(e.target.value)}
              slotProps={{
                select: { displayEmpty: true }
              }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="preventiva">Preventiva</MenuItem>
              <MenuItem value="corretiva">Corretiva</MenuItem>
              <MenuItem value="instalacao">Instalação</MenuItem>
              <MenuItem value="configuracao">Configuração</MenuItem>
              <MenuItem value="upgrade">Upgrade</MenuItem>
              <MenuItem value="manutencao">Manutenção</MenuItem>
            </CustomTextField>
          </Grid>

          {/* Filtro: Status */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <CustomTextField
              select
              fullWidth
              label="Status"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              slotProps={{
                select: { displayEmpty: true }
              }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="agendada">Agendada</MenuItem>
              <MenuItem value="em_progresso">Em Progresso</MenuItem>
              <MenuItem value="concluida">Concluída</MenuItem>
              <MenuItem value="cancelada">Cancelada</MenuItem>
            </CustomTextField>
          </Grid>

          {/* Filtro: Ticket */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <CustomTextField
              select
              fullWidth
              label="Ticket"
              value={ticketFilter}
              onChange={e => setTicketFilter(e.target.value === '' ? '' : Number(e.target.value))}
              slotProps={{
                select: { displayEmpty: true }
              }}
            >
              <MenuItem value="">Todos</MenuItem>
              {tickets.map(ticket => (
                <MenuItem key={ticket.id} value={ticket.id}>
                  {ticket.numero_ticket}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>
        </Grid>
      </CardContent>

      <Divider />

      <div className='flex flex-wrap justify-between gap-4 p-6'>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder='Pesquisar intervenção'
          className='max-sm:is-full'
        />
        <div className='flex flex-wrap items-center max-sm:flex-col gap-4 max-sm:is-full is-auto'>
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className='flex-auto is-[70px] max-sm:is-full'
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
          <Button
            variant='contained'
            className='max-sm:is-full is-auto'
            startIcon={<i className='tabler-plus' />}
            component={Link}
            href={getLocalizedUrl('/apps/suporte/intervencoes/create', locale as Locale)}
          >
            Nova Intervenção
          </Button>
        </div>
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
          {table.getFilteredRowModel().rows.length === 0 && !isLoading ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                  <Typography className='py-10'>Nenhuma intervenção encontrada</Typography>
                </td>
              </tr>
            </tbody>
          ) : isLoading ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                  <div className='flex justify-center items-center py-10'>
                    <CircularProgress />
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {/* Custos Dialog */}
      {selectedIntervencaoForCustos && (
        <CustosDialog
          open={custosDialogOpen}
          onClose={() => setCustosDialogOpen(false)}
          intervencaoId={selectedIntervencaoForCustos.id}
          intervencaoNumero={selectedIntervencaoForCustos.numero_intervencao}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir a intervenção{' '}
            <strong>
              {intervencaoToDelete?.numero_intervencao} - {intervencaoToDelete?.titulo}
            </strong>
            ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color='secondary'>
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} variant='contained' color='error'>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <TablePagination
        component={() => <TablePaginationComponent table={table} totalRows={totalRows} />}
        count={totalRows}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
      />
    </Card>
  )
}

export default IntervencoesTable
