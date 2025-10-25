// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import HomeDashboard from '@views/dashboards/home'

const HomePage = async () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <HomeDashboard />
      </Grid>
    </Grid>
  )
}

export default HomePage
