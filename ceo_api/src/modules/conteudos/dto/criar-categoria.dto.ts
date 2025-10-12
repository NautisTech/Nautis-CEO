import {
    IsString,
    IsOptional,
    IsInt,
    MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarCategoriaDto {
    @ApiProperty()
    @IsString()
    @MaxLength(100)
    nome: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(100)
    slug?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(500)
    descricao?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(20)
    cor?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(50)
    icone?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    ordem?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    categoriaPaiId?: number;
}