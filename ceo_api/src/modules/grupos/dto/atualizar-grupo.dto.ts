import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CriarGrupoDto } from './criar-grupo.dto';

export class AtualizarGrupoDto extends PartialType(CriarGrupoDto) {
    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    ativo?: boolean;
}