import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CriarEquipamentoDto } from './dto/criar-equipamento.dto';
import * as sql from 'mssql';

interface FiltrosEquipamento {
    modeloId?: number;
    funcionarioId?: number;
    localId?: number;
    status?: string;
}

@Injectable()
export class EquipamentosService {
    constructor(private readonly databaseService: DatabaseService) { }

    async listar(tenantId: number, filtros: FiltrosEquipamento = {}) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        let query = `
            SELECT
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
                e.funcionario_id,
                f.nome_completo AS funcionario_nome,
                e.local_id,
                l.nome AS local_nome,
                e.numero_serie,
                e.codigo_patrimonio,
                e.descricao,
                e.data_aquisicao,
                e.valor_aquisicao,
                e.numero_nota_fiscal,
                e.fornecedor,
                e.garantia_ate,
                e.status,
                e.observacoes,
                e.qrcode_url,
                e.ativo,
                e.criado_em,
                e.atualizado_em
            FROM equipamentos e
            INNER JOIN modelos_equipamento m ON e.modelo_id = m.id
            INNER JOIN marcas ma ON m.marca_id = ma.id
            INNER JOIN categorias_equipamento c ON m.categoria_id = c.id
            LEFT JOIN funcionarios f ON e.funcionario_id = f.id
            LEFT JOIN locais l ON e.local_id = l.id
        `;

        const conditions: any[] = [];
        if (filtros.modeloId) conditions.push('e.modelo_id = @modeloId');
        if (filtros.funcionarioId) conditions.push('e.funcionario_id = @funcionarioId');
        if (filtros.localId) conditions.push('e.local_id = @localId');
        if (filtros.status) conditions.push('e.status = @status');

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY e.codigo_patrimonio, e.numero_serie';

        const request = pool.request();
        if (filtros.modeloId) request.input('modeloId', sql.Int, filtros.modeloId);
        if (filtros.funcionarioId) request.input('funcionarioId', sql.Int, filtros.funcionarioId);
        if (filtros.localId) request.input('localId', sql.Int, filtros.localId);
        if (filtros.status) request.input('status', sql.NVarChar, filtros.status);

        const result = await request.query(query);
        return result.recordset;
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
                    e.funcionario_id,
                    f.nome_completo AS funcionario_nome,
                    f.foto_url AS funcionario_foto,
                    e.local_id,
                    l.nome AS local_nome,
                    e.numero_serie,
                    e.codigo_patrimonio,
                    e.descricao,
                    e.data_aquisicao,
                    e.valor_aquisicao,
                    e.numero_nota_fiscal,
                    e.fornecedor,
                    e.garantia_ate,
                    e.status,
                    e.observacoes,
                    e.qrcode_url,
                    e.ativo,
                    e.criado_em,
                    e.atualizado_em
                FROM equipamentos e
                INNER JOIN modelos_equipamento m ON e.modelo_id = m.id
                INNER JOIN marcas ma ON m.marca_id = ma.id
                INNER JOIN categorias_equipamento c ON m.categoria_id = c.id
                LEFT JOIN funcionarios f ON e.funcionario_id = f.id
                LEFT JOIN locais l ON e.local_id = l.id
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
            .input('modelo_id', sql.Int, dados.modelo_id)
            .input('funcionario_id', sql.Int, dados.funcionario_id || null)
            .input('local_id', sql.Int, dados.local_id || null)
            .input('numero_serie', sql.NVarChar, dados.numero_serie)
            .input('codigo_patrimonio', sql.NVarChar, dados.codigo_patrimonio || null)
            .input('descricao', sql.NVarChar, dados.descricao || null)
            .input('data_aquisicao', sql.Date, dados.data_aquisicao || null)
            .input('valor_aquisicao', sql.Decimal(10, 2), dados.valor_aquisicao || null)
            .input('numero_nota_fiscal', sql.Int, dados.numero_nota_fiscal || null)
            .input('fornecedor', sql.NVarChar, dados.fornecedor || null)
            .input('garantia_ate', sql.Date, dados.garantia_ate || null)
            .input('status', sql.NVarChar, dados.status || 'operacional')
            .input('observacoes', sql.NVarChar, dados.observacoes || null)
            .input('qrcode_url', sql.NVarChar, dados.qrcode_url || null)
            .input('ativo', sql.Bit, dados.ativo !== undefined ? dados.ativo : true)
            .query(`
                INSERT INTO equipamentos
                (modelo_id, funcionario_id, local_id, numero_serie, codigo_patrimonio, descricao,
                 data_aquisicao, valor_aquisicao, numero_nota_fiscal, fornecedor, garantia_ate,
                 status, observacoes, qrcode_url, ativo, criado_em, atualizado_em)
                OUTPUT INSERTED.*
                VALUES (@modelo_id, @funcionario_id, @local_id, @numero_serie, @codigo_patrimonio, @descricao,
                        @data_aquisicao, @valor_aquisicao, @numero_nota_fiscal, @fornecedor, @garantia_ate,
                        @status, @observacoes, @qrcode_url, @ativo, GETDATE(), GETDATE())
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
            .input('funcionario_id', sql.Int, dados.funcionario_id || null)
            .input('local_id', sql.Int, dados.local_id || null)
            .input('numero_serie', sql.NVarChar, dados.numero_serie)
            .input('codigo_patrimonio', sql.NVarChar, dados.codigo_patrimonio || null)
            .input('descricao', sql.NVarChar, dados.descricao || null)
            .input('data_aquisicao', sql.Date, dados.data_aquisicao || null)
            .input('valor_aquisicao', sql.Decimal(10, 2), dados.valor_aquisicao || null)
            .input('numero_nota_fiscal', sql.Int, dados.numero_nota_fiscal || null)
            .input('fornecedor', sql.NVarChar, dados.fornecedor || null)
            .input('garantia_ate', sql.Date, dados.garantia_ate || null)
            .input('status', sql.NVarChar, dados.status || 'operacional')
            .input('observacoes', sql.NVarChar, dados.observacoes || null)
            .input('qrcode_url', sql.NVarChar, dados.qrcode_url || null)
            .input('ativo', sql.Bit, dados.ativo !== undefined ? dados.ativo : true)
            .query(`
                UPDATE equipamentos
                SET
                    modelo_id = @modelo_id,
                    funcionario_id = @funcionario_id,
                    local_id = @local_id,
                    numero_serie = @numero_serie,
                    codigo_patrimonio = @codigo_patrimonio,
                    descricao = @descricao,
                    data_aquisicao = @data_aquisicao,
                    valor_aquisicao = @valor_aquisicao,
                    numero_nota_fiscal = @numero_nota_fiscal,
                    fornecedor = @fornecedor,
                    garantia_ate = @garantia_ate,
                    status = @status,
                    observacoes = @observacoes,
                    qrcode_url = @qrcode_url,
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
