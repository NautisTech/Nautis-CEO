import { Suspense } from 'react'
import PortalDashboard from '@/views/portal/dashboard'

export default function PortalDashboardPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PortalDashboard />
    </Suspense>
  )
}
