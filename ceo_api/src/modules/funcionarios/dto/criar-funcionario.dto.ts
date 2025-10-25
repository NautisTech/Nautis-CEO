import {
    IsString,
    IsDate,
    IsOptional,
    IsInt,
    IsArray,
    ValidateNested,
    IsBoolean,
    IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CampoCustomizadoDto {
    @ApiProperty()
    @IsString()
    codigo: string;

    @ApiProperty()
    @IsString()
    tipo: string;

    @ApiPropertyOptional()
    valor: any;
}

export class ContatoDto {
    @ApiProperty()
    @IsString()
    tipo: string;

    @ApiProperty()
    @IsString()
    valor: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    principal?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    observacoes?: string;
}

export class EnderecoDto {
    @ApiProperty()
    @IsString()
    tipo: string;

    @ApiProperty()
    @IsString()
    logradouro: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    numero?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    complemento?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    bairro?: string;

    @ApiProperty()
    @IsString()
    cidade: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    estado?: string;

    @ApiProperty()
    @IsString()
    pais: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    codigo_postal?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    principal?: boolean;
}

export class EmpregoDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    empresa?: string;

    @ApiProperty()
    @IsString()
    data_admissao: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    data_demissao?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    cargo?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    departamento?: string;

    @ApiPropertyOptional()
    @IsOptional()
    salario_base?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    tipo_contrato?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    regime_trabalho?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    horas_semanais?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    banco?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    agencia?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    numero_conta?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    situacao?: string;
}

export class BeneficioDto {
    @ApiProperty()
    @IsString()
    tipo: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    descricao?: string;

    @ApiPropertyOptional()
    @IsOptional()
    valor?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    data_inicio?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    data_fim?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    codigo_pagamento?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    numero_beneficiario?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    operadora?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    observacoes?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    ativo?: boolean;
}

export class DocumentoDto {
    @ApiProperty()
    @IsString()
    tipo: string;

    @ApiProperty()
    @IsString()
    numero: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    orgao_emissor?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    vitalicio?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    data_emissao?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    data_validade?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    detalhes?: string;
}

export class CriarFuncionarioDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    numero?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    tipoFuncionarioId?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    empresaId?: number;

    @ApiProperty()
    @IsString()
    nomeCompleto: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    nomeAbreviado?: string;

    @ApiProperty()
    @IsString()
    sexo: string;

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    dataNascimento: Date;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    naturalidade?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    nacionalidade?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    estadoCivil?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    fotoUrl?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    observacoes?: string;

    @ApiPropertyOptional({ type: [CampoCustomizadoDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CampoCustomizadoDto)
    camposCustomizados?: CampoCustomizadoDto[];

    @ApiPropertyOptional({ type: [ContatoDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ContatoDto)
    contatos?: ContatoDto[];

    @ApiPropertyOptional({ type: [EnderecoDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EnderecoDto)
    enderecos?: EnderecoDto[];

    @ApiPropertyOptional({ type: [EmpregoDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EmpregoDto)
    empregos?: EmpregoDto[];

    @ApiPropertyOptional({ type: [BeneficioDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BeneficioDto)
    beneficios?: BeneficioDto[];

    @ApiPropertyOptional({ type: [DocumentoDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DocumentoDto)
    documentos?: DocumentoDto[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    criarUtilizador?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    username?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    senha?: string;
}