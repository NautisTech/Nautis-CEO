import { IsString, IsOptional, IsInt, IsBoolean, MaxLength, Min, Max } from 'class-validator';

export class CriarQuizDto {
    @IsInt()
    formacao_id: number;

    @IsString()
    @MaxLength(255)
    titulo: string;

    @IsOptional()
    @IsString()
    descricao?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    tempo_limite_minutos?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(100)
    nota_minima_aprovacao?: number;

    @IsOptional()
    @IsBoolean()
    mostrar_resultados?: boolean;

    @IsOptional()
    @IsBoolean()
    permitir_tentativas_multiplas?: boolean;

    @IsOptional()
    @IsInt()
    @Min(1)
    max_tentativas?: number;

    @IsOptional()
    @IsBoolean()
    ativo?: boolean;
}
