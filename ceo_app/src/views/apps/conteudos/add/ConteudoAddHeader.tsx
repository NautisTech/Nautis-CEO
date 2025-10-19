'use client'

import { useFormContext } from 'react-hook-form'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useConteudo } from '@/libs/api/conteudos'

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
  onUpdate
}: Props) => {
  const methods = useFormContext()
  const { data: conteudo } = useConteudo(id || 0, !!id)

  const isSubmitting = methods?.formState?.isSubmitting || false

  return (
    <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
      <div>
        <Typography variant='h4' className='mbe-1'>
          {viewOnly ? 'Visualizar' : isEdit ? 'Editar' : 'Adicionar'} Conteúdo
        </Typography>
        <Typography>{conteudo?.titulo || `Novo conteúdo de ${tipo}`}</Typography>
      </div>

      <div className='flex flex-wrap max-sm:flex-col gap-4'>
        {viewOnly ? (
          <>
            <Button variant='tonal' color='secondary' onClick={onDiscard}>
              Voltar
            </Button>
            <Button variant='contained' onClick={onEdit}>
              Editar
            </Button>
          </>
        ) : isEdit ? (
          // Modo Edição
          <>
            <Button variant='tonal' color='secondary' onClick={onDiscard} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button variant='tonal' onClick={onSaveDraft} disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar como Rascunho'}
            </Button>
            <Button variant='contained' onClick={onUpdate} disabled={isSubmitting}>
              {isSubmitting ? 'Atualizando...' : 'Atualizar'}
            </Button>
          </>
        ) : (
          // Modo Criar
          <>
            <Button variant='tonal' color='secondary' onClick={onDiscard} disabled={isSubmitting}>
              Descartar
            </Button>
            <Button variant='tonal' onClick={onSaveDraft} disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Rascunho'}
            </Button>
            <Button variant='contained' onClick={onPublish} disabled={isSubmitting}>
              {isSubmitting ? 'Publicando...' : 'Publicar'}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default ConteudoAddHeader