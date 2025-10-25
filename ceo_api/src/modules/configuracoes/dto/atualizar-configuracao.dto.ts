import {
    IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AtualizarConfiguracaoDto {
    @ApiProperty()
    @IsString()
    codigo: string;

    @ApiProperty()
    @IsString()
    valor: string;
}