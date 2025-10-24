'use client'

import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import CircularProgress from '@mui/material/CircularProgress'
import { conteudosAPI } from '@/libs/api/conteudos/api'

const TopAutores = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await conteudosAPI.getDashboardStatistics()
        setData(response.topAutores || [])
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
      <CardHeader title='Top Autores' />
      <CardContent>
        <div className='flex flex-col gap-4'>
          {data.map((autor, idx) => (
            <div key={idx} className='flex items-center justify-between gap-3'>
              <div className='flex items-center gap-3'>
                <Avatar src={autor.foto_url} alt={autor.username}>{autor.username?.charAt(0)?.toUpperCase()}</Avatar>
                <div>
                  <Typography variant='body2' fontWeight={600}>{autor.username}</Typography>
                  <Typography variant='caption' color='text.secondary'>{autor.total_visualizacoes} visualizações</Typography>
                </div>
              </div>
              <Typography variant='h6' color='primary'>{autor.total_conteudos}</Typography>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default TopAutores
