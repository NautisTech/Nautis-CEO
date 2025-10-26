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
            SELECT COUNT(*) as total FROM intervencoes WHERE empresa_id = ${tenantId}
        `);
        const numero_intervencao = `INT${String(countResult.recordset[0].total + 1).padStart(6, '0')}`;

        // Calculate custo_total
        const custo_mao_obra = dto.custo_mao_obra || 0;
        const custo_pecas = dto.custo_pecas || 0;
        const custo_total = custo_mao_obra + custo_pecas;

        const result = await pool.request()
            .input('empresa_id', sql.Int, tenantId)
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
                    empresa_id, ticket_id, equipamento_id, tipo, numero_intervencao,
                    titulo, descricao, diagnostico, solucao, tecnico_id,
                    data_inicio, data_fim, duracao_minutos, custo_mao_obra,
                    custo_pecas, custo_total, fornecedor_externo, numero_fatura,
                    garantia, observacoes, status, criado_em
                )
                OUTPUT INSERTED.*
                VALUES (
                    @empresa_id, @ticket_id, @equipamento_id, @tipo, @numero_intervencao,
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

        let whereClause = `WHERE i.empresa_id = ${tenantId}`;

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
                    tec.nome as tecnico_nome,
                    e.numero_interno as equipamento_numero
                FROM intervencoes i
                LEFT JOIN tickets t ON i.ticket_id = t.id
                LEFT JOIN utilizadores tec ON i.tecnico_id = tec.id
                LEFT JOIN equipamentos e ON i.equipamento_id = e.id
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
            SELECT COUNT(*) as total FROM intervencoes i ${whereClause}
        `);
        const total = countResult.recordset[0].total;

        // Fetch paginated data
        const dataResult = await request.query(`
            SELECT
                i.*,
                t.numero_ticket,
                tec.nome as tecnico_nome,
                e.numero_interno as equipamento_numero
            FROM intervencoes i
            LEFT JOIN tickets t ON i.ticket_id = t.id
            LEFT JOIN utilizadores tec ON i.tecnico_id = tec.id
            LEFT JOIN equipamentos e ON i.equipamento_id = e.id
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
            .input('tenant_id', sql.Int, tenantId)
            .query(`
                SELECT
                    i.*,
                    t.numero_ticket,
                    tec.nome as tecnico_nome,
                    e.numero_interno as equipamento_numero
                FROM intervencoes i
                LEFT JOIN tickets t ON i.ticket_id = t.id
                LEFT JOIN utilizadores tec ON i.tecnico_id = tec.id
                LEFT JOIN equipamentos e ON i.equipamento_id = e.id
                WHERE i.id = @id AND i.empresa_id = @tenant_id
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
            .input('tenant_id', sql.Int, tenantId)
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
                WHERE id = @id AND empresa_id = @tenant_id
            `);

        return result.recordset[0];
    }

    async deletar(id: number, tenantId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Check if exists
        await this.obterPorId(id, tenantId);

        await pool.request()
            .input('id', sql.Int, id)
            .input('tenant_id', sql.Int, tenantId)
            .query(`
                DELETE FROM intervencoes
                WHERE id = @id AND empresa_id = @tenant_id
            `);

        return { message: 'Intervenção deletada com sucesso' };
    }

    async obterAnexos(intervencaoId: number, tenantId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .input('intervencao_id', sql.Int, intervencaoId)
            .input('tenant_id', sql.Int, tenantId)
            .query(`
                SELECT a.*
                FROM intervencoes_anexos a
                INNER JOIN intervencoes i ON a.intervencao_id = i.id
                WHERE a.intervencao_id = @intervencao_id AND i.empresa_id = @tenant_id
                ORDER BY a.criado_em DESC
            `);

        return result.recordset;
    }

    async obterPecas(intervencaoId: number, tenantId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .input('intervencao_id', sql.Int, intervencaoId)
            .input('tenant_id', sql.Int, tenantId)
            .query(`
                SELECT p.*
                FROM intervencoes_pecas p
                INNER JOIN intervencoes i ON p.intervencao_id = i.id
                WHERE p.intervencao_id = @intervencao_id AND i.empresa_id = @tenant_id
                ORDER BY p.criado_em DESC
            `);

        return result.recordset;
    }
}
