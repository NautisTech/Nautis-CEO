import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AtualizarSenhaDto {
    @ApiProperty()
    @IsString()
    @MinLength(6)
    @MaxLength(100)
    senhaAtual: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    @MaxLength(100)
    senhaNova: string;
}
