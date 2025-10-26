// Next Imports
import { headers } from 'next/headers'
import type { Metadata } from 'next'

// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

// Third-party Imports
// @ts-ignore
import 'react-perfect-scrollbar/dist/css/styles.css'
import { getServerSession } from 'next-auth'

// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'

// Component Imports

// HOC Imports
import TranslationWrapper from '@/hocs/TranslationWrapper'

// Config Imports
import { i18n } from '@configs/i18n'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Style Imports
// @ts-ignore
import '@/app/globals.css'

// Generated Icon CSS Imports
// @ts-ignore
import '@assets/iconify-icons/generated-icons.css'

import { Providers } from '../providers'
import { getLocaleParams } from '@/utils/i18n'

export async function generateMetadata(): Promise<Metadata> {
  const session = await getServerSession()
  const tenantName = session?.tenant?.nome || 'Nautis'

  return {
    title: `${tenantName} - CEO`,
    description: 'Nautis CEO - by Nautis Navigate. Create. Inspire.',
  }
}

const RootLayout = async (props: ChildrenType & { params: Promise<{ lang: string }> }) => {

  const { lang } = await getLocaleParams(props.params)

  const { children } = props

  // Vars
  const headersList = await headers()
  const systemMode = await getSystemMode()
  const direction = i18n.langDirection[lang]

  return (
    <TranslationWrapper headersList={headersList} lang={lang}>
      <html id='__next' lang={lang} dir={direction} suppressHydrationWarning>
        <body className='flex is-full min-bs-full flex-auto flex-col'>
          <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
          <Providers>{children}</Providers>
        </body>
      </html>
    </TranslationWrapper>
  )
}

export default RootLayout
