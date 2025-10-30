// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import FuncionarioSettings from '@views/apps/funcionario/FuncionarioSettings'

const DadosPessoaisTab = dynamic(() => import('@views/apps/funcionario/dados-pessoais'))
const ContatosTab = dynamic(() => import('@views/apps/funcionario/contatos'))
const EnderecosTab = dynamic(() => import('@views/apps/funcionario/enderecos'))
const EmpregosTab = dynamic(() => import('@views/apps/funcionario/empregos'))
const BeneficiosTab = dynamic(() => import('@views/apps/funcionario/beneficios'))
const DocumentosTab = dynamic(() => import('@views/apps/funcionario/documentos'))

// Vars
const tabContentList = (funcionarioId: number, viewOnly: boolean): { [key: string]: ReactElement } => ({
  'dados-pessoais': <DadosPessoaisTab funcionarioId={funcionarioId} viewOnly={viewOnly} />,
  'contatos': <ContatosTab funcionarioId={funcionarioId} viewOnly={viewOnly} />,
  'enderecos': <EnderecosTab funcionarioId={funcionarioId} viewOnly={viewOnly} />,
  'empregos': <EmpregosTab funcionarioId={funcionarioId} viewOnly={viewOnly} />,
  'beneficios': <BeneficiosTab funcionarioId={funcionarioId} viewOnly={viewOnly} />,
  'documentos': <DocumentosTab funcionarioId={funcionarioId} viewOnly={viewOnly} />
})

const FuncionarioPage = async ({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ edit?: string }>
}) => {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const funcionarioId = resolvedParams.id === 'create' ? 0 : parseInt(resolvedParams.id)
  const viewOnly = resolvedSearchParams.edit !== 'true' && funcionarioId !== 0

  return <FuncionarioSettings tabContentList={tabContentList(funcionarioId, viewOnly)} funcionarioId={funcionarioId} viewOnly={viewOnly} />
}

export default FuncionarioPage
