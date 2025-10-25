import { IsString, IsOptional, IsBoolean, IsInt, IsNumber, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarEquipamentoDto {
    @ApiProperty({ example: 1, description: 'ID do modelo' })
    @IsInt()
    modelo_id: number;

    @ApiPropertyOptional({ example: 1, description: 'ID do funcionário responsável' })
    @IsOptional()
    @IsInt()
    funcionario_id?: number;

    @ApiPropertyOptional({ example: 1, description: 'ID do local' })
    @IsOptional()
    @IsInt()
    local_id?: number;

    @ApiProperty({ example: 'NB-2024-001', description: 'Número de série' })
    @IsString()
    @MaxLength(100)
    numero_serie: string;

    @ApiPropertyOptional({ example: 'PAT-001', description: 'Código patrimonial' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    codigo_patrimonio?: string;

    @ApiPropertyOptional({ example: 'Notebook para desenvolvimento', description: 'Descrição' })
    @IsOptional()
    @IsString()
    descricao?: string;

    @ApiPropertyOptional({ example: '2024-01-15', description: 'Data de aquisição' })
    @IsOptional()
    @IsString()
    data_aquisicao?: string;

    @ApiPropertyOptional({ example: 1500.00, description: 'Valor de aquisição' })
    @IsOptional()
    @IsNumber()
    valor_aquisicao?: number;

    @ApiPropertyOptional({ example: 1234, description: 'Número da nota fiscal' })
    @IsOptional()
    @IsInt()
    numero_nota_fiscal?: number;

    @ApiPropertyOptional({ example: 'Fornecedor XYZ', description: 'Nome do fornecedor' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    fornecedor?: string;

    @ApiPropertyOptional({ example: '2027-01-15', description: 'Data de vencimento da garantia' })
    @IsOptional()
    @IsString()
    garantia_ate?: string;

    @ApiPropertyOptional({ example: 'operacional', description: 'Status do equipamento' })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiPropertyOptional({ example: 'Observações gerais', description: 'Observações' })
    @IsOptional()
    @IsString()
    observacoes?: string;

    @ApiPropertyOptional({ example: 'https://example.com/qrcode.png', description: 'URL do QR Code' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    qrcode_url?: string;

    @ApiPropertyOptional({ example: true, description: 'Se o equipamento está ativo' })
    @IsOptional()
    @IsBoolean()
    ativo?: boolean;
}
