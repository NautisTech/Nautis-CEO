'use client'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

interface AulasProps {
  moduloId: number
  onSelectAula: (aulaId: number) => void
}

const Aulas = ({ moduloId, onSelectAula }: AulasProps) => {
  return (
    <Card>
      <CardHeader title={`Aulas do Módulo #${moduloId}`} action={
        <Button variant='contained' size='small'>Adicionar Aula</Button>
      } />
      <Divider />
      <CardContent>
        <Typography variant='body2' color='text.secondary'>
          Selecione um módulo acima para gerir as suas aulas
        </Typography>
      </CardContent>
    </Card>
  )
}

export default Aulas
