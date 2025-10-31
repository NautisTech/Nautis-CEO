'use client'

import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import Grid from '@mui/material/Grid2'
import dayjs from 'dayjs'

import { intervencoesAPI } from '@/libs/api/intervencoes'
import type { CriarIntervencaoDto, TipoIntervencao, StatusIntervencao } from '@/libs/api/intervencoes'
import { ticketsAPI } from '@/libs/api/suporte'
import { toastService } from '@/libs/notifications/toasterService'
import type { getDictionary } from '@/utils/getDictionary'
import type { Locale } from '@configs/i18n'
import { getLocalizedUrl } from '@/utils/i18n'

// Component Imports
import IntervencaoAddHeader from './IntervencaoAddHeader'
import IntervencaoInformation from './IntervencaoInformation'
import IntervencaoDetalhes from './IntervencaoDetalhes'
import IntervencaoAprovacao from './IntervencaoAprovacao'
import IntervencaoCustos from './IntervencaoCustos'
import IntervencaoAnexos from './IntervencaoAnexos'

type FormValues = {
  ticket_id?: number
  equipamento_id: number | ''
  equipamento_sn: string
  equipamento_descritivo: string
  tipo: TipoIntervencao | ''
  titulo: string
  descricao: string
  diagnostico: string
  solucao: string
  tecnico_id: number | ''
  data_inicio: string
  data_fim: string
  duracao_minutos: number | ''
  custo_mao_obra: number | ''
  custo_pecas: number | ''
  fornecedor_externo: string
  numero_fatura: string
  garantia: boolean
  observacoes: string
  status: StatusIntervencao
  precisa_aprovacao_cliente: boolean
  aprovacao_cliente: boolean
  data_aprovacao: string
  anexos_ids: number[]
}

type Props = {
  id: number | null
  viewOnly: boolean
  isEdit: boolean
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  ticketId?: number
}

