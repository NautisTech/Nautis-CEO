import { IsString, IsOptional, IsBoolean, IsInt, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarCategoriaDto {
    @ApiProperty({ example: 'Computadores', description: 'Nome da categoria' })
    @IsString()
    @MaxLength(100)
    nome: string;

    @ApiPropertyOptional({ example: 'Equipamentos de informática', description: 'Descrição da categoria' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    descricao?: string;

    @ApiPropertyOptional({ example: 'tabler-device-desktop', description: 'Ícone da categoria' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    icone?: string;

    @ApiPropertyOptional({ example: '#4CAF50', description: 'Cor da categoria' })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    cor?: string;

    @ApiPropertyOptional({ example: 1, description: 'ID da categoria pai (para hierarquia)' })
    @IsOptional()
    @IsInt()
    categoria_pai_id?: number;

    @ApiPropertyOptional({ example: true, description: 'Se a categoria está ativa' })
    @IsOptional()
    @IsBoolean()
    ativo?: boolean;
}
