'use client'
import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import { usersAPI } from '@/libs/api/users/api'

const UtilizadoresRecentes = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await usersAPI.getDashboardStatistics()
        setData(response.utilizadoresRecentes || [])
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
      <CardHeader title='Utilizadores Recentes' />
      <CardContent>
        <div className='flex flex-col gap-4'>
          {data.map((user, idx) => (
            <div key={idx} className='flex justify-between items-center'>
              <div className='flex items-center gap-3'>
                <Avatar src={user.foto_url} alt={user.username}>{user.username?.charAt(0)?.toUpperCase()}</Avatar>
                <div>
                  <Typography variant='body2' fontWeight={600}>{user.username}</Typography>
                  <Typography variant='caption' color='text.secondary'>{new Date(user.criado_em).toLocaleDateString('pt-PT')}</Typography>
                </div>
              </div>
              <Chip label={user.ativo ? 'Ativo' : 'Inativo'} size='small' color={user.ativo ? 'success' : 'error'} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default UtilizadoresRecentes
