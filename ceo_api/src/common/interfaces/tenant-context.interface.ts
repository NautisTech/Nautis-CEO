export interface TenantContext {
    tenantId: number;
    tenantNome: string;
    tenantDatabase: string;
    empresaId?: number; // Empresa atual do utilizador
}

export interface UserPayload {
    sub: number; // userId
    username: string;
    email: string;
    tenantId: number;
    empresas: number[]; // IDs das empresas que o utilizador tem acesso
    empresaPrincipal: number;
    permissions: string[];
}