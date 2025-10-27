import { Suspense } from 'react'
import IntervencaoForm from '@/views/apps/suporte/intervencoes/add/IntervencaoForm'
import { getDictionary } from '@/utils/getDictionary'
import { getLocaleParams } from '@/utils/i18n'

export default async function CreateIntervencaoPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await getLocaleParams(props.params)
  const dictionary = await getDictionary(lang)

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <IntervencaoForm id={null} isEdit={false} viewOnly={false} dictionary={dictionary} />
    </Suspense>
  )
}
