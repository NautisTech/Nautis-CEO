// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import UserListTableV2 from './UserListTableV2'
import UserListCards from './UserListCards'

const UserList = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <UserListCards />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <UserListTableV2 />
      </Grid>
    </Grid>
  )
}

export default UserList
