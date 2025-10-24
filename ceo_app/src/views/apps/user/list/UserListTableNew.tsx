'use client'

// React Imports
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'

// API Imports
import { usersAPI } from '@/libs/api/users/api'
import type { UserListItem, UserFilters } from '@/libs/api/users/types'

// Component Imports
import AddUserDrawerNew from './AddUserDrawerNew'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'

const UserListTableNew = () => {
  // Hooks
  const { lang: locale } = useParams()

  // States
  const [users, setUsers] = useState<UserListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [filters, setFilters] = useState<UserFilters>({})

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await usersAPI.list({
        page: page + 1, // API usa 1-indexed
        pageSize,
        ...filters,
      })

      setUsers(response.data)
      setTotal(response.total)
    } catch (error) {
      console.error('Erro ao carregar utilizadores:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, filters])

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleDeleteUser = async (id: number) => {
    if (confirm('Deseja realmente desativar este utilizador?')) {
      try {
        await usersAPI.delete(id)
        fetchUsers()
      } catch (error) {
        console.error('Erro ao desativar utilizador:', error)
      }
    }
  }

  const handleUserCreated = () => {
    setAddUserOpen(false)
    fetchUsers()
  }

  return (
    <>
      <Card>
        <CardHeader
          title='Utilizadores'
          action={
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => setAddUserOpen(true)}
            >
              Adicionar Utilizador
            </Button>
          }
        />

        {loading ? (
          <Box display='flex' justifyContent='center' alignItems='center' minHeight={400}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b'>
                    <th className='text-left p-4'>Utilizador</th>
                    <th className='text-left p-4'>Email</th>
                    <th className='text-left p-4'>Telefone</th>
                    <th className='text-left p-4'>Grupos</th>
                    <th className='text-left p-4'>Status</th>
                    <th className='text-left p-4'>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className='border-b hover:bg-gray-50'>
                      <td className='p-4'>
                        <div className='flex items-center gap-3'>
                          <CustomAvatar
                            src={user.foto_url}
                            alt={user.username}
                            size={38}
                          >
                            {getInitials(user.username)}
                          </CustomAvatar>
                          <div>
                            <Typography className='font-medium'>
                              {user.username}
                            </Typography>
                            {user.email_verificado && (
                              <Chip
                                label='Verificado'
                                size='small'
                                color='success'
                                variant='tonal'
                                className='mt-1'
                              />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className='p-4'>
                        <Typography color='text.secondary'>
                          {user.email}
                        </Typography>
                      </td>
                      <td className='p-4'>
                        <Typography color='text.secondary'>
                          {user.telefone || '-'}
                        </Typography>
                      </td>
                      <td className='p-4'>
                        <Chip
                          label={`${user.total_grupos} grupos`}
                          size='small'
                          variant='tonal'
                          color='primary'
                        />
                      </td>
                      <td className='p-4'>
                        <Chip
                          label={user.ativo ? 'Ativo' : 'Inativo'}
                          size='small'
                          color={user.ativo ? 'success' : 'error'}
                          variant='tonal'
                        />
                      </td>
                      <td className='p-4'>
                        <div className='flex items-center gap-1'>
                          <IconButton
                            size='small'
                            component={Link}
                            href={getLocalizedUrl(`/apps/user/view/${user.id}`, locale as Locale)}
                          >
                            <i className='tabler-eye text-xl' />
                          </IconButton>
                          <IconButton
                            size='small'
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <i className='tabler-trash text-xl' />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <TablePagination
              component='div'
              count={total}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={pageSize}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Card>

      <AddUserDrawerNew
        open={addUserOpen}
        onClose={() => setAddUserOpen(false)}
        onUserCreated={handleUserCreated}
      />
    </>
  )
}

export default UserListTableNew
