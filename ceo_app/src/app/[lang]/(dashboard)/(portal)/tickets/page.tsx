import { Suspense } from 'react'
import PortalTickets from '@/views/portal/tickets'

export default function PortalTicketsPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PortalTickets />
    </Suspense>
  )
}
