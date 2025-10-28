'use client'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

interface ClientesProps {
  formacaoId: number
}

const Clientes = ({ formacaoId }: ClientesProps) => {
  return (
    <Card>
      <CardHeader
        title='Clientes Associados'
        action={
          <Button variant='contained' startIcon={<i className='tabler-plus' />}>
            Associar Cliente
          </Button>
        }
      />
      <Divider />
      <CardContent>
        <Typography color='text.secondary'>
          Nenhum cliente associado a esta formação.
        </Typography>
      </CardContent>
    </Card>
  )
}

export default Clientes
