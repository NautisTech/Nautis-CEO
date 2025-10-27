// MUI Imports
import Button from '@mui/material/Button'

// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'

// Layout Imports
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'
import HorizontalLayout from '@layouts/HorizontalLayout'

// Component Imports
import Providers from '@components/Providers'
import PortalNavigation from '@components/layout/vertical/PortalNavigation'
import Header from '@components/layout/horizontal/Header'
import Navbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'
import HorizontalFooter from '@components/layout/horizontal/Footer'
import Customizer from '@core/components/customizer'
import ScrollToTop from '@core/components/scroll-to-top'

// Config Imports
import { i18n } from '@configs/i18n'

// Util Imports
import { getDictionary } from '@/utils/getDictionary'
import { getMode, getSystemMode } from '@core/utils/serverHelpers'
import { ProtectedRoute } from '@/components/layout/shared/ProtectedRoute'
import { getLocaleParams } from '@/utils/i18n'

const PortalLayout = async (props: ChildrenType & { params: Promise<{ lang: string }> }) => {
  const { lang } = await getLocaleParams(props.params)
  const { children } = props

  // Vars
  const dictionary = await getDictionary(lang)
  const direction = i18n.langDirection[lang]
  const mode = await getMode()
  const systemMode = await getSystemMode()

  return (
    <ProtectedRoute requiredUserType="cliente">
      <Providers direction={direction}>
        <LayoutWrapper
          systemMode={systemMode}
          verticalLayout={
            <VerticalLayout
              navigation={<PortalNavigation dictionary={dictionary} mode={mode} />}
              navbar={<Navbar dictionary={dictionary} />}
              footer={<VerticalFooter />}
            >
              {children}
            </VerticalLayout>
          }
          horizontalLayout={
            <HorizontalLayout header={<Header dictionary={dictionary} />} footer={<HorizontalFooter />}>
              {children}
            </HorizontalLayout>
          }
        />
        <ScrollToTop className='mui-fixed'>
          <Button
            variant='contained'
            className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
          >
            <i className='tabler-arrow-up' />
          </Button>
        </ScrollToTop>
        <Customizer dir={direction} dictionary={dictionary} />
      </Providers>
    </ProtectedRoute>
  )
}

export default PortalLayout
