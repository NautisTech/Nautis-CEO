import { redirect } from 'next/navigation'

// Component Imports
import ConteudoForm from '@views/apps/conteudos/add/ConteudoForm'

type PageProps = {
  params: Promise<{
    tipo: string
    action: 'add' | 'edit' | 'view'
    params?: string[]
  }>
}

const ConteudoAddEditPage = async (props: PageProps) => {
  const params = await props.params
  const { tipo, action, params: routeParams } = params

  // Extrair ID dos parâmetros
  const id = routeParams?.[0] ? parseInt(routeParams[0]) : null
  const viewOnly = action === 'view'

  // Validações
  if ((action === 'edit' || action === 'view') && !id) {
    redirect(`/apps/conteudos/${tipo}/add`)
  }

  return <ConteudoForm tipo={tipo} id={id} viewOnly={viewOnly} isEdit={action === 'edit'} />
}

export default ConteudoAddEditPage