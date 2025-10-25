// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import AdminStatisticsCard from '@views/apps/admin/dashboard/AdminStatisticsCard'
import GruposMaisUtilizadores from '@views/apps/admin/dashboard/GruposMaisUtilizadores'
import PermissoesPorModulo from '@views/apps/admin/dashboard/PermissoesPorModulo'
import UtilizadoresRecentes from '@views/apps/admin/dashboard/UtilizadoresRecentes'
import AtividadeLogin from '@views/apps/admin/dashboard/AtividadeLogin'
import UtilizadoresPorMes from '@views/apps/admin/dashboard/UtilizadoresPorMes'

const AdminDashboard = async () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <AdminStatisticsCard />
      </Grid>
      <Grid size={{ xs: 12, lg: 8 }}>
        <UtilizadoresPorMes />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <GruposMaisUtilizadores />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <PermissoesPorModulo />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <UtilizadoresRecentes />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <AtividadeLogin />
      </Grid>
    </Grid>
  )
}

export default AdminDashboard
