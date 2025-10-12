import { IsOptional, IsInt, IsString, IsEnum, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { StatusConteudo } from './criar-conteudo.dto';

export class FiltrarConteudosDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    tipoConteudoId?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    categoriaId?: number;

    @ApiPropertyOptional({ enum: StatusConteudo })
    @IsOptional()
    @IsEnum(StatusConteudo)
    status?: StatusConteudo;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    destaque?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    textoPesquisa?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    tag?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    autorId?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    page?: number = 1;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    pageSize?: number = 20;
}