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
import TextField from '@mui/material/TextField'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'

// API Imports
import { permissionsAPI } from '@/libs/api/permissions/api'
import { groupsAPI } from '@/libs/api/groups/api'
import type { Permission } from '@/libs/api/permissions/types'
import type { GroupListItem } from '@/libs/api/groups/types'

// Toast Imports
import { toastService } from '@/libs/notifications/toasterService'

interface AddPermissionsToGroupDialogProps {
  open: boolean
  onClose: () => void
  group: GroupListItem | null
  onPermissionsAdded?: () => void
}

const AddPermissionsToGroupDialog = ({ open, onClose, group, onPermissionsAdded }: AddPermissionsToGroupDialogProps) => {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [groupedPermissions, setGroupedPermissions] = useState<Record<string, Permission[]>>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (open && group) {
      fetchPermissions()
    } else {
      setSelectedPermissions([])
      setSearchQuery('')
    }
  }, [open, group])

  const fetchPermissions = async () => {
    try {
      setLoading(true)
      const data = await permissionsAPI.list()
      setPermissions(data)

      // Group by module
      const grouped = data.reduce((acc, perm) => {
        if (!acc[perm.modulo]) acc[perm.modulo] = []
        acc[perm.modulo].push(perm)
        return acc
      }, {} as Record<string, Permission[]>)

      setGroupedPermissions(grouped)
    } catch (error) {
      console.error('Erro ao carregar permissões:', error)
      toastService.error('Erro ao carregar permissões')
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePermission = (permissionId: number) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  const handleToggleModule = (moduleName: string) => {
    const modulePermissions = groupedPermissions[moduleName].map(p => p.id)
    const allSelected = modulePermissions.every(id => selectedPermissions.includes(id))

    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(id => !modulePermissions.includes(id)))
    } else {
      setSelectedPermissions(prev => [...new Set([...prev, ...modulePermissions])])
    }
  }

  const handleSave = async () => {
    if (!group || selectedPermissions.length === 0) return

    try {
      setSaving(true)
      await groupsAPI.assignPermissions(group.id, { permissoesIds: selectedPermissions })
      toastService.success(`${selectedPermissions.length} permissão(ões) adicionada(s) ao grupo`)
      onPermissionsAdded?.()
      onClose()
    } catch (error) {
      console.error('Erro ao adicionar permissões:', error)
      toastService.error('Erro ao adicionar permissões ao grupo')
    } finally {
      setSaving(false)
    }
  }

  const filteredGroupedPermissions = Object.entries(groupedPermissions).reduce((acc, [module, perms]) => {
    const filtered = perms.filter(perm =>
      perm.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      perm.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (perm.descricao && perm.descricao.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    if (filtered.length > 0) {
      acc[module] = filtered
    }
    return acc
  }, {} as Record<string, Permission[]>)

  const totalFilteredPermissions = Object.values(filteredGroupedPermissions).reduce(
    (sum, perms) => sum + perms.length,
    0
  )

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        <Typography variant='h5'>Adicionar Permissões ao Grupo</Typography>
        {group && (
          <Typography variant='body2' color='text.secondary'>
            Grupo: {group.nome}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent dividers>
        <TextField
          fullWidth
          placeholder='Pesquisar permissões...'
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
                {selectedPermissions.length} de {totalFilteredPermissions} selecionada(s)
              </Typography>
            </div>

            <Divider className='mbe-2' />

            <div style={{ maxHeight: 500, overflow: 'auto' }}>
              {Object.entries(filteredGroupedPermissions).map(([module, perms]) => {
                const modulePermissions = perms.map(p => p.id)
                const selectedCount = modulePermissions.filter(id => selectedPermissions.includes(id)).length
                const allSelected = selectedCount === modulePermissions.length

                return (
                  <Accordion key={module} defaultExpanded={Object.keys(filteredGroupedPermissions).length === 1}>
                    <AccordionSummary expandIcon={<i className='tabler-chevron-down' />}>
                      <div className='flex items-center gap-2 flex-grow'>
                        <Checkbox
                          checked={allSelected}
                          indeterminate={selectedCount > 0 && !allSelected}
                          onChange={() => handleToggleModule(module)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Typography variant='h6'>{module}</Typography>
                        <Chip
                          label={`${selectedCount}/${perms.length}`}
                          size='small'
                          color={selectedCount > 0 ? 'primary' : 'default'}
                        />
                      </div>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {perms.map((permission) => (
                          <ListItem key={permission.id} disablePadding>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectedPermissions.includes(permission.id)}
                                  onChange={() => handleTogglePermission(permission.id)}
                                />
                              }
                              label={
                                <div className='flex flex-col'>
                                  <div className='flex items-center gap-2'>
                                    <Typography variant='body1'>{permission.nome}</Typography>
                                    <Chip label={permission.tipo} size='small' variant='tonal' />
                                  </div>
                                  <Typography variant='body2' color='text.secondary' className='font-mono text-xs'>
                                    {permission.codigo}
                                  </Typography>
                                  {permission.descricao && (
                                    <Typography variant='caption' color='text.secondary'>
                                      {permission.descricao}
                                    </Typography>
                                  )}
                                </div>
                              }
                              sx={{ width: '100%', alignItems: 'flex-start', margin: 0, paddingY: 1 }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                )
              })}
            </div>
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
          disabled={selectedPermissions.length === 0 || saving}
        >
          {saving ? <CircularProgress size={20} /> : `Adicionar (${selectedPermissions.length})`}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddPermissionsToGroupDialog
