'use client'

import { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

import { intervencoesCustosAPI } from '@/libs/api/intervencoes-custos'
import type { IntervencaoCusto } from '@/libs/api/intervencoes-custos'
import AddCustoDialog from './add/AddCustoDialog'

interface CustosDialogProps {
  open: boolean
  onClose: () => void
  intervencaoId: number
  intervencaoNumero: string
}

const CustosDialog = ({ open, onClose, intervencaoId, intervencaoNumero }: CustosDialogProps) => {
  const [custos, setCustos] = useState<IntervencaoCusto[]>([])
  const [loading, setLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editingCusto, setEditingCusto] = useState<IntervencaoCusto | null>(null)

  useEffect(() => {
    if (open) {
      fetchCustos()
    }
  }, [open, intervencaoId])

  const fetchCustos = async () => {
    try {
      setLoading(true)
      const data = await intervencoesCustosAPI.list(intervencaoId)
      setCustos(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Erro ao carregar custos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCusto = () => {
    setEditingCusto(null)
    setAddDialogOpen(true)
  }

  const handleEditCusto = (custo: IntervencaoCusto) => {
    setEditingCusto(custo)
    setAddDialogOpen(true)
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
      <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
        <DialogTitle>
          <div className='flex items-center justify-between'>
            <div>
              <Typography variant='h6'>Custos da Intervenção</Typography>
              <Typography variant='body2' color='text.secondary'>
                {intervencaoNumero}
              </Typography>
            </div>
            <Button
              size='small'
              variant='contained'
              onClick={handleAddCusto}
              startIcon={<i className='tabler-plus' />}
            >
              Adicionar Custo
            </Button>
          </div>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <div className='flex justify-center items-center py-10'>
              <CircularProgress />
            </div>
          ) : custos.length === 0 ? (
            <Typography variant='body2' color='text.secondary' className='text-center py-10'>
              Nenhum custo adicionado
            </Typography>
          ) : (
            <>
              <div className='overflow-x-auto'>
                <table className={tableStyles.table}>
                  <thead>
                    <tr>
                      <th>Descrição</th>
                      <th>Quantidade</th>
                      <th>Valor Unitário</th>
                      <th>Valor Total</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {custos.map(custo => (
                      <tr key={custo.id}>
                        <td>
                          <div className='flex flex-col'>
                            <Typography className='font-medium' color='text.primary'>
                              {custo.descricao}
                            </Typography>
                            {custo.codigo && (
                              <Typography variant='body2' color='text.secondary'>
                                Ref: {custo.codigo}
                              </Typography>
                            )}
                          </div>
                        </td>
                        <td>
                          <Chip
                            label={custo.quantidade}
                            variant='tonal'
                            color='default'
                            size='small'
                          />
                        </td>
                        <td>
                          <Typography color='text.secondary'>
                            {formatCurrency(custo.valor_unitario)}
                          </Typography>
                        </td>
                        <td>
                          <Typography className='font-medium' color='primary'>
                            {formatCurrency(custo.valor_total)}
                          </Typography>
                        </td>
                        <td>
                          <div className='flex items-center gap-1'>
                            {custo.anexo_url && (
                              <IconButton
                                size='small'
                                href={custo.anexo_url}
                                target='_blank'
                                title='Ver anexo'
                              >
                                <i className='tabler-file-text text-[22px] text-textSecondary' />
                              </IconButton>
                            )}
                            <IconButton size='small' onClick={() => handleEditCusto(custo)}>
                              <i className='tabler-edit text-[22px] text-textSecondary' />
                            </IconButton>
                            <IconButton size='small' onClick={() => handleDeleteCusto(custo.id)}>
                              <i className='tabler-trash text-[22px] text-textSecondary' />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Divider className='my-4' />

              <div className='flex justify-between items-center p-4'>
                <Typography variant='h6'>Custo Total</Typography>
                <Typography variant='h5' color='primary' className='font-bold'>
                  {formatCurrency(custoTotal)}
                </Typography>
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Custo Dialog */}
      <AddCustoDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSuccess={() => {
          fetchCustos()
          setAddDialogOpen(false)
        }}
        intervencaoId={intervencaoId}
        custo={editingCusto}
      />
    </>
  )
}

export default CustosDialog
