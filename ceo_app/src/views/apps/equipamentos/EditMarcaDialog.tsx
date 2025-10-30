'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Grid from '@mui/material/Grid2'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import LogoUpload from './LogoUpload'

// API Imports
import { marcasAPI } from '@/libs/api/equipamentos'
import type { Marca } from '@/libs/api/equipamentos/types'

interface EditMarcaDialogProps {
  open: boolean
  onClose: () => void
  marca: Marca | null
  onSuccess: () => void
  mode?: 'create' | 'edit'
}

const EditMarcaDialog = ({ open, onClose, marca, onSuccess, mode = 'edit' }: EditMarcaDialogProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    logo_url: '',
    website: '',
    codigo_leitura: '',
    tipo_leitura: '',
    email_suporte: '',
    telefone_suporte: '',
    link_suporte: '',
    ativo: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (marca) {
      setFormData({
        nome: marca.nome || '',
        logo_url: marca.logo_url || '',
        website: marca.website || '',
        codigo_leitura: marca.codigo_leitura || '',
        tipo_leitura: marca.tipo_leitura || '',
        email_suporte: marca.email_suporte || '',
        telefone_suporte: marca.telefone_suporte || '',
        link_suporte: marca.link_suporte || '',
        ativo: marca.ativo ?? true
      })
    } else {
      setFormData({
        nome: '',
        logo_url: '',
        website: '',
        codigo_leitura: '',
        tipo_leitura: '',
        email_suporte: '',
        telefone_suporte: '',
        link_suporte: '',
        ativo: true
      })
    }
    setError(null)
  }, [marca, open])

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    if (!formData.nome.trim()) {
      setError('O nome da marca é obrigatório')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const payload = {
        nome: formData.nome.trim(),
        logo_url: formData.logo_url.trim() || undefined,
        website: formData.website.trim() || undefined,
        codigo_leitura: formData.codigo_leitura.trim() || undefined,
        tipo_leitura: formData.tipo_leitura.trim() || undefined,
        email_suporte: formData.email_suporte.trim() || undefined,
        telefone_suporte: formData.telefone_suporte.trim() || undefined,
        link_suporte: formData.link_suporte.trim() || undefined,
        ativo: formData.ativo
      }

      if (mode === 'create') {
        await marcasAPI.create(payload)
      } else {
        if (!marca) return
        await marcasAPI.update(marca.id, payload)
      }

      onSuccess()
      handleClose()
    } catch (err: any) {
      const action = mode === 'create' ? 'criar' : 'atualizar'
      setError(err.response?.data?.message || `Erro ao ${action} marca`)
      console.error(`Erro ao ${action} marca:`, err)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({
        nome: '',
        logo_url: '',
        website: '',
        codigo_leitura: '',
        tipo_leitura: '',
        email_suporte: '',
        telefone_suporte: '',
        link_suporte: '',
        ativo: true
      })
      setError(null)
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        <Typography variant='h5'>{mode === 'create' ? 'Criar Marca' : 'Editar Marca'}</Typography>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={4} className='pt-4'>
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              label='Nome da Marca'
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              fullWidth
              required
              autoFocus
              error={!formData.nome.trim() && error !== null}
              helperText={!formData.nome.trim() && error !== null ? 'Campo obrigatório' : ''}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant='body2' color='text.primary' className='mb-2 font-medium'>
              Logo da Marca
            </Typography>
            <LogoUpload
              value={formData.logo_url}
              onChange={(url) => handleChange('logo_url', url)}
              disabled={loading}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <CustomTextField
              label='Website'
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              fullWidth
              placeholder='https://www.exemplo.com'
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              label='Código de Leitura'
              value={formData.codigo_leitura}
              onChange={(e) => handleChange('codigo_leitura', e.target.value)}
              fullWidth
              placeholder='ex: qr, barcode'
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              label='Tipo de Leitura'
              value={formData.tipo_leitura}
              onChange={(e) => handleChange('tipo_leitura', e.target.value)}
              fullWidth
              placeholder='ex: qrcode, barcode, rfid'
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              label='Email de Suporte'
              value={formData.email_suporte}
              onChange={(e) => handleChange('email_suporte', e.target.value)}
              fullWidth
              type='email'
              placeholder='suporte@exemplo.com'
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              label='Telefone de Suporte'
              value={formData.telefone_suporte}
              onChange={(e) => handleChange('telefone_suporte', e.target.value)}
              fullWidth
              placeholder='+351 123 456 789'
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <CustomTextField
              label='Link de Suporte'
              value={formData.link_suporte}
              onChange={(e) => handleChange('link_suporte', e.target.value)}
              fullWidth
              placeholder='https://support.exemplo.com'
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.ativo}
                  onChange={(e) => handleChange('ativo', e.target.checked)}
                />
              }
              label='Marca ativa'
            />
          </Grid>

          {error && (
            <Grid size={{ xs: 12 }}>
              <Typography color='error' variant='body2'>
                {error}
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading} color='secondary'>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant='contained' disabled={loading}>
          {loading ? <CircularProgress size={20} /> : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditMarcaDialog
