import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { BaseService } from '../../shared/base/base.service';
import { DatabaseService } from '../../database/database.service';
import * as sql from 'mssql';
import { CriarComentarioDto } from './dto/criar-comentario.dto';


@Injectable()
export class ComentariosService extends BaseService {
    constructor(databaseService: DatabaseService) {
        super(databaseService);
    }

    async criar(tenantId: number, utilizadorId: number, dto: CriarComentarioDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Verificar se conteúdo permite comentários
        const conteudoResult = await pool
            .request()
            .input('conteudoId', sql.Int, dto.conteudoId)
            .query(`
        SELECT permite_comentarios 
        FROM conteudos 
        WHERE id = @conteudoId
      `);

        if (!conteudoResult.recordset[0]) {
            throw new NotFoundException('Conteúdo não encontrado');
        }

        if (!conteudoResult.recordset[0].permite_comentarios) {
            throw new ForbiddenException('Este conteúdo não permite comentários');
        }

        const result = await pool
            .request()
            .input('conteudoId', sql.Int, dto.conteudoId)
            .input('utilizadorId', sql.Int, utilizadorId)
            .input('comentarioPaiId', sql.Int, dto.comentarioPaiId)
            .input('conteudo', sql.NVarChar, dto.conteudo).query(`
        INSERT INTO comentarios 
          (conteudo_id, utilizador_id, comentario_pai_id, conteudo)
        OUTPUT INSERTED.id
        VALUES 
          (@conteudoId, @utilizadorId, @comentarioPaiId, @conteudo)
      `);

        return { id: result.recordset[0].id };
    }

    async listar(tenantId: number, conteudoId: number) {
        const result = await this.executeQuery(
            tenantId,
            `
      SELECT 
        c.id,
        c.conteudo,
        c.comentario_pai_id,
        c.utilizador_id,
        u.username AS utilizador_nome,
        u.foto_url AS utilizador_foto,
        c.aprovado,
        c.likes,
        c.criado_em,
        c.atualizado_em,
        (SELECT COUNT(*) FROM comentarios WHERE comentario_pai_id = c.id) AS total_respostas
      FROM comentarios c
      INNER JOIN utilizadores u ON c.utilizador_id = u.id
      WHERE c.conteudo_id = @conteudoId 
        AND c.aprovado = 1
        AND c.comentario_pai_id IS NULL
      ORDER BY c.criado_em DESC
    `,
            { conteudoId },
        );

        return result;
    }

    async obterRespostas(tenantId: number, comentarioPaiId: number) {
        const result = await this.executeQuery(
            tenantId,
            `
      SELECT 
        c.id,
        c.conteudo,
        c.comentario_pai_id,
        c.utilizador_id,
        u.username AS utilizador_nome,
        u.foto_url AS utilizador_foto,
        c.aprovado,
        c.likes,
        c.criado_em,
        c.atualizado_em
      FROM comentarios c
      INNER JOIN utilizadores u ON c.utilizador_id = u.id
      WHERE c.comentario_pai_id = @comentarioPaiId 
        AND c.aprovado = 1
      ORDER BY c.criado_em ASC
    `,
            { comentarioPaiId },
        );

        return result;
    }

    async aprovar(tenantId: number, id: number, aprovadorId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        await pool
            .request()
            .input('id', sql.Int, id)
            .input('aprovadorId', sql.Int, aprovadorId)
            .query(`
        UPDATE comentarios
        SET aprovado = 1,
            aprovado_por_id = @aprovadorId,
            aprovado_em = GETDATE()
        WHERE id = @id
      `);

        return { success: true };
    }

    async rejeitar(tenantId: number, id: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        await pool.request().input('id', sql.Int, id).query(`
        DELETE FROM comentarios WHERE id = @id
      `);

        return { success: true };
    }

    async darLike(tenantId: number, id: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        await pool.request().input('id', sql.Int, id).query(`
        UPDATE comentarios
        SET likes = likes + 1
        WHERE id = @id
      `);

        return { success: true };
    }
}