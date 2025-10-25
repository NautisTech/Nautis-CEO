import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CriarModeloDto } from './dto/criar-modelo.dto';
import * as sql from 'mssql';

@Injectable()
export class ModelosEquipamentoService {
    constructor(private readonly databaseService: DatabaseService) { }

    async listar(tenantId: number, marcaId?: number, categoriaId?: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        let query = `
            SELECT
                m.id,
                m.marca_id,
                ma.nome AS marca_nome,
                ma.logo_url AS marca_logo,
                m.categoria_id,
                c.nome AS categoria_nome,
                c.icone AS categoria_icone,
                c.cor AS categoria_cor,
                m.nome,
                m.codigo,
                m.descricao,
                m.especificacoes,
                m.imagem_url,
                m.manual_url,
                m.ativo,
                m.criado_em,
                m.atualizado_em
            FROM modelos_equipamento m
            INNER JOIN marcas ma ON m.marca_id = ma.id
            INNER JOIN categorias_equipamento c ON m.categoria_id = c.id
        `;

        const conditions: any[] = [];
        if (marcaId) conditions.push('m.marca_id = @marcaId');
        if (categoriaId) conditions.push('m.categoria_id = @categoriaId');

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY ma.nome, m.nome';

        const request = pool.request();
        if (marcaId) request.input('marcaId', sql.Int, marcaId);
        if (categoriaId) request.input('categoriaId', sql.Int, categoriaId);

        const result = await request.query(query);
        return result.recordset;
    }

    async obterPorId(id: number, tenantId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    m.id,
                    m.marca_id,
                    ma.nome AS marca_nome,
                    ma.logo_url AS marca_logo,
                    m.categoria_id,
                    c.nome AS categoria_nome,
                    c.icone AS categoria_icone,
                    c.cor AS categoria_cor,
                    m.nome,
                    m.codigo,
                    m.descricao,
                    m.especificacoes,
                    m.imagem_url,
                    m.manual_url,
                    m.ativo,
                    m.criado_em,
                    m.atualizado_em
                FROM modelos_equipamento m
                INNER JOIN marcas ma ON m.marca_id = ma.id
                INNER JOIN categorias_equipamento c ON m.categoria_id = c.id
                WHERE m.id = @id
            `);

        if (result.recordset.length === 0) {
            throw new NotFoundException(`Modelo com ID ${id} não encontrado`);
        }

        return result.recordset[0];
    }

    async criar(dados: CriarModeloDto, tenantId: number, userId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .input('marca_id', sql.Int, dados.marca_id)
            .input('categoria_id', sql.Int, dados.categoria_id)
            .input('nome', sql.NVarChar, dados.nome)
            .input('codigo', sql.NVarChar, dados.codigo || null)
            .input('descricao', sql.NVarChar, dados.descricao || null)
            .input('especificacoes', sql.NVarChar, dados.especificacoes || null)
            .input('imagem_url', sql.NVarChar, dados.imagem_url || null)
            .input('manual_url', sql.NVarChar, dados.manual_url || null)
            .input('ativo', sql.Bit, dados.ativo !== undefined ? dados.ativo : true)
            .query(`
                INSERT INTO modelos_equipamento
                (marca_id, categoria_id, nome, codigo, descricao, especificacoes, imagem_url, manual_url, ativo, criado_em, atualizado_em)
                OUTPUT INSERTED.*
                VALUES (@marca_id, @categoria_id, @nome, @codigo, @descricao, @especificacoes, @imagem_url, @manual_url, @ativo, GETDATE(), GETDATE())
            `);

        return this.obterPorId(result.recordset[0].id, tenantId);
    }

    async atualizar(id: number, dados: CriarModeloDto, tenantId: number, userId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Verificar se existe
        await this.obterPorId(id, tenantId);

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('marca_id', sql.Int, dados.marca_id)
            .input('categoria_id', sql.Int, dados.categoria_id)
            .input('nome', sql.NVarChar, dados.nome)
            .input('codigo', sql.NVarChar, dados.codigo || null)
            .input('descricao', sql.NVarChar, dados.descricao || null)
            .input('especificacoes', sql.NVarChar, dados.especificacoes || null)
            .input('imagem_url', sql.NVarChar, dados.imagem_url || null)
            .input('manual_url', sql.NVarChar, dados.manual_url || null)
            .input('ativo', sql.Bit, dados.ativo !== undefined ? dados.ativo : true)
            .query(`
                UPDATE modelos_equipamento
                SET
                    marca_id = @marca_id,
                    categoria_id = @categoria_id,
                    nome = @nome,
                    codigo = @codigo,
                    descricao = @descricao,
                    especificacoes = @especificacoes,
                    imagem_url = @imagem_url,
                    manual_url = @manual_url,
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

        // Verificar se tem equipamentos vinculados
        const equipamentos = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT COUNT(*) as total
                FROM equipamentos
                WHERE modelo_id = @id
            `);

        if (equipamentos.recordset[0].total > 0) {
            throw new Error('Não é possível deletar modelo que possui equipamentos vinculados');
        }

        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM modelos_equipamento WHERE id = @id');

        return { message: 'Modelo deletado com sucesso' };
    }
}
