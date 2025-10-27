// Next Imports
import type { Metadata } from 'next'

// Component Imports
import Login from '@views/Login'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getDictionary } from '@/utils/getDictionary'
import { getLocaleParams } from '@/utils/i18n'


export const metadata: Metadata = {
  title: 'Login - CEO',
  description: 'Login to your CEO account to access the dashboard and manage your content.',
}

const LoginPage = async (props: { params: Promise<{ lang: string }> }) => {
  // Vars
  const mode = await getServerMode()
  const { lang } = await getLocaleParams(props.params)
  const dictionary = await getDictionary(lang)

  return <Login mode={mode} dictionary={dictionary} />
}

export default LoginPage
