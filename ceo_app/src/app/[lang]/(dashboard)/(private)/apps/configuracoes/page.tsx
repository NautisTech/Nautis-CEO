// Component Imports
import Configuracoes from '@views/apps/configuracoes'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getDictionary } from '@/utils/getDictionary'
import { getLocaleParams } from '@/utils/i18n'

const ConfiguracoesPage = async (props: { params: Promise<{ lang: string }> }) => {
  const { lang } = await getLocaleParams(props.params)
  const dictionary = await getDictionary(lang)
  
  return <Configuracoes dictionary={dictionary} />
}

export default ConfiguracoesPage
