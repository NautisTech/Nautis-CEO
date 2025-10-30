'use client'

// React Imports
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

// Third-party Imports
import { toast } from 'react-toastify'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Context Imports
import { useAuth } from '@/contexts/AuthProvider'

// Type Imports
import type { Locale } from '@configs/i18n'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// API Imports
import { ticketsAPI, type Ticket, type TipoTicket, PrioridadeTicket, StatusTicket } from '@/libs/api/suporte'
import { equipamentosAPI, type Equipamento } from '@/libs/api/equipamentos'
import { clientesAPI, type Cliente } from '@/libs/api/clientes'
import { usersAPI, type UserListItem } from '@/libs/api/users'
import { funcionariosAPI, type Funcionario } from '@/libs/api/funcionarios'

interface TicketFormProps {
  ticketId?: number
  mode: 'create' | 'edit'
}

const TicketForm = ({ ticketId, mode }: TicketFormProps) => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(mode === 'edit')
  const [tiposTicket, setTiposTicket] = useState<TipoTicket[]>([])
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [utilizadores, setUtilizadores] = useState<UserListItem[]>([])
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])

  const [formData, setFormData] = useState({
    tipo_ticket_id: 0,
    equipamento_id: 0,
    cliente_id: 0,
    solicitante_id: user?.id || 0,
    atribuido_id: 0,
    titulo: '',
    descricao: '',
    prioridade: PrioridadeTicket.MEDIA,
    status: StatusTicket.ABERTO,
    localizacao: ''
  })

  useEffect(() => {
    const loadData = async () => {
      await fetchInitialData()
      if (mode === 'edit' && ticketId) {
        await fetchTicket()
      }
    }
    loadData()
  }, [ticketId, mode])

  const fetchInitialData = async () => {
    try {
      const [tipos, equips, clientesData, users, funcs] = await Promise.all([
        ticketsAPI.getTipos(),
        equipamentosAPI.list({ ativo: true }),
        clientesAPI.list({ ativo: true }),
        usersAPI.list({ ativo: true }),
        funcionariosAPI.list({ ativo: true })
      ])

      console.log('Tipos de ticket carregados:', tipos)
      console.log('Equipamentos carregados:', equips)
      console.log('Clientes carregados:', clientesData)
      console.log('Utilizadores carregados:', users)
      console.log('Funcionários carregados:', funcs)

      setTiposTicket(tipos)

      if (Array.isArray(equips)) {
        setEquipamentos(equips)
      } else if ('data' in equips) {
        setEquipamentos(equips.data)
      }

      if (Array.isArray(clientesData)) {
        setClientes(clientesData)
      } else if ('data' in clientesData) {
        setClientes(clientesData.data)
      }

      if ('data' in users) {
        setUtilizadores(users.data)
      } else if (Array.isArray(users)) {
        setUtilizadores(users)
      }

      if ('data' in funcs) {
        setFuncionarios(funcs.data)
      } else if (Array.isArray(funcs)) {
        setFuncionarios(funcs)
      }
    } catch (error) {
      console.error('Error fetching initial data:', error)
    }
  }

  const fetchTicket = async () => {
    if (!ticketId) return

    try {
      setLoadingData(true)
      const ticket = await ticketsAPI.getById(ticketId)

      console.log('Ticket carregado:', ticket)

      setFormData({
        tipo_ticket_id: ticket.tipo_ticket_id,
        equipamento_id: ticket.equipamento_id || 0,
        cliente_id: ticket.cliente_id || 0,
        solicitante_id: ticket.solicitante_id,
        atribuido_id: ticket.atribuido_id || 0,
        titulo: ticket.titulo,
        descricao: ticket.descricao,
        prioridade: ticket.prioridade,
        status: ticket.status,
        localizacao: ticket.localizacao || ''
      })
    } catch (error) {
      console.error('Error fetching ticket:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.id) {
      console.error('User not logged in')
      toast.error('Utilizador não autenticado')
      return
    }

    setLoading(true)

    try {
      const data = {
        ...formData,
        solicitante_id: formData.solicitante_id || user.id,
        equipamento_id: formData.equipamento_id || undefined,
        cliente_id: formData.cliente_id || undefined,
        atribuido_id: formData.atribuido_id || undefined
      }

      if (mode === 'edit' && ticketId) {
        await ticketsAPI.update(ticketId, data)
        toast.success('Ticket atualizado com sucesso')
      } else {
        await ticketsAPI.create(data)
        toast.success('Ticket criado com sucesso')
      }

      router.push(getLocalizedUrl('/apps/suporte/tickets', locale as Locale))
    } catch (error: any) {
      console.error('Error saving ticket:', error)
      toast.error(error?.message || 'Erro ao guardar ticket')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <Card>
        <CardContent className='flex justify-center items-center min-h-[400px]'>
          <CircularProgress />
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant='h5' className='mb-6'>
                {mode === 'edit' ? 'Editar Ticket' : 'Novo Ticket'}
              </Typography>

              <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Tipo de Ticket'
                    value={formData.tipo_ticket_id}
                    onChange={e => setFormData({ ...formData, tipo_ticket_id: Number(e.target.value) })}
                    required
                  >
                    <MenuItem value={0} disabled>
                      Selecione um tipo
                    </MenuItem>
                    {tiposTicket.map(tipo => (
                      <MenuItem key={tipo.id} value={tipo.id}>
                        {tipo.nome}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Cliente (Opcional - Interno se vazio)'
                    value={formData.cliente_id}
                    onChange={e => setFormData({ ...formData, cliente_id: Number(e.target.value) })}
                  >
                    <MenuItem value={0}>Interno</MenuItem>
                    {clientes.map(cliente => (
                      <MenuItem key={cliente.id} value={cliente.id}>
                        {cliente.nome_cliente || cliente.empresa_nome || cliente.num_cliente || `Cliente ${cliente.id}`}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Solicitante'
                    value={formData.solicitante_id}
                    onChange={e => setFormData({ ...formData, solicitante_id: Number(e.target.value) })}
                    required
                  >
                    <MenuItem value={0} disabled>
                      Selecione um utilizador
                    </MenuItem>
                    {utilizadores.map(utilizador => (
                      <MenuItem key={utilizador.id} value={utilizador.id}>
                        {utilizador.username} - {utilizador.email}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Equipamento (Opcional)'
                    value={formData.equipamento_id}
                    onChange={e => setFormData({ ...formData, equipamento_id: Number(e.target.value) })}
                  >
                    <MenuItem value={0}>Nenhum</MenuItem>
                    {equipamentos.map(equip => (
                      <MenuItem key={equip.id} value={equip.id}>
                        {equip.numero_interno} - {equip.descricao}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    fullWidth
                    label='Título'
                    value={formData.titulo}
                    onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    fullWidth
                    multiline
                    rows={4}
                    label='Descrição'
                    value={formData.descricao}
                    onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Prioridade'
                    value={formData.prioridade}
                    onChange={e => setFormData({ ...formData, prioridade: e.target.value as PrioridadeTicket })}
                    required
                  >
                    <MenuItem value={PrioridadeTicket.BAIXA}>Baixa</MenuItem>
                    <MenuItem value={PrioridadeTicket.MEDIA}>Média</MenuItem>
                    <MenuItem value={PrioridadeTicket.ALTA}>Alta</MenuItem>
                    <MenuItem value={PrioridadeTicket.URGENTE}>Urgente</MenuItem>
                  </CustomTextField>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Status'
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as StatusTicket })}
                    required
                  >
                    <MenuItem value={StatusTicket.ABERTO}>Aberto</MenuItem>
                    <MenuItem value={StatusTicket.EM_ANDAMENTO}>Em Andamento</MenuItem>
                    <MenuItem value={StatusTicket.AGUARDANDO}>Aguardando</MenuItem>
                    <MenuItem value={StatusTicket.RESOLVIDO}>Resolvido</MenuItem>
                    <MenuItem value={StatusTicket.FECHADO}>Fechado</MenuItem>
                    <MenuItem value={StatusTicket.CANCELADO}>Cancelado</MenuItem>
                  </CustomTextField>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Responsável (Opcional)'
                    value={formData.atribuido_id}
                    onChange={e => setFormData({ ...formData, atribuido_id: Number(e.target.value) })}
                  >
                    <MenuItem value={0}>Nenhum (Irá para Triagem)</MenuItem>
                    {funcionarios.map(func => (
                      <MenuItem key={func.id} value={func.id}>
                        {func.nome_completo} {func.nome_abreviado ? `- ${func.nome_abreviado}` : ''}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    fullWidth
                    label='Localização (Opcional)'
                    value={formData.localizacao}
                    onChange={e => setFormData({ ...formData, localizacao: e.target.value })}
                    placeholder='Ex: Sala 101, Departamento TI'
                  />
                </Grid>

                <Grid size={{ xs: 12 }} className='flex gap-4 justify-end'>
                  <Button
                    variant='tonal'
                    color='secondary'
                    onClick={() => router.push(getLocalizedUrl('/apps/suporte/tickets', locale as Locale))}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button type='submit' variant='contained' disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : mode === 'edit' ? 'Atualizar' : 'Criar Ticket'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  )
}

export default TicketForm
