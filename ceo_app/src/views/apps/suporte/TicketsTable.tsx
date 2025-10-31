'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import type { TextFieldProps } from '@mui/material/TextField'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import { toast } from 'react-toastify'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import SLABadge from '@components/SLABadge'

// API Imports
import { ticketsAPI, type Ticket, StatusTicket, PrioridadeTicket } from '@/libs/api/suporte'

// Type Imports
import type { Locale } from '@configs/i18n'

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

type TicketWithActionsType = Ticket & {
  actions?: string
}

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
  }, [value, debounce, onChange])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const statusColorMap: Record<StatusTicket, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
  [StatusTicket.ABERTO]: 'info',
  [StatusTicket.EM_ANDAMENTO]: 'primary',
  [StatusTicket.AGUARDANDO]: 'warning',
  [StatusTicket.RESOLVIDO]: 'success',
  [StatusTicket.FECHADO]: 'default',
  [StatusTicket.CANCELADO]: 'error'
}

const statusLabelMap: Record<StatusTicket, string> = {
  [StatusTicket.ABERTO]: 'Aberto',
  [StatusTicket.EM_ANDAMENTO]: 'Em Andamento',
  [StatusTicket.AGUARDANDO]: 'Aguardando',
  [StatusTicket.RESOLVIDO]: 'Resolvido',
  [StatusTicket.FECHADO]: 'Fechado',
  [StatusTicket.CANCELADO]: 'Cancelado'
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

const TicketsTable = () => {
  const router = useRouter()
  const [status, setStatus] = useState<string>('All')
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<Ticket[]>([])
  const [totalRows, setTotalRows] = useState(0)
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)

  const { lang: locale } = useParams()

  const handleOpenDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setDetailsModalOpen(true)
  }

  const handleCloseDetails = () => {
    setDetailsModalOpen(false)
    setSelectedTicket(null)
  }

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const result = await ticketsAPI.list({
        status: status !== 'All' ? status : undefined,
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize
      })

      if ('data' in result) {
        setData(result.data)
        setTotalRows(result.total)
      } else {
        setData(result)
        setTotalRows(result.length)
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
      setData([])
      setTotalRows(0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [pagination.pageIndex, pagination.pageSize, status])

  const handleDelete = async (id: number) => {
    try {
      await ticketsAPI.delete(id)
      toast.success('Ticket eliminado com sucesso')
      fetchData()
    } catch (error) {
      console.error('Error deleting ticket:', error)
      toast.error('Erro ao eliminar ticket')
    }
  }

  const handleDuplicar = async (id: number) => {
    try {
      const ticket = data.find(t => t.id === id)
      if (!ticket) return

      // Criar novo ticket com os mesmos dados
      await ticketsAPI.create({
        tipo_ticket_id: ticket.tipo_ticket_id,
        equipamento_id: ticket.equipamento_id,
        titulo: `${ticket.titulo} (Cópia)`,
        descricao: ticket.descricao,
        prioridade: ticket.prioridade,
        status: StatusTicket.ABERTO,
        solicitante_id: ticket.solicitante_id,
        localizacao: ticket.localizacao
      })
      toast.success('Ticket duplicado com sucesso')
      fetchData()
    } catch (error) {
      console.error('Error duplicating ticket:', error)
      toast.error('Erro ao duplicar ticket')
    }
  }

  const handleReabrir = async (id: number) => {
    try {
      await ticketsAPI.fechar(id) // Use the PATCH endpoint instead
      toast.success('Ticket reaberto com sucesso')
      fetchData()
    } catch (error) {
      console.error('Error reopening ticket:', error)
      toast.error('Erro ao reabrir ticket')
    }
  }

  const handleFinalizar = async (id: number) => {
    try {
      await ticketsAPI.fechar(id) // Use the PATCH endpoint
      toast.success('Ticket finalizado com sucesso')
      fetchData()
    } catch (error) {
      console.error('Error closing ticket:', error)
      toast.error('Erro ao finalizar ticket')
    }
  }

  const handleRegistarIntervencao = (ticketId: number) => {
    router.push(getLocalizedUrl(`/apps/suporte/intervencoes/create?ticket=${ticketId}`, locale as Locale))
  }

  const columns = useMemo<ColumnDef<TicketWithActionsType, any>[]>(
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
      columnHelper.accessor('equipamento_numero', {
        header: 'Equipamento',
        cell: ({ row }) => {
          const hasRegisteredEquip = row.original.equipamento_numero
          const hasSN = row.original.equipamento_sn

          return (
            <div className='flex flex-col items-start'>
              <Typography className='font-medium' color='text.primary'>
                {hasRegisteredEquip
                  ? row.original.equipamento_numero
                  : hasSN
                    ? `SN: ${row.original.equipamento_sn}`
                    : 'N/A'}
              </Typography>
              {row.original.equipamento_descritivo && (
                <Typography variant='body2' color='text.secondary'>
                  {row.original.equipamento_descritivo}
                </Typography>
              )}
              <Typography variant='body2' color='text.secondary'>
                {row.original.numero_ticket} {row.original.codigo_unico && `· ${row.original.codigo_unico}`}
              </Typography>
            </div>
          )
        }
      }),
      columnHelper.accessor('solicitante_nome', {
        header: 'Solicitante',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <CustomAvatar skin='light' color='primary' size={34}>
              {row.original.solicitante_nome?.charAt(0) || 'U'}
            </CustomAvatar>
            <div className='flex flex-col items-start'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.solicitante_nome || 'N/A'}
              </Typography>
              {row.original.atribuido_nome && (
                <Typography variant='body2' color='text.secondary'>
                  Atribuído: {row.original.atribuido_nome}
                </Typography>
              )}
            </div>
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
      columnHelper.accessor('sla_status', {
        header: 'SLA',
        cell: ({ row }) => (
          <SLABadge
            slaStatus={row.original.sla_status}
            tempoRestanteMinutos={row.original.sla_tempo_restante_minutos}
            slaHoras={row.original.sla_horas}
          />
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Chip
              label={statusLabelMap[row.original.status]}
              variant='tonal'
              color={statusColorMap[row.original.status]}
              size='small'
            />
          </div>
        )
      }),
      columnHelper.accessor('actions', {
        header: 'Ações',
        cell: ({ row }) => (
          <div className='flex items-center gap-1'>
            <IconButton
              size='small'
              onClick={() => handleOpenDetails(row.original)}
              title='Ver Detalhes'
            >
              <i className='tabler-file-text text-[22px] text-textSecondary' />
            </IconButton>
            <IconButton
              size='small'
              onClick={() =>
                router.push(getLocalizedUrl(`/apps/suporte/tickets/edit/${row.original.id}`, locale as Locale))
              }
              title='Editar'
            >
              <i className='tabler-edit text-[22px] text-textSecondary' />
            </IconButton>
            <OptionMenu
              iconButtonProps={{ size: 'small' }}
              iconClassName='text-[22px] text-textSecondary'
              options={[
                {
                  text: 'Duplicar',
                  icon: 'tabler-copy',
                  menuItemProps: {
                    onClick: () => handleDuplicar(row.original.id)
                  }
                },
                {
                  text: 'Reabrir Ticket',
                  icon: 'tabler-refresh',
                  menuItemProps: {
                    onClick: () => handleReabrir(row.original.id),
                    disabled: row.original.status === StatusTicket.ABERTO
                  }
                },
                {
                  text: 'Finalizar Ticket',
                  icon: 'tabler-check',
                  menuItemProps: {
                    onClick: () => handleFinalizar(row.original.id),
                    disabled: row.original.status === StatusTicket.FECHADO
                  }
                },
                {
                  text: 'Registar Intervenção',
                  icon: 'tabler-tool',
                  menuItemProps: {
                    onClick: () => handleRegistarIntervencao(row.original.id)
                  }
                },
                {
                  text: 'Eliminar',
                  icon: 'tabler-trash',
                  menuItemProps: {
                    onClick: () => {
                      if (confirm('Tem certeza que deseja eliminar este ticket?')) {
                        handleDelete(row.original.id)
                      }
                    },
                    className: 'text-error'
                  }
                }
              ]}
            />
          </div>
        ),
        enableSorting: false
      })
    ],
    [data, handleOpenDetails, handleDuplicar, handleReabrir, handleFinalizar, handleRegistarIntervencao, handleDelete, router, locale]
  )

  const table = useReactTable({
    data: data as Ticket[],
    columns,
    pageCount: Math.ceil(totalRows / pagination.pageSize),
    state: {
      rowSelection,
      globalFilter,
      pagination
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination: true
  })

  return (
    <Card>
      <div className='flex flex-wrap justify-between gap-4 p-6'>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder='Pesquisar Tickets'
          className='max-sm:is-full'
        />
        <div className='flex max-sm:flex-col sm:items-center gap-4 max-sm:is-full'>
          <CustomTextField
            select
            value={pagination.pageSize}
            onChange={e => setPagination(prev => ({ ...prev, pageSize: Number(e.target.value), pageIndex: 0 }))}
            className='sm:is-[140px] flex-auto is-full'
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
          <CustomTextField
            select
            fullWidth
            value={status}
            onChange={e => {
              setStatus(e.target.value)
              setPagination(prev => ({ ...prev, pageIndex: 0 }))
            }}
            className='is-full sm:is-[140px] flex-auto'
          >
            <MenuItem value='All'>Todos</MenuItem>
            <MenuItem value={StatusTicket.ABERTO}>Aberto</MenuItem>
            <MenuItem value={StatusTicket.EM_ANDAMENTO}>Em Andamento</MenuItem>
            <MenuItem value={StatusTicket.AGUARDANDO}>Aguardando</MenuItem>
            <MenuItem value={StatusTicket.RESOLVIDO}>Resolvido</MenuItem>
            <MenuItem value={StatusTicket.FECHADO}>Fechado</MenuItem>
            <MenuItem value={StatusTicket.CANCELADO}>Cancelado</MenuItem>
          </CustomTextField>
          <Button
            variant='contained'
            className='max-sm:is-full'
            startIcon={<i className='tabler-plus' />}
            onClick={() => router.push(getLocalizedUrl('/apps/suporte/tickets/create', locale as Locale))}
          >
            Novo Ticket
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
                  Nenhum ticket encontrado
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table.getRowModel().rows.map(row => {
                return (
                  <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
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

      {/* Modal de Detalhes do Ticket */}
      <Dialog open={detailsModalOpen} onClose={handleCloseDetails} maxWidth='md' fullWidth>
        <DialogTitle>
          <div className='flex items-center justify-between'>
            <Typography variant='h5'>Detalhes do Ticket</Typography>
            <div className='flex gap-2'>
              {selectedTicket?.codigo_unico && (
                <Chip
                  label={selectedTicket.codigo_unico}
                  color='secondary'
                  size='small'
                  variant='tonal'
                />
              )}
              <Chip
                label={`#${selectedTicket?.numero_ticket}`}
                color='primary'
                size='small'
              />
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          {selectedTicket && (
            <div className='flex flex-col gap-4 pbs-5'>
              {/* Título */}
              <div>
                <Typography variant='body2' color='text.secondary' className='mbe-1'>
                  Título
                </Typography>
                <Typography variant='body1' className='font-medium'>
                  {selectedTicket.titulo}
                </Typography>
              </div>

              {/* Descrição */}
              <div>
                <Typography variant='body2' color='text.secondary' className='mbe-1'>
                  Descrição
                </Typography>
                <Typography variant='body1' className='whitespace-pre-wrap'>
                  {selectedTicket.descricao}
                </Typography>
              </div>

              <Divider />

              {/* Informações do Ticket */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Typography variant='body2' color='text.secondary' className='mbe-1'>
                    Tipo de Ticket
                  </Typography>
                  <Typography variant='body1'>{selectedTicket.tipo_ticket_nome || 'N/A'}</Typography>
                </div>

                <div>
                  <Typography variant='body2' color='text.secondary' className='mbe-1'>
                    Prioridade
                  </Typography>
                  <Chip
                    label={prioridadeLabelMap[selectedTicket.prioridade]}
                    color={prioridadeColorMap[selectedTicket.prioridade]}
                    size='small'
                    variant='tonal'
                  />
                </div>

                <div>
                  <Typography variant='body2' color='text.secondary' className='mbe-1'>
                    Status
                  </Typography>
                  <Chip
                    label={statusLabelMap[selectedTicket.status]}
                    size='small'
                    variant='tonal'
                    color={statusColorMap[selectedTicket.status]}
                  />
                </div>

                <div>
                  <Typography variant='body2' color='text.secondary' className='mbe-1'>
                    Solicitante
                  </Typography>
                  <Typography variant='body1'>
                    {selectedTicket.solicitante_nome || 'N/A'}
                  </Typography>
                </div>

                <div>
                  <Typography variant='body2' color='text.secondary' className='mbe-1'>
                    Atribuído a
                  </Typography>
                  <Typography variant='body1'>
                    {selectedTicket.atribuido_nome || 'Não atribuído'}
                  </Typography>
                </div>
              </div>

              {/* Equipamento e Localização */}
              {(selectedTicket.equipamento_id || selectedTicket.equipamento_sn || selectedTicket.localizacao) && (
                <>
                  <Divider />
                  <div className='grid grid-cols-2 gap-4'>
                    {(selectedTicket.equipamento_id || selectedTicket.equipamento_sn) && (
                      <div className={selectedTicket.localizacao ? '' : 'col-span-2'}>
                        <Typography variant='body2' color='text.secondary' className='mbe-1'>
                          Equipamento
                        </Typography>
                        {selectedTicket.equipamento_id ? (
                          <Typography variant='body1'>
                            {selectedTicket.equipamento_numero} - {selectedTicket.equipamento_nome}
                          </Typography>
                        ) : (
                          <>
                            <Typography variant='body1'>SN: {selectedTicket.equipamento_sn}</Typography>
                            {selectedTicket.equipamento_descritivo && (
                              <Typography variant='body2' color='text.secondary'>
                                {selectedTicket.equipamento_descritivo}
                              </Typography>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {selectedTicket.localizacao && (
                      <div className={selectedTicket.equipamento_id || selectedTicket.equipamento_sn ? '' : 'col-span-2'}>
                        <Typography variant='body2' color='text.secondary' className='mbe-1'>
                          Localização
                        </Typography>
                        <Typography variant='body1'>{selectedTicket.localizacao}</Typography>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Datas e SLA */}
              <Divider />
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Typography variant='body2' color='text.secondary' className='mbe-1'>
                    Data de Abertura
                  </Typography>
                  <Typography variant='body1'>
                    {new Date(selectedTicket.data_abertura).toLocaleString('pt-PT')}
                  </Typography>
                </div>

                {selectedTicket.data_prevista && (
                  <div>
                    <Typography variant='body2' color='text.secondary' className='mbe-1'>
                      Data Prevista
                    </Typography>
                    <Typography variant='body1'>
                      {new Date(selectedTicket.data_prevista).toLocaleString('pt-PT')}
                    </Typography>
                  </div>
                )}

                {selectedTicket.data_conclusao && (
                  <div>
                    <Typography variant='body2' color='text.secondary' className='mbe-1'>
                      Data de Conclusão
                    </Typography>
                    <Typography variant='body1'>
                      {new Date(selectedTicket.data_conclusao).toLocaleString('pt-PT')}
                    </Typography>
                  </div>
                )}

                {selectedTicket.sla_status && (
                  <div className='col-span-2'>
                    <Typography variant='body2' color='text.secondary' className='mbe-1'>
                      SLA
                    </Typography>
                    <SLABadge
                      slaStatus={selectedTicket.sla_status}
                      tempoRestanteMinutos={selectedTicket.sla_tempo_restante_minutos}
                      slaHoras={selectedTicket.sla_horas}
                    />
                  </div>
                )}
              </div>

              {/* Avaliação */}
              {selectedTicket.avaliacao && (
                <>
                  <Divider />
                  <div>
                    <Typography variant='body2' color='text.secondary' className='mbe-1'>
                      Avaliação
                    </Typography>
                    <Typography variant='body1' className='font-medium'>
                      {selectedTicket.avaliacao} / 5
                    </Typography>
                    {selectedTicket.comentario_avaliacao && (
                      <Typography variant='body2' color='text.secondary' className='mbs-2'>
                        {selectedTicket.comentario_avaliacao}
                      </Typography>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Fechar</Button>
          <Button
            variant='contained'
            onClick={() => {
              handleCloseDetails()
              router.push(getLocalizedUrl(`/apps/suporte/tickets/edit/${selectedTicket?.id}`, locale as Locale))
            }}
          >
            Editar Ticket
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default TicketsTable
