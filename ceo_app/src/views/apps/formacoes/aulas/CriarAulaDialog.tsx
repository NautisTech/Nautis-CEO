'use client'

import { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import CustomTextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import type { Aula } from '@/libs/api/formacoes'
import { formacoesAPI } from '@/libs/api/formacoes'

interface CriarAulaDialogProps {
  open: boolean
  onClose: () => void
  moduloId: number
  proximaOrdem: number
  onSuccess: (aula: Aula) => void
}

const CriarAulaDialog = ({ open, onClose, moduloId, proximaOrdem, onSuccess }: CriarAulaDialogProps) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    ordem: proximaOrdem,
    duracao_minutos: 0,
    publicado: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Atualizar ordem quando mudar
  useEffect(() => {
    setFormData(prev => ({ ...prev, ordem: proximaOrdem }))
  }, [proximaOrdem])

  const handleClose = () => {
    if (!loading) {
      setFormData({
        titulo: '',
        descricao: '',
        ordem: proximaOrdem,
        duracao_minutos: 0,
        publicado: false
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
      const aulaData = {
        m_formacao_id: moduloId,
        ...formData
      }

      const result = await formacoesAPI.criarAula(aulaData)
      onSuccess(result)
      handleClose()
    } catch (err: any) {
      console.error('Erro ao criar aula:', err)
      setError(err?.response?.data?.message || 'Erro ao criar aula. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Adicionar Aula</DialogTitle>
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
                label='Título da Aula'
                value={formData.titulo}
                onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                required
                disabled={loading}
                placeholder='Ex: Introdução ao tema'
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
                placeholder='Descrição do conteúdo desta aula'
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField
                fullWidth
                type='number'
                label='Ordem'
                value={formData.ordem}
                onChange={e => setFormData({ ...formData, ordem: Number(e.target.value) })}
                disabled={loading}
                required
                inputProps={{ min: 1 }}
                helperText='Ordem dentro do módulo'
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField
                fullWidth
                type='number'
                label='Duração (min)'
                value={formData.duracao_minutos}
                onChange={e => setFormData({ ...formData, duracao_minutos: Number(e.target.value) })}
                disabled={loading}
                inputProps={{ min: 0, step: 0.5 }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.publicado}
                    onChange={e => setFormData({ ...formData, publicado: e.target.checked })}
                    disabled={loading}
                  />
                }
                label='Publicar aula (visível para alunos)'
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Alert severity='info'>
                Após criar a aula, poderá adicionar blocos de conteúdo (vídeos, textos, anexos, etc.) na secção de
                Blocos.
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='gap-2'>
          <Button variant='tonal' color='secondary' onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type='submit'
            variant='contained'
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Criando...' : 'Criar Aula'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CriarAulaDialog
