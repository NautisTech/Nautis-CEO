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
import Divider from '@mui/material/Divider'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// API Imports
import { funcionariosAPI } from '@/libs/api/funcionarios/api'
import { useFuncionarioCreate } from '../FuncionarioCreateContext'

// Types
interface Emprego {
  id?: number
  funcionario_id?: number
  empresa?: string
  data_admissao: string
  data_inicio: string
  data_fim?: string
  tipo_contrato: string
  cargo: string
  departamento?: string
  categoria?: string
  nivel_qualificacao?: string
  vencimento_base?: number
  carga_horaria?: string
  situacao?: string
  motivo_desligamento?: string
  forma_pagamento?: string
  banco?: string
  agencia?: string
  conta?: string
  iban?: string
  observacoes?: string
  criado_em?: string
  atualizado_em?: string
}

const EmpregosTab = ({ funcionarioId, viewOnly = false }: { funcionarioId: number; viewOnly?: boolean }) => {
  const isCreate = funcionarioId === 0
  const createContext = useFuncionarioCreate()

  // States
  const [empregos, setEmpregos] = useState<Emprego[]>([])
  const [isLoading, setIsLoading] = useState(!isCreate)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    empresa: '',
    data_admissao: '',
    data_inicio: '',
    data_fim: '',
    tipo_contrato: 'Sem termo',
    cargo: '',
    departamento: '',
    categoria: '',
    nivel_qualificacao: '',
    vencimento_base: '',
    carga_horaria: '',
    situacao: 'Ativo',
    motivo_desligamento: '',
    forma_pagamento: 'Transferência Bancária',
    banco: '',
    agencia: '',
    conta: '',
    iban: '',
    observacoes: ''
  })

  // Load employment records
  useEffect(() => {
    if (isCreate) {
      setEmpregos(createContext.data.empregos)
      setIsLoading(false)
    } else {
      loadEmpregos()
    }
  }, [funcionarioId, isCreate])

  const loadEmpregos = async () => {
    try {
      setIsLoading(true)
      const data = await funcionariosAPI.getEmpregos(funcionarioId)
      setEmpregos(data)
    } catch (err) {
      console.error('Erro ao carregar empregos:', err)
      setError('Erro ao carregar empregos')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDateForInput = (date?: string) => {
    if (!date) return ''
    // Convert ISO date or SQL date to YYYY-MM-DD format for input[type="date"]
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) return ''
    return dateObj.toISOString().split('T')[0]
  }

  const handleOpenDialog = (emprego?: Emprego, index?: number) => {
    if (emprego) {
      setEditingIndex(index ?? null)
      setFormData({
        empresa: emprego.empresa || '',
        data_admissao: formatDateForInput(emprego.data_admissao),
        data_inicio: formatDateForInput(emprego.data_inicio),
        data_fim: formatDateForInput(emprego.data_fim),
        tipo_contrato: emprego.tipo_contrato,
        cargo: emprego.cargo,
        departamento: emprego.departamento || '',
        categoria: emprego.categoria || '',
        nivel_qualificacao: emprego.nivel_qualificacao || '',
        vencimento_base: emprego.vencimento_base?.toString() || '',
        carga_horaria: emprego.carga_horaria || '',
        situacao: emprego.situacao || 'Ativo',
        motivo_desligamento: emprego.motivo_desligamento || '',
        forma_pagamento: emprego.forma_pagamento || 'Transferência Bancária',
        banco: emprego.banco || '',
        agencia: emprego.agencia || '',
        conta: emprego.conta || '',
        iban: emprego.iban || '',
        observacoes: emprego.observacoes || ''
      })
    } else {
      setEditingIndex(null)
      setFormData({
        empresa: '',
        data_admissao: '',
        data_inicio: '',
        data_fim: '',
        tipo_contrato: 'Sem termo',
        cargo: '',
        departamento: '',
        categoria: '',
        nivel_qualificacao: '',
        vencimento_base: '',
        carga_horaria: '',
        situacao: 'Ativo',
        motivo_desligamento: '',
        forma_pagamento: 'Transferência Bancária',
        banco: '',
        agencia: '',
        conta: '',
        iban: '',
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
    setFormData(prev => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async () => {
    try {
      setIsSaving(true)
      setError(null)

      const empregoData = {
        empresa: formData.empresa || undefined,
        data_admissao: formData.data_admissao,
        data_inicio: formData.data_inicio,
        data_fim: formData.data_fim || undefined,
        tipo_contrato: formData.tipo_contrato,
        cargo: formData.cargo,
        departamento: formData.departamento || undefined,
        categoria: formData.categoria || undefined,
        nivel_qualificacao: formData.nivel_qualificacao || undefined,
        vencimento_base: formData.vencimento_base ? parseFloat(formData.vencimento_base) : undefined,
        carga_horaria: formData.carga_horaria || undefined,
        situacao: formData.situacao || undefined,
        motivo_desligamento: formData.motivo_desligamento || undefined,
        forma_pagamento: formData.forma_pagamento || undefined,
        banco: formData.banco || undefined,
        agencia: formData.agencia || undefined,
        conta: formData.conta || undefined,
        iban: formData.iban || undefined,
        observacoes: formData.observacoes || undefined
      }

      if (isCreate) {
        // Create mode: store in context
        if (editingIndex !== null) {
          createContext.updateEmprego(editingIndex, empregoData)
        } else {
          createContext.addEmprego(empregoData)
        }
        setEmpregos(editingIndex !== null
          ? empregos.map((e, i) => i === editingIndex ? empregoData : e)
          : [...empregos, empregoData]
        )
      } else {
        // Edit mode: API calls
        const payload = {
          funcionario_id: funcionarioId,
          ...empregoData
        }

        if (editingIndex !== null && empregos[editingIndex]?.id) {
          await funcionariosAPI.updateEmprego(empregos[editingIndex].id!, payload)
        } else {
          await funcionariosAPI.createEmprego(payload)
        }
        await loadEmpregos()
      }

      handleCloseDialog()
    } catch (err: any) {
      console.error('Erro ao salvar emprego:', err)
      setError(err.message || 'Erro ao salvar emprego')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (index: number) => {
    if (!confirm('Tem certeza que deseja excluir este emprego?')) return

    try {
      if (isCreate) {
        createContext.removeEmprego(index)
        setEmpregos(empregos.filter((_, i) => i !== index))
      } else {
        const emprego = empregos[index]
        if (emprego?.id) {
          await funcionariosAPI.deleteEmprego(emprego.id)
          await loadEmpregos()
        }
      }
    } catch (err: any) {
      console.error('Erro ao excluir emprego:', err)
      setError(err.message || 'Erro ao excluir emprego')
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
          title='Empregos'
          action={
            !viewOnly && (
              <Button variant='contained' onClick={() => handleOpenDialog()} startIcon={<i className='tabler-plus' />}>
                Adicionar Emprego
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

          {empregos.length === 0 ? (
            <Typography color='text.secondary' className='text-center py-8'>
              Nenhum emprego registado
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Empresa</TableCell>
                    <TableCell>Cargo</TableCell>
                    <TableCell>Tipo Contrato</TableCell>
                    <TableCell>Data Início</TableCell>
                    <TableCell>Vencimento</TableCell>
                    <TableCell>Situação</TableCell>
                    {!viewOnly && <TableCell align='right'>Ações</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {empregos.map((emprego, index) => (
                    <TableRow key={index}>
                      <TableCell>{emprego.empresa || '-'}</TableCell>
                      <TableCell>{emprego.cargo}</TableCell>
                      <TableCell>{emprego.tipo_contrato}</TableCell>
                      <TableCell>{new Date(emprego.data_inicio).toLocaleDateString('pt-PT')}</TableCell>
                      <TableCell>{formatCurrency(emprego.vencimento_base)}</TableCell>
                      <TableCell>
                        <Chip
                          label={emprego.situacao || 'Ativo'}
                          color={emprego.situacao === 'Ativo' ? 'success' : 'default'}
                          size='small'
                        />
                      </TableCell>
                      {!viewOnly && (
                        <TableCell align='right'>
                          <IconButton size='small' onClick={() => handleOpenDialog(emprego, index)}>
                            <i className='tabler-edit' />
                          </IconButton>
                          <IconButton size='small' color='error' onClick={() => handleDelete(index)}>
                            <i className='tabler-trash' />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Dialog for Add/Edit */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth='lg' fullWidth>
        <DialogTitle>{editingIndex !== null ? 'Editar Emprego' : 'Adicionar Emprego'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={4} className='pt-4'>
            {/* Informações do Emprego */}
            <Grid size={{ xs: 12 }}>
              <Typography variant='h6' className='mb-2'>
                Informações do Emprego
              </Typography>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField fullWidth label='Empresa' value={formData.empresa} onChange={handleChange('empresa')} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Cargo'
                value={formData.cargo}
                onChange={handleChange('cargo')}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Departamento'
                value={formData.departamento}
                onChange={handleChange('departamento')}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Categoria'
                value={formData.categoria}
                onChange={handleChange('categoria')}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                select
                fullWidth
                label='Tipo de Contrato'
                value={formData.tipo_contrato}
                onChange={handleChange('tipo_contrato')}
                required
              >
                <MenuItem value='Sem termo'>Sem termo</MenuItem>
                <MenuItem value='A termo certo'>A termo certo</MenuItem>
                <MenuItem value='A termo incerto'>A termo incerto</MenuItem>
                <MenuItem value='Estágio'>Estágio</MenuItem>
                <MenuItem value='Prestação de serviços'>Prestação de serviços</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Nível de Qualificação'
                value={formData.nivel_qualificacao}
                onChange={handleChange('nivel_qualificacao')}
              />
            </Grid>

            {/* Datas */}
            <Grid size={{ xs: 12 }}>
              <Typography variant='h6' className='mb-2 mt-4'>
                Datas
              </Typography>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <CustomTextField
                fullWidth
                type='date'
                label='Data de Admissão'
                value={formData.data_admissao}
                onChange={handleChange('data_admissao')}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <CustomTextField
                fullWidth
                type='date'
                label='Data de Início'
                value={formData.data_inicio}
                onChange={handleChange('data_inicio')}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <CustomTextField
                fullWidth
                type='date'
                label='Data de Fim'
                value={formData.data_fim}
                onChange={handleChange('data_fim')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Remuneração */}
            <Grid size={{ xs: 12 }}>
              <Typography variant='h6' className='mb-2 mt-4'>
                Remuneração
              </Typography>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                type='number'
                label='Vencimento Base (€)'
                value={formData.vencimento_base}
                onChange={handleChange('vencimento_base')}
                inputProps={{ step: '0.01' }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Carga Horária'
                value={formData.carga_horaria}
                onChange={handleChange('carga_horaria')}
                placeholder='Ex: 40h semanais'
              />
            </Grid>

            {/* Pagamento */}
            <Grid size={{ xs: 12 }}>
              <Typography variant='h6' className='mb-2 mt-4'>
                Dados de Pagamento
              </Typography>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                select
                fullWidth
                label='Forma de Pagamento'
                value={formData.forma_pagamento}
                onChange={handleChange('forma_pagamento')}
              >
                <MenuItem value='Transferência Bancária'>Transferência Bancária</MenuItem>
                <MenuItem value='Cheque'>Cheque</MenuItem>
                <MenuItem value='Dinheiro'>Dinheiro</MenuItem>
                <MenuItem value='Outro'>Outro</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField fullWidth label='Banco' value={formData.banco} onChange={handleChange('banco')} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Agência'
                value={formData.agencia}
                onChange={handleChange('agencia')}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField fullWidth label='Conta' value={formData.conta} onChange={handleChange('conta')} />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <CustomTextField fullWidth label='IBAN' value={formData.iban} onChange={handleChange('iban')} />
            </Grid>

            {/* Situação */}
            <Grid size={{ xs: 12 }}>
              <Typography variant='h6' className='mb-2 mt-4'>
                Situação
              </Typography>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                select
                fullWidth
                label='Situação'
                value={formData.situacao}
                onChange={handleChange('situacao')}
              >
                <MenuItem value='Ativo'>Ativo</MenuItem>
                <MenuItem value='Inativo'>Inativo</MenuItem>
                <MenuItem value='Suspenso'>Suspenso</MenuItem>
                <MenuItem value='Desligado'>Desligado</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Motivo Desligamento'
                value={formData.motivo_desligamento}
                onChange={handleChange('motivo_desligamento')}
              />
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

export default EmpregosTab
