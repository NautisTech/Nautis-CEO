export interface Configuracao {
  id: number
  codigo: string
  descricao: string
  valor: string | null
  atualizado_em: string
}

export interface AtualizarConfiguracaoDto {
  codigo: string
  valor: string
}
