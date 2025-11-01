'use client'

// React Imports
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import OutlinedInput from '@mui/material/OutlinedInput'
import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Alert from '@mui/material/Alert'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// API Imports
import { usersAPI } from '@/libs/api/users/api'
import { groupsAPI } from '@/libs/api/groups/api'
import type { UpdateUserDto, User } from '@/libs/api/users/types'
import type { GroupListItem } from '@/libs/api/groups/types'


type Props = {
  userId: number
}

type FormData = {
  username: string
  email: string
  telefone?: string
  gruposIds: number[]
  ativo: boolean
  email_verificado: boolean
}

const UserEdit = ({ userId }: Props) => {
  // States
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [groups, setGroups] = useState<GroupListItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const router = useRouter()
  const { lang } = useParams() as { lang: string }

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
      telefone: '',
      gruposIds: [],
      ativo: true,
      email_verificado: false
    }
  })

  // Fetch user data and groups
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true)
        setError(null)

        // Fetch user details
        const userData = await usersAPI.getById(userId)

        // Fetch groups
        const groupsData = await groupsAPI.list()
        setGroups(groupsData)

        // Populate form
        reset({
          username: userData.username || '',
          email: userData.email || '',
          telefone: userData.telefone || '',
          gruposIds: userData.grupos?.map(g => g.id) || [],
          ativo: userData.ativo ?? true,
          email_verificado: userData.email_verificado ?? false
        })
      } catch (error: any) {
        console.error('Erro ao carregar dados do utilizador:', error)
        setError(error?.response?.data?.message || 'Erro ao carregar dados do utilizador')
      } finally {
        setLoadingData(false)
      }
    }

    if (userId) {
      fetchData()
    }
  }, [userId, reset])

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      const updateData: UpdateUserDto = {
        username: data.username,
        email: data.email,
        telefone: data.telefone,
        ativo: data.ativo,
        email_verificado: data.email_verificado
      }

      await usersAPI.update(userId, updateData)

      // Update groups - always call even if empty to remove all groups
      if (data.gruposIds !== undefined) {
        await usersAPI.assignGroups(userId, { gruposIds: data.gruposIds })
      }

      setSuccess(true)

      // Redirect after success
      setTimeout(() => {
        router.push(`/${lang}/apps/user/list`)
      }, 1500)
    } catch (error: any) {
      console.error('Erro ao atualizar utilizador:', error)
      setError(error?.response?.data?.message || 'Erro ao atualizar utilizador')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push(`/${lang}/apps/user/list`)
  }

  if (loadingData) {
    return (
      <Card className='flex items-center justify-center p-10'>
        <CircularProgress />
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader title='Editar Utilizador' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            {error && (
              <Grid size={{ xs: 12 }}>
                <Alert severity='error'>{error}</Alert>
              </Grid>
            )}

            {success && (
              <Grid size={{ xs: 12 }}>
                <Alert severity='success'>Utilizador atualizado com sucesso!</Alert>
              </Grid>
            )}

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='username'
                control={control}
                rules={{ required: 'Username é obrigatório' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Username'
                    placeholder='username'
                    error={!!errors.username}
                    helperText={errors.username?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
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
                    placeholder='email@example.com'
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='telefone'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Telefone'
                    placeholder='+351 123 456 789'
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
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
                      renderValue={selected => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as number[]).map(value => {
                            const group = groups.find(g => g.id === value)
                            return <Chip key={value} label={group?.nome || value} size='small' />
                          })}
                        </Box>
                      )}
                    >
                      {groups.map(group => (
                        <MenuItem key={group.id} value={group.id}>
                          {group.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='ativo'
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch checked={field.value} onChange={field.onChange} />}
                    label='Utilizador Ativo'
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='email_verificado'
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch checked={field.value} onChange={field.onChange} />}
                    label='Email Verificado'
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }} className='flex gap-4 justify-end'>
              <Button
                variant='tonal'
                color='secondary'
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                variant='contained'
                type='submit'
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading ? 'A guardar...' : 'Guardar'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default UserEdit
