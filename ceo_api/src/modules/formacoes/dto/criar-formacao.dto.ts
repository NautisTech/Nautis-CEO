import { IsString, IsOptional, IsInt, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarFormacaoDto {
    @ApiProperty({ example: 'PHC Setup', description: 'Título da formação' })
    @IsString()
    @MaxLength(255)
    titulo: string;

    @ApiProperty({ example: 'Curso de configuração e inicialização do PHC CS Desktop', description: 'Descrição da formação' })
    @IsString()
    descricao: string;

    @ApiProperty({ example: 'Gestão', description: 'Categoria da formação' })
    @IsString()
    @MaxLength(100)
    categoria: string;

    @ApiProperty({ example: 'Iniciante', description: 'Nível da formação' })
    @IsString()
    @MaxLength(50)
    nivel: string;

    @ApiPropertyOptional({ example: 60, description: 'Duração em minutos' })
    @IsOptional()
    @IsInt()
    duracao_minutos?: number;

    @ApiPropertyOptional({ description: 'URL da imagem de capa' })
    @IsOptional()
    @IsString()
    capa_url?: string;

    @ApiProperty({ example: false, description: 'Se a formação está publicada' })
    @IsBoolean()
    publicado: boolean;
}
