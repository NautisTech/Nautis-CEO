// MUI Imports
import Grid from '@mui/material/Grid2'
import { getDictionary } from '@/utils/getDictionary'

// Component Imports
import HomeDashboard from '@views/dashboards/home'

const HomePage = async ({ params }: { params: Promise<{ lang?: string }> }) => {
  const resolvedParams = await params
  const locale = resolvedParams?.lang
  const dictionary = await getDictionary((locale?.toString() as 'pt' | 'en' | 'de' | 'es' | 'fr' | 'it' | 'ar') || 'pt')

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <HomeDashboard dictionary={dictionary} />
      </Grid>
    </Grid>
  )
}

export default HomePage
