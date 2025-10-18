// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import ConteudoListTable from '@views/apps/conteudos/list/ConteudoListTable'
import ConteudoCard from '@views/apps/conteudos/list/ConteudoCard'

// Type Imports
import { getDictionary } from '@/utils/getDictionary'
import { useConteudo, useConteudos } from '@/libs/api/conteudos'
/**
 * ! If you need data using an API call, uncomment the below API code, update the `process.env.API_URL` variable in the
 * ! `.env` file found at root of your project and also update the API endpoints like `/apps/ecommerce` in below example.
 * ! Also, remove the above server action import and the action itself from the `src/app/server/actions.ts` file to clean up unused code
 * ! because we've used the server action for getting our static data.
 */

/* const getEcommerceData = async () => {
  // Vars
  const res = await fetch(`${process.env.API_URL}/apps/ecommerce`)

  if (!res.ok) {
    throw new Error('Failed to fetch ecommerce data')
  }

  return res.json()
} */

const ConteudoList = async ({ params }: { params: { lang?: string; tipo?: string } }) => {
  // Vars
  // const data = getEcommerceData()
  const locale = params?.lang
  const dictionary = await getDictionary((locale?.toString() as 'pt' | 'en' | 'de' | 'es' | 'fr' | 'it' | 'mn') || 'pt')

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ConteudoCard dictionary={dictionary} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ConteudoListTable />
      </Grid>
    </Grid>
  )
}

export default ConteudoList
