'use client'

import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CustomIconButton from '@core/components/mui/IconButton'
import CustomTextField from '@core/components/mui/TextField'

type Props = {
  searchValue: string
  setSearchValue: (value: string) => void
}

const MinhasFormacoesHeader = ({ searchValue, setSearchValue }: Props) => {
  return (
    <Card className='relative flex justify-center'>
      <div className='flex flex-col items-center gap-4 max-md:pli-5 plb-12 md:is-1/2'>
        <Typography variant='h4' className='text-center md:is-3/4'>
          As Minhas Formações
        </Typography>
        <Typography className='text-center'>
          Acompanhe o seu progresso e continue a aprender com as formações em que está inscrito.
        </Typography>
        <div className='flex items-center gap-4 max-sm:is-full'>
          <CustomTextField
            placeholder='Procurar formação'
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            className='sm:is-[350px] max-sm:flex-1'
          />
          <CustomIconButton variant='contained' color='primary'>
            <i className='tabler-search' />
          </CustomIconButton>
        </div>
      </div>
    </Card>
  )
}

export default MinhasFormacoesHeader
