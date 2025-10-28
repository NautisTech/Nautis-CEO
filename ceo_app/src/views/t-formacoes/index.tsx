'use client'

import { useState } from 'react'
import Grid from '@mui/material/Grid2'
import MinhasFormacoesHeader from './MinhasFormacoesHeader'
import MinhasFormacoesCourses from './MinhasFormacoesCourses'

const MinhasFormacoes = () => {
  const [searchValue, setSearchValue] = useState('')

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <MinhasFormacoesHeader searchValue={searchValue} setSearchValue={setSearchValue} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <MinhasFormacoesCourses searchValue={searchValue} />
      </Grid>
    </Grid>
  )
}

export default MinhasFormacoes
