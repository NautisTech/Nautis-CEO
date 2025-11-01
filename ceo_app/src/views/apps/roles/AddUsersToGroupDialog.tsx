'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress'
import CustomTextField from '@mui/material/TextField'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'

// API Imports
import { usersAPI } from '@/libs/api/users/api'
import { groupsAPI } from '@/libs/api/groups/api'
import type { UserListItem } from '@/libs/api/users/types'
import type { GroupListItem } from '@/libs/api/groups/types'

// Toast Imports
import { toastService } from '@/libs/notifications/toasterService'

interface AddUsersToGroupDialogProps {
  open: boolean
  onClose: () => void
  group: GroupListItem | null
  onUsersAdded?: () => void
}

const AddUsersToGroupDialog = ({ open, onClose, group, onUsersAdded }: AddUsersToGroupDialogProps) => {
  const [users, setUsers] = useState<UserListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (open && group) {
      fetchData()
    } else {
      setSelectedUsers([])
      setSearchQuery('')
    }
  }, [open, group])

  const fetchData = async () => {
    try {
      setLoading(true)
      // Fetch all users
      const usersResponse = await usersAPI.list({ ativo: true })
      setUsers(usersResponse.data)

      // Fetch group details to get existing users
      const groupDetails = await groupsAPI.getById(group!.id)
      const existingUserIds = groupDetails.utilizadores?.map(u => u.id) || []
      setSelectedUsers(existingUserIds)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toastService.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleUser = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id))
    }
  }

  const handleSave = async () => {
    if (!group || selectedUsers.length === 0) return

    try {
      setSaving(true)
      await groupsAPI.assignUsers(group.id, { utilizadoresIds: selectedUsers })
      toastService.success(`${selectedUsers.length} utilizador(es) adicionado(s) ao grupo`)
      onUsersAdded?.()
      onClose()
    } catch (error) {
      console.error('Erro ao adicionar utilizadores:', error)
      toastService.error('Erro ao adicionar utilizadores ao grupo')
    } finally {
      setSaving(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        Adicionar Utilizadores ao Grupo
        {group && (
          <Typography variant='body2' color='text.secondary'>
            Grupo: {group.nome}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent dividers>
        <CustomTextField
          fullWidth
          placeholder='Pesquisar utilizadores...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='mbe-4'
          slotProps={{
            input: {
              startAdornment: <i className='tabler-search text-xl mie-2' />
            }
          }}
        />

        {loading ? (
          <div className='flex justify-center items-center p-10'>
            <CircularProgress />
          </div>
        ) : (
          <>
            <div className='flex items-center justify-between mbe-2'>
              <Typography variant='body2' color='text.secondary'>
                {selectedUsers.length} de {filteredUsers.length} selecionado(s)
              </Typography>
              <Button size='small' onClick={handleSelectAll}>
                {selectedUsers.length === filteredUsers.length ? 'Desselecionar Todos' : 'Selecionar Todos'}
              </Button>
            </div>

            <Divider className='mbe-2' />

            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {filteredUsers.length === 0 ? (
                <ListItem>
                  <ListItemText
                    primary='Nenhum utilizador encontrado'
                    className='text-center'
                  />
                </ListItem>
              ) : (
                filteredUsers.map((user) => (
                  <ListItem key={user.id} disablePadding>
                    <ListItemButton dense>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleToggleUser(user.id)}
                          />
                        }
                        label={
                          <div>
                            <Typography variant='body1'>{user.username}</Typography>
                            <Typography variant='body2' color='text.secondary'>
                              {user.email}
                            </Typography>
                          </div>
                        }
                        sx={{ width: '100%', margin: 0 }}
                        onClick={(e) => {
                          e.preventDefault()
                          handleToggleUser(user.id)
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))
              )}
            </List>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button
          variant='contained'
          onClick={handleSave}
          disabled={selectedUsers.length === 0 || saving}
        >
          {saving ? <CircularProgress size={20} /> : `Adicionar (${selectedUsers.length})`}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddUsersToGroupDialog
