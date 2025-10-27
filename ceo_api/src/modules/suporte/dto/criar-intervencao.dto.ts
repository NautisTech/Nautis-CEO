import { IsString, IsInt, IsOptional, IsEnum, IsNumber, IsBoolean, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TipoIntervencao {
    PREVENTIVA = 'preventiva',
    CORRETIVA = 'corretiva',
    INSTALACAO = 'instalacao',
    CONFIGURACAO = 'configuracao',
    UPGRADE = 'upgrade',
    MANUTENCAO = 'manutencao'
}

export enum StatusIntervencao {
    PENDENTE = 'pendente',
    EM_ANDAMENTO = 'em_andamento',
    CONCLUIDA = 'concluida',
    CANCELADA = 'cancelada'
}

export class CriarIntervencaoDto {
    @ApiPropertyOptional({ example: 1, description: 'ID do ticket relacionado (opcional)' })
    @IsOptional()
    @IsInt()
    ticket_id?: number;

    @ApiProperty({ example: 1, description: 'ID do equipamento' })
    @IsInt()
    equipamento_id: number;

    @ApiProperty({ enum: TipoIntervencao, example: 'corretiva', description: 'Tipo de intervenção' })
    @IsEnum(TipoIntervencao)
    tipo: TipoIntervencao;

    @ApiProperty({ example: 'Troca de toner', description: 'Título da intervenção' })
    @IsString()
    @MaxLength(200)
    titulo: string;

    @ApiPropertyOptional({ example: 'Substituição do toner preto', description: 'Descrição da intervenção' })
    @IsOptional()
    @IsString()
    descricao?: string;

    @ApiPropertyOptional({ example: 'Toner vazio', description: 'Diagnóstico do problema' })
    @IsOptional()
    @IsString()
    diagnostico?: string;

    @ApiPropertyOptional({ example: 'Toner substituído com sucesso', description: 'Solução aplicada' })
    @IsOptional()
    @IsString()
    solucao?: string;

    @ApiProperty({ example: 1, description: 'ID do técnico responsável' })
    @IsInt()
    tecnico_id: number;

    @ApiPropertyOptional({ example: '2025-10-26T10:00:00Z', description: 'Data de início' })
    @IsOptional()
    @IsDateString()
    data_inicio?: string;

    @ApiPropertyOptional({ example: '2025-10-26T11:30:00Z', description: 'Data de fim' })
    @IsOptional()
    @IsDateString()
    data_fim?: string;

    @ApiPropertyOptional({ example: 90, description: 'Duração em minutos' })
    @IsOptional()
    @IsInt()
    duracao_minutos?: number;

    @ApiPropertyOptional({ example: 50.00, description: 'Custo da mão de obra' })
    @IsOptional()
    @IsNumber()
    custo_mao_obra?: number;

    @ApiPropertyOptional({ example: 25.50, description: 'Custo das peças' })
    @IsOptional()
    @IsNumber()
    custo_pecas?: number;

    @ApiPropertyOptional({ example: 'Tech Solutions Lda', description: 'Fornecedor externo' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    fornecedor_externo?: string;

    @ApiPropertyOptional({ example: 'FAT2025001', description: 'Número da fatura' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    numero_fatura?: string;

    @ApiPropertyOptional({ example: true, description: 'Se está em garantia' })
    @IsOptional()
    @IsBoolean()
    garantia?: boolean;

    @ApiPropertyOptional({ example: 'Cliente satisfeito', description: 'Observações adicionais' })
    @IsOptional()
    @IsString()
    observacoes?: string;

    @ApiPropertyOptional({ enum: StatusIntervencao, example: 'concluida', description: 'Status da intervenção' })
    @IsOptional()
    @IsEnum(StatusIntervencao)
    status?: StatusIntervencao;
}
