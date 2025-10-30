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
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid2'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import LogoUpload from './LogoUpload'

// API Imports
import { modelosAPI, marcasAPI } from '@/libs/api/equipamentos'
import { categoriasAPI } from '@/libs/api/equipamentos'
import type { ModeloEquipamento, Marca, CategoriaEquipamento } from '@/libs/api/equipamentos/types'

interface EditModeloDialogProps {
  open: boolean
  onClose: () => void
  modelo: ModeloEquipamento | null
  onSuccess: () => void
  mode?: 'create' | 'edit'
}

const EditModeloDialog = ({ open, onClose, modelo, onSuccess, mode = 'edit' }: EditModeloDialogProps) => {
  const [formData, setFormData] = useState({
    marca_id: 0,
    categoria_id: 0,
    nome: '',
    codigo: '',
    descricao: '',
    especificacoes: '',
    imagem_url: '',
    manual_url: '',
    codigo_leitura: '',
    tipo_leitura: '',
    ativo: true
  })
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [categorias, setCategorias] = useState<CategoriaEquipamento[]>([])

  // Load marcas and categorias
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true)
        const [marcasResult, categoriasResult] = await Promise.all([
          marcasAPI.list({ ativo: true }),
          categoriasAPI.list()
        ])

        setMarcas(Array.isArray(marcasResult) ? marcasResult : marcasResult.data)
        setCategorias(Array.isArray(categoriasResult) ? categoriasResult : categoriasResult.data)
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
      } finally {
        setLoadingData(false)
      }
    }

    if (open) {
      loadData()
    }
  }, [open])

  useEffect(() => {
    if (modelo) {
      setFormData({
        marca_id: modelo.marca_id,
        categoria_id: modelo.categoria_id,
        nome: modelo.nome || '',
        codigo: modelo.codigo || '',
        descricao: modelo.descricao || '',
        especificacoes: modelo.especificacoes || '',
        imagem_url: modelo.imagem_url || '',
        manual_url: modelo.manual_url || '',
        codigo_leitura: modelo.codigo_leitura || '',
        tipo_leitura: modelo.tipo_leitura || '',
        ativo: modelo.ativo ?? true
      })
    } else {
      setFormData({
        marca_id: 0,
        categoria_id: 0,
        nome: '',
        codigo: '',
        descricao: '',
        especificacoes: '',
        imagem_url: '',
        manual_url: '',
        codigo_leitura: '',
        tipo_leitura: '',
        ativo: true
      })
    }
    setError(null)
  }, [modelo, open])

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    if (!formData.nome.trim()) {
      setError('O nome do modelo é obrigatório')
      return
    }

    if (!formData.marca_id || formData.marca_id === 0) {
      setError('A marca é obrigatória')
      return
    }

    if (!formData.categoria_id || formData.categoria_id === 0) {
      setError('A categoria é obrigatória')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const payload = {
        marca_id: formData.marca_id,
        categoria_id: formData.categoria_id,
        nome: formData.nome.trim(),
        codigo: formData.codigo.trim() || undefined,
        descricao: formData.descricao.trim() || undefined,
        especificacoes: formData.especificacoes.trim() || undefined,
        imagem_url: formData.imagem_url.trim() || undefined,
        manual_url: formData.manual_url.trim() || undefined,
        codigo_leitura: formData.codigo_leitura.trim() || undefined,
        tipo_leitura: formData.tipo_leitura.trim() || undefined,
        ativo: formData.ativo
      }

      if (mode === 'create') {
        await modelosAPI.create(payload)
      } else {
        if (!modelo) return
        await modelosAPI.update(modelo.id, payload)
      }

      onSuccess()
      handleClose()
    } catch (err: any) {
      const action = mode === 'create' ? 'criar' : 'atualizar'
      setError(err.response?.data?.message || `Erro ao ${action} modelo`)
      console.error(`Erro ao ${action} modelo:`, err)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({
        marca_id: 0,
        categoria_id: 0,
        nome: '',
        codigo: '',
        descricao: '',
        especificacoes: '',
        imagem_url: '',
        manual_url: '',
        codigo_leitura: '',
        tipo_leitura: '',
        ativo: true
      })
      setError(null)
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle>
        <Typography variant='h5'>{mode === 'create' ? 'Criar Modelo' : 'Editar Modelo'}</Typography>
      </DialogTitle>

      <DialogContent>
        {loadingData ? (
          <div className='flex justify-center items-center py-10'>
            <CircularProgress />
          </div>
        ) : (
          <Grid container spacing={4} className='pt-4'>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                select
                label='Marca'
                value={formData.marca_id}
                onChange={(e) => handleChange('marca_id', Number(e.target.value))}
                fullWidth
                required
                error={formData.marca_id === 0 && error !== null}
                helperText={formData.marca_id === 0 && error !== null ? 'Campo obrigatório' : ''}
              >
                <MenuItem value={0}>Selecione uma marca</MenuItem>
                {marcas.map((marca) => (
                  <MenuItem key={marca.id} value={marca.id}>
                    {marca.nome}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                select
                label='Categoria'
                value={formData.categoria_id}
                onChange={(e) => handleChange('categoria_id', Number(e.target.value))}
                fullWidth
                required
                error={formData.categoria_id === 0 && error !== null}
                helperText={formData.categoria_id === 0 && error !== null ? 'Campo obrigatório' : ''}
              >
                <MenuItem value={0}>Selecione uma categoria</MenuItem>
                {categorias.map((categoria) => (
                  <MenuItem key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                label='Nome do Modelo'
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                fullWidth
                required
                autoFocus
                error={!formData.nome.trim() && error !== null}
                helperText={!formData.nome.trim() && error !== null ? 'Campo obrigatório' : ''}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                label='Código'
                value={formData.codigo}
                onChange={(e) => handleChange('codigo', e.target.value)}
                fullWidth
                placeholder='ex: MB-PRO-16-2023'
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <CustomTextField
                label='Descrição'
                value={formData.descricao}
                onChange={(e) => handleChange('descricao', e.target.value)}
                fullWidth
                multiline
                rows={2}
                placeholder='Breve descrição do modelo'
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <CustomTextField
                label='Especificações'
                value={formData.especificacoes}
                onChange={(e) => handleChange('especificacoes', e.target.value)}
                fullWidth
                multiline
                rows={3}
                placeholder='Especificações técnicas detalhadas...'
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant='body2' color='text.primary' className='mb-2 font-medium'>
                Imagem do Modelo
              </Typography>
              <LogoUpload
                value={formData.imagem_url}
                onChange={(url) => handleChange('imagem_url', url)}
                disabled={loading || loadingData}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <CustomTextField
                label='URL do Manual'
                value={formData.manual_url}
                onChange={(e) => handleChange('manual_url', e.target.value)}
                fullWidth
                placeholder='https://exemplo.com/manual.pdf'
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

            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.ativo}
                    onChange={(e) => handleChange('ativo', e.target.checked)}
                  />
                }
                label='Modelo ativo'
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
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading || loadingData} color='secondary'>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant='contained' disabled={loading || loadingData}>
          {loading ? <CircularProgress size={20} /> : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditModeloDialog
