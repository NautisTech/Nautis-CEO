'use client'

import { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Divider from '@mui/material/Divider'

import { intervencoesCustosAPI } from '@/libs/api/intervencoes-custos'
import type { IntervencaoCusto } from '@/libs/api/intervencoes-custos'
import AddCustoDialog from './AddCustoDialog'

type Props = {
  viewOnly: boolean
  intervencaoId?: number
}

const IntervencaoCustos = ({ viewOnly, intervencaoId }: Props) => {
  const { watch } = useFormContext()
  const [custos, setCustos] = useState<IntervencaoCusto[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCusto, setEditingCusto] = useState<IntervencaoCusto | null>(null)

  useEffect(() => {
    if (intervencaoId) {
      fetchCustos()
    }
  }, [intervencaoId])

  const fetchCustos = async () => {
    if (!intervencaoId) return

    try {
      const data = await intervencoesCustosAPI.list(intervencaoId)
      setCustos(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Erro ao carregar custos:', error)
    }
  }

  const handleAddCusto = () => {
    setEditingCusto(null)
    setDialogOpen(true)
  }

  const handleEditCusto = (custo: IntervencaoCusto) => {
    setEditingCusto(custo)
    setDialogOpen(true)
  }

  const handleDeleteCusto = async (id: number) => {
    if (!confirm('Tem certeza que deseja remover este custo?')) return

    try {
      await intervencoesCustosAPI.delete(id)
      fetchCustos()
    } catch (error) {
      console.error('Erro ao remover custo:', error)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value)
  }

  const custoTotal = custos.reduce((sum, custo) => sum + custo.valor_total, 0)

  return (
    <>
      <Card>
        <CardHeader
          title='Custos e Peças'
          action={
            !viewOnly &&
            intervencaoId && (
              <Button size='small' onClick={handleAddCusto} startIcon={<i className='tabler-plus' />}>
                Adicionar Custo
              </Button>
            )
          }
        />
        <CardContent>
          {!intervencaoId ? (
            <Typography variant='body2' color='text.secondary'>
              Guarde a intervenção primeiro para adicionar custos
            </Typography>
          ) : custos.length === 0 ? (
            <Typography variant='body2' color='text.secondary'>
              Nenhum custo adicionado
            </Typography>
          ) : (
            <>
              <TableContainer>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Descrição</TableCell>
                      <TableCell align='right'>Qtd</TableCell>
                      <TableCell align='right'>Valor Unit.</TableCell>
                      <TableCell align='right'>Total</TableCell>
                      {!viewOnly && <TableCell align='center'>Ações</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {custos.map(custo => (
                      <TableRow key={custo.id}>
                        <TableCell>
                          <div>
                            <Typography variant='body2'>{custo.descricao}</Typography>
                            {custo.codigo && (
                              <Typography variant='caption' color='text.secondary'>
                                Cód: {custo.codigo}
                              </Typography>
                            )}
                            {custo.fornecedor_nome && (
                              <Typography variant='caption' color='text.secondary' display='block'>
                                Forn: {custo.fornecedor_nome}
                              </Typography>
                            )}
                          </div>
                        </TableCell>
                        <TableCell align='right'>{custo.quantidade}</TableCell>
                        <TableCell align='right'>{formatCurrency(custo.valor_unitario)}</TableCell>
                        <TableCell align='right'>
                          <Typography fontWeight='bold'>{formatCurrency(custo.valor_total)}</Typography>
                        </TableCell>
                        {!viewOnly && (
                          <TableCell align='center'>
                            <IconButton size='small' onClick={() => handleEditCusto(custo)}>
                              <i className='tabler-edit' />
                            </IconButton>
                            <IconButton size='small' color='error' onClick={() => handleDeleteCusto(custo.id)}>
                              <i className='tabler-trash' />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider className='my-4' />

              <div className='flex justify-between items-center'>
                <Typography variant='h6'>Custo Total</Typography>
                <Typography variant='h6' color='primary'>
                  {formatCurrency(custoTotal)}
                </Typography>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {intervencaoId && (
        <AddCustoDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSuccess={fetchCustos}
          intervencaoId={intervencaoId}
          custo={editingCusto}
        />
      )}
    </>
  )
}

export default IntervencaoCustos
