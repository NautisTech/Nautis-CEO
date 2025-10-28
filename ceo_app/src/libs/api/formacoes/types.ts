export interface Formacao {
  id: number
  titulo: string
  descricao: string
  categoria: string
  nivel: string
  duracao_minutos: number
  capa_url?: string
  autor_id: number
  autor_nome: string
  publicado: boolean
  ativo: boolean
  criado_em: string
  atualizado_em: string
  total_modulos?: number
  total_alunos?: number
  progresso_medio?: number
  // Para "minhas formações"
  progresso?: number
  horas_estudo?: number
  nota_final?: number
  data_inscricao?: string
  data_conclusao?: string
}

export interface Modulo {
  id: number
  formacao_id: number
  titulo: string
  descricao: string
  categoria?: string
  nivel?: string
  duracao_total?: number
  capa_url?: string
  imagem_capa_id?: number
  imagem_capa_url?: string
  ativo: boolean
  criado_por: number
  criado_por_nome?: string
  criado_em: string
  atualizado_em: string
  total_aulas?: number
}

export interface Aula {
  id: number
  m_formacao_id: number
  titulo: string
  descricao: string
  tipo: string
  ordem: number
  duracao_minutos: number
  publicado: boolean
  criado_em: string
  atualizado_em: string
  total_blocos?: number
}

export interface Bloco {
  id: number
  a_formacao_id: number
  titulo: string
  conteudo: string
  tipo: string
  ordem: number
  criado_em: string
  atualizado_em: string
  total_anexos?: number
}

export interface BlocoAnexo {
  id: number
  bloco_id: number
  upload_id: number
  nome: string
  nome_original?: string
  url: string
  tipo?: string
  tamanho_bytes?: number
  ordem?: number
  criado_em: string
}

export interface Quiz {
  id: number
  formacao_id: number
  titulo: string
  descricao?: string
  tempo_limite_minutos?: number
  nota_minima_aprovacao?: number
  mostrar_resultados: boolean
  permitir_tentativas_multiplas: boolean
  max_tentativas?: number
  ativo: boolean
  criado_em: string
  atualizado_em: string
  total_perguntas?: number
}

export interface Pergunta {
  id: number
  quiz_id: number
  tipo: 'multipla' | 'aberta'
  enunciado: string
  pontuacao: number
  ordem: number
  criado_em: string
  atualizado_em: string
  opcoes?: OpcaoResposta[]
}

export interface OpcaoResposta {
  id: number
  pergunta_id: number
  texto: string
  correta: boolean
  ordem: number
}
