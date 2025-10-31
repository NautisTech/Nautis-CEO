import { IsString, IsInt, IsOptional, IsEnum, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PrioridadeTicket {
    BAIXA = 'baixa',
    MEDIA = 'media',
    ALTA = 'alta',
    URGENTE = 'urgente'
}

export enum StatusTicket {
    ABERTO = 'aberto',
    EM_ANDAMENTO = 'em_andamento',
    AGUARDANDO = 'aguardando',
    RESOLVIDO = 'resolvido',
    FECHADO = 'fechado',
    CANCELADO = 'cancelado'
}

export class CriarTicketDto {
    @ApiProperty({ example: 1, description: 'ID do tipo de ticket' })
    @IsInt()
    tipo_ticket_id: number;

    @ApiPropertyOptional({ example: 1, description: 'ID do equipamento relacionado' })
    @IsOptional()
    @IsInt()
    equipamento_id?: number;

    @ApiPropertyOptional({ example: 'NB-2024-001', description: 'Número de série do equipamento (quando não registado)' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    equipamento_sn?: string;

    @ApiPropertyOptional({ example: 'Notebook Dell Inspiron 15', description: 'Descrição do equipamento (quando não registado)' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    equipamento_descritivo?: string;

    @ApiProperty({ example: 'Impressora não liga', description: 'Título do ticket' })
    @IsString()
    @MaxLength(200)
    titulo: string;

    @ApiProperty({ example: 'A impressora do setor administrativo não está ligando', description: 'Descrição detalhada' })
    @IsString()
    descricao: string;

    @ApiProperty({ enum: PrioridadeTicket, example: 'media', description: 'Prioridade do ticket' })
    @IsEnum(PrioridadeTicket)
    prioridade: PrioridadeTicket;

    @ApiPropertyOptional({ enum: StatusTicket, example: 'aberto', description: 'Status do ticket' })
    @IsOptional()
    @IsEnum(StatusTicket)
    status?: StatusTicket;

    @ApiProperty({ example: 1, description: 'ID do solicitante (funcionário)' })
    @IsInt()
    solicitante_id: number;

    @ApiPropertyOptional({ example: 1, description: 'ID do técnico atribuído' })
    @IsOptional()
    @IsInt()
    atribuido_id?: number;

    @ApiPropertyOptional({ example: 'Sala 101', description: 'Localização do problema' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    localizacao?: string;

    @ApiPropertyOptional({ example: '2025-10-27T10:00:00Z', description: 'Data prevista para resolução' })
    @IsOptional()
    @IsDateString()
    data_prevista?: string;

    @ApiPropertyOptional({ example: 1, description: 'ID do cliente (opcional, null para interno)' })
    @IsOptional()
    @IsInt()
    cliente_id?: number;
}
