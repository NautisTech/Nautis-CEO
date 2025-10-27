import TicketForm from '@/views/apps/suporte/TicketForm'

const EditTicketPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  return <TicketForm mode='edit' ticketId={Number(id)} />
}

export default EditTicketPage
