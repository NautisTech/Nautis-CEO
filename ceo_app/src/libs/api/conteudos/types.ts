// Enums
export enum StatusConteudo {
    RASCUNHO = 'rascunho',
    PUBLICADO = 'publicado',
    ARQUIVADO = 'arquivado',
    AGENDADO = 'agendado',
    EM_REVISAO = 'em_revisao',
}

export enum TipoAnexo {
    IMAGEM = 'imagem',
    VIDEO = 'video',
    DOCUMENTO = 'documento',
    AUDIO = 'audio',
    OUTRO = 'outro',
}

// Interfaces Base
export interface TipoConteudo {
    id: number
    codigo: string
    nome: string
    descricao?: string
    icone?: string
    permite_comentarios: boolean
    permite_anexos: boolean
    max_anexos?: number
    permite_galeria: boolean
    requer_aprovacao: boolean
    template_visualizacao?: string
    configuracao_campos?: ConfiguracaoCampos
    ativo: boolean
    criado_em: string
    atualizado_em?: string
}

export interface ConfiguracaoCampos {
    campos_personalizados: CampoPersonalizado[]
}

export interface CampoPersonalizado {
    codigo: string
    nome: string
    tipo: string
    obrigatorio?: boolean
    opcoes?: Array<{ value: string; label: string }>
    validacao?: string
    descricao?: string
}

export interface Categoria {
    id: number
    nome: string
    slug: string
    descricao?: string
    cor?: string
    icone?: string
    ordem: number
    ativo: boolean
    categoria_pai_id?: number
    categoria_pai_nome?: string
    total_conteudos?: number
    criado_em: string
    atualizado_em?: string
}

export interface Tag {
    id: number
    nome: string
    slug: string
    cor?: string
    total_conteudos?: number
    criado_em: string
}

export interface Anexo {
    id: number
    tipo_anexo: TipoAnexo
    legenda?: string
    ordem: number
    principal: boolean
    nome_original: string
    nome_arquivo: string
    caminho: string
    url: string
    tipo: string
    tamanho: number
}

export interface ValorCampoPersonalizado {
    codigo_campo: string
    valor_texto?: string
    valor_numero?: number
    valor_data?: string
    valor_datetime?: string
    valor_boolean?: boolean
    valor_json?: any
}

export interface Conteudo {
    id: number
    tipo_conteudo_id: number
    tipo_conteudo_nome: string
    tipo_conteudo_codigo: string
    tipo_permite_comentarios: boolean
    tipo_permite_anexos: boolean
    tipo_permite_galeria: boolean
    categoria_id?: number
    categoria_nome?: string
    categoria_slug?: string
    titulo: string
    slug: string
    subtitulo?: string
    resumo?: string
    conteudo?: string
    imagem_destaque?: string
    autor_id: number
    autor_nome: string
    autor_email?: string
    status: StatusConteudo
    destaque: boolean
    permite_comentarios: boolean
    visualizacoes: number
    ordem?: number
    publicado_em?: string
    data_inicio?: string
    data_fim?: string
    meta_title?: string
    meta_description?: string
    meta_keywords?: string
    criado_em: string
    atualizado_em?: string
    aprovado_por_id?: number
    aprovador_nome?: string
    aprovado_em?: string
    tags?: Tag[]
    anexos?: Anexo[]
    campos_personalizados?: ValorCampoPersonalizado[]
    total_comentarios?: number
    total_favoritos?: number
}

export interface ConteudoResumo {
    id: number
    tipo_conteudo_id: number
    tipo_conteudo_nome: string
    tipo_conteudo_codigo: string
    categoria_id?: number
    categoria_nome?: string
    titulo: string
    slug: string
    resumo?: string
    imagem_destaque?: string
    autor_id: number
    autor_nome: string
    status: StatusConteudo
    destaque: boolean
    visualizacoes: number
    publicado_em?: string
    criado_em: string
    total_comentarios: number
    total_favoritos: number
}

export interface Comentario {
    id: number
    conteudo_id: number
    conteudo: string
    comentario_pai_id?: number
    utilizador_id: number
    utilizador_nome: string
    utilizador_foto?: string
    aprovado: boolean
    likes: number
    criado_em: string
    atualizado_em?: string
    total_respostas?: number
}

export interface Estatisticas {
    total_visualizacoes: number
    total_comentarios: number
    total_favoritos: number
    visualizacoes_semana: number
    visualizacoes_mes: number
}

// DTOs
export interface CriarConteudoDto {
    tipoConteudoId: number
    categoriaId?: number
    titulo: string
    slug?: string
    subtitulo?: string
    resumo?: string
    conteudo?: string
    imagemDestaque?: string
    status?: StatusConteudo
    destaque?: boolean
    permiteComentarios?: boolean
    dataInicio?: Date | string
    dataFim?: Date | string
    tags?: string[]
    anexosIds?: number[]
    camposPersonalizados?: Array<{
        codigo: string
        tipo: string
        valor: any
    }>
    metaTitle?: string
    metaDescription?: string
    metaKeywords?: string
}

export interface AtualizarConteudoDto extends Partial<CriarConteudoDto> { }

export interface FiltrarConteudosDto {
    tipoConteudoId?: number
    categoriaId?: number
    status?: StatusConteudo
    destaque?: boolean
    textoPesquisa?: string
    tag?: string
    autorId?: number
    page?: number
    pageSize?: number
}

export interface CriarCategoriaDto {
    nome: string
    slug?: string
    descricao?: string
    cor?: string
    icone?: string
    ordem?: number
    categoriaPaiId?: number
}

export interface CriarTagDto {
    nome: string
    slug?: string
    cor?: string
}

export interface CriarComentarioDto {
    conteudoId: number
    conteudo: string
    comentarioPaiId?: number
}

// Responses
export interface PaginatedResponse<T> {
    data: T[]
    meta: {
        total: number
        page: number
        pageSize: number
        totalPages: number
    }
}

export interface CreateResponse {
    id: number
    slug?: string
}

export interface SuccessResponse {
    success: boolean
    message?: string
}

export interface FavoritoResponse extends SuccessResponse {
    favorito: boolean
}