const IntervencaoForm = ({ id, viewOnly, isEdit, dictionary, ticketId }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const locale = params.lang as Locale
  const ticketIdFromUrl = searchParams.get('ticket')
  const [ticketTemCliente, setTicketTemCliente] = useState(false)

  const methods = useForm<FormValues>({
    defaultValues: {
      ticket_id: ticketId || (ticketIdFromUrl ? Number(ticketIdFromUrl) : undefined),
      equipamento_id: '',
      equipamento_sn: '',
      equipamento_descritivo: '',
      tipo: '',
      titulo: '',
      descricao: '',
      diagnostico: '',
      solucao: '',
      tecnico_id: '',
      data_inicio: dayjs().format('YYYY-MM-DDTHH:mm'),
      data_fim: '',
      duracao_minutos: '',
      custo_mao_obra: '',
      custo_pecas: '',
      fornecedor_externo: '',
      numero_fatura: '',
      garantia: false,
      observacoes: '',
      status: 'agendada',
      precisa_aprovacao_cliente: false,
      aprovacao_cliente: false,
      data_aprovacao: ''
    }
  })

  // Carregar intervenção se for edição
  useEffect(() => {
    if (id) {
      loadIntervencao()
    }
  }, [id])

  // Verificar se o ticket tem cliente_id
  useEffect(() => {
    const checkTicketCliente = async () => {
      const currentTicketId = methods.watch('ticket_id')
      if (currentTicketId) {
        try {
          const ticket = await ticketsAPI.getById(currentTicketId)
          setTicketTemCliente(!!ticket.cliente_id)
        } catch (error) {
          console.error('Erro ao buscar ticket:', error)
          setTicketTemCliente(false)
        }
      } else {
        setTicketTemCliente(false)
      }
    }

    checkTicketCliente()

    // Watch for changes in ticket_id
    const subscription = methods.watch((value, { name }) => {
      if (name === 'ticket_id') {
        checkTicketCliente()
      }
    })

    return () => subscription.unsubscribe()
  }, [methods.watch])

  const loadIntervencao = async () => {
    try {
      const data = await intervencoesAPI.getById(id!)

      methods.reset({
        ticket_id: data.ticket_id,
        equipamento_id: data.equipamento_id || '',
        equipamento_sn: data.equipamento_sn || '',
        equipamento_descritivo: data.equipamento_descritivo || '',
        tipo: data.tipo,
        titulo: data.titulo,
        descricao: data.descricao || '',
        diagnostico: data.diagnostico || '',
        solucao: data.solucao || '',
        tecnico_id: data.tecnico_id,
        data_inicio: dayjs(data.data_inicio).format('YYYY-MM-DDTHH:mm'),
        data_fim: data.data_fim ? dayjs(data.data_fim).format('YYYY-MM-DDTHH:mm') : '',
        duracao_minutos: data.duracao_minutos || '',
        custo_mao_obra: data.custo_mao_obra || '',
        custo_pecas: data.custo_pecas || '',
        fornecedor_externo: data.fornecedor_externo || '',
        numero_fatura: data.numero_fatura || '',
        garantia: data.garantia,
        observacoes: data.observacoes || '',
        status: data.status,
        precisa_aprovacao_cliente: data.precisa_aprovacao_cliente || false,
        aprovacao_cliente: data.aprovacao_cliente || false,
        data_aprovacao: data.data_aprovacao || ''
      })
    } catch (error) {
      console.error('Erro ao carregar intervenção:', error)
      toast.error('Erro ao carregar intervenção')
    }
  }

  const onSubmit = async (data: FormValues) => {
    try {
      // Calcular custo total
      const custoMaoObra = Number(data.custo_mao_obra) || 0
      const custoPecas = Number(data.custo_pecas) || 0
      const custoTotal = custoMaoObra + custoPecas

      const dto: CriarIntervencaoDto = {
        ticket_id: data.ticket_id,
        equipamento_id: data.equipamento_id ? Number(data.equipamento_id) : undefined,
        equipamento_sn: data.equipamento_sn || undefined,
        equipamento_descritivo: data.equipamento_descritivo || undefined,
        tipo: data.tipo as TipoIntervencao,
        titulo: data.titulo,
        descricao: data.descricao || undefined,
        diagnostico: data.diagnostico || undefined,
        solucao: data.solucao || undefined,
        tecnico_id: Number(data.tecnico_id),
        data_inicio: data.data_inicio ? dayjs(data.data_inicio).toISOString() : dayjs().toISOString(),
        data_fim: data.data_fim ? dayjs(data.data_fim).toISOString() : undefined,
        duracao_minutos: data.duracao_minutos ? Number(data.duracao_minutos) : undefined,
        custo_mao_obra: custoMaoObra || undefined,
        custo_pecas: custoPecas || undefined,
        custo_total: custoTotal || undefined,
        fornecedor_externo: data.fornecedor_externo || undefined,
        numero_fatura: data.numero_fatura || undefined,
        garantia: data.garantia,
        observacoes: data.observacoes || undefined,
        status: data.status,
        precisa_aprovacao_cliente: data.precisa_aprovacao_cliente,
        aprovacao_cliente: data.aprovacao_cliente,
        anexos_ids: data.anexos_ids && data.anexos_ids.length > 0 ? data.anexos_ids : undefined
      }

      // Só adiciona data_aprovacao se aprovacao_cliente for true
      if (data.aprovacao_cliente) {
        dto.data_aprovacao = data.data_aprovacao ? data.data_aprovacao : dayjs().toISOString()
      }

      if (isEdit && id) {
        await intervencoesAPI.update(id, dto)
        toastService.success('Intervenção atualizada com sucesso')
      } else {
        await intervencoesAPI.create(dto)
        toastService.success('Intervenção criada com sucesso')
      }

      router.push(getLocalizedUrl('/apps/suporte/intervencoes', locale))
    } catch (error: any) {
      console.error('Erro ao salvar intervenção:', error)
      toastService.error(error.message || 'Erro ao salvar intervenção')
    }
  }

  const handleDiscard = () => {
    const finalTicketId = ticketId || ticketIdFromUrl
    if (finalTicketId) {
      router.push(getLocalizedUrl(`/apps/suporte/tickets/${finalTicketId}`, locale))
    } else {
      router.push(getLocalizedUrl('/apps/suporte/intervencoes', locale))
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <IntervencaoAddHeader
              isEdit={isEdit}
              viewOnly={viewOnly}
              onDiscard={handleDiscard}
              dictionary={dictionary}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <IntervencaoInformation viewOnly={viewOnly} />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <IntervencaoDetalhes viewOnly={viewOnly} />
          </Grid>

          {/* Só mostra aprovação de cliente se o ticket tiver cliente_id */}
          {ticketTemCliente && (
            <Grid size={{ xs: 12 }}>
              <IntervencaoAprovacao viewOnly={viewOnly} intervencaoData={methods.watch()} />
            </Grid>
          )}

          <Grid size={{ xs: 12 }}>
            <IntervencaoCustos viewOnly={viewOnly} intervencaoId={id || undefined} />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <IntervencaoAnexos viewOnly={viewOnly} intervencaoData={methods.watch()} />
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  )
}

export default IntervencaoForm
