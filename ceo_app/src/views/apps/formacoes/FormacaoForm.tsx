'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Grid from '@mui/material/Grid2'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'
import { formacoesAPI } from '@/libs/api/formacoes'
import type { Formacao } from '@/libs/api/formacoes'

// Component Imports
import FormacaoAddHeader from './add/FormacaoAddHeader'
import InformacoesGerais from './add/InformacoesGerais'
import Modulos from './add/Modulos'
import Aulas from './add/Aulas'
import Blocos from './add/Blocos'
import Clientes from './add/Clientes'

interface FormacaoFormProps {
  formacaoId?: number
}

const FormacaoForm = ({ formacaoId }: FormacaoFormProps) => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const [formacao, setFormacao] = useState<Formacao | null>(null)
  const [loading, setLoading] = useState(!!formacaoId)
  const [selectedModulo, setSelectedModulo] = useState<number | null>(null)
  const [selectedAula, setSelectedAula] = useState<number | null>(null)

  useEffect(() => {
    if (formacaoId) {
      loadFormacao()
    }
  }, [formacaoId])

  const loadFormacao = async () => {
    try {
      const data = await formacoesAPI.obter(formacaoId!)
      setFormacao(data)
    } catch (error) {
      console.error('Erro ao carregar formação:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push(getLocalizedUrl('/apps/formacoes/list', locale as Locale))
  }

  const handleFormacaoCreated = (novaFormacao: Formacao) => {
    setFormacao(novaFormacao)
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <FormacaoAddHeader formacao={formacao} onBack={handleBack} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <InformacoesGerais formacao={formacao} onSave={handleFormacaoCreated} />
      </Grid>

      {formacao && (
        <>
          <Grid size={{ xs: 12 }}>
            <Modulos formacaoId={formacao.id} onSelectModulo={setSelectedModulo} />
          </Grid>

          {selectedModulo && (
            <Grid size={{ xs: 12 }}>
              <Aulas moduloId={selectedModulo} onSelectAula={setSelectedAula} />
            </Grid>
          )}

          {selectedAula && (
            <Grid size={{ xs: 12 }}>
              <Blocos aulaId={selectedAula} />
            </Grid>
          )}

          <Grid size={{ xs: 12 }}>
            <Clientes formacaoId={formacao.id} />
          </Grid>
        </>
      )}
    </Grid>
  )
}

export default FormacaoForm
