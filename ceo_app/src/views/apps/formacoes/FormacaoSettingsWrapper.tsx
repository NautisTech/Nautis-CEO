'use client'

// React Imports
import { useState, type ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import FormacaoSettings from './FormacaoSettings'

const InformacoesGeraisTab = dynamic(() => import('@views/apps/formacoes/informacoes-gerais'))
const ModulosTab = dynamic(() => import('@views/apps/formacoes/modulos'))
const AulasTab = dynamic(() => import('@views/apps/formacoes/aulas'))
const BlocosTab = dynamic(() => import('@views/apps/formacoes/blocos'))
const QuizTab = dynamic(() => import('@views/apps/formacoes/quiz'))
const ClientesTab = dynamic(() => import('@views/apps/formacoes/clientes'))

interface FormacaoSettingsWrapperProps {
  formacaoId: number
}

const FormacaoSettingsWrapper = ({ formacaoId }: FormacaoSettingsWrapperProps) => {
  const [selectedModuloForAulas, setSelectedModuloForAulas] = useState<number | null>(null)

  const handleGerirAulas = (moduloId: number) => {
    setSelectedModuloForAulas(moduloId)
  }

  const tabContentList: { [key: string]: ReactElement } = {
    'informacoes-gerais': <InformacoesGeraisTab formacaoId={formacaoId} />,
    'modulos': <ModulosTab formacaoId={formacaoId} onGerirAulas={handleGerirAulas} />,
    'aulas': <AulasTab formacaoId={formacaoId} preSelectedModuloId={selectedModuloForAulas} />,
    'blocos': <BlocosTab formacaoId={formacaoId} />,
    'quiz': <QuizTab formacaoId={formacaoId} />,
    'clientes': <ClientesTab formacaoId={formacaoId} />
  }

  return (
    <FormacaoSettings
      tabContentList={tabContentList}
      formacaoId={formacaoId}
      selectedModuloForAulas={selectedModuloForAulas}
      onGerirAulas={handleGerirAulas}
    />
  )
}

export default FormacaoSettingsWrapper
