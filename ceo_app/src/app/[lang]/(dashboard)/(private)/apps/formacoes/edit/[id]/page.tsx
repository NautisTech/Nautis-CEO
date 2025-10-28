// Component Imports
import FormacaoSettingsWrapper from '@views/apps/formacoes/FormacaoSettingsWrapper'

const EditFormacaoPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await params
  const formacaoId = resolvedParams.id === 'create' ? 0 : parseInt(resolvedParams.id)

  return <FormacaoSettingsWrapper formacaoId={formacaoId} />
}

export default EditFormacaoPage
