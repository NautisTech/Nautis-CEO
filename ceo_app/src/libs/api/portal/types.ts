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

export interface NoticiaPortal {
  id: number
  titulo: string
  slug: string
  subtitulo?: string
  resumo?: string
  conteudo?: string
  imagem_destaque?: string
  publicado_em: string
  criado_em: string
  visualizacoes: number
  tipo_conteudo_nome: string
  tipo_conteudo_codigo: string
  tipo_conteudo_icone?: string
  categoria_nome?: string
  categoria_cor?: string
  autor_nome: string
}

// Transações e Conta Corrente
export interface ContaCorrente {
  saldo_atual: number
  total_transacoes: number
  total_debitos: number
  total_creditos: number
  transacoes_pendentes: number
  valor_pendente: number
  ultima_transacao: string
}

export interface TransacaoItem {
  id: number
  item_tipo: string // 'ticket', 'equipamento', 'projeto', 'horas_projeto', 'intervencao'
  item_id: number
  valor: number
  quantidade?: number
  descricao?: string
  item_referencia?: string
  item_detalhes?: any
}

export interface Transacao {
  id: number
  entidade_origem_tipo: string
  entidade_origem_id: number
  entidade_destino_tipo: string
  entidade_destino_id: number
  data_transacao: string
  descricao?: string
  documento?: string
  tipo_transacao: string // 'debito', 'credito', 'pagamento', 'recebimento', 'despesa', 'receita'
  valor: number
  moeda?: string
  anexo_url?: string
  estado?: string // 'pendente', 'confirmado', 'cancelado'
  observacoes?: string
  saldo_apos?: number
  metadata?: string
  criado_por?: number
  criado_em: string
  atualizado_em?: string
  documento_id?: number
  itens?: TransacaoItem[]
}

export interface FiltrarTransacoesDto {
  tipo_transacao?: string
  estado?: string
  data_inicio?: string
  data_fim?: string
  item_tipo?: string
  item_id?: number
  page?: number
  pageSize?: number
}

export interface TransacoesResponse {
  data: Transacao[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}
