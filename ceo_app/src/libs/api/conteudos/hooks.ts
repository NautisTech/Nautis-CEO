import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { conteudosAPI } from './api'
import type {
    CriarConteudoDto,
    AtualizarConteudoDto,
    FiltrarConteudosDto,
    CriarCategoriaDto,
    CriarTagDto,
    CriarComentarioDto,
} from './types'

// ==================== CONTEÚDOS ====================

export function useConteudos(filtros?: FiltrarConteudosDto) {
    return useQuery({
        queryKey: ['conteudos', filtros],
        queryFn: () => conteudosAPI.listar(filtros),
    })
}

export function useConteudo(id: number, enabled = true) {
    return useQuery({
        queryKey: ['conteudo', id],
        queryFn: () => conteudosAPI.obterPorId(id),
        enabled: enabled && id > 0,
    })
}

export function useConteudoBySlug(slug: string, enabled = true) {
    return useQuery({
        queryKey: ['conteudo', 'slug', slug],
        queryFn: () => conteudosAPI.obterPorSlug(slug),
        enabled: enabled && !!slug,
    })
}

export function useCriarConteudo() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CriarConteudoDto) => conteudosAPI.criar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conteudos'] })
        },
    })
}

export function useAtualizarConteudo() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: AtualizarConteudoDto }) =>
            conteudosAPI.atualizar(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['conteudo', id] })
            queryClient.invalidateQueries({ queryKey: ['conteudos'] })
        },
    })
}

export function usePublicarConteudo() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => conteudosAPI.publicar(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['conteudo', id] })
            queryClient.invalidateQueries({ queryKey: ['conteudos'] })
        },
    })
}

export function useArquivarConteudo() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => conteudosAPI.arquivar(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['conteudo', id] })
            queryClient.invalidateQueries({ queryKey: ['conteudos'] })
        },
    })
}

export function useFavoritarConteudo() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => conteudosAPI.favoritar(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['conteudo', id] })
        },
    })
}

// ==================== TIPOS ====================

export function useTiposConteudo() {
    return useQuery({
        queryKey: ['tipos-conteudo'],
        queryFn: () => conteudosAPI.listarTipos(),
        staleTime: 1000 * 60 * 10, // 10 minutos
    })
}

export function useTipoConteudo(id: number) {
    return useQuery({
        queryKey: ['tipo-conteudo', id],
        queryFn: () => conteudosAPI.obterTipoPorId(id),
        enabled: id > 0,
    })
}

export function useSchemaTipo(tipoConteudoId: number) {
    return useQuery({
        queryKey: ['schema-tipo', tipoConteudoId],
        queryFn: () => conteudosAPI.obterSchemaTipo(tipoConteudoId),
        enabled: tipoConteudoId > 0,
        staleTime: 1000 * 60 * 10,
    })
}

// ==================== CATEGORIAS ====================

export function useCategorias() {
    return useQuery({
        queryKey: ['categorias'],
        queryFn: () => conteudosAPI.listarCategorias(),
    })
}

export function useCriarCategoria() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CriarCategoriaDto) => conteudosAPI.criarCategoria(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categorias'] })
        },
    })
}

// ==================== TAGS ====================

export function useTags() {
    return useQuery({
        queryKey: ['tags'],
        queryFn: () => conteudosAPI.listarTags(),
    })
}

export function usePesquisarTags(termo: string) {
    return useQuery({
        queryKey: ['tags', 'pesquisar', termo],
        queryFn: () => conteudosAPI.pesquisarTags(termo),
        enabled: termo.length >= 2,
    })
}

export function useCriarTag() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CriarTagDto) => conteudosAPI.criarTag(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] })
        },
    })
}

// ==================== COMENTÁRIOS ====================

export function useComentarios(conteudoId: number) {
    return useQuery({
        queryKey: ['comentarios', conteudoId],
        queryFn: () => conteudosAPI.listarComentarios(conteudoId),
        enabled: conteudoId > 0,
    })
}

export function useRespostasComentario(comentarioId: number) {
    return useQuery({
        queryKey: ['comentarios', 'respostas', comentarioId],
        queryFn: () => conteudosAPI.obterRespostas(comentarioId),
        enabled: comentarioId > 0,
    })
}

export function useCriarComentario() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CriarComentarioDto) => conteudosAPI.criarComentario(data),
        onSuccess: (_, { conteudoId }) => {
            queryClient.invalidateQueries({ queryKey: ['comentarios', conteudoId] })
            queryClient.invalidateQueries({ queryKey: ['conteudo', conteudoId] })
        },
    })
}

export function useAprovarComentario() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => conteudosAPI.aprovarComentario(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comentarios'] })
        },
    })
}

export function useDarLike() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (comentarioId: number) => conteudosAPI.darLike(comentarioId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comentarios'] })
        },
    })
}