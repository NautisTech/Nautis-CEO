'use client'

import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

interface ClientesProps {
  formacaoId: number
}

const Clientes = ({ formacaoId }: ClientesProps) => {
  return (
    <div>
      <Typography variant='h5' className='mb-4'>
        Atribuir Clientes à Formação
      </Typography>
      <Typography variant='body2' color='text.secondary'>
        Esta funcionalidade permitirá atribuir clientes/alunos a esta formação.
      </Typography>
      <Button variant='contained' className='mt-4'>
        Adicionar Clientes
      </Button>
    </div>
  )
}

export default Clientes
