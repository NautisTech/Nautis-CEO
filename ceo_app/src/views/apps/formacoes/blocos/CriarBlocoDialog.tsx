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
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import type { Bloco } from '@/libs/api/formacoes'
import { formacoesAPI } from '@/libs/api/formacoes'

interface CriarBlocoDialogProps {
  open: boolean
  onClose: () => void
  aulaId: number
  proximaOrdem: number
  onSuccess: (bloco: Bloco) => void
}

const CriarBlocoDialog = ({ open, onClose, aulaId, proximaOrdem, onSuccess }: CriarBlocoDialogProps) => {
  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: '',
    tipo: 'texto',
    ordem: proximaOrdem
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
        conteudo: '',
        tipo: 'texto',
        ordem: proximaOrdem
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
      const blocoData = {
        a_formacao_id: aulaId,
        ...formData
      }

      const result = await formacoesAPI.criarBloco(blocoData)
      onSuccess(result)
      handleClose()
    } catch (err: any) {
      console.error('Erro ao criar bloco:', err)
      setError(err?.response?.data?.message || 'Erro ao criar bloco. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Adicionar Bloco de Conteúdo</DialogTitle>
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
                label='Título do Bloco'
                value={formData.titulo}
                onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                required
                disabled={loading}
                placeholder='Ex: Introdução ao conceito'
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                multiline
                rows={6}
                label='Conteúdo'
                value={formData.conteudo}
                onChange={e => setFormData({ ...formData, conteudo: e.target.value })}
                disabled={loading}
                placeholder='Conteúdo do bloco (texto, HTML, markdown, etc.)'
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField
                fullWidth
                select
                label='Tipo de Conteúdo'
                value={formData.tipo}
                onChange={e => setFormData({ ...formData, tipo: e.target.value })}
                disabled={loading}
                required
              >
                <MenuItem value='texto'>Texto</MenuItem>
                <MenuItem value='video'>Vídeo</MenuItem>
                <MenuItem value='pdf'>PDF</MenuItem>
                <MenuItem value='imagem'>Imagem</MenuItem>
                <MenuItem value='exercicio'>Exercício</MenuItem>
              </CustomTextField>
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
                helperText='Ordem dentro da aula'
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Alert severity='info'>
                Após criar o bloco, poderá adicionar anexos (ficheiros, links, etc.) através do botão "Gerir Anexos".
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
            {loading ? 'Criando...' : 'Criar Bloco'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CriarBlocoDialog
