// Next Imports
import type { Metadata } from 'next'

// Component Imports
import LoginFornecedor from '@views/LoginFornecedor'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getDictionary } from '@/utils/getDictionary'
import { getLocaleParams } from '@/utils/i18n'


export const metadata: Metadata = {
  title: 'Portal de Fornecedores - Login',
  description: 'Aceda ao portal de fornecedores para gerir as suas informações.',
}

const LoginFornecedorPage = async (props: { params: Promise<{ lang: string }> }) => {
  // Vars
  const mode = await getServerMode()
  const { lang } = await getLocaleParams(props.params)
  const dictionary = await getDictionary(lang)

  return <LoginFornecedor mode={mode} dictionary={dictionary} />
}

export default LoginFornecedorPage
