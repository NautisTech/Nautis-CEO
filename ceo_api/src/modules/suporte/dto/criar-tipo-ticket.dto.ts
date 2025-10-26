import { IsString, IsInt, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarTipoTicketDto {
    @ApiProperty({ example: 'Incidente', description: 'Nome do tipo de ticket' })
    @IsString()
    @MaxLength(100)
    nome: string;

    @ApiPropertyOptional({ example: 'Problema que afeta o serviço', description: 'Descrição do tipo' })
    @IsOptional()
    @IsString()
    descricao?: string;

    @ApiPropertyOptional({ example: '#EF4444', description: 'Cor hexadecimal' })
    @IsOptional()
    @IsString()
    @MaxLength(7)
    cor?: string;

    @ApiPropertyOptional({ example: 'alert-circle', description: 'Ícone' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    icone?: string;

    @ApiPropertyOptional({ example: 4, description: 'SLA em horas para resolução' })
    @IsOptional()
    @IsInt()
    sla_horas?: number;
}
