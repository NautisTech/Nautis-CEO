import { IsString, IsInt, IsOptional, IsNumber, MaxLength, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AtualizarIntervencaoCustoDto {
    @ApiPropertyOptional({ description: 'Descrição do custo' })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    descricao?: string;

    @ApiPropertyOptional({ description: 'Código do produto/serviço' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    codigo?: string;

    @ApiPropertyOptional({ description: 'Quantidade' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    quantidade?: number;

    @ApiPropertyOptional({ description: 'Valor unitário' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    valor_unitario?: number;

    @ApiPropertyOptional({ description: 'ID do fornecedor' })
    @IsOptional()
    @IsInt()
    fornecedor_id?: number;

    @ApiPropertyOptional({ description: 'URL do anexo' })
    @IsOptional()
    @IsString()
    anexo_url?: string;
}
