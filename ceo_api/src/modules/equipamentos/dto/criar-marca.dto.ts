import { IsString, IsOptional, IsBoolean, IsUrl, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarMarcaDto {
    @ApiProperty({ example: 'HP', description: 'Nome da marca' })
    @IsString()
    @MaxLength(100)
    nome: string;

    @ApiPropertyOptional({ example: 'https://example.com/logo.png', description: 'URL do logo da marca' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    logo_url?: string;

    @ApiPropertyOptional({ example: 'https://www.hp.com', description: 'Website da marca' })
    @IsOptional()
    @IsUrl()
    @MaxLength(255)
    website?: string;

    @ApiPropertyOptional({ example: true, description: 'Se a marca está ativa' })
    @IsOptional()
    @IsBoolean()
    ativo?: boolean;
}
