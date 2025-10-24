'use client'

// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'

// Component Imports
import CamposCustomizados from './CamposCustomizados'

// Types
import type { FuncionarioDetalhado } from '@/libs/api/funcionarios/types'

interface DadosPessoaisProps {
  funcionario: FuncionarioDetalhado
  onUpdate: () => void
}

const DadosPessoais = ({ funcionario, onUpdate }: DadosPessoaisProps) => {
  return (
    <>
      <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant='subtitle2' color='text.secondary'>Nome Completo</Typography>
        <Typography variant='body1'>{funcionario.nome}</Typography>
      </Grid>

      {funcionario.email && (
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant='subtitle2' color='text.secondary'>Email</Typography>
          <Typography variant='body1'>{funcionario.email}</Typography>
        </Grid>
      )}

      {funcionario.telefone && (
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant='subtitle2' color='text.secondary'>Telefone</Typography>
          <Typography variant='body1'>{funcionario.telefone}</Typography>
        </Grid>
      )}

      {funcionario.data_nascimento && (
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant='subtitle2' color='text.secondary'>Data de Nascimento</Typography>
          <Typography variant='body1'>
            {new Date(funcionario.data_nascimento).toLocaleDateString('pt-PT')}
          </Typography>
        </Grid>
      )}

      {funcionario.nif && (
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant='subtitle2' color='text.secondary'>NIF</Typography>
          <Typography variant='body1'>{funcionario.nif}</Typography>
        </Grid>
      )}

      {funcionario.numero_seguranca_social && (
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant='subtitle2' color='text.secondary'>Número Segurança Social</Typography>
          <Typography variant='body1'>{funcionario.numero_seguranca_social}</Typography>
        </Grid>
      )}

      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant='subtitle2' color='text.secondary'>Data de Admissão</Typography>
        <Typography variant='body1'>
          {new Date(funcionario.data_admissao).toLocaleDateString('pt-PT')}
        </Typography>
      </Grid>

      {funcionario.data_saida && (
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant='subtitle2' color='text.secondary'>Data de Saída</Typography>
          <Typography variant='body1'>
            {new Date(funcionario.data_saida).toLocaleDateString('pt-PT')}
          </Typography>
        </Grid>
      )}

      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant='subtitle2' color='text.secondary'>Status</Typography>
        <Chip
          label={funcionario.ativo ? 'Ativo' : 'Inativo'}
          color={funcionario.ativo ? 'success' : 'error'}
          size='small'
        />
      </Grid>
    </Grid>

    {funcionario.camposCustomizados && funcionario.camposCustomizados.length > 0 && (
      <>
        <Divider className='my-6' />
        <CamposCustomizados campos={funcionario.camposCustomizados} />
      </>
    )}
  </>
  )
}

export default DadosPessoais
