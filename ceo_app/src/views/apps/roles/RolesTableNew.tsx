'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'

// Third-party Imports
import classnames from 'classnames'

// API Imports
import { groupsAPI } from '@/libs/api/groups/api'
import type { GroupListItem } from '@/libs/api/groups/types'

// Component Imports
import AddGroupDialog from './AddGroupDialog'
import EditGroupDialog from './EditGroupDialog'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const RolesTableNew = () => {
  // States
  const [groups, setGroups] = useState<GroupListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<GroupListItem | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [groupToDelete, setGroupToDelete] = useState<GroupListItem | null>(null)

  // Fetch groups
  const fetchGroups = async () => {
    try {
      setLoading(true)
      const data = await groupsAPI.list()
      setGroups(data)
    } catch (error) {
      console.error('Erro ao carregar grupos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  const handleEdit = (group: GroupListItem) => {
    setSelectedGroup(group)
    setEditDialogOpen(true)
  }

  const handleDeleteClick = (group: GroupListItem) => {
    setGroupToDelete(group)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!groupToDelete) return

    try {
      await groupsAPI.delete(groupToDelete.id)
      setDeleteDialogOpen(false)
      setGroupToDelete(null)
      fetchGroups()
    } catch (error) {
      console.error('Erro ao deletar grupo:', error)
    }
  }

  const handleGroupCreated = () => {
    setAddDialogOpen(false)
    fetchGroups()
  }

  const handleGroupUpdated = () => {
    setEditDialogOpen(false)
    setSelectedGroup(null)
    fetchGroups()
  }

  return (
    <>
      <Card>
        <CardHeader
          title='Grupos / Roles'
          subheader='Gerir grupos de utilizadores e suas permissões'
          action={
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => setAddDialogOpen(true)}
            >
              Adicionar Grupo
            </Button>
          }
        />
        <Divider />

        {loading ? (
          <Box display='flex' justifyContent='center' alignItems='center' minHeight={400}>
            <CircularProgress />
            <Typography className='mli-4'>A carregar grupos...</Typography>
          </Box>
        ) : (
          <div className='overflow-x-auto'>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Utilizadores</th>
                  <th>Permissões</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {groups.length === 0 ? (
                  <tr>
                    <td colSpan={6} className='text-center'>
                      <Typography>Nenhum grupo encontrado</Typography>
                    </td>
                  </tr>
                ) : (
                  groups.map((group) => (
                    <tr key={group.id} className={classnames()}>
                      <td>
                        <Typography color='text.primary' className='font-medium'>
                          {group.nome}
                        </Typography>
                      </td>
                      <td>
                        <Typography variant='body2' color='text.secondary'>
                          {group.descricao || '-'}
                        </Typography>
                      </td>
                      <td>
                        <Chip
                          label={`${group.total_utilizadores || 0} utilizadores`}
                          size='small'
                          variant='tonal'
                          color='primary'
                        />
                      </td>
                      <td>
                        <Chip
                          label={`${group.total_permissoes || 0} permissões`}
                          size='small'
                          variant='tonal'
                          color='info'
                        />
                      </td>
                      <td>
                        <Chip
                          label={group.ativo ? 'Ativo' : 'Inativo'}
                          size='small'
                          color={group.ativo ? 'success' : 'error'}
                          variant='tonal'
                        />
                      </td>
                      <td>
                        <div className='flex items-center gap-0.5'>
                          <Tooltip title='Editar'>
                            <IconButton
                              size='small'
                              onClick={() => handleEdit(group)}
                            >
                              <i className='tabler-edit text-[22px] text-textSecondary' />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title='Eliminar'>
                            <IconButton
                              size='small'
                              onClick={() => handleDeleteClick(group)}
                            >
                              <i className='tabler-trash text-[22px] text-textSecondary' />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Group Dialog */}
      <AddGroupDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onGroupCreated={handleGroupCreated}
      />

      {/* Edit Group Dialog */}
      {selectedGroup && (
        <EditGroupDialog
          open={editDialogOpen}
          group={selectedGroup}
          onClose={() => {
            setEditDialogOpen(false)
            setSelectedGroup(null)
          }}
          onGroupUpdated={handleGroupUpdated}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Confirmar Eliminação</DialogTitle>
        <DialogContent>
          <Typography>
            Tem a certeza que deseja eliminar o grupo <strong>{groupToDelete?.nome}</strong>?
          </Typography>
          <Typography color='text.secondary' className='mt-2'>
            Esta ação irá desativar o grupo mas não eliminará os utilizadores associados.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={handleDeleteConfirm}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default RolesTableNew
