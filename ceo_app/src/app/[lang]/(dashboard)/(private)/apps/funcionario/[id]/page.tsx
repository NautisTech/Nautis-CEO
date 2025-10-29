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
const tabContentList = (funcionarioId: number, isPreview: boolean): { [key: string]: ReactElement } => ({
  'dados-pessoais': <DadosPessoaisTab funcionarioId={funcionarioId} isPreview={isPreview} />,
  'contatos': <ContatosTab funcionarioId={funcionarioId} isPreview={isPreview} />,
  'enderecos': <EnderecosTab funcionarioId={funcionarioId} isPreview={isPreview} />,
  'empregos': <EmpregosTab funcionarioId={funcionarioId} isPreview={isPreview} />,
  'beneficios': <BeneficiosTab funcionarioId={funcionarioId} isPreview={isPreview} />,
  'documentos': <DocumentosTab funcionarioId={funcionarioId} isPreview={isPreview} />
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
  const isPreview = resolvedSearchParams.edit !== 'true' && funcionarioId !== 0

  return <FuncionarioSettings tabContentList={tabContentList(funcionarioId, isPreview)} funcionarioId={funcionarioId} />
}

export default FuncionarioPage
