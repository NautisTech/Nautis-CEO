import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../shared/base/base.service';
import { DatabaseService } from '../../database/database.service';
import * as sql from 'mssql';
import { CriarCategoriaDto } from './dto/criar-categoria.dto';

@Injectable()
export class CategoriasService extends BaseService {
    constructor(databaseService: DatabaseService) {
        super(databaseService);
    }

    async criar(tenantId: number, dto: CriarCategoriaDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Gerar slug se não fornecido
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
            .input('descricao', sql.NVarChar, dto.descricao)
            .input('cor', sql.NVarChar, dto.cor)
            .input('icone', sql.NVarChar, dto.icone)
            .input('ordem', sql.Int, dto.ordem || 0)
            .input('categoriaPaiId', sql.Int, dto.categoriaPaiId).query(`
        INSERT INTO categorias_conteudo 
          (nome, slug, descricao, cor, icone, ordem, categoria_pai_id)
        OUTPUT INSERTED.id
        VALUES 
          (@nome, @slug, @descricao, @cor, @icone, @ordem, @categoriaPaiId)
      `);

        return { id: result.recordset[0].id };
    }

    async listar(tenantId: number) {
        const result = await this.executeQuery(
            tenantId,
            `
      SELECT 
        c.*,
        pai.nome AS categoria_pai_nome,
        (SELECT COUNT(*) FROM conteudos WHERE categoria_id = c.id) AS total_conteudos
      FROM categorias_conteudo c
      LEFT JOIN categorias_conteudo pai ON c.categoria_pai_id = pai.id
      WHERE c.ativo = 1
      ORDER BY c.ordem, c.nome
    `,
        );

        return result;
    }

    async obterPorId(tenantId: number, id: number) {
        const result = await this.executeQuery(
            tenantId,
            `
      SELECT 
        c.*,
        pai.nome AS categoria_pai_nome,
        (SELECT COUNT(*) FROM conteudos WHERE categoria_id = c.id) AS total_conteudos
      FROM categorias_conteudo c
      LEFT JOIN categorias_conteudo pai ON c.categoria_pai_id = pai.id
      WHERE c.id = @id
    `,
            { id },
        );

        if (!result[0]) {
            throw new NotFoundException('Categoria não encontrada');
        }

        return result[0];
    }
}