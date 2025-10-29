'use client'

import { useState, useEffect } from 'react'
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
import type { Formacao } from '@/libs/api/formacoes'
import { formacoesAPI } from '@/libs/api/formacoes'

interface InformacoesGeraisProps {
  formacao: Formacao | null
  onSave: (formacao: Formacao) => void
}

const InformacoesGerais = ({ formacao, onSave }: InformacoesGeraisProps) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: '',
    nivel: '',
    publicado: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (formacao) {
      setFormData({
        titulo: formacao.titulo,
        descricao: formacao.descricao,
        categoria: formacao.categoria,
        nivel: formacao.nivel,
        publicado: formacao.publicado
      })
    }
  }, [formacao])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let result: Formacao
      if (formacao) {
        // Atualizar formação existente
        result = await formacoesAPI.atualizar(formacao.id, formData)
      } else {
        // Criar nova formação
        result = await formacoesAPI.criar(formData)
      }
      onSave(result)
    } catch (err) {
      console.error('Erro ao salvar formação:', err)
      setError('Erro ao salvar formação. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
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

            <Grid size={{ xs: 12, md: 6 }}>
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

            <Grid size={{ xs: 12 }}>
              <Button type='submit' variant='contained' disabled={loading}>
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 2 }} />
                    {formacao ? 'Atualizando...' : 'Criando...'}
                  </>
                ) : (
                  formacao ? 'Atualizar' : 'Criar Formação'
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
