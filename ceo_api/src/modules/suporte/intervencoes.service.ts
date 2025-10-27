import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CriarIntervencaoDto } from './dto/criar-intervencao.dto';
import * as sql from 'mssql';

@Injectable()
export class IntervencoesService {
    constructor(private readonly databaseService: DatabaseService) { }

    async criar(tenantId: number, dto: CriarIntervencaoDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const request = pool.request();

        // Generate intervention number
        const countResult = await request.query(`
            SELECT COUNT(*) as total FROM intervencoes
        `);
        const numero_intervencao = `INT${String(countResult.recordset[0].total + 1).padStart(6, '0')}`;

        // Get cliente_id from ticket if ticket_id is provided
        let cliente_id = null;
        if (dto.ticket_id) {
            const ticketResult = await pool.request()
                .input('ticket_id', sql.Int, dto.ticket_id)
                .query('SELECT cliente_id FROM tickets WHERE id = @ticket_id');
            if (ticketResult.recordset.length > 0) {
                cliente_id = ticketResult.recordset[0].cliente_id;
            }
        }

        // Calculate custo_total
        const custo_mao_obra = dto.custo_mao_obra || 0;
        const custo_pecas = dto.custo_pecas || 0;
        const custo_total = custo_mao_obra + custo_pecas;

        const result = await pool.request()
            .input('cliente_id', sql.Int, cliente_id)
            .input('ticket_id', sql.Int, dto.ticket_id || null)
            .input('equipamento_id', sql.Int, dto.equipamento_id)
            .input('tipo', sql.VarChar(50), dto.tipo)
            .input('numero_intervencao', sql.VarChar(50), numero_intervencao)
            .input('titulo', sql.VarChar(200), dto.titulo)
            .input('descricao', sql.Text, dto.descricao || null)
            .input('diagnostico', sql.Text, dto.diagnostico || null)
            .input('solucao', sql.Text, dto.solucao || null)
            .input('tecnico_id', sql.Int, dto.tecnico_id)
            .input('data_inicio', sql.DateTime, dto.data_inicio ? new Date(dto.data_inicio) : null)
            .input('data_fim', sql.DateTime, dto.data_fim ? new Date(dto.data_fim) : null)
            .input('duracao_minutos', sql.Int, dto.duracao_minutos || null)
            .input('custo_mao_obra', sql.Decimal(10, 2), custo_mao_obra)
            .input('custo_pecas', sql.Decimal(10, 2), custo_pecas)
            .input('custo_total', sql.Decimal(10, 2), custo_total)
            .input('fornecedor_externo', sql.VarChar(200), dto.fornecedor_externo || null)
            .input('numero_fatura', sql.VarChar(100), dto.numero_fatura || null)
            .input('garantia', sql.Bit, dto.garantia || false)
            .input('observacoes', sql.Text, dto.observacoes || null)
            .input('status', sql.VarChar(20), dto.status || 'pendente')
            .query(`
                INSERT INTO intervencoes (
                    cliente_id, ticket_id, equipamento_id, tipo, numero_intervencao,
                    titulo, descricao, diagnostico, solucao, tecnico_id,
                    data_inicio, data_fim, duracao_minutos, custo_mao_obra,
                    custo_pecas, custo_total, fornecedor_externo, numero_fatura,
                    garantia, observacoes, status, criado_em
                )
                OUTPUT INSERTED.*
                VALUES (
                    @cliente_id, @ticket_id, @equipamento_id, @tipo, @numero_intervencao,
                    @titulo, @descricao, @diagnostico, @solucao, @tecnico_id,
                    @data_inicio, @data_fim, @duracao_minutos, @custo_mao_obra,
                    @custo_pecas, @custo_total, @fornecedor_externo, @numero_fatura,
                    @garantia, @observacoes, @status, GETDATE()
                )
            `);

        return result.recordset[0];
    }

    async listar(tenantId: number, filtros: {
        ticket_id?: number;
        equipamento_id?: number;
        tipo?: string;
        tecnico_id?: number;
        status?: string;
        page?: number;
        pageSize?: number;
    }) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const request = pool.request();

        let whereClause = `WHERE 1=1`;

