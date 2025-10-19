'use client'

import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useRouter, useParams } from 'next/navigation'
import Grid from '@mui/material/Grid2'

import { useCriarConteudo, useAtualizarConteudo, useConteudo, useTiposConteudo } from '@/libs/api/conteudos'
import type { CriarConteudoDto, StatusConteudo } from '@/libs/api/conteudos/types'
import { toastService } from '@/libs/notifications/toasterService'
import type { Locale } from '@configs/i18n'

// Component Imports
import ConteudoAddHeader from './ConteudoAddHeader'
import ConteudoInformation from './ConteudoInformation'
import ConteudoImage from './ConteudoImage'
import ConteudoSettings from './ConteudoSettings'
import ConteudoOrganize from './ConteudoOrganize'
import ConteudoCamposPersonalizados from './ConteudoCamposPersonalizados'

type FormValues = {
  tipoConteudoId: number
  titulo: string
  slug: string
  subtitulo: string
  resumo: string
  conteudo: string
  imagemDestaque: File | string | null
  categoriaId: number | null
  status: StatusConteudo
  destaque: boolean
  permiteComentarios: boolean
  dataInicio: string
  dataFim: string
  tags: string[]
  campos: Record<string, any>
  metaTitle: string
  metaDescription: string
  metaKeywords: string
}

type Props = {
  tipo: string
  id: number | null
  viewOnly: boolean
  isEdit: boolean
}

