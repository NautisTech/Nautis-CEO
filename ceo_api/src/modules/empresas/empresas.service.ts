import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../shared/base/base.service';
import { DatabaseService } from '../../database/database.service';
import { CriarEmpresaDto } from './dto/criar-empresa.dto';
import { AtualizarEmpresaDto } from './dto/atualizar-empresa.dto';
import * as sql from 'mssql';

@Injectable()
export class EmpresasService extends BaseService {
    constructor(databaseService: DatabaseService) {
        super(databaseService);
    }

    async criar(tenantId: number, dto: CriarEmpresaDto, utilizadorId?: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const request = pool.request();

        // Campos obrigatórios
        request.input('codigo', sql.NVarChar(50), dto.codigo);
        request.input('nome', sql.NVarChar(255), dto.nome);

        // Informação Fiscal e Legal
        request.input('nomeComercial', sql.NVarChar(255), dto.nomeComercial || null);
        request.input('nomeJuridico', sql.NVarChar(255), dto.nomeJuridico || null);
        request.input('tipoEmpresa', sql.NVarChar(50), dto.tipoEmpresa || 'cliente');
        request.input('naturezaJuridica', sql.NVarChar(100), dto.naturezaJuridica || null);
        request.input('capitalSocial', sql.Decimal(15, 2), dto.capitalSocial || null);
        request.input('nif', sql.NVarChar(50), dto.nif || null);
        request.input('numMatricula', sql.NVarChar(50), dto.numMatricula || null);
        request.input('dataConstituicao', sql.Date, dto.dataConstituicao ? new Date(dto.dataConstituicao) : null);

        // Contactos
        request.input('email', sql.NVarChar(255), dto.email || null);
        request.input('telefone', sql.NVarChar(50), dto.telefone || null);
        request.input('telemovel', sql.NVarChar(50), dto.telemovel || null);
        request.input('fax', sql.NVarChar(50), dto.fax || null);
        request.input('website', sql.NVarChar(255), dto.website || null);

        // Moradas
        request.input('moradaFiscal', sql.NVarChar(500), dto.moradaFiscal || null);
        request.input('codigoPostal', sql.NVarChar(20), dto.codigoPostal || null);
        request.input('localidade', sql.NVarChar(100), dto.localidade || null);
        request.input('distrito', sql.NVarChar(100), dto.distrito || null);
        request.input('pais', sql.NVarChar(100), dto.pais || 'Portugal');

        // Morada de Correspondência
        request.input('moradaCorrespondencia', sql.NVarChar(500), dto.moradaCorrespondencia || null);
        request.input('codigoPostalCorrespondencia', sql.NVarChar(20), dto.codigoPostalCorrespondencia || null);
        request.input('localidadeCorrespondencia', sql.NVarChar(100), dto.localidadeCorrespondencia || null);

        // Informação Comercial
        request.input('numCliente', sql.NVarChar(50), dto.numCliente || null);
        request.input('numFornecedor', sql.NVarChar(50), dto.numFornecedor || null);
        request.input('segmento', sql.NVarChar(100), dto.segmento || null);
        request.input('setorAtividade', sql.NVarChar(100), dto.setorAtividade || null);
        request.input('codigoCae', sql.NVarChar(20), dto.codigoCae || null);
        request.input('iban', sql.NVarChar(50), dto.iban || null);
        request.input('swiftBic', sql.NVarChar(20), dto.swiftBic || null);
        request.input('banco', sql.NVarChar(100), dto.banco || null);

        // Condições Comerciais
        request.input('condicoesPagamento', sql.NVarChar(100), dto.condicoesPagamento || null);
        request.input('metodoPagamentoPreferido', sql.NVarChar(50), dto.metodoPagamentoPreferido || null);
        request.input('limiteCredito', sql.Decimal(15, 2), dto.limiteCredito || null);
        request.input('descontoComercial', sql.Decimal(5, 2), dto.descontoComercial || null);

        // Representantes
        request.input('pessoaContacto', sql.NVarChar(255), dto.pessoaContacto || null);
        request.input('cargoContacto', sql.NVarChar(100), dto.cargoContacto || null);
        request.input('emailContacto', sql.NVarChar(255), dto.emailContacto || null);
        request.input('telefoneContacto', sql.NVarChar(50), dto.telefoneContacto || null);

        // Informação Adicional
        request.input('observacoes', sql.NVarChar(sql.MAX), dto.observacoes || null);
        request.input('tags', sql.NVarChar(500), dto.tags || null);
        request.input('rating', sql.Int, dto.rating || null);
        request.input('estado', sql.NVarChar(50), dto.estado || 'ativo');

        // Integração
        request.input('refExterna', sql.NVarChar(100), dto.refExterna || null);
        request.input('idPhc', sql.NVarChar(50), dto.idPhc || null);
        request.input('sincronizadoPhc', sql.Bit, dto.sincronizadoPhc || 0);

        // Campos originais
        request.input('logoUrl', sql.NVarChar(500), dto.logoUrl || null);
        request.input('cor', sql.NVarChar(20), dto.cor || null);

        // Auditoria
        request.input('criadoPor', sql.Int, utilizadorId || null);

        const result = await request.query(`
            INSERT INTO empresas (
                codigo, nome, nome_comercial, nome_juridico, tipo_empresa, natureza_juridica,
                capital_social, nif, num_matricula, data_constituicao,
                email, telefone, telemovel, fax, website,
                morada_fiscal, codigo_postal, localidade, distrito, pais,
                morada_correspondencia, codigo_postal_correspondencia, localidade_correspondencia,
                num_cliente, num_fornecedor, segmento, setor_atividade, codigo_cae,
                iban, swift_bic, banco,
                condicoes_pagamento, metodo_pagamento_preferido, limite_credito, desconto_comercial,
                pessoa_contacto, cargo_contacto, email_contacto, telefone_contacto,
                observacoes, tags, rating, estado,
                ref_externa, id_phc, sincronizado_phc,
                logo_url, cor, ativo, criado_por, criado_em
            )
            OUTPUT INSERTED.*
            VALUES (
                @codigo, @nome, @nomeComercial, @nomeJuridico, @tipoEmpresa, @naturezaJuridica,
                @capitalSocial, @nif, @numMatricula, @dataConstituicao,
                @email, @telefone, @telemovel, @fax, @website,
                @moradaFiscal, @codigoPostal, @localidade, @distrito, @pais,
                @moradaCorrespondencia, @codigoPostalCorrespondencia, @localidadeCorrespondencia,
                @numCliente, @numFornecedor, @segmento, @setorAtividade, @codigoCae,
                @iban, @swiftBic, @banco,
                @condicoesPagamento, @metodoPagamentoPreferido, @limiteCredito, @descontoComercial,
                @pessoaContacto, @cargoContacto, @emailContacto, @telefoneContacto,
                @observacoes, @tags, @rating, @estado,
                @refExterna, @idPhc, @sincronizadoPhc,
                @logoUrl, @cor, 1, @criadoPor, GETDATE()
            )
        `);

        return result.recordset[0];
    }

