'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import LinearProgress from '@mui/material/LinearProgress'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'
import { formacoesAPI } from '@/libs/api/formacoes'
import type { Formacao } from '@/libs/api/formacoes'

type Props = {
  searchValue: string
}

const MinhasFormacoesCourses = ({ searchValue }: Props) => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const [formacoes, setFormacoes] = useState<Formacao[]>([])
  const [filteredData, setFilteredData] = useState<Formacao[]>([])
  const [loading, setLoading] = useState(true)
  const [categoria, setCategoria] = useState<string>('All')
  const [hideCompleted, setHideCompleted] = useState(false)

  useEffect(() => {
    loadFormacoes()
  }, [])

  const loadFormacoes = async () => {
    try {
      setLoading(true)
      const data = await formacoesAPI.disponiveis()
      setFormacoes(data)
    } catch (error) {
      console.error('Erro ao carregar formações:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let newData = formacoes.filter(formacao => {
      if (categoria === 'All') {
        return !hideCompleted || (formacao.progresso || 0) < 100
      }

      return formacao.categoria === categoria && (!hideCompleted || (formacao.progresso || 0) < 100)
    })

    if (searchValue) {
      newData = newData.filter(formacao => formacao.titulo.toLowerCase().includes(searchValue.toLowerCase()))
    }

    setFilteredData(newData)
  }, [searchValue, categoria, hideCompleted, formacoes])

  const handleViewCourse = (id: number) => {
    router.push(getLocalizedUrl(`/t-formacoes/${id}`, locale as Locale))
  }

  // Get unique categorias
  const categorias = ['All', ...Array.from(new Set(formacoes.map(f => f.categoria)))]

  if (loading) {
    return (
      <Card className='flex items-center justify-center p-10'>
        <CircularProgress />
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className='flex flex-col gap-6'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div>
            <Typography variant='h5'>As Minhas Formações</Typography>
            <Typography>Total de {formacoes.length} {formacoes.length === 1 ? 'formação' : 'formações'}</Typography>
          </div>
          <div className='flex flex-wrap items-center gap-y-4 gap-x-6'>
            <FormControl fullWidth size='small' className='is-[250px] flex-auto'>
              <Select
                fullWidth
                value={categoria}
                onChange={e => setCategoria(e.target.value)}
              >
                {categorias.map(cat => (
                  <MenuItem key={cat} value={cat}>
                    {cat === 'All' ? 'Todas as Categorias' : cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={<Switch onChange={e => setHideCompleted(e.target.checked)} checked={hideCompleted} />}
              label='Ocultar concluídas'
            />
          </div>
        </div>
        {filteredData.length > 0 ? (
          <Grid container spacing={6}>
            {filteredData.map((formacao) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={formacao.id}>
                <div className='border rounded bs-full'>
                  {formacao.capa_url && (
                    <div className='pli-2 pbs-2'>
                      <img
                        src={formacao.capa_url}
                        alt={formacao.titulo}
                        className='is-full rounded cursor-pointer'
                        onClick={() => handleViewCourse(formacao.id)}
                      />
                    </div>
                  )}
                  <div className='flex flex-col gap-4 p-5'>
                    <div className='flex items-center justify-between'>
                      <Chip label={formacao.categoria} variant='tonal' size='small' color='primary' />
                      <Chip label={formacao.nivel} variant='tonal' size='small' color='secondary' />
                    </div>
                    <div className='flex flex-col gap-1'>
                      <Typography
                        variant='h5'
                        className='cursor-pointer hover:text-primary'
                        onClick={() => handleViewCourse(formacao.id)}
                      >
                        {formacao.titulo}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {formacao.descricao?.substring(0, 100)}...
                      </Typography>
                    </div>
                    <div className='flex flex-col gap-2'>
                      <div className='flex items-center justify-between'>
                        <Typography variant='body2'>Progresso</Typography>
                        <Typography variant='body2' className='font-medium'>
                          {formacao.progresso || 0}%
                        </Typography>
                      </div>
                      <LinearProgress
                        variant='determinate'
                        value={formacao.progresso || 0}
                        color={formacao.progresso === 100 ? 'success' : 'primary'}
                        className='bs-2'
                      />
                    </div>
                    <div className='flex items-center justify-between gap-2'>
                      <div className='flex items-center gap-2'>
                        <i className='tabler-clock text-textSecondary' />
                        <Typography variant='body2'>{formacao.duracao_minutos} min</Typography>
                      </div>
                      <Button
                        variant='tonal'
                        size='small'
                        onClick={() => handleViewCourse(formacao.id)}
                      >
                        {formacao.progresso === 100 ? 'Rever' : 'Continuar'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        ) : (
          <div className='flex flex-col items-center justify-center gap-4 p-10'>
            <i className='tabler-school text-[72px] text-textSecondary' />
            <Typography variant='h5'>Nenhuma formação encontrada</Typography>
            <Typography color='text.secondary'>
              {searchValue
                ? 'Tente ajustar a sua pesquisa ou filtros'
                : 'Ainda não está inscrito em nenhuma formação'}
            </Typography>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default MinhasFormacoesCourses
