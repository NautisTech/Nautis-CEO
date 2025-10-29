'use client'

import { Suspense } from 'react'
import Grid from '@mui/material/Grid2'
import CircularProgress from '@mui/material/CircularProgress'
import AulaDetails from '@/views/t-formacoes/aula/Details'
import FormacaoSidebar from '@/views/t-formacoes/details/Sidebar'

export default function AulaPage({ params }: { params: { id: string; aulaId: string } }) {
  const formacaoId = parseInt(params.id)
  const aulaId = parseInt(params.aulaId)

  return (
    <Suspense fallback={<div className='flex items-center justify-center p-10'><CircularProgress /></div>}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, md: 8 }}>
          <AulaDetails formacaoId={formacaoId} aulaId={aulaId} />
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
