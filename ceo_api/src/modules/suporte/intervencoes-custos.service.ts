import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CriarIntervencaoCustoDto } from './dto/criar-intervencao-custo.dto';
import { AtualizarIntervencaoCustoDto } from './dto/atualizar-intervencao-custo.dto';
import * as sql from 'mssql';

@Injectable()
export class IntervencoesCustosService {
    constructor(private readonly databaseService: DatabaseService) { }

    async listar(tenantId: number, intervencaoId?: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        let whereClause = 'WHERE 1=1';
        if (intervencaoId) {
            whereClause += ` AND ic.intervencao_id = ${intervencaoId}`;
        }

        const result = await pool.request().query(`
            SELECT
                ic.*,
                NULL as fornecedor_nome
            FROM intervencoes_custos ic
            ${whereClause}
            ORDER BY ic.criado_em DESC
        `);

        return result.recordset;
    }

    async obterPorId(tenantId: number, id: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    ic.*,
                    NULL as fornecedor_nome
                FROM intervencoes_custos ic
                WHERE ic.id = @id
            `);

        if (result.recordset.length === 0) {
            throw new NotFoundException(`Custo com ID ${id} não encontrado`);
        }

        return result.recordset[0];
    }

    async criar(tenantId: number, dto: CriarIntervencaoCustoDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Calculate valor_total
        const valorTotal = dto.quantidade * dto.valor_unitario;

        const result = await pool.request()
            .input('intervencao_id', sql.Int, dto.intervencao_id)
            .input('descricao', sql.VarChar(255), dto.descricao)
            .input('codigo', sql.VarChar(100), dto.codigo || null)
            .input('quantidade', sql.Decimal(10, 2), dto.quantidade)
            .input('valor_unitario', sql.Decimal(10, 2), dto.valor_unitario)
            .input('valor_total', sql.Decimal(10, 2), valorTotal)
            .input('fornecedor_id', sql.Int, dto.fornecedor_id || null)
            .input('anexo_url', sql.VarChar(500), dto.anexo_url || null)
            .query(`
                INSERT INTO intervencoes_custos (
                    intervencao_id, descricao, codigo, quantidade,
                    valor_unitario, valor_total, fornecedor_id, anexo_url,
                    criado_em
                )
                OUTPUT INSERTED.*
                VALUES (
                    @intervencao_id, @descricao, @codigo, @quantidade,
                    @valor_unitario, @valor_total, @fornecedor_id, @anexo_url,
                    GETDATE()
                )
            `);

        // Update custo_total in intervencoes table
        await this.atualizarCustoTotalIntervencao(tenantId, dto.intervencao_id);

        return result.recordset[0];
    }

    async atualizar(tenantId: number, id: number, dto: AtualizarIntervencaoCustoDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Get current custo to get intervencao_id
        const custo = await this.obterPorId(tenantId, id);

        const campos: string[] = [];
        const request = pool.request().input('id', sql.Int, id);

        if (dto.descricao !== undefined) {
            campos.push('descricao = @descricao');
            request.input('descricao', sql.VarChar(255), dto.descricao);
        }

        if (dto.codigo !== undefined) {
            campos.push('codigo = @codigo');
            request.input('codigo', sql.VarChar(100), dto.codigo);
        }

        if (dto.quantidade !== undefined) {
            campos.push('quantidade = @quantidade');
            request.input('quantidade', sql.Decimal(10, 2), dto.quantidade);
        }

        if (dto.valor_unitario !== undefined) {
            campos.push('valor_unitario = @valor_unitario');
            request.input('valor_unitario', sql.Decimal(10, 2), dto.valor_unitario);
        }

        if (dto.fornecedor_id !== undefined) {
            campos.push('fornecedor_id = @fornecedor_id');
            request.input('fornecedor_id', sql.Int, dto.fornecedor_id);
        }

        if (dto.anexo_url !== undefined) {
            campos.push('anexo_url = @anexo_url');
            request.input('anexo_url', sql.VarChar(500), dto.anexo_url);
        }

        // Recalculate valor_total if quantidade or valor_unitario changed
        if (dto.quantidade !== undefined || dto.valor_unitario !== undefined) {
            const quantidade = dto.quantidade ?? custo.quantidade;
            const valorUnitario = dto.valor_unitario ?? custo.valor_unitario;
            const valorTotal = quantidade * valorUnitario;
            campos.push('valor_total = @valor_total');
            request.input('valor_total', sql.Decimal(10, 2), valorTotal);
        }

        if (campos.length === 0) {
            throw new Error('Nenhum campo para atualizar');
        }

        const result = await request.query(`
            UPDATE intervencoes_custos
            SET ${campos.join(', ')}
            OUTPUT INSERTED.*
            WHERE id = @id
        `);

        // Update custo_total in intervencoes table
        await this.atualizarCustoTotalIntervencao(tenantId, custo.intervencao_id);

        return result.recordset[0];
    }

    async remover(tenantId: number, id: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Get intervencao_id before deleting
        const custo = await this.obterPorId(tenantId, id);

        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM intervencoes_custos WHERE id = @id');

        // Update custo_total in intervencoes table
        await this.atualizarCustoTotalIntervencao(tenantId, custo.intervencao_id);

        return { message: 'Custo removido com sucesso' };
    }

    private async atualizarCustoTotalIntervencao(tenantId: number, intervencaoId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        await pool.request()
            .input('intervencao_id', sql.Int, intervencaoId)
            .query(`
                UPDATE intervencoes
                SET custo_total = (
                    SELECT ISNULL(SUM(valor_total), 0)
                    FROM intervencoes_custos
                    WHERE intervencao_id = @intervencao_id
                )
                WHERE id = @intervencao_id
            `);
    }

    async obterTotalPorIntervencao(tenantId: number, intervencaoId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request()
            .input('intervencao_id', sql.Int, intervencaoId)
            .query(`
                SELECT
                    ISNULL(SUM(valor_total), 0) as total,
                    COUNT(*) as total_custos
                FROM intervencoes_custos
                WHERE intervencao_id = @intervencao_id
            `);

        return result.recordset[0];
    }
}
