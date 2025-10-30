'use client'

import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CustomTextField from '@mui/material/TextField'
import { formacoesAPI } from '@/libs/api/formacoes'
import type { Modulo } from '@/libs/api/formacoes'

interface ModulosProps {
  formacaoId: number
}

const Modulos = ({ formacaoId }: ModulosProps) => {
  const [modulos, setModulos] = useState<Modulo[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedModulo, setSelectedModulo] = useState<Modulo | null>(null)

  useEffect(() => {
    loadModulos()
  }, [formacaoId])

  const loadModulos = async () => {
    try {
      const data = await formacoesAPI.listarModulos(formacaoId)
      setModulos(data)
    } catch (error) {
      console.error('Erro ao carregar módulos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (modulo: Modulo) => {
    setSelectedModulo(modulo)
    setDialogOpen(true)
  }

  const handleClose = () => {
    setDialogOpen(false)
    setSelectedModulo(null)
  }

  if (loading) return <Typography>Carregando...</Typography>

  return (
    <div>
      <div className='flex items-center justify-between mb-4'>
        <Typography variant='h5'>Módulos da Formação</Typography>
        <Button variant='contained' onClick={() => setDialogOpen(true)}>
          Adicionar Módulo
        </Button>
      </div>

      <Grid container spacing={4}>
        {modulos.map(modulo => (
          <Grid key={modulo.id} size={{ xs: 12, md: 6 }}>
            <Card variant='outlined'>
              <CardContent>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <Typography variant='h6'>{modulo.titulo}</Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {modulo.descricao}
                    </Typography>
                    <Typography variant='caption' display='block' className='mt-2'>
                      {modulo.total_aulas || 0} aulas
                    </Typography>
                  </div>
                  <IconButton size='small' onClick={() => handleEdit(modulo)}>
                    <i className='tabler-edit' />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog placeholder - implement form here */}
      <Dialog open={dialogOpen} onClose={handleClose} maxWidth='md' fullWidth>
        <DialogTitle>{selectedModulo ? 'Editar Módulo' : 'Novo Módulo'}</DialogTitle>
        <DialogContent>
          <CustomTextField fullWidth label='Título do Módulo' className='mt-4' />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant='contained'>Guardar</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Modulos
