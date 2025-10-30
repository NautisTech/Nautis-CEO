'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports
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
import type { ModeloEquipamento } from '@/libs/api/equipamentos/types'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'
import TablePaginationComponent from '@components/TablePaginationComponent'
import EspecificacoesDialog from './EspecificacoesDialog'
import EditModeloDialog from './EditModeloDialog'

// API Imports
import { modelosAPI, type PaginatedResponse } from '@/libs/api/equipamentos'
import type { ModeloEquipamento } from '@/libs/api/equipamentos/types'

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

type ModeloWithActionsType = ModeloEquipamento & { actions?: string }

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

const columnHelper = createColumnHelper<ModeloWithActionsType>()

const ModelosTable = () => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<ModeloEquipamento[]>([])
  const [totalRows, setTotalRows] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [especDialogOpen, setEspecDialogOpen] = useState(false)
  const [selectedModelo, setSelectedModelo] = useState<ModeloEquipamento | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editMode, setEditMode] = useState<'create' | 'edit'>('create')

  // Hooks
  const { lang: locale } = useParams()

  // Handle especificacoes
  const handleEspecClick = (modelo: ModeloEquipamento) => {
    setSelectedModelo(modelo)
    setEspecDialogOpen(true)
  }

  const handleEspecClose = () => {
    setEspecDialogOpen(false)
    setSelectedModelo(null)
  }

  // Handle create/edit
  const handleCreateClick = () => {
    setSelectedModelo(null)
    setEditMode('create')
    setEditDialogOpen(true)
  }

  const handleEditClick = (modelo: ModeloEquipamento) => {
    setSelectedModelo(modelo)
    setEditMode('edit')
    setEditDialogOpen(true)
  }

  const handleEditClose = () => {
    setEditDialogOpen(false)
    setSelectedModelo(null)
  }

  // Fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true)
      const result = await modelosAPI.list({
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
      console.error('Erro ao carregar modelos:', error)
      setData([])
      setTotalRows(0)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditSuccess = () => {
    fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [pagination.pageIndex, pagination.pageSize])

  const columns = useMemo<ColumnDef<ModeloWithActionsType, any>[]>(
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
      columnHelper.accessor('nome', {
        header: 'Modelo',
        cell: ({ row }) => (
          <div className='flex items-center gap-4 min-w-[250px]'>
            {row.original.imagem_url ? (
              <Avatar
                src={row.original.imagem_url}
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
                {row.original.nome}
              </Typography>
              {row.original.codigo && (
                <Typography variant='body2' color='text.secondary' className='font-mono'>
                  {row.original.codigo}
                </Typography>
              )}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('marca_nome', {
        header: 'Marca',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {row.original.marca_logo ? (
              <Avatar
                src={row.original.marca_logo}
                sx={{ width: 30, height: 30 }}
                className='bg-transparent object-contain'
              />
            ) : (
              <CustomAvatar skin='light' size={30}>
                <i className='tabler-building' />
              </CustomAvatar>
            )}
            <Typography color='text.primary'>{row.original.marca_nome}</Typography>
          </div>
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
      columnHelper.accessor('descricao', {
        header: 'Descrição',
        cell: ({ row }) => (
          <Typography color='text.secondary' className='max-w-[300px] truncate'>
            {row.original.descricao || '-'}
          </Typography>
        )
      }),
      columnHelper.accessor('especificacoes', {
        header: 'Especificações',
        cell: ({ row }) => {
          if (!row.original.especificacoes) {
            return (
              <Typography variant='body2' color='text.disabled'>
                -
              </Typography>
            )
          }

          const espec = row.original.especificacoes
          const truncated = espec.length > 50 ? `${espec.substring(0, 50)}...` : espec

          return (
            <Typography
              variant='body2'
              color='text.secondary'
              className='cursor-pointer hover:underline hover:decoration-primary truncate max-w-[250px]'
              onClick={() => handleEspecClick(row.original)}
            >
              {truncated}
            </Typography>
          )
        },
        size: 250
      }),
      columnHelper.accessor('ativo', {
        header: 'Estado',
        cell: ({ row }) => (
          <Chip
            label={row.original.ativo ? 'Ativo' : 'Inativo'}
            variant='tonal'
            size='small'
            color={row.original.ativo ? 'success' : 'error'}
          />
        )
      }),
      columnHelper.accessor('actions', {
        header: 'Ações',
        cell: ({ row }) => (
          <div className='flex items-center gap-1'>
            <IconButton size='small' onClick={() => handleEditClick(row.original)}>
              <i className='tabler-eye text-[22px] text-textSecondary' />
            </IconButton>
            <IconButton size='small' onClick={() => handleEditClick(row.original)}>
              <i className='tabler-edit text-[22px] text-textSecondary' />
            </IconButton>
            <IconButton size='small'>
              <i className='tabler-trash text-[22px] text-textSecondary' />
            </IconButton>
          </div>
        ),
        enableSorting: false,
        size: 120
      })
    ],
    [locale]
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
      <CardHeader title='Modelos de Equipamento' className='pbe-4' />
      <Divider />
      <div className='flex flex-wrap justify-between gap-4 p-6'>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder='Pesquisar modelo'
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
            onClick={handleCreateClick}
          >
            Adicionar Modelo
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
                  <Typography className='py-10'>Nenhum modelo encontrado</Typography>
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

      {/* Especificacoes Dialog */}
      {selectedModelo && (
        <EspecificacoesDialog
          open={especDialogOpen}
          onClose={handleEspecClose}
          modeloNome={selectedModelo.nome}
          especificacoes={selectedModelo.especificacoes || ''}
        />
      )}

      {/* Edit/Create Dialog */}
      <EditModeloDialog
        open={editDialogOpen}
        onClose={handleEditClose}
        modelo={selectedModelo}
        onSuccess={handleEditSuccess}
        mode={editMode}
      />

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

export default ModelosTable
