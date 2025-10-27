import { Suspense } from 'react'
import IntervencoesPage from '@/views/apps/suporte/intervencoes'

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <IntervencoesPage />
    </Suspense>
  )
}
