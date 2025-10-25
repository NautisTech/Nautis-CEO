// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import FuncionarioListTable from '@views/apps/funcionarios/list/FuncionarioListTable'
import FuncionarioCard from '@views/apps/funcionarios/list/FuncionarioCard'

// Type Imports
import { getDictionary } from '@/utils/getDictionary'

const FuncionarioList = async ({ params, searchParams }: {
  params: Promise<{ lang?: string }>
  searchParams: Promise<{ tipo?: string }>
}) => {
  // Vars
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const locale = resolvedParams?.lang
  const tipo = resolvedSearchParams?.tipo
  const dictionary = await getDictionary((locale?.toString() as 'pt' | 'en' | 'de' | 'es' | 'fr' | 'it' | 'mn') || 'pt')

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <FuncionarioCard dictionary={dictionary} tipo={tipo} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FuncionarioListTable dictionary={dictionary} tipo={tipo} />
      </Grid>
    </Grid>
  )
}

export default FuncionarioList
