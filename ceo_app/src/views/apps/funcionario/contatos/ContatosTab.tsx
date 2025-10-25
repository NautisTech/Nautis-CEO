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
interface Contato {
  id?: number
  funcionario_id?: number
  tipo: string
  valor: string
  principal: boolean
  observacoes?: string
  criado_em?: string
  atualizado_em?: string
}

const ContatosTab = ({ funcionarioId }: { funcionarioId: number }) => {
  const isCreate = funcionarioId === 0
  const createContext = useFuncionarioCreate()

  // States
  const [contatos, setContatos] = useState<Contato[]>([])
  const [isLoading, setIsLoading] = useState(!isCreate)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    tipo: 'Telefone',
    valor: '',
    principal: false,
    observacoes: ''
  })

  // Load contacts
  useEffect(() => {
    if (isCreate) {
      setContatos(createContext.data.contatos)
      setIsLoading(false)
    } else {
      loadContatos()
    }
  }, [funcionarioId, isCreate])

  const loadContatos = async () => {
    try {
      setIsLoading(true)
      const data = await funcionariosAPI.getContatos(funcionarioId)
      setContatos(data)
    } catch (err) {
      console.error('Erro ao carregar contatos:', err)
      setError('Erro ao carregar contatos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenDialog = (contato?: Contato, index?: number) => {
    if (contato) {
      setEditingIndex(index ?? null)
      setFormData({
        tipo: contato.tipo,
        valor: contato.valor,
        principal: contato.principal,
        observacoes: contato.observacoes || ''
      })
    } else {
      setEditingIndex(null)
      setFormData({
        tipo: 'Telefone',
        valor: '',
        principal: false,
        observacoes: ''
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

      const contatoData = {
        tipo: formData.tipo,
        valor: formData.valor,
        principal: formData.principal,
        observacoes: formData.observacoes || undefined
      }

      if (isCreate) {
        // Create mode: store in context
        if (editingIndex !== null) {
          createContext.updateContato(editingIndex, contatoData)
        } else {
          createContext.addContato(contatoData)
        }
        setContatos(editingIndex !== null
          ? contatos.map((c, i) => i === editingIndex ? contatoData : c)
          : [...contatos, contatoData]
        )
      } else {
        // Edit mode: API calls
        const payload = {
          funcionario_id: funcionarioId,
          ...contatoData
        }

        if (editingIndex !== null && contatos[editingIndex]?.id) {
          await funcionariosAPI.updateContato(contatos[editingIndex].id!, payload)
        } else {
          await funcionariosAPI.createContato(payload)
        }
        await loadContatos()
      }

      handleCloseDialog()
    } catch (err: any) {
      console.error('Erro ao salvar contato:', err)
      setError(err.message || 'Erro ao salvar contato')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (index: number) => {
    if (!confirm('Tem certeza que deseja excluir este contato?')) return

    try {
      if (isCreate) {
        // Create mode: remove from context
        createContext.removeContato(index)
        setContatos(contatos.filter((_, i) => i !== index))
      } else {
        // Edit mode: API call
        const contato = contatos[index]
        if (contato?.id) {
          await funcionariosAPI.deleteContato(contato.id)
          await loadContatos()
        }
      }
    } catch (err: any) {
      console.error('Erro ao excluir contato:', err)
      setError(err.message || 'Erro ao excluir contato')
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
          title='Contactos'
          action={
            <Button variant='contained' onClick={() => handleOpenDialog()} startIcon={<i className='tabler-plus' />}>
              Adicionar Contacto
            </Button>
          }
        />
        <CardContent>
          {error && (
            <Alert severity='error' onClose={() => setError(null)} className='mb-4'>
              {error}
            </Alert>
          )}

          {contatos.length === 0 ? (
            <Typography color='text.secondary' className='text-center py-8'>
              Nenhum contacto registado
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Principal</TableCell>
                    <TableCell>Observações</TableCell>
                    <TableCell align='right'>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contatos.map((contato, index) => (
                    <TableRow key={index}>
                      <TableCell>{contato.tipo}</TableCell>
                      <TableCell>{contato.valor}</TableCell>
                      <TableCell>
                        {contato.principal && <Chip label='Principal' color='primary' size='small' />}
                      </TableCell>
                      <TableCell>{contato.observacoes}</TableCell>
                      <TableCell align='right'>
                        <IconButton size='small' onClick={() => handleOpenDialog(contato, index)}>
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
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth='sm' fullWidth>
        <DialogTitle>{editingIndex !== null ? 'Editar Contacto' : 'Adicionar Contacto'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={4} className='pt-4'>
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                select
                fullWidth
                label='Tipo *'
                value={formData.tipo}
                onChange={handleChange('tipo')}
                required
              >
                <MenuItem value='Telefone'>Telefone</MenuItem>
                <MenuItem value='Telemóvel'>Telemóvel</MenuItem>
                <MenuItem value='Email'>Email</MenuItem>
                <MenuItem value='WhatsApp'>WhatsApp</MenuItem>
                <MenuItem value='Outro'>Outro</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                label='Valor *'
                value={formData.valor}
                onChange={handleChange('valor')}
                required
              />
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
                  Marcar como contacto principal
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

export default ContatosTab
