import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BaseService } from '../../shared/base/base.service';
import { DatabaseService } from '../../database/database.service';
import { CriarPermissaoDto } from './dto/criar-permissao.dto';
import { AtualizarPermissaoDto } from './dto/atualizar-permissao.dto';
import * as sql from 'mssql';

@Injectable()
export class PermissoesService extends BaseService {
    constructor(databaseService: DatabaseService) {
        super(databaseService);
    }

    async criar(tenantId: number, dto: CriarPermissaoDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Verificar se código já existe
        const existente = await pool
            .request()
            .input('codigo', sql.NVarChar, dto.codigo)
            .query(`
        SELECT id FROM permissoes WHERE codigo = @codigo
      `);

        if (existente.recordset.length > 0) {
            throw new BadRequestException('Código de permissão já existe');
        }

        const result = await pool
            .request()
            .input('codigo', sql.NVarChar, dto.codigo)
            .input('nome', sql.NVarChar, dto.nome)
            .input('descricao', sql.NVarChar, dto.descricao)
            .input('modulo', sql.NVarChar, dto.modulo)
            .input('tipo', sql.NVarChar, dto.tipo)
            .query(`
        INSERT INTO permissoes (codigo, nome, descricao, modulo, tipo, criado_em)
        OUTPUT INSERTED.id
        VALUES (@codigo, @nome, @descricao, @modulo, @tipo, GETDATE())
      `);

        return { id: result.recordset[0].id };
    }

    async listar(tenantId: number) {
        const result = await this.executeQuery(
            tenantId,
            `
      SELECT 
        p.*,
        (SELECT COUNT(*) FROM grupo_permissao WHERE permissao_id = p.id) AS total_grupos,
        (SELECT COUNT(*) FROM utilizador_permissao WHERE permissao_id = p.id) AS total_utilizadores_diretos
      FROM permissoes p
      ORDER BY p.modulo, p.tipo, p.nome
    `,
        );

        return result;
    }

    async listarPorModulo(tenantId: number) {
        const result = await this.executeQuery(
            tenantId,
            `
      SELECT 
        modulo,
        COUNT(*) AS total_permissoes
      FROM permissoes
      GROUP BY modulo
      ORDER BY modulo
    `,
        );

        return result;
    }

    async obterPorId(tenantId: number, id: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query(`
        SELECT 
          p.*,
          (SELECT COUNT(*) FROM grupo_permissao WHERE permissao_id = p.id) AS total_grupos,
          (SELECT COUNT(*) FROM utilizador_permissao WHERE permissao_id = p.id) AS total_utilizadores_diretos
        FROM permissoes p
        WHERE p.id = @id
      `);

        if (!result.recordset[0]) {
            throw new NotFoundException('Permissão não encontrada');
        }

        return result.recordset[0];
    }

    async obterPorCodigo(tenantId: number, codigo: string) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool
            .request()
            .input('codigo', sql.NVarChar, codigo)
            .query(`
        SELECT * FROM permissoes WHERE codigo = @codigo
      `);

        if (!result.recordset[0]) {
            throw new NotFoundException('Permissão não encontrada');
        }

        return result.recordset[0];
    }

    async atualizar(tenantId: number, id: number, dto: AtualizarPermissaoDto) {
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
        if (dto.modulo) {
            updates.push('modulo = @modulo');
            request.input('modulo', sql.NVarChar, dto.modulo);
        }
        if (dto.tipo) {
            updates.push('tipo = @tipo');
            request.input('tipo', sql.NVarChar, dto.tipo);
        }

        if (updates.length > 0) {
            await request.query(`
        UPDATE permissoes
        SET ${updates.join(', ')}
        WHERE id = @id
      `);
        }

        return { success: true };
    }

    async deletar(tenantId: number, id: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Verificar se está em uso
        const emUso = await pool
            .request()
            .input('id', sql.Int, id)
            .query(`
        SELECT 
          (SELECT COUNT(*) FROM grupo_permissao WHERE permissao_id = @id) +
          (SELECT COUNT(*) FROM utilizador_permissao WHERE permissao_id = @id) AS total
      `);

        if (emUso.recordset[0].total > 0) {
            throw new BadRequestException(
                'Permissão está em uso e não pode ser deletada',
            );
        }

        await pool
            .request()
            .input('id', sql.Int, id)
            .query(`
        DELETE FROM permissoes WHERE id = @id
      `);

        return { success: true };
    }

    async obterPermissoesDoUtilizador(tenantId: number, utilizadorId: number) {
        const result = await this.executeQuery(
            tenantId,
            `
      SELECT DISTINCT p.*
      FROM permissoes p
      WHERE p.id IN (
        -- Permissões diretas do utilizador
        SELECT permissao_id FROM utilizador_permissao WHERE utilizador_id = @utilizadorId
        UNION
        -- Permissões dos grupos do utilizador
        SELECT gp.permissao_id
        FROM grupo_permissao gp
        INNER JOIN grupo_utilizador gu ON gp.grupo_id = gu.grupo_id
        WHERE gu.utilizador_id = @utilizadorId
      )
      ORDER BY p.modulo, p.tipo, p.nome
    `,
            { utilizadorId },
        );

        return result;
    }

    async associarPermissaoAoUtilizador(
        tenantId: number,
        utilizadorId: number,
        permissaoId: number,
    ) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        try {
            await pool
                .request()
                .input('utilizadorId', sql.Int, utilizadorId)
                .input('permissaoId', sql.Int, permissaoId)
                .query(`
          INSERT INTO utilizador_permissao (utilizador_id, permissao_id, criado_em)
          VALUES (@utilizadorId, @permissaoId, GETDATE())
        `);

            return { success: true };
        } catch (error) {
            throw new BadRequestException('Permissão já associada ao utilizador');
        }
    }

    async removerPermissaoDoUtilizador(
        tenantId: number,
        utilizadorId: number,
        permissaoId: number,
    ) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        await pool
            .request()
            .input('utilizadorId', sql.Int, utilizadorId)
            .input('permissaoId', sql.Int, permissaoId)
            .query(`
        DELETE FROM utilizador_permissao 
        WHERE utilizador_id = @utilizadorId AND permissao_id = @permissaoId
      `);

        return { success: true };
    }
}