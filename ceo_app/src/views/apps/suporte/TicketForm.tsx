'use client'

// React Imports
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

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

  const [formData, setFormData] = useState({
    tipo_ticket_id: 0,
    equipamento_id: 0,
    titulo: '',
    descricao: '',
    prioridade: PrioridadeTicket.MEDIA,
    status: StatusTicket.ABERTO,
    localizacao: ''
  })

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    if (mode === 'edit' && ticketId) {
      fetchTicket()
    }
  }, [ticketId, mode])

  const fetchInitialData = async () => {
    try {
      const [tipos, equips] = await Promise.all([
        ticketsAPI.getTipos(),
        equipamentosAPI.list({ ativo: true })
      ])

      setTiposTicket(tipos)

      if (Array.isArray(equips)) {
        setEquipamentos(equips)
      } else if ('data' in equips) {
        setEquipamentos(equips.data)
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

      setFormData({
        tipo_ticket_id: ticket.tipo_ticket_id,
        equipamento_id: ticket.equipamento_id || 0,
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
      return
    }

    setLoading(true)

    try {
      const data = {
        ...formData,
        solicitante_id: user.id,
        equipamento_id: formData.equipamento_id || undefined
      }

      if (mode === 'edit' && ticketId) {
        await ticketsAPI.update(ticketId, data)
      } else {
        await ticketsAPI.create(data)
      }

      router.push(getLocalizedUrl('/apps/suporte/tickets', locale as Locale))
    } catch (error) {
      console.error('Error saving ticket:', error)
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
