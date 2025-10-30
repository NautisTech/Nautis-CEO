import { IsInt, IsString, IsOptional, IsDecimal, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarClienteDto {
    @ApiProperty({ description: 'ID da empresa associada' })
    @IsInt()
    empresa_id: number;

    @ApiPropertyOptional({ description: 'Número do cliente' })
    @IsOptional()
    @IsString()
    num_cliente?: string;

    @ApiPropertyOptional({ description: 'Nome do cliente' })
    @IsOptional()
    @IsString()
    nome_cliente?: string;

    @ApiPropertyOptional({ description: 'Condições de pagamento' })
    @IsOptional()
    @IsString()
    condicoes_pagamento?: string;

    @ApiPropertyOptional({ description: 'Método de pagamento preferido' })
    @IsOptional()
    @IsString()
    metodo_pagamento_preferido?: string;

    @ApiPropertyOptional({ description: 'Limite de crédito' })
    @IsOptional()
    limite_credito?: number;

    @ApiPropertyOptional({ description: 'Desconto comercial em percentagem' })
    @IsOptional()
    desconto_comercial?: number;

    @ApiPropertyOptional({ description: 'Dia preferido de vencimento (1-31)' })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(31)
    dia_vencimento_preferido?: number;

    @ApiPropertyOptional({ description: 'Pessoa de contacto' })
    @IsOptional()
    @IsString()
    pessoa_contacto?: string;

    @ApiPropertyOptional({ description: 'Cargo da pessoa de contacto' })
    @IsOptional()
    @IsString()
    cargo_contacto?: string;

    @ApiPropertyOptional({ description: 'Email de contacto' })
    @IsOptional()
    @IsString()
    email_contacto?: string;

    @ApiPropertyOptional({ description: 'Telefone de contacto' })
    @IsOptional()
    @IsString()
    telefone_contacto?: string;

    @ApiPropertyOptional({ description: 'Observações' })
    @IsOptional()
    @IsString()
    observacoes?: string;

    @ApiPropertyOptional({ description: 'Origem do cliente' })
    @IsOptional()
    @IsString()
    origem?: string;
}

export class AtualizarClienteDto {
    @ApiPropertyOptional({ description: 'ID da empresa associada' })
    @IsOptional()
    @IsInt()
    empresa_id?: number;

    @ApiPropertyOptional({ description: 'Número do cliente' })
    @IsOptional()
    @IsString()
    num_cliente?: string;

    @ApiPropertyOptional({ description: 'Nome do cliente' })
    @IsOptional()
    @IsString()
    nome_cliente?: string;

    @ApiPropertyOptional({ description: 'Condições de pagamento' })
    @IsOptional()
    @IsString()
    condicoes_pagamento?: string;

    @ApiPropertyOptional({ description: 'Método de pagamento preferido' })
    @IsOptional()
    @IsString()
    metodo_pagamento_preferido?: string;

    @ApiPropertyOptional({ description: 'Limite de crédito' })
    @IsOptional()
    limite_credito?: number;

    @ApiPropertyOptional({ description: 'Desconto comercial em percentagem' })
    @IsOptional()
    desconto_comercial?: number;

    @ApiPropertyOptional({ description: 'Dia preferido de vencimento (1-31)' })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(31)
    dia_vencimento_preferido?: number;

    @ApiPropertyOptional({ description: 'Motivo do bloqueio' })
    @IsOptional()
    @IsString()
    motivo_bloqueio?: string;

    @ApiPropertyOptional({ description: 'ID do gestor de conta' })
    @IsOptional()
    @IsInt()
    gestor_conta_id?: number;

    @ApiPropertyOptional({ description: 'Pessoa de contacto' })
    @IsOptional()
    @IsString()
    pessoa_contacto?: string;

    @ApiPropertyOptional({ description: 'Cargo da pessoa de contacto' })
    @IsOptional()
    @IsString()
    cargo_contacto?: string;

    @ApiPropertyOptional({ description: 'Email de contacto' })
    @IsOptional()
    @IsString()
    email_contacto?: string;

    @ApiPropertyOptional({ description: 'Telefone de contacto' })
    @IsOptional()
    @IsString()
    telefone_contacto?: string;

    @ApiPropertyOptional({ description: 'Observações' })
    @IsOptional()
    @IsString()
    observacoes?: string;

    @ApiPropertyOptional({ description: 'Origem do cliente' })
    @IsOptional()
    @IsString()
    origem?: string;

    @ApiPropertyOptional({ description: 'Status ativo' })
    @IsOptional()
    @IsBoolean()
    ativo?: boolean;
}

export class BloquearClienteDto {
    @ApiProperty({ description: 'Motivo do bloqueio' })
    @IsString()
    motivo: string;
}
