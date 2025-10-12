import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CriarTenantDto } from './criar-tenant.dto';

export class AtualizarTenantDto extends PartialType(CriarTenantDto) {
    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    ativo?: boolean;
}