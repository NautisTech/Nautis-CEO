'use client'

import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import CustomTextField from '@core/components/mui/TextField'
import { useConteudo } from '@/libs/api/conteudos'
import { StatusConteudo } from '@/libs/api/conteudos/types'

type Props = {
  id: number | null
  viewOnly: boolean
}

const ConteudoSettings = ({ id, viewOnly }: Props) => {
  const { control } = useFormContext()

  return (
    <Card>
      <CardHeader title='Configurações' />
      <CardContent className='flex flex-col gap-4'>
        <Controller
          name='status'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              select
              fullWidth
              label='Status'
              disabled={viewOnly}
            >
              <MenuItem value={StatusConteudo.RASCUNHO}>Rascunho</MenuItem>
              <MenuItem value={StatusConteudo.EM_REVISAO}>Em Revisão</MenuItem>
              <MenuItem value={StatusConteudo.AGENDADO}>Agendado</MenuItem>
              <MenuItem value={StatusConteudo.PUBLICADO}>Publicado</MenuItem>
              <MenuItem value={StatusConteudo.ARQUIVADO}>Arquivado</MenuItem>
            </CustomTextField>
          )}
        />

        <Divider />

        <Controller
          name='destaque'
          control={control}
          render={({ field }) => (
            <div className='flex items-center justify-between'>
              <Typography>Destacar conteúdo</Typography>
              <Switch
                checked={field.value || false}
                onChange={field.onChange}
                disabled={viewOnly}
              />
            </div>
          )}
        />

        <Controller
          name='permiteComentarios'
          control={control}
          render={({ field }) => (
            <div className='flex items-center justify-between'>
              <Typography>Permitir comentários</Typography>
              <Switch
                checked={field.value || false}
                onChange={field.onChange}
                disabled={viewOnly}
              />
            </div>
          )}
        />

        <Divider />

        <Controller
          name='dataInicio'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              value={field.value || ''}
              fullWidth
              type='datetime-local'
              label='Data de Início'
              disabled={viewOnly}
              slotProps={{
                inputLabel: { shrink: true }
              }}
            />
          )}
        />

        <Controller
          name='dataFim'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              value={field.value || ''}
              fullWidth
              type='datetime-local'
              label='Data de Fim'
              disabled={viewOnly}
              slotProps={{
                inputLabel: { shrink: true }
              }}
            />
          )}
        />
      </CardContent>
    </Card>
  )
}

export default ConteudoSettings