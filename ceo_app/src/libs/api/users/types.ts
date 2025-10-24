// ==================== ENTITIES ====================

export interface User {
    id: number
    username: string
    email: string
    telefone?: string
    foto_url?: string
    funcionario_id?: number
    ativo: boolean
    email_verificado: boolean
    ultimo_acesso?: string
    criado_em: string
    atualizado_em?: string
    // Informações adicionais quando detalhado
    grupos?: Group[]
    permissoesDiretas?: Permission[]
    permissoesEfetivas?: Permission[]
    empresas?: UserCompany[]
    total_grupos?: number
    total_permissoes_diretas?: number
    total_empresas?: number
}

export interface UserListItem {
    id: number
    username: string
    email: string
    telefone?: string
    foto_url?: string
    funcionario_id?: number
    ativo: boolean
    email_verificado: boolean
    ultimo_acesso?: string
    criado_em: string
    total_grupos: number
    total_permissoes_diretas: number
    total_empresas: number
}

export interface Group {
    id: number
    nome: string
    descricao?: string
    ativo: boolean
}

export interface Permission {
    id: number
    codigo: string
    nome: string
    descricao?: string
    modulo: string
    tipo: string
}

export interface UserCompany {
    id: number
    nome: string
    codigo: string
    logo_url?: string
    empresa_principal: boolean
}

// ==================== DTOs ====================

export interface CreateUserDto {
    username: string
    email: string
    senha: string
    telefone?: string
    foto_url?: string
    ativo?: boolean
    email_verificado?: boolean
    gruposIds?: number[]
    permissoesIds?: number[]
    empresasIds?: number[]
}

export interface UpdateUserDto {
    username?: string
    email?: string
    telefone?: string
    foto_url?: string
    ativo?: boolean
    email_verificado?: boolean
}

export interface UpdatePasswordDto {
    senhaAtual: string
    senhaNova: string
}

export interface ResetPasswordDto {
    novaSenha: string
}

export interface AssignGroupsDto {
    gruposIds: number[]
}

export interface AssignPermissionsDto {
    permissoesIds: number[]
}

export interface AssignCompaniesDto {
    empresasIds: number[]
    empresaPrincipalId?: number
}

export interface UserFilters {
    page?: number
    pageSize?: number
    search?: string
    ativo?: boolean
    grupoId?: number
    empresaId?: number
}

// ==================== RESPONSES ====================

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    pageSize: number
}

export interface CreateResponse {
    id: number
}

export interface SuccessResponse {
    success: boolean
}
