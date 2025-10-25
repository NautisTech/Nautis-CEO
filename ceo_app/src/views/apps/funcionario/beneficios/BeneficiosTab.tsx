'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// API Imports
import { funcionariosAPI } from '@/libs/api/funcionarios/api'
import { useFuncionarioCreate } from '../FuncionarioCreateContext'

// Types
interface Beneficio {
  id?: number
  funcionario_id?: number
  tipo: string
  descricao?: string
  valor?: number
  data_inicio?: string
  data_fim?: string
  codigo_pagamento?: string
  numero_beneficiario?: string
  operadora?: string
  observacoes?: string
  ativo: boolean
  criado_em?: string
  atualizado_em?: string
}

const BeneficiosTab = ({ funcionarioId }: { funcionarioId: number }) => {
  const isCreate = funcionarioId === 0
  const createContext = useFuncionarioCreate()

  // States
  const [beneficios, setBeneficios] = useState<Beneficio[]>([])
  const [isLoading, setIsLoading] = useState(!isCreate)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    tipo: 'Seguro Saúde',
    descricao: '',
    valor: '',
    data_inicio: '',
    data_fim: '',
    codigo_pagamento: '',
    numero_beneficiario: '',
    operadora: '',
    observacoes: '',
    ativo: true
  })

  // Load benefits
  useEffect(() => {
    if (isCreate) {
      setBeneficios(createContext.data.beneficios)
      setIsLoading(false)
    } else {
      loadBeneficios()
    }
  }, [funcionarioId, isCreate])

  const loadBeneficios = async () => {
    try {
      setIsLoading(true)
      const data = await funcionariosAPI.getBeneficios(funcionarioId)
      setBeneficios(data)
    } catch (err) {
      console.error('Erro ao carregar benefícios:', err)
      setError('Erro ao carregar benefícios')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenDialog = (beneficio?: Beneficio, index?: number) => {
    if (beneficio) {
      setEditingIndex(index ?? null)
      setFormData({
        tipo: beneficio.tipo,
        descricao: beneficio.descricao || '',
        valor: beneficio.valor?.toString() || '',
        data_inicio: beneficio.data_inicio || '',
        data_fim: beneficio.data_fim || '',
        codigo_pagamento: beneficio.codigo_pagamento || '',
        numero_beneficiario: beneficio.numero_beneficiario || '',
        operadora: beneficio.operadora || '',
        observacoes: beneficio.observacoes || '',
        ativo: beneficio.ativo
      })
    } else {
      setEditingIndex(null)
      setFormData({
        tipo: 'Seguro Saúde',
        descricao: '',
        valor: '',
        data_inicio: '',
        data_fim: '',
        codigo_pagamento: '',
        numero_beneficiario: '',
        operadora: '',
        observacoes: '',
        ativo: true
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingIndex(null)
  }

  const handleChange = (field: string) => (event: any) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    try {
      setIsSaving(true)
      setError(null)

      const beneficioData = {
        tipo: formData.tipo,
        descricao: formData.descricao || undefined,
        valor: formData.valor ? parseFloat(formData.valor) : undefined,
        data_inicio: formData.data_inicio || undefined,
        data_fim: formData.data_fim || undefined,
        codigo_pagamento: formData.codigo_pagamento || undefined,
        numero_beneficiario: formData.numero_beneficiario || undefined,
        operadora: formData.operadora || undefined,
        observacoes: formData.observacoes || undefined,
        ativo: formData.ativo
      }

      if (isCreate) {
        // Create mode: store in context
        if (editingIndex !== null) {
          createContext.updateBeneficio(editingIndex, beneficioData)
        } else {
          createContext.addBeneficio(beneficioData)
        }
        setBeneficios(editingIndex !== null
          ? beneficios.map((b, i) => i === editingIndex ? beneficioData : b)
          : [...beneficios, beneficioData]
        )
      } else {
        // Edit mode: API calls
        const payload = {
          funcionario_id: funcionarioId,
          tipo: formData.tipo,
          descricao: formData.descricao || undefined,
          valor: formData.valor ? parseFloat(formData.valor) : undefined,
          data_inicio: formData.data_inicio || undefined,
          data_fim: formData.data_fim || undefined,
          codigo_pagamento: formData.codigo_pagamento || undefined,
          numero_beneficiario: formData.numero_beneficiario || undefined,
          operadora: formData.operadora || undefined,
          observacoes: formData.observacoes || undefined,
          ativo: formData.ativo
        }

        if (editingIndex !== null && beneficios[editingIndex]?.id) {
          await funcionariosAPI.updateBeneficio(beneficios[editingIndex].id!, payload)
        } else {
          await funcionariosAPI.createBeneficio(payload)
        }
        await loadBeneficios()
      }

      handleCloseDialog()
    } catch (err: any) {
      console.error('Erro ao salvar benefício:', err)
      setError(err.message || 'Erro ao salvar benefício')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (index: number) => {
    if (!confirm('Tem certeza que deseja excluir este benefício?')) return

    try {
      if (isCreate) {
        createContext.removeBeneficio(index)
        setBeneficios(beneficios.filter((_, i) => i !== index))
      } else {
        const beneficio = beneficios[index]
        if (beneficio?.id) {
          await funcionariosAPI.deleteBeneficio(beneficio.id)
          await loadBeneficios()
        }
      }
    } catch (err: any) {
      console.error('Erro ao excluir benefício:', err)
      setError(err.message || 'Erro ao excluir benefício')
    }
  }

  const formatCurrency = (value?: number) => {
    if (!value) return '-'
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className='flex justify-center items-center p-20'>
          <CircularProgress />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader
          title='Benefícios'
          action={
            <Button variant='contained' onClick={() => handleOpenDialog()} startIcon={<i className='tabler-plus' />}>
              Adicionar Benefício
            </Button>
          }
        />
        <CardContent>
          {error && (
            <Alert severity='error' onClose={() => setError(null)} className='mb-4'>
              {error}
            </Alert>
          )}

          {beneficios.length === 0 ? (
            <Typography color='text.secondary' className='text-center py-8'>
              Nenhum benefício registado
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Operadora</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Período</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align='right'>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {beneficios.map((beneficio, index) => (
                    <TableRow key={index}>
                      <TableCell>{beneficio.tipo}</TableCell>
                      <TableCell>{beneficio.descricao || '-'}</TableCell>
                      <TableCell>{beneficio.operadora || '-'}</TableCell>
                      <TableCell>{formatCurrency(beneficio.valor)}</TableCell>
                      <TableCell>
                        {beneficio.data_inicio
                          ? new Date(beneficio.data_inicio).toLocaleDateString('pt-PT')
                          : '-'}
                        {beneficio.data_fim && ` até ${new Date(beneficio.data_fim).toLocaleDateString('pt-PT')}`}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={beneficio.ativo ? 'Ativo' : 'Inativo'}
                          variant='tonal'
                          color={beneficio.ativo ? 'success' : 'error'}
                          size='small'
                        />
                      </TableCell>
                      <TableCell align='right'>
                        <IconButton size='small' onClick={() => handleOpenDialog(beneficio, index)}>
                          <i className='tabler-edit' />
                        </IconButton>
                        <IconButton size='small' color='error' onClick={() => handleDelete(index)}>
                          <i className='tabler-trash' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Dialog for Add/Edit */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth='md' fullWidth>
        <DialogTitle>{editingIndex !== null ? 'Editar Benefício' : 'Adicionar Benefício'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={4} className='pt-4'>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                select
                fullWidth
                label='Tipo *'
                value={formData.tipo}
                onChange={handleChange('tipo')}
                required
              >
                <MenuItem value='Seguro Saúde'>Seguro Saúde</MenuItem>
                <MenuItem value='Seguro de Vida'>Seguro de Vida</MenuItem>
                <MenuItem value='Vale Refeição'>Vale Refeição</MenuItem>
                <MenuItem value='Vale Transporte'>Vale Transporte</MenuItem>
                <MenuItem value='Plano Dental'>Plano Dental</MenuItem>
                <MenuItem value='Ginásio'>Ginásio</MenuItem>
                <MenuItem value='Formação'>Formação</MenuItem>
                <MenuItem value='Outro'>Outro</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Descrição'
                value={formData.descricao}
                onChange={handleChange('descricao')}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Operadora'
                value={formData.operadora}
                onChange={handleChange('operadora')}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                type='number'
                label='Valor (€)'
                value={formData.valor}
                onChange={handleChange('valor')}
                inputProps={{ step: '0.01' }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Número Beneficiário'
                value={formData.numero_beneficiario}
                onChange={handleChange('numero_beneficiario')}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Código Pagamento'
                value={formData.codigo_pagamento}
                onChange={handleChange('codigo_pagamento')}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                type='date'
                label='Data Início'
                value={formData.data_inicio}
                onChange={handleChange('data_inicio')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                type='date'
                label='Data Fim'
                value={formData.data_fim}
                onChange={handleChange('data_fim')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <div className='flex items-center gap-2'>
                <input type='checkbox' id='ativo' checked={formData.ativo} onChange={handleChange('ativo')} />
                <label htmlFor='ativo' className='cursor-pointer'>
                  Benefício ativo
                </label>
              </div>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                multiline
                rows={3}
                label='Observações'
                value={formData.observacoes}
                onChange={handleChange('observacoes')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='secondary'>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant='contained' disabled={isSaving}>
            {isSaving ? <CircularProgress size={20} /> : editingIndex !== null ? 'Atualizar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default BeneficiosTab
