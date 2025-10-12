import {
    IsString,
    IsInt,
    IsOptional,
    MaxLength,
    MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarComentarioDto {
    @ApiProperty()
    @IsInt()
    conteudoId: number;

    @ApiProperty()
    @IsString()
    @MinLength(3)
    @MaxLength(2000)
    conteudo: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    comentarioPaiId?: number;
}
