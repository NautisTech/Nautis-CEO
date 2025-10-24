'use client'

import { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import CustomTextField from '@core/components/mui/TextField'
import { groupsAPI } from '@/libs/api/groups/api'
import type { CreateGroupDto } from '@/libs/api/groups/types'

type Props = {
  open: boolean
  onClose: () => void
  onGroupCreated?: () => void
}

type FormData = {
  nome: string
  descricao?: string
}

const AddGroupDialog = ({ open, onClose, onGroupCreated }: Props) => {
  const [loading, setLoading] = useState(false)

  const { control, reset, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: { nome: '', descricao: '' }
  })

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      const createData: CreateGroupDto = { nome: data.nome, descricao: data.descricao }
      await groupsAPI.create(createData)
      reset()
      onClose()
      onGroupCreated?.()
    } catch (error) {
      console.error('Erro ao criar grupo:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Adicionar Grupo</DialogTitle>
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
            {loading ? 'Criando...' : 'Criar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddGroupDialog
