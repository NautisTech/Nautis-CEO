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
import type { Modulo, Aula, Bloco } from '@/libs/api/formacoes'
import { formacoesAPI } from '@/libs/api/formacoes'
import CriarBlocoDialog from './CriarBlocoDialog'
import GerirAnexosDialog from './GerirAnexosDialog'

interface BlocosProps {
  formacaoId: number
}

const tipoColors: { [key: string]: 'primary' | 'success' | 'error' | 'warning' | 'info' } = {
  texto: 'primary',
  video: 'error',
  pdf: 'warning',
  imagem: 'info',
  exercicio: 'success'
}

const Blocos = ({ formacaoId }: BlocosProps) => {
  const [modulos, setModulos] = useState<Modulo[]>([])
  const [selectedModulo, setSelectedModulo] = useState<number | ''>('')
  const [aulas, setAulas] = useState<Aula[]>([])
  const [selectedAula, setSelectedAula] = useState<number | ''>('')
  const [blocos, setBlocos] = useState<Bloco[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingAulas, setLoadingAulas] = useState(false)
  const [loadingBlocos, setLoadingBlocos] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [anexosDialogOpen, setAnexosDialogOpen] = useState(false)
  const [selectedBloco, setSelectedBloco] = useState<Bloco | null>(null)

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

  // Carregar aulas quando selecionar módulo
  useEffect(() => {
    const fetchAulas = async () => {
      if (!selectedModulo) {
        setAulas([])
        setSelectedAula('')
        setBlocos([])
        return
      }

      try {
        setLoadingAulas(true)
        const data = await formacoesAPI.listarAulas(selectedModulo as number)
        setAulas(data)
        setSelectedAula('')
        setBlocos([])
      } catch (err) {
        console.error('Erro ao carregar aulas:', err)
      } finally {
        setLoadingAulas(false)
      }
    }

    fetchAulas()
  }, [selectedModulo])

  // Carregar blocos quando selecionar aula
  useEffect(() => {
    const fetchBlocos = async () => {
      if (!selectedAula) {
        setBlocos([])
        return
      }

      try {
        setLoadingBlocos(true)
        const data = await formacoesAPI.listarBlocos(selectedAula as number)
        setBlocos(data)
      } catch (err) {
        console.error('Erro ao carregar blocos:', err)
      } finally {
        setLoadingBlocos(false)
      }
    }

    fetchBlocos()
  }, [selectedAula])

  const handleBlocoCreated = (novoBloco: Bloco) => {
    setBlocos(prev => [...prev, novoBloco].sort((a, b) => (a.ordem || 0) - (b.ordem || 0)))
  }

  const handleGerirAnexos = (bloco: Bloco) => {
    setSelectedBloco(bloco)
    setAnexosDialogOpen(true)
  }

  const handleAnexosSuccess = async () => {
    // Recarregar blocos para atualizar o contador de anexos
    if (selectedAula) {
      try {
        const data = await formacoesAPI.listarBlocos(selectedAula as number)
        setBlocos(data)
      } catch (err) {
        console.error('Erro ao recarregar blocos:', err)
      }
    }
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
            Crie primeiro os módulos na tab "Módulos" antes de adicionar blocos
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardContent className='flex flex-col gap-6'>
          <div className='flex flex-wrap items-center gap-4'>
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
              <div className='flex-1 max-w-md'>
                <FormControl fullWidth disabled={loadingAulas}>
                  <InputLabel>Selecionar Aula</InputLabel>
                  <Select
                    value={selectedAula}
                    label='Selecionar Aula'
                    onChange={e => setSelectedAula(e.target.value)}
                  >
                    <MenuItem value=''>
                      <em>Escolha uma aula</em>
                    </MenuItem>
                    {aulas.map((aula, index) => (
                      <MenuItem key={aula.id} value={aula.id}>
                        Aula {aula.ordem || index + 1}: {aula.titulo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}

            {selectedAula && (
              <Button
                variant='contained'
                startIcon={<i className='tabler-plus' />}
                onClick={() => setDialogOpen(true)}
              >
                Adicionar Bloco
              </Button>
            )}
          </div>

          {!selectedModulo ? (
            <Typography className='text-center' color='text.secondary'>
              Selecione um módulo para começar
            </Typography>
          ) : !selectedAula ? (
            <Typography className='text-center' color='text.secondary'>
              Selecione uma aula para ver e gerir os seus blocos de conteúdo
            </Typography>
          ) : loadingBlocos ? (
            <div className='flex justify-center py-10'>
              <CircularProgress />
            </div>
          ) : blocos.length > 0 ? (
            <div>
              <Typography variant='body2' color='text.secondary' className='mb-4'>
                Total de {blocos.length} bloco(s) nesta aula
              </Typography>
              <Grid container spacing={6}>
                {blocos.map((bloco, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={bloco.id}>
                    <div className='border rounded bs-full'>
                      <div className='flex flex-col gap-4 p-5'>
                        <div className='flex items-center justify-between'>
                          <Chip
                            label={`Bloco ${bloco.ordem || index + 1}`}
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
                          <Typography variant='h6' className='hover:text-primary'>
                            {bloco.titulo}
                          </Typography>
                          <Typography color='text.secondary' className='line-clamp-3'>
                            {bloco.conteudo || 'Sem conteúdo'}
                          </Typography>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                          {bloco.tipo && (
                            <Chip
                              label={bloco.tipo}
                              size='small'
                              variant='tonal'
                              color={tipoColors[bloco.tipo] || 'default'}
                            />
                          )}
                        </div>
                        <div className='flex items-center gap-1'>
                          <i className='tabler-paperclip text-xl' />
                          <Typography>
                            {bloco.total_anexos
                              ? `${bloco.total_anexos} ${bloco.total_anexos === 1 ? 'anexo' : 'anexos'}`
                              : 'Sem anexos'}
                          </Typography>
                        </div>
                        <Button
                          fullWidth
                          variant='tonal'
                          endIcon={<i className='tabler-chevron-right' />}
                          onClick={() => handleGerirAnexos(bloco)}
                        >
                          Gerir Anexos
                        </Button>
                      </div>
                    </div>
                  </Grid>
                ))}
              </Grid>
            </div>
          ) : (
            <Typography className='text-center' color='text.secondary'>
              Nenhum bloco criado nesta aula. Clique em "Adicionar Bloco" para começar.
            </Typography>
          )}
        </CardContent>
      </Card>

      {selectedAula && (
        <CriarBlocoDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          aulaId={selectedAula as number}
          proximaOrdem={blocos.length + 1}
          onSuccess={handleBlocoCreated}
        />
      )}

      {selectedBloco && (
        <GerirAnexosDialog
          open={anexosDialogOpen}
          onClose={() => {
            setAnexosDialogOpen(false)
            setSelectedBloco(null)
          }}
          blocoId={selectedBloco.id}
          blocoTitulo={selectedBloco.titulo}
          onSuccess={handleAnexosSuccess}
        />
      )}
    </>
  )
}

export default Blocos
