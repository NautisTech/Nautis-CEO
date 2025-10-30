'use client'

import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import CustomTextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { formacoesAPI } from '@/libs/api/formacoes'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'

interface ClientesProps {
  formacaoId: number
}

interface Cliente {
  id: number
  nome: string
  email: string
}

const Clientes = ({ formacaoId }: ClientesProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [clientesAssociados, setClientesAssociados] = useState<Cliente[]>([])
  const [selectedClientes, setSelectedClientes] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (formacaoId) {
      loadClientesAssociados()
    }
  }, [formacaoId])

  const loadClientesAssociados = async () => {
    try {
      const data = await formacoesAPI.listarClientesFormacao(formacaoId)
      setClientesAssociados(data)
    } catch (error) {
      console.error('Erro ao carregar clientes associados:', error)
    }
  }

  const loadClientes = async () => {
    try {
      setLoading(true)
      const data = await formacoesAPI.listarTodosClientes()
      setClientes(data)
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
      setError('Erro ao carregar lista de clientes')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = () => {
    setDialogOpen(true)
    setSelectedClientes(clientesAssociados.map(c => c.id))
    loadClientes()
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSearchTerm('')
    setError(null)
  }

  const handleToggleCliente = (clienteId: number) => {
    setSelectedClientes(prev =>
      prev.includes(clienteId)
        ? prev.filter(id => id !== clienteId)
        : [...prev, clienteId]
    )
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setError(null)

      const clientesAssociadosIds = clientesAssociados.map(c => c.id)

      // Clientes a adicionar
      const clientesAdicionar = selectedClientes.filter(id => !clientesAssociadosIds.includes(id))

      // Clientes a remover
      const clientesRemover = clientesAssociadosIds.filter(id => !selectedClientes.includes(id))

      // Adicionar novos clientes
      for (const clienteId of clientesAdicionar) {
        await formacoesAPI.associarCliente(formacaoId, clienteId)
      }

      // Remover clientes desassociados
      for (const clienteId of clientesRemover) {
        await formacoesAPI.desassociarCliente(formacaoId, clienteId)
      }

      // Recarregar lista de clientes associados
      await loadClientesAssociados()
      setSuccess('Clientes associados com sucesso!')
      handleCloseDialog()

      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      console.error('Erro ao associar clientes:', error)
      setError('Erro ao associar clientes. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card>
      <CardHeader
        title='Clientes Associados'
        action={
          <Button variant='contained' onClick={handleOpenDialog}>
            Adicionar Clientes
          </Button>
        }
      />
      <CardContent>
        {success && (
          <Alert severity='success' className='mbe-4'>
            {success}
          </Alert>
        )}

        {clientesAssociados.length === 0 ? (
          <Typography variant='body2' color='text.secondary' className='text-center py-4'>
            Nenhum cliente associado a esta formação
          </Typography>
        ) : (
          <List>
            {clientesAssociados.map((cliente) => (
              <ListItem key={cliente.id}>
                <Avatar className='mie-3'>
                  {cliente.nome.charAt(0).toUpperCase()}
                </Avatar>
                <ListItemText
                  primary={cliente.nome}
                  secondary={cliente.email}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>

      {/* Dialog de Seleção de Clientes */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth='sm' fullWidth>
        <DialogTitle className='flex items-center justify-between'>
          <Typography variant='h5'>Selecionar Clientes</Typography>
          <IconButton onClick={handleCloseDialog}>
            <i className='tabler-x' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity='error' className='mbe-4'>
              {error}
            </Alert>
          )}

          <CustomTextField
            fullWidth
            placeholder='Pesquisar por nome ou email...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='mbe-4'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <i className='tabler-search' />
                </InputAdornment>
              ),
            }}
          />

          {loading ? (
            <div className='flex justify-center p-6'>
              <CircularProgress />
            </div>
          ) : filteredClientes.length === 0 ? (
            <Typography variant='body2' color='text.secondary' className='text-center py-4'>
              {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente disponível'}
            </Typography>
          ) : (
            <List className='max-bs-[400px] overflow-y-auto'>
              {filteredClientes.map((cliente) => (
                <ListItem
                  key={cliente.id}
                  dense
                  button
                  onClick={() => handleToggleCliente(cliente.id)}
                >
                  <Checkbox
                    edge='start'
                    checked={selectedClientes.includes(cliente.id)}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText
                    primary={cliente.nome}
                    secondary={cliente.email}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions className='gap-2'>
          <Button variant='tonal' color='secondary' onClick={handleCloseDialog}>
            Cancelar
          </Button>
          <Button
            variant='contained'
            onClick={handleSave}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default Clientes
