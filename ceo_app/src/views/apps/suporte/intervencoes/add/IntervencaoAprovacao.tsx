'use client'

import { useFormContext, Controller } from 'react-hook-form'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

type Props = {
  viewOnly: boolean
  intervencaoData?: any
}

const IntervencaoAprovacao = ({ viewOnly, intervencaoData }: Props) => {
  const { control, watch } = useFormContext()

  const precisaAprovacao = watch('precisa_aprovacao_cliente')
  const aprovacaoCliente = watch('aprovacao_cliente')
  const dataAprovacao = watch('data_aprovacao')

  return (
    <Card>
      <CardHeader
        title='Aprovação do Cliente'
        action={
          intervencaoData?.precisa_aprovacao_cliente && !intervencaoData?.aprovacao_cliente ? (
            <Chip label='Aguardando Aprovação' color='warning' size='small' />
          ) : intervencaoData?.aprovacao_cliente ? (
            <Chip label='Aprovado' color='success' size='small' />
          ) : null
        }
      />
      <CardContent>
        <Grid container spacing={4}>
          {intervencaoData?.precisa_aprovacao_cliente && !intervencaoData?.aprovacao_cliente && (
            <Grid size={{ xs: 12 }}>
              <Alert severity='warning'>
                <Typography variant='body2'>
                  <strong>Atenção:</strong> Esta intervenção aguarda aprovação do cliente. Enquanto não for aprovada, não poderá ser editada ou concluída.
                </Typography>
              </Alert>
            </Grid>
          )}

          {intervencaoData?.aprovacao_cliente && intervencaoData?.data_aprovacao && (
            <Grid size={{ xs: 12 }}>
              <Alert severity='success'>
                <Typography variant='body2'>
                  <strong>Aprovado:</strong> Cliente aprovou esta intervenção em {new Date(intervencaoData.data_aprovacao).toLocaleString('pt-PT')}
                </Typography>
              </Alert>
            </Grid>
          )}

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name='precisa_aprovacao_cliente'
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value || false}
                      disabled={viewOnly || (intervencaoData && intervencaoData.aprovacao_cliente)}
                    />
                  }
                  label='Precisa de aprovação do cliente'
                />
              )}
            />
          </Grid>

          {precisaAprovacao && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='aprovacao_cliente'
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value || false}
                        disabled={viewOnly}
                      />
                    }
                    label='Cliente aprovou'
                  />
                )}
              />
            </Grid>
          )}

          {!intervencaoData && precisaAprovacao && (
            <Grid size={{ xs: 12 }}>
              <Alert severity='info'>
                <Typography variant='body2'>
                  Ao marcar que precisa de aprovação, esta intervenção ficará bloqueada para edição e conclusão até que o cliente aprove.
                </Typography>
              </Alert>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default IntervencaoAprovacao
