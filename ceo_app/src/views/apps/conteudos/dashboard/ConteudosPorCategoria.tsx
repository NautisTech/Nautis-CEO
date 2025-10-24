'use client'

import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import { conteudosAPI } from '@/libs/api/conteudos/api'

const ConteudosPorCategoria = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await conteudosAPI.getDashboardStatistics()
        setData(response.estatisticasPorCategoria || [])
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
      <CardHeader title='Top Categorias' />
      <CardContent>
        <div className='flex flex-col gap-3'>
          {data.map((cat, idx) => (
            <div key={idx} className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <i className={cat.icone || 'tabler-folder'} style={{ color: cat.cor || '#666' }} />
                <Typography variant='body2'>{cat.nome}</Typography>
              </div>
              <Chip label={cat.total_conteudos} size='small' variant='tonal' />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ConteudosPorCategoria
