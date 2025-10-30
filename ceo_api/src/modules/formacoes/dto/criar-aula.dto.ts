import { IsString, IsOptional, IsInt, IsBoolean, IsNumber, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarAulaDto {
    @ApiProperty({ example: 1, description: 'ID do módulo' })
    @IsInt()
    m_formacao_id: number;

    @ApiProperty({ example: 'Aula 1: Introdução', description: 'Título da aula' })
    @IsString()
    @MaxLength(255)
    titulo: string;

    @ApiPropertyOptional({ description: 'Descrição da aula' })
    @IsOptional()
    @IsString()
    descricao?: string;

    @ApiPropertyOptional({ example: 'video', description: 'Tipo de conteúdo (video, texto, pdf, imagem, quiz, outro)' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    tipo?: string;

    @ApiProperty({ example: 1, description: 'Ordem dentro do módulo' })
    @IsInt()
    ordem: number;

    @ApiPropertyOptional({ example: 15.5, description: 'Duração em minutos' })
    @IsOptional()
    @IsNumber()
    duracao_minutos?: number;

    @ApiPropertyOptional({ example: false, description: 'Se a aula está publicada' })
    @IsOptional()
    @IsBoolean()
    publicado?: boolean;
}
