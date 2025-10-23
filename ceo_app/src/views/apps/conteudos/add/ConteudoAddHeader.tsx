'use client'

import { useFormContext } from 'react-hook-form'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useConteudo } from '@/libs/api/conteudos'
import { getDictionary } from '@/utils/getDictionary'

type Props = {
  tipo: string
  id: number | null
  viewOnly: boolean
  isEdit: boolean
  onDiscard: () => void
  onSaveDraft: () => void
  onPublish: () => void
  onEdit: () => void
  onUpdate: () => void
  dictionary: Awaited<ReturnType<typeof getDictionary>>
}

const ConteudoAddHeader = ({
  tipo,
  id,
  viewOnly,
  isEdit,
  onDiscard,
  onSaveDraft,
  onPublish,
  onEdit,
  onUpdate,
  dictionary
}: Props) => {
  const methods = useFormContext()
  const { data: conteudo } = useConteudo(id || 0, !!id)

  const isSubmitting = methods?.formState?.isSubmitting || false

  return (
    <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
      <div>
        <Typography variant='h4' className='mbe-1'>
          {viewOnly
            ? dictionary['conteudos'].actions.view
            : isEdit
              ? dictionary['conteudos'].actions.edit
              : dictionary['conteudos'].actions.add}
        </Typography>
        <Typography>{conteudo?.titulo || dictionary['conteudos'].labels.new.replace('{{tipo}}', tipo)}</Typography>
      </div>

      <div className='flex flex-wrap max-sm:flex-col gap-4'>
        {viewOnly ? (
          <>
            <Button variant='tonal' color='secondary' onClick={onDiscard}>
              {dictionary.actions.back}
            </Button>
            <Button variant='contained' onClick={onEdit}>
              {dictionary.actions.edit}
            </Button>
          </>
        ) : isEdit ? (
          // Modo Edição
          <>
            <Button variant='tonal' color='secondary' onClick={onDiscard} disabled={isSubmitting}>
              {dictionary.actions.cancel}
            </Button>
            <Button variant='tonal' onClick={onSaveDraft} disabled={isSubmitting}>
              {isSubmitting ? dictionary.actions.saving : dictionary.actions.saveDraft}
            </Button>
            <Button variant='contained' onClick={onUpdate} disabled={isSubmitting}>
              {isSubmitting ? dictionary.actions.updating : dictionary.actions.update}
            </Button>
          </>
        ) : (
          // Modo Criar
          <>
            <Button variant='tonal' color='secondary' onClick={onDiscard} disabled={isSubmitting}>
              {dictionary.actions.discard}
            </Button>
            <Button variant='tonal' onClick={onSaveDraft} disabled={isSubmitting}>
              {isSubmitting ? dictionary.actions.saving : dictionary.actions.saveDraft}
            </Button>
            <Button variant='contained' onClick={onPublish} disabled={isSubmitting}>
              {isSubmitting ? dictionary.actions.publishing : dictionary.actions.publish}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default ConteudoAddHeader
