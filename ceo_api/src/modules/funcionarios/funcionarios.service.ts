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
                .input('fotoUrl', sql.NVarChar, dto.fotoUrl || null)
                .input('observacoes', sql.NVarChar, dto.observacoes || null)
                .query(`
                    INSERT INTO funcionarios
                        (numero, tipo_funcionario_id, nome_completo, nome_abreviado, sexo, data_nascimento,
                         naturalidade, nacionalidade, estado_civil, foto_url, observacoes, ativo)
                    OUTPUT INSERTED.id
                    VALUES
                        (@numero, @tipoFuncionarioId, @nomeCompleto, @nomeAbreviado, @sexo, @dataNascimento,
                         @naturalidade, @nacionalidade, @estadoCivil, @fotoUrl, @observacoes, 1)
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

            // Processar contatos
            if (dto.contatos && dto.contatos.length > 0) {
                for (const contato of dto.contatos) {
                    await new sql.Request(transaction)
                        .input('funcionarioId', sql.Int, funcionarioId)
                        .input('tipo', sql.NVarChar, contato.tipo)
                        .input('valor', sql.NVarChar, contato.valor)
                        .input('principal', sql.Bit, contato.principal ? 1 : 0)
                        .input('observacoes', sql.NVarChar, contato.observacoes || null)
                        .query(`
                            INSERT INTO contatos (funcionario_id, tipo, valor, principal, observacoes)
                            VALUES (@funcionarioId, @tipo, @valor, @principal, @observacoes)
                        `);
                }
            }

            // Processar endereços
            if (dto.enderecos && dto.enderecos.length > 0) {
                for (const endereco of dto.enderecos) {
                    await new sql.Request(transaction)
                        .input('funcionarioId', sql.Int, funcionarioId)
                        .input('tipo', sql.NVarChar, endereco.tipo)
                        .input('logradouro', sql.NVarChar, endereco.logradouro)
                        .input('numero', sql.NVarChar, endereco.numero || null)
                        .input('complemento', sql.NVarChar, endereco.complemento || null)
                        .input('bairro', sql.NVarChar, endereco.bairro || null)
                        .input('cidade', sql.NVarChar, endereco.cidade)
                        .input('estado', sql.NVarChar, endereco.estado || null)
                        .input('pais', sql.NVarChar, endereco.pais)
                        .input('codigoPostal', sql.NVarChar, endereco.codigo_postal || null)
                        .input('principal', sql.Bit, endereco.principal ? 1 : 0)
                        .query(`
                            INSERT INTO enderecos
                                (funcionario_id, tipo, logradouro, numero, complemento, bairro, cidade, estado, pais, codigo_postal, principal)
                            VALUES
                                (@funcionarioId, @tipo, @logradouro, @numero, @complemento, @bairro, @cidade, @estado, @pais, @codigoPostal, @principal)
                        `);
                }
            }

            // Processar empregos
            if (dto.empregos && dto.empregos.length > 0) {
                for (const emprego of dto.empregos) {
                    await new sql.Request(transaction)
                        .input('funcionarioId', sql.Int, funcionarioId)
                        .input('empresa', sql.NVarChar, emprego.empresa || null)
                        .input('dataAdmissao', sql.Date, emprego.data_admissao)
                        .input('dataDemissao', sql.Date, emprego.data_demissao || null)
                        .input('cargo', sql.NVarChar, emprego.cargo || null)
                        .input('departamento', sql.NVarChar, emprego.departamento || null)
                        .input('salarioBase', sql.Decimal(18, 2), emprego.salario_base || null)
                        .input('tipoContrato', sql.NVarChar, emprego.tipo_contrato || null)
                        .input('regimeTrabalho', sql.NVarChar, emprego.regime_trabalho || null)
                        .input('horasSemanais', sql.Int, emprego.horas_semanais || null)
                        .input('banco', sql.NVarChar, emprego.banco || null)
                        .input('agencia', sql.NVarChar, emprego.agencia || null)
                        .input('numeroConta', sql.NVarChar, emprego.numero_conta || null)
                        .input('situacao', sql.NVarChar, emprego.situacao || null)
                        .query(`
                            INSERT INTO empregos
                                (funcionario_id, empresa, data_admissao, data_demissao, cargo, departamento, salario_base,
                                 tipo_contrato, regime_trabalho, horas_semanais, banco, agencia, numero_conta, situacao)
                            VALUES
                                (@funcionarioId, @empresa, @dataAdmissao, @dataDemissao, @cargo, @departamento, @salarioBase,
                                 @tipoContrato, @regimeTrabalho, @horasSemanais, @banco, @agencia, @numeroConta, @situacao)
                        `);
                }
            }

            // Processar benefícios
            if (dto.beneficios && dto.beneficios.length > 0) {
                for (const beneficio of dto.beneficios) {
                    await new sql.Request(transaction)
                        .input('funcionarioId', sql.Int, funcionarioId)
                        .input('tipo', sql.NVarChar, beneficio.tipo)
                        .input('descricao', sql.NVarChar, beneficio.descricao || null)
                        .input('valor', sql.Decimal(18, 2), beneficio.valor || null)
                        .input('dataInicio', sql.Date, beneficio.data_inicio || null)
                        .input('dataFim', sql.Date, beneficio.data_fim || null)
                        .input('codigoPagamento', sql.NVarChar, beneficio.codigo_pagamento || null)
                        .input('numeroBeneficiario', sql.NVarChar, beneficio.numero_beneficiario || null)
                        .input('operadora', sql.NVarChar, beneficio.operadora || null)
                        .input('observacoes', sql.NVarChar, beneficio.observacoes || null)
                        .input('ativo', sql.Bit, beneficio.ativo ? 1 : 0)
                        .query(`
                            INSERT INTO beneficios
                                (funcionario_id, tipo, descricao, valor, data_inicio, data_fim, codigo_pagamento,
                                 numero_beneficiario, operadora, observacoes, ativo)
                            VALUES
                                (@funcionarioId, @tipo, @descricao, @valor, @dataInicio, @dataFim, @codigoPagamento,
                                 @numeroBeneficiario, @operadora, @observacoes, @ativo)
                        `);
                }
            }

            // Processar documentos
            if (dto.documentos && dto.documentos.length > 0) {
                for (const documento of dto.documentos) {
                    await new sql.Request(transaction)
                        .input('funcionarioId', sql.Int, funcionarioId)
                        .input('tipo', sql.NVarChar, documento.tipo)
                        .input('numero', sql.NVarChar, documento.numero)
                        .input('orgaoEmissor', sql.NVarChar, documento.orgao_emissor || null)
                        .input('vitalicio', sql.Bit, documento.vitalicio ? 1 : 0)
                        .input('dataEmissao', sql.Date, documento.data_emissao || null)
                        .input('dataValidade', sql.Date, documento.data_validade || null)
                        .input('detalhes', sql.NVarChar, documento.detalhes || null)
                        .query(`
                            INSERT INTO documentos
                                (funcionario_id, tipo, numero, orgao_emissor, vitalicio, data_emissao, data_validade, detalhes)
                            VALUES
                                (@funcionarioId, @tipo, @numero, @orgaoEmissor, @vitalicio, @dataEmissao, @dataValidade, @detalhes)
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

                // Criar contato de email principal
                await new sql.Request(transaction)
                    .input('funcionarioId', sql.Int, funcionarioId)
                    .input('tipo', sql.NVarChar, 'Email')
                    .input('valor', sql.NVarChar, dto.email)
                    .input('principal', sql.Bit, 1)
                    .query(`
                        INSERT INTO contatos (funcionario_id, tipo, valor, principal)
                        VALUES (@funcionarioId, @tipo, @valor, @principal)
                    `);
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
                f.foto_url,
                f.ativo,
                tf.nome AS tipo_funcionario,
                tf.nome AS tipo_funcionario_nome,
                tf.cor AS tipo_funcionario_cor,
                tf.icone AS tipo_funcionario_icone,
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
            .query('SELECT * FROM contatos WHERE funcionario_id = @funcionarioId ORDER BY tipo, valor');

        // Endereços
        const enderecosResult = await pool.request()
            .input('funcionarioId', sql.Int, id)
            .query('SELECT * FROM enderecos WHERE funcionario_id = @funcionarioId ORDER BY principal DESC, tipo');

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
            .query('SELECT * FROM beneficios WHERE funcionario_id = @funcionarioId ORDER BY data_inicio DESC');

        // Documentos
        const documentosResult = await pool.request()
            .input('funcionarioId', sql.Int, id)
            .query(`
                SELECT *
                FROM documentos
                WHERE funcionario_id = @funcionarioId
                ORDER BY tipo, numero
            `);

        // Flatten the structure - merge funcionario data with related data
        return {
            ...funcionarioResult.recordset[0],
            camposCustomizados: camposResult.recordset || [],
            contatos: contatosResult.recordset || [],
            enderecos: enderecosResult.recordset || [],
            dependentes: dependentesResult.recordset || [],
            empregos: empregosResult.recordset || [],
            beneficios: beneficiosResult.recordset || [],
            documentos: documentosResult.recordset || [],
        };
    }

    async atualizar(tenantId: number, id: number, dto: CriarFuncionarioDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        await pool.request()
            .input('id', sql.Int, id)
            .input('numero', sql.Int, dto.numero)
            .input('tipoFuncionarioId', sql.Int, dto.tipoFuncionarioId)
            .input('nomeCompleto', sql.NVarChar, dto.nomeCompleto)
            .input('nomeAbreviado', sql.NVarChar, dto.nomeAbreviado || null)
            .input('sexo', sql.NVarChar, dto.sexo || null)
            .input('dataNascimento', sql.Date, dto.dataNascimento || null)
            .input('naturalidade', sql.NVarChar, dto.naturalidade || null)
            .input('nacionalidade', sql.NVarChar, dto.nacionalidade || null)
            .input('estadoCivil', sql.NVarChar, dto.estadoCivil || null)
            .input('fotoUrl', sql.NVarChar, dto.fotoUrl || null)
            .input('observacoes', sql.NVarChar, dto.observacoes || null)
            .query(`
                UPDATE funcionarios
                SET numero = @numero,
                    tipo_funcionario_id = @tipoFuncionarioId,
                    nome_completo = @nomeCompleto,
                    nome_abreviado = @nomeAbreviado,
                    sexo = @sexo,
                    data_nascimento = @dataNascimento,
                    naturalidade = @naturalidade,
                    nacionalidade = @nacionalidade,
                    estado_civil = @estadoCivil,
                    foto_url = @fotoUrl,
                    observacoes = @observacoes,
                    atualizado_em = GETDATE()
                WHERE id = @id
            `);

        return { message: 'Funcionário atualizado com sucesso' };
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

    /**
     * Listar tipos de funcionário disponíveis para o tenant
     */
    async listarTiposFuncionario(tenantId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request().query(`
            SELECT
                id,
                codigo,
                nome,
                icone,
                cor,
                ativo
            FROM tipos_funcionarios
            WHERE ativo = 1
            ORDER BY nome ASC
        `);

        return result.recordset;
    }

    // ========== CONTATOS ==========
    async listarContatos(tenantId: number, funcionarioId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .input('funcionarioId', sql.Int, funcionarioId)
            .query('SELECT * FROM contatos WHERE funcionario_id = @funcionarioId ORDER BY tipo, valor');
        return result.recordset;
    }

    async criarContato(tenantId: number, data: any) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .input('funcionarioId', sql.Int, data.funcionario_id)
            .input('tipo', sql.NVarChar, data.tipo)
            .input('valor', sql.NVarChar, data.valor)
            .input('principal', sql.Bit, data.principal ? 1 : 0)
            .input('observacoes', sql.NVarChar, data.observacoes || null)
            .query(`
                INSERT INTO contatos (funcionario_id, tipo, valor, principal, observacoes)
                OUTPUT INSERTED.id
                VALUES (@funcionarioId, @tipo, @valor, @principal, @observacoes)
            `);
        return { id: result.recordset[0].id };
    }

    async atualizarContato(tenantId: number, id: number, data: any) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        await pool.request()
            .input('id', sql.Int, id)
            .input('tipo', sql.NVarChar, data.tipo)
            .input('valor', sql.NVarChar, data.valor)
            .input('principal', sql.Bit, data.principal ? 1 : 0)
            .input('observacoes', sql.NVarChar, data.observacoes || null)
            .query(`
                UPDATE contatos
                SET tipo = @tipo, valor = @valor, principal = @principal, observacoes = @observacoes, atualizado_em = GETDATE()
                WHERE id = @id
            `);
    }

    async deletarContato(tenantId: number, id: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM contatos WHERE id = @id');
    }

    // ========== ENDEREÇOS ==========
    async listarEnderecos(tenantId: number, funcionarioId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .input('funcionarioId', sql.Int, funcionarioId)
            .query('SELECT * FROM enderecos WHERE funcionario_id = @funcionarioId ORDER BY principal DESC, tipo');
        return result.recordset;
    }

    async criarEndereco(tenantId: number, data: any) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .input('funcionarioId', sql.Int, data.funcionario_id)
            .input('tipo', sql.NVarChar, data.tipo)
            .input('logradouro', sql.NVarChar, data.logradouro)
            .input('numero', sql.NVarChar, data.numero || null)
            .input('complemento', sql.NVarChar, data.complemento || null)
            .input('bairro', sql.NVarChar, data.bairro || null)
            .input('cidade', sql.NVarChar, data.cidade)
            .input('estado', sql.NVarChar, data.estado || null)
            .input('pais', sql.NVarChar, data.pais)
            .input('codigoPostal', sql.NVarChar, data.codigo_postal || null)
            .input('principal', sql.Bit, data.principal ? 1 : 0)
            .query(`
                INSERT INTO enderecos
                    (funcionario_id, tipo, logradouro, numero, complemento, bairro, cidade, estado, pais, codigo_postal, principal)
                OUTPUT INSERTED.id
                VALUES
                    (@funcionarioId, @tipo, @logradouro, @numero, @complemento, @bairro, @cidade, @estado, @pais, @codigoPostal, @principal)
            `);
        return { id: result.recordset[0].id };
    }

    async atualizarEndereco(tenantId: number, id: number, data: any) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        await pool.request()
            .input('id', sql.Int, id)
            .input('tipo', sql.NVarChar, data.tipo)
            .input('logradouro', sql.NVarChar, data.logradouro)
            .input('numero', sql.NVarChar, data.numero || null)
            .input('complemento', sql.NVarChar, data.complemento || null)
            .input('bairro', sql.NVarChar, data.bairro || null)
            .input('cidade', sql.NVarChar, data.cidade)
            .input('estado', sql.NVarChar, data.estado || null)
            .input('pais', sql.NVarChar, data.pais)
            .input('codigoPostal', sql.NVarChar, data.codigo_postal || null)
            .input('principal', sql.Bit, data.principal ? 1 : 0)
            .query(`
                UPDATE enderecos
                SET tipo = @tipo, logradouro = @logradouro, numero = @numero, complemento = @complemento,
                    bairro = @bairro, cidade = @cidade, estado = @estado, pais = @pais,
                    codigo_postal = @codigoPostal, principal = @principal, atualizado_em = GETDATE()
                WHERE id = @id
            `);
    }

    async deletarEndereco(tenantId: number, id: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM enderecos WHERE id = @id');
    }

    // ========== EMPREGOS ==========
    async listarEmpregos(tenantId: number, funcionarioId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .input('funcionarioId', sql.Int, funcionarioId)
            .query('SELECT * FROM empregos WHERE funcionario_id = @funcionarioId ORDER BY data_admissao DESC');
        return result.recordset;
    }

    async criarEmprego(tenantId: number, data: any) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .input('funcionarioId', sql.Int, data.funcionario_id)
            .input('empresa', sql.NVarChar, data.empresa || null)
            .input('dataAdmissao', sql.Date, data.data_admissao)
            .input('dataInicio', sql.Date, data.data_inicio)
            .input('dataFim', sql.Date, data.data_fim || null)
            .input('tipoContrato', sql.NVarChar, data.tipo_contrato || null)
            .input('cargo', sql.NVarChar, data.cargo || null)
            .input('departamento', sql.NVarChar, data.departamento || null)
            .input('categoria', sql.NVarChar, data.categoria || null)
            .input('nivelQualificacao', sql.NVarChar, data.nivel_qualificacao || null)
            .input('vencimentoBase', sql.Decimal(18, 2), data.vencimento_base || null)
            .input('cargaHoraria', sql.NVarChar, data.carga_horaria || null)
            .input('situacao', sql.NVarChar, data.situacao || null)
            .input('motivoDesligamento', sql.NVarChar, data.motivo_desligamento || null)
            .input('formaPagamento', sql.NVarChar, data.forma_pagamento || null)
            .input('banco', sql.NVarChar, data.banco || null)
            .input('agencia', sql.NVarChar, data.agencia || null)
            .input('conta', sql.NVarChar, data.conta || null)
            .input('iban', sql.NVarChar, data.iban || null)
            .input('observacoes', sql.NVarChar, data.observacoes || null)
            .query(`
                INSERT INTO empregos
                    (funcionario_id, empresa, data_admissao, data_inicio, data_fim, tipo_contrato, cargo, departamento,
                     categoria, nivel_qualificacao, vencimento_base, carga_horaria, situacao, motivo_desligamento,
                     forma_pagamento, banco, agencia, conta, iban, observacoes)
                OUTPUT INSERTED.id
                VALUES
                    (@funcionarioId, @empresa, @dataAdmissao, @dataInicio, @dataFim, @tipoContrato, @cargo, @departamento,
                     @categoria, @nivelQualificacao, @vencimentoBase, @cargaHoraria, @situacao, @motivoDesligamento,
                     @formaPagamento, @banco, @agencia, @conta, @iban, @observacoes)
            `);
        return { id: result.recordset[0].id };
    }

    async atualizarEmprego(tenantId: number, id: number, data: any) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        await pool.request()
            .input('id', sql.Int, id)
            .input('empresa', sql.NVarChar, data.empresa || null)
            .input('dataAdmissao', sql.Date, data.data_admissao)
            .input('dataInicio', sql.Date, data.data_inicio)
            .input('dataFim', sql.Date, data.data_fim || null)
            .input('tipoContrato', sql.NVarChar, data.tipo_contrato || null)
            .input('cargo', sql.NVarChar, data.cargo || null)
            .input('departamento', sql.NVarChar, data.departamento || null)
            .input('categoria', sql.NVarChar, data.categoria || null)
            .input('nivelQualificacao', sql.NVarChar, data.nivel_qualificacao || null)
            .input('vencimentoBase', sql.Decimal(18, 2), data.vencimento_base || null)
            .input('cargaHoraria', sql.NVarChar, data.carga_horaria || null)
            .input('situacao', sql.NVarChar, data.situacao || null)
            .input('motivoDesligamento', sql.NVarChar, data.motivo_desligamento || null)
            .input('formaPagamento', sql.NVarChar, data.forma_pagamento || null)
            .input('banco', sql.NVarChar, data.banco || null)
            .input('agencia', sql.NVarChar, data.agencia || null)
            .input('conta', sql.NVarChar, data.conta || null)
            .input('iban', sql.NVarChar, data.iban || null)
            .input('observacoes', sql.NVarChar, data.observacoes || null)
            .query(`
                UPDATE empregos
                SET empresa = @empresa, data_admissao = @dataAdmissao, data_inicio = @dataInicio, data_fim = @dataFim,
                    tipo_contrato = @tipoContrato, cargo = @cargo, departamento = @departamento, categoria = @categoria,
                    nivel_qualificacao = @nivelQualificacao, vencimento_base = @vencimentoBase, carga_horaria = @cargaHoraria,
                    situacao = @situacao, motivo_desligamento = @motivoDesligamento, forma_pagamento = @formaPagamento,
                    banco = @banco, agencia = @agencia, conta = @conta, iban = @iban, observacoes = @observacoes,
                    atualizado_em = GETDATE()
                WHERE id = @id
            `);
    }

    async deletarEmprego(tenantId: number, id: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM empregos WHERE id = @id');
    }

    // ========== BENEFÍCIOS ==========
    async listarBeneficios(tenantId: number, funcionarioId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .input('funcionarioId', sql.Int, funcionarioId)
            .query('SELECT * FROM beneficios WHERE funcionario_id = @funcionarioId ORDER BY data_inicio DESC');
        return result.recordset;
    }

    async criarBeneficio(tenantId: number, data: any) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .input('funcionarioId', sql.Int, data.funcionario_id)
            .input('tipo', sql.NVarChar, data.tipo)
            .input('descricao', sql.NVarChar, data.descricao || null)
            .input('valor', sql.Decimal(18, 2), data.valor || null)
            .input('dataInicio', sql.Date, data.data_inicio || null)
            .input('dataFim', sql.Date, data.data_fim || null)
            .input('codigoPagamento', sql.NVarChar, data.codigo_pagamento || null)
            .input('numeroBeneficiario', sql.NVarChar, data.numero_beneficiario || null)
            .input('operadora', sql.NVarChar, data.operadora || null)
            .input('observacoes', sql.NVarChar, data.observacoes || null)
            .input('ativo', sql.Bit, data.ativo ? 1 : 0)
            .query(`
                INSERT INTO beneficios
                    (funcionario_id, tipo, descricao, valor, data_inicio, data_fim, codigo_pagamento,
                     numero_beneficiario, operadora, observacoes, ativo)
                OUTPUT INSERTED.id
                VALUES
                    (@funcionarioId, @tipo, @descricao, @valor, @dataInicio, @dataFim, @codigoPagamento,
                     @numeroBeneficiario, @operadora, @observacoes, @ativo)
            `);
        return { id: result.recordset[0].id };
    }

    async atualizarBeneficio(tenantId: number, id: number, data: any) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        await pool.request()
            .input('id', sql.Int, id)
            .input('tipo', sql.NVarChar, data.tipo)
            .input('descricao', sql.NVarChar, data.descricao || null)
            .input('valor', sql.Decimal(18, 2), data.valor || null)
            .input('dataInicio', sql.Date, data.data_inicio || null)
            .input('dataFim', sql.Date, data.data_fim || null)
            .input('codigoPagamento', sql.NVarChar, data.codigo_pagamento || null)
            .input('numeroBeneficiario', sql.NVarChar, data.numero_beneficiario || null)
            .input('operadora', sql.NVarChar, data.operadora || null)
            .input('observacoes', sql.NVarChar, data.observacoes || null)
            .input('ativo', sql.Bit, data.ativo ? 1 : 0)
            .query(`
                UPDATE beneficios
                SET tipo = @tipo, descricao = @descricao, valor = @valor, data_inicio = @dataInicio,
                    data_fim = @dataFim, codigo_pagamento = @codigoPagamento, numero_beneficiario = @numeroBeneficiario,
                    operadora = @operadora, observacoes = @observacoes, ativo = @ativo, atualizado_em = GETDATE()
                WHERE id = @id
            `);
    }

    async deletarBeneficio(tenantId: number, id: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM beneficios WHERE id = @id');
    }

    // ========== DOCUMENTOS ==========
    async listarDocumentos(tenantId: number, funcionarioId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .input('funcionarioId', sql.Int, funcionarioId)
            .query(`
                SELECT *
                FROM documentos
                WHERE funcionario_id = @funcionarioId
                ORDER BY tipo, numero
            `);
        return result.recordset;
    }

    async criarDocumento(tenantId: number, data: any) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .input('funcionarioId', sql.Int, data.funcionario_id)
            .input('tipo', sql.NVarChar, data.tipo)
            .input('numero', sql.NVarChar, data.numero)
            .input('orgaoEmissor', sql.NVarChar, data.orgao_emissor || null)
            .input('vitalicio', sql.Bit, data.vitalicio ? 1 : 0)
            .input('dataEmissao', sql.Date, data.data_emissao || null)
            .input('dataValidade', sql.Date, data.data_validade || null)
            .input('detalhes', sql.NVarChar, data.detalhes || null)
            .input('anexoUrl', sql.NVarChar, data.anexo_url || null)
            .query(`
                INSERT INTO documentos
                    (funcionario_id, tipo, numero, orgao_emissor, vitalicio, data_emissao, data_validade, detalhes, anexo_url)
                OUTPUT INSERTED.id
                VALUES
                    (@funcionarioId, @tipo, @numero, @orgaoEmissor, @vitalicio, @dataEmissao, @dataValidade, @detalhes, @anexoUrl)
            `);
        return { id: result.recordset[0].id };
    }

    async atualizarDocumento(tenantId: number, id: number, data: any) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        await pool.request()
            .input('id', sql.Int, id)
            .input('tipo', sql.NVarChar, data.tipo)
            .input('numero', sql.NVarChar, data.numero)
            .input('orgaoEmissor', sql.NVarChar, data.orgao_emissor || null)
            .input('vitalicio', sql.Bit, data.vitalicio ? 1 : 0)
            .input('dataEmissao', sql.Date, data.data_emissao || null)
            .input('dataValidade', sql.Date, data.data_validade || null)
            .input('detalhes', sql.NVarChar, data.detalhes || null)
            .input('anexoUrl', sql.NVarChar, data.anexo_url || null)
            .query(`
                UPDATE documentos
                SET tipo = @tipo, numero = @numero, orgao_emissor = @orgaoEmissor, vitalicio = @vitalicio,
                    data_emissao = @dataEmissao, data_validade = @dataValidade, detalhes = @detalhes,
                    anexo_url = @anexoUrl, atualizado_em = GETDATE()
                WHERE id = @id
            `);
    }

    async deletarDocumento(tenantId: number, id: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM documentos WHERE id = @id');
    }
}