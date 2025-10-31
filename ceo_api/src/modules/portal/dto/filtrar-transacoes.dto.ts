import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class FiltrarTransacoesDto {
  @ApiPropertyOptional({ description: 'Tipo de transação' })
  @IsOptional()
  @IsString()
  tipo_transacao?: string;

  @ApiPropertyOptional({ description: 'Estado da transação' })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiPropertyOptional({ description: 'Data início (formato: YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  data_inicio?: string;

  @ApiPropertyOptional({ description: 'Data fim (formato: YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  data_fim?: string;

  @ApiPropertyOptional({ description: 'Tipo de item relacionado' })
  @IsOptional()
  @IsString()
  item_tipo?: string;

  @ApiPropertyOptional({ description: 'ID do item relacionado' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  item_id?: number;

  @ApiPropertyOptional({ description: 'Página' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @ApiPropertyOptional({ description: 'Itens por página' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pageSize?: number;
}
