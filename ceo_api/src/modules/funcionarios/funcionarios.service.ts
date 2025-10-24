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
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const transaction = new sql.Transaction(pool);

        try {
            await transaction.begin();

            // Hash da senha se criar utilizador
            let senhaHash: string | undefined;
            if (dto.criarUtilizador && dto.senha) {
                senhaHash = await bcrypt.hash(dto.senha, 10);
            }

            // Inserir funcionário
            const funcionarioResult = await new sql.Request(transaction)
                .input('numero', sql.Int, dto.numero)
                .input('tipoFuncionarioId', sql.Int, dto.tipoFuncionarioId)
                .input('nomeCompleto', sql.NVarChar, dto.nomeCompleto)
                .input('nomeAbreviado', sql.NVarChar, dto.nomeAbreviado)
                .input('sexo', sql.NVarChar, dto.sexo)
                .input('dataNascimento', sql.Date, dto.dataNascimento)
                .input('naturalidade', sql.NVarChar, dto.naturalidade)
                .input('nacionalidade', sql.NVarChar, dto.nacionalidade)
                .input('estadoCivil', sql.NVarChar, dto.estadoCivil)
                .query(`
                    INSERT INTO funcionarios
                        (numero, tipo_funcionario_id, nome_completo, nome_abreviado, sexo, data_nascimento,
                         naturalidade, nacionalidade, estado_civil, ativo)
                    OUTPUT INSERTED.id
                    VALUES
                        (@numero, @tipoFuncionarioId, @nomeCompleto, @nomeAbreviado, @sexo, @dataNascimento,
                         @naturalidade, @nacionalidade, @estadoCivil, 1)
                `);

            const funcionarioId = funcionarioResult.recordset[0].id;

            // Processar campos personalizados se fornecidos
            if (dto.camposCustomizados && dto.camposCustomizados.length > 0) {
                for (const campo of dto.camposCustomizados) {
                    const request = new sql.Request(transaction)
                        .input('funcionarioId', sql.Int, funcionarioId)
                        .input('codigoCampo', sql.NVarChar, campo.codigo)
                        .input('valorTexto', sql.NVarChar, null)
                        .input('valorNumero', sql.Decimal(18, 4), null)
                        .input('valorData', sql.Date, null)
                        .input('valorDatetime', sql.DateTime2, null)
                        .input('valorBoolean', sql.Bit, null)
                        .input('valorJson', sql.NVarChar, null);

                    // Determinar qual coluna usar baseado no tipo
                    switch (campo.tipo) {
                        case 'text':
                        case 'textarea':
                        case 'email':
                        case 'phone':
                        case 'url':
                            request.input('valorTexto', sql.NVarChar, campo.valor);
                            break;
                        case 'number':
                        case 'decimal':
                            request.input('valorNumero', sql.Decimal(18, 4), parseFloat(campo.valor));
                            break;
                        case 'date':
                            request.input('valorData', sql.Date, new Date(campo.valor));
                            break;
                        case 'datetime':
                            request.input('valorDatetime', sql.DateTime2, new Date(campo.valor));
                            break;
                        case 'boolean':
                            request.input('valorBoolean', sql.Bit, campo.valor ? 1 : 0);
                            break;
                        case 'json':
                            request.input('valorJson', sql.NVarChar, JSON.stringify(campo.valor));
                            break;
                    }

                    await request.query(`
                        INSERT INTO funcionarios_valores_personalizados
                            (funcionario_id, codigo_campo, valor_texto, valor_numero, valor_data, valor_datetime, valor_boolean, valor_json)
                        VALUES
                            (@funcionarioId, @codigoCampo, @valorTexto, @valorNumero, @valorData, @valorDatetime, @valorBoolean, @valorJson)
                    `);
                }
            }

            // Criar utilizador se solicitado
            let utilizadorId: number | undefined;
            if (dto.criarUtilizador && dto.email && senhaHash) {
                const username = dto.username || dto.email.substring(0, dto.email.indexOf('@'));

                const utilizadorResult = await new sql.Request(transaction)
                    .input('username', sql.NVarChar, username)
                    .input('email', sql.NVarChar, dto.email)
                    .input('senhaHash', sql.NVarChar, senhaHash)
                    .input('funcionarioId', sql.Int, funcionarioId)
                    .query(`
                        INSERT INTO utilizadores
                            (username, email, senha_hash, ativo, funcionario_id)
                        OUTPUT INSERTED.id
                        VALUES
                            (@username, @email, @senhaHash, 1, @funcionarioId)
                    `);

                utilizadorId = utilizadorResult.recordset[0].id;
            }

            await transaction.commit();

            return {
                funcionarioId,
                utilizadorId,
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
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
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const pageNumber = filters.page || 1;
        const pageSize = filters.pageSize || 50;
        const offset = (pageNumber - 1) * pageSize;

        // Construir query dinâmica com filtros
        let whereConditions: any[] = [];
        const request = pool.request();

        if (filters.tipoFuncionarioId !== undefined) {
            whereConditions.push('f.tipo_funcionario_id = @tipoFuncionarioId');
            request.input('tipoFuncionarioId', sql.Int, filters.tipoFuncionarioId);
        }

        if (filters.ativo !== undefined) {
            whereConditions.push('f.ativo = @ativo');
            request.input('ativo', sql.Bit, filters.ativo ? 1 : 0);
        }

        if (filters.textoPesquisa) {
            whereConditions.push("(f.nome_completo LIKE '%' + @textoPesquisa + '%' OR CAST(f.numero AS NVARCHAR) LIKE '%' + @textoPesquisa + '%')");
            request.input('textoPesquisa', sql.NVarChar, filters.textoPesquisa);
        }

        const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

        // Total de registros
        const countResult = await request.query(`
            SELECT COUNT(*) AS TotalRegistros
            FROM funcionarios f
            ${whereClause}
        `);

        // Dados paginados
        request.input('offset', sql.Int, offset);
        request.input('pageSize', sql.Int, pageSize);

        const dataResult = await request.query(`
            SELECT
                f.id,
                f.numero,
                f.nome_completo,
                f.nome_abreviado,
                f.sexo,
                f.data_nascimento,
                DATEDIFF(YEAR, f.data_nascimento, GETDATE()) AS idade,
                f.nacionalidade,
                f.ativo,
                tf.nome AS tipo_funcionario,
                tf.cor AS tipo_funcionario_cor,
                u.email,
                u.ativo AS tem_acesso,
                (SELECT COUNT(*) FROM empregos WHERE funcionario_id = f.id) AS total_empregos,
                (SELECT COUNT(*) FROM beneficios WHERE funcionario_id = f.id AND ativo = 1) AS total_beneficios_ativos,
                f.criado_em,
                f.atualizado_em
            FROM funcionarios f
            LEFT JOIN tipos_funcionarios tf ON f.tipo_funcionario_id = tf.id
            LEFT JOIN utilizadores u ON u.funcionario_id = f.id
            ${whereClause}
            ORDER BY f.nome_completo
            OFFSET @offset ROWS
            FETCH NEXT @pageSize ROWS ONLY
        `);

        return {
            data: dataResult.recordset,
            total: countResult.recordset[0].TotalRegistros,
            page: pageNumber,
            pageSize: pageSize,
        };
    }

    async obterPorId(tenantId: number, id: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Dados base do funcionário
        const funcionarioResult = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    f.*,
                    tf.nome AS tipo_funcionario_nome,
                    u.username,
                    u.email AS email_acesso
                FROM funcionarios f
                LEFT JOIN tipos_funcionarios tf ON f.tipo_funcionario_id = tf.id
                LEFT JOIN utilizadores u ON u.funcionario_id = f.id
                WHERE f.id = @id
            `);

        if (!funcionarioResult.recordset || funcionarioResult.recordset.length === 0) {
            throw new NotFoundException('Funcionário não encontrado');
        }

        // Campos personalizados
        const camposResult = await pool.request()
            .input('funcionarioId', sql.Int, id)
            .query(`
                SELECT
                    id,
                    funcionario_id,
                    codigo_campo,
                    codigo_campo AS nome_campo,
                    CASE
                        WHEN valor_texto IS NOT NULL THEN 'text'
                        WHEN valor_numero IS NOT NULL THEN 'number'
                        WHEN valor_data IS NOT NULL THEN 'date'
                        WHEN valor_datetime IS NOT NULL THEN 'datetime'
                        WHEN valor_boolean IS NOT NULL THEN 'boolean'
                        WHEN valor_json IS NOT NULL THEN 'json'
                        ELSE 'text'
                    END AS tipo_dados,
                    valor_texto,
                    valor_numero,
                    valor_data,
                    valor_datetime,
                    valor_boolean,
                    valor_json
                FROM funcionarios_valores_personalizados
                WHERE funcionario_id = @funcionarioId
            `);

        // Contatos
        const contatosResult = await pool.request()
            .input('funcionarioId', sql.Int, id)
            .query('SELECT * FROM contatos WHERE funcionario_id = @funcionarioId');

        // Endereços
        const enderecosResult = await pool.request()
            .input('funcionarioId', sql.Int, id)
            .query('SELECT * FROM enderecos WHERE funcionario_id = @funcionarioId');

        // Dependentes
        const dependentesResult = await pool.request()
            .input('funcionarioId', sql.Int, id)
            .query('SELECT * FROM dependentes WHERE funcionario_id = @funcionarioId');

        // Empregos
        const empregosResult = await pool.request()
            .input('funcionarioId', sql.Int, id)
            .query('SELECT * FROM empregos WHERE funcionario_id = @funcionarioId ORDER BY data_admissao DESC');

        // Benefícios
        const beneficiosResult = await pool.request()
            .input('funcionarioId', sql.Int, id)
            .query('SELECT * FROM beneficios WHERE funcionario_id = @funcionarioId AND ativo = 1');

        // Documentos
        const documentosResult = await pool.request()
            .input('funcionarioId', sql.Int, id)
            .query(`
                SELECT d.*, a.caminho, a.nome_original
                FROM documentos d
                LEFT JOIN anexos a ON d.anexo_id = a.id
                WHERE d.funcionario_id = @funcionarioId
            `);

        return {
            funcionario: funcionarioResult.recordset[0],
            camposCustomizados: camposResult.recordset || [],
            contatos: contatosResult.recordset || [],
            enderecos: enderecosResult.recordset || [],
            dependentes: dependentesResult.recordset || [],
            empregos: empregosResult.recordset || [],
            beneficios: beneficiosResult.recordset || [],
            documentos: documentosResult.recordset || [],
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
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Determinar qual coluna usar baseado no tipo
        const request = pool.request()
            .input('funcionarioId', sql.Int, funcionarioId)
            .input('codigoCampo', sql.NVarChar, campo.codigoCampo)
            .input('valorTexto', sql.NVarChar, null)
            .input('valorNumero', sql.Decimal(18, 4), null)
            .input('valorData', sql.Date, null)
            .input('valorDatetime', sql.DateTime2, null)
            .input('valorBoolean', sql.Bit, null)
            .input('valorJson', sql.NVarChar, null);

        switch (campo.tipoDados) {
            case 'text':
            case 'textarea':
            case 'email':
            case 'phone':
            case 'url':
                request.input('valorTexto', sql.NVarChar, campo.valor);
                break;
            case 'number':
            case 'decimal':
                request.input('valorNumero', sql.Decimal(18, 4), parseFloat(campo.valor));
                break;
            case 'date':
                request.input('valorData', sql.Date, new Date(campo.valor));
                break;
            case 'datetime':
                request.input('valorDatetime', sql.DateTime2, new Date(campo.valor));
                break;
            case 'boolean':
                request.input('valorBoolean', sql.Bit, campo.valor ? 1 : 0);
                break;
            case 'json':
                request.input('valorJson', sql.NVarChar, JSON.stringify(campo.valor));
                break;
        }

        // Verificar se já existe e fazer MERGE (upsert)
        await request.query(`
            MERGE INTO funcionarios_valores_personalizados AS target
            USING (SELECT @funcionarioId AS funcionario_id, @codigoCampo AS codigo_campo) AS source
            ON target.funcionario_id = source.funcionario_id AND target.codigo_campo = source.codigo_campo
            WHEN MATCHED THEN
                UPDATE SET
                    valor_texto = @valorTexto,
                    valor_numero = @valorNumero,
                    valor_data = @valorData,
                    valor_datetime = @valorDatetime,
                    valor_boolean = @valorBoolean,
                    valor_json = @valorJson,
                    atualizado_em = GETDATE()
            WHEN NOT MATCHED THEN
                INSERT (funcionario_id, codigo_campo, valor_texto, valor_numero, valor_data, valor_datetime, valor_boolean, valor_json)
                VALUES (@funcionarioId, @codigoCampo, @valorTexto, @valorNumero, @valorData, @valorDatetime, @valorBoolean, @valorJson);
        `);

        return { success: true };
    }
}