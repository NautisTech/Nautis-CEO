export interface Empresa {
  id: number
  nome: string
  nif: string | null
  email: string | null
  telefone: string | null
  morada: string | null
  codigo_postal: string | null
  cidade: string | null
  pais: string | null
  website: string | null
  logo_url: string | null
  ativo: boolean
  criado_em: string
  atualizado_em: string | null
}

export interface CriarEmpresaDto {
  nome: string
  nif?: string
  email?: string
  telefone?: string
  morada?: string
  codigo_postal?: string
  cidade?: string
  pais?: string
  website?: string
  logo_url?: string
  ativo?: boolean
}

export interface AtualizarEmpresaDto extends Partial<CriarEmpresaDto> {}
