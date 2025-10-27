import { Suspense } from 'react'
import IntervencaoForm from '@/views/apps/suporte/intervencoes/add/IntervencaoForm'
import { getDictionary } from '@/utils/getDictionary'
import { getLocaleParams } from '@/utils/i18n'

export default async function EditIntervencaoPage(props: {
  params: Promise<{ lang: string; id: string }>
}) {
  const params = await props.params
  const { lang } = await getLocaleParams(Promise.resolve({ lang: params.lang }))
  const dictionary = await getDictionary(lang)
  const id = parseInt(params.id)

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <IntervencaoForm id={id} isEdit={true} viewOnly={false} dictionary={dictionary} />
    </Suspense>
  )
}
