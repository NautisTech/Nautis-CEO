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

    @ApiPropertyOptional({ type: [CampoCustomizadoDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CampoCustomizadoDto)
    camposCustomizados?: CampoCustomizadoDto[];

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