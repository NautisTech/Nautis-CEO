// MUI Imports
import Grid from '@mui/material/Grid2'


// Component Imports
import UserEdit from '@/views/apps/user/edit'

const UserEditPage = async ({ params }: { params: Promise<{ lang: string; id: string }> }) => {
  // Vars
  const { lang, id } = await params

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <UserEdit userId={parseInt(id)} />
      </Grid>
    </Grid>
  )
}

export default UserEditPage
