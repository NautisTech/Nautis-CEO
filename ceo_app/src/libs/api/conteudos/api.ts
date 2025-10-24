import { apiClient, type RequestConfig } from '../client'
import type {
    Conteudo,
    ConteudoResumo,
    TipoConteudo,
    Categoria,
    Tag,
    Comentario,
    Estatisticas,
    CriarConteudoDto,
    AtualizarConteudoDto,
    FiltrarConteudosDto,
    CriarCategoriaDto,
    CriarTagDto,
    CriarComentarioDto,
    PaginatedResponse,
    CreateResponse,
    SuccessResponse,
    FavoritoResponse,
} from './types'

class ConteudosAPI {
    private baseUrl = '/conteudos'

    // ==================== CONTEÚDOS ====================

    /**
     * Criar novo conteúdo
     */
    async criar(data: CriarConteudoDto, config?: RequestConfig): Promise<CreateResponse> {
        return apiClient.post<CreateResponse>(this.baseUrl, data, {
            successMessage: 'Conteúdo criado com sucesso!',
            ...config,
        })
    }

    /**
     * Listar conteúdos com filtros e paginação
     */
    async listar(
        filtros?: FiltrarConteudosDto,
        config?: RequestConfig
    ): Promise<PaginatedResponse<ConteudoResumo>> {
        return apiClient.get<PaginatedResponse<ConteudoResumo>>(this.baseUrl, {
            params: filtros,
            showErrorToast: false,
            ...config,
        })
    }

    /**
     * Obter conteúdo completo por ID
     */
    async obterPorId(id: number, config?: RequestConfig): Promise<Conteudo> {
        return apiClient.get<Conteudo>(`${this.baseUrl}/${id}`, {
            showErrorToast: false,
            ...config,
        })
    }

    /**
     * Obter conteúdo por slug
     */
    async obterPorSlug(slug: string, config?: RequestConfig): Promise<Conteudo> {
        return apiClient.get<Conteudo>(`${this.baseUrl}/slug/${slug}`, {
            showErrorToast: false,
            ...config,
        })
    }

    /**
     * Atualizar conteúdo
     */
    async atualizar(
        id: number,
        data: AtualizarConteudoDto,
        config?: RequestConfig
    ): Promise<SuccessResponse> {
        return apiClient.put<SuccessResponse>(`${this.baseUrl}/${id}`, data, {
            successMessage: 'Conteúdo atualizado com sucesso!',
            ...config,
        })
    }

    /**
     * Publicar conteúdo
     */
    async publicar(id: number, config?: RequestConfig): Promise<SuccessResponse> {
        return apiClient.patch<SuccessResponse>(`${this.baseUrl}/${id}/publicar`, {}, {
            successMessage: 'Conteúdo publicado com sucesso!',
            ...config,
        })
    }

    /**
     * Arquivar conteúdo
     */
    async arquivar(id: number, config?: RequestConfig): Promise<SuccessResponse> {
        return apiClient.patch<SuccessResponse>(`${this.baseUrl}/${id}/arquivar`, {}, {
            successMessage: 'Conteúdo arquivado com sucesso!',
            ...config,
        })
    }

    /**
     * Favoritar/desfavoritar conteúdo
     */
    async favoritar(id: number, config?: RequestConfig): Promise<FavoritoResponse> {
        return apiClient.post<FavoritoResponse>(`${this.baseUrl}/${id}/favoritar`, {}, {
            showSuccessToast: false,
            ...config,
        })
    }

    /**
     * Toggle destaque do conteúdo
     */
    async toggleDestaque(id: number, config?: RequestConfig): Promise<SuccessResponse & { destaque: boolean }> {
        return apiClient.patch<SuccessResponse & { destaque: boolean }>(`${this.baseUrl}/${id}/destaque`, {}, {
            showSuccessToast: false,
            ...config,
        })
    }

    /**
     * Duplicar conteúdo
     */
    async duplicar(id: number, config?: RequestConfig): Promise<CreateResponse> {
        return apiClient.post<CreateResponse>(`${this.baseUrl}/${id}/duplicar`, {}, {
            successMessage: 'Conteúdo duplicado com sucesso!',
            ...config,
        })
    }

    /**
     * Obter estatísticas do conteúdo
     */
    async obterEstatisticas(id: number, config?: RequestConfig): Promise<Estatisticas> {
        return apiClient.get<Estatisticas>(`${this.baseUrl}/${id}/estatisticas`, {
            showErrorToast: false,
            ...config,
        })
    }

    // ==================== TIPOS DE CONTEÚDO ====================

    /**
     * Listar tipos de conteúdo disponíveis
     */
    async listarTipos(config?: RequestConfig): Promise<TipoConteudo[]> {
        return apiClient.get<TipoConteudo[]>(`tipos-conteudo`, {
            showErrorToast: false,
            ...config,
        })
    }

