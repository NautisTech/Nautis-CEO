'use client'
import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import { usersAPI } from '@/libs/api/users/api'

const GruposMaisUtilizadores = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await usersAPI.getDashboardStatistics()
        setData(response.gruposMaisUtilizadores || [])
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
      <CardHeader title='Grupos Mais Utilizados' />
      <CardContent>
        <div className='flex flex-col gap-4'>
          {data.map((group, idx) => (
            <div key={idx} className='flex justify-between items-center'>
              <div className='flex-1'>
                <Typography variant='body2' fontWeight={600}>{group.nome}</Typography>
                <Typography variant='caption' color='text.secondary'>{group.total_permissoes} permissões</Typography>
              </div>
              <Chip label={group.total_utilizadores} size='small' variant='tonal' color='primary' />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default GruposMaisUtilizadores
