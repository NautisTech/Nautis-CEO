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
import DocumentoAnexo from './DocumentoAnexo'

// API Imports
import { funcionariosAPI } from '@/libs/api/funcionarios/api'
import { useFuncionarioCreate } from '../FuncionarioCreateContext'

// Util Imports
import { formatDateForInput } from '@/utils/dateFormatter'

// Types
interface Documento {
  id?: number
  funcionario_id?: number
  tipo: string
  numero: string
  orgao_emissor?: string
  vitalicio?: boolean
  data_emissao?: string
  data_validade?: string
  detalhes?: string
  anexo_url?: string
  criado_em?: string
  atualizado_em?: string
}

const DocumentosTab = ({ funcionarioId, isPreview = false }: { funcionarioId: number; isPreview?: boolean }) => {
  const isCreate = funcionarioId === 0
  const createContext = useFuncionarioCreate()

  // States
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [isLoading, setIsLoading] = useState(!isCreate)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    tipo: 'BI/CC',
    numero: '',
    orgao_emissor: '',
    vitalicio: false,
    data_emissao: '',
    data_validade: '',
    detalhes: '',
    anexo_url: ''
  })

  // Load documents
  useEffect(() => {
    if (isCreate) {
      setDocumentos(createContext.data.documentos)
      setIsLoading(false)
    } else {
      loadDocumentos()
    }
  }, [funcionarioId, isCreate])

  const loadDocumentos = async () => {
    try {
      setIsLoading(true)
      const data = await funcionariosAPI.getDocumentos(funcionarioId)
      setDocumentos(data)
    } catch (err) {
      console.error('Erro ao carregar documentos:', err)
      setError('Erro ao carregar documentos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenDialog = (documento?: Documento, index?: number) => {
    if (documento) {
      setEditingIndex(index ?? null)
      setFormData({
        tipo: documento.tipo,
        numero: documento.numero,
        orgao_emissor: documento.orgao_emissor || '',
        vitalicio: documento.vitalicio || false,
        data_emissao: formatDateForInput(documento.data_emissao),
        data_validade: formatDateForInput(documento.data_validade),
        detalhes: documento.detalhes || '',
        anexo_url: documento.anexo_url || ''
      })
    } else {
      setEditingIndex(null)
      setFormData({
        tipo: 'BI/CC',
        numero: '',
        orgao_emissor: '',
        vitalicio: false,
        data_emissao: '',
        data_validade: '',
        detalhes: '',
        anexo_url: ''
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

      const documentoData = {
        tipo: formData.tipo,
        numero: formData.numero,
        orgao_emissor: formData.orgao_emissor || undefined,
        vitalicio: formData.vitalicio,
        data_emissao: formData.data_emissao || undefined,
        data_validade: formData.vitalicio ? undefined : formData.data_validade || undefined,
        detalhes: formData.detalhes || undefined,
        anexo_url: formData.anexo_url || undefined
      }

      if (isCreate) {
        // Create mode: store in context
        if (editingIndex !== null) {
          createContext.updateDocumento(editingIndex, documentoData)
        } else {
          createContext.addDocumento(documentoData)
        }
        setDocumentos(editingIndex !== null
          ? documentos.map((d, i) => i === editingIndex ? documentoData : d)
          : [...documentos, documentoData]
        )
      } else {
        // Edit mode: API calls
        const payload = {
          funcionario_id: funcionarioId,
          ...documentoData
        }

        if (editingIndex !== null && documentos[editingIndex]?.id) {
          await funcionariosAPI.updateDocumento(documentos[editingIndex].id!, payload)
        } else {
          await funcionariosAPI.createDocumento(payload)
        }
        await loadDocumentos()
      }

      handleCloseDialog()
    } catch (err: any) {
      console.error('Erro ao salvar documento:', err)
      setError(err.message || 'Erro ao salvar documento')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (index: number) => {
    if (!confirm('Tem certeza que deseja excluir este documento?')) return

    try {
      if (isCreate) {
        createContext.removeDocumento(index)
        setDocumentos(documentos.filter((_, i) => i !== index))
      } else {
        const documento = documentos[index]
        if (documento?.id) {
          await funcionariosAPI.deleteDocumento(documento.id)
          await loadDocumentos()
        }
      }
    } catch (err: any) {
      console.error('Erro ao excluir documento:', err)
      setError(err.message || 'Erro ao excluir documento')
    }
  }

  const isExpired = (documento: Documento) => {
    if (documento.vitalicio || !documento.data_validade) return false
    return new Date(documento.data_validade) < new Date()
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
          title='Documentos'
          action={
            !isPreview && (
              <Button variant='contained' onClick={() => handleOpenDialog()} startIcon={<i className='tabler-plus' />}>
                Adicionar Documento
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

          {documentos.length === 0 ? (
            <Typography color='text.secondary' className='text-center py-8'>
              Nenhum documento registado
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Número</TableCell>
                    <TableCell>Órgão Emissor</TableCell>
                    <TableCell>Data Emissão</TableCell>
                    <TableCell>Data Validade</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Anexo</TableCell>
                    <TableCell align='right'>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documentos.map((documento, index) => (
                    <TableRow key={index}>
                      <TableCell>{documento.tipo}</TableCell>
                      <TableCell>{documento.numero}</TableCell>
                      <TableCell>{documento.orgao_emissor || '-'}</TableCell>
                      <TableCell>
                        {documento.data_emissao
                          ? new Date(documento.data_emissao).toLocaleDateString('pt-PT')
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {documento.vitalicio ? (
                          <Chip label='Vitalício' variant='tonal' color='success' size='small' />
                        ) : documento.data_validade ? (
                          <div className='flex items-center gap-2'>
                            <Typography variant='body2'>
                              {new Date(documento.data_validade).toLocaleDateString('pt-PT')}
                            </Typography>
                            {isExpired(documento) && (
                              <Chip label='Expirado' variant='tonal' color='error' size='small' />
                            )}
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={isExpired(documento) ? 'Expirado' : 'Válido'}
                          variant='tonal'
                          color={isExpired(documento) ? 'error' : 'success'}
                          size='small'
                        />
                      </TableCell>
                      <TableCell>
                        {documento.anexo_url ? (
                          <IconButton
                            size='small'
                            color='primary'
                            href={documento.anexo_url}
                            target='_blank'
                            title='Ver anexo'
                          >
                            <i className='tabler-eye' />
                          </IconButton>
                        ) : (
                          <Typography variant='caption' color='text.secondary'>
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align='right'>
                        {!isPreview && (
                          <>
                            <IconButton size='small' onClick={() => handleOpenDialog(documento, index)}>
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
        <DialogTitle>{editingIndex !== null ? 'Editar Documento' : 'Adicionar Documento'}</DialogTitle>
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
                <MenuItem value='BI/CC'>BI/Cartão de Cidadão</MenuItem>
                <MenuItem value='Passaporte'>Passaporte</MenuItem>
                <MenuItem value='CNH'>Carta de Condução</MenuItem>
                <MenuItem value='NIF'>NIF</MenuItem>
                <MenuItem value='NISS'>NISS</MenuItem>
                <MenuItem value='Certificado'>Certificado</MenuItem>
                <MenuItem value='Diploma'>Diploma</MenuItem>
                <MenuItem value='Outro'>Outro</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Número *'
                value={formData.numero}
                onChange={handleChange('numero')}
                required
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                label='Órgão Emissor'
                value={formData.orgao_emissor}
                onChange={handleChange('orgao_emissor')}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                type='date'
                label='Data de Emissão'
                value={formData.data_emissao}
                onChange={handleChange('data_emissao')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                type='date'
                label='Data de Validade'
                value={formData.data_validade}
                onChange={handleChange('data_validade')}
                InputLabelProps={{ shrink: true }}
                disabled={formData.vitalicio}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='vitalicio'
                  checked={formData.vitalicio}
                  onChange={handleChange('vitalicio')}
                />
                <label htmlFor='vitalicio' className='cursor-pointer'>
                  Documento vitalício (sem data de validade)
                </label>
              </div>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                multiline
                rows={3}
                label='Detalhes'
                value={formData.detalhes}
                onChange={handleChange('detalhes')}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <DocumentoAnexo
                value={formData.anexo_url || null}
                onChange={url => setFormData(prev => ({ ...prev, anexo_url: url || '' }))}
                disabled={isSaving}
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

export default DocumentosTab
