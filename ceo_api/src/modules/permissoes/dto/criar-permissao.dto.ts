import {
    IsString,
    IsOptional,
    IsEnum,
    MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TipoPermissao {
    CRIAR = 'Criar',
    LISTAR = 'Listar',
    VISUALIZAR = 'Visualizar',
    EDITAR = 'Editar',
    APAGAR = 'Apagar',
    EXPORTAR = 'Exportar',
    IMPORTAR = 'Importar',
    APROVAR = 'Aprovar',
    ATRIBUIR = 'Atribuir',
    CONCLUIR = 'Concluir',
    OUTRO = 'Outro',
}

export class CriarPermissaoDto {
    @ApiProperty()
    @IsString()
    @MaxLength(100)
    codigo: string;

    @ApiProperty()
    @IsString()
    @MaxLength(255)
    nome: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(500)
    descricao?: string;

    @ApiProperty()
    @IsString()
    @MaxLength(50)
    modulo: string;

    @ApiProperty({ enum: TipoPermissao })
    @IsEnum(TipoPermissao)
    tipo: TipoPermissao;
}
