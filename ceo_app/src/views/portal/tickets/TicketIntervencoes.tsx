'use client'

// React Imports
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid2'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Link from '@mui/material/Link'

// Type Imports
import type { Locale } from '@configs/i18n'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// API Imports
import { portalAPI } from '@/libs/api/portal'

interface Custo {
  id: number
  descricao: string
  codigo: string | null
  quantidade: number
  valor_unitario: number
  valor_total: number
}

interface Anexo {
  id: number
  nome: string
  descricao: string | null
  tipo: string
  tamanho: number
  caminho: string
  criado_em: string
}

interface Intervencao {
  id: number
  numero_intervencao: string
  titulo: string
  descricao: string
  tipo: string
  status: string
  tecnico_nome: string
  data_inicio: string
  data_fim: string | null
  custo_total: number
  precisa_aprovacao_cliente: boolean
  aprovacao_cliente: boolean
  custos?: Custo[]
  anexos?: Anexo[]
}

const TicketIntervencoesPortal = () => {
  const router = useRouter()
  const { lang: locale, id: ticketId } = useParams()
  const [intervencoes, setIntervencoes] = useState<Intervencao[]>([])
  const [loading, setLoading] = useState(true)
  const [processando, setProcessando] = useState<number | null>(null)

  const fetchIntervencoes = async () => {
    try {
      const data = await portalAPI.listarIntervencoesTicket(Number(ticketId))
      setIntervencoes(data)
    } catch (error) {
      console.error('Erro ao carregar intervenções:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIntervencoes()
  }, [ticketId])

  const handleBack = () => {
    router.push(getLocalizedUrl('/apps/portal/tickets', locale as Locale))
  }

  const handleAprovar = async (intervencaoId: number) => {
    try {
      setProcessando(intervencaoId)
      await portalAPI.aprovarIntervencao(intervencaoId)
      // Recarregar intervenções
      await fetchIntervencoes()
    } catch (error) {
      console.error('Erro ao aprovar intervenção:', error)
    } finally {
      setProcessando(null)
    }
  }

  const handleRejeitar = async (intervencaoId: number) => {
    try {
      setProcessando(intervencaoId)
      await portalAPI.rejeitarIntervencao(intervencaoId)
      // Recarregar intervenções
      await fetchIntervencoes()
    } catch (error) {
      console.error('Erro ao rejeitar intervenção:', error)
    } finally {
      setProcessando(null)
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'corretiva':
        return 'error'
      case 'preventiva':
        return 'success'
      case 'instalacao':
        return 'info'
      default:
        return 'default'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluida':
        return 'success'
      case 'em_progresso':
        return 'warning'
      case 'agendada':
        return 'info'
      case 'cancelada':
        return 'error'
      default:
        return 'default'
    }
  }

  if (loading) {
    return <Typography>Carregando...</Typography>
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader
            title={`Intervenções do Ticket #${ticketId}`}
            action={
              <Button
                variant='text'
                color='secondary'
                startIcon={<i className='tabler-arrow-left' />}
                onClick={handleBack}
              >
                Voltar
              </Button>
            }
          />
          <Divider />
          <CardContent>
            {intervencoes.length === 0 ? (
              <div className='text-center py-12'>
                <i className='tabler-tools text-6xl text-textDisabled mb-4' />
                <Typography variant='h6' color='text.secondary'>
                  Nenhuma intervenção registada
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Este ticket ainda não possui intervenções
                </Typography>
              </div>
            ) : (
              <Grid container spacing={4}>
                {intervencoes.map((intervencao) => (
                  <Grid key={intervencao.id} size={{ xs: 12 }}>
                    <Card variant='outlined'>
                      <CardContent>
                        <div className='flex items-start justify-between mb-4'>
                          <div className='flex items-center gap-3'>
                            <Typography variant='h6'>{intervencao.numero_intervencao}</Typography>
                            <Chip
                              label={intervencao.tipo}
                              color={getTipoColor(intervencao.tipo)}
                              size='small'
                              variant='tonal'
                            />
                            <Chip
                              label={intervencao.status}
                              color={getStatusColor(intervencao.status)}
                              size='small'
                              variant='tonal'
                            />
                            {intervencao.precisa_aprovacao_cliente && !intervencao.aprovacao_cliente && (
                              <Chip label='Aprovação Pendente' color='warning' size='small' variant='tonal' />
                            )}
                          </div>
                        </div>

                        <Grid container spacing={3}>
                          <Grid size={{ xs: 12 }}>
                            <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                              Título
                            </Typography>
                            <Typography variant='body1' className='font-medium'>
                              {intervencao.titulo}
                            </Typography>
                          </Grid>

                          {intervencao.descricao && (
                            <Grid size={{ xs: 12 }}>
                              <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                                Descrição
                              </Typography>
                              <Typography variant='body2'>{intervencao.descricao}</Typography>
                            </Grid>
                          )}

                          <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                              Técnico
                            </Typography>
                            <Typography variant='body2'>{intervencao.tecnico_nome}</Typography>
                          </Grid>

                          <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                              Data Início
                            </Typography>
                            <Typography variant='body2'>
                              {new Date(intervencao.data_inicio).toLocaleString('pt-PT')}
                            </Typography>
                          </Grid>

                          {intervencao.data_fim && (
                            <Grid size={{ xs: 12, md: 4 }}>
                              <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                                Data Fim
                              </Typography>
                              <Typography variant='body2'>
                                {new Date(intervencao.data_fim).toLocaleString('pt-PT')}
                              </Typography>
                            </Grid>
                          )}

                          {intervencao.custo_total > 0 && (
                            <Grid size={{ xs: 12, md: 4 }}>
                              <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                                Custo Total
                              </Typography>
                              <Typography variant='body2' className='font-medium'>
                                {new Intl.NumberFormat('pt-PT', {
                                  style: 'currency',
                                  currency: 'EUR'
                                }).format(intervencao.custo_total)}
                              </Typography>
                            </Grid>
                          )}

                          {/* Lista de Custos Detalhada */}
                          {intervencao.custos && intervencao.custos.length > 0 && (
                            <Grid size={{ xs: 12 }}>
                              <Divider className='my-3' />
                              <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                                Detalhamento de Custos
                              </Typography>
                              <TableContainer component={Paper} variant='outlined' className='mt-2'>
                                <Table size='small'>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Código</TableCell>
                                      <TableCell>Descrição</TableCell>
                                      <TableCell align='right'>Quantidade</TableCell>
                                      <TableCell align='right'>Valor Unitário</TableCell>
                                      <TableCell align='right'>Valor Total</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {intervencao.custos.map((custo) => (
                                      <TableRow key={custo.id}>
                                        <TableCell>{custo.codigo || '-'}</TableCell>
                                        <TableCell>{custo.descricao}</TableCell>
                                        <TableCell align='right'>{custo.quantidade}</TableCell>
                                        <TableCell align='right'>
                                          {new Intl.NumberFormat('pt-PT', {
                                            style: 'currency',
                                            currency: 'EUR'
                                          }).format(custo.valor_unitario)}
                                        </TableCell>
                                        <TableCell align='right'>
                                          {new Intl.NumberFormat('pt-PT', {
                                            style: 'currency',
                                            currency: 'EUR'
                                          }).format(custo.valor_total)}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Grid>
                          )}

                          {/* Lista de Anexos */}
                          {intervencao.anexos && intervencao.anexos.length > 0 && (
                            <Grid size={{ xs: 12 }}>
                              <Divider className='my-3' />
                              <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                                Anexos
                              </Typography>
                              <div className='flex flex-col gap-2 mt-2'>
                                {intervencao.anexos.map((anexo) => (
                                  <Card key={anexo.id} variant='outlined'>
                                    <CardContent className='flex items-center justify-between p-3'>
                                      <div className='flex items-center gap-3'>
                                        <i className='tabler-file text-2xl text-textSecondary' />
                                        <div>
                                          <Typography variant='body2' className='font-medium'>
                                            {anexo.nome}
                                          </Typography>
                                          {anexo.descricao && (
                                            <Typography variant='caption' color='text.secondary'>
                                              {anexo.descricao}
                                            </Typography>
                                          )}
                                          <Typography variant='caption' color='text.secondary' className='block'>
                                            {(anexo.tamanho / 1024).toFixed(2)} KB • {new Date(anexo.criado_em).toLocaleDateString('pt-PT')}
                                          </Typography>
                                        </div>
                                      </div>
                                      <Link href={anexo.caminho} target='_blank' rel='noopener noreferrer'>
                                        <IconButton size='small'>
                                          <i className='tabler-download' />
                                        </IconButton>
                                      </Link>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </Grid>
                          )}

                          {intervencao.precisa_aprovacao_cliente && !intervencao.aprovacao_cliente && (
                            <Grid size={{ xs: 12 }}>
                              <Divider className='my-2' />
                              <div className='flex items-center justify-between'>
                                <Typography variant='body2' color='warning.main'>
                                  Esta intervenção requer a sua aprovação
                                </Typography>
                                <div className='flex gap-2'>
                                  <Button
                                    variant='outlined'
                                    color='error'
                                    size='small'
                                    disabled={processando === intervencao.id}
                                    onClick={() => handleRejeitar(intervencao.id)}
                                  >
                                    {processando === intervencao.id ? 'A processar...' : 'Rejeitar'}
                                  </Button>
                                  <Button
                                    variant='contained'
                                    color='success'
                                    size='small'
                                    disabled={processando === intervencao.id}
                                    onClick={() => handleAprovar(intervencao.id)}
                                  >
                                    {processando === intervencao.id ? 'A processar...' : 'Aprovar'}
                                  </Button>
                                </div>
                              </div>
                            </Grid>
                          )}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default TicketIntervencoesPortal
