'use client'

import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import { conteudosAPI } from '@/libs/api/conteudos/api'

const statusColors: any = { rascunho: 'secondary', publicado: 'success', arquivado: 'error', agendado: 'warning', em_revisao: 'info' }

const AtividadeRecente = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await conteudosAPI.getDashboardStatistics()
        setData(response.atividadeRecente || [])
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
      <CardHeader title='Atividade Recente' />
      <CardContent>
        <div className='flex flex-col gap-4'>
          {data.map((item, idx) => (
            <div key={idx} className='flex justify-between items-center'>
              <div className='flex-1'>
                <Typography variant='body2' fontWeight={600}>{item.titulo}</Typography>
                <Typography variant='caption' color='text.secondary'>
                  {item.tipo_conteudo_nome} • {item.autor_nome} • {new Date(item.atualizado_em).toLocaleDateString('pt-PT')}
                </Typography>
              </div>
              <Chip label={item.status} size='small' color={statusColors[item.status] || 'default'} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default AtividadeRecente
