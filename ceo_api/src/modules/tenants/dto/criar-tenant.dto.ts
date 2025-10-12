import {
    IsString,
    IsOptional,
    MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarTenantDto {
    @ApiProperty()
    @IsString()
    @MaxLength(255)
    nome: string;

    @ApiProperty()
    @IsString()
    @MaxLength(100)
    slug: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(255)
    dominio?: string;

    @ApiProperty()
    @IsString()
    @MaxLength(255)
    databaseName: string;
}