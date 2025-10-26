import TicketForm from '@/views/apps/suporte/TicketForm'

const EditTicketPage = ({ params }: { params: { id: string } }) => {
  return <TicketForm mode='edit' ticketId={Number(params.id)} />
}

export default EditTicketPage
