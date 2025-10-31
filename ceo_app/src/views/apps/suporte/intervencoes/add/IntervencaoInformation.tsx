'use client'

import { useEffect, useState } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import CustomTextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
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

  const [temEquipamento, setTemEquipamento] = useState(false)
  const [tipoEquipamento, setTipoEquipamento] = useState<'registado' | 'nao_registado'>('registado')

  useEffect(() => {
    fetchData()
  }, [])

  // Detect if equipment is set (for edit mode)
  useEffect(() => {
    const subscription = watch((value) => {
      const hasEquipamentoId = !!value.equipamento_id
      const hasEquipamentoSN = !!value.equipamento_sn

      if (hasEquipamentoId || hasEquipamentoSN) {
        setTemEquipamento(true)
        setTipoEquipamento(hasEquipamentoId ? 'registado' : 'nao_registado')
      }
    })

    return () => subscription.unsubscribe()
  }, [watch])

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
                <CustomTextField
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
                </CustomTextField>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name='status'
              control={control}
              rules={{ required: 'Status é obrigatório' }}
              render={({ field, fieldState }) => (
                <CustomTextField
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
                </CustomTextField>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Controller
              name='titulo'
              control={control}
              rules={{ required: 'Título é obrigatório' }}
              render={({ field, fieldState }) => (
                <CustomTextField
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

          {/* Checkbox: É diferente do equipamento do ticket? */}
          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={temEquipamento}
                  disabled={viewOnly}
                  onChange={e => {
                    setTemEquipamento(e.target.checked)
                    if (!e.target.checked) {
                      // Reset equipment fields
                      setValue('equipamento_id', '')
                      setValue('equipamento_sn', '')
                      setValue('equipamento_descritivo', '')
                    }
                  }}
                />
              }
              label='É diferente do equipamento do ticket?'
            />
          </Grid>

          {temEquipamento && (
            <>
              <Grid size={{ xs: 12 }}>
                <FormControl component='fieldset' disabled={viewOnly}>
                  <FormLabel component='legend'>Tipo de Equipamento</FormLabel>
                  <RadioGroup
                    row
                    value={tipoEquipamento}
                    onChange={e => {
                      setTipoEquipamento(e.target.value as 'registado' | 'nao_registado')
                      // Reset fields when switching type
                      if (e.target.value === 'registado') {
                        setValue('equipamento_sn', '')
                        setValue('equipamento_descritivo', '')
                      } else {
                        setValue('equipamento_id', '')
                      }
                    }}
                  >
                    <FormControlLabel value='registado' control={<Radio />} label='Equipamento Registado' />
                    <FormControlLabel
                      value='nao_registado'
                      control={<Radio />}
                      label='Número de Série e Descritivo'
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {tipoEquipamento === 'registado' ? (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name='equipamento_id'
                    control={control}
                    rules={{ required: 'Equipamento é obrigatório' }}
                    render={({ field, fieldState }) => (
                      <CustomTextField
                        {...field}
                        select
                        fullWidth
                        label='Equipamento'
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        disabled={viewOnly}
                        value={field.value || ''}
                        required
                      >
                        <MenuItem value=''>Selecione um equipamento</MenuItem>
                        {equipamentos.map(eq => (
                          <MenuItem key={eq.id} value={eq.id}>
                            {eq.numero_interno} - {eq.marca_nome} {eq.modelo_nome}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    )}
                  />
                </Grid>
              ) : (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name='equipamento_sn'
                      control={control}
                      rules={{ required: 'Número de série é obrigatório' }}
                      render={({ field, fieldState }) => (
                        <CustomTextField
                          {...field}
                          fullWidth
                          label='Número de Série'
                          placeholder='Ex: NB-2024-001'
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
                      name='equipamento_descritivo'
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          fullWidth
                          label='Descritivo do Equipamento (Opcional)'
                          placeholder='Ex: Notebook Dell Inspiron 15'
                          disabled={viewOnly}
                        />
                      )}
                    />
                  </Grid>
                </>
              )}
            </>
          )}

          <Grid size={{ xs: 12, sm: temEquipamento && tipoEquipamento === 'nao_registado' ? 12 : 6 }}>
            <Controller
              name='tecnico_id'
              control={control}
              rules={{ required: 'Técnico é obrigatório' }}
              render={({ field, fieldState }) => (
                <CustomTextField
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
                </CustomTextField>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Controller
              name='ticket_id'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  select
                  fullWidth
                  label='Ticket Associado'
                  disabled={viewOnly}
                  value={field.value || ''}
                >
                  <MenuItem value=''>Nenhum</MenuItem>
                  {tickets.map(ticket => (
                    <MenuItem key={ticket.id} value={ticket.id}>
                      #{ticket.numero_ticket} - {ticket.assunto}
                    </MenuItem>
                  ))}
                </CustomTextField>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name='data_inicio'
              control={control}
              rules={{ required: 'Data de início é obrigatória' }}
              render={({ field, fieldState }) => (
                <CustomTextField
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
                <CustomTextField
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
                <CustomTextField
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
