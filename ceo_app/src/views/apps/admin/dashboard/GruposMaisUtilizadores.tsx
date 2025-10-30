'use client'
import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import CircularProgress from '@mui/material/CircularProgress'
import type { ThemeColor } from '@core/types'
import { usersAPI } from '@/libs/api/users/api'
import { getDictionary } from '@/utils/getDictionary'

const GruposMaisUtilizadores = ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) => {
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

  const totalUsers = data.reduce((acc, group) => acc + group.total_utilizadores, 0)
  const maxPermissions = Math.max(...data.map(g => g.total_permissoes), 1)

  const colors: ThemeColor[] = ['error', 'primary', 'success', 'info', 'warning', 'secondary']

  return (
    <Card className='bs-full'>
      <CardHeader
        title={dictionary['dashboards']?.admin.usedGroups.title}
        subheader={`${totalUsers} ${dictionary['dashboards']?.admin.usedGroups.userTotal}`}
      />
      <CardContent className='flex flex-col gap-4'>
        {data.map((group, idx) => (
          <div key={idx} className='flex items-center gap-4'>
            <i className='tabler-users-group text-[32px]' />
            <div className='flex flex-wrap justify-between items-center gap-x-4 gap-y-1 is-full'>
              <div className='flex flex-col'>
                <Typography className='font-medium' color='text.primary'>
                  {group.nome}
                </Typography>
                <Typography variant='body2'>{`${group.total_utilizadores} ${group.total_utilizadores == 1 ? dictionary['dashboards']?.admin.usedGroups.user : dictionary['dashboards']?.admin.usedGroups.users}`}</Typography>
              </div>
              <div className='flex justify-between items-center is-32'>
                <LinearProgress
                  value={(group.total_permissoes / maxPermissions) * 100}
                  variant='determinate'
                  color={colors[idx % colors.length]}
                  className='min-bs-2 is-20'
                />
                <Typography color='text.disabled'>{group.total_permissoes}</Typography>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default GruposMaisUtilizadores