        if (filtros.ticket_id) {
            whereClause += ` AND i.ticket_id = ${filtros.ticket_id}`;
        }
        if (filtros.equipamento_id) {
            whereClause += ` AND i.equipamento_id = ${filtros.equipamento_id}`;
        }
        if (filtros.tipo) {
            whereClause += ` AND i.tipo = '${filtros.tipo}'`;
        }
        if (filtros.tecnico_id) {
            whereClause += ` AND i.tecnico_id = ${filtros.tecnico_id}`;
        }
        if (filtros.status) {
            whereClause += ` AND i.status = '${filtros.status}'`;
        }

        // If no pagination, return all
        if (!filtros.page || !filtros.pageSize) {
            const result = await request.query(`
                SELECT
                    i.*,
                    t.numero_ticket,
                    tec.nome_completo as tecnico_nome,
                    e.numero_interno as equipamento_numero,
                    CONCAT(m.nome, ' ', mo.nome) as equipamento_nome
                FROM intervencoes i
                LEFT JOIN tickets t ON i.ticket_id = t.id
                LEFT JOIN funcionarios tec ON i.tecnico_id = tec.id
                LEFT JOIN equipamentos e ON i.equipamento_id = e.id
                LEFT JOIN modelos_equipamento mo ON e.modelo_id = mo.id
                LEFT JOIN marcas m ON mo.marca_id = m.id
                ${whereClause}
                ORDER BY i.criado_em DESC
            `);
            return result.recordset;
        }

        // With pagination
        const page = filtros.page || 1;
        const pageSize = filtros.pageSize || 10;
        const offset = (page - 1) * pageSize;

        request.input('offset', sql.Int, offset);
        request.input('pageSize', sql.Int, pageSize);

        // Count total
        const countResult = await request.query(`
            SELECT COUNT(*) as total
            FROM intervencoes i
            ${whereClause}
        `);
        const total = countResult.recordset[0].total;

