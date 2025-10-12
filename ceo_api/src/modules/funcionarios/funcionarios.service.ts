import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../shared/base/base.service';
import { DatabaseService } from '../../database/database.service';
import { CriarFuncionarioDto } from './dto/criar-funcionario.dto';
import * as bcrypt from 'bcrypt';
import * as sql from 'mssql';

@Injectable()
export class FuncionariosService extends BaseService {
    constructor(databaseService: DatabaseService) {
        super(databaseService);
    }

    async criar(tenantId: number, dto: CriarFuncionarioDto) {
        // Hash da senha se criar utilizador
        let senhaHash: string | undefined;
        if (dto.criarUtilizador && dto.senha) {
            senhaHash = await bcrypt.hash(dto.senha, 10);
        }

        // Preparar campos customizados em JSON
        const camposCustomizadosJson = dto.camposCustomizados
            ? JSON.stringify(dto.camposCustomizados)
            : null;

        // Executar stored procedure
        const result = await this.executeProcedure(
            tenantId,
            'sp_CriarFuncionarioCompleto',
            {
                Numero: dto.numero,
                TipoFuncionarioId: dto.tipoFuncionarioId,
                NomeCompleto: dto.nomeCompleto,
                NomeAbreviado: dto.nomeAbreviado,
                Sexo: dto.sexo,
                DataNascimento: dto.dataNascimento,
                Naturalidade: dto.naturalidade,
                Nacionalidade: dto.nacionalidade,
                EstadoCivil: dto.estadoCivil,
                CamposCustomizados: camposCustomizadosJson,
                CriarUtilizador: dto.criarUtilizador ? 1 : 0,
                Username: dto.username,
                Email: dto.email,
                Senha: senhaHash,
            },
        );

        const response = result[0];

        if (response.Status === 'ERROR') {
            throw new Error(response.ErrorMessage);
        }

        return {
            funcionarioId: response.FuncionarioId,
            utilizadorId: response.UtilizadorId,
        };
    }

    async listar(
        tenantId: number,
        filters: {
            tipoFuncionarioId?: number;
            ativo?: boolean;
            empresaId?: number;
            textoPesquisa?: string;
            page?: number;
            pageSize?: number;
        },
    ) {
        const result = await this.executeProcedure(
            tenantId,
            'sp_ListarFuncionariosComAcesso',
            {
                UtilizadorId: filters.empresaId, // TODO: pegar do contexto
                EmpresaId: filters.empresaId,
                TextoPesquisa: filters.textoPesquisa,
                PageNumber: filters.page || 1,
                PageSize: filters.pageSize || 50,
            },
        );

        return result;
    }

    async obterPorId(tenantId: number, id: number) {
        const result = await this.executeProcedure(
            tenantId,
            'sp_ObterFuncionarioCompleto',
            {
                FuncionarioId: id,
            },
        );

        if (!result || result.length === 0) {
            throw new NotFoundException('Funcionário não encontrado');
        }

        // A SP retorna múltiplos resultsets
        return {
            funcionario: result[0],
            camposCustomizados: result[1] || [],
            contatos: result[2] || [],
            enderecos: result[3] || [],
            dependentes: result[4] || [],
            empregos: result[5] || [],
            beneficios: result[6] || [],
            documentos: result[7] || [],
        };
    }

    async salvarCampoCustomizado(
        tenantId: number,
        funcionarioId: number,
        campo: {
            codigoCampo: string;
            tipoDados: string;
            valor: any;
        },
    ) {
        // Determinar qual coluna usar baseado no tipo
        const params: any = {
            FuncionarioId: funcionarioId,
            CodigoCampo: campo.codigoCampo,
            TipoDados: campo.tipoDados,
            ValorTexto: null,
            ValorNumero: null,
            ValorData: null,
            ValorDatetime: null,
            ValorBoolean: null,
            ValorJson: null,
        };

        switch (campo.tipoDados) {
            case 'text':
            case 'textarea':
            case 'email':
            case 'phone':
            case 'url':
                params.ValorTexto = campo.valor;
                break;
            case 'number':
            case 'decimal':
                params.ValorNumero = parseFloat(campo.valor);
                break;
            case 'date':
                params.ValorData = new Date(campo.valor);
                break;
            case 'datetime':
                params.ValorDatetime = new Date(campo.valor);
                break;
            case 'boolean':
                params.ValorBoolean = campo.valor ? 1 : 0;
                break;
            case 'json':
                params.ValorJson = JSON.stringify(campo.valor);
                break;
        }

        await this.executeProcedure(
            tenantId,
            'sp_SalvarCampoCustomizadoFuncionario',
            params,
        );

        return { success: true };
    }
}