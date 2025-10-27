export enum PrioridadeTicket {
  BAIXA = 'baixa',
  MEDIA = 'media',
  ALTA = 'alta',
  URGENTE = 'urgente'
}

export enum StatusTicket {
  ABERTO = 'aberto',
  EM_ANDAMENTO = 'em_andamento',
  AGUARDANDO = 'aguardando',
  RESOLVIDO = 'resolvido',
  FECHADO = 'fechado',
  CANCELADO = 'cancelado'
}

export interface Ticket {
  id: number
  empresa_id: number
  numero_ticket: string
  tipo_ticket_id: number
  equipamento_id?: number
  cliente_id?: number
  titulo: string
  descricao: string
  prioridade: PrioridadeTicket
  status: StatusTicket
  solicitante_id: number
  atribuido_id?: number
  localizacao?: string
  data_abertura: string
  data_prevista?: string
  data_conclusao?: string
  tempo_resolucao_minutos?: number
  avaliacao?: number
  comentario_avaliacao?: string
  criado_em: string
  atualizado_em: string
  // Joined fields
  tipo_ticket_nome?: string
  solicitante_nome?: string
  solicitante_email?: string
  atribuido_nome?: string
  equipamento_numero?: string
  equipamento_nome?: string
  // SLA fields (calculated)
  sla_horas?: number
  sla_deadline?: string
  sla_status?: 'ok' | 'warning' | 'overdue'
  sla_tempo_restante_minutos?: number
}

export interface CriarTicketDto {
  tipo_ticket_id: number
  equipamento_id?: number
  titulo: string
  descricao: string
  prioridade: PrioridadeTicket
  status?: StatusTicket
  solicitante_id: number
  atribuido_id?: number
  localizacao?: string
  data_prevista?: string
}

export interface TipoTicket {
  id: number
  nome: string
  descricao?: string
  cor?: string
  icone?: string
  sla_horas?: number
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

export interface TicketHistorico {
  id: number
  ticket_id: number
  empresa_id: number
  usuario_id: number
  campo_alterado: string
  valor_anterior?: string
  valor_novo?: string
  observacao?: string
  criado_em: string
  usuario_nome?: string
}

export enum TipoIntervencao {
  PREVENTIVA = 'preventiva',
  CORRETIVA = 'corretiva',
  INSTALACAO = 'instalacao',
  CONFIGURACAO = 'configuracao',
  UPGRADE = 'upgrade',
  MANUTENCAO = 'manutencao'
}

export enum StatusIntervencao {
  PENDENTE = 'pendente',
  EM_ANDAMENTO = 'em_andamento',
  CONCLUIDA = 'concluida',
  CANCELADA = 'cancelada'
}

export interface Intervencao {
  id: number
  ticket_id?: number
  equipamento_id: number
  tipo: TipoIntervencao
  numero_intervencao: string
  titulo: string
  descricao?: string
  diagnostico?: string
  solucao?: string
  tecnico_id: number
  data_inicio?: string
  data_fim?: string
  duracao_minutos?: number
  custo_mao_obra?: number
  custo_pecas?: number
  custo_total?: number
  fornecedor_externo?: string
  numero_fatura?: string
  garantia?: boolean
  observacoes?: string
  status: StatusIntervencao
  criado_em: string
  atualizado_em: string
  // Joined fields
  numero_ticket?: string
  tecnico_nome?: string
  equipamento_numero?: string
}

export interface CriarIntervencaoDto {
  ticket_id?: number
  equipamento_id: number
  tipo: TipoIntervencao
  titulo: string
  descricao?: string
  diagnostico?: string
  solucao?: string
  tecnico_id: number
  data_inicio?: string
  data_fim?: string
  duracao_minutos?: number
  custo_mao_obra?: number
  custo_pecas?: number
  fornecedor_externo?: string
  numero_fatura?: string
  garantia?: boolean
  observacoes?: string
  status?: StatusIntervencao
}
