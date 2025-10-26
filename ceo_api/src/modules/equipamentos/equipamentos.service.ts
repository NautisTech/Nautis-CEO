import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CriarEquipamentoDto } from './dto/criar-equipamento.dto';
import * as sql from 'mssql';

interface FiltrosEquipamento {
    modeloId?: number;
    responsavelId?: number;
    utilizadorId?: number;
    estado?: string;
    page?: number;
    pageSize?: number;
}

@Injectable()
export class EquipamentosService {
    constructor(private readonly databaseService: DatabaseService) { }

    async listar(tenantId: number, filtros: FiltrosEquipamento = {}) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const conditions: any[] = [];
        if (filtros.modeloId) conditions.push('e.modelo_id = @modeloId');
        if (filtros.responsavelId) conditions.push('e.responsavel_id = @responsavelId');
        if (filtros.utilizadorId) conditions.push('e.utilizador_id = @utilizadorId');
        if (filtros.estado) conditions.push('e.estado = @estado');

        const whereClause = conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';

        const request = pool.request();
        if (filtros.modeloId) request.input('modeloId', sql.Int, filtros.modeloId);
        if (filtros.responsavelId) request.input('responsavelId', sql.Int, filtros.responsavelId);
        if (filtros.utilizadorId) request.input('utilizadorId', sql.Int, filtros.utilizadorId);
        if (filtros.estado) request.input('estado', sql.NVarChar, filtros.estado);

        const selectFields = `
            e.id,
            e.modelo_id,
            m.nome AS modelo_nome,
            m.codigo AS modelo_codigo,
            m.marca_id,
            ma.nome AS marca_nome,
            ma.logo_url AS marca_logo,
            m.categoria_id,
            c.nome AS categoria_nome,
            c.icone AS categoria_icone,
            c.cor AS categoria_cor,
            e.responsavel_id,
            f.nome_completo AS responsavel_nome,
            e.utilizador_id,
            e.localizacao,
            e.numero_serie,
            e.numero_interno,
            e.descricao,
            e.data_aquisicao,
            e.valor_aquisicao,
            e.fornecedor,
            e.data_garantia,
            e.data_proxima_manutencao,
            e.estado,
            e.observacoes,
            e.foto_url,
            e.ativo,
            e.criado_em,
            e.atualizado_em
        `;

        const fromClause = `
            FROM equipamentos e
            INNER JOIN modelos_equipamento m ON e.modelo_id = m.id
            INNER JOIN marcas ma ON m.marca_id = ma.id
            INNER JOIN categorias_equipamento c ON m.categoria_id = c.id
            LEFT JOIN funcionarios f ON e.responsavel_id = f.id
        `;

        const orderBy = ' ORDER BY e.numero_interno, e.numero_serie';

        // Se não houver paginação, retornar todos
        if (!filtros.page || !filtros.pageSize) {
            const query = `SELECT ${selectFields} ${fromClause} ${whereClause} ${orderBy}`;
            const result = await request.query(query);
            return result.recordset;
        }

        // Com paginação
        const page = filtros.page;
        const pageSize = filtros.pageSize;
        const offset = (page - 1) * pageSize;

        request.input('offset', sql.Int, offset);
        request.input('pageSize', sql.Int, pageSize);

        // Contar total
        const countQuery = `SELECT COUNT(*) as total ${fromClause} ${whereClause}`;
        const countResult = await request.query(countQuery);
        const total = countResult.recordset[0].total;

        // Buscar dados paginados
        const dataQuery = `
            SELECT ${selectFields}
            ${fromClause}
            ${whereClause}
            ${orderBy}
            OFFSET @offset ROWS
            FETCH NEXT @pageSize ROWS ONLY
        `;
        const dataResult = await request.query(dataQuery);

