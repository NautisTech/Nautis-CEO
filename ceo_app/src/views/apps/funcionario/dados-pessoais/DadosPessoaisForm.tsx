'use client'

// React Imports
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import FuncionarioFoto from './FuncionarioFoto'

// API Imports
import { funcionariosAPI } from '@/libs/api/funcionarios/api'
import { useTiposFuncionario } from '@/libs/api/funcionarios'
import { useFuncionarioCreate } from '../FuncionarioCreateContext'

import { formatDateForInput } from '@/utils/dateFormatter'

// Type Imports
import type { Funcionario } from '@/libs/api/funcionarios/types'
import { Menu } from '@mui/material'

const DadosPessoaisForm = ({ funcionarioId, isPreview = false }: { funcionarioId: number; isPreview?: boolean }) => {
  const isCreate = funcionarioId === 0
  const createContext = useFuncionarioCreate()

  // States
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    numero: '',
    tipo_funcionario_id: '',
    nome_completo: '',
    nome_abreviado: '',
    sexo: '',
    data_nascimento: '',
    naturalidade: '',
    nacionalidade: '',
    estado_civil: '',
    foto_url: '',
    observacoes: '',
    criarUtilizador: false,
    email: '',
    senha: ''
  })

  // Hooks
  const router = useRouter()
  const { data: tiposFuncionario } = useTiposFuncionario()

  // Load funcionario data if editing
  useEffect(() => {
    const loadData = async () => {
      if (isCreate) return

      try {
        setIsLoading(true)
        const data = await funcionariosAPI.getById(funcionarioId)

        setFormData({
          numero: data?.numero?.toString() || '',
          tipo_funcionario_id: data?.tipo_funcionario_id?.toString() || '',
          nome_completo: data?.nome_completo || '',
          nome_abreviado: data?.nome_abreviado || '',
          sexo: data?.sexo || '',
          data_nascimento: formatDateForInput(data?.data_nascimento),
          naturalidade: data?.naturalidade || '',
          nacionalidade: data?.nacionalidade || '',
          estado_civil: data?.estado_civil || '',
          foto_url: data?.foto_url || '',
          observacoes: data?.observacoes || '',
          criarUtilizador: false,
          email: '',
          senha: ''
        })
      } catch (err) {
        console.error('Erro ao carregar funcionário:', err)
        setError('Erro ao carregar dados do funcionário')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [funcionarioId, isCreate])

  const handleChange = (field: string) => (event: any) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const payload: any = {
        numero: parseInt(formData.numero),
        tipoFuncionarioId: parseInt(formData.tipo_funcionario_id),
        nomeCompleto: formData.nome_completo,
        nomeAbreviado: formData.nome_abreviado || undefined,
        sexo: formData.sexo || undefined,
        dataNascimento: formData.data_nascimento || undefined,
        naturalidade: formData.naturalidade || undefined,
        nacionalidade: formData.nacionalidade || undefined,
        estadoCivil: formData.estado_civil || undefined,
        fotoUrl: formData.foto_url || undefined,
        observacoes: formData.observacoes || undefined
      }

      if (isCreate) {
        payload.criarUtilizador = formData.criarUtilizador
        if (formData.criarUtilizador) {
          payload.email = formData.email
          payload.senha = formData.senha
        }

        // Incluir dados das outras tabs
        if (createContext.data.contatos.length > 0) {
          payload.contatos = createContext.data.contatos
        }
        if (createContext.data.enderecos.length > 0) {
          payload.enderecos = createContext.data.enderecos
        }
        if (createContext.data.empregos.length > 0) {
          payload.empregos = createContext.data.empregos
        }
        if (createContext.data.beneficios.length > 0) {
          payload.beneficios = createContext.data.beneficios
        }
        if (createContext.data.documentos.length > 0) {
          payload.documentos = createContext.data.documentos
        }

        const result = await funcionariosAPI.create(payload)
        setSuccess(true)

        // Limpar o contexto após criação bem-sucedida
        createContext.clearAll()

        if (result.id) {
          setTimeout(() => {
            router.push(`/apps/funcionario/${result.id}`)
          }, 1500)
        }
      } else {
        await funcionariosAPI.update(funcionarioId, payload)
        setSuccess(true)
      }
    } catch (err: any) {
      console.error('Erro ao salvar:', err)
      setError(err.message || 'Erro ao salvar funcionário')
    } finally {
      setIsSaving(false)
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
    <Card>
      <CardHeader title={isCreate ? 'Criar Funcionário' : 'Dados Pessoais'} />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={6}>
            {error && (
              <Grid size={{ xs: 12 }}>
                <Alert severity='error' onClose={() => setError(null)}>
                  {error}
                </Alert>
              </Grid>
            )}

            {success && (
              <Grid size={{ xs: 12 }}>
                <Alert severity='success' onClose={() => setSuccess(false)}>
                  Funcionário {isCreate ? 'criado' : 'atualizado'} com sucesso!
                </Alert>
              </Grid>
            )}

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Número *'
                type='number'
                value={formData.numero}
                onChange={handleChange('numero')}
                required
                disabled={isPreview}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                select
                fullWidth
                label='Tipo de Funcionário *'
                value={formData.tipo_funcionario_id}
                onChange={handleChange('tipo_funcionario_id')}
                required
                disabled={isPreview}
              >
                {tiposFuncionario?.map(tipo => (
                  <MenuItem key={tipo.id} value={tipo.id}>
                    {tipo.nome}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Nome Completo *'
                value={formData.nome_completo}
                onChange={handleChange('nome_completo')}
                required
                disabled={isPreview}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Nome Abreviado'
                value={formData.nome_abreviado}
                onChange={handleChange('nome_abreviado')}
                disabled={isPreview}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                select
                fullWidth
                label='Sexo'
                value={formData.sexo}
                onChange={handleChange('sexo')}
                disabled={isPreview}
              >
                <MenuItem value=''>Selecione</MenuItem>
                <MenuItem value='M'>Masculino</MenuItem>
                <MenuItem value='F'>Feminino</MenuItem>
                <MenuItem value='O'>Outro</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                type='date'
                label='Data de Nascimento'
                value={formData.data_nascimento}
                onChange={handleChange('data_nascimento')}
                InputLabelProps={{ shrink: true }}
                disabled={isPreview}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Naturalidade'
                value={formData.naturalidade}
                onChange={handleChange('naturalidade')}
                disabled={isPreview}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Nacionalidade'
                value={formData.nacionalidade}
                onChange={handleChange('nacionalidade')}
                disabled={isPreview}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                select
                fullWidth
                label='Estado Civil'
                value={formData.estado_civil}
                onChange={handleChange('estado_civil')}
                disabled={isPreview}
              >
                <MenuItem value=''>Selecione</MenuItem>
                <MenuItem value='Solteiro(a)'>Solteiro(a)</MenuItem>
                <MenuItem value='Casado(a)'>Casado(a)</MenuItem>
                <MenuItem value='Divorciado(a)'>Divorciado(a)</MenuItem>
                <MenuItem value='Viúvo(a)'>Viúvo(a)</MenuItem>
                <MenuItem value='União de Facto'>União de Facto</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                multiline
                rows={4}
                label='Observações'
                value={formData.observacoes}
                onChange={handleChange('observacoes')}
                disabled={isPreview}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FuncionarioFoto
                value={formData.foto_url || null}
                onChange={url => setFormData(prev => ({ ...prev, foto_url: url || '' }))}
                disabled={isSaving || isPreview}
              />
            </Grid>

            {isCreate && (
              <>
                <Grid size={{ xs: 12 }}>
                  <div className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      id='criarUtilizador'
                      checked={formData.criarUtilizador}
                      onChange={handleChange('criarUtilizador')}
                    />
                    <label htmlFor='criarUtilizador' className='cursor-pointer'>
                      Criar utilizador para acesso ao sistema
                    </label>
                  </div>
                </Grid>

                {formData.criarUtilizador && (
                  <>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CustomTextField
                        fullWidth
                        type='email'
                        label='Email para Login *'
                        value={formData.email}
                        onChange={handleChange('email')}
                        required={formData.criarUtilizador}
                        placeholder='email@exemplo.com'
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CustomTextField
                        fullWidth
                        type='password'
                        label='Senha *'
                        value={formData.senha}
                        onChange={handleChange('senha')}
                        required={formData.criarUtilizador}
                      />
                    </Grid>
                  </>
                )}
              </>
            )}

            <Grid size={{ xs: 12 }} className='flex gap-4'>
              {!isPreview && (
                <Button
                  variant='contained'
                  type='submit'
                  disabled={isSaving}
                  startIcon={isSaving ? <CircularProgress size={20} /> : null}
                >
                  {isSaving ? 'A guardar...' : isCreate ? 'Criar Funcionário' : 'Guardar Alterações'}
                </Button>
              )}
              <Button
                variant='tonal'
                color='secondary'
                type='reset'
                onClick={() => router.back()}
              >
                {isPreview ? 'Voltar' : 'Cancelar'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default DadosPessoaisForm