        // Fetch paginated data
        const dataResult = await request.query(`
            SELECT
                i.*,
                t.numero_ticket,
                tec.nome_completo as tecnico_nome,
                e.numero_interno as equipamento_numero,
                CONCAT(m.nome, ' ', mo.nome) as equipamento_nome
            FROM intervencoes i
            LEFT JOIN tickets t ON i.ticket_id = t.id
            LEFT JOIN funcionarios tec ON i.tecnico_id = tec.id
            LEFT JOIN equipamentos e ON i.equipamento_id = e.id
            LEFT JOIN modelos_equipamento mo ON e.modelo_id = mo.id
            LEFT JOIN marcas m ON mo.marca_id = m.id
            ${whereClause}
            ORDER BY i.criado_em DESC
            OFFSET @offset ROWS
            FETCH NEXT @pageSize ROWS ONLY
        `);

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
                    i.*,
                    t.numero_ticket,
                    tec.nome_completo as tecnico_nome,
                    e.numero_interno as equipamento_numero,
                    CONCAT(m.nome, ' ', mo.nome) as equipamento_nome
                FROM intervencoes i
                LEFT JOIN tickets t ON i.ticket_id = t.id
                LEFT JOIN funcionarios tec ON i.tecnico_id = tec.id
                LEFT JOIN equipamentos e ON i.equipamento_id = e.id
                LEFT JOIN modelos_equipamento mo ON e.modelo_id = mo.id
                LEFT JOIN marcas m ON mo.marca_id = m.id
                WHERE i.id = @id
            `);

        if (result.recordset.length === 0) {
            throw new NotFoundException('Intervenção não encontrada');
        }

        return result.recordset[0];
    }

    async atualizar(id: number, tenantId: number, dto: CriarIntervencaoDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Check if exists
        await this.obterPorId(id, tenantId);

        // Calculate custo_total
        const custo_mao_obra = dto.custo_mao_obra || 0;
        const custo_pecas = dto.custo_pecas || 0;
        const custo_total = custo_mao_obra + custo_pecas;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('ticket_id', sql.Int, dto.ticket_id || null)
            .input('equipamento_id', sql.Int, dto.equipamento_id)
            .input('tipo', sql.VarChar(50), dto.tipo)
            .input('titulo', sql.VarChar(200), dto.titulo)
            .input('descricao', sql.Text, dto.descricao || null)
            .input('diagnostico', sql.Text, dto.diagnostico || null)
            .input('solucao', sql.Text, dto.solucao || null)
            .input('tecnico_id', sql.Int, dto.tecnico_id)
            .input('data_inicio', sql.DateTime, dto.data_inicio ? new Date(dto.data_inicio) : null)
            .input('data_fim', sql.DateTime, dto.data_fim ? new Date(dto.data_fim) : null)
            .input('duracao_minutos', sql.Int, dto.duracao_minutos || null)
            .input('custo_mao_obra', sql.Decimal(10, 2), custo_mao_obra)
            .input('custo_pecas', sql.Decimal(10, 2), custo_pecas)
            .input('custo_total', sql.Decimal(10, 2), custo_total)
            .input('fornecedor_externo', sql.VarChar(200), dto.fornecedor_externo || null)
            .input('numero_fatura', sql.VarChar(100), dto.numero_fatura || null)
            .input('garantia', sql.Bit, dto.garantia || false)
            .input('observacoes', sql.Text, dto.observacoes || null)
            .input('status', sql.VarChar(20), dto.status || 'pendente')
            .query(`
                UPDATE intervencoes
                SET
                    ticket_id = @ticket_id,
                    equipamento_id = @equipamento_id,
                    tipo = @tipo,
                    titulo = @titulo,
                    descricao = @descricao,
                    diagnostico = @diagnostico,
                    solucao = @solucao,
                    tecnico_id = @tecnico_id,
                    data_inicio = @data_inicio,
                    data_fim = @data_fim,
                    duracao_minutos = @duracao_minutos,
                    custo_mao_obra = @custo_mao_obra,
                    custo_pecas = @custo_pecas,
                    custo_total = @custo_total,
                    fornecedor_externo = @fornecedor_externo,
                    numero_fatura = @numero_fatura,
                    garantia = @garantia,
                    observacoes = @observacoes,
                    status = @status,
                    atualizado_em = GETDATE()
                OUTPUT INSERTED.*
                WHERE id = @id
            `);

        return result.recordset[0];
    }

    async deletar(id: number, tenantId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Check if exists
        await this.obterPorId(id, tenantId);

        await pool.request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM intervencoes
                WHERE id = @id
            `);

        return { message: 'Intervenção deletada com sucesso' };
    }

    async obterAnexos(intervencaoId: number, tenantId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .input('intervencao_id', sql.Int, intervencaoId)
            .query(`
                SELECT a.*
                FROM intervencoes_anexos a
                WHERE a.intervencao_id = @intervencao_id
                ORDER BY a.criado_em DESC
            `);

        return result.recordset;
    }

    async obterPecas(intervencaoId: number, tenantId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .input('intervencao_id', sql.Int, intervencaoId)
            .query(`
                SELECT p.*
                FROM intervencoes_custos p
                WHERE p.intervencao_id = @intervencao_id
                ORDER BY p.criado_em DESC
            `);

        return result.recordset;
    }

    async obterEstatisticas(tenantId: number, filtros: { data_inicio?: string; data_fim?: string }) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        let whereClause = `WHERE 1=1`;

        if (filtros.data_inicio) {
            whereClause += ` AND i.data_inicio >= '${filtros.data_inicio}'`;
        }

        if (filtros.data_fim) {
            whereClause += ` AND i.data_inicio <= '${filtros.data_fim}'`;
        }

        const result = await pool.request().query(`
            SELECT
                COUNT(*) as total,
                COUNT(CASE WHEN status = 'agendada' THEN 1 END) as agendadas,
                COUNT(CASE WHEN status = 'em_progresso' OR status = 'em_andamento' THEN 1 END) as em_progresso,
                COUNT(CASE WHEN status = 'concluida' THEN 1 END) as concluidas,
                COUNT(CASE WHEN status = 'cancelada' THEN 1 END) as canceladas,
                COUNT(CASE WHEN tipo = 'preventiva' THEN 1 END) as preventivas,
                COUNT(CASE WHEN tipo = 'corretiva' THEN 1 END) as corretivas,
                ISNULL(SUM(custo_total), 0) as custo_total,
                ISNULL(AVG(duracao_minutos), 0) as duracao_media,
                COUNT(CASE WHEN garantia = 1 THEN 1 END) as em_garantia
            FROM intervencoes i
            ${whereClause}
        `);

        return result.recordset[0];
    }
}
