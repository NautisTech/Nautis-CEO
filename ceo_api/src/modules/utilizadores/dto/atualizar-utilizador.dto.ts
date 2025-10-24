import {
    IsString,
    IsEmail,
    IsOptional,
    MaxLength,
    IsBoolean,
    MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AtualizarUtilizadorDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(100)
    username?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    @MaxLength(255)
    email?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(50)
    telefone?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(500)
    foto_url?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    ativo?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    email_verificado?: boolean;
}
