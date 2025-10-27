'use client'

import { useFormContext, Controller } from 'react-hook-form'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'

type Props = {
  viewOnly: boolean
}

const IntervencaoDetalhes = ({ viewOnly }: Props) => {
  const { control } = useFormContext()

  return (
    <Card>
      <CardHeader title='Detalhes Técnicos' />
      <CardContent>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12 }}>
            <Controller
              name='descricao'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={4}
                  label='Descrição'
                  placeholder='Descreva os detalhes da intervenção...'
                  disabled={viewOnly}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Controller
              name='diagnostico'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={3}
                  label='Diagnóstico'
                  placeholder='Diagnóstico do problema identificado...'
                  disabled={viewOnly}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Controller
              name='solucao'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={3}
                  label='Solução Aplicada'
                  placeholder='Descreva a solução implementada...'
                  disabled={viewOnly}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Controller
              name='observacoes'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={3}
                  label='Observações'
                  placeholder='Observações adicionais...'
                  disabled={viewOnly}
                />
              )}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default IntervencaoDetalhes
