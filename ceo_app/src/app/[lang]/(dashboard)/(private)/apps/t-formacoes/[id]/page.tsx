'use client'

import { Suspense } from 'react'
import Grid from '@mui/material/Grid2'
import CircularProgress from '@mui/material/CircularProgress'
import FormacaoDetails from '@/views/t-formacoes/details/Details'
import FormacaoSidebar from '@/views/t-formacoes/details/Sidebar'

export default function FormacaoDetailsPage({ params }: { params: { id: string } }) {
  const formacaoId = parseInt(params.id)

  return (
    <Suspense fallback={<div className='flex items-center justify-center p-10'><CircularProgress /></div>}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, md: 8 }}>
          <FormacaoDetails formacaoId={formacaoId} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <div className='sticky top-[94px]'>
            <FormacaoSidebar formacaoId={formacaoId} />
          </div>
        </Grid>
      </Grid>
    </Suspense>
  )
}
