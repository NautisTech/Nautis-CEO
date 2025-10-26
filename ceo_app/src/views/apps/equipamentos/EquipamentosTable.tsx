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
import type { Equipamento } from '@/libs/api/equipamentos/types'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'
import TablePaginationComponent from '@components/TablePaginationComponent'
import EditEquipamentoDialog from './EditEquipamentoDialog'

// API Imports
import { equipamentosAPI, type PaginatedResponse } from '@/libs/api/equipamentos'
import type { Equipamento } from '@/libs/api/equipamentos/types'

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

type EquipamentoWithActionsType = Equipamento & { actions?: string }

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

const columnHelper = createColumnHelper<EquipamentoWithActionsType>()

const EquipamentosTable = () => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<Equipamento[]>([])
  const [totalRows, setTotalRows] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedEquipamento, setSelectedEquipamento] = useState<Equipamento | null>(null)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('edit')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [equipamentoToDelete, setEquipamentoToDelete] = useState<Equipamento | null>(null)

  // Hooks
  const { lang: locale } = useParams()

  // Fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true)
      const result = await equipamentosAPI.list({
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
      console.error('Erro ao carregar equipamentos:', error)
      setData([])
      setTotalRows(0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [pagination.pageIndex, pagination.pageSize])

  // Handle create
  const handleCreate = () => {
    setDialogMode('create')
    setSelectedEquipamento(null)
    setEditDialogOpen(true)
  }

  // Handle edit
  const handleEdit = (equipamento: Equipamento) => {
    setDialogMode('edit')
    setSelectedEquipamento(equipamento)
    setEditDialogOpen(true)
  }

  const handleDialogSuccess = () => {
    setEditDialogOpen(false)
    setSelectedEquipamento(null)
    fetchData()
  }

  // Handle delete
  const handleDeleteClick = (equipamento: Equipamento) => {
    setEquipamentoToDelete(equipamento)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!equipamentoToDelete) return

    try {
      await equipamentosAPI.delete(equipamentoToDelete.id)
      setDeleteDialogOpen(false)
      setEquipamentoToDelete(null)
      fetchData()
    } catch (error) {
      console.error('Erro ao deletar equipamento:', error)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setEquipamentoToDelete(null)
  }

  const columns = useMemo<ColumnDef<EquipamentoWithActionsType, any>[]>(
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
      columnHelper.accessor('numero_interno', {
        header: 'Nº Interno',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.numero_interno || '-'}
          </Typography>
        )
      }),
      columnHelper.accessor('modelo_nome', {
        header: 'Equipamento',
        cell: ({ row }) => (
          <div className='flex items-center gap-4 min-w-[250px]'>
            {row.original.modelo_imagem ? (
              <Avatar
                src={row.original.modelo_imagem}
                sx={{ width: 38, height: 38 }}
                className='rounded bg-actionHover object-cover'
              />
            ) : (
              <CustomAvatar skin='light' size={38}>
                <i className='tabler-device-laptop' />
              </CustomAvatar>
            )}
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.modelo_nome}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {row.original.marca_nome}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('numero_serie', {
        header: 'Série',
        cell: ({ row }) => (
          <Typography color='text.secondary' className='font-mono text-sm'>
            {row.original.numero_serie}
          </Typography>
        )
      }),
      columnHelper.accessor('categoria_nome', {
        header: 'Categoria',
        cell: ({ row }) => {
          const cor = row.original.categoria_cor || '#808080'
          const icone = row.original.categoria_icone || 'tabler-category'

          return (
            <div className='flex items-center gap-3'>
              <CustomAvatar
                skin='light'
                size={30}
                sx={{
                  backgroundColor: `${cor}20`,
                  color: cor
                }}
              >
                <i className={classnames(icone, 'text-lg')} />
              </CustomAvatar>
              <Typography color='text.primary'>{row.original.categoria_nome}</Typography>
            </div>
          )
        }
      }),
      columnHelper.accessor('responsavel_nome', {
        header: 'Responsável',
        cell: ({ row }) => (
          <Typography color='text.secondary'>
            {row.original.responsavel_nome || '-'}
          </Typography>
        )
      }),
      columnHelper.accessor('localizacao', {
        header: 'Localização',
        cell: ({ row }) => (
          <Typography color='text.secondary'>
            {row.original.localizacao || '-'}
          </Typography>
        )
      }),
      columnHelper.accessor('estado', {
        header: 'Estado',
        cell: ({ row }) => {
          const estadoColors: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
            operacional: 'success',
            'em_manutencao': 'warning',
            inativo: 'error',
            descartado: 'error'
          }
          const color = estadoColors[row.original.estado] || 'info'

          return (
            <Chip
              label={row.original.estado.replace('_', ' ')}
              variant='tonal'
              size='small'
              color={color}
            />
          )
        }
      }),
      columnHelper.accessor('actions', {
        header: 'Ações',
        cell: ({ row }) => (
          <div className='flex items-center gap-1'>
            <IconButton size='small' onClick={() => handleEdit(row.original)}>
              <i className='tabler-edit text-[22px] text-textSecondary' />
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
      <CardHeader title='Equipamentos' className='pbe-4' />
      <Divider />
      <div className='flex flex-wrap justify-between gap-4 p-6'>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder='Pesquisar equipamento'
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
            onClick={handleCreate}
          >
            Adicionar Equipamento
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
                  <Typography className='py-10'>Nenhum equipamento encontrado</Typography>
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

      {/* Create/Edit Dialog */}
      <EditEquipamentoDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        equipamento={selectedEquipamento}
        onSuccess={handleDialogSuccess}
        mode={dialogMode}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir o equipamento{' '}
            <strong>
              {equipamentoToDelete?.modelo_nome} ({equipamentoToDelete?.numero_serie})
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

export default EquipamentosTable
