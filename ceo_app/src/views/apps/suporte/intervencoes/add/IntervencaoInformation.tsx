'use client'

import { useEffect, useState } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import dayjs from 'dayjs'

import { equipamentosAPI } from '@/libs/api/equipamentos'
import { funcionariosAPI } from '@/libs/api/funcionarios'
import { ticketsAPI } from '@/libs/api/suporte'

type Props = {
  viewOnly: boolean
}

const IntervencaoInformation = ({ viewOnly }: Props) => {
  const { control, watch, setValue } = useFormContext()
  const [equipamentos, setEquipamentos] = useState<any[]>([])
  const [tecnicos, setTecnicos] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  // Auto-calculate duracao_minutos when either date changes
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'data_inicio' || name === 'data_fim') {
        const { data_inicio, data_fim } = value

        if (data_inicio && data_fim) {
          const inicio = dayjs(data_inicio)
          const fim = dayjs(data_fim)
          const duracaoMinutos = fim.diff(inicio, 'minute')

          if (duracaoMinutos > 0) {
            setValue('duracao_minutos', duracaoMinutos)
          } else if (duracaoMinutos < 0) {
            // Data fim é anterior à data início
            setValue('duracao_minutos', 0)
          }
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [watch, setValue])

  const fetchData = async () => {
    try {
      const [equipamentosData, tecnicosData, ticketsData] = await Promise.all([
        equipamentosAPI.list(),
        funcionariosAPI.list(),
        ticketsAPI.list({ status: 'aberto' })
      ])

      setEquipamentos(Array.isArray(equipamentosData) ? equipamentosData : equipamentosData.data || [])
      setTecnicos(Array.isArray(tecnicosData) ? tecnicosData : tecnicosData.data || [])
      setTickets(Array.isArray(ticketsData) ? ticketsData : ticketsData.data || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  return (
    <Card>
      <CardHeader title='Informações da Intervenção' />
      <CardContent>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name='tipo'
              control={control}
              rules={{ required: 'Tipo é obrigatório' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label='Tipo de Intervenção'
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={viewOnly}
                  required
                >
                  <MenuItem value='preventiva'>Preventiva</MenuItem>
                  <MenuItem value='corretiva'>Corretiva</MenuItem>
                  <MenuItem value='instalacao'>Instalação</MenuItem>
                  <MenuItem value='configuracao'>Configuração</MenuItem>
                  <MenuItem value='upgrade'>Upgrade</MenuItem>
                  <MenuItem value='manutencao'>Manutenção</MenuItem>
                </TextField>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name='status'
              control={control}
              rules={{ required: 'Status é obrigatório' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label='Status'
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={viewOnly}
                  required
                >
                  <MenuItem value='agendada'>Agendada</MenuItem>
                  <MenuItem value='em_progresso'>Em Progresso</MenuItem>
                  <MenuItem value='concluida'>Concluída</MenuItem>
                  <MenuItem value='cancelada'>Cancelada</MenuItem>
                </TextField>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Controller
              name='titulo'
              control={control}
              rules={{ required: 'Título é obrigatório' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Título'
                  placeholder='Ex: Manutenção preventiva trimestral'
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={viewOnly}
                  required
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name='equipamento_id'
              control={control}
              rules={{ required: 'Equipamento é obrigatório' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label='Equipamento'
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={viewOnly}
                  required
                >
                  {equipamentos.map(eq => (
                    <MenuItem key={eq.id} value={eq.id}>
                      {eq.numero_interno} - {eq.marca_nome} {eq.modelo_nome}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name='tecnico_id'
              control={control}
              rules={{ required: 'Técnico é obrigatório' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label='Técnico Responsável'
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={viewOnly}
                  required
                >
                  {tecnicos.map(tec => (
                    <MenuItem key={tec.id} value={tec.id}>
                      {tec.nome_completo}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Controller
              name='ticket_id'
              control={control}
              render={({ field }) => (
                <TextField {...field} select fullWidth label='Ticket Associado (opcional)' disabled={viewOnly}>
                  <MenuItem value=''>Nenhum</MenuItem>
                  {tickets.map(ticket => (
                    <MenuItem key={ticket.id} value={ticket.id}>
                      #{ticket.numero_ticket} - {ticket.assunto}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name='data_inicio'
              control={control}
              rules={{ required: 'Data de início é obrigatória' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  type='datetime-local'
                  label='Data e Hora de Início'
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={viewOnly}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name='data_fim'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type='datetime-local'
                  label='Data e Hora de Fim (opcional)'
                  disabled={viewOnly}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name='duracao_minutos'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type='number'
                  label='Duração (minutos)'
                  disabled={viewOnly}
                  inputProps={{ min: 0 }}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name='garantia'
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} disabled={viewOnly} />}
                  label='Intervenção em Garantia'
                />
              )}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default IntervencaoInformation
