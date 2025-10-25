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
const tabContentList = (funcionarioId: number): { [key: string]: ReactElement } => ({
  'dados-pessoais': <DadosPessoaisTab funcionarioId={funcionarioId} />,
  'contatos': <ContatosTab funcionarioId={funcionarioId} />,
  'enderecos': <EnderecosTab funcionarioId={funcionarioId} />,
  'empregos': <EmpregosTab funcionarioId={funcionarioId} />,
  'beneficios': <BeneficiosTab funcionarioId={funcionarioId} />,
  'documentos': <DocumentosTab funcionarioId={funcionarioId} />
})

const FuncionarioPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await params
  const funcionarioId = resolvedParams.id === 'create' ? 0 : parseInt(resolvedParams.id)

  return <FuncionarioSettings tabContentList={tabContentList(funcionarioId)} funcionarioId={funcionarioId} />
}

export default FuncionarioPage
