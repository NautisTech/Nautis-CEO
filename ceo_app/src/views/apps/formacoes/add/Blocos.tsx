'use client'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

interface BlocosProps {
  aulaId: number
}

const Blocos = ({ aulaId }: BlocosProps) => {
  return (
    <Card>
      <CardHeader title={`Blocos da Aula #${aulaId}`} action={
        <Button variant='contained' size='small'>Adicionar Bloco</Button>
      } />
      <Divider />
      <CardContent>
        <Typography variant='body2' color='text.secondary'>
          Selecione uma aula acima para gerir os seus blocos de conteúdo
        </Typography>
      </CardContent>
    </Card>
  )
}

export default Blocos
