'use client'

import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import classnames from 'classnames'
import CustomAvatar from '@core/components/mui/Avatar'
import { ticketsAPI } from '@/libs/api/suporte/api'

const TopTecnicos = () => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ticketsAPI.getDashboardStatistics()
                setData(response.topTecnicos || [])
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
            <CardHeader
                title='Top Técnicos'
                subheader='Técnicos com mais tickets atribuídos'
            />
            <CardContent className='flex flex-col gap-4'>
                {data.map((tecnico, idx) => (
                    <div key={idx} className='flex items-center gap-4'>
                        <CustomAvatar skin='light' variant='rounded' size={34} src={tecnico.foto_url}>
                            {!tecnico.foto_url && <i className={classnames('tabler-user', 'text-[22px] text-textSecondary')} />}
                        </CustomAvatar>
                        <div className='flex flex-wrap justify-between items-center gap-x-4 gap-y-1 is-full'>
                            <div className='flex flex-col'>
                                <Typography className='font-medium' color='text.primary'>
                                    {tecnico.username}
                                </Typography>
                                <Typography variant='body2'>{tecnico.email}</Typography>
                            </div>
                            <div className='flex items-center gap-4'>
                                <Typography>{tecnico.total_tickets}</Typography>
                                <Chip
                                    variant='tonal'
                                    size='small'
                                    color='warning'
                                    label={`${tecnico.tickets_abertos} Abertos`}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

export default TopTecnicos
