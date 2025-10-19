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
import { getDictionary } from '@/utils/getDictionary'
import type { ThemeColor } from '@core/types'
import type { Locale } from '@configs/i18n'
import type { ConteudoResumo, FiltrarConteudosDto, StatusConteudo, CampoPersonalizado, Conteudo } from '@/libs/api/conteudos/types'

// Component Imports
import TableFilters from './TableFilters'
import CustomTextField from '@core/components/mui/TextField'
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Hooks
import { useConteudos, useTiposConteudo, useSchemaTipo } from '@/libs/api/conteudos'

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

type ConteudoWithActionsType = Conteudo & { actions?: string, visibilidade?: string }

type StatusColorType = {
  [key in StatusConteudo]: ThemeColor
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
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// Vars
const statusColorObj: StatusColorType = {
  rascunho: 'secondary',
  publicado: 'success',
  arquivado: 'error',
  agendado: 'warning',
  em_revisao: 'info'
}

const statusLabelObj: Record<StatusConteudo, string> = {
  rascunho: 'Rascunho',
  publicado: 'Publicado',
  arquivado: 'Arquivado',
  agendado: 'Agendado',
  em_revisao: 'Em Revisão'
}

const visibilidadeColorObj: Record<string, ThemeColor> = {
  publica: 'success',
  privada: 'error',
  restrita: 'warning'
}
// Helper para renderizar valor de campo personalizado
const renderCampoPersonalizado = (campo: CampoPersonalizado, valor: any) => {
  if (!valor) return '-'

  switch (campo.tipo) {
    case 'texto':
    case 'textarea':
      return <Typography variant='body2'>{valor.valor_texto || '-'}</Typography>

    case 'numero':
      return <Typography variant='body2'>{valor.valor_numero || '-'}</Typography>

    case 'data':
      return (
        <Typography variant='body2'>
          {valor.valor_data ? new Date(valor.valor_data).toLocaleDateString('pt-PT') : '-'}
        </Typography>
      )

    case 'datetime':
      return (
        <Typography variant='body2'>
          {valor.valor_datetime ? new Date(valor.valor_datetime).toLocaleString('pt-PT') : '-'}
        </Typography>
      )

    case 'boolean':
    case 'checkbox':
      return valor.valor_boolean ? (
        <i className='tabler-check text-success text-xl' />
      ) : (
        <i className='tabler-x text-error text-xl' />
      )

    case 'select':
    case 'radio':
      return <Typography variant='body2'>{valor.valor_texto || '-'}</Typography>

    case 'json':
      return (
        <Typography variant='body2' className='max-w-[200px] truncate'>
          {valor.valor_json ? JSON.stringify(valor.valor_json) : '-'}
        </Typography>
      )

    default:
      return <Typography variant='body2'>-</Typography>
  }
}

// Column Definitions
const columnHelper = createColumnHelper<ConteudoWithActionsType>()

const ConteudoListTable = ({ dictionary, tipo }: { dictionary: Awaited<ReturnType<typeof getDictionary>>, tipo: string }) => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [filters, setFilters] = useState<FiltrarConteudosDto>({})
  const [tipoConteudoId, setTipoConteudoId] = useState<number | null>(null)

  const { lang: locale } = useParams()
  const { data: tipos } = useTiposConteudo()

  useEffect(() => {
    if (!tipos?.length || !tipo) return

    const tipoEncontrado = tipos.find(
      (t) => t.codigo?.toLowerCase() === tipo.toLowerCase()
    )

    if (tipoEncontrado) {
      setTipoConteudoId(tipoEncontrado.id)
    } else {
      console.warn('Nenhum tipo encontrado para', tipo)
    }
  }, [tipos, tipo])


  const { data: schemaData, isLoading: loadingSchema } = useSchemaTipo(tipoConteudoId || 0)
  const camposPersonalizados = schemaData?.campos_personalizados || []

  // Buscar dados da API
  const { data: apiResponse, isLoading } = useConteudos({
    ...filters,
    tipoConteudoId: tipoConteudoId || undefined,
    textoPesquisa: globalFilter || undefined
  })

  const data = apiResponse?.data || []

  // Gerar colunas dinamicamente
  const columns = useMemo<ColumnDef<ConteudoWithActionsType, any>[]>(() => {
    // Colunas base fixas
    const baseColumns: ColumnDef<ConteudoWithActionsType, any>[] = [
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
      columnHelper.accessor('id', {
        header: 'ID',
        cell: ({ row }) => (
          <Typography variant='body2' className='font-mono'>
            #{row.original.id}
          </Typography>
        ),
        size: 60
      }),
      columnHelper.accessor('titulo', {
        header: 'Conteúdo',
        cell: ({ row }) => (
          <div className='flex items-center gap-4 min-w-[250px]'>
            {row.original.imagem_destaque ? (
              <img
                src={row.original.imagem_destaque}
                width={38}
                height={38}
                className='rounded bg-actionHover object-cover'
                alt={row.original.titulo}
              />
            ) : (
              <Avatar sx={{ width: 38, height: 38 }}>
                <i className='tabler-file-text' />
              </Avatar>
            )}
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.titulo}
              </Typography>
              {row.original.subtitulo && (
                <Typography variant='body2' color='text.secondary' className='truncate max-w-[200px]'>
                  {row.original.subtitulo}
                </Typography>
              )}
              {row.original.resumo && (
                <Typography variant='caption' color='text.disabled' className='truncate max-w-[200px]'>
                  {row.original.resumo}
                </Typography>
              )}
            </div>
          </div>
        ),
        size: 300
      }),
      columnHelper.accessor('slug', {
        header: 'Slug',
        cell: ({ row }) => (
          <Typography variant='body2' className='font-mono text-xs'>
            {row.original.slug}
          </Typography>
        ),
        size: 150
      }),
      columnHelper.accessor('categoria_nome', {
        header: 'Categoria',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.categoria_nome || '-'}
          </Typography>
        ),
        size: 120
      })
    ]

    // Adicionar colunas de campos personalizados dinamicamente
    const customColumns: ColumnDef<ConteudoWithActionsType, any>[] = camposPersonalizados.map((campo: CampoPersonalizado) => ({
      id: `custom_${campo.codigo}`,
      header: campo.nome,
      cell: ({ row }: any) => {
        const valores = row.original.campos_personalizados || []
        const valor = valores.find((v: any) => v.codigo_campo === campo.codigo)
        return renderCampoPersonalizado(campo, valor)
      },
      enableSorting: false,
      size: 150
    }))

    // Colunas adicionais
    const additionalColumns: ColumnDef<ConteudoWithActionsType, any>[] = [
      columnHelper.accessor('autor_nome', {
        header: 'Autor',
        cell: ({ row }) => (
          <Typography variant='body2'>{row.original.autor_nome}</Typography>
        ),
        size: 120
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            label={statusLabelObj[row.original.status]}
            variant='tonal'
            color={statusColorObj[row.original.status]}
            size='small'
          />
        ),
        size: 110
      }),
      columnHelper.accessor('destaque', {
        header: 'Destaque',
        cell: ({ row }) => (
          <Tooltip title={row.original.destaque ? 'Em destaque' : 'Normal'}>
            {row.original.destaque ? (
              <i className='tabler-star-filled text-warning text-xl' />
            ) : (
              <i className='tabler-star text-xl' />
            )}
          </Tooltip>
        ),
        enableSorting: false,
        size: 80
      }),
      columnHelper.accessor('visibilidade', {
        header: 'Visibilidade',
        cell: ({ row }) => row.original.visibilidade ? (
          <Chip
            label={row.original.visibilidade}
            variant='tonal'
            color={visibilidadeColorObj[row.original.visibilidade] || 'default'}
            size='small'
          />
        ) : '-',
        size: 110
      }),
      columnHelper.accessor('ordem', {
        header: 'Ordem',
        cell: ({ row }) => (
          <Typography variant='body2' className='text-center'>
            {row.original.ordem || '-'}
          </Typography>
        ),
        size: 70
      }),
      columnHelper.accessor('visualizacoes', {
        header: 'Views',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <i className='tabler-eye text-xl' />
            <Typography variant='body2'>{row.original.visualizacoes}</Typography>
          </div>
        ),
        size: 90
      }),
      columnHelper.accessor('total_comentarios', {
        header: 'Comentários',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <i className='tabler-message-circle text-xl' />
            <Typography variant='body2'>{row.original.total_comentarios}</Typography>
          </div>
        ),
        size: 110
      }),
      columnHelper.accessor('total_favoritos', {
        header: 'Favoritos',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <i className='tabler-heart text-xl' />
            <Typography variant='body2'>{row.original.total_favoritos}</Typography>
          </div>
        ),
        size: 100
      }),
      columnHelper.accessor('permite_comentarios', {
        header: 'Comentários?',
        cell: ({ row }) => (
          <Tooltip title={row.original.permite_comentarios ? 'Permite comentários' : 'Não permite'}>
            {row.original.permite_comentarios ? (
              <i className='tabler-message-check text-success text-xl' />
            ) : (
              <i className='tabler-message-off text-error text-xl' />
            )}
          </Tooltip>
        ),
        enableSorting: false,
        size: 100
      }),
      columnHelper.accessor('data_inicio', {
        header: 'Data Início',
        cell: ({ row }) => row.original.data_inicio ? (
          <Typography variant='body2'>
            {new Date(row.original.data_inicio).toLocaleDateString('pt-PT')}
          </Typography>
        ) : '-',
        size: 100
      }),
      columnHelper.accessor('data_fim', {
        header: 'Data Fim',
        cell: ({ row }) => row.original.data_fim ? (
          <Typography variant='body2'>
            {new Date(row.original.data_fim).toLocaleDateString('pt-PT')}
          </Typography>
        ) : '-',
        size: 100
      }),
      columnHelper.accessor('publicado_em', {
        header: 'Publicado Em',
        cell: ({ row }) => row.original.publicado_em ? (
          <Typography variant='body2'>
            {new Date(row.original.publicado_em).toLocaleString('pt-PT')}
          </Typography>
        ) : '-',
        size: 150
      }),
      columnHelper.accessor('criado_em', {
        header: 'Criado Em',
        cell: ({ row }) => (
          <Typography variant='body2'>
            {new Date(row.original.criado_em).toLocaleString('pt-PT')}
          </Typography>
        ),
        size: 150
      }),
      columnHelper.accessor('atualizado_em', {
        header: 'Atualizado Em',
        cell: ({ row }) => row.original.atualizado_em ? (
          <Typography variant='body2'>
            {new Date(row.original.atualizado_em).toLocaleString('pt-PT')}
          </Typography>
        ) : '-',
        size: 150
      }),
      columnHelper.accessor('actions', {
        header: 'Ações',
        cell: ({ row }) => (
          <div className='flex items-center gap-1'>
            <IconButton
              size='small'
              component={Link}
              href={getLocalizedUrl(`/apps/conteudos/${tipo}/edit/${row.original.id}`, locale as Locale)}
            >
              <i className='tabler-edit text-[22px] text-textSecondary' />
            </IconButton>
            <OptionMenu
              iconButtonProps={{ size: 'small' }}
              iconClassName='text-[22px] text-textSecondary'
              options={[
                {
                  text: 'Ver',
                  icon: 'tabler-eye',
                  href: getLocalizedUrl(`/apps/conteudos/${tipo}/view/${row.original.id}`, locale as Locale)
                },
                {
                  text: 'Duplicar',
                  icon: 'tabler-copy'
                },
                { text: 'Divider' as any },
                {
                  text: 'Arquivar',
                  icon: 'tabler-archive',
                  menuItemProps: {
                    className: 'text-error'
                  }
                }
              ]}
            />
          </div>
        ),
        enableSorting: false,
        size: 100
      })
    ]

    return [...baseColumns, ...customColumns, ...additionalColumns]
  }, [data, locale, tipo, camposPersonalizados])

  const table = useReactTable({
    data: data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
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
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  if (loadingSchema) {
    return (
      <Card className='flex items-center justify-center p-10'>
        <CircularProgress />
        <Typography className='mli-4'>A carregar configuração...</Typography>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader title='Filtros' />
      <TableFilters onFilterChange={setFilters} dictionary={dictionary} />
      <Divider />
      <div className='flex flex-wrap justify-between gap-4 p-6'>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder='Pesquisar conteúdo...'
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
            startIcon={<i className='tabler-upload' />}
          >
            Exportar
          </Button>
          <Button
            variant='contained'
            component={Link}
            className='max-sm:is-full is-auto'
            href={getLocalizedUrl(`/apps/conteudos/${tipo}/add`, locale as Locale)}
            startIcon={<i className='tabler-plus' />}
          >
            Adicionar Conteúdo
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
          {isLoading ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center py-8'>
                  <div className='flex items-center justify-center gap-2'>
                    <CircularProgress size={24} />
                    <Typography>A carregar...</Typography>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : table.getFilteredRowModel().rows.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center py-8'>
                  <Typography>Nenhum conteúdo encontrado</Typography>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table
                .getRowModel()
                .rows.slice(0, table.getState().pagination.pageSize)
                .map(row => {
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
      <TablePagination
        component={() => <TablePaginationComponent table={table} />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
      />
    </Card>
  )
}

export default ConteudoListTable