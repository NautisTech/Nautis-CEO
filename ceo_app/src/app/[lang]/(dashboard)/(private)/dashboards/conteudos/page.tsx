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

const ConteudosDashboard = async () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ConteudosStatisticsCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6, xl: 4 }}>
        <ConteudosPorTipo />
      </Grid>
      <Grid size={{ xs: 12, md: 6, xl: 4 }}>
        <ConteudosPorCategoria />
      </Grid>
      <Grid size={{ xs: 12, xl: 4 }}>
        <TopAutores />
      </Grid>
      <Grid size={{ xs: 12, lg: 8 }}>
        <VisualizacoesPorDia />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <ConteudosMaisVisualizados />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <AtividadeRecente />
      </Grid>
    </Grid>
  )
}

export default ConteudosDashboard
