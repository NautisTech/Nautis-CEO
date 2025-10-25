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
import Avatar from '@mui/material/Avatar'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'
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
import type { ThemeColor } from '@core/types'
import type { Locale } from '@configs/i18n'

// Component Imports
import AddUserDrawerNew from './AddUserDrawerNew'
import CustomTextField from '@core/components/mui/TextField'
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomAvatar from '@core/components/mui/Avatar'

// API Imports
import { usersAPI } from '@/libs/api/users/api'
import type { UserListItem } from '@/libs/api/users/types'

// Util Imports
import { getInitials } from '@/utils/getInitials'
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

type UserWithActionsType = UserListItem & { actions?: string }

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
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// Column Definitions
const columnHelper = createColumnHelper<UserWithActionsType>()

const UserListTableV2 = () => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [data, setData] = useState<UserListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [addUserOpen, setAddUserOpen] = useState(false)

  const { lang: locale } = useParams()

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await usersAPI.list({
        page: page + 1,
        pageSize,
        search: globalFilter || undefined
      })

      setData(response.data)
      setTotal(response.total)
    } catch (error) {
      console.error('Erro ao carregar utilizadores:', error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [page, pageSize, globalFilter])

  const handleDeleteUser = async (id: number) => {
    if (confirm('Deseja realmente desativar este utilizador?')) {
      try {
        await usersAPI.delete(id)
        fetchUsers()
      } catch (error) {
        console.error('Erro ao desativar utilizador:', error)
      }
    }
  }

  const handleUserCreated = () => {
    setAddUserOpen(false)
    fetchUsers()
  }

  // Columns
  const columns = useMemo<ColumnDef<UserWithActionsType, any>[]>(
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
        ),
        size: 50
      },
      columnHelper.accessor('username', {
        header: 'Utilizador',
        cell: ({ row }) => (
          <div className='flex items-center gap-4 min-w-[200px]'>
            <CustomAvatar src={row.original.foto_url} alt={row.original.username} size={38}>
              {getInitials(row.original.username)}
            </CustomAvatar>
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.username}
              </Typography>
              <Typography variant='body2' color='text.secondary' className='text-xs'>
                {row.original.email}
              </Typography>
            </div>
          </div>
        ),
        size: 250
      }),
      columnHelper.accessor('telefone', {
        header: 'Telefone',
        cell: ({ row }) => (
          <Typography variant='body2' color='text.secondary'>
            {row.original.telefone || '-'}
          </Typography>
        ),
        size: 130
      }),
      columnHelper.accessor('total_grupos', {
        header: 'Grupos',
        cell: ({ row }) => (
          <Chip label={`${row.original.total_grupos} grupos`} size='small' variant='tonal' color='primary' />
        ),
        size: 110
      }),
      columnHelper.accessor('email_verificado', {
        header: 'Email',
        cell: ({ row }) => (
          <Chip
            label={row.original.email_verificado ? 'Verificado' : 'Não verificado'}
            size='small'
            variant='tonal'
            color={row.original.email_verificado ? 'success' : 'warning'}
          />
        ),
        size: 130
      }),
      columnHelper.accessor('ativo', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            label={row.original.ativo ? 'Ativo' : 'Inativo'}
            size='small'
            variant='tonal'
            color={row.original.ativo ? 'success' : 'error'}
          />
        ),
        size: 100
      }),
      columnHelper.accessor('ultimo_acesso', {
        header: 'Último Acesso',
        cell: ({ row }) => (
          <Typography variant='body2' color='text.secondary'>
            {row.original.ultimo_acesso
              ? new Date(row.original.ultimo_acesso).toLocaleDateString('pt-PT', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
              : 'Nunca'}
          </Typography>
        ),
        size: 150
      }),
      columnHelper.accessor('criado_em', {
        header: 'Criado em',
        cell: ({ row }) => (
          <Typography variant='body2' color='text.secondary'>
            {new Date(row.original.criado_em).toLocaleDateString('pt-PT', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}
          </Typography>
        ),
        size: 120
      }),
      {
        id: 'actions',
        header: 'Ações',
        cell: ({ row }) => (
          <div className='flex items-center gap-0.5'>
            {row.original.funcionario_id && (
              <Tooltip title='Ficha de Funcionário'>
                <IconButton size='small' component={Link} href={getLocalizedUrl(`/apps/funcionario/${row.original.funcionario_id}`, locale as Locale)}>
                  <i className='tabler-id text-[22px] text-textSecondary' />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title='Ver'>
              <IconButton size='small' component={Link} href={getLocalizedUrl(`/apps/user/view/${row.original.id}`, locale as Locale)}>
                <i className='tabler-eye text-[22px] text-textSecondary' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Editar'>
              <IconButton size='small' component={Link} href={getLocalizedUrl(`/apps/user/edit/${row.original.id}`, locale as Locale)}>
                <i className='tabler-edit text-[22px] text-textSecondary' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Eliminar'>
              <IconButton size='small' onClick={() => handleDeleteUser(row.original.id)}>
                <i className='tabler-trash text-[22px] text-textSecondary' />
              </IconButton>
            </Tooltip>
          </div>
        ),
        enableSorting: false,
        size: 120
      }
    ],
    [data, locale]
  )

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination: true,
    pageCount: Math.ceil(total / pageSize)
  })

  return (
    <>
      <Card>
        <CardHeader title='Utilizadores' className='pbe-4' />
        <Divider />
        <div className='flex justify-between flex-col items-start sm:flex-row sm:items-center gap-4 p-6'>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Pesquisar Utilizador'
            className='max-sm:is-full sm:is-auto'
          />
          <div className='flex items-center gap-4 max-sm:flex-col max-sm:is-full'>
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => setAddUserOpen(true)}
              className='max-sm:is-full'
            >
              Adicionar Utilizador
            </Button>
          </div>
        </div>
        <div className='overflow-x-auto'>
          {loading ? (
            <div className='flex justify-center items-center min-h-[400px]'>
              <CircularProgress />
            </div>
          ) : (
            <table className={tableStyles.table}>
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} style={{ width: header.getSize() }}>
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
              {table.getFilteredRowModel().rows.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                      Nenhum resultado encontrado
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
          )}
        </div>
        <TablePagination
          component='div'
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={e => {
            setPageSize(parseInt(e.target.value, 10))
            setPage(0)
          }}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Card>

      <AddUserDrawerNew open={addUserOpen} onClose={() => setAddUserOpen(false)} onUserCreated={handleUserCreated} />
    </>
  )
}

export default UserListTableV2
