'use client'

import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import CustomTextField from '@core/components/mui/TextField'
import { formacoesAPI } from '@/libs/api/formacoes'
import type { Modulo } from '@/libs/api/formacoes'
import { useCategorias } from '@/libs/api/conteudos'

interface CriarModuloDialogProps {
  open: boolean
  onClose: () => void
  formacaoId: number
  onSuccess: (modulo: Modulo) => void
}

const CriarModuloDialog = ({ open, onClose, formacaoId, onSuccess }: CriarModuloDialogProps) => {
  const { data: categorias } = useCategorias()

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: '',
    nivel: '',
    ativo: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    if (!loading) {
      setFormData({
        titulo: '',
        descricao: '',
        categoria: '',
        nivel: '',
        ativo: true
      })
      setError(null)
      onClose()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const moduloData = {
        formacao_id: formacaoId,
        ...formData
      }

      const result = await formacoesAPI.criarModulo(moduloData)
      onSuccess(result)
      handleClose()
    } catch (err: any) {
      console.error('Erro ao criar módulo:', err)
      setError(err?.response?.data?.message || 'Erro ao criar módulo. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Adicionar Módulo</DialogTitle>
        <DialogContent>
          <Grid container spacing={4} className='mbs-4'>
            {error && (
              <Grid size={{ xs: 12 }}>
                <Alert severity='error'>{error}</Alert>
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                label='Título do Módulo'
                value={formData.titulo}
                onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                required
                disabled={loading}
                placeholder='Ex: Módulo 1 - Introdução'
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                multiline
                rows={3}
                label='Descrição'
                value={formData.descricao}
                onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                disabled={loading}
                placeholder='Descrição do conteúdo deste módulo'
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField
                fullWidth
                select
                label='Categoria'
                value={formData.categoria}
                onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                disabled={loading}
              >
                <MenuItem value=''>Selecione uma categoria</MenuItem>
                {categorias?.map(categoria => (
                  <MenuItem key={categoria.id} value={categoria.nome}>
                    {categoria.nome}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField
                fullWidth
                select
                label='Nível'
                value={formData.nivel}
                onChange={e => setFormData({ ...formData, nivel: e.target.value })}
                disabled={loading}
              >
                <MenuItem value=''>Nenhum</MenuItem>
                <MenuItem value='Iniciante'>Iniciante</MenuItem>
                <MenuItem value='Intermédio'>Intermédio</MenuItem>
                <MenuItem value='Avançado'>Avançado</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.ativo}
                    onChange={e => setFormData({ ...formData, ativo: e.target.checked })}
                    disabled={loading}
                  />
                }
                label='Módulo ativo (visível para alunos)'
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='gap-2'>
          <Button
            variant='tonal'
            color='secondary'
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            variant='contained'
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Criando...' : 'Criar Módulo'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CriarModuloDialog
