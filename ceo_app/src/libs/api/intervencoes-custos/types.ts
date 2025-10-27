export interface IntervencaoCusto {
  id: number
  intervencao_id: number
  descricao: string
  codigo?: string
  quantidade: number
  valor_unitario: number
  valor_total: number
  fornecedor_id?: number
  fornecedor_nome?: string
  anexo_url?: string
  criado_em: string
}

export interface CriarIntervencaoCustoDto {
  intervencao_id: number
  descricao: string
  codigo?: string
  quantidade: number
  valor_unitario: number
  fornecedor_id?: number
  anexo_url?: string
}

export interface AtualizarIntervencaoCustoDto {
  descricao?: string
  codigo?: string
  quantidade?: number
  valor_unitario?: number
  fornecedor_id?: number
  anexo_url?: string
}

export interface TotalCustosIntervencao {
  total: number
  total_custos: number
}
