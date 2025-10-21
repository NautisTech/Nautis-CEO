// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import ConteudoListTable from '@views/apps/conteudos/list/ConteudoListTable'
import ConteudoCard from '@views/apps/conteudos/list/ConteudoCard'

// Type Imports
import { getDictionary } from '@/utils/getDictionary'


const ConteudoList = async ({ params }: { params: Promise<{ lang?: string; tipo?: string }> }) => {
  // Vars
  const resolvedParams = await params
  const locale = resolvedParams?.lang
  const tipo = resolvedParams?.tipo
  const dictionary = await getDictionary((locale?.toString() as 'pt' | 'en' | 'de' | 'es' | 'fr' | 'it' | 'mn') || 'pt')

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ConteudoCard dictionary={dictionary} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ConteudoListTable dictionary={dictionary} tipo={tipo!} />
      </Grid>
    </Grid>
  )
}

export default ConteudoList
