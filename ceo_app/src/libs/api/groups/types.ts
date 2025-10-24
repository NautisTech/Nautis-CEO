// ==================== ENTITIES ====================

export interface Group {
    id: number
    nome: string
    descricao?: string
    ativo: boolean
    criado_em: string
    atualizado_em?: string
    // Informações adicionais quando detalhado
    total_utilizadores?: number
    total_permissoes?: number
    permissoes?: Permission[]
    utilizadores?: GroupUser[]
}

export interface GroupListItem {
    id: number
    nome: string
    descricao?: string
    ativo: boolean
    criado_em: string
    total_utilizadores: number
    total_permissoes: number
}

export interface Permission {
    id: number
    codigo: string
    nome: string
    descricao?: string
    modulo: string
    tipo: string
}

export interface GroupUser {
    id: number
    username: string
    email: string
    ativo: boolean
}

// ==================== DTOs ====================

export interface CreateGroupDto {
    nome: string
    descricao?: string
    permissoesIds?: number[]
}

export interface UpdateGroupDto {
    nome?: string
    descricao?: string
    ativo?: boolean
    permissoesIds?: number[]
}

export interface AssignPermissionsDto {
    permissoesIds: number[]
}

export interface AssignUsersDto {
    utilizadoresIds: number[]
}

// ==================== RESPONSES ====================

export interface CreateResponse {
    id: number
}

export interface SuccessResponse {
    success: boolean
}
