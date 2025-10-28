'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import type { Formacao } from '@/libs/api/formacoes'
import { formacoesAPI } from '@/libs/api/formacoes'
import FormacaoCapaUpload from './FormacaoCapaUpload'

interface InformacoesGeraisProps {
  formacaoId: number
}

const InformacoesGerais = ({ formacaoId }: InformacoesGeraisProps) => {
  const router = useRouter()
  const [formacao, setFormacao] = useState<Formacao | null>(null)
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: '',
    nivel: '',
    duracao_minutos: 0,
    capa_url: '',
    publicado: false
  })
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(formacaoId !== 0)
  const [error, setError] = useState<string | null>(null)

  // Carregar dados da formação se não for criação
  useEffect(() => {
    const fetchFormacao = async () => {
      if (formacaoId === 0) return

      try {
        setLoadingData(true)
        const data = await formacoesAPI.obter(formacaoId)
        setFormacao(data)
        setFormData({
          titulo: data.titulo,
          descricao: data.descricao,
          categoria: data.categoria,
          nivel: data.nivel,
          duracao_minutos: data.duracao_minutos || 0,
          capa_url: data.capa_url || '',
          publicado: data.publicado
        })
      } catch (err) {
        console.error('Erro ao carregar formação:', err)
        setError('Erro ao carregar formação')
      } finally {
        setLoadingData(false)
      }
    }

    fetchFormacao()
  }, [formacaoId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let result: Formacao
      if (formacaoId === 0) {
        // Criar nova formação
        result = await formacoesAPI.criar(formData)
        // Redirecionar para a página de edição da formação criada
        router.push(`/apps/formacoes/edit/${result.id}`)
      } else {
        // Atualizar formação existente
        result = await formacoesAPI.atualizar(formacaoId, formData)
        setFormacao(result)
      }
    } catch (err) {
      console.error('Erro ao salvar formação:', err)
      setError('Erro ao salvar formação. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <Card className='flex items-center justify-center p-10'>
        <CircularProgress />
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader title='Informações Gerais' />
      <Divider />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={5}>
            {error && (
              <Grid size={{ xs: 12 }}>
                <Alert severity='error'>{error}</Alert>
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label='Título da Formação'
                value={formData.titulo}
                onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                required
                disabled={loading}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label='Descrição'
                value={formData.descricao}
                onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                disabled={loading}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                select
                label='Categoria'
                value={formData.categoria}
                onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                disabled={loading}
              >
                <MenuItem value='Design'>Design</MenuItem>
                <MenuItem value='Programação'>Programação</MenuItem>
                <MenuItem value='Marketing'>Marketing</MenuItem>
                <MenuItem value='Gestão'>Gestão</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                select
                label='Nível'
                value={formData.nivel}
                onChange={e => setFormData({ ...formData, nivel: e.target.value })}
                disabled={loading}
              >
                <MenuItem value='Iniciante'>Iniciante</MenuItem>
                <MenuItem value='Intermédio'>Intermédio</MenuItem>
                <MenuItem value='Avançado'>Avançado</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type='number'
                label='Duração (minutos)'
                value={formData.duracao_minutos}
                onChange={e => setFormData({ ...formData, duracao_minutos: Number(e.target.value) })}
                disabled={loading}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant='body2' className='font-medium mbe-2'>
                Imagem de Capa
              </Typography>
              <FormacaoCapaUpload
                value={formData.capa_url}
                onChange={url => setFormData({ ...formData, capa_url: url })}
                disabled={loading}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.publicado}
                    onChange={e => setFormData({ ...formData, publicado: e.target.checked })}
                    disabled={loading}
                  />
                }
                label='Publicar formação (visível para alunos)'
              />
            </Grid>

            <Grid size={{ xs: 12 }} className='flex gap-4'>
              <Button
                variant='tonal'
                color='secondary'
                onClick={() => router.push('/apps/formacoes/list')}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type='submit' variant='contained' disabled={loading}>
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 2 }} />
                    {formacaoId === 0 ? 'Criando...' : 'Atualizando...'}
                  </>
                ) : (
                  formacaoId === 0 ? 'Criar Formação' : 'Atualizar'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default InformacoesGerais
