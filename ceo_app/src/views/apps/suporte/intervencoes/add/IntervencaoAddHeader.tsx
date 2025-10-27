'use client'

import { useFormContext } from 'react-hook-form'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import type { getDictionary } from '@/utils/getDictionary'

type Props = {
  isEdit: boolean
  viewOnly: boolean
  onDiscard: () => void
  dictionary: Awaited<ReturnType<typeof getDictionary>>
}

const IntervencaoAddHeader = ({ isEdit, viewOnly, onDiscard, dictionary }: Props) => {
  const { formState } = useFormContext()

  return (
    <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
      <div>
        <Typography variant='h4' className='mbe-1'>
          {isEdit ? 'Editar Intervenção' : 'Nova Intervenção'}
        </Typography>
        <Typography>
          {isEdit ? 'Atualize os dados da intervenção' : 'Preencha os dados para registar uma nova intervenção'}
        </Typography>
      </div>
      <div className='flex flex-wrap max-sm:flex-col gap-4'>
        <Button variant='tonal' color='secondary' onClick={onDiscard}>
          Cancelar
        </Button>
        {!viewOnly && (
          <Button type='submit' variant='contained' disabled={formState.isSubmitting}>
            {formState.isSubmitting ? 'A guardar...' : isEdit ? 'Atualizar' : 'Criar Intervenção'}
          </Button>
        )}
      </div>
    </div>
  )
}

export default IntervencaoAddHeader
