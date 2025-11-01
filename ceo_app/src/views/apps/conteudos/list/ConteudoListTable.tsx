'use client'

// React Imports
import { useEffect, useMemo, useState, useCallback } from 'react'

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
import Switch from '@mui/material/Switch'
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
import type {
  ConteudoResumo,
  FiltrarConteudosDto,
  StatusConteudo,
  CampoPersonalizado,
  Conteudo
} from '@/libs/api/conteudos/types'
import type { ImageVariants } from '@/libs/api/conteudos/types'

// Component Imports
import TableFilters from './TableFilters'
import CustomTextField from '@core/components/mui/TextField'
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'
import OptimizedImage from '@/components/OptimizedImage'
import CustomAvatar from '@core/components/mui/Avatar'

// API Imports
import { conteudosAPI } from '@/libs/api/conteudos/api'

// Hooks
import { useTiposConteudo, useSchemaTipo } from '@/libs/api/conteudos'

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

type ConteudoWithActionsType = ConteudoResumo & { actions?: string; visibilidade?: string; variants?: ImageVariants | null }

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

// Mapear tipos antigos para novos
const normalizarTipo = (tipo: string): string => {
  const mapeamento: Record<string, string> = {
    text: 'texto',
    url: 'texto',
    email: 'texto',
    tel: 'texto',
    number: 'numero',
    date: 'data',
    datetime: 'datetime',
    'datetime-local': 'datetime',
    checkbox: 'checkbox',
    boolean: 'boolean',
    select: 'select',
    radio: 'radio',
    textarea: 'textarea',
    json: 'json'
  }

  return mapeamento[tipo] || tipo
}

// Column Definitions
const columnHelper = createColumnHelper<ConteudoWithActionsType>()

