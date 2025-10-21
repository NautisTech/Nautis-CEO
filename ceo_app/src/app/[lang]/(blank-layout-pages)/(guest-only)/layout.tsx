// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'

// Util Imports
import { getLocaleParams } from '@/utils/i18n'

// HOC Imports
import GuestOnlyRoute from '@/hocs/GuestOnlyRoute'

const Layout = async (props: ChildrenType & { params: Promise<{ lang: string }> }) => {

  const { children } = props
  const { lang: locale } = await getLocaleParams(props.params)

  return <GuestOnlyRoute lang={locale}>{children}</GuestOnlyRoute>
}

export default Layout
