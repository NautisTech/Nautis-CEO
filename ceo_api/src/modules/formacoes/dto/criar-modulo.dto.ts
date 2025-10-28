import { IsString, IsOptional, IsInt, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarModuloDto {
    @ApiProperty({ example: 1, description: 'ID da formação' })
    @IsInt()
    formacao_id: number;

    @ApiProperty({ example: 'Módulo 1: Introdução', description: 'Título do módulo' })
    @IsString()
    @MaxLength(255)
    titulo: string;

    @ApiPropertyOptional({ description: 'Descrição do módulo' })
    @IsOptional()
    @IsString()
    descricao?: string;

    @ApiPropertyOptional({ description: 'Categoria do módulo' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    categoria?: string;

    @ApiPropertyOptional({ description: 'Nível do módulo' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    nivel?: string;

    @ApiPropertyOptional({ description: 'Duração total em minutos' })
    @IsOptional()
    @IsInt()
    duracao_total?: number;

    @ApiPropertyOptional({ description: 'URL da imagem de capa' })
    @IsOptional()
    @IsString()
    capa_url?: string;

    @ApiPropertyOptional({ description: 'ID da imagem de capa' })
    @IsOptional()
    @IsInt()
    imagem_capa_id?: number;

    @ApiPropertyOptional({ example: true, description: 'Se o módulo está ativo' })
    @IsOptional()
    @IsBoolean()
    ativo?: boolean;
}