    /**
     * Obter tipo de conteúdo por ID
     */
    async obterTipoPorId(id: number, config?: RequestConfig): Promise<TipoConteudo> {
        return apiClient.get<TipoConteudo>(`tipos-conteudo/${id}`, {
            showErrorToast: false,
            ...config,
        })
    }

    /**
     * Obter schema de campos do tipo de conteúdo
     */
    async obterSchemaTipo(tipoConteudoId: number, config?: RequestConfig) {
        return apiClient.get(`tipos-conteudo/${tipoConteudoId}/schema`, {
            showErrorToast: false,
            ...config,
        })
    }

    // ==================== CATEGORIAS ====================

    /**
     * Criar categoria
     */
    async criarCategoria(data: CriarCategoriaDto, config?: RequestConfig): Promise<CreateResponse> {
        return apiClient.post<CreateResponse>(`${this.baseUrl}/categorias`, data, {
            successMessage: 'Categoria criada com sucesso!',
            ...config,
        })
    }

    /**
     * Listar categorias
     */
    async listarCategorias(config?: RequestConfig): Promise<Categoria[]> {
        return apiClient.get<Categoria[]>(`${this.baseUrl}/categorias`, {
            showErrorToast: false,
            ...config,
        })
    }

    /**
     * Obter categoria por ID
     */
    async obterCategoriaPorId(id: number, config?: RequestConfig): Promise<Categoria> {
        return apiClient.get<Categoria>(`${this.baseUrl}/categorias/${id}`, {
            showErrorToast: false,
            ...config,
        })
    }

    // ==================== TAGS ====================

    /**
     * Criar tag
     */
    async criarTag(data: CriarTagDto, config?: RequestConfig): Promise<CreateResponse> {
        return apiClient.post<CreateResponse>(`${this.baseUrl}/tags`, data, {
            successMessage: 'Tag criada com sucesso!',
            ...config,
        })
    }

    /**
     * Listar tags
     */
    async listarTags(config?: RequestConfig): Promise<Tag[]> {
        return apiClient.get<Tag[]>(`${this.baseUrl}/tags`, {
            showErrorToast: false,
            ...config,
        })
    }

    /**
     * Pesquisar tags
     */
    async pesquisarTags(termo: string, config?: RequestConfig): Promise<Tag[]> {
        return apiClient.get<Tag[]>(`${this.baseUrl}/tags/pesquisar`, {
            params: { termo },
            showErrorToast: false,
            ...config,
        })
    }

    // ==================== COMENTÁRIOS ====================

    /**
     * Criar comentário
     */
    async criarComentario(data: CriarComentarioDto, config?: RequestConfig): Promise<CreateResponse> {
        return apiClient.post<CreateResponse>(`${this.baseUrl}/comentarios`, data, {
            successMessage: 'Comentário enviado com sucesso!',
            ...config,
        })
    }

    /**
     * Listar comentários de um conteúdo
     */
    async listarComentarios(conteudoId: number, config?: RequestConfig): Promise<Comentario[]> {
        return apiClient.get<Comentario[]>(`${this.baseUrl}/comentarios/conteudo/${conteudoId}`, {
            showErrorToast: false,
            ...config,
        })
    }

    /**
     * Obter respostas de um comentário
     */
    async obterRespostas(comentarioId: number, config?: RequestConfig): Promise<Comentario[]> {
        return apiClient.get<Comentario[]>(`${this.baseUrl}/comentarios/${comentarioId}/respostas`, {
            showErrorToast: false,
            ...config,
        })
    }

    /**
     * Aprovar comentário
     */
    async aprovarComentario(id: number, config?: RequestConfig): Promise<SuccessResponse> {
        return apiClient.patch<SuccessResponse>(
            `${this.baseUrl}/comentarios/${id}/aprovar`,
            {},
            {
                successMessage: 'Comentário aprovado!',
                ...config,
            }
        )
    }

    /**
     * Rejeitar/deletar comentário
     */
    async rejeitarComentario(id: number, config?: RequestConfig): Promise<SuccessResponse> {
        return apiClient.delete<SuccessResponse>(`${this.baseUrl}/comentarios/${id}`, {
            successMessage: 'Comentário removido!',
            ...config,
        })
    }

    /**
     * Dar like em comentário
     */
    async darLike(comentarioId: number, config?: RequestConfig): Promise<SuccessResponse> {
        return apiClient.post<SuccessResponse>(
            `${this.baseUrl}/comentarios/${comentarioId}/like`,
            {},
            {
                showSuccessToast: false,
                ...config,
            }
        )
    }

    /**
     * Obter estatísticas para dashboard de conteúdos
     */
    async getDashboardStatistics(config?: RequestConfig): Promise<any> {
        return apiClient.get<any>(`${this.baseUrl}/dashboard/estatisticas`, {
            showErrorToast: false,
            ...config,
        })
    }
}

export const conteudosAPI = new ConteudosAPI()