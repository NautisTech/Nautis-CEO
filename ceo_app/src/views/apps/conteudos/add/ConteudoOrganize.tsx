'use client'

import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import Autocomplete from '@mui/material/Autocomplete'

import CustomTextField from '@core/components/mui/TextField'
import { useCategorias, useTags } from '@/libs/api/conteudos'

type Props = {
  tipo: string
  id: number | null
  viewOnly: boolean
}

const ConteudoOrganize = ({ tipo, id, viewOnly }: Props) => {
  const { control } = useFormContext()
  const { data: categorias } = useCategorias()
  const { data: tagsData } = useTags()

  return (
    <Card>
      <CardHeader title='Organização' />
      <CardContent className='flex flex-col gap-6'>
        <Controller
          name='categoriaId'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              value={field.value || ''}
              select
              fullWidth
              label='Categoria'
              disabled={viewOnly}
            >
              <MenuItem value=''>Selecione uma categoria</MenuItem>
              {categorias?.map(categoria => (
                <MenuItem key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </MenuItem>
              ))}
            </CustomTextField>
          )}
        />

        <Controller
          name='tags'
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              multiple
              options={tagsData?.map(t => t.nome) || []}
              value={field.value || []}
              freeSolo
              disabled={viewOnly}
              onChange={(_, value) => field.onChange(value || [])}
              renderTags={(value: string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                    size='small'
                  />
                ))
              }
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label='Tags'
                  placeholder='Digite e pressione Enter'
                />
              )}
            />
          )}
        />

        <Controller
          name='metaTitle'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              value={field.value || ''}
              fullWidth
              label='Meta Title (SEO)'
              placeholder='Título para SEO'
              disabled={viewOnly}
            />
          )}
        />

        <Controller
          name='metaDescription'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              value={field.value || ''}
              fullWidth
              label='Meta Description (SEO)'
              placeholder='Descrição para SEO'
              multiline
              rows={3}
              disabled={viewOnly}
            />
          )}
        />

        <Controller
          name='metaKeywords'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              value={field.value || ''}
              fullWidth
              label='Meta Keywords (SEO)'
              placeholder='palavras, chave, separadas, por, vírgula'
              disabled={viewOnly}
            />
          )}
        />
      </CardContent>
    </Card>
  )
}

export default ConteudoOrganize