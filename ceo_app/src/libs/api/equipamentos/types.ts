// Marca
export interface Marca {
  id: number
  nome: string
  logo_url: string | null
  website: string | null
  codigo_leitura: string | null
  tipo_leitura: string | null
  email_suporte: string | null
  telefone_suporte: string | null
  link_suporte: string | null
  ativo: boolean
  criado_em: string
  atualizado_em: string | null
  total_modelos?: number
}

export interface CriarMarcaDto {
  nome: string
  logo_url?: string
  website?: string
  codigo_leitura?: string
  tipo_leitura?: string
  email_suporte?: string
  telefone_suporte?: string
  link_suporte?: string
  ativo?: boolean
}

// Categoria
export interface CategoriaEquipamento {
  id: number
  nome: string
  descricao: string | null
  icone: string | null
  cor: string | null
  categoria_pai_id: number | null
  ativo: boolean
  criado_em: string
  atualizado_em: string | null
}

export interface CriarCategoriaDto {
  nome: string
  descricao?: string
  icone?: string
  cor?: string
  categoria_pai_id?: number
  ativo?: boolean
}

// Modelo
export interface ModeloEquipamento {
  id: number
  marca_id: number
  marca_nome: string
  marca_logo: string | null
  categoria_id: number
  categoria_nome: string
  categoria_icone: string | null
  categoria_cor: string | null
  nome: string
  codigo: string | null
  descricao: string | null
  especificacoes: string | null
  imagem_url: string | null
  manual_url: string | null
  codigo_leitura: string | null
  tipo_leitura: string | null
  ativo: boolean
  criado_em: string
  atualizado_em: string | null
}

export interface CriarModeloDto {
  marca_id: number
  categoria_id: number
  nome: string
  codigo?: string
  descricao?: string
  especificacoes?: string
  imagem_url?: string
  manual_url?: string
  codigo_leitura?: string
  tipo_leitura?: string
  ativo?: boolean
}

// Equipamento
export interface Equipamento {
  id: number
  modelo_id: number
  modelo_nome: string
  modelo_codigo: string | null
  modelo_imagem?: string | null
  marca_id: number
  marca_nome: string
  marca_logo: string | null
  categoria_id: number
  categoria_nome: string
  categoria_icone: string | null
  categoria_cor: string | null
  responsavel_id: number | null
  responsavel_nome: string | null
  responsavel_foto?: string | null
  utilizador_id: number | null
  utilizador_nome: string | null
  localizacao: string | null
  numero_serie: string
  numero_interno: string | null
  descricao: string | null
  data_aquisicao: string | null
  valor_aquisicao: number | null
  fornecedor: string | null
  data_garantia: string | null
  data_proxima_manutencao: string | null
  estado: string
  observacoes: string | null
  foto_url: string | null
  ativo: boolean
  criado_em: string
  atualizado_em: string | null
}

export interface CriarEquipamentoDto {
  modelo_id: number
  responsavel_id?: number
  utilizador_id?: number
  numero_serie: string
  numero_interno?: string
  descricao?: string
  localizacao?: string
  data_aquisicao?: string
  valor_aquisicao?: number
  fornecedor?: string
  data_garantia?: string
  data_proxima_manutencao?: string
  estado?: string
  observacoes?: string
  foto_url?: string
  ativo?: boolean
}

export interface FiltrosEquipamento {
  modelo_id?: number
  responsavel_id?: number
  utilizador_id?: number
  estado?: string
}
