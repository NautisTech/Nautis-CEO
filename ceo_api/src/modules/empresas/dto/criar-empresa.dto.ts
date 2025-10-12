import {
    IsString,
    IsOptional,
    MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarEmpresaDto {
    @ApiProperty()
    @IsString()
    @MaxLength(50)
    codigo: string;

    @ApiProperty()
    @IsString()
    @MaxLength(255)
    nome: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(50)
    nif?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    logoUrl?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(20)
    cor?: string;
}