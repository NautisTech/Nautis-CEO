'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'
import { formacoesAPI } from '@/libs/api/formacoes'
import type { Formacao } from '@/libs/api/formacoes'

const FormacoesList = () => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const [formacoes, setFormacoes] = useState<Formacao[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFormacoes()
  }, [])

  const loadFormacoes = async () => {
    try {
      const data = await formacoesAPI.listar()
      console.log('Formações carregadas:', data)
      setFormacoes(data)
    } catch (error) {
      console.error('Erro ao carregar formações:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    router.push(getLocalizedUrl('/apps/formacoes/create', locale as Locale))
  }

  const handleEdit = (id: number) => {
    router.push(getLocalizedUrl(`/apps/formacoes/edit/${id}`, locale as Locale))
  }

  if (loading) return <Typography>Carregando...</Typography>

  return (
    <Card>
      <CardHeader
        title='Formações'
        action={
          <Button variant='contained' onClick={handleCreate}>
            Adicionar Formação
          </Button>
        }
      />
      <CardContent>
        <Grid container spacing={4}>
          {formacoes.map(formacao => (
            <Grid key={formacao.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <div className='border rounded bs-full'>
                {formacao.capa_url && (
                  <div className='pli-2 pbs-2'>
                    <img
                      src={formacao.capa_url}
                      alt={formacao.titulo}
                      className='is-full rounded cursor-pointer'
                      onClick={() => handleEdit(formacao.id)}
                    />
                  </div>
                )}
                <div className='flex flex-col gap-4 p-5'>
                  <div className='flex gap-2'>
                    <Chip label={formacao.categoria} size='small' color='primary' variant='tonal' />
                    <Chip label={formacao.nivel} size='small' color='secondary' variant='tonal' />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <Typography variant='h5' className='cursor-pointer hover:text-primary' onClick={() => handleEdit(formacao.id)}>
                      {formacao.titulo}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {formacao.descricao?.substring(0, 100)}...
                    </Typography>
                  </div>
                  <div className='flex items-center justify-between'>
                    <Typography variant='caption' color='text.secondary'>
                      {formacao.duracao_minutos} min · {formacao.total_modulos || 0} módulos
                    </Typography>
                    <IconButton size='small' onClick={() => handleEdit(formacao.id)} className='text-textSecondary'>
                      <i className='tabler-edit' />
                    </IconButton>
                  </div>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default FormacoesList
