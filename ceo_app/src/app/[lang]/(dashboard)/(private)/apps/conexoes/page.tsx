// Component Imports
import { getDictionary } from '@/utils/getDictionary'
import { getLocaleParams } from '@/utils/i18n'
import Connections from '@/views/pages/account-settings/connections'

const ConexoesPage = async (props: { params: Promise<{ lang: string }> }) => {
  const { lang } = await getLocaleParams(props.params)
  const dictionary = await getDictionary(lang)

  return <Connections dictionary={dictionary} />
}

export default ConexoesPage
