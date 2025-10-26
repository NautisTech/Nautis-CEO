import { IsString, IsOptional, IsBoolean, IsInt, IsNumber, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarEquipamentoDto {
    @ApiProperty({ example: 1, description: 'ID do modelo' })
    @IsInt()
    modelo_id: number;

    @ApiPropertyOptional({ example: 1, description: 'ID do responsável (funcionário)' })
    @IsOptional()
    @IsInt()
    responsavel_id?: number;

    @ApiPropertyOptional({ example: 1, description: 'ID do utilizador' })
    @IsOptional()
    @IsInt()
    utilizador_id?: number;

    @ApiProperty({ example: 'NB-2024-001', description: 'Número de série' })
    @IsString()
    @MaxLength(100)
    numero_serie: string;

    @ApiProperty({ example: 'PAT-001', description: 'Número interno' })
    @IsString()
    @MaxLength(50)
    numero_interno: string;

    @ApiPropertyOptional({ example: 'Notebook para desenvolvimento', description: 'Descrição' })
    @IsOptional()
    @IsString()
    descricao?: string;

    @ApiPropertyOptional({ example: 'Escritório - Sala 101', description: 'Localização' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    localizacao?: string;

    @ApiPropertyOptional({ example: '2024-01-15', description: 'Data de aquisição' })
    @IsOptional()
    @IsString()
    data_aquisicao?: string;

    @ApiPropertyOptional({ example: 1500.00, description: 'Valor de aquisição' })
    @IsOptional()
    @IsNumber()
    valor_aquisicao?: number;

    @ApiPropertyOptional({ example: 'Fornecedor XYZ', description: 'Nome do fornecedor' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    fornecedor?: string;

    @ApiPropertyOptional({ example: '2027-01-15', description: 'Data de vencimento da garantia' })
    @IsOptional()
    @IsString()
    data_garantia?: string;

    @ApiPropertyOptional({ example: '2025-06-15', description: 'Data da próxima manutenção' })
    @IsOptional()
    @IsString()
    data_proxima_manutencao?: string;

    @ApiPropertyOptional({ example: 'operacional', description: 'Estado do equipamento' })
    @IsOptional()
    @IsString()
    estado?: string;

    @ApiPropertyOptional({ example: 'Observações gerais', description: 'Observações' })
    @IsOptional()
    @IsString()
    observacoes?: string;

    @ApiPropertyOptional({ example: 'https://example.com/foto.jpg', description: 'URL da foto' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    foto_url?: string;

    @ApiPropertyOptional({ example: true, description: 'Se o equipamento está ativo' })
    @IsOptional()
    @IsBoolean()
    ativo?: boolean;
}
