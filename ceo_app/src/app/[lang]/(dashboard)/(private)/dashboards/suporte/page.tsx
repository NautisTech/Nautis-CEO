// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import SuporteStatisticsCard from '@views/dashboards/suporte/SuporteStatisticsCard'
import TicketsPorStatus from '@views/dashboards/suporte/TicketsPorStatus'
import TicketsPorPrioridade from '@views/dashboards/suporte/TicketsPorPrioridade'
import SLACompliance from '@views/dashboards/suporte/SLACompliance'
import TopTecnicos from '@views/dashboards/suporte/TopTecnicos'
import TopClientes from '@views/dashboards/suporte/TopClientes'
import TicketActivity from '@views/dashboards/suporte/TicketActivity'
import TicketsPorDia from '@views/dashboards/suporte/TicketsPorDia'
import { getDictionary } from '@/utils/getDictionary'
import { getLocaleParams } from '@/utils/i18n'

const SuporteDashboard = async ({ params }: { params: Promise<{ lang?: string }> }) => {
    const { lang } = await getLocaleParams(params as Promise<{ lang: string }>)
    const dictionary = await getDictionary(lang)

    return (
        <Grid container spacing={6}>
            {/* Statistics Cards - Full Width */}
            <Grid size={{ xs: 12 }}>
                <SuporteStatisticsCard dictionary={dictionary} />
            </Grid>

            {/* First Row - Main Charts */}
            <Grid size={{ xs: 12, md: 6 }}>
                <TicketsPorStatus dictionary={dictionary} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TicketsPorPrioridade />
            </Grid>

            {/* Second Row - SLA & Lists */}
            <Grid size={{ xs: 12, md: 4 }}>
                <SLACompliance />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <TopTecnicos />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <TopClientes />
            </Grid>

            {/* Third Row - Timeline & Trend */}
            <Grid size={{ xs: 12, md: 6 }}>
                <TicketActivity />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TicketsPorDia />
            </Grid>
        </Grid>
    )
}

export default SuporteDashboard
