export interface Funcionario {
    id: number
    empresa_id: number
    tipo_funcionario_id: number
    tipo_funcionario?: string
    tipo_funcionario_nome?: string
    tipo_funcionario_cor?: string
    tipo_funcionario_icone?: string
    utilizador_id?: number
    numero: number
    nome_completo: string
    nome_abreviado?: string
    email?: string
    telefone?: string
    sexo?: string
    data_nascimento?: string
    naturalidade?: string
    nacionalidade?: string
    estado_civil?: string
    nif?: string
    foto_url?: string
    numero_seguranca_social?: string
    data_admissao?: string
    data_saida?: string
    ativo: boolean
    criado_em: string
    atualizado_em?: string
    observacoes?: string
}

export interface FuncionarioDetalhado extends Funcionario {
    camposCustomizados?: CampoCustomizado[]
    contatos?: FuncionarioContato[]
    enderecos?: FuncionarioEndereco[]
    dependentes?: FuncionarioDependente[]
    empregos?: FuncionarioEmprego[]
    beneficios?: FuncionarioBeneficio[]
    documentos?: FuncionarioDocumento[]
}

export interface CampoCustomizado {
    id: number
    funcionario_id: number
    codigo_campo: string
    nome_campo: string
    tipo_dados: string
    valor_texto?: string
    valor_numero?: number
    valor_data?: string
    valor_datetime?: string
    valor_boolean?: boolean
    valor_json?: any
}

export interface FuncionarioContato {
    id: number
    funcionario_id: number
    tipo: string
    valor: string
    principal: boolean
}

export interface FuncionarioEndereco {
    id: number
    funcionario_id: number
    tipo: string
    rua: string
    numero: string
    complemento?: string
    bairro?: string
    cidade: string
    estado?: string
    cep: string
    pais: string
    principal: boolean
}

export interface FuncionarioDependente {
    id: number
    funcionario_id: number
    nome: string
    parentesco: string
    data_nascimento: string
    cpf?: string
}

export interface FuncionarioEmprego {
    id: number
    funcionario_id: number
    cargo: string
    departamento?: string
    salario?: number
    data_inicio: string
    data_fim?: string
    atual: boolean
}

export interface FuncionarioBeneficio {
    id: number
    funcionario_id: number
    tipo_beneficio: string
    valor?: number
    data_inicio: string
    data_fim?: string
    ativo: boolean
}

export interface FuncionarioDocumento {
    id: number
    funcionario_id: number
    tipo_documento: string
    numero_documento: string
    data_emissao?: string
    data_validade?: string
    anexo_id?: number
}

export interface CreateFuncionarioDto {
    empresa_id: number
    tipo_funcionario_id: number
    utilizador_id?: number
    nome: string
    email?: string
    telefone?: string
    data_nascimento?: string
    nif?: string
    numero_seguranca_social?: string
    data_admissao: string
}
