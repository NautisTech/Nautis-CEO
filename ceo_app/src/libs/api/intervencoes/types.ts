export type TipoIntervencao = 'preventiva' | 'corretiva' | 'instalacao' | 'configuracao' | 'upgrade' | 'manutencao'
export type StatusIntervencao = 'pendente' | 'em_andamento' | 'concluida' | 'cancelada' | 'agendada' | 'em_progresso'

export interface Intervencao {
  id: number
  ticket_id?: number
  numero_ticket?: string
  ticket_assunto?: string
  equipamento_id: number
  equipamento_numero: string
  equipamento_nome: string
  tipo: TipoIntervencao
  numero_intervencao: string
  titulo: string
  descricao?: string
  diagnostico?: string
  solucao?: string
  tecnico_id: number
  tecnico_nome: string
  tecnico_email?: string
  data_inicio: string
  data_fim?: string
  duracao_minutos?: number
  custo_mao_obra?: number
  custo_pecas?: number
  custo_total?: number
  fornecedor_externo?: string
  numero_fatura?: string
  garantia: boolean
  observacoes?: string
  status: StatusIntervencao
  criado_em: string
  atualizado_em?: string
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
  data_inicio: string
  data_fim?: string
  duracao_minutos?: number
  custo_mao_obra?: number
  custo_pecas?: number
  custo_total?: number
  fornecedor_externo?: string
  numero_fatura?: string
  garantia: boolean
  observacoes?: string
  status: StatusIntervencao
}

export interface AtualizarIntervencaoDto {
  tipo?: TipoIntervencao
  titulo?: string
  descricao?: string
  diagnostico?: string
  solucao?: string
  tecnico_id?: number
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
  status?: StatusIntervencao
}

export interface IntervencaoFiltros {
  ticket_id?: number
  equipamento_id?: number
  tecnico_id?: number
  tipo?: TipoIntervencao
  status?: StatusIntervencao
  data_inicio?: string
  data_fim?: string
}

export interface IntervencoesEstatisticas {
  total: number
  agendadas: number
  em_progresso: number
  concluidas: number
  canceladas: number
  preventivas: number
  corretivas: number
  custo_total: number
  duracao_media: number
  em_garantia: number
}
