import { Suspense } from 'react'
import FormacoesList from '@/views/apps/formacoes/FormacoesList'

export default function FormacoesListPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <FormacoesList />
    </Suspense>
  )
}
