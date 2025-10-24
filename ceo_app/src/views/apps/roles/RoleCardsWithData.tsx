'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import AddGroupDialog from './AddGroupDialog'
import EditGroupDialog from './EditGroupDialog'
import AddUsersToGroupDialog from './AddUsersToGroupDialog'
import AddPermissionsToGroupDialog from './AddPermissionsToGroupDialog'

// API Imports
import { groupsAPI } from '@/libs/api/groups/api'
import type { GroupListItem } from '@/libs/api/groups/types'

const RoleCardsWithData = () => {
  const [groups, setGroups] = useState<GroupListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addUsersDialogOpen, setAddUsersDialogOpen] = useState(false)
  const [addPermissionsDialogOpen, setAddPermissionsDialogOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<GroupListItem | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuGroup, setMenuGroup] = useState<GroupListItem | null>(null)

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

  const handleEditClick = (group: GroupListItem) => {
    setSelectedGroup(group)
    setEditDialogOpen(true)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, group: GroupListItem) => {
    setAnchorEl(event.currentTarget)
    setMenuGroup(group)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setMenuGroup(null)
  }

  const handleAddUsers = () => {
    setSelectedGroup(menuGroup)
    setAddUsersDialogOpen(true)
    handleMenuClose()
  }

  const handleAddPermissions = () => {
    setSelectedGroup(menuGroup)
    setAddPermissionsDialogOpen(true)
    handleMenuClose()
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center p-10'>
        <CircularProgress />
      </div>
    )
  }

  return (
    <>
      <Grid container spacing={6}>
        {groups.map((group) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={group.id}>
            <Card>
              <CardContent className='flex flex-col gap-4'>
                <div className='flex items-center justify-between'>
                  <Typography className='flex-grow'>{`Total ${group.total_utilizadores || 0} utilizadores`}</Typography>
                  <AvatarGroup max={4} total={group.total_utilizadores || 0}>
                    <Avatar>{group.nome.charAt(0).toUpperCase()}</Avatar>
                  </AvatarGroup>
                </div>
                <div className='flex justify-between items-center'>
                  <div className='flex flex-col items-start gap-1'>
                    <Typography variant='h5'>{group.nome}</Typography>
                    <Typography
                      component='span'
                      color='primary'
                      className='cursor-pointer'
                      onClick={() => handleEditClick(group)}
                    >
                      Editar Grupo
                    </Typography>
                  </div>
                  <Tooltip title='Ações'>
                    <IconButton onClick={(e) => handleMenuOpen(e, group)}>
                      <i className='tabler-dots-vertical text-secondary' />
                    </IconButton>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <Card className='cursor-pointer bs-full' onClick={() => setAddDialogOpen(true)}>
            <Grid container className='bs-full'>
              <Grid size={{ xs: 5 }}>
                <div className='flex items-end justify-center bs-full'>
                  <img alt='add-role' src='/images/illustrations/characters/5.png' height={130} />
                </div>
              </Grid>
              <Grid size={{ xs: 7 }}>
                <CardContent>
                  <div className='flex flex-col items-end gap-4 text-right'>
                    <Button variant='contained' size='small'>
                      Adicionar Grupo
                    </Button>
                    <Typography>
                      Adicionar novo grupo, <br />
                      se não existir.
                    </Typography>
                  </div>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleAddUsers}>
          <i className='tabler-users text-xl mie-2' />
          Adicionar Utilizadores
        </MenuItem>
        <MenuItem onClick={handleAddPermissions}>
          <i className='tabler-lock text-xl mie-2' />
          Adicionar Permissões
        </MenuItem>
      </Menu>

      <AddGroupDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onGroupCreated={() => {
          setAddDialogOpen(false)
          fetchGroups()
        }}
      />

      {selectedGroup && (
        <EditGroupDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false)
            setSelectedGroup(null)
          }}
          group={selectedGroup}
          onGroupUpdated={() => {
            setEditDialogOpen(false)
            setSelectedGroup(null)
            fetchGroups()
          }}
        />
      )}

      <AddUsersToGroupDialog
        open={addUsersDialogOpen}
        onClose={() => {
          setAddUsersDialogOpen(false)
          setSelectedGroup(null)
        }}
        group={selectedGroup}
        onUsersAdded={() => {
          setAddUsersDialogOpen(false)
          setSelectedGroup(null)
          fetchGroups()
        }}
      />

      <AddPermissionsToGroupDialog
        open={addPermissionsDialogOpen}
        onClose={() => {
          setAddPermissionsDialogOpen(false)
          setSelectedGroup(null)
        }}
        group={selectedGroup}
        onPermissionsAdded={() => {
          setAddPermissionsDialogOpen(false)
          setSelectedGroup(null)
          fetchGroups()
        }}
      />
    </>
  )
}

export default RoleCardsWithData
