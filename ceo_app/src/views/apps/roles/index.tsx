// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import RoleCardsWithData from './RoleCardsWithData'
import RolesTableNew from './RolesTableNew'

const Roles = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <RoleCardsWithData />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <RolesTableNew />
      </Grid>
    </Grid>
  )
}

export default Roles
