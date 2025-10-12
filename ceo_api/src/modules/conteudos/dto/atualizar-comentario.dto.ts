import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AtualizarComentarioDto {
    @ApiProperty()
    @IsString()
    @MinLength(3)
    @MaxLength(2000)
    conteudo: string;
}