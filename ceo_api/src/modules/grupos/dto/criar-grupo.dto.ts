import {
    IsString,
    IsOptional,
    IsArray,
    IsInt,
    MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarGrupoDto {
    @ApiProperty()
    @IsString()
    @MaxLength(255)
    nome: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(500)
    descricao?: string;

    @ApiPropertyOptional({ type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    permissoesIds?: number[];
}