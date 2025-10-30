// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import DadosPessoaisForm from './DadosPessoaisForm'

const DadosPessoais = ({ funcionarioId, viewOnly = false }: { funcionarioId: number; viewOnly?: boolean }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <DadosPessoaisForm funcionarioId={funcionarioId} viewOnly={viewOnly} />
      </Grid>
    </Grid>
  )
}

export default DadosPessoais
