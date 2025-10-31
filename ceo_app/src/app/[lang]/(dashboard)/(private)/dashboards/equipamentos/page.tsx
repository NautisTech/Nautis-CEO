// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import EquipamentosStatisticsCard from '@views/dashboards/equipamentos/EquipamentosStatisticsCard'
import EquipamentosPorEstado from '@views/dashboards/equipamentos/EquipamentosPorEstado'
import MarcasDistribution from '@views/dashboards/equipamentos/MarcasDistribution'
import ModelosDistribution from '@views/dashboards/equipamentos/ModelosDistribution'
import EquipamentosComMaisTickets from '@views/dashboards/equipamentos/EquipamentosComMaisTickets'
import { getDictionary } from '@/utils/getDictionary'
import { getLocaleParams } from '@/utils/i18n'

const EquipamentosDashboard = async ({ params }: { params: Promise<{ lang?: string }> }) => {
    const { lang } = await getLocaleParams(params as Promise<{ lang: string }>)
    const dictionary = await getDictionary(lang)

    return (
        <Grid container spacing={6}>
            {/* Statistics Cards - Full Width */}
            <Grid size={{ xs: 12 }}>
                <EquipamentosStatisticsCard dictionary={dictionary} />
            </Grid>

            {/* Top Row - Main Charts */}
            <Grid size={{ xs: 12, md: 6 }}>
                <EquipamentosPorEstado dictionary={dictionary} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <MarcasDistribution />
            </Grid>

            {/* Bottom Row - Details */}
            <Grid size={{ xs: 12, md: 6 }}>
                <ModelosDistribution />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <EquipamentosComMaisTickets />
            </Grid>
        </Grid>
    )
}

export default EquipamentosDashboard
