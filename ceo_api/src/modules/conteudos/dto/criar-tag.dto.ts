import {
    IsString,
    IsOptional,
    MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarTagDto {
    @ApiProperty()
    @IsString()
    @MaxLength(50)
    nome: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(50)
    slug?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(20)
    cor?: string;
}