        return {
            data: dataResult.recordset,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        };
    }

    async obterPorId(id: number, tenantId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    e.id,
                    e.modelo_id,
                    m.nome AS modelo_nome,
                    m.codigo AS modelo_codigo,
                    m.imagem_url AS modelo_imagem,
                    m.marca_id,
                    ma.nome AS marca_nome,
                    ma.logo_url AS marca_logo,
                    m.categoria_id,
                    c.nome AS categoria_nome,
                    c.icone AS categoria_icone,
                    c.cor AS categoria_cor,
                    e.responsavel_id,
                    f.nome_completo AS responsavel_nome,
                    f.foto_url AS responsavel_foto,
                    e.utilizador_id,
                    e.localizacao,
                    e.numero_serie,
                    e.numero_interno,
                    e.descricao,
                    e.data_aquisicao,
                    e.valor_aquisicao,
                    e.fornecedor,
                    e.data_garantia,
                    e.data_proxima_manutencao,
                    e.estado,
                    e.observacoes,
                    e.foto_url,
                    e.ativo,
                    e.criado_em,
                    e.atualizado_em
                FROM equipamentos e
                INNER JOIN modelos_equipamento m ON e.modelo_id = m.id
                INNER JOIN marcas ma ON m.marca_id = ma.id
                INNER JOIN categorias_equipamento c ON m.categoria_id = c.id
                LEFT JOIN funcionarios f ON e.responsavel_id = f.id
                WHERE e.id = @id
            `);

        if (result.recordset.length === 0) {
            throw new NotFoundException(`Equipamento com ID ${id} não encontrado`);
        }

        return result.recordset[0];
    }

    async criar(dados: CriarEquipamentoDto, tenantId: number, userId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .input('empresa_id', sql.Int, tenantId)
            .input('modelo_id', sql.Int, dados.modelo_id)
            .input('responsavel_id', sql.Int, dados.responsavel_id || null)
            .input('utilizador_id', sql.Int, dados.utilizador_id || null)
            .input('numero_serie', sql.NVarChar, dados.numero_serie)
            .input('numero_interno', sql.NVarChar, dados.numero_interno)
            .input('descricao', sql.NVarChar, dados.descricao || null)
            .input('localizacao', sql.NVarChar, dados.localizacao || null)
            .input('data_aquisicao', sql.Date, dados.data_aquisicao || null)
            .input('valor_aquisicao', sql.Decimal(10, 2), dados.valor_aquisicao || null)
            .input('fornecedor', sql.NVarChar, dados.fornecedor || null)
            .input('data_garantia', sql.Date, dados.data_garantia || null)
            .input('data_proxima_manutencao', sql.Date, dados.data_proxima_manutencao || null)
            .input('estado', sql.NVarChar, dados.estado || 'operacional')
            .input('observacoes', sql.NVarChar, dados.observacoes || null)
            .input('foto_url', sql.NVarChar, dados.foto_url || null)
            .input('ativo', sql.Bit, dados.ativo !== undefined ? dados.ativo : true)
            .query(`
                INSERT INTO equipamentos
                (empresa_id, modelo_id, responsavel_id, utilizador_id, numero_serie, numero_interno, descricao,
                 localizacao, data_aquisicao, valor_aquisicao, fornecedor, data_garantia, data_proxima_manutencao,
                 estado, observacoes, foto_url, ativo, criado_em, atualizado_em)
                OUTPUT INSERTED.*
                VALUES (@empresa_id, @modelo_id, @responsavel_id, @utilizador_id, @numero_serie, @numero_interno, @descricao,
                        @localizacao, @data_aquisicao, @valor_aquisicao, @fornecedor, @data_garantia, @data_proxima_manutencao,
                        @estado, @observacoes, @foto_url, @ativo, GETDATE(), GETDATE())
            `);

        return this.obterPorId(result.recordset[0].id, tenantId);
    }

    async atualizar(id: number, dados: CriarEquipamentoDto, tenantId: number, userId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Verificar se existe
        await this.obterPorId(id, tenantId);

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('modelo_id', sql.Int, dados.modelo_id)
            .input('responsavel_id', sql.Int, dados.responsavel_id || null)
            .input('utilizador_id', sql.Int, dados.utilizador_id || null)
            .input('numero_serie', sql.NVarChar, dados.numero_serie)
            .input('numero_interno', sql.NVarChar, dados.numero_interno)
            .input('descricao', sql.NVarChar, dados.descricao || null)
            .input('localizacao', sql.NVarChar, dados.localizacao || null)
            .input('data_aquisicao', sql.Date, dados.data_aquisicao || null)
            .input('valor_aquisicao', sql.Decimal(10, 2), dados.valor_aquisicao || null)
            .input('fornecedor', sql.NVarChar, dados.fornecedor || null)
            .input('data_garantia', sql.Date, dados.data_garantia || null)
            .input('data_proxima_manutencao', sql.Date, dados.data_proxima_manutencao || null)
            .input('estado', sql.NVarChar, dados.estado || 'operacional')
            .input('observacoes', sql.NVarChar, dados.observacoes || null)
            .input('foto_url', sql.NVarChar, dados.foto_url || null)
            .input('ativo', sql.Bit, dados.ativo !== undefined ? dados.ativo : true)
            .query(`
                UPDATE equipamentos
                SET
                    modelo_id = @modelo_id,
                    responsavel_id = @responsavel_id,
                    utilizador_id = @utilizador_id,
                    numero_serie = @numero_serie,
                    numero_interno = @numero_interno,
                    descricao = @descricao,
                    localizacao = @localizacao,
                    data_aquisicao = @data_aquisicao,
                    valor_aquisicao = @valor_aquisicao,
                    fornecedor = @fornecedor,
                    data_garantia = @data_garantia,
                    data_proxima_manutencao = @data_proxima_manutencao,
                    estado = @estado,
                    observacoes = @observacoes,
                    foto_url = @foto_url,
                    ativo = @ativo,
                    atualizado_em = GETDATE()
                OUTPUT INSERTED.*
                WHERE id = @id
            `);

        return this.obterPorId(id, tenantId);
    }

    async deletar(id: number, tenantId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Verificar se existe
        await this.obterPorId(id, tenantId);

        // Verificar se tem tickets vinculados
        const tickets = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT COUNT(*) as total
                FROM tickets
                WHERE equipamento_id = @id
            `);

        if (tickets.recordset[0].total > 0) {
            throw new Error('Não é possível deletar equipamento que possui tickets vinculados');
        }

        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM equipamentos WHERE id = @id');

        return { message: 'Equipamento deletado com sucesso' };
    }
}
