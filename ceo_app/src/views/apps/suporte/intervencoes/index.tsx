'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid2'

// Third-party Imports
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'

// Component Imports
import { intervencoesAPI } from '@/libs/api/intervencoes'
import type { Intervencao, IntervencoesEstatisticas } from '@/libs/api/intervencoes'
import TablePaginationComponent from '@/components/TablePaginationComponent'

// Filter function
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const columnHelper = createColumnHelper<Intervencao>()

const IntervencoesPage = () => {
  const [intervencoes, setIntervencoes] = useState<Intervencao[]>([])
  const [stats, setStats] = useState<IntervencoesEstatisticas | null>(null)
  const [loading, setLoading] = useState(true)
  const [globalFilter, setGlobalFilter] = useState('')
  const [tipoFilter, setTipoFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchData()
  }, [tipoFilter, statusFilter])

  const fetchData = async () => {
    try {
      const [intervencoesData, statsData] = await Promise.all([
        intervencoesAPI.list({
          tipo: tipoFilter || undefined,
          status: statusFilter || undefined
        }),
        intervencoesAPI.getEstatisticas()
      ])

      setIntervencoes(Array.isArray(intervencoesData) ? intervencoesData : [])
      setStats(statsData)
    } catch (error) {
      console.error('Erro ao carregar intervenções:', error)
    } finally {
      setLoading(false)
    }
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

  const getStatusColor = (status: string) => {
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

  const columns = useMemo<ColumnDef<Intervencao, any>[]>(
    () => [
      columnHelper.accessor('numero_intervencao', {
        header: 'Número',
        cell: ({ row }) => (
          <Typography
            component='a'
            href={`/apps/suporte/intervencoes/${row.original.id}`}
            color='primary'
            className='font-medium hover:underline'
          >
            {row.original.numero_intervencao}
          </Typography>
        )
      }),
      columnHelper.accessor('titulo', {
        header: 'Título',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography className='font-medium'>{row.original.titulo}</Typography>
            {row.original.numero_ticket && (
              <Typography variant='caption' color='text.secondary'>
                Ticket: {row.original.numero_ticket}
              </Typography>
            )}
          </div>
        )
      }),
      columnHelper.accessor('tipo', {
        header: 'Tipo',
        cell: ({ row }) => (
          <Chip label={row.original.tipo.toUpperCase()} color={getTipoColor(row.original.tipo)} size='small' />
        )
      }),
      columnHelper.accessor('equipamento_nome', {
        header: 'Equipamento',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography variant='body2'>{row.original.equipamento_numero}</Typography>
            <Typography variant='caption' color='text.secondary'>
              {row.original.equipamento_nome}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('tecnico_nome', {
        header: 'Técnico',
        cell: ({ row }) => <Typography variant='body2'>{row.original.tecnico_nome}</Typography>
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            label={row.original.status.toUpperCase().replace('_', ' ')}
            color={getStatusColor(row.original.status)}
            size='small'
          />
        )
      }),
      columnHelper.accessor('data_inicio', {
        header: 'Data Início',
        cell: ({ row }) => (
          <Typography variant='body2'>{new Date(row.original.data_inicio).toLocaleDateString('pt-PT')}</Typography>
        )
      }),
      columnHelper.accessor('custo_total', {
        header: 'Custo Total',
        cell: ({ row }) => <Typography variant='body2'>{formatCurrency(row.original.custo_total)}</Typography>
      })
    ],
    []
  )

  const table = useReactTable({
    data: intervencoes,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      globalFilter
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10
      }
    }
  })

  if (loading) {
    return <Typography>Carregando...</Typography>
  }

  return (
    <div className='flex flex-col gap-6'>
      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent className='flex flex-col gap-2'>
                <Typography variant='h4'>{stats.total}</Typography>
                <Typography variant='body2' color='text.secondary'>
                  Total de Intervenções
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent className='flex flex-col gap-2'>
                <Typography variant='h4'>{stats.em_progresso}</Typography>
                <Typography variant='body2' color='text.secondary'>
                  Em Progresso
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent className='flex flex-col gap-2'>
                <Typography variant='h4'>{stats.concluidas}</Typography>
                <Typography variant='body2' color='text.secondary'>
                  Concluídas
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent className='flex flex-col gap-2'>
                <Typography variant='h4'>{formatCurrency(stats.custo_total)}</Typography>
                <Typography variant='body2' color='text.secondary'>
                  Custo Total
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Main Table */}
      <Card>
        <CardHeader
          title='Intervenções'
          action={
            <Button
              variant='contained'
              href='/apps/suporte/intervencoes/create'
              startIcon={<i className='tabler-plus' />}
            >
              Nova Intervenção
            </Button>
          }
        />
        <CardContent>
          <div className='flex items-center gap-4 mb-4'>
            <TextField
              fullWidth
              size='small'
              placeholder='Pesquisar intervenções...'
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
            />
            <TextField
              select
              size='small'
              label='Tipo'
              value={tipoFilter}
              onChange={e => setTipoFilter(e.target.value)}
              className='min-w-[150px]'
            >
              <MenuItem value=''>Todos</MenuItem>
              <MenuItem value='preventiva'>Preventiva</MenuItem>
              <MenuItem value='corretiva'>Corretiva</MenuItem>
              <MenuItem value='instalacao'>Instalação</MenuItem>
              <MenuItem value='configuracao'>Configuração</MenuItem>
              <MenuItem value='upgrade'>Upgrade</MenuItem>
              <MenuItem value='manutencao'>Manutenção</MenuItem>
            </TextField>
            <TextField
              select
              size='small'
              label='Status'
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className='min-w-[150px]'
            >
              <MenuItem value=''>Todos</MenuItem>
              <MenuItem value='agendada'>Agendada</MenuItem>
              <MenuItem value='em_progresso'>Em Progresso</MenuItem>
              <MenuItem value='concluida'>Concluída</MenuItem>
              <MenuItem value='cancelada'>Cancelada</MenuItem>
            </TextField>
          </div>

          <div className='overflow-x-auto'>
            <table className='min-w-full'>
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className='px-4 py-2 text-left'>
                        {header.isPlaceholder ? null : (
                          <div
                            className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className='border-t'>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className='px-4 py-3'>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {table.getRowModel().rows.length === 0 && (
            <div className='text-center py-8'>
              <Typography color='text.secondary'>Nenhuma intervenção encontrada</Typography>
            </div>
          )}

          <TablePaginationComponent table={table} />
        </CardContent>
      </Card>
    </div>
  )
}

export default IntervencoesPage
