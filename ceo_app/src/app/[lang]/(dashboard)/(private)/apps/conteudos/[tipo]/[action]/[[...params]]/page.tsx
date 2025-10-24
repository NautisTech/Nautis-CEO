import { redirect } from 'next/navigation'

// Type Imports
import type { Locale } from '@configs/i18n'

// Component Imports
import ConteudoForm from '@views/apps/conteudos/add/ConteudoForm'

// Dictionary
import { getDictionary } from '@/utils/getDictionary'
import { getLocaleParams } from '@/utils/i18n'

type PageProps = {
  params: Promise<{
    lang: string
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

  // Extract locale from route params and load translations for it
  const { lang } = await getLocaleParams(props.params)
  const dictionary = await getDictionary(lang as Locale)

  return <ConteudoForm tipo={tipo} id={id} viewOnly={viewOnly} isEdit={action === 'edit'} dictionary={dictionary} />
}

export default ConteudoAddEditPage