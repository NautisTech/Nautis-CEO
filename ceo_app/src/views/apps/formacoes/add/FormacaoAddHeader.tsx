'use client'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import type { Formacao } from '@/libs/api/formacoes'

interface Props {
  formacao: Formacao | null
  onBack: () => void
}

const FormacaoAddHeader = ({ formacao, onBack }: Props) => {
  return (
    <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
      <div>
        <Typography variant='h4' className='mb-1'>
          {formacao ? 'Editar Formação' : 'Criar Nova Formação'}
        </Typography>
        <Typography>
          {formacao ? 'Edite as informações da formação' : 'Preencha as informações para criar uma nova formação'}
        </Typography>
      </div>
      <Button variant='outlined' onClick={onBack}>
        Voltar
      </Button>
    </div>
  )
}

export default FormacaoAddHeader
