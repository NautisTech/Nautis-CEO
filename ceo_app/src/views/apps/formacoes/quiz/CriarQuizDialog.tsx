'use client'

import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import CustomTextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid2'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import type { Quiz } from '@/libs/api/formacoes'
import { formacoesAPI } from '@/libs/api/formacoes'

interface CriarQuizDialogProps {
  open: boolean
  onClose: () => void
  formacaoId: number
  onSuccess: (quiz: Quiz) => void
}

const CriarQuizDialog = ({ open, onClose, formacaoId, onSuccess }: CriarQuizDialogProps) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    tempo_limite_minutos: '',
    nota_minima_aprovacao: '',
    mostrar_resultados: true,
    permitir_tentativas_multiplas: true,
    max_tentativas: '',
    ativo: true
  })

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.titulo.trim()) {
      alert('O título é obrigatório')
      return
    }

    try {
      setLoading(true)

      const payload: any = {
        formacao_id: formacaoId,
        titulo: formData.titulo.trim(),
        mostrar_resultados: formData.mostrar_resultados,
        permitir_tentativas_multiplas: formData.permitir_tentativas_multiplas,
        ativo: formData.ativo
      }

      if (formData.descricao.trim()) {
        payload.descricao = formData.descricao.trim()
      }

      if (formData.tempo_limite_minutos) {
        const tempo = parseInt(formData.tempo_limite_minutos)
        if (tempo > 0) {
          payload.tempo_limite_minutos = tempo
        }
      }

      if (formData.nota_minima_aprovacao) {
        const nota = parseInt(formData.nota_minima_aprovacao)
        if (nota >= 0 && nota <= 100) {
          payload.nota_minima_aprovacao = nota
        }
      }

      if (formData.max_tentativas) {
        const max = parseInt(formData.max_tentativas)
        if (max > 0) {
          payload.max_tentativas = max
        }
      }

      const novoQuiz = await formacoesAPI.criarQuiz(payload)
      onSuccess(novoQuiz)
      handleClose()
    } catch (err) {
      console.error('Erro ao criar quiz:', err)
      alert('Erro ao criar quiz')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      titulo: '',
      descricao: '',
      tempo_limite_minutos: '',
      nota_minima_aprovacao: '',
      mostrar_resultados: true,
      permitir_tentativas_multiplas: true,
      max_tentativas: '',
      ativo: true
    })
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle>
        <div className='flex items-center justify-between'>
          <Typography variant='h5'>Criar Novo Quiz</Typography>
          <IconButton onClick={handleClose} size='small'>
            <i className='tabler-x' />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={5} className='pbs-5'>
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              fullWidth
              label='Título do Quiz'
              value={formData.titulo}
              onChange={(e) => handleChange('titulo', e.target.value)}
              placeholder='Ex: Teste Final do Módulo 1'
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <CustomTextField
              fullWidth
              label='Descrição'
              value={formData.descricao}
              onChange={(e) => handleChange('descricao', e.target.value)}
              placeholder='Descrição opcional do quiz'
              multiline
              rows={3}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              fullWidth
              label='Tempo Limite (minutos)'
              type='number'
              value={formData.tempo_limite_minutos}
              onChange={(e) => handleChange('tempo_limite_minutos', e.target.value)}
              placeholder='Deixe vazio para ilimitado'
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              fullWidth
              label='Nota Mínima de Aprovação (%)'
              type='number'
              value={formData.nota_minima_aprovacao}
              onChange={(e) => handleChange('nota_minima_aprovacao', e.target.value)}
              placeholder='Ex: 70'
              InputProps={{ inputProps: { min: 0, max: 100 } }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.permitir_tentativas_multiplas}
                  onChange={(e) => handleChange('permitir_tentativas_multiplas', e.target.checked)}
                />
              }
              label='Permitir Tentativas Múltiplas'
            />
          </Grid>

          {formData.permitir_tentativas_multiplas && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Máximo de Tentativas'
                type='number'
                value={formData.max_tentativas}
                onChange={(e) => handleChange('max_tentativas', e.target.value)}
                placeholder='Deixe vazio para ilimitado'
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
          )}

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.mostrar_resultados}
                  onChange={(e) => handleChange('mostrar_resultados', e.target.checked)}
                />
              }
              label='Mostrar Resultados aos Alunos'
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.ativo}
                  onChange={(e) => handleChange('ativo', e.target.checked)}
                />
              }
              label='Quiz Ativo'
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant='tonal' color='secondary'>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant='contained' disabled={loading}>
          {loading ? 'Criando...' : 'Criar Quiz'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CriarQuizDialog