const ConteudoForm = ({ tipo, id, viewOnly, isEdit }: Props) => {
  const router = useRouter()
  const { lang: locale } = useParams()

  const methods = useForm<FormValues>({
    defaultValues: {
      tipoConteudoId: 0,
      titulo: '',
      slug: '',
      subtitulo: '',
      resumo: '',
      conteudo: '',
      imagemDestaque: null,
      categoriaId: null,
      status: 'rascunho' as StatusConteudo,
      destaque: false,
      permiteComentarios: true,
      dataInicio: '',
      dataFim: '',
      tags: [],
      campos: {},
      metaTitle: '',
      metaDescription: '',
      metaKeywords: ''
    }
  })

  const { data: tipos } = useTiposConteudo()
  const { data: conteudo, isLoading: loadingConteudo } = useConteudo(id || 0, !!id)
  const criarMutation = useCriarConteudo()
  const atualizarMutation = useAtualizarConteudo()

  // Encontrar o tipoConteudoId baseado no tipo (código)
  useEffect(() => {
    if (tipos && tipo && !id) {
      const tipoEncontrado = tipos.find(
        t => t.codigo.toLowerCase() === tipo.toLowerCase()
      )
      if (tipoEncontrado) {
        methods.setValue('tipoConteudoId', tipoEncontrado.id)
      }
    }
  }, [tipos, tipo, id, methods])

  // Preencher formulário quando carregar conteúdo existente
  useEffect(() => {
    if (conteudo && id && !loadingConteudo) {
      const formatDateTimeLocal = (dateString: string | undefined) => {
        if (!dateString) return ''
        try {
          const date = new Date(dateString)
          if (isNaN(date.getTime())) return ''
          return date.toISOString().slice(0, 16)
        } catch {
          return ''
        }
      }

      // Construir objeto de campos personalizados preservando os valores
      const camposPersonalizados: Record<string, any> = {}
      if (conteudo.campos_personalizados) {
        conteudo.campos_personalizados.forEach(campo => {
          // Determinar qual valor usar baseado no tipo
          if (campo.valor_texto !== null && campo.valor_texto !== undefined) {
            camposPersonalizados[campo.codigo_campo] = campo.valor_texto
          } else if (campo.valor_numero !== null && campo.valor_numero !== undefined) {
            camposPersonalizados[campo.codigo_campo] = campo.valor_numero
          } else if (campo.valor_boolean !== null && campo.valor_boolean !== undefined) {
            camposPersonalizados[campo.codigo_campo] = campo.valor_boolean
          } else if (campo.valor_data) {
            camposPersonalizados[campo.codigo_campo] = campo.valor_data
          } else if (campo.valor_datetime) {
            try {
              camposPersonalizados[campo.codigo_campo] = new Date(campo.valor_datetime).toISOString().slice(0, 16)
            } catch {
              camposPersonalizados[campo.codigo_campo] = ''
            }
          } else if (campo.valor_json) {
            camposPersonalizados[campo.codigo_campo] = JSON.stringify(campo.valor_json, null, 2)
          }
        })
      }

      methods.reset({
        tipoConteudoId: conteudo.tipo_conteudo_id || 0,
        titulo: conteudo.titulo || '',
        slug: conteudo.slug || '',
        subtitulo: conteudo.subtitulo || '',
        resumo: conteudo.resumo || '',
        conteudo: conteudo.conteudo || '',
        imagemDestaque: conteudo.imagem_destaque || null,
        categoriaId: conteudo.categoria_id || null,
        status: conteudo.status || 'rascunho',
        destaque: conteudo.destaque || false,
        permiteComentarios: conteudo.permite_comentarios ?? true,
        dataInicio: formatDateTimeLocal(conteudo.data_inicio),
        dataFim: formatDateTimeLocal(conteudo.data_fim),
        tags: conteudo.tags?.map(t => t.nome) || [],
        campos: camposPersonalizados,
        metaTitle: conteudo.meta_title || '',
        metaDescription: conteudo.meta_description || '',
        metaKeywords: conteudo.meta_keywords || ''
      })
    }
  }, [conteudo, id, loadingConteudo, methods])

  const preparePayload = (data: FormValues, forceStatus?: StatusConteudo): CriarConteudoDto => {
    console.log('📤 Preparando payload com dados do formulário:', data)

    // Preparar campos personalizados
    const camposPersonalizados = Object.entries(data.campos || {})
      .filter(([_, valor]) => {
        // Permitir false para boolean, mas filtrar strings vazias, null e undefined
        if (typeof valor === 'boolean') return true
        if (valor === null || valor === undefined) return false
        if (typeof valor === 'string' && valor.trim() === '') return false
        return true
      })
      .map(([codigo, valor]) => {
        let tipo = 'texto'
        let valorFinal = valor

        if (typeof valor === 'boolean') {
          tipo = 'boolean'
        } else if (typeof valor === 'number') {
          tipo = 'numero'
        } else if (!isNaN(Number(valor)) && valor !== '') {
          tipo = 'numero'
          valorFinal = Number(valor)
        } else if (valor && typeof valor === 'string') {
          if (valor.trim().startsWith('{') || valor.trim().startsWith('[')) {
            try {
              JSON.parse(valor)
              tipo = 'json'
            } catch {
              tipo = 'texto'
            }
          }
        }

        return {
          codigo,
          tipo,
          valor: valorFinal
        }
      })

    console.log('📋 Campos personalizados preparados:', camposPersonalizados)

    return {
      tipoConteudoId: data.tipoConteudoId,
      titulo: data.titulo,
      slug: data.slug || undefined,
      subtitulo: data.subtitulo || undefined,
      resumo: data.resumo || undefined,
      conteudo: data.conteudo || undefined,
      imagemDestaque: (typeof data.imagemDestaque === 'string' && data.imagemDestaque) ? data.imagemDestaque : undefined,
      categoriaId: data.categoriaId || undefined,
      status: forceStatus || data.status,
      destaque: data.destaque,
      permiteComentarios: data.permiteComentarios,
      dataInicio: data.dataInicio || undefined,
      dataFim: data.dataFim || undefined,
      tags: data.tags.length > 0 ? data.tags : undefined,
      camposPersonalizados: camposPersonalizados.length > 0 ? camposPersonalizados : undefined,
      metaTitle: data.metaTitle || undefined,
      metaDescription: data.metaDescription || undefined,
      metaKeywords: data.metaKeywords || undefined
    }
  }

  const onSubmit = async (forceStatus?: StatusConteudo) => {
    const data = methods.getValues()

    try {
      const payload = preparePayload(data, forceStatus)
      console.log('📦 Payload final:', payload)

      if (id) {
        await atualizarMutation.mutateAsync({ id, data: payload })
        toastService.success('Conteúdo atualizado com sucesso!')
      } else {
        const result = await criarMutation.mutateAsync(payload)
        toastService.success('Conteúdo criado com sucesso!')
        router.push(`/${locale}/apps/conteudos/${tipo}/edit/${result.id}`)
      }
    } catch (error) {
      console.error('❌ Erro ao salvar conteúdo:', error)
      toastService.error('Erro ao salvar conteúdo')
    }
  }

  const handleDiscard = () => {
    router.push(`/${locale}/apps/conteudos/${tipo}/list`)
  }

  const handleSaveDraft = async () => {
    await onSubmit('rascunho' as StatusConteudo)
  }

  const handlePublish = async () => {
    await onSubmit('publicado' as StatusConteudo)
  }

  const handleUpdate = async () => {
    // Atualizar sem mudar o status
    await onSubmit()
  }

  const handleEdit = () => {
    router.push(`/${locale}/apps/conteudos/${tipo}/edit/${id}`)
  }

  return (
    <FormProvider {...methods}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <ConteudoAddHeader
            tipo={tipo}
            id={id}
            viewOnly={viewOnly}
            isEdit={isEdit}
            onDiscard={handleDiscard}
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublish}
            onUpdate={handleUpdate}
            onEdit={handleEdit}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <ConteudoInformation tipo={tipo} id={id} viewOnly={viewOnly} />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <ConteudoImage id={id} viewOnly={viewOnly} />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <ConteudoCamposPersonalizados tipo={tipo} id={id} viewOnly={viewOnly} />
            </Grid>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <ConteudoSettings id={id} viewOnly={viewOnly} />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <ConteudoOrganize tipo={tipo} id={id} viewOnly={viewOnly} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </FormProvider>
  )
}

export default ConteudoForm