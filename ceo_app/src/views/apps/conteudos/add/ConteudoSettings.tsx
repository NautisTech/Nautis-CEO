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
import { getDictionary } from '@/utils/getDictionary'

type Props = {
  id: number | null
  viewOnly: boolean
  dictionary: Awaited<ReturnType<typeof getDictionary>>
}

const ConteudoSettings = ({ id, viewOnly, dictionary }: Props) => {
  const { control } = useFormContext()

  return (
    <Card>
      <CardHeader title={dictionary['conteudos'].labels.settings} />
      <CardContent className='flex flex-col gap-4'>
        <Controller
          name='status'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              select
              fullWidth
              label={dictionary['conteudos'].table.columns.status}
              disabled={viewOnly}
            >
              <MenuItem value={StatusConteudo.PUBLICADO}>{dictionary['conteudos']?.filter.status.published}</MenuItem>
              <MenuItem value={StatusConteudo.RASCUNHO}>{dictionary['conteudos']?.filter.status.draft}</MenuItem>
              <MenuItem value={StatusConteudo.EM_REVISAO}>{dictionary['conteudos']?.filter.status.underReview}</MenuItem>
              <MenuItem value={StatusConteudo.AGENDADO}>{dictionary['conteudos']?.filter.status.scheduled}</MenuItem>
              <MenuItem value={StatusConteudo.ARQUIVADO}>{dictionary['conteudos']?.filter.status.archived}</MenuItem>
            </CustomTextField>
          )}
        />

        <Divider />

        <Controller
          name='destaque'
          control={control}
          render={({ field }) => (
            <div className='flex items-center justify-between'>
              <Typography>{dictionary['conteudos'].actions.featureContent}</Typography>
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
              <Typography>{dictionary['conteudos'].actions.allowComments}</Typography>
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
              label={dictionary['conteudos'].table.columns.startDate}
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
              label={dictionary['conteudos'].table.columns.endDate}
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