    async listar(tenantId: number, filtros?: {
        tipoEmpresa?: string;
        estado?: string;
        segmento?: string;
        search?: string;
    }) {
        let whereClause = 'WHERE 1=1';

        if (filtros?.tipoEmpresa) {
            whereClause += ` AND e.tipo_empresa = '${filtros.tipoEmpresa}'`;
        }
        if (filtros?.estado) {
            whereClause += ` AND e.estado = '${filtros.estado}'`;
        }
        if (filtros?.segmento) {
            whereClause += ` AND e.segmento = '${filtros.segmento}'`;
        }
        if (filtros?.search) {
            whereClause += ` AND (e.nome LIKE '%${filtros.search}%' OR e.nif LIKE '%${filtros.search}%' OR e.codigo LIKE '%${filtros.search}%')`;
        }

        const result = await this.executeQuery(
            tenantId,
            `
      SELECT
        e.*,
        (SELECT COUNT(*) FROM funcionarios WHERE empresa_id = e.id AND ativo = 1) AS total_funcionarios,
        (SELECT COUNT(*) FROM veiculos WHERE empresa_id = e.id AND em_circulacao = 1) AS total_veiculos,
        (SELECT COUNT(DISTINCT utilizador_id) FROM utilizador_empresa WHERE empresa_id = e.id) AS total_utilizadores
      FROM empresas e
      ${whereClause}
      ORDER BY e.nome
    `,
        );

        return result;
    }

