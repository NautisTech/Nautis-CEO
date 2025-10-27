// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'

// Component Imports
import UserEdit from '@/views/apps/user/edit'

const UserEditPage = async ({ params }: { params: Promise<{ lang: string; id: string }> }) => {
  // Vars
  const { lang, id } = await params
  const dictionary = await getDictionary(lang)

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <UserEdit userId={parseInt(id)} dictionary={dictionary} />
      </Grid>
    </Grid>
  )
}

export default UserEditPage
