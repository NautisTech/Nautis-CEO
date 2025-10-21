// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'

// Config Imports
import { i18n } from '@configs/i18n'
import { getDictionary } from '@/utils/getDictionary'


// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'
import { getLocaleParams } from '@/utils/i18n'

const Layout = async ({ children, params }: ChildrenType & { params: Promise<{ lang: string }> }) => {

  // Vars
  const { lang } = await getLocaleParams(params)
  const direction = i18n.langDirection[lang]
  const systemMode = await getSystemMode()

  return (
    <Providers direction={direction}>
      <BlankLayout systemMode={systemMode}>{children}</BlankLayout>
    </Providers>
  )
}

export default Layout
