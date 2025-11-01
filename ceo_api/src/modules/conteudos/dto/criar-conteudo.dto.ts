import {
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  IsDate,
  IsArray,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum StatusConteudo {
  RASCUNHO = 'rascunho',
  PUBLICADO = 'publicado',
  ARQUIVADO = 'arquivado',
  AGENDADO = 'agendado',
  EM_REVISAO = 'em_revisao',
}

export class CampoPersonalizadoDto {
  @ApiProperty()
  @IsString()
  codigo: string;

  @ApiProperty()
  @IsString()
  tipo: string;

  @ApiPropertyOptional()
  valor: any;
}

export class CriarConteudoDto {
  @ApiProperty()
  @IsInt()
  tipoConteudoId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  categoriaId?: number;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  titulo: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  subtitulo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  resumo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  conteudo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imagemDestaque?: string;

  @ApiPropertyOptional({ enum: StatusConteudo })
  @IsOptional()
  @IsEnum(StatusConteudo)
  status?: StatusConteudo;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  destaque?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  permiteComentarios?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dataInicio?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dataFim?: Date;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  anexosIds?: number[];

  @ApiPropertyOptional({ type: [CampoPersonalizadoDto] })
  @IsOptional()
  @IsArray()
  camposPersonalizados?: CampoPersonalizadoDto[];

  @ApiPropertyOptional({ type: [String], example: ['pt-PT', 'en'], description: 'Idiomas disponíveis para este conteúdo' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  idiomas?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaKeywords?: string;

  @ApiPropertyOptional({ description: 'Enviar notificação para newsletter ao publicar' })
  @IsOptional()
  @IsBoolean()
  publicarNewsletter?: boolean;
}
