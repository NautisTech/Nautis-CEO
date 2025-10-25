// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import DadosPessoaisForm from './DadosPessoaisForm'

const DadosPessoais = ({ funcionarioId }: { funcionarioId: number }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <DadosPessoaisForm funcionarioId={funcionarioId} />
      </Grid>
    </Grid>
  )
}

export default DadosPessoais
