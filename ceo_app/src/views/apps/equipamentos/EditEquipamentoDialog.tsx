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
import EquipamentoFoto from './EquipamentoFoto'

// API Imports
import { equipamentosAPI, modelosAPI } from '@/libs/api/equipamentos'
import { funcionariosAPI } from '@/libs/api/funcionarios'
import type { Equipamento, ModeloEquipamento } from '@/libs/api/equipamentos/types'
import type { Funcionario } from '@/libs/api/funcionarios/types'

interface EditEquipamentoDialogProps {
  open: boolean
  onClose: () => void
  equipamento: Equipamento | null
  onSuccess: () => void
  mode?: 'create' | 'edit'
}

const EditEquipamentoDialog = ({
  open,
  onClose,
  equipamento,
  onSuccess,
  mode = 'edit'
}: EditEquipamentoDialogProps) => {
  const [formData, setFormData] = useState({
    modelo_id: 0,
    responsavel_id: 0,
    numero_serie: '',
    numero_interno: '',
    descricao: '',
    localizacao: '',
    data_aquisicao: '',
    valor_aquisicao: '',
    fornecedor: '',
    data_garantia: '',
    data_proxima_manutencao: '',
    estado: 'operacional',
    observacoes: '',
    foto_url: null as string | null,
    ativo: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modelos, setModelos] = useState<ModeloEquipamento[]>([])
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [loadingData, setLoadingData] = useState(true)

  // Load modelos e funcionarios
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true)
        const [modelosData, funcionariosData] = await Promise.all([
          modelosAPI.list(),
          funcionariosAPI.list({ ativo: true })
        ])
        setModelos(modelosData)
        setFuncionarios(funcionariosData.data || [])
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
    if (equipamento) {
      setFormData({
        modelo_id: equipamento.modelo_id || 0,
        responsavel_id: equipamento.responsavel_id || 0,
        numero_serie: equipamento.numero_serie || '',
        numero_interno: equipamento.numero_interno || '',
        descricao: equipamento.descricao || '',
        localizacao: equipamento.localizacao || '',
        data_aquisicao: equipamento.data_aquisicao
          ? equipamento.data_aquisicao.split('T')[0]
          : '',
        valor_aquisicao: equipamento.valor_aquisicao?.toString() || '',
        fornecedor: equipamento.fornecedor || '',
        data_garantia: equipamento.data_garantia ? equipamento.data_garantia.split('T')[0] : '',
        data_proxima_manutencao: equipamento.data_proxima_manutencao
          ? equipamento.data_proxima_manutencao.split('T')[0]
          : '',
        estado: equipamento.estado || 'operacional',
        observacoes: equipamento.observacoes || '',
        foto_url: equipamento.foto_url || null,
        ativo: equipamento.ativo ?? true
      })
    } else {
      setFormData({
        modelo_id: 0,
        responsavel_id: 0,
        numero_serie: '',
        numero_interno: '',
        descricao: '',
        localizacao: '',
        data_aquisicao: '',
        valor_aquisicao: '',
        fornecedor: '',
        data_garantia: '',
        data_proxima_manutencao: '',
        estado: 'operacional',
        observacoes: '',
        foto_url: null,
        ativo: true
      })
    }
    setError(null)
  }, [equipamento, open])

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    if (!formData.modelo_id) {
      setError('O modelo é obrigatório')
      return
    }

    if (!formData.numero_serie.trim()) {
      setError('O número de série é obrigatório')
      return
    }

    if (!formData.numero_interno.trim()) {
      setError('O número interno é obrigatório')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const payload: any = {
        modelo_id: formData.modelo_id,
        numero_serie: formData.numero_serie.trim(),
        numero_interno: formData.numero_interno.trim(),
        estado: formData.estado,
        ativo: formData.ativo
      }

      if (formData.responsavel_id) payload.responsavel_id = formData.responsavel_id
      if (formData.descricao.trim()) payload.descricao = formData.descricao.trim()
      if (formData.localizacao.trim()) payload.localizacao = formData.localizacao.trim()
      if (formData.data_aquisicao) payload.data_aquisicao = formData.data_aquisicao
      if (formData.valor_aquisicao) payload.valor_aquisicao = parseFloat(formData.valor_aquisicao)
      if (formData.fornecedor.trim()) payload.fornecedor = formData.fornecedor.trim()
      if (formData.data_garantia) payload.data_garantia = formData.data_garantia
      if (formData.data_proxima_manutencao)
        payload.data_proxima_manutencao = formData.data_proxima_manutencao
      if (formData.observacoes.trim()) payload.observacoes = formData.observacoes.trim()
      if (formData.foto_url) payload.foto_url = formData.foto_url

      if (mode === 'create') {
        await equipamentosAPI.create(payload)
      } else {
        if (!equipamento) return
        await equipamentosAPI.update(equipamento.id, payload)
      }

      onSuccess()
      handleClose()
    } catch (err: any) {
      const action = mode === 'create' ? 'criar' : 'atualizar'
      setError(err.response?.data?.message || `Erro ao ${action} equipamento`)
      console.error(`Erro ao ${action} equipamento:`, err)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({
        modelo_id: 0,
        responsavel_id: 0,
        numero_serie: '',
        numero_interno: '',
        descricao: '',
        localizacao: '',
        data_aquisicao: '',
        valor_aquisicao: '',
        fornecedor: '',
        data_garantia: '',
        data_proxima_manutencao: '',
        estado: 'operacional',
        observacoes: '',
        foto_url: null,
        ativo: true
      })
      setError(null)
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle>
        <Typography variant='h5'>
          {mode === 'create' ? 'Criar Equipamento' : 'Editar Equipamento'}
        </Typography>
      </DialogTitle>

      <DialogContent>
        {loadingData ? (
          <div className='flex justify-center items-center py-10'>
            <CircularProgress />
          </div>
        ) : (
          <Grid container spacing={4} className='pt-4'>
            {/* Modelo */}
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField
                select
                label='Modelo'
                value={formData.modelo_id || ''}
                onChange={e => handleChange('modelo_id', parseInt(e.target.value))}
                fullWidth
                required
                error={!formData.modelo_id && error !== null}
                helperText={!formData.modelo_id && error !== null ? 'Campo obrigatório' : ''}
              >
                <MenuItem value={0} disabled>
                  Selecione um modelo
                </MenuItem>
                {modelos.map(modelo => (
                  <MenuItem key={modelo.id} value={modelo.id}>
                    {modelo.marca_nome} - {modelo.nome}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            {/* Responsável */}
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField
                select
                label='Responsável'
                value={formData.responsavel_id || ''}
                onChange={e => handleChange('responsavel_id', parseInt(e.target.value) || 0)}
                fullWidth
              >
                <MenuItem value={0}>Nenhum</MenuItem>
                {funcionarios.map(func => (
                  <MenuItem key={func.id} value={func.id}>
                    {func.nome_completo}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            {/* Número de Série */}
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField
                label='Número de Série'
                value={formData.numero_serie}
                onChange={e => handleChange('numero_serie', e.target.value)}
                fullWidth
                required
                error={!formData.numero_serie.trim() && error !== null}
                helperText={
                  !formData.numero_serie.trim() && error !== null ? 'Campo obrigatório' : ''
                }
              />
            </Grid>

            {/* Número Interno */}
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField
                label='Número Interno'
                value={formData.numero_interno}
                onChange={e => handleChange('numero_interno', e.target.value)}
                fullWidth
                required
                error={!formData.numero_interno.trim() && error !== null}
                helperText={
                  !formData.numero_interno.trim() && error !== null ? 'Campo obrigatório' : ''
                }
              />
            </Grid>

            {/* Localização */}
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                label='Localização'
                value={formData.localizacao}
                onChange={e => handleChange('localizacao', e.target.value)}
                fullWidth
                placeholder='Ex: Escritório - Sala 101'
              />
            </Grid>

            {/* Descrição */}
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                label='Descrição'
                value={formData.descricao}
                onChange={e => handleChange('descricao', e.target.value)}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>

            {/* Data de Aquisição */}
            <Grid size={{ xs: 12, md: 4 }}>
              <CustomTextField
                label='Data de Aquisição'
                type='date'
                value={formData.data_aquisicao}
                onChange={e => handleChange('data_aquisicao', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Valor de Aquisição */}
            <Grid size={{ xs: 12, md: 4 }}>
              <CustomTextField
                label='Valor de Aquisição'
                type='number'
                value={formData.valor_aquisicao}
                onChange={e => handleChange('valor_aquisicao', e.target.value)}
                fullWidth
                inputProps={{ step: '0.01', min: '0' }}
              />
            </Grid>

            {/* Fornecedor */}
            <Grid size={{ xs: 12, md: 4 }}>
              <CustomTextField
                label='Fornecedor'
                value={formData.fornecedor}
                onChange={e => handleChange('fornecedor', e.target.value)}
                fullWidth
              />
            </Grid>

            {/* Data de Garantia */}
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField
                label='Data de Garantia'
                type='date'
                value={formData.data_garantia}
                onChange={e => handleChange('data_garantia', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Data Próxima Manutenção */}
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField
                label='Próxima Manutenção'
                type='date'
                value={formData.data_proxima_manutencao}
                onChange={e => handleChange('data_proxima_manutencao', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Estado */}
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField
                select
                label='Estado'
                value={formData.estado}
                onChange={e => handleChange('estado', e.target.value)}
                fullWidth
              >
                <MenuItem value='operacional'>Operacional</MenuItem>
                <MenuItem value='em_manutencao'>Em Manutenção</MenuItem>
                <MenuItem value='inativo'>Inativo</MenuItem>
                <MenuItem value='descartado'>Descartado</MenuItem>
              </CustomTextField>
            </Grid>

            {/* Ativo */}
            <Grid size={{ xs: 12, md: 6 }} className='flex items-center'>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.ativo}
                    onChange={e => handleChange('ativo', e.target.checked)}
                  />
                }
                label='Equipamento ativo'
              />
            </Grid>

            {/* Observações */}
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                label='Observações'
                value={formData.observacoes}
                onChange={e => handleChange('observacoes', e.target.value)}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>

            {/* Foto do Equipamento */}
            <Grid size={{ xs: 12 }}>
              <Typography variant='body2' className='font-medium mbe-2'>
                Foto do Equipamento
              </Typography>
              <EquipamentoFoto
                value={formData.foto_url}
                onChange={url => handleChange('foto_url', url)}
                disabled={loadingData}
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
        <Button onClick={handleClose} disabled={loading} color='secondary'>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant='contained' disabled={loading || loadingData}>
          {loading ? <CircularProgress size={20} /> : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditEquipamentoDialog
