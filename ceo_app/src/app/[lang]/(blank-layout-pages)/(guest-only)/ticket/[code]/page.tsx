// Next Imports
import type { Metadata } from 'next'

// Component Imports
import TicketDetailsView from '@views/TicketDetails'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getDictionary } from '@/utils/getDictionary'
import { getLocaleParams } from '@/utils/i18n'

const TicketDetailsPage = async (props: { params: Promise<{ lang: string; code: string }> }) => {
    // Vars
    const mode = await getServerMode()
    const params = await props.params
    const { lang } = await getLocaleParams(props.params)
    const dictionary = await getDictionary(lang)
    const code = params.code

    return <TicketDetailsView mode={mode} code={code} dictionary={dictionary} />
}

export default TicketDetailsPage
