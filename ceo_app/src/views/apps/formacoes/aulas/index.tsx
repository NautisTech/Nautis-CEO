'use client'

import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import type { Modulo, Aula } from '@/libs/api/formacoes'
import { formacoesAPI } from '@/libs/api/formacoes'
import CriarAulaDialog from './CriarAulaDialog'

interface AulasProps {
  formacaoId: number
  preSelectedModuloId?: number | null
}

const tipoColors: { [key: string]: 'primary' | 'success' | 'error' | 'warning' | 'info' } = {
  video: 'error',
  texto: 'primary',
  pdf: 'warning',
  imagem: 'info',
  quiz: 'success'
}

const Aulas = ({ formacaoId, preSelectedModuloId }: AulasProps) => {
  const [modulos, setModulos] = useState<Modulo[]>([])
  const [selectedModulo, setSelectedModulo] = useState<number | ''>('')
  const [aulas, setAulas] = useState<Aula[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingAulas, setLoadingAulas] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Carregar módulos
  useEffect(() => {
    const fetchModulos = async () => {
      try {
        setLoading(true)
        const data = await formacoesAPI.listarModulos(formacaoId)
        setModulos(data)
      } catch (err) {
        console.error('Erro ao carregar módulos:', err)
      } finally {
        setLoading(false)
      }
    }

    if (formacaoId > 0) {
      fetchModulos()
    }
  }, [formacaoId])

  // Selecionar módulo automaticamente quando vier do botão "Gerir Aulas"
  useEffect(() => {
    if (preSelectedModuloId && modulos.length > 0) {
      const moduloExists = modulos.some(m => m.id === preSelectedModuloId)

      if (moduloExists) {
        setSelectedModulo(preSelectedModuloId)
      }
    }
  }, [preSelectedModuloId, modulos])

  // Carregar aulas quando selecionar módulo
  useEffect(() => {
    const fetchAulas = async () => {
      if (!selectedModulo) {
        setAulas([])
        return
      }

      try {
        setLoadingAulas(true)
        const data = await formacoesAPI.listarAulas(selectedModulo as number)
        setAulas(data)
      } catch (err) {
        console.error('Erro ao carregar aulas:', err)
      } finally {
        setLoadingAulas(false)
      }
    }

    fetchAulas()
  }, [selectedModulo])

  const handleAulaCreated = (novaAula: Aula) => {
    setAulas(prev => [...prev, novaAula].sort((a, b) => (a.ordem || 0) - (b.ordem || 0)))
  }

  if (loading) {
    return (
      <Card className='flex items-center justify-center p-10'>
        <CircularProgress />
      </Card>
    )
  }

  if (modulos.length === 0) {
    return (
      <Card>
        <CardContent className='text-center py-10'>
          <Typography variant='h6' color='text.secondary' className='mb-2'>
            Nenhum módulo criado
          </Typography>
          <Typography color='text.secondary'>
            Crie primeiro os módulos na tab "Módulos" antes de adicionar aulas
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardContent className='flex flex-col gap-6'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div className='flex-1 max-w-md'>
              <FormControl fullWidth>
                <InputLabel>Selecionar Módulo</InputLabel>
                <Select
                  value={selectedModulo}
                  label='Selecionar Módulo'
                  onChange={e => setSelectedModulo(e.target.value)}
                >
                  <MenuItem value=''>
                    <em>Escolha um módulo</em>
                  </MenuItem>
                  {modulos.map((modulo, index) => (
                    <MenuItem key={modulo.id} value={modulo.id}>
                      Módulo {index + 1}: {modulo.titulo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            {selectedModulo && (
              <Button
                variant='contained'
                startIcon={<i className='tabler-plus' />}
                onClick={() => setDialogOpen(true)}
              >
                Adicionar Aula
              </Button>
            )}
          </div>

          {!selectedModulo ? (
            <Typography className='text-center' color='text.secondary'>
              Selecione um módulo para ver e gerir as suas aulas
            </Typography>
          ) : loadingAulas ? (
            <div className='flex justify-center py-10'>
              <CircularProgress />
            </div>
          ) : aulas.length > 0 ? (
            <div>
              <Typography variant='body2' color='text.secondary' className='mb-4'>
                Total de {aulas.length} aula(s) neste módulo
              </Typography>
              <Grid container spacing={6}>
                {aulas.map((aula, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={aula.id}>
                    <div className='border rounded bs-full'>
                      <div className='flex flex-col gap-4 p-5'>
                        <div className='flex items-center justify-between'>
                          <Chip
                            label={`Aula ${aula.ordem || index + 1}`}
                            variant='tonal'
                            size='small'
                            color='secondary'
                          />
                          <div className='flex items-center gap-1'>
                            <IconButton size='small'>
                              <i className='tabler-edit text-[22px] text-textSecondary' />
                            </IconButton>
                            <IconButton size='small'>
                              <i className='tabler-trash text-[22px] text-textSecondary' />
                            </IconButton>
                          </div>
                        </div>
                        <div className='flex flex-col gap-1'>
                          <div className='flex items-center gap-2'>
                            <Typography variant='h6' className='hover:text-primary'>
                              {aula.titulo}
                            </Typography>
                            {!aula.publicado && (
                              <Chip label='Rascunho' size='small' color='default' variant='outlined' />
                            )}
                          </div>
                          <Typography color='text.secondary' className='line-clamp-2'>
                            {aula.descricao || 'Sem descrição'}
                          </Typography>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                          {aula.tipo && (
                            <Chip
                              label={aula.tipo}
                              size='small'
                              variant='tonal'
                              color={tipoColors[aula.tipo] || 'default'}
                            />
                          )}
                          {aula.duracao_minutos && (
                            <Chip
                              label={`${aula.duracao_minutos} min`}
                              size='small'
                              variant='tonal'
                              color='success'
                            />
                          )}
                        </div>
                        <div className='flex items-center gap-1'>
                          <i className='tabler-layout-grid text-xl' />
                          <Typography>{aula.total_blocos || 0} bloco(s)</Typography>
                        </div>
                        <Button fullWidth variant='tonal' endIcon={<i className='tabler-chevron-right' />}>
                          Gerir Blocos
                        </Button>
                      </div>
                    </div>
                  </Grid>
                ))}
              </Grid>
            </div>
          ) : (
            <Typography className='text-center' color='text.secondary'>
              Nenhuma aula criada neste módulo. Clique em "Adicionar Aula" para começar.
            </Typography>
          )}
        </CardContent>
      </Card>

      {selectedModulo && (
        <CriarAulaDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          moduloId={selectedModulo as number}
          proximaOrdem={aulas.length + 1}
          onSuccess={handleAulaCreated}
        />
      )}
    </>
  )
}

export default Aulas
