import { IsString, IsOptional, IsBoolean, IsUrl, IsEmail, MaxLength } from 'class-validator';
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

    @ApiPropertyOptional({ example: 'qr', description: 'Código de leitura para identificação' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    codigo_leitura?: string;

    @ApiPropertyOptional({ example: 'qrcode', description: 'Tipo de leitura (qrcode, barcode, rfid, etc)' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    tipo_leitura?: string;

    @ApiPropertyOptional({ example: 'suporte@hp.com', description: 'Email de suporte da marca' })
    @IsOptional()
    @IsEmail()
    @MaxLength(255)
    email_suporte?: string;

    @ApiPropertyOptional({ example: '+351 123 456 789', description: 'Telefone de suporte da marca' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    telefone_suporte?: string;

    @ApiPropertyOptional({ example: 'https://support.hp.com', description: 'Link para suporte da marca' })
    @IsOptional()
    @IsUrl()
    @MaxLength(500)
    link_suporte?: string;

    @ApiPropertyOptional({ example: true, description: 'Se a marca está ativa' })
    @IsOptional()
    @IsBoolean()
    ativo?: boolean;
}
