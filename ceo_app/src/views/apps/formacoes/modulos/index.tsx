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
import type { Modulo } from '@/libs/api/formacoes'
import { formacoesAPI } from '@/libs/api/formacoes'
import CriarModuloDialog from './CriarModuloDialog'
import EditarModuloDialog from './EditarModuloDialog'

interface ModulosProps {
  formacaoId: number
  onGerirAulas?: (moduloId: number) => void
}

const Modulos = ({ formacaoId, onGerirAulas }: ModulosProps) => {
  const [modulos, setModulos] = useState<Modulo[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [moduloSelecionado, setModuloSelecionado] = useState<Modulo | null>(null)

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

  useEffect(() => {
    if (formacaoId > 0) {
      fetchModulos()
    }
  }, [formacaoId])

  const handleModuloCreated = (novoModulo: Modulo) => {
    setModulos(prev => [...prev, novoModulo])
  }

  const handleEditClick = (modulo: Modulo) => {
    setModuloSelecionado(modulo)
    setEditDialogOpen(true)
  }

  const handleModuloUpdated = (moduloAtualizado: Modulo) => {
    setModulos(prev => prev.map(m => m.id === moduloAtualizado.id ? moduloAtualizado : m))
  }

  const handleDeleteClick = async (modulo: Modulo) => {
    if (confirm(`Tem certeza que deseja apagar o módulo "${modulo.titulo}"? Esta ação não pode ser desfeita.`)) {
      try {
        await formacoesAPI.apagarModulo(modulo.id)
        setModulos(prev => prev.filter(m => m.id !== modulo.id))
      } catch (err) {
        console.error('Erro ao apagar módulo:', err)
        alert('Erro ao apagar módulo. Por favor, tente novamente.')
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

  return (
    <>
      <Card>
        <CardContent className='flex flex-col gap-6'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div>
              <Typography variant='h5'>Módulos da Formação</Typography>
              <Typography>Total de {modulos.length} módulo(s) criado(s)</Typography>
            </div>
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => setDialogOpen(true)}
            >
              Adicionar Módulo
            </Button>
          </div>

          {modulos.length > 0 ? (
            <Grid container spacing={6}>
              {modulos.map((modulo, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={modulo.id}>
                  <div className='border rounded bs-full'>
                    {modulo.capa_url && (
                      <div className='pli-2 pbs-2'>
                        <img
                          src={modulo.capa_url}
                          alt={modulo.titulo}
                          className='is-full rounded'
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div className='flex flex-col gap-4 p-5'>
                      <div className='flex items-center justify-between'>
                        <Chip label={`Módulo ${index + 1}`} variant='tonal' size='small' color='secondary' />
                        <div className='flex items-center gap-1'>
                          <IconButton size='small' onClick={() => handleEditClick(modulo)}>
                            <i className='tabler-edit text-[22px] text-textSecondary' />
                          </IconButton>
                          <IconButton size='small' onClick={() => handleDeleteClick(modulo)}>
                            <i className='tabler-trash text-[22px] text-textSecondary' />
                          </IconButton>
                        </div>
                      </div>
                      <div className='flex flex-col gap-1'>
                        <div className='flex items-center gap-2'>
                          <Typography variant='h5' className='hover:text-primary'>
                            {modulo.titulo}
                          </Typography>
                          {!modulo.ativo && (
                            <Chip label='Inativo' size='small' color='default' variant='outlined' />
                          )}
                        </div>
                        <Typography color='text.secondary' className='line-clamp-2'>
                          {modulo.descricao || 'Sem descrição'}
                        </Typography>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {modulo.categoria && (
                          <Chip label={modulo.categoria} size='small' variant='tonal' color='primary' />
                        )}
                        {modulo.nivel && (
                          <Chip label={modulo.nivel} size='small' variant='tonal' color='info' />
                        )}
                        {modulo.duracao_total && (
                          <Chip
                            label={`${modulo.duracao_total} min`}
                            size='small'
                            variant='tonal'
                            color='success'
                          />
                        )}
                      </div>
                      <div className='flex items-center gap-1'>
                        <i className='tabler-video text-xl' />
                        <Typography>
                          {modulo.total_aulas ? `${modulo.total_aulas} ${modulo.total_aulas === 1 ? 'aula' : 'aulas'}` : 'Sem aulas'}
                        </Typography>
                      </div>
                      <Button
                        fullWidth
                        variant='tonal'
                        endIcon={<i className='tabler-chevron-right' />}
                        onClick={() => onGerirAulas?.(modulo.id)}
                      >
                        Gerir Aulas
                      </Button>
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography className='text-center' color='text.secondary'>
              Nenhum módulo criado ainda. Clique em "Adicionar Módulo" para começar.
            </Typography>
          )}
        </CardContent>
      </Card>

      <CriarModuloDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        formacaoId={formacaoId}
        onSuccess={handleModuloCreated}
      />

      <EditarModuloDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        modulo={moduloSelecionado}
        onSuccess={handleModuloUpdated}
      />
    </>
  )
}

export default Modulos
