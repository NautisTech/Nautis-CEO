'use client'

import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import { conteudosAPI } from '@/libs/api/conteudos/api'

const ConteudosMaisVisualizados = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await conteudosAPI.getDashboardStatistics()
        setData(response.maisVisualizados || [])
      } catch (error) {
        console.error('Erro:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <Card className='flex items-center justify-center p-10'><CircularProgress /></Card>

  return (
    <Card>
      <CardHeader title='Mais Visualizados (30 dias)' />
      <CardContent>
        <div className='flex flex-col gap-4'>
          {data.map((content, idx) => (
            <div key={idx}>
              <div className='flex justify-between items-start mb-1'>
                <Typography variant='body2' fontWeight={600} className='line-clamp-1'>{content.titulo}</Typography>
                <Chip icon={<i className='tabler-eye text-sm' />} label={content.visualizacoes} size='small' variant='tonal' color='info' />
              </div>
              <Typography variant='caption' color='text.secondary'>{content.tipo_conteudo_nome}</Typography>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ConteudosMaisVisualizados
