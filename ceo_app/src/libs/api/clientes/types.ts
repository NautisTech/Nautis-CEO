export interface Cliente {
    id: number
    empresa_id: number
    num_cliente?: string
    condicoes_pagamento?: string
    metodo_pagamento_preferido?: string
    limite_credito?: number
    desconto_comercial?: number
    dia_vencimento_preferido?: number
    motivo_bloqueio?: string
    data_bloqueio?: string
    gestor_conta_id?: number
    total_compras?: number
    data_primeira_compra?: string
    data_ultima_compra?: string
    num_encomendas?: number
    pessoa_contacto?: string
    cargo_contacto?: string
    email_contacto?: string
    telefone_contacto?: string
    observacoes?: string
    origem?: string
    ativo: boolean
    criado_por?: number
    atualizado_por?: number
    criado_em: string
    atualizado_em?: string
    nome_cliente?: string
    // Optionally joined fields from empresas
    empresa_nome?: string
    empresa_nome_comercial?: string
    empresa_nif?: string
    empresa_email?: string
    empresa_telefone?: string
    gestor_nome?: string
}

export interface CriarClienteDto {
    empresa_id: number
    num_cliente?: string
    nome_cliente?: string
    condicoes_pagamento?: string
    metodo_pagamento_preferido?: string
    limite_credito?: number
    desconto_comercial?: number
    dia_vencimento_preferido?: number
    pessoa_contacto?: string
    cargo_contacto?: string
    email_contacto?: string
    telefone_contacto?: string
    observacoes?: string
    origem?: string
}

export interface AtualizarClienteDto extends Partial<CriarClienteDto> {
    motivo_bloqueio?: string
    gestor_conta_id?: number
    ativo?: boolean
}
