import {
    IsString,
    IsOptional,
    MaxLength,
    IsEmail,
    IsDecimal,
    IsInt,
    Min,
    Max,
    IsDateString,
    IsIn,
    IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarEmpresaDto {
    @ApiProperty({ example: 'EMP001', description: 'Código único da empresa' })
    @IsString()
    @MaxLength(50)
    codigo: string;

    @ApiProperty({ example: 'Microlopes LDA', description: 'Nome da empresa' })
    @IsString()
    @MaxLength(255)
    nome: string;

    // Informação Fiscal e Legal
    @ApiPropertyOptional({ example: 'Microlopes', description: 'Nome comercial' })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    nomeComercial?: string;

    @ApiPropertyOptional({ example: 'Microlopes - Comércio e Serviços, LDA', description: 'Nome jurídico completo' })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    nomeJuridico?: string;

    @ApiPropertyOptional({ enum: ['cliente', 'fornecedor', 'parceiro', 'interno'], example: 'cliente' })
    @IsOptional()
    @IsString()
    @IsIn(['cliente', 'fornecedor', 'parceiro', 'interno'])
    tipoEmpresa?: string;

    @ApiPropertyOptional({ example: 'LDA', description: 'Natureza jurídica (LDA, SA, Unipessoal, ENI)' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    naturezaJuridica?: string;

    @ApiPropertyOptional({ example: 50000.00, description: 'Capital social' })
    @IsOptional()
    @IsDecimal()
    capitalSocial?: number;

    @ApiPropertyOptional({ example: '123456789', description: 'NIF/NIPC' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    nif?: string;

    @ApiPropertyOptional({ example: '1234/567890', description: 'Número de matrícula na conservatória' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    numMatricula?: string;

    @ApiPropertyOptional({ example: '2020-01-15', description: 'Data de constituição' })
    @IsOptional()
    @IsDateString()
    dataConstituicao?: string;

    // Contactos
    @ApiPropertyOptional({ example: 'geral@microlopes.pt' })
    @IsOptional()
    @IsEmail()
    @MaxLength(255)
    email?: string;

    @ApiPropertyOptional({ example: '252123456' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    telefone?: string;

    @ApiPropertyOptional({ example: '912345678' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    telemovel?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(50)
    fax?: string;

    @ApiPropertyOptional({ example: 'https://www.microlopes.pt' })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    website?: string;

    // Moradas
    @ApiPropertyOptional({ example: 'Rua da Empresa, nº 123' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    moradaFiscal?: string;

    @ApiPropertyOptional({ example: '4900-123' })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    codigoPostal?: string;

    @ApiPropertyOptional({ example: 'Viana do Castelo' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    localidade?: string;

    @ApiPropertyOptional({ example: 'Viana do Castelo' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    distrito?: string;

    @ApiPropertyOptional({ example: 'Portugal' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    pais?: string;

    // Morada de Correspondência
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(500)
    moradaCorrespondencia?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(20)
    codigoPostalCorrespondencia?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(100)
    localidadeCorrespondencia?: string;

    // Informação Comercial
    @ApiPropertyOptional({ example: 'CLI001' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    numCliente?: string;

    @ApiPropertyOptional({ example: 'FOR001' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    numFornecedor?: string;

    @ApiPropertyOptional({ example: 'Tecnologia' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    segmento?: string;

    @ApiPropertyOptional({ example: 'Comércio a retalho' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    setorAtividade?: string;

    @ApiPropertyOptional({ example: '47190' })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    codigoCae?: string;

    @ApiPropertyOptional({ example: 'PT50123456789012345678901' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    iban?: string;

    @ApiPropertyOptional({ example: 'BBPIPTPL' })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    swiftBic?: string;

    @ApiPropertyOptional({ example: 'Millennium BCP' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    banco?: string;

    // Condições Comerciais
    @ApiPropertyOptional({ example: '30 dias', description: 'Pronto Pagamento, 30 dias, 60 dias, 90 dias' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    condicoesPagamento?: string;

    @ApiPropertyOptional({ example: 'Transferência', description: 'Transferência, Multibanco, Cheque, Dinheiro' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    metodoPagamentoPreferido?: string;

    @ApiPropertyOptional({ example: 10000.00 })
    @IsOptional()
    @IsDecimal()
    limiteCredito?: number;

    @ApiPropertyOptional({ example: 5.5, description: 'Percentagem de desconto' })
    @IsOptional()
    @IsDecimal()
    descontoComercial?: number;

    // Representantes/Contactos
    @ApiPropertyOptional({ example: 'João Silva' })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    pessoaContacto?: string;

    @ApiPropertyOptional({ example: 'Diretor Comercial' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    cargoContacto?: string;

    @ApiPropertyOptional({ example: 'joao.silva@microlopes.pt' })
    @IsOptional()
    @IsEmail()
    @MaxLength(255)
    emailContacto?: string;

    @ApiPropertyOptional({ example: '912345678' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    telefoneContacto?: string;

    // Informação Adicional
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    observacoes?: string;

    @ApiPropertyOptional({ example: 'vip,prioritario' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    tags?: string;

    @ApiPropertyOptional({ example: 5, minimum: 1, maximum: 5 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    rating?: number;

    @ApiPropertyOptional({ enum: ['ativo', 'inativo', 'pendente', 'suspenso'], example: 'ativo' })
    @IsOptional()
    @IsString()
    @IsIn(['ativo', 'inativo', 'pendente', 'suspenso'])
    estado?: string;

    // Integração
    @ApiPropertyOptional({ example: 'EXT123' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    refExterna?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(50)
    idPhc?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    sincronizadoPhc?: boolean;

    // Campos originais
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    logoUrl?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(20)
    cor?: string;
}