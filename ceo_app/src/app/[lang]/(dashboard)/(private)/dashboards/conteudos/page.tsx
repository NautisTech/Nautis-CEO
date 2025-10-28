// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import ConteudosStatisticsCard from '@views/apps/conteudos/dashboard/ConteudosStatisticsCard'
import ConteudosPorTipo from '@views/apps/conteudos/dashboard/ConteudosPorTipo'
import ConteudosPorCategoria from '@views/apps/conteudos/dashboard/ConteudosPorCategoria'
import ConteudosMaisVisualizados from '@views/apps/conteudos/dashboard/ConteudosMaisVisualizados'
import AtividadeRecente from '@views/apps/conteudos/dashboard/AtividadeRecente'
import VisualizacoesPorDia from '@views/apps/conteudos/dashboard/VisualizacoesPorDia'
import TopAutores from '@views/apps/conteudos/dashboard/TopAutores'
import VisualizacoesPorTipo from '@views/apps/conteudos/dashboard/VisualizacoesPorTipo'
import { getDictionary } from '@/utils/getDictionary'
import { getLocaleParams } from '@/utils/i18n'

const ConteudosDashboard = async ({ params }: { params: Promise<{ lang?: string }> }) => {
  const { lang } = await getLocaleParams(params as Promise<{ lang: string }>)
  const dictionary = await getDictionary(lang)

  return (
    <Grid container spacing={6}>
      {/* Statistics Cards - Full Width */}
      <Grid size={{ xs: 12 }}>
        <ConteudosStatisticsCard dictionary={dictionary} />
      </Grid>

      {/* Top Row - Main Widgets */}
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ConteudosPorTipo dictionary={dictionary} />
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ConteudosPorCategoria dictionary={dictionary} />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <TopAutores dictionary={dictionary} />
      </Grid>

      {/* Middle Row - Charts */}
      <Grid size={{ xs: 12 }}>
        <VisualizacoesPorDia dictionary={dictionary} lang={lang} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ConteudosMaisVisualizados dictionary={dictionary} />
      </Grid>

      {/* Bottom Row - Details */}
      <Grid size={{ xs: 12 }}>
        <VisualizacoesPorTipo dictionary={dictionary} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <AtividadeRecente dictionary={dictionary} lang={lang} />
      </Grid>
    </Grid>
  )
}

export default ConteudosDashboard
