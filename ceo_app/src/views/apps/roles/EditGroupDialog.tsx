'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, FormControlLabel, Switch } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import CustomTextField from '@core/components/mui/TextField'
import { groupsAPI } from '@/libs/api/groups/api'
import type { GroupListItem, UpdateGroupDto } from '@/libs/api/groups/types'

type Props = {
  open: boolean
  group: GroupListItem
  onClose: () => void
  onGroupUpdated?: () => void
}

type FormData = {
  nome: string
  descricao?: string
  ativo: boolean
}

const EditGroupDialog = ({ open, group, onClose, onGroupUpdated }: Props) => {
  const [loading, setLoading] = useState(false)

  const { control, reset, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      nome: group.nome,
      descricao: group.descricao || '',
      ativo: group.ativo
    }
  })

  useEffect(() => {
    reset({
      nome: group.nome,
      descricao: group.descricao || '',
      ativo: group.ativo
    })
  }, [group, reset])

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      const updateData: UpdateGroupDto = {
        nome: data.nome,
        descricao: data.descricao,
        ativo: data.ativo
      }
      await groupsAPI.update(group.id, updateData)
      onClose()
      onGroupUpdated?.()
    } catch (error) {
      console.error('Erro ao atualizar grupo:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Editar Grupo</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <div className='flex flex-col gap-4'>
            <Controller
              name='nome'
              control={control}
              rules={{ required: 'Nome é obrigatório' }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Nome do Grupo'
                  error={!!errors.nome}
                  helperText={errors.nome?.message}
                />
              )}
            />
            <Controller
              name='descricao'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Descrição'
                  multiline
                  rows={3}
                />
              )}
            />
            <Controller
              name='ativo'
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={field.value} />}
                  label='Grupo Ativo'
                />
              )}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button
            type='submit'
            variant='contained'
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Atualizando...' : 'Atualizar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditGroupDialog
