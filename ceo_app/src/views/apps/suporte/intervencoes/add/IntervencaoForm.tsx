'use client'

import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import Grid from '@mui/material/Grid2'
import dayjs from 'dayjs'

import { intervencoesAPI } from '@/libs/api/intervencoes'
import type { CriarIntervencaoDto, TipoIntervencao, StatusIntervencao } from '@/libs/api/intervencoes'
import { toastService } from '@/libs/notifications/toasterService'
import type { getDictionary } from '@/utils/getDictionary'

// Component Imports
import IntervencaoAddHeader from './IntervencaoAddHeader'
import IntervencaoInformation from './IntervencaoInformation'
import IntervencaoDetalhes from './IntervencaoDetalhes'
import IntervencaoCustos from './IntervencaoCustos'

type FormValues = {
  ticket_id?: number
  equipamento_id: number | ''
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
  const ticketIdFromUrl = searchParams.get('ticket')

  const methods = useForm<FormValues>({
    defaultValues: {
      ticket_id: ticketId || (ticketIdFromUrl ? Number(ticketIdFromUrl) : undefined),
      equipamento_id: '',
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
      status: 'agendada'
    }
  })

  // Carregar intervenção se for edição
  useEffect(() => {
    if (id) {
      loadIntervencao()
    }
  }, [id])

  const loadIntervencao = async () => {
    try {
      const data = await intervencoesAPI.getById(id!)

      methods.reset({
        ticket_id: data.ticket_id,
        equipamento_id: data.equipamento_id,
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
        status: data.status
      })
    } catch (error) {
      console.error('Erro ao carregar intervenção:', error)
      toastService.error('Erro ao carregar intervenção')
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
        equipamento_id: Number(data.equipamento_id),
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
        status: data.status
      }

      if (isEdit && id) {
        await intervencoesAPI.update(id, dto)
        toastService.success('Intervenção atualizada com sucesso')
      } else {
        await intervencoesAPI.create(dto)
        toastService.success('Intervenção criada com sucesso')
      }

      router.push('/apps/suporte/intervencoes')
    } catch (error: any) {
      console.error('Erro ao salvar intervenção:', error)
      toastService.error(error.message || 'Erro ao salvar intervenção')
    }
  }

  const handleDiscard = () => {
    const finalTicketId = ticketId || ticketIdFromUrl
    if (finalTicketId) {
      router.push(`/apps/suporte/tickets/${finalTicketId}`)
    } else {
      router.push('/apps/suporte/intervencoes')
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

          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12 }}>
                <IntervencaoInformation viewOnly={viewOnly} />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <IntervencaoDetalhes viewOnly={viewOnly} />
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12 }}>
                <IntervencaoCustos viewOnly={viewOnly} intervencaoId={id || undefined} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  )
}

export default IntervencaoForm
