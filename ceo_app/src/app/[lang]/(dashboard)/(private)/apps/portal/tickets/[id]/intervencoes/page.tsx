import { Suspense } from 'react'
import TicketIntervencoesPortal from '@/views/portal/tickets/TicketIntervencoes'

export default function TicketIntervencoesPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <TicketIntervencoesPortal />
    </Suspense>
  )
}
