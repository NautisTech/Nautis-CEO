import { IsString, IsInt, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PrioridadeTicket {
    BAIXA = 'baixa',
    MEDIA = 'media',
    ALTA = 'alta',
    URGENTE = 'urgente'
}

export class CriarTicketPortalDto {
    @ApiProperty({ example: 1, description: 'ID do tipo de ticket' })
    @IsInt()
    tipo_ticket_id: number;

    @ApiProperty({ example: 'Impressora não liga', description: 'Assunto do ticket' })
    @IsString()
    @MaxLength(200)
    assunto: string;

    @ApiProperty({ example: 'A impressora do setor administrativo não está ligando', description: 'Descrição detalhada' })
    @IsString()
    descricao: string;

    @ApiProperty({ enum: PrioridadeTicket, example: 'media', description: 'Prioridade do ticket' })
    @IsEnum(PrioridadeTicket)
    prioridade: PrioridadeTicket;

    @ApiPropertyOptional({ example: 'Sala 101', description: 'Localização do problema' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    localizacao?: string;
}