const ConteudoListTable = ({
  dictionary,
  tipo
}: {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  tipo: string
}) => {
  const statusLabelObj: Record<StatusConteudo, string> = {
    rascunho: dictionary['conteudos']?.filter.status.draft,
    publicado: dictionary['conteudos']?.filter.status.published,
    arquivado: dictionary['conteudos']?.filter.status.archived,
    agendado: dictionary['conteudos']?.filter.status.scheduled,
    em_revisao: dictionary['conteudos']?.filter.status.underReview
  }

  // States
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [filters, setFilters] = useState<FiltrarConteudosDto>({})
  const [tipoConteudoId, setTipoConteudoId] = useState<number | null>(null)
  const [data, setData] = useState<ConteudoResumo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { lang: locale } = useParams()
  const { data: tipos } = useTiposConteudo()

  useEffect(() => {
    if (!tipos?.length || !tipo) return

    const tipoEncontrado = tipos.find(t => t.codigo?.toLowerCase() === tipo.toLowerCase())

    if (tipoEncontrado) {
      setTipoConteudoId(tipoEncontrado.id)
    }
  }, [tipos, tipo])

  const { data: schemaData, isLoading: loadingSchema } = useSchemaTipo(tipoConteudoId || 0)
  const camposPersonalizados = schemaData?.campos_personalizados || []

  // Fetch data manual
  const fetchData = useCallback(async () => {
    if (!tipoConteudoId) return

    try {
      setIsLoading(true)
      const result = await conteudosAPI.listar({
        ...filters,
        tipoConteudoId,
        textoPesquisa: globalFilter || undefined
      })
      setData(result.data || [])
    } catch (error) {
      console.error('Erro ao carregar conteúdos:', error)
      setData([])
    } finally {
      setIsLoading(false)
    }
  }, [tipoConteudoId, filters, globalFilter])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Handler para toggle destaque
  const handleToggleDestaque = useCallback(async (conteudoId: number) => {
    try {
      await conteudosAPI.toggleDestaque(conteudoId)
      fetchData()
    } catch (error) {
      console.error('Erro ao alterar destaque:', error)
    }
  }, [fetchData])

  // Handler para duplicar
  const handleDuplicar = useCallback(async (conteudoId: number) => {
    try {
      await conteudosAPI.duplicar(conteudoId)
      fetchData()
    } catch (error) {
      console.error('Erro ao duplicar conteúdo:', error)
    }
  }, [fetchData])

  // Handler para arquivar
  const handleArquivar = useCallback(async (conteudoId: number) => {
    if (confirm('Deseja realmente arquivar este conteúdo?')) {
      try {
        await conteudosAPI.arquivar(conteudoId)
        fetchData()
      } catch (error) {
        console.error('Erro ao arquivar conteúdo:', error)
      }
    }
  }, [fetchData])

  // Handler para mudança de filtros individuais
  const handleFilterChange = useCallback((newFilter: Partial<FiltrarConteudosDto>) => {
    setFilters(prev => ({ ...prev, ...newFilter }))
  }, [])

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
      columnHelper.accessor('titulo', {
        header: dictionary['conteudos']?.table.columns.content,
        cell: ({ row }) => (
          <div className='flex items-center gap-4 min-w-[250px]'>
            {row.original.imagem_destaque ? (
              /* Usar OptimizedImage com thumbnail */
              <OptimizedImage
                src={row.original.imagem_destaque}
                alt={row.original.titulo}
                variants={row.original.variants} // Se tiver
                size='thumbnail'
                width={38}
                height={38}
                className='rounded bg-actionHover object-cover w-[38px] h-[38px]'
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
            </div>
          </div>
        ),
        size: 300
      }),
      columnHelper.accessor('slug', {
        header: dictionary['conteudos']?.table.columns.slug,
        cell: ({ row }) => (
          <Typography variant='body2' className='font-mono text-xs'>
            {row.original.slug}
          </Typography>
        ),
        size: 150
      }),
      columnHelper.accessor('categoria_nome', {
        header: dictionary['conteudos']?.table.columns.category,
        cell: ({ row }) => {
          if (!row.original.categoria_nome) return <Typography color='text.secondary'>-</Typography>

          const cor = row.original.categoria_cor || '#808080'

          return (
            <div className='flex items-center gap-3'>
              {row.original.categoria_icone && (
                <CustomAvatar
                  skin='light'
                  size={30}
                  sx={{
                    backgroundColor: `${cor}20`,
                    color: cor
                  }}
                >
                  <i className={classnames(row.original.categoria_icone, 'text-lg')} />
                </CustomAvatar>
              )}
              <Typography color='text.primary'>{row.original.categoria_nome}</Typography>
            </div>
          )
        },
        size: 150
      })
    ]

    // Adicionar colunas de campos personalizados dinamicamente
    const customColumns: ColumnDef<ConteudoWithActionsType, any>[] = camposPersonalizados.map(
      (campo: CampoPersonalizado) => ({
        id: `custom_${campo.codigo}`,
        header:
          ((dictionary?.conteudos?.table?.custom as Record<string, string> | undefined)?.[
            String(campo.codigo).toLowerCase()
          ] as string | undefined) ?? campo.nome,
        cell: ({ row }: any) => {
          const valores = row.original.campos_personalizados || []
          // Match codigo_campo case-insensitively
          const valor = valores.find(
            (v: any) => String(v.codigo_campo || '').toLowerCase() === String(campo.codigo || '').toLowerCase()
          )

          if (!valor) return '-'

          const campoNormalizado = { ...campo, tipo: normalizarTipo(campo.tipo) }
          return renderCampoPersonalizado(campoNormalizado as CampoPersonalizado, valor)
        },
        enableSorting: false,
        size: 150
      })
    )

    // Colunas adicionais
    const additionalColumns: ColumnDef<ConteudoWithActionsType, any>[] = [
      columnHelper.accessor('autor_nome', {
        header: dictionary['conteudos']?.table.columns.author,
        cell: ({ row }) => <Typography variant='body2'>{row.original.autor_nome}</Typography>,
        size: 120
      }),
      columnHelper.accessor('status', {
        header: dictionary['conteudos']?.table.columns.status,
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
        header: dictionary['conteudos']?.table.columns.featured,
        cell: ({ row }) => (
          <Switch
            checked={row.original.destaque}
            onChange={() => handleToggleDestaque(row.original.id)}
            size='small'
          />
        ),
        enableSorting: false,
        size: 80
      }),
      columnHelper.accessor('visualizacoes', {
        header: dictionary['conteudos']?.table.columns.views,
        cell: ({ row }) => (
          <Chip
            icon={<i className='tabler-eye' />}
            label={row.original.visualizacoes}
            size='small'
            variant='tonal'
            color='success'
          />
        ),
        size: 110
      }),
      columnHelper.accessor('total_comentarios', {
        header: dictionary['conteudos']?.table.columns.comments,
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Chip
              icon={<i className='tabler-message-circle' />}
              label={row.original.total_comentarios}
              size='small'
              variant='tonal'
              color='info'
            />
          </div>
        ),
        size: 110
      }),
      columnHelper.accessor('total_favoritos', {
        header: dictionary['conteudos']?.table.columns.favorites,
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Chip
              icon={<i className='tabler-heart' />}
              label={row.original.total_favoritos}
              size='small'
              variant='tonal'
              color='error'
            />
          </div>
        ),
        size: 100
      }),
      columnHelper.accessor('tipo_permite_comentarios', {
        header: dictionary['conteudos']?.table.columns.commentsQuestion,
        cell: ({ row }) => {
          const tipoPermiteComentarios = row.original.tipo_permite_comentarios ?? true

          return (
            <Switch
              checked={row.original.tipo_permite_comentarios}
              size='small'
              disabled={!tipoPermiteComentarios}
            />
          )
        },
        enableSorting: false,
        size: 100
      }),
      columnHelper.accessor('data_inicio', {
        header: dictionary['conteudos']?.table.columns.startDate,
        cell: ({ row }) =>
          row.original.data_inicio ? (
            <Typography variant='body2'>{new Date(row.original.data_inicio).toLocaleDateString('pt-PT')}</Typography>
          ) : (
            '-'
          ),
        size: 100
      }),
      columnHelper.accessor('data_fim', {
        header: dictionary['conteudos']?.table.columns.endDate,
        cell: ({ row }) =>
          row.original.data_fim ? (
            <Typography variant='body2'>{new Date(row.original.data_fim).toLocaleDateString('pt-PT')}</Typography>
          ) : (
            '-'
          ),
        size: 100
      }),
      columnHelper.accessor('publicado_em', {
        header: dictionary['conteudos']?.table.columns.publishedAt,
        cell: ({ row }) =>
          row.original.publicado_em ? (
            <Typography variant='body2'>{new Date(row.original.publicado_em).toLocaleString('pt-PT')}</Typography>
          ) : (
            '-'
          ),
        size: 150
      }),
      columnHelper.accessor('criado_em', {
        header: dictionary['conteudos']?.table.columns.createdAt,
        cell: ({ row }) => (
          <Typography variant='body2'>{new Date(row.original.criado_em).toLocaleString('pt-PT')}</Typography>
        ),
        size: 150
      }),
      columnHelper.accessor('atualizado_em', {
        header: dictionary['conteudos']?.table.columns.updatedAt,
        cell: ({ row }) =>
          row.original.atualizado_em ? (
            <Typography variant='body2'>{new Date(row.original.atualizado_em).toLocaleString('pt-PT')}</Typography>
          ) : (
            '-'
          ),
        size: 150
      }),
      columnHelper.accessor('actions', {
        header: dictionary['conteudos']?.table.columns.actions,
        cell: ({ row }) => (
          <div className='flex items-center gap-1'>
            <IconButton
              size='small'
              component={Link}
              href={getLocalizedUrl(`/apps/conteudos/${tipo}/view/${row.original.id}`, locale as Locale)}
            >
              <i className='tabler-eye text-[22px] text-textSecondary' />
            </IconButton>
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
                  text: dictionary['conteudos']?.actions.duplicate || 'Duplicar',
                  icon: 'tabler-copy',
                  menuItemProps: {
                    onClick: () => handleDuplicar(row.original.id)
                  }
                },
                {
                  text: dictionary['conteudos']?.actions.archive || 'Arquivar',
                  icon: 'tabler-archive',
                  menuItemProps: {
                    className: 'text-error',
                    onClick: () => handleArquivar(row.original.id)
                  }
                }
              ]}
            />
          </div>
        ),
        enableSorting: false,
        size: 120
      })
    ]

    return [...baseColumns, ...customColumns, ...additionalColumns]
  }, [locale, tipo, camposPersonalizados, dictionary, statusLabelObj, handleToggleDestaque, handleDuplicar, handleArquivar])

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
        <Typography className='mli-4'>{dictionary['conteudos']?.actions.loadingConfig}</Typography>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader title='Filtros' />
      <TableFilters onFilterChange={handleFilterChange} dictionary={dictionary} />
      <Divider />
      <div className='flex flex-wrap justify-between gap-4 p-6'>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder={dictionary['conteudos']?.actions.searchPlaceholder}
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
            component={Link}
            className='max-sm:is-full is-auto'
            href={getLocalizedUrl(`/apps/conteudos/${tipo}/add`, locale as Locale)}
            startIcon={<i className='tabler-plus' />}
          >
            {dictionary['conteudos']?.actions.add}
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
                    <Typography>{dictionary['conteudos']?.actions.loading}</Typography>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : table.getFilteredRowModel().rows.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center py-8'>
                  <Typography>{dictionary['conteudos']?.actions.noResults}</Typography>
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
