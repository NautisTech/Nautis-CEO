'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import OutlinedInput from '@mui/material/OutlinedInput'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// API Imports
import { usersAPI } from '@/libs/api/users/api'
import { groupsAPI } from '@/libs/api/groups/api'
import type { CreateUserDto } from '@/libs/api/users/types'
import type { GroupListItem } from '@/libs/api/groups/types'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

type Props = {
  open: boolean
  onClose: () => void
  onUserCreated?: () => void
}

type FormData = {
  username: string
  email: string
  senha: string
  telefone?: string
  gruposIds: number[]
  ativo: boolean
  email_verificado: boolean
}

const AddUserDrawerNew = ({ open, onClose, onUserCreated }: Props) => {
  // States
  const [loading, setLoading] = useState(false)
  const [groups, setGroups] = useState<GroupListItem[]>([])
  const [loadingGroups, setLoadingGroups] = useState(true)

  // Hooks
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      username: '',
      email: '',
      senha: '',
      telefone: '',
      gruposIds: [],
      ativo: true,
      email_verificado: false
    }
  })

  // Fetch groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoadingGroups(true)
        const data = await groupsAPI.list()
        setGroups(data)
      } catch (error) {
        console.error('Erro ao carregar grupos:', error)
      } finally {
        setLoadingGroups(false)
      }
    }

    if (open) {
      fetchGroups()
    }
  }, [open])

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)

      const createData: CreateUserDto = {
        username: data.username,
        email: data.email,
        senha: data.senha,
        telefone: data.telefone,
        gruposIds: data.gruposIds,
        ativo: data.ativo,
        email_verificado: data.email_verificado
      }

      await usersAPI.create(createData)

      reset()
      onClose()
      onUserCreated?.()
    } catch (error) {
      console.error('Erro ao criar utilizador:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    reset()
    onClose()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 450 } } }}
    >
      <div className='flex items-center justify-between plb-5 pli-6'>
        <Typography variant='h5'>Adicionar Utilizador</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-2xl' />
        </IconButton>
      </div>
      <Divider />

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 p-6'>
        <Controller
          name='username'
          control={control}
          rules={{ required: 'Username é obrigatório' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label='Username'
              placeholder='johndoe'
              error={!!errors.username}
              helperText={errors.username?.message}
            />
          )}
        />

        <Controller
          name='email'
          control={control}
          rules={{
            required: 'Email é obrigatório',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email inválido'
            }
          }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              type='email'
              label='Email'
              placeholder='john@example.com'
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
        />

        <Controller
          name='senha'
          control={control}
          rules={{
            required: 'Senha é obrigatória',
            minLength: {
              value: 6,
              message: 'Senha deve ter no mínimo 6 caracteres'
            }
          }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              type='password'
              label='Senha'
              placeholder='******'
              error={!!errors.senha}
              helperText={errors.senha?.message}
            />
          )}
        />

        <Controller
          name='telefone'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label='Telefone'
              placeholder='+351 912 345 678'
            />
          )}
        />

        <Controller
          name='gruposIds'
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Grupos</InputLabel>
              <Select
                {...field}
                multiple
                input={<OutlinedInput label='Grupos' />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((id) => {
                      const group = groups.find((g) => g.id === id)
                      return group ? (
                        <Chip key={id} label={group.nome} size='small' />
                      ) : null
                    })}
                  </Box>
                )}
                disabled={loadingGroups}
              >
                {loadingGroups ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                  </MenuItem>
                ) : (
                  groups.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.nome}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          )}
        />

        <Controller
          name='ativo'
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Switch {...field} checked={field.value} />}
              label='Utilizador Ativo'
            />
          )}
        />

        <Controller
          name='email_verificado'
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Switch {...field} checked={field.value} />}
              label='Email Verificado'
            />
          )}
        />

        <div className='flex items-center gap-4'>
          <Button
            variant='contained'
            type='submit'
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Criando...' : 'Criar Utilizador'}
          </Button>
          <Button
            variant='tonal'
            color='error'
            onClick={handleReset}
            disabled={loading}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Drawer>
  )
}

export default AddUserDrawerNew
