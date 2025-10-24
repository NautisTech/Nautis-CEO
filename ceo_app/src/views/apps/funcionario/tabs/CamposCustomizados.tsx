'use client'

// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import Chip from '@mui/material/Chip'

// Types
import type { CampoCustomizado } from '@/libs/api/funcionarios/types'

interface CamposCustomizadosProps {
  campos: CampoCustomizado[]
}

const CamposCustomizados = ({ campos }: CamposCustomizadosProps) => {
  if (!campos || campos.length === 0) {
    return null
  }

  const getValorFormatado = (campo: CampoCustomizado) => {
    switch (campo.tipo_dados) {
      case 'text':
      case 'textarea':
      case 'email':
      case 'phone':
      case 'url':
        return campo.valor_texto || '-'

      case 'number':
      case 'decimal':
        return campo.valor_numero !== null && campo.valor_numero !== undefined
          ? campo.valor_numero.toLocaleString('pt-PT')
          : '-'

      case 'date':
        return campo.valor_data
          ? new Date(campo.valor_data).toLocaleDateString('pt-PT')
          : '-'

      case 'datetime':
        return campo.valor_datetime
          ? new Date(campo.valor_datetime).toLocaleString('pt-PT')
          : '-'

      case 'boolean':
        return campo.valor_boolean !== null && campo.valor_boolean !== undefined
          ? (
              <Chip
                label={campo.valor_boolean ? 'Sim' : 'Não'}
                size='small'
                color={campo.valor_boolean ? 'success' : 'error'}
                variant='tonal'
              />
            )
          : '-'

      case 'json':
        return campo.valor_json
          ? <code className='text-xs'>{JSON.stringify(campo.valor_json)}</code>
          : '-'

      default:
        return '-'
    }
  }

  return (
    <>
      <Typography variant='h6' className='mbs-6 mbe-4'>Campos Personalizados</Typography>
      <Grid container spacing={4}>
        {campos.map((campo) => (
          <Grid key={campo.id} size={{ xs: 12, md: 6 }}>
            <Typography variant='subtitle2' color='text.secondary'>
              {campo.nome_campo}
            </Typography>
            <Typography variant='body1' component='div'>
              {getValorFormatado(campo)}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default CamposCustomizados
