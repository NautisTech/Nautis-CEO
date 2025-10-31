// Next Imports
import type { Metadata } from 'next'

// Component Imports
import LoginPortal from '@views/LoginPortal'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getDictionary } from '@/utils/getDictionary'
import { getLocaleParams } from '@/utils/i18n'


export const metadata: Metadata = {
  title: 'Portal do Cliente - Login',
  description: 'Aceda ao portal do cliente para gerir os seus tickets e visualizar informações.',
}

const LoginPortalPage = async (props: { params: Promise<{ lang: string }> }) => {
  // Vars
  const mode = await getServerMode()
  const { lang } = await getLocaleParams(props.params)
  const dictionary = await getDictionary(lang)

  return <LoginPortal mode={mode} dictionary={dictionary} />
}

export default LoginPortalPage
