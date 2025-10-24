// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'

// Component Imports
import UserEdit from '@/views/apps/user/edit'

const UserEditPage = async ({ params }: { params: { lang: string; id: string } }) => {
  // Vars
  const dictionary = await getDictionary(params.lang)

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <UserEdit userId={parseInt(params.id)} dictionary={dictionary} />
      </Grid>
    </Grid>
  )
}

export default UserEditPage
