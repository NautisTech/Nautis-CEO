import { IsString, IsInt, IsOptional, IsNumber, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarIntervencaoCustoDto {
    @ApiProperty({ example: 1, description: 'ID da intervenção' })
    @IsInt()
    intervencao_id: number;

    @ApiProperty({ example: 'Toner preto original HP', description: 'Descrição do custo' })
    @IsString()
    @MaxLength(255)
    descricao: string;

    @ApiPropertyOptional({ example: 'HP-CF410A', description: 'Código do produto/serviço' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    codigo?: string;

    @ApiProperty({ example: 2, description: 'Quantidade', default: 1 })
    @IsNumber()
    @Min(0)
    quantidade: number;

    @ApiProperty({ example: 45.50, description: 'Valor unitário' })
    @IsNumber()
    @Min(0)
    valor_unitario: number;

    @ApiPropertyOptional({ example: 1, description: 'ID do fornecedor' })
    @IsOptional()
    @IsInt()
    fornecedor_id?: number;

    @ApiPropertyOptional({ example: '/uploads/faturas/fatura-001.pdf', description: 'URL do anexo (fatura/recibo)' })
    @IsOptional()
    @IsString()
    anexo_url?: string;
}
