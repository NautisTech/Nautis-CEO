'use client'

import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import CustomAvatar from '@core/components/mui/Avatar'
import { conteudosAPI } from '@/libs/api/conteudos/api'

const ConteudosPorTipo = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await conteudosAPI.getDashboardStatistics()
        setData(response.estatisticasPorTipo || [])
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
      <CardHeader title='Conteúdos por Tipo' />
      <CardContent>
        <div className='flex flex-col gap-4'>
          {data.map((tipo, index) => (
            <div key={index} className='flex items-center justify-between gap-4'>
              <div className='flex items-center gap-3'>
                <CustomAvatar size={38} skin='light' color='primary'>
                  <i className={tipo.icone || 'tabler-file-text'} />
                </CustomAvatar>
                <div>
                  <Typography variant='body2' fontWeight={600}>{tipo.nome}</Typography>
                  <Typography variant='caption' color='text.secondary'>{tipo.publicados} publicados</Typography>
                </div>
              </div>
              <Typography variant='h6'>{tipo.total_conteudos}</Typography>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ConteudosPorTipo
