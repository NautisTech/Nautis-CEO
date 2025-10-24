'use client'
import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import CircularProgress from '@mui/material/CircularProgress'
import { usersAPI } from '@/libs/api/users/api'

const PermissoesPorModulo = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await usersAPI.getDashboardStatistics()
        setData(response.permissoesPorModulo || [])
      } catch (error) {
        console.error('Erro:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <Card className='flex items-center justify-center p-10'><CircularProgress /></Card>

  const max = Math.max(...data.map(d => d.total_permissoes))

  return (
    <Card>
      <CardHeader title='Permissões por Módulo' />
      <CardContent>
        <div className='flex flex-col gap-4'>
          {data.map((mod, idx) => (
            <div key={idx}>
              <div className='flex justify-between items-center mb-1'>
                <Typography variant='body2'>{mod.modulo}</Typography>
                <Typography variant='body2' fontWeight={600}>{mod.total_permissoes}</Typography>
              </div>
              <LinearProgress variant='determinate' value={(mod.total_permissoes / max) * 100} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default PermissoesPorModulo
