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
import type { Marca } from '@/libs/api/equipamentos/types'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'
import TablePaginationComponent from '@components/TablePaginationComponent'
import EditMarcaDialog from './EditMarcaDialog'
import LeituraCodigoDialog from './LeituraCodigoDialog'

// API Imports
import { marcasAPI, type PaginatedResponse } from '@/libs/api/equipamentos'
import type { Marca } from '@/libs/api/equipamentos/types'

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

type MarcaWithActionsType = Marca & { actions?: string }

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

const columnHelper = createColumnHelper<MarcaWithActionsType>()

const MarcasTable = () => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<Marca[]>([])
  const [totalRows, setTotalRows] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedMarca, setSelectedMarca] = useState<Marca | null>(null)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('edit')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [marcaToDelete, setMarcaToDelete] = useState<Marca | null>(null)
  const [leituraDialogOpen, setLeituraDialogOpen] = useState(false)
  const [marcaLeitura, setMarcaLeitura] = useState<Marca | null>(null)

  // Hooks
  const { lang: locale } = useParams()

  // Fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true)
      const result = await marcasAPI.list({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize
      })

      console.log('API Result:', result)

      if ('data' in result) {
        // Resposta paginada
        console.log('Paginada - Total:', result.total, 'Data length:', result.data.length)
        setData(result.data)
        setTotalRows(result.total)
      } else {
        // Resposta sem paginação (fallback)
        console.log('Sem paginação - Length:', result.length)
        setData(result)
        setTotalRows(result.length)
      }
    } catch (error) {
      console.error('Erro ao carregar marcas:', error)
      setData([])
      setTotalRows(0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [pagination.pageIndex, pagination.pageSize])

  useEffect(() => {
    console.log('TotalRows updated:', totalRows)
    console.log('Pagination state:', pagination)
    console.log('PageCount:', Math.ceil(totalRows / pagination.pageSize))
  }, [totalRows, pagination])

  // Handle create
  const handleCreate = () => {
    setDialogMode('create')
    setSelectedMarca(null)
    setEditDialogOpen(true)
  }

  // Handle edit
  const handleEdit = (marca: Marca) => {
    setDialogMode('edit')
    setSelectedMarca(marca)
    setEditDialogOpen(true)
  }

  const handleDialogSuccess = () => {
    setEditDialogOpen(false)
    setSelectedMarca(null)
    fetchData()
  }

  // Handle delete
  const handleDeleteClick = (marca: Marca) => {
    setMarcaToDelete(marca)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!marcaToDelete) return

    try {
      await marcasAPI.delete(marcaToDelete.id)
      setDeleteDialogOpen(false)
      setMarcaToDelete(null)
      fetchData()
    } catch (error) {
      console.error('Erro ao deletar marca:', error)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setMarcaToDelete(null)
  }

  // Handle leitura
  const handleLeituraClick = (marca: Marca) => {
    setMarcaLeitura(marca)
    setLeituraDialogOpen(true)
  }

  const handleLeituraClose = () => {
    setLeituraDialogOpen(false)
    setMarcaLeitura(null)
  }

  const columns = useMemo<ColumnDef<MarcaWithActionsType, any>[]>(
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
        header: 'Marca',
        cell: ({ row }) => (
          <div className='flex items-center gap-4 min-w-[250px]'>
            {row.original.logo_url ? (
              <Avatar
                src={row.original.logo_url}
                sx={{ width: 38, height: 38 }}
                className='bg-transparent object-contain p-1'
              />
            ) : (
              <CustomAvatar skin='light' size={38}>
                <i className='tabler-building' />
              </CustomAvatar>
            )}
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.nome}
              </Typography>
              {row.original.website && (
                <a
                  href={row.original.website}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary hover:underline'
                >
                  <Typography variant='body2' color='primary' className='truncate max-w-[200px]'>
                    {row.original.website}
                  </Typography>
                </a>
              )}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('total_modelos', {
        header: 'Total de Modelos',
        cell: ({ row }) => (
          <Typography color='text.secondary'>
            {row.original.total_modelos || 0}
          </Typography>
        )
      }),
      columnHelper.accessor('codigo_leitura', {
        header: 'Leitura',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            {row.original.codigo_leitura && (
              <IconButton
                size='small'
                onClick={() => handleLeituraClick(row.original)}
                title='Ver código de leitura'
              >
                <i className='tabler-eye text-[22px] text-textSecondary' />
              </IconButton>
            )}
            <IconButton
              size='small'
              disabled
              title='Funcionalidade em desenvolvimento'
            >
              <i className='tabler-qrcode text-[22px] text-textSecondary' />
            </IconButton>
          </div>
        )
      }),
      columnHelper.accessor('email_suporte', {
        header: 'Suporte',
        cell: ({ row }) => (
          <div className='flex flex-col gap-1'>
            {row.original.email_suporte && (
              <Typography variant='body2' color='text.secondary'>
                {row.original.email_suporte}
              </Typography>
            )}
            {row.original.telefone_suporte && (
              <Typography variant='body2' color='text.secondary'>
                {row.original.telefone_suporte}
              </Typography>
            )}
            {row.original.link_suporte && (
              <a
                href={row.original.link_suporte}
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary hover:underline'
              >
                <Typography variant='body2' color='primary' className='truncate max-w-[200px]'>
                  {row.original.link_suporte}
                </Typography>
              </a>
            )}
            {!row.original.email_suporte && !row.original.telefone_suporte && !row.original.link_suporte && (
              <Typography variant='body2' color='text.disabled'>
                -
              </Typography>
            )}
          </div>
        )
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
    state: {
      rowSelection,
      pagination
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  })

  return (
    <Card>
      <CardHeader title='Marcas de Equipamentos' className='pbe-4' />
      <Divider />
      <div className='flex flex-wrap justify-between gap-4 p-6'>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder='Pesquisar marca'
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
            Adicionar Marca
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
                  <Typography className='py-10'>Nenhuma marca encontrada</Typography>
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
      <EditMarcaDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        marca={selectedMarca}
        onSuccess={handleDialogSuccess}
        mode={dialogMode}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir a marca <strong>{marcaToDelete?.nome}</strong>?
            {marcaToDelete?.total_modelos && marcaToDelete.total_modelos > 0 && (
              <Typography color='error' className='mbs-2'>
                Atenção: Esta marca possui {marcaToDelete.total_modelos} modelo(s) associado(s).
              </Typography>
            )}
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

      {/* Leitura Codigo Dialog */}
      {marcaLeitura && (
        <LeituraCodigoDialog
          open={leituraDialogOpen}
          onClose={handleLeituraClose}
          codigo={marcaLeitura.codigo_leitura || ''}
          tipo={marcaLeitura.tipo_leitura || 'qrcode'}
          marcaNome={marcaLeitura.nome}
        />
      )}

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

export default MarcasTable
