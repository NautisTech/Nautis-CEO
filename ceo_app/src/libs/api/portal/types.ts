export interface PortalDashboardStats {
  totalTickets: number
  ticketsAbertos: number
  ticketsEmProgresso: number
  ticketsConcluidos: number
  ticketsUrgentes: number
  ultimosTickets: PortalTicket[]
}

export interface PortalTicket {
  id: number
  numero_ticket: string
  tipo_ticket_id: number
  tipo_ticket_nome: string
  assunto: string
  descricao: string
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
  status: string
  data_limite: string
  sla_status: 'ok' | 'warning' | 'overdue'
  tempo_restante_minutos: number
  equipamento_id?: number
  equipamento_numero?: string
  equipamento_nome?: string
  localizacao?: string
  atribuido_id?: number
  atribuido_nome?: string
  criado_em: string
  atualizado_em: string
  precisa_aprovacao?: boolean
}

export interface CriarTicketPortalDto {
  tipo_ticket_id: number
  assunto: string
  descricao: string
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
  equipamento_id?: number
  localizacao?: string
}

export interface AtualizarTicketPortalDto {
  descricao?: string
  localizacao?: string
}

export interface PortalAnexo {
  id: number
  nome_ficheiro: string
  nome_original: string
  caminho: string
  tamanho_bytes: number
  tipo_mime?: string
  extensao?: string
  descricao?: string
  categoria?: string
  entidade_tipo?: string
  entidade_id?: number
  criado_em: string
}
