import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CriarCategoriaDto } from './dto/criar-categoria.dto';
import * as sql from 'mssql';

@Injectable()
export class CategoriasEquipamentoService {
    constructor(private readonly databaseService: DatabaseService) { }

    async listar(tenantId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .query(`
                SELECT
                    id,
                    nome,
                    descricao,
                    icone,
                    cor,
                    categoria_pai_id,
                    ativo,
                    criado_em,
                    atualizado_em
                FROM categorias_equipamento
                ORDER BY nome
            `);
        return result.recordset;
    }

    async listarHierarquia(tenantId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .query(`
                WITH CategoriasCTE AS (
                    -- Categorias raiz (sem pai)
                    SELECT
                        id,
                        nome,
                        descricao,
                        icone,
                        cor,
                        categoria_pai_id,
                        ativo,
                        criado_em,
                        atualizado_em,
                        0 AS nivel,
                        CAST(nome AS VARCHAR(MAX)) AS caminho
                    FROM categorias_equipamento
                    WHERE categoria_pai_id IS NULL

                    UNION ALL

                    -- Subcategorias
                    SELECT
                        c.id,
                        c.nome,
                        c.descricao,
                        c.icone,
                        c.cor,
                        c.categoria_pai_id,
                        c.ativo,
                        c.criado_em,
                        c.atualizado_em,
                        cte.nivel + 1,
                        CAST(cte.caminho + ' > ' + c.nome AS VARCHAR(MAX))
                    FROM categorias_equipamento c
                    INNER JOIN CategoriasCTE cte ON c.categoria_pai_id = cte.id
                )
                SELECT * FROM CategoriasCTE
                ORDER BY caminho
            `);
        return result.recordset;
    }

    async obterPorId(id: number, tenantId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    c.id,
                    c.nome,
                    c.descricao,
                    c.icone,
                    c.cor,
                    c.categoria_pai_id,
                    cp.nome AS categoria_pai_nome,
                    c.ativo,
                    c.criado_em,
                    c.atualizado_em
                FROM categorias_equipamento c
                LEFT JOIN categorias_equipamento cp ON c.categoria_pai_id = cp.id
                WHERE c.id = @id
            `);

        if (result.recordset.length === 0) {
            throw new NotFoundException(`Categoria com ID ${id} não encontrada`);
        }

        return result.recordset[0];
    }

    async criar(dados: CriarCategoriaDto, tenantId: number, userId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .input('nome', sql.NVarChar, dados.nome)
            .input('descricao', sql.NVarChar, dados.descricao || null)
            .input('icone', sql.NVarChar, dados.icone || null)
            .input('cor', sql.NVarChar, dados.cor || null)
            .input('categoria_pai_id', sql.Int, dados.categoria_pai_id || null)
            .input('ativo', sql.Bit, dados.ativo !== undefined ? dados.ativo : true)
            .query(`
                INSERT INTO categorias_equipamento
                (nome, descricao, icone, cor, categoria_pai_id, ativo, criado_em, atualizado_em)
                OUTPUT INSERTED.*
                VALUES (@nome, @descricao, @icone, @cor, @categoria_pai_id, @ativo, GETDATE(), GETDATE())
            `);

        return result.recordset[0];
    }

    async atualizar(id: number, dados: CriarCategoriaDto, tenantId: number, userId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Verificar se existe
        await this.obterPorId(id, tenantId);

        // Validar que não está tentando ser pai de si mesmo
        if (dados.categoria_pai_id === id) {
            throw new Error('Uma categoria não pode ser pai de si mesma');
        }

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('nome', sql.NVarChar, dados.nome)
            .input('descricao', sql.NVarChar, dados.descricao || null)
            .input('icone', sql.NVarChar, dados.icone || null)
            .input('cor', sql.NVarChar, dados.cor || null)
            .input('categoria_pai_id', sql.Int, dados.categoria_pai_id || null)
            .input('ativo', sql.Bit, dados.ativo !== undefined ? dados.ativo : true)
            .query(`
                UPDATE categorias_equipamento
                SET
                    nome = @nome,
                    descricao = @descricao,
                    icone = @icone,
                    cor = @cor,
                    categoria_pai_id = @categoria_pai_id,
                    ativo = @ativo,
                    atualizado_em = GETDATE()
                OUTPUT INSERTED.*
                WHERE id = @id
            `);

        return result.recordset[0];
    }

    async deletar(id: number, tenantId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Verificar se existe
        await this.obterPorId(id, tenantId);

        // Verificar se tem subcategorias
        const subcategorias = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT COUNT(*) as total
                FROM categorias_equipamento
                WHERE categoria_pai_id = @id
            `);

        if (subcategorias.recordset[0].total > 0) {
            throw new Error('Não é possível deletar categoria que possui subcategorias');
        }

        // Verificar se tem modelos vinculados
        const modelos = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT COUNT(*) as total
                FROM modelos_equipamento
                WHERE categoria_id = @id
            `);

        if (modelos.recordset[0].total > 0) {
            throw new Error('Não é possível deletar categoria que possui modelos vinculados');
        }

        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM categorias_equipamento WHERE id = @id');

        return { message: 'Categoria deletada com sucesso' };
    }
}
