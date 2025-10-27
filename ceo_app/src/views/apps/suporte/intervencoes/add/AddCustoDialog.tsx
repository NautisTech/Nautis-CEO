'use client'

import { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'

import { intervencoesCustosAPI } from '@/libs/api/intervencoes-custos'
import type { IntervencaoCusto, CriarIntervencaoCustoDto } from '@/libs/api/intervencoes-custos'
import { toastService } from '@/libs/notifications/toasterService'
import CustoAnexo from './CustoAnexo'

interface AddCustoDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  intervencaoId: number
  custo?: IntervencaoCusto | null
}

const AddCustoDialog = ({ open, onClose, onSuccess, intervencaoId, custo }: AddCustoDialogProps) => {
  const [loading, setLoading] = useState(false)
  const [fornecedores, setFornecedores] = useState<any[]>([])

  const [formData, setFormData] = useState({
    descricao: '',
    codigo: '',
    quantidade: 1,
    valor_unitario: 0,
    fornecedor_id: '' as number | '',
    anexo_url: ''
  })

  useEffect(() => {
    if (open) {
      if (custo) {
        setFormData({
          descricao: custo.descricao,
          codigo: custo.codigo || '',
          quantidade: custo.quantidade,
          valor_unitario: custo.valor_unitario,
          fornecedor_id: custo.fornecedor_id || '',
          anexo_url: custo.anexo_url || ''
        })
      } else {
        setFormData({
          descricao: '',
          codigo: '',
          quantidade: 1,
          valor_unitario: 0,
          fornecedor_id: '',
          anexo_url: ''
        })
      }
      // TODO: Fetch fornecedores
    }
  }, [open, custo])

  const handleSubmit = async () => {
    if (!formData.descricao || formData.quantidade <= 0 || formData.valor_unitario < 0) {
      toastService.error('Preencha todos os campos obrigatórios')
      return
    }

    setLoading(true)
    try {
      const dto: CriarIntervencaoCustoDto = {
        intervencao_id: intervencaoId,
        descricao: formData.descricao,
        codigo: formData.codigo || undefined,
        quantidade: formData.quantidade,
        valor_unitario: formData.valor_unitario,
        fornecedor_id: formData.fornecedor_id || undefined,
        anexo_url: formData.anexo_url || undefined
      }

      if (custo) {
        await intervencoesCustosAPI.update(custo.id, dto)
        toastService.success('Custo atualizado com sucesso')
      } else {
        await intervencoesCustosAPI.create(dto)
        toastService.success('Custo adicionado com sucesso')
      }

      onSuccess()
      handleClose()
    } catch (error: any) {
      console.error('Erro ao salvar custo:', error)
      toastService.error(error.message || 'Erro ao salvar custo')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      descricao: '',
      codigo: '',
      quantidade: 1,
      valor_unitario: 0,
      fornecedor_id: '',
      anexo_url: ''
    })
    onClose()
  }

  const valorTotal = formData.quantidade * formData.valor_unitario

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>{custo ? 'Editar Custo' : 'Adicionar Custo'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={4} className='mt-2'>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label='Descrição'
              value={formData.descricao}
              onChange={e => setFormData({ ...formData, descricao: e.target.value })}
              required
              placeholder='Ex: Toner preto original HP'
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label='Código/Referência'
              value={formData.codigo}
              onChange={e => setFormData({ ...formData, codigo: e.target.value })}
              placeholder='Ex: HP-CF410A'
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type='number'
              label='Quantidade'
              value={formData.quantidade}
              onChange={e => setFormData({ ...formData, quantidade: Number(e.target.value) })}
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type='number'
              label='Valor Unitário (€)'
              value={formData.valor_unitario}
              onChange={e => setFormData({ ...formData, valor_unitario: Number(e.target.value) })}
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label='Valor Total (€)'
              value={valorTotal.toFixed(2)}
              disabled
              InputProps={{
                readOnly: true
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              select
              fullWidth
              label='Fornecedor (opcional)'
              value={formData.fornecedor_id}
              onChange={e => setFormData({ ...formData, fornecedor_id: Number(e.target.value) })}
            >
              <MenuItem value=''>Nenhum</MenuItem>
              {fornecedores.map(forn => (
                <MenuItem key={forn.id} value={forn.id}>
                  {forn.nome}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <CustoAnexo
              value={formData.anexo_url || null}
              onChange={url => setFormData({ ...formData, anexo_url: url || '' })}
              disabled={loading}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant='contained' disabled={loading || !formData.descricao}>
          {loading ? 'A guardar...' : custo ? 'Atualizar' : 'Adicionar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddCustoDialog
