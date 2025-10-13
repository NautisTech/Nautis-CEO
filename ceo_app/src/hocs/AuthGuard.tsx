// Third-party Imports
import { getServerSession } from 'next-auth'

// Type Imports
import type { Locale } from '@configs/i18n'
import type { ChildrenType } from '@core/types'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'

export default async function AuthGuard({ children, locale }: ChildrenType & { locale: Locale }) {

  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true') {
    return <>{children}</>
  }


  const session = await getServerSession()
  return <>{session ? children : <AuthRedirect lang={locale} />}</>
}