    async obterPorId(tenantId: number, id: number) {
        const result = await this.executeQuery(
            tenantId,
            `
      SELECT
        e.*,
        (SELECT COUNT(*) FROM funcionarios WHERE empresa_id = e.id AND ativo = 1) AS total_funcionarios,
        (SELECT COUNT(*) FROM veiculos WHERE empresa_id = e.id AND em_circulacao = 1) AS total_veiculos,
        (SELECT COUNT(DISTINCT utilizador_id) FROM utilizador_empresa WHERE empresa_id = e.id) AS total_utilizadores
      FROM empresas e
      WHERE e.id = @id
    `,
            { id },
        );

        if (!result[0]) {
            throw new NotFoundException('Empresa não encontrada');
        }

        return result[0];
    }

    async atualizar(tenantId: number, id: number, dto: AtualizarEmpresaDto, utilizadorId?: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const request = pool.request().input('id', sql.Int, id);

        const updates: string[] = [];

        // Helper para adicionar campo ao update
        const addField = (field: string, value: any, sqlType: any) => {
            if (value !== undefined) {
                updates.push(`${field} = @${field}`);
                request.input(field, sqlType, value);
            }
        };

        // Campos obrigatórios
        addField('codigo', dto.codigo, sql.NVarChar(50));
        addField('nome', dto.nome, sql.NVarChar(255));

        // Informação Fiscal e Legal
        addField('nome_comercial', dto.nomeComercial, sql.NVarChar(255));
        addField('nome_juridico', dto.nomeJuridico, sql.NVarChar(255));
        addField('tipo_empresa', dto.tipoEmpresa, sql.NVarChar(50));
        addField('natureza_juridica', dto.naturezaJuridica, sql.NVarChar(100));
        addField('capital_social', dto.capitalSocial, sql.Decimal(15, 2));
        addField('nif', dto.nif, sql.NVarChar(50));
        addField('num_matricula', dto.numMatricula, sql.NVarChar(50));
        if (dto.dataConstituicao !== undefined) {
            addField('data_constituicao', dto.dataConstituicao ? new Date(dto.dataConstituicao) : null, sql.Date);
        }

        // Contactos
        addField('email', dto.email, sql.NVarChar(255));
        addField('telefone', dto.telefone, sql.NVarChar(50));
        addField('telemovel', dto.telemovel, sql.NVarChar(50));
        addField('fax', dto.fax, sql.NVarChar(50));
        addField('website', dto.website, sql.NVarChar(255));

        // Moradas
        addField('morada_fiscal', dto.moradaFiscal, sql.NVarChar(500));
        addField('codigo_postal', dto.codigoPostal, sql.NVarChar(20));
        addField('localidade', dto.localidade, sql.NVarChar(100));
        addField('distrito', dto.distrito, sql.NVarChar(100));
        addField('pais', dto.pais, sql.NVarChar(100));

        // Morada de Correspondência
        addField('morada_correspondencia', dto.moradaCorrespondencia, sql.NVarChar(500));
        addField('codigo_postal_correspondencia', dto.codigoPostalCorrespondencia, sql.NVarChar(20));
        addField('localidade_correspondencia', dto.localidadeCorrespondencia, sql.NVarChar(100));

        // Informação Comercial
        addField('num_cliente', dto.numCliente, sql.NVarChar(50));
        addField('num_fornecedor', dto.numFornecedor, sql.NVarChar(50));
        addField('segmento', dto.segmento, sql.NVarChar(100));
        addField('setor_atividade', dto.setorAtividade, sql.NVarChar(100));
        addField('codigo_cae', dto.codigoCae, sql.NVarChar(20));
        addField('iban', dto.iban, sql.NVarChar(50));
        addField('swift_bic', dto.swiftBic, sql.NVarChar(20));
        addField('banco', dto.banco, sql.NVarChar(100));

        // Condições Comerciais
        addField('condicoes_pagamento', dto.condicoesPagamento, sql.NVarChar(100));
        addField('metodo_pagamento_preferido', dto.metodoPagamentoPreferido, sql.NVarChar(50));
        addField('limite_credito', dto.limiteCredito, sql.Decimal(15, 2));
        addField('desconto_comercial', dto.descontoComercial, sql.Decimal(5, 2));

        // Representantes
        addField('pessoa_contacto', dto.pessoaContacto, sql.NVarChar(255));
        addField('cargo_contacto', dto.cargoContacto, sql.NVarChar(100));
        addField('email_contacto', dto.emailContacto, sql.NVarChar(255));
        addField('telefone_contacto', dto.telefoneContacto, sql.NVarChar(50));

        // Informação Adicional
        addField('observacoes', dto.observacoes, sql.NVarChar(sql.MAX));
        addField('tags', dto.tags, sql.NVarChar(500));
        addField('rating', dto.rating, sql.Int);
        addField('estado', dto.estado, sql.NVarChar(50));

        // Integração
        addField('ref_externa', dto.refExterna, sql.NVarChar(100));
        addField('id_phc', dto.idPhc, sql.NVarChar(50));
        addField('sincronizado_phc', dto.sincronizadoPhc, sql.Bit);

        // Campos originais
        addField('logo_url', dto.logoUrl, sql.NVarChar(500));
        addField('cor', dto.cor, sql.NVarChar(20));

        // Auditoria
        updates.push('atualizado_em = GETDATE()');
        if (utilizadorId) {
            updates.push('atualizado_por = @atualizadoPor');
            request.input('atualizadoPor', sql.Int, utilizadorId);
        }

        if (updates.length > 0) {
            await request.query(`
                UPDATE empresas
                SET ${updates.join(', ')}
                WHERE id = @id
            `);
        }

        return this.obterPorId(tenantId, id);
    }

