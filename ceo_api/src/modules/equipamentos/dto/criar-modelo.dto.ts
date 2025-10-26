import { IsString, IsOptional, IsBoolean, IsInt, IsNumber, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarModeloDto {
    @ApiProperty({ example: 1, description: 'ID da marca' })
    @IsInt()
    marca_id: number;

    @ApiProperty({ example: 1, description: 'ID da categoria' })
    @IsInt()
    categoria_id: number;

    @ApiProperty({ example: 'EliteBook 840 G8', description: 'Nome do modelo' })
    @IsString()
    @MaxLength(200)
    nome: string;

    @ApiPropertyOptional({ example: 'EB840G8', description: 'Código do modelo' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    codigo?: string;

    @ApiPropertyOptional({ example: 'Notebook corporativo de alta performance', description: 'Descrição do modelo' })
    @IsOptional()
    @IsString()
    descricao?: string;

    @ApiPropertyOptional({
        example: 'Intel i7, 16GB RAM, SSD 512GB',
        description: 'Especificações técnicas'
    })
    @IsOptional()
    @IsString()
    especificacoes?: string;

    @ApiPropertyOptional({ example: 'https://example.com/image.jpg', description: 'URL da imagem' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    imagem_url?: string;

    @ApiPropertyOptional({ example: 'https://example.com/manual.pdf', description: 'URL do manual' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    manual_url?: string;

    @ApiPropertyOptional({ example: 'MDL-001', description: 'Código de leitura para identificação' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    codigo_leitura?: string;

    @ApiPropertyOptional({ example: 'qrcode', description: 'Tipo de leitura (qrcode, barcode, rfid, etc)' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    tipo_leitura?: string;

    @ApiPropertyOptional({ example: true, description: 'Se o modelo está ativo' })
    @IsOptional()
    @IsBoolean()
    ativo?: boolean;
}
