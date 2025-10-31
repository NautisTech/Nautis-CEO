'use client'

import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import classnames from 'classnames'
import { equipamentosAPI } from '@/libs/api/equipamentos/api'

const ModelosDistribution = () => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await equipamentosAPI.getDashboardStatistics()
                setData(response.topModelos || [])
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
        <Card className='bs-full'>
            <CardHeader title='Top Modelos' subheader='Modelos mais utilizados' />
            <CardContent>
                <div className='flex flex-col gap-4'>
                    {data.map((modelo, idx) => (
                        <div key={idx} className='flex justify-between items-center gap-3'>
                            <div className='flex items-center gap-3 flex-1 min-w-0'>
                                <Avatar
                                    className='is-10 bs-10'
                                    sx={{
                                        backgroundColor: modelo.categoria_cor || 'var(--mui-palette-primary-lightOpacity)',
                                        color: modelo.categoria_cor || 'var(--mui-palette-primary-main)'
                                    }}
                                >
                                    <i className={classnames(modelo.categoria_icone || 'tabler-device-laptop', 'text-[22px]')} />
                                </Avatar>
                                <div className='flex-1 min-w-0'>
                                    <Typography variant='body2' fontWeight={600} className='truncate'>
                                        {modelo.nome}
                                    </Typography>
                                    <Typography variant='caption' color='text.secondary'>
                                        {modelo.marca_nome} {modelo.codigo && `• ${modelo.codigo}`}
                                    </Typography>
                                </div>
                            </div>
                            <Chip
                                label={modelo.total_equipamentos}
                                size='small'
                                color='primary'
                                variant='tonal'
                            />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default ModelosDistribution
