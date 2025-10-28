// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import AdminStatisticsCard from '@views/apps/admin/dashboard/AdminStatisticsCard'
import GruposMaisUtilizadores from '@views/apps/admin/dashboard/GruposMaisUtilizadores'
import PermissoesPorModulo from '@views/apps/admin/dashboard/PermissoesPorModulo'
import UtilizadoresRecentes from '@views/apps/admin/dashboard/UtilizadoresRecentes'
import AtividadeLogin from '@views/apps/admin/dashboard/AtividadeLogin'
import UtilizadoresPorMes from '@views/apps/admin/dashboard/UtilizadoresPorMes'
import { getDictionary } from '@/utils/getDictionary'
import { getLocaleParams } from '@/utils/i18n'

const AdminDashboard = async ({ params }: { params: Promise<{ lang?: string }> }) => {
  const { lang } = await getLocaleParams(params as Promise<{ lang: string }>)
  const dictionary = await getDictionary(lang)

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <AdminStatisticsCard dictionary={dictionary} />
      </Grid>
      <Grid size={{ xs: 12, lg: 8 }}>
        <UtilizadoresPorMes dictionary={dictionary} />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <GruposMaisUtilizadores dictionary={dictionary} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <PermissoesPorModulo dictionary={dictionary} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <UtilizadoresRecentes dictionary={dictionary} lang={lang} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <AtividadeLogin dictionary={dictionary} lang={lang} />
      </Grid>
    </Grid>
  )
}

export default AdminDashboard
