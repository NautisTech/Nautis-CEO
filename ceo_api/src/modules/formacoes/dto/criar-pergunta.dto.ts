import { IsString, IsOptional, IsInt, IsIn, IsArray, ValidateNested, IsBoolean, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class OpcaoRespostaDto {
    @IsString()
    @MaxLength(500)
    texto: string;

    @IsBoolean()
    correta: boolean;

    @IsInt()
    ordem: number;
}

export class CriarPerguntaDto {
    @IsInt()
    quiz_id: number;

    @IsString()
    @IsIn(['multipla', 'aberta'])
    tipo: 'multipla' | 'aberta';

    @IsString()
    enunciado: string;

    @IsInt()
    @Min(1)
    pontuacao: number;

    @IsInt()
    ordem: number;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OpcaoRespostaDto)
    opcoes?: OpcaoRespostaDto[];
}
