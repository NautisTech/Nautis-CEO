'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Hook Imports
import { useObterEstatisticasConteudo } from '@/libs/api/conteudos/hooks'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'

type DataType = {
  title: string
  value: string
  icon: string
  desc: string
  change?: number
}

const ConteudoCard = ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) => {
  // Hooks
  const isBelowMdScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const { data: stats } = useObterEstatisticasConteudo(0)
  const data: DataType[] = [
    {
      title: dictionary['conteudos']?.stats.s1,
      value: stats?.total_visualizacoes?.toString() || '0',
      icon: 'tabler-eye',
      desc: dictionary['conteudos']?.stats.s1_desc,
      change: parseFloat(((stats?.visualizacoes_semana! / stats?.visualizacoes_mes!) * 100).toFixed(1)) // % da semana em relação ao mês
    },
    {
      title: dictionary['conteudos']?.stats.s2,
      value: stats?.total_comentarios?.toString() || '0',
      icon: 'tabler-message-circle',
      desc: dictionary['conteudos']?.stats.s2_desc,
      change: 0 // pode ser usado para representar variação futura
    },
    {
      title: dictionary['conteudos']?.stats.s3,
      value: stats?.total_favoritos?.toString() || '0',
      icon: 'tabler-star',
      desc: dictionary['conteudos']?.stats.s3_desc,
      change: 0
    },
    {
      title: dictionary['conteudos']?.stats.s4,
      value: stats?.visualizacoes_mes?.toString() || '0',
      icon: 'tabler-calendar-stats',
      desc: dictionary['conteudos']?.stats.s4_desc,
      change: parseFloat((stats?.visualizacoes_semana! / 7).toFixed(1)) // média por dia na semana
    }
  ];

  return (
    <Card>
      <CardContent>
        <Grid container spacing={6}>
          {data.map((item, index) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 3 }}
              key={index}
              className={classnames({
                '[&:nth-of-type(odd)>div]:pie-6 [&:nth-of-type(odd)>div]:border-ie': isBelowMdScreen && !isSmallScreen,
                '[&:not(:last-child)>div]:pie-6 [&:not(:last-child)>div]:border-ie': !isBelowMdScreen
              })}
            >
              <div className='flex flex-col gap-1'>
                <div className='flex justify-between'>
                  <div className='flex flex-col gap-1'>
                    <Typography>{item.title}</Typography>
                    <Typography variant='h4'>{item.value}</Typography>
                  </div>
                  <CustomAvatar variant='rounded' size={44}>
                    <i className={classnames(item.icon, 'text-[28px]')} />
                  </CustomAvatar>
                </div>
                {item.change ? (
                  <div className='flex items-center gap-2'>
                    <Typography>{`${item.desc}`}</Typography>
                    <Chip
                      variant='tonal'
                      label={`${item.change}%`}
                      size='small'
                      color={item.change > 0 ? 'success' : 'error'}
                    />
                  </div>
                ) : (
                  <Typography>{`${item.desc}`}</Typography>
                )}
              </div>
              {isBelowMdScreen && !isSmallScreen && index < data.length - 2 && (
                <Divider
                  className={classnames('mbs-6', {
                    'mie-6': index % 2 === 0
                  })}
                />
              )}
              {isSmallScreen && index < data.length - 1 && <Divider className='mbs-6' />}
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ConteudoCard
