'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, Button, Typography, Chip, IconButton, CircularProgress, Divider, Tab } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import classnames from 'classnames'
import { permissionsAPI } from '@/libs/api/permissions/api'
import type { Permission } from '@/libs/api/permissions/types'
import AddPermissionDialog from './AddPermissionDialog'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const PermissionsTableNew = () => {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [groupedPermissions, setGroupedPermissions] = useState<Record<string, Permission[]>>({})
  const [activeTab, setActiveTab] = useState<string>('')

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

      // Set first tab as active
      const modules = Object.keys(grouped)
      if (modules.length > 0 && !activeTab) {
        setActiveTab(modules[0])
      }
    } catch (error) {
      console.error('Erro ao carregar permissões:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPermissions()
  }, [])

  const handleDelete = async (id: number) => {
    if (confirm('Deseja realmente deletar esta permissão?')) {
      try {
        await permissionsAPI.delete(id)
        fetchPermissions()
      } catch (error) {
        console.error('Erro ao deletar permissão:', error)
      }
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue)
  }

  if (loading) {
    return (
      <Card>
        <div className='flex items-center justify-center p-10'>
          <CircularProgress />
          <Typography className='mli-4'>A carregar permissões...</Typography>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader
          title='Permissões'
          subheader='Gerir permissões do sistema'
          action={
            <div className='flex gap-4'>
              <Button
                color='secondary'
                variant='tonal'
                startIcon={<i className='tabler-refresh' />}
                onClick={fetchPermissions}
              >
                Atualizar
              </Button>
              <Button
                variant='contained'
                startIcon={<i className='tabler-plus' />}
                onClick={() => setAddDialogOpen(true)}
              >
                Adicionar Permissão
              </Button>
            </div>
          }
        />
        <Divider />

        <TabContext value={activeTab}>
          <TabList onChange={handleTabChange} aria-label='Módulos de permissões' className='border-b'>
            {Object.entries(groupedPermissions).map(([modulo, perms]) => (
              <Tab
                key={modulo}
                value={modulo}
                label={
                  <div className='flex items-center gap-2'>
                    <span>{modulo}</span>
                    <Chip label={perms.length} size='small' />
                  </div>
                }
              />
            ))}
          </TabList>

          {Object.entries(groupedPermissions).map(([modulo, perms]) => (
            <TabPanel key={modulo} value={modulo} className='p-0'>
              <div className='overflow-x-auto'>
                <table className={tableStyles.table}>
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Nome</th>
                      <th>Descrição</th>
                      <th>Tipo</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perms.length === 0 ? (
                      <tr>
                        <td colSpan={5} className='text-center'>
                          <Typography>Nenhuma permissão encontrada</Typography>
                        </td>
                      </tr>
                    ) : (
                      perms.map((perm) => {
                        // Map permission types to colors
                        const getTypeColor = (tipo: string) => {
                          const typeMap: Record<string, 'error' | 'success' | 'warning' | 'info' | 'primary'> = {
                            'Apagar': 'error',
                            'Eliminar': 'error',
                            'Deletar': 'error',
                            'Criar': 'success',
                            'Adicionar': 'success',
                            'Editar': 'warning',
                            'Atualizar': 'warning',
                            'Listar': 'info',
                            'Ver': 'info',
                            'Visualizar': 'info',
                            'Gestao': 'primary',
                            'Gestão': 'primary'
                          }
                          return typeMap[tipo] || 'primary'
                        }

                        return (
                          <tr key={perm.id} className={classnames()}>
                            <td>
                              <Typography variant='body2' className='font-mono'>
                                {perm.codigo}
                              </Typography>
                            </td>
                            <td>
                              <Typography color='text.primary'>{perm.nome}</Typography>
                            </td>
                            <td>
                              <Typography variant='body2' color='text.secondary'>
                                {perm.descricao || '-'}
                              </Typography>
                            </td>
                            <td>
                              <Chip
                                label={perm.tipo}
                                size='small'
                                variant='tonal'
                                color={getTypeColor(perm.tipo)}
                              />
                            </td>
                            <td>
                              <IconButton size='small' onClick={() => handleDelete(perm.id)}>
                                <i className='tabler-trash text-[22px] text-textSecondary' />
                              </IconButton>
                            </td>
                          </tr>
                        )
                      })
                    )
                    }
                  </tbody>
                </table>
              </div>
            </TabPanel>
          ))}
        </TabContext>
      </Card>

      <AddPermissionDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onPermissionCreated={() => {
          setAddDialogOpen(false)
          fetchPermissions()
        }}
      />
    </>
  )
}

export default PermissionsTableNew
