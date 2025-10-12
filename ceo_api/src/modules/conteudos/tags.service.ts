import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../shared/base/base.service';
import { DatabaseService } from '../../database/database.service';
import * as sql from 'mssql';
import { CriarTagDto } from './dto/criar-tag.dto';

@Injectable()
export class TagsService extends BaseService {
    constructor(databaseService: DatabaseService) {
        super(databaseService);
    }

    async criar(tenantId: number, dto: CriarTagDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const slug =
            dto.slug ||
            dto.nome
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');

        const result = await pool
            .request()
            .input('nome', sql.NVarChar, dto.nome)
            .input('slug', sql.NVarChar, slug)
            .input('cor', sql.NVarChar, dto.cor).query(`
        INSERT INTO tags (nome, slug, cor)
        OUTPUT INSERTED.id
        VALUES (@nome, @slug, @cor)
      `);

        return { id: result.recordset[0].id };
    }

    async listar(tenantId: number) {
        const result = await this.executeQuery(
            tenantId,
            `
      SELECT 
        t.*,
        (SELECT COUNT(*) FROM conteudo_tag WHERE tag_id = t.id) AS total_conteudos
      FROM tags t
      ORDER BY t.nome
    `,
        );

        return result;
    }

    async obterPorId(tenantId: number, id: number) {
        const result = await this.executeQuery(
            tenantId,
            `
      SELECT 
        t.*,
        (SELECT COUNT(*) FROM conteudo_tag WHERE tag_id = t.id) AS total_conteudos
      FROM tags t
      WHERE t.id = @id
    `,
            { id },
        );

        if (!result[0]) {
            throw new NotFoundException('Tag não encontrada');
        }

        return result[0];
    }

    async pesquisar(tenantId: number, termo: string) {
        const result = await this.executeQuery(
            tenantId,
            `
      SELECT TOP 10 *
      FROM tags
      WHERE nome LIKE @termo
      ORDER BY nome
    `,
            { termo: `%${termo}%` },
        );

        return result;
    }
}