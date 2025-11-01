'use client'

import { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, MenuItem } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import CustomTextField from '@core/components/mui/TextField'
import { permissionsAPI } from '@/libs/api/permissions/api'
import type { CreatePermissionDto } from '@/libs/api/permissions/types'

type Props = {
  open: boolean
  onClose: () => void
  onPermissionCreated?: () => void
}

const MODULOS = ['UTILIZADORES', 'RH', 'EMPRESAS', 'CONTEUDOS', 'VEICULOS', 'SUPORTE', 'RELATORIOS']
const TIPOS = ['Criar', 'Listar', 'Visualizar', 'Editar', 'Deletar', 'Importar', 'Aprovar', 'Atribuir', 'Concluir', 'Outro']

const AddPermissionDialog = ({ open, onClose, onPermissionCreated }: Props) => {
  const [loading, setLoading] = useState(false)

  const { control, reset, handleSubmit, formState: { errors } } = useForm<CreatePermissionDto>({
    defaultValues: { codigo: '', nome: '', descricao: '', modulo: '', tipo: '' }
  })

  const onSubmit = async (data: CreatePermissionDto) => {
    try {
      setLoading(true)
      await permissionsAPI.create(data)
      reset()
      onClose()
      onPermissionCreated?.()
    } catch (error) {
      console.error('Erro ao criar permissão:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Adicionar Permissão</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <div className='flex flex-col gap-4'>
            <Controller
              name='codigo'
              control={control}
              rules={{ required: 'Código é obrigatório' }}
              render={({ field }) => (
                <CustomTextField {...field} fullWidth label='Código' placeholder='ADMIN:PermissoesGestao' error={!!errors.codigo} helperText={errors.codigo?.message} />
              )}
            />
            <Controller
              name='nome'
              control={control}
              rules={{ required: 'Nome é obrigatório' }}
              render={({ field }) => (
                <CustomTextField {...field} fullWidth label='Nome' error={!!errors.nome} helperText={errors.nome?.message} />
              )}
            />
            <Controller
              name='descricao'
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} fullWidth label='Descrição' multiline rows={2} />
              )}
            />
            <Controller
              name='modulo'
              control={control}
              rules={{ required: 'Módulo é obrigatório' }}
              render={({ field }) => (
                <CustomTextField {...field} select fullWidth label='Módulo' error={!!errors.modulo} helperText={errors.modulo?.message}>
                  {MODULOS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </CustomTextField>
              )}
            />
            <Controller
              name='tipo'
              control={control}
              rules={{ required: 'Tipo é obrigatório' }}
              render={({ field }) => (
                <CustomTextField {...field} select fullWidth label='Tipo' error={!!errors.tipo} helperText={errors.tipo?.message}>
                  {TIPOS.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </CustomTextField>
              )}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button type='submit' variant='contained' disabled={loading} startIcon={loading && <CircularProgress size={20} />}>
            {loading ? 'Criando...' : 'Criar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddPermissionDialog
