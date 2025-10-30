'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'

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
import { getDictionary } from '@/utils/getDictionary'
import type { ThemeColor } from '@core/types'
import type { Locale } from '@configs/i18n'
import type { Funcionario } from '@/libs/api/funcionarios/types'

// Component Imports
import TableFilters from './TableFilters'
import CustomTextField from '@core/components/mui/TextField'
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomAvatar from '@core/components/mui/Avatar'

// API Imports
import { funcionariosAPI } from '@/libs/api/funcionarios/api'

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

type FuncionarioWithActionsType = Funcionario & { actions?: string }

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

const columnHelper = createColumnHelper<FuncionarioWithActionsType>()

const FuncionarioListTable = ({
  dictionary,
  tipo
}: {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  tipo?: string
}) => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<Funcionario[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })
  const [totalRows, setTotalRows] = useState(0)
  const [tipoFuncionarioId, setTipoFuncionarioId] = useState<number | undefined>()
  const [ativo, setAtivo] = useState<boolean | undefined>()

  // Hooks
  const { lang: locale } = useParams()
  const searchParams = useSearchParams()

  // Buscar ID do tipo a partir do código quando o tipo mudar
  useEffect(() => {
    const fetchTipoId = async () => {
      if (!tipo) {
        setTipoFuncionarioId(undefined)
        return
      }

      try {
        const tipos = await funcionariosAPI.getTiposFuncionario()
        const tipoEncontrado = tipos.find(t => t.codigo?.toLowerCase() === tipo.toLowerCase())

        if (tipoEncontrado) {
          setTipoFuncionarioId(tipoEncontrado.id)
        } else {
          setTipoFuncionarioId(undefined)
        }
      } catch (error) {
        console.error(dictionary['funcionarios'].typeFetchError, error)
        setTipoFuncionarioId(undefined)
      }
    }

    fetchTipoId()
  }, [tipo])

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        const filters: any = {
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          textoPesquisa: globalFilter || undefined
        }

        if (tipoFuncionarioId !== undefined) {
          filters.tipoFuncionarioId = tipoFuncionarioId
        }

        if (ativo !== undefined) {
          filters.ativo = ativo
        }

        const response = await funcionariosAPI.list(filters)

        setData(response.data || [])
        setTotalRows(response.total || 0)
      } catch (error) {
        console.error(dictionary['funcionarios'].fetchError, error)
        setData([])
        setTotalRows(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [pagination, globalFilter, tipoFuncionarioId, ativo])

  // Handler para ativar/desativar funcionário
  const handleToggleAtivo = async (funcionarioId: number, currentAtivo: boolean) => {
    const action = currentAtivo ? 'desativar' : 'ativar'
    if (!confirm(`Tem certeza que deseja ${action} este funcionário?`)) return

    try {
      await funcionariosAPI.toggleAtivo(funcionarioId)

      // Atualizar a lista
      setData(prevData =>
        prevData.map(f => (f.id === funcionarioId ? { ...f, ativo: !currentAtivo } : f))
      )
    } catch (error) {
      console.error(`Erro ao ${action} funcionário:`, error)
    }
  }

  const columns = useMemo<ColumnDef<FuncionarioWithActionsType, any>[]>(
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
      columnHelper.accessor('numero', {
        header: dictionary['funcionarios'].table.number,
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            #{row.original.numero}
          </Typography>
        )
      }),
      columnHelper.accessor('nome_completo', {
        header: dictionary['funcionarios'].table.name,
        cell: ({ row }) => (
          <div className='flex items-center gap-4 min-w-[250px]'>
            {row.original.foto_url ? (
              <Avatar
                src={row.original.foto_url}
                sx={{ width: 38, height: 38 }}
                className='rounded bg-actionHover object-cover'
              />
            ) : (
              <CustomAvatar skin='light' size={38}>
                {row.original.nome_completo?.charAt(0)?.toUpperCase() || 'F'}
              </CustomAvatar>
            )}
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.nome_completo}
              </Typography>
              {row.original.nome_abreviado && (
                <Typography variant='body2' color='text.secondary' className='truncate max-w-[200px]'>
                  {row.original.nome_abreviado}
                </Typography>
              )}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('tipo_funcionario_nome', {
        header: dictionary['funcionarios'].table.type,
        cell: ({ row }) => {
          const tipoNome = row.original.tipo_funcionario_nome || row.original.tipo_funcionario

          if (!tipoNome) return <Typography color='text.secondary'>-</Typography>

          const cor = row.original.tipo_funcionario_cor || '#808080'
          const icone = row.original.tipo_funcionario_icone || 'tabler-user'

          // Se a cor for um nome de cor do tema MUI, usar Chip
          const coresTema = ['primary', 'secondary', 'error', 'warning', 'info', 'success']
          if (coresTema.includes(cor)) {
            return <Chip label={tipoNome} variant='tonal' size='small' color={cor as ThemeColor} />
          }

          // Caso contrário, usar Typography com Avatar colorido (como em categorias)
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
              <Typography color='text.primary'>{tipoNome}</Typography>
            </div>
          )
        }
      }),
      columnHelper.accessor('email', {
        header: dictionary['funcionarios'].table.email,
        cell: ({ row }) => <Typography color='text.secondary'>{row.original.email || '-'}</Typography>
      }),
      columnHelper.accessor('telefone', {
        header: dictionary['funcionarios'].table.phone,
        cell: ({ row }) => <Typography color='text.secondary'>{row.original.telefone || '-'}</Typography>
      }),
      columnHelper.accessor('ativo', {
        header: dictionary['funcionarios'].table.status,
        cell: ({ row }) => (
          <Chip
            label={
              row.original.ativo
                ? dictionary['funcionarios'].filters.active
                : dictionary['funcionarios'].filters.inactive
            }
            variant='tonal'
            size='small'
            color={row.original.ativo ? 'success' : 'error'}
          />
        )
      }),
      columnHelper.accessor('actions', {
        header: dictionary['funcionarios'].table.actions,
        cell: ({ row }) => (
          <div className='flex items-center gap-1'>
            <IconButton
              size='small'
              component={Link}
              href={getLocalizedUrl(`/apps/funcionario/${row.original.id}`, locale as Locale)}
            >
              <i className='tabler-eye text-[22px] text-textSecondary' />
            </IconButton>
            <IconButton
              size='small'
              component={Link}
              href={getLocalizedUrl(`/apps/funcionario/${row.original.id}?edit=true`, locale as Locale)}
            >
              <i className='tabler-edit text-[22px] text-textSecondary' />
            </IconButton>
            <OptionMenu
              iconButtonProps={{ size: 'small' }}
              iconClassName='text-[22px] text-textSecondary'
              options={[
                {
                  text: row.original.ativo
                    ? dictionary['funcionarios'].table.deactivate
                    : dictionary['funcionarios'].table.activate || 'Ativar',
                  icon: row.original.ativo ? 'tabler-user-off' : 'tabler-user-check',
                  menuItemProps: {
                    className: row.original.ativo ? 'text-error' : 'text-success',
                    onClick: () => handleToggleAtivo(row.original.id, row.original.ativo)
                  }
                }
              ]}
            />
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
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter,
      pagination
    },
    pageCount: Math.ceil(totalRows / pagination.pageSize),
    manualPagination: true,
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
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <Card>
      <CardHeader title={dictionary['funcionarios'].title} className='pbe-4' />
      <TableFilters
        setTipoFuncionarioId={setTipoFuncionarioId}
        setAtivo={setAtivo}
        tipoFuncionarioId={tipoFuncionarioId}
        ativo={ativo}
        dictionary={dictionary}
      />
      <Divider />
      <div className='flex flex-wrap justify-between gap-4 p-6'>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder={dictionary['funcionarios'].searchEmployee}
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
            component={Link}
            className='max-sm:is-full is-auto'
            href={getLocalizedUrl('/apps/funcionario/create', locale as Locale)}
            startIcon={<i className='tabler-plus' />}
          >
            {dictionary['funcionarios'].addEmployee}
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
                  <Typography className='py-10'>{dictionary['funcionarios']?.noEmployeesFound}</Typography>
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
              {table
                .getRowModel()
                .rows.slice(0, table.getState().pagination.pageSize)
                .map(row => (
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
        component={() => (
          <TablePaginationComponent table={table} totalRows={totalRows} onPaginationChange={setPagination} />
        )}
        count={totalRows}
        rowsPerPage={pagination.pageSize}
        page={pagination.pageIndex}
        onPageChange={(_, page) => {
          setPagination(prev => ({ ...prev, pageIndex: page }))
        }}
        onRowsPerPageChange={e => {
          setPagination(prev => ({ ...prev, pageSize: parseInt(e.target.value, 10), pageIndex: 0 }))
        }}
      />
    </Card>
  )
}

export default FuncionarioListTable
