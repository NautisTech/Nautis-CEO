import { IsString, IsOptional, IsInt, MaxLength } from 'class-validator';

export class CriarBlocoDto {
    @IsInt()
    a_formacao_id: number;

    @IsString()
    @MaxLength(255)
    titulo: string;

    @IsOptional()
    @IsString()
    conteudo?: string;

    @IsString()
    @MaxLength(50)
    tipo: string;

    @IsInt()
    ordem: number;
}
