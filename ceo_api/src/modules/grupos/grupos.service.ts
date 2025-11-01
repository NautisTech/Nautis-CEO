import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../shared/base/base.service';
import { DatabaseService } from '../../database/database.service';
import { CriarGrupoDto } from './dto/criar-grupo.dto';
import { AtualizarGrupoDto } from './dto/atualizar-grupo.dto';
import * as sql from 'mssql';

@Injectable()
export class GruposService extends BaseService {
    constructor(databaseService: DatabaseService) {
        super(databaseService);
    }

    async criar(tenantId: number, dto: CriarGrupoDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool
            .request()
            .input('nome', sql.NVarChar, dto.nome)
            .input('descricao', sql.NVarChar, dto.descricao)
            .query(`
        INSERT INTO grupos (nome, descricao, ativo, criado_em)
        OUTPUT INSERTED.id
        VALUES (@nome, @descricao, 1, GETDATE())
      `);

        const grupoId = result.recordset[0].id;

        // Associar permissões se fornecidas
        if (dto.permissoesIds && dto.permissoesIds.length > 0) {
            await this.associarPermissoes(tenantId, grupoId, dto.permissoesIds);
        }

        return { id: grupoId };
    }

    async listar(tenantId: number) {
        const result = await this.executeQuery(
            tenantId,
            `
      SELECT 
        g.*,
        (SELECT COUNT(*) FROM grupo_utilizador WHERE grupo_id = g.id) AS total_utilizadores,
        (SELECT COUNT(*) FROM grupo_permissao WHERE grupo_id = g.id) AS total_permissoes
      FROM grupos g
      ORDER BY g.nome
    `,
        );

        return result;
    }

    async obterPorId(tenantId: number, id: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Grupo
        const grupoResult = await pool
            .request()
            .input('id', sql.Int, id)
            .query(`
        SELECT 
          g.*,
          (SELECT COUNT(*) FROM grupo_utilizador WHERE grupo_id = g.id) AS total_utilizadores,
          (SELECT COUNT(*) FROM grupo_permissao WHERE grupo_id = g.id) AS total_permissoes
        FROM grupos g
        WHERE g.id = @id
      `);

        if (!grupoResult.recordset[0]) {
            throw new NotFoundException('Grupo não encontrado');
        }

        // Permissões do grupo
        const permissoesResult = await pool
            .request()
            .input('id', sql.Int, id)
            .query(`
        SELECT p.*
        FROM permissoes p
        INNER JOIN grupo_permissao gp ON p.id = gp.permissao_id
        WHERE gp.grupo_id = @id
        ORDER BY p.modulo, p.nome
      `);

        // Utilizadores do grupo
        const utilizadoresResult = await pool
            .request()
            .input('id', sql.Int, id)
            .query(`
        SELECT u.id, u.username, u.email, u.ativo
        FROM utilizadores u
        INNER JOIN grupo_utilizador gu ON u.id = gu.utilizador_id
        WHERE gu.grupo_id = @id
        ORDER BY u.username
      `);

        return {
            ...grupoResult.recordset[0],
            permissoes: permissoesResult.recordset,
            utilizadores: utilizadoresResult.recordset,
        };
    }

    async atualizar(tenantId: number, id: number, dto: AtualizarGrupoDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const updates: string[] = [];
        const request = pool.request().input('id', sql.Int, id);

        if (dto.nome) {
            updates.push('nome = @nome');
            request.input('nome', sql.NVarChar, dto.nome);
        }
        if (dto.descricao !== undefined) {
            updates.push('descricao = @descricao');
            request.input('descricao', sql.NVarChar, dto.descricao);
        }
        if (dto.ativo !== undefined) {
            updates.push('ativo = @ativo');
            request.input('ativo', sql.Bit, dto.ativo ? 1 : 0);
        }

        updates.push('atualizado_em = GETDATE()');

        if (updates.length > 0) {
            await request.query(`
        UPDATE grupos
        SET ${updates.join(', ')}
        WHERE id = @id
      `);
        }

        // Atualizar permissões se fornecidas
        if (dto.permissoesIds) {
            await this.associarPermissoes(tenantId, id, dto.permissoesIds);
        }

        return { success: true };
    }

    async deletar(tenantId: number, id: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        await pool
            .request()
            .input('id', sql.Int, id)
            .query(`
        UPDATE grupos
        SET ativo = 0, atualizado_em = GETDATE()
        WHERE id = @id
      `);

        return { success: true };
    }

    async associarPermissoes(
        tenantId: number,
        grupoId: number,
        permissoesIds: number[],
    ) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Remover permissões antigas
        await pool
            .request()
            .input('grupoId', sql.Int, grupoId)
            .query(`
        DELETE FROM grupo_permissao WHERE grupo_id = @grupoId
      `);

        // Adicionar novas permissões
        for (const permissaoId of permissoesIds) {
            await pool
                .request()
                .input('grupoId', sql.Int, grupoId)
                .input('permissaoId', sql.Int, permissaoId)
                .query(`
          INSERT INTO grupo_permissao (grupo_id, permissao_id, criado_em)
          VALUES (@grupoId, @permissaoId, GETDATE())
        `);
        }

        return { success: true };
    }

    async associarUtilizadores(
        tenantId: number,
        grupoId: number,
        utilizadoresIds: number[],
    ) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Remover utilizadores antigos
        await pool
            .request()
            .input('grupoId', sql.Int, grupoId)
            .query(`
        DELETE FROM grupo_utilizador WHERE grupo_id = @grupoId
      `);

        // Adicionar novos utilizadores
        for (const utilizadorId of utilizadoresIds) {
            await pool
                .request()
                .input('grupoId', sql.Int, grupoId)
                .input('utilizadorId', sql.Int, utilizadorId)
                .query(`
          INSERT INTO grupo_utilizador (grupo_id, utilizador_id, criado_em)
          VALUES (@grupoId, @utilizadorId, GETDATE())
        `);
        }

        return { success: true };
    }

    async obterEstatisticas(tenantId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request().query(`
            SELECT
                COUNT(*) AS total_grupos,
                COUNT(CASE WHEN ativo = 1 THEN 1 END) AS grupos_ativos,
                COUNT(CASE WHEN ativo = 0 THEN 1 END) AS grupos_inativos,
                (SELECT COUNT(*) FROM grupo_utilizador) AS total_atribuicoes,
                (SELECT COUNT(DISTINCT utilizador_id) FROM grupo_utilizador) AS utilizadores_com_grupos,
                (SELECT COUNT(DISTINCT grupo_id) FROM grupo_permissao) AS grupos_com_permissoes,
                (SELECT AVG(cnt) FROM (
                    SELECT COUNT(*) as cnt
                    FROM grupo_utilizador
                    GROUP BY grupo_id
                ) as subquery) AS media_utilizadores_por_grupo
            FROM grupos
        `);

        return result.recordset[0];
    }
}