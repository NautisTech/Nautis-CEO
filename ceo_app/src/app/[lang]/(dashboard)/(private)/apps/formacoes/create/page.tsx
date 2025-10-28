// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import FormacaoSettings from '@views/apps/formacoes/FormacaoSettings'

const InformacoesGeraisTab = dynamic(() => import('@views/apps/formacoes/informacoes-gerais'))
const ModulosTab = dynamic(() => import('@views/apps/formacoes/modulos'))
const AulasTab = dynamic(() => import('@views/apps/formacoes/aulas'))
const BlocosTab = dynamic(() => import('@views/apps/formacoes/blocos'))
const ClientesTab = dynamic(() => import('@views/apps/formacoes/clientes'))

// Vars
const tabContentList = (formacaoId: number): { [key: string]: ReactElement } => ({
  'informacoes-gerais': <InformacoesGeraisTab formacaoId={formacaoId} />,
  'modulos': <ModulosTab formacaoId={formacaoId} />,
  'aulas': <AulasTab formacaoId={formacaoId} />,
  'blocos': <BlocosTab formacaoId={formacaoId} />,
  'clientes': <ClientesTab formacaoId={formacaoId} />
})

export default function CreateFormacaoPage() {
  return <FormacaoSettings tabContentList={tabContentList(0)} formacaoId={0} />
}
