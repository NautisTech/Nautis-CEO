'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

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
import type { Intervencao } from '@/libs/api/intervencoes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// API Imports
import { intervencoesAPI } from '@/libs/api/intervencoes'

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

const IntervencoesList = () => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<Intervencao[]>([])
  const [totalRows, setTotalRows] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  // Hooks
  const router = useRouter()
  const { lang: locale } = useParams()

  // Fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true)
      const result = await intervencoesAPI.list({
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
      console.error('Erro ao carregar intervenções:', error)
      setData([])
      setTotalRows(0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [pagination.pageIndex, pagination.pageSize])

  // Refresh data when component mounts or window gets focus
  useEffect(() => {
    const handleFocus = () => {
      fetchData()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const getTipoColor = (tipo: string): 'info' | 'warning' | 'success' | 'secondary' | 'default' => {
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

  const getStatusColor = (
    status: string
  ): 'warning' | 'info' | 'success' | 'error' | 'default' => {
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
        return 'default'
    }
  }

  const formatCurrency = (value?: number) => {
    if (!value) return '—'
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-PT')
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '—'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const handleView = (id: number) => {
    router.push(getLocalizedUrl(`/apps/suporte/intervencoes/${id}`, locale as Locale))
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
        header: 'Número',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.numero_intervencao}
          </Typography>
        )
      }),
      columnHelper.accessor('titulo', {
        header: 'Intervenção',
        cell: ({ row }) => (
          <div className='flex flex-col gap-1 min-w-[200px]'>
            <Typography className='font-medium' color='text.primary'>
              {row.original.titulo}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {row.original.equipamento_nome}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('tipo', {
        header: 'Tipo',
        cell: ({ row }) => (
          <Chip
            label={row.original.tipo.charAt(0).toUpperCase() + row.original.tipo.slice(1)}
            variant='tonal'
            size='small'
            color={getTipoColor(row.original.tipo)}
          />
        )
      }),
      columnHelper.accessor('status', {
        header: 'Estado',
        cell: ({ row }) => (
          <Chip
            label={row.original.status.replace('_', ' ').toUpperCase()}
            variant='tonal'
            size='small'
            color={getStatusColor(row.original.status)}
          />
        )
      }),
      columnHelper.accessor('tecnico_nome', {
        header: 'Técnico',
        cell: ({ row }) => (
          <Typography color='text.secondary'>{row.original.tecnico_nome || '—'}</Typography>
        )
      }),
      columnHelper.accessor('data_inicio', {
        header: 'Data Início',
        cell: ({ row }) => (
          <Typography color='text.secondary'>{formatDate(row.original.data_inicio)}</Typography>
        )
      }),
      columnHelper.accessor('duracao_minutos', {
        header: 'Duração',
        cell: ({ row }) => (
          <Typography color='text.secondary'>
            {formatDuration(row.original.duracao_minutos)}
          </Typography>
        )
      }),
      columnHelper.accessor('custo_total', {
        header: 'Custo Total',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {formatCurrency(row.original.custo_total)}
          </Typography>
        )
      }),
      columnHelper.accessor('actions', {
        header: 'Ações',
        cell: ({ row }) => (
          <div className='flex items-center gap-1'>
            <IconButton size='small' onClick={() => handleView(row.original.id)}>
              <i className='tabler-eye text-[22px] text-textSecondary' />
            </IconButton>
          </div>
        ),
        enableSorting: false,
        size: 100
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
      <CardHeader title='Intervenções' className='pbe-4' />
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
            color='secondary'
            variant='tonal'
            className='max-sm:is-full is-auto'
            startIcon={<i className='tabler-refresh' />}
            onClick={fetchData}
          >
            Atualizar
          </Button>
          <Button
            variant='contained'
            className='max-sm:is-full is-auto'
            startIcon={<i className='tabler-plus' />}
            component={Link}
            href={getLocalizedUrl('/apps/suporte/intervencoes/create', locale as Locale)}
          >
            Adicionar Intervenção
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

export default IntervencoesList
