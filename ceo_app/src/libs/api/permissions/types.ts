// ==================== ENTITIES ====================

export interface Permission {
    id: number
    codigo: string
    nome: string
    descricao?: string
    modulo: string
    tipo: string
    criado_em: string
    total_grupos?: number
    total_utilizadores_diretos?: number
}

export interface PermissionModule {
    modulo: string
    total_permissoes: number
}

// ==================== DTOs ====================

export interface CreatePermissionDto {
    codigo: string
    nome: string
    descricao?: string
    modulo: string
    tipo: string
}

export interface UpdatePermissionDto {
    nome?: string
    descricao?: string
    modulo?: string
    tipo?: string
}

// ==================== RESPONSES ====================

export interface CreateResponse {
    id: number
}

export interface SuccessResponse {
    success: boolean
}
