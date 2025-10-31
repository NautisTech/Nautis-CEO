'use client'

import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

import CustomAvatar from '@core/components/mui/Avatar'
import { portalAPI } from '@/libs/api/portal'
import type { ContaCorrente, Transacao, FiltrarTransacoesDto } from '@/libs/api/portal/types'

const ContaCorrentePage = () => {
  const [contaCorrente, setContaCorrente] = useState<ContaCorrente | null>(null)
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalTransacoes, setTotalTransacoes] = useState(0)

  // Filtros
  const [filtros, setFiltros] = useState<FiltrarTransacoesDto>({})
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')

  const theme = useTheme()

  useEffect(() => {
    fetchData()
  }, [page, rowsPerPage, filtros])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch conta corrente summary
      const ccData = await portalAPI.obterContaCorrente()
      setContaCorrente(ccData)

      // Fetch transações with filters
      const transacoesData = await portalAPI.listarTransacoes({
        ...filtros,
        page: page + 1,
        pageSize: rowsPerPage
      })

      setTransacoes(transacoesData.data)
      setTotalTransacoes(transacoesData.meta.total)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const aplicarFiltros = () => {
    setFiltros({
      ...filtros,
      data_inicio: dataInicio || undefined,
      data_fim: dataFim || undefined
    })
    setPage(0)
  }

  const limparFiltros = () => {
    setFiltros({})
    setDataInicio('')
    setDataFim('')
    setPage(0)
  }

  const getTipoTransacaoColor = (tipo: string) => {
    switch (tipo) {
      case 'credito':
      case 'recebimento':
      case 'receita':
        return 'success'
      case 'debito':
      case 'pagamento':
      case 'despesa':
        return 'error'
      default:
        return 'default'
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'confirmado':
        return 'success'
      case 'pendente':
        return 'warning'
      case 'cancelado':
        return 'error'
      default:
        return 'default'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value)
  }

  if (loading && !contaCorrente) {
    return <Typography>A carregar...</Typography>
  }

  return (
    <Grid container spacing={6}>
      {/* Header */}
      <Grid size={{ xs: 12 }}>
        <Typography variant='h4'>Conta Corrente</Typography>
        <Typography variant='body2' color='text.secondary'>
          Consulte o seu saldo e histórico de transações
        </Typography>
      </Grid>

      {/* Summary Cards */}
      {contaCorrente && (
        <>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent className='flex flex-col gap-2'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <CustomAvatar color='primary' variant='rounded'>
                      <i className='tabler-wallet' />
                    </CustomAvatar>
                    <div>
                      <Typography variant='caption' color='text.secondary'>
                        Saldo Atual
                      </Typography>
                      <Typography variant='h5'>
                        {formatCurrency(contaCorrente.saldo_atual || 0)}
                      </Typography>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent className='flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                  <CustomAvatar color='success' variant='rounded'>
                    <i className='tabler-arrow-up' />
                  </CustomAvatar>
                  <div>
                    <Typography variant='caption' color='text.secondary'>
                      Total Créditos
                    </Typography>
                    <Typography variant='h6'>
                      {formatCurrency(contaCorrente.total_creditos || 0)}
                    </Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent className='flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                  <CustomAvatar color='error' variant='rounded'>
                    <i className='tabler-arrow-down' />
                  </CustomAvatar>
                  <div>
                    <Typography variant='caption' color='text.secondary'>
                      Total Débitos
                    </Typography>
                    <Typography variant='h6'>
                      {formatCurrency(contaCorrente.total_debitos || 0)}
                    </Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>

          {contaCorrente.transacoes_pendentes > 0 && (
            <Grid size={{ xs: 12 }}>
              <Card sx={{ backgroundColor: 'warning.light' }}>
                <CardContent>
                  <div className='flex items-center gap-2'>
                    <CustomAvatar color='warning' variant='rounded'>
                      <i className='tabler-clock' />
                    </CustomAvatar>
                    <div>
                      <Typography variant='body1' fontWeight='bold'>
                        {contaCorrente.transacoes_pendentes} transações pendentes
                      </Typography>
                      <Typography variant='body2'>
                        Valor pendente: {formatCurrency(contaCorrente.valor_pendente || 0)}
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          )}
        </>
      )}

      {/* Filtros */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Filtros' />
          <CardContent>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Transação</InputLabel>
                  <Select
                    value={filtros.tipo_transacao || ''}
                    label='Tipo de Transação'
                    onChange={(e) => setFiltros({ ...filtros, tipo_transacao: e.target.value || undefined })}
                  >
                    <MenuItem value=''>Todos</MenuItem>
                    <MenuItem value='credito'>Crédito</MenuItem>
                    <MenuItem value='debito'>Débito</MenuItem>
                    <MenuItem value='pagamento'>Pagamento</MenuItem>
                    <MenuItem value='recebimento'>Recebimento</MenuItem>
                    <MenuItem value='despesa'>Despesa</MenuItem>
                    <MenuItem value='receita'>Receita</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={filtros.estado || ''}
                    label='Estado'
                    onChange={(e) => setFiltros({ ...filtros, estado: e.target.value || undefined })}
                  >
                    <MenuItem value=''>Todos</MenuItem>
                    <MenuItem value='confirmado'>Confirmado</MenuItem>
                    <MenuItem value='pendente'>Pendente</MenuItem>
                    <MenuItem value='cancelado'>Cancelado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  label='Data Início'
                  type='date'
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  label='Data Fim'
                  type='date'
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <div className='flex gap-2'>
                  <button
                    onClick={aplicarFiltros}
                    className='px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark'
                  >
                    Aplicar Filtros
                  </button>
                  <button
                    onClick={limparFiltros}
                    className='px-4 py-2 border rounded hover:bg-gray-100'
                  >
                    Limpar
                  </button>
                </div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Tabela de Transações */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Histórico de Transações' />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Documento</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align='right'>Valor</TableCell>
                  <TableCell align='right'>Saldo</TableCell>
                  <TableCell align='center'>Itens</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transacoes.length > 0 ? (
                  transacoes.map((transacao) => (
                    <TableRow key={transacao.id} hover>
                      <TableCell>
                        {new Date(transacao.data_transacao).toLocaleDateString('pt-PT')}
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>{transacao.descricao || '-'}</Typography>
                        {transacao.observacoes && (
                          <Typography variant='caption' color='text.secondary'>
                            {transacao.observacoes}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>{transacao.documento || '-'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transacao.tipo_transacao}
                          color={getTipoTransacaoColor(transacao.tipo_transacao)}
                          size='small'
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transacao.estado || 'confirmado'}
                          color={getEstadoColor(transacao.estado || 'confirmado')}
                          size='small'
                          variant='outlined'
                        />
                      </TableCell>
                      <TableCell align='right'>
                        <Typography
                          variant='body2'
                          fontWeight='bold'
                          color={
                            ['credito', 'recebimento', 'receita'].includes(transacao.tipo_transacao)
                              ? 'success.main'
                              : 'error.main'
                          }
                        >
                          {['credito', 'recebimento', 'receita'].includes(transacao.tipo_transacao) ? '+' : '-'}
                          {formatCurrency(transacao.valor)}
                        </Typography>
                      </TableCell>
                      <TableCell align='right'>
                        {transacao.saldo_apos ? formatCurrency(transacao.saldo_apos) : '-'}
                      </TableCell>
                      <TableCell align='center'>
                        {transacao.itens && transacao.itens.length > 0 ? (
                          <Tooltip
                            title={
                              <div>
                                {transacao.itens.map((item, idx) => (
                                  <div key={idx}>
                                    {item.item_tipo}: {item.item_referencia || item.item_id}
                                    {item.descricao && ` - ${item.descricao}`}
                                  </div>
                                ))}
                              </div>
                            }
                          >
                            <Chip label={transacao.itens.length} size='small' />
                          </Tooltip>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align='center'>
                      <Typography variant='body2' color='text.secondary'>
                        Nenhuma transação encontrada
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component='div'
            count={totalTransacoes}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage='Linhas por página:'
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default ContaCorrentePage