    async obterEmpresasDoUtilizador(tenantId: number, utilizadorId: number) {
        const result = await this.executeProcedure(
            tenantId,
            'sp_ObterEmpresasUtilizador',
            { UtilizadorId: utilizadorId },
        );

        return result;
    }

    async associarUtilizadorEmpresa(
        tenantId: number,
        utilizadorId: number,
        empresaId: number,
        empresaPrincipal: boolean = false,
    ) {
        await this.executeProcedure(tenantId, 'sp_AssociarUtilizadorEmpresa', {
            UtilizadorId: utilizadorId,
            EmpresaId: empresaId,
            EmpresaPrincipal: empresaPrincipal ? 1 : 0,
        });

        return { success: true };
    }

    async obterEstatisticas(tenantId: number) {
        const result = await this.executeQuery(
            tenantId,
            `
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN tipo_empresa = 'cliente' THEN 1 ELSE 0 END) as total_clientes,
                SUM(CASE WHEN tipo_empresa = 'fornecedor' THEN 1 ELSE 0 END) as total_fornecedores,
                SUM(CASE WHEN tipo_empresa = 'parceiro' THEN 1 ELSE 0 END) as total_parceiros,
                SUM(CASE WHEN estado = 'ativo' THEN 1 ELSE 0 END) as total_ativos,
                SUM(CASE WHEN estado = 'inativo' THEN 1 ELSE 0 END) as total_inativos
            FROM empresas
            `,
        );

        return result[0];
    }
}
