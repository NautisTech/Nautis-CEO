'use client'

import { Suspense } from 'react'
import MinhasFormacoes from '@/views/t-formacoes'
import CircularProgress from '@mui/material/CircularProgress'

export default function MinhasFormacoesPage() {
  return (
    <Suspense fallback={<div className='flex items-center justify-center p-10'><CircularProgress /></div>}>
      <MinhasFormacoes />
    </Suspense>
  )
}
