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
interface Endereco {
  id?: number
  funcionario_id?: number
  tipo: string
  logradouro: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade: string
  estado?: string
  codigo_postal: string
  pais?: string
  principal: boolean
  criado_em?: string
  atualizado_em?: string
}

const EnderecosTab = ({ funcionarioId, isPreview = false }: { funcionarioId: number; isPreview?: boolean }) => {
  const isCreate = funcionarioId === 0
  const createContext = useFuncionarioCreate()

  // States
  const [enderecos, setEnderecos] = useState<Endereco[]>([])
  const [isLoading, setIsLoading] = useState(!isCreate)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    tipo: 'Residencial',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    codigo_postal: '',
    pais: 'Portugal',
    principal: false
  })

  // Load addresses
  useEffect(() => {
    if (isCreate) {
      setEnderecos(createContext.data.enderecos)
      setIsLoading(false)
    } else {
      loadEnderecos()
    }
  }, [funcionarioId, isCreate])

  const loadEnderecos = async () => {
    try {
      setIsLoading(true)
      const data = await funcionariosAPI.getEnderecos(funcionarioId)
      setEnderecos(data)
    } catch (err) {
      console.error('Erro ao carregar endereços:', err)
      setError('Erro ao carregar endereços')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenDialog = (endereco?: Endereco, index?: number) => {
    if (endereco) {
      setEditingIndex(index ?? null)
      setFormData({
        tipo: endereco.tipo,
        logradouro: endereco.logradouro,
        numero: endereco.numero || '',
        complemento: endereco.complemento || '',
        bairro: endereco.bairro || '',
        cidade: endereco.cidade,
        estado: endereco.estado || '',
        codigo_postal: endereco.codigo_postal,
        pais: endereco.pais || 'Portugal',
        principal: endereco.principal
      })
    } else {
      setEditingIndex(null)
      setFormData({
        tipo: 'Residencial',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        codigo_postal: '',
        pais: 'Portugal',
        principal: false
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

      const enderecoData = {
        tipo: formData.tipo,
        logradouro: formData.logradouro,
        numero: formData.numero || undefined,
        complemento: formData.complemento || undefined,
        bairro: formData.bairro || undefined,
        cidade: formData.cidade,
        estado: formData.estado || undefined,
        codigo_postal: formData.codigo_postal,
        pais: formData.pais || undefined,
        principal: formData.principal
      }

      if (isCreate) {
        // Create mode: store in context
        if (editingIndex !== null) {
          createContext.updateEndereco(editingIndex, enderecoData)
        } else {
          createContext.addEndereco(enderecoData)
        }
        setEnderecos(editingIndex !== null
          ? enderecos.map((e, i) => i === editingIndex ? enderecoData : e)
          : [...enderecos, enderecoData]
        )
      } else {
        // Edit mode: API calls
        const payload = {
          funcionario_id: funcionarioId,
          tipo: formData.tipo,
          logradouro: formData.logradouro,
          numero: formData.numero || undefined,
          complemento: formData.complemento || undefined,
          bairro: formData.bairro || undefined,
          cidade: formData.cidade,
          estado: formData.estado || undefined,
          codigo_postal: formData.codigo_postal,
          pais: formData.pais || undefined,
          principal: formData.principal
        }

        if (editingIndex !== null && enderecos[editingIndex]?.id) {
          await funcionariosAPI.updateEndereco(enderecos[editingIndex].id!, payload)
        } else {
          await funcionariosAPI.createEndereco(payload)
        }
        await loadEnderecos()
      }

      handleCloseDialog()
    } catch (err: any) {
      console.error('Erro ao salvar endereço:', err)
      setError(err.message || 'Erro ao salvar endereço')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (index: number) => {
    if (!confirm('Tem certeza que deseja excluir este endereço?')) return

    try {
      if (isCreate) {
        createContext.removeEndereco(index)
        setEnderecos(enderecos.filter((_, i) => i !== index))
      } else {
        const endereco = enderecos[index]
        if (endereco?.id) {
          await funcionariosAPI.deleteEndereco(endereco.id)
          await loadEnderecos()
        }
      }
    } catch (err: any) {
      console.error('Erro ao excluir endereço:', err)
      setError(err.message || 'Erro ao excluir endereço')
    }
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
          title='Endereços'
          action={
            !isPreview && (
              <Button variant='contained' onClick={() => handleOpenDialog()} startIcon={<i className='tabler-plus' />}>
                Adicionar Endereço
              </Button>
            )
          }
        />
        <CardContent>
          {error && (
            <Alert severity='error' onClose={() => setError(null)} className='mb-4'>
              {error}
            </Alert>
          )}

          {enderecos.length === 0 ? (
            <Typography color='text.secondary' className='text-center py-8'>
              Nenhum endereço registado
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Endereço</TableCell>
                    <TableCell>Cidade</TableCell>
                    <TableCell>Código Postal</TableCell>
                    <TableCell>Principal</TableCell>
                    <TableCell align='right'>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {enderecos.map((endereco, index) => (
                    <TableRow key={index}>
                      <TableCell>{endereco.tipo}</TableCell>
                      <TableCell>
                        {endereco.logradouro}
                        {endereco.numero && `, ${endereco.numero}`}
                        {endereco.complemento && ` - ${endereco.complemento}`}
                      </TableCell>
                      <TableCell>{endereco.cidade}</TableCell>
                      <TableCell>{endereco.codigo_postal}</TableCell>
                      <TableCell>
                        {endereco.principal && <Chip label='Principal' color='primary' size='small' />}
                      </TableCell>
                      <TableCell align='right'>
                        {!isPreview && (
                          <>
                            <IconButton size='small' onClick={() => handleOpenDialog(endereco, index)}>
                              <i className='tabler-edit' />
                            </IconButton>
                            <IconButton size='small' color='error' onClick={() => handleDelete(index)}>
                              <i className='tabler-trash' />
                            </IconButton>
                          </>
                        )}
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
        <DialogTitle>{editingIndex !== null ? 'Editar Endereço' : 'Adicionar Endereço'}</DialogTitle>
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
                <MenuItem value='Residencial'>Residencial</MenuItem>
                <MenuItem value='Comercial'>Comercial</MenuItem>
                <MenuItem value='Outro'>Outro</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Logradouro *'
                value={formData.logradouro}
                onChange={handleChange('logradouro')}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <CustomTextField fullWidth label='Número' value={formData.numero} onChange={handleChange('numero')} />
            </Grid>

            <Grid size={{ xs: 12, sm: 8 }}>
              <CustomTextField
                fullWidth
                label='Complemento'
                value={formData.complemento}
                onChange={handleChange('complemento')}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField fullWidth label='Bairro' value={formData.bairro} onChange={handleChange('bairro')} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Cidade *'
                value={formData.cidade}
                onChange={handleChange('cidade')}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField fullWidth label='Estado' value={formData.estado} onChange={handleChange('estado')} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Código Postal *'
                value={formData.codigo_postal}
                onChange={handleChange('codigo_postal')}
                required
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <CustomTextField fullWidth label='País' value={formData.pais} onChange={handleChange('pais')} />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='principal'
                  checked={formData.principal}
                  onChange={handleChange('principal')}
                />
                <label htmlFor='principal' className='cursor-pointer'>
                  Marcar como endereço principal
                </label>
              </div>
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

export default EnderecosTab
