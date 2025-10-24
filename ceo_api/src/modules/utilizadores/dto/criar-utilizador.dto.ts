import {
    IsString,
    IsEmail,
    IsOptional,
    IsArray,
    IsInt,
    MinLength,
    MaxLength,
    IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarUtilizadorDto {
    @ApiProperty()
    @IsString()
    @MaxLength(100)
    username: string;

    @ApiProperty()
    @IsEmail()
    @MaxLength(255)
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    @MaxLength(100)
    senha: string;

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

    @ApiPropertyOptional({ type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    gruposIds?: number[];

    @ApiPropertyOptional({ type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    permissoesIds?: number[];

    @ApiPropertyOptional({ type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    empresasIds?: number[];
}
