import type { Metadata } from 'next'

// Component Imports
import TicketLookup from '@views/TicketLookup'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getDictionary } from '@/utils/getDictionary'
import { getLocaleParams } from '@/utils/i18n'

export const metadata: Metadata = {
    title: 'Consulta de Ticket - CEO',
    description: 'Consulte o estado do seu ticket inserindo o código',
}

const TicketLookupPage = async (props: { params: Promise<{ lang: string }> }) => {
    // Vars
    const mode = await getServerMode()
    const { lang } = await getLocaleParams(props.params)
    const dictionary = await getDictionary(lang)

    return <TicketLookup mode={mode} dictionary={dictionary} />
}

export default TicketLookupPage  