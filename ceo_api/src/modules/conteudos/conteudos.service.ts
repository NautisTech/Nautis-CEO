import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BaseService } from '../../shared/base/base.service';
import { DatabaseService } from '../../database/database.service';
import { CriarConteudoDto } from './dto/criar-conteudo.dto';
import { AtualizarConteudoDto } from './dto/atualizar-conteudo.dto';
import { FiltrarConteudosDto } from './dto/filtrar-conteudos.dto';
import * as sql from 'mssql';

@Injectable()
export class ConteudosService extends BaseService {
    constructor(databaseService: DatabaseService) {
        super(databaseService);
    }

    async criar(tenantId: number, autorId: number, dto: CriarConteudoDto) {
        // Preparar dados para a stored procedure
        const tagsJson = dto.tags ? JSON.stringify(dto.tags) : null;
        const anexosJson = dto.anexosIds ? JSON.stringify(dto.anexosIds) : null;
        const camposJson = dto.camposPersonalizados
            ? JSON.stringify(dto.camposPersonalizados)
            : null;

        const result = await this.executeProcedure(
            tenantId,
            'sp_CriarConteudoCompleto',
            {
                TipoConteudoId: dto.tipoConteudoId,
                CategoriaId: dto.categoriaId,
                Titulo: dto.titulo,
                Slug: dto.slug,
                Subtitulo: dto.subtitulo,
                Resumo: dto.resumo,
                Conteudo: dto.conteudo,
                ImagemDestaque: dto.imagemDestaque,
                AutorId: autorId,
                Status: dto.status || 'rascunho',
                Destaque: dto.destaque ? 1 : 0,
                PermiteComentarios: dto.permiteComentarios !== false ? 1 : 0,
                DataInicio: dto.dataInicio,
                DataFim: dto.dataFim,
                Tags: tagsJson,
                AnexosIds: anexosJson,
                CamposPersonalizados: camposJson,
                MetaTitle: dto.metaTitle,
                MetaDescription: dto.metaDescription,
                MetaKeywords: dto.metaKeywords,
            },
        );

        const response = result[0];

        if (response.Status === 'ERROR') {
            throw new BadRequestException(response.ErrorMessage);
        }

        return {
            id: response.ConteudoId,
            slug: response.Slug,
        };
    }

    async listar(tenantId: number, filtros: FiltrarConteudosDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const request = pool.request();

        let query = `
      SELECT 
        c.id,
        c.tipo_conteudo_id,
        tc.nome AS tipo_conteudo_nome,
        tc.codigo AS tipo_conteudo_codigo,
        c.categoria_id,
        cat.nome AS categoria_nome,
        c.titulo,
        c.slug,
        c.subtitulo,
        c.resumo,
        c.imagem_destaque,
        c.autor_id,
        u.username AS autor_nome,
        c.status,
        c.destaque,
        c.permite_comentarios,
        c.visualizacoes,
        c.publicado_em,
        c.data_inicio,
        c.data_fim,
        c.criado_em,
        c.atualizado_em,
        (SELECT COUNT(*) FROM comentarios WHERE conteudo_id = c.id AND aprovado = 1) AS total_comentarios,
        (SELECT COUNT(*) FROM conteudos_favoritos WHERE conteudo_id = c.id) AS total_favoritos
      FROM conteudos c
      INNER JOIN tipos_conteudo tc ON c.tipo_conteudo_id = tc.id
      LEFT JOIN categorias_conteudo cat ON c.categoria_id = cat.id
      LEFT JOIN utilizadores u ON c.autor_id = u.id
      WHERE 1=1
    `;

        // Filtros
        if (filtros.tipoConteudoId) {
            query += ' AND c.tipo_conteudo_id = @tipoConteudoId';
            request.input('tipoConteudoId', sql.Int, filtros.tipoConteudoId);
        }

        if (filtros.categoriaId) {
            query += ' AND c.categoria_id = @categoriaId';
            request.input('categoriaId', sql.Int, filtros.categoriaId);
        }

        if (filtros.status) {
            query += ' AND c.status = @status';
            request.input('status', sql.NVarChar, filtros.status);
        }

        if (filtros.destaque !== undefined) {
            query += ' AND c.destaque = @destaque';
            request.input('destaque', sql.Bit, filtros.destaque ? 1 : 0);
        }

        if (filtros.autorId) {
            query += ' AND c.autor_id = @autorId';
            request.input('autorId', sql.Int, filtros.autorId);
        }

        if (filtros.textoPesquisa) {
            query += ` AND (c.titulo LIKE @texto OR c.resumo LIKE @texto OR c.conteudo LIKE @texto)`;
            request.input('texto', sql.NVarChar, `%${filtros.textoPesquisa}%`);
        }

        if (filtros.tag) {
            query += `
        AND EXISTS (
          SELECT 1 FROM conteudo_tag ct
          INNER JOIN tags t ON ct.tag_id = t.id
          WHERE ct.conteudo_id = c.id AND t.slug = @tag
        )
      `;
            request.input('tag', sql.NVarChar, filtros.tag);
        }

        // Paginação
        const page = filtros.page || 1;
        const pageSize = filtros.pageSize || 20;
        const offset = (page - 1) * pageSize;

        // Count total
        const countQuery = `SELECT COUNT(*) as total FROM (${query}) as subquery`;
        const countResult = await request.query(countQuery);
        const total = countResult.recordset[0].total;

        // Query com paginação
        query += `
      ORDER BY 
        CASE WHEN c.destaque = 1 THEN 0 ELSE 1 END,
        c.publicado_em DESC,
        c.criado_em DESC
      OFFSET @offset ROWS
      FETCH NEXT @pageSize ROWS ONLY
    `;

        request.input('offset', sql.Int, offset);
        request.input('pageSize', sql.Int, pageSize);

        const result = await request.query(query);

        return {
            data: result.recordset,
            meta: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        };
    }

    async obterPorId(tenantId: number, id: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Buscar conteúdo principal
        const conteudoResult = await pool
            .request()
            .input('id', sql.Int, id)
            .query(`
        SELECT 
          c.*,
          tc.nome AS tipo_conteudo_nome,
          tc.codigo AS tipo_conteudo_codigo,
          tc.permite_comentarios AS tipo_permite_comentarios,
          tc.permite_anexos AS tipo_permite_anexos,
          tc.permite_galeria AS tipo_permite_galeria,
          cat.nome AS categoria_nome,
          cat.slug AS categoria_slug,
          u.username AS autor_nome,
          u.email AS autor_email,
          aprovador.username AS aprovador_nome
        FROM conteudos c
        INNER JOIN tipos_conteudo tc ON c.tipo_conteudo_id = tc.id
        LEFT JOIN categorias_conteudo cat ON c.categoria_id = cat.id
        LEFT JOIN utilizadores u ON c.autor_id = u.id
        LEFT JOIN utilizadores aprovador ON c.aprovado_por_id = aprovador.id
        WHERE c.id = @id
      `);

        if (!conteudoResult.recordset[0]) {
            throw new NotFoundException('Conteúdo não encontrado');
        }

        const conteudo = conteudoResult.recordset[0];

        // Buscar tags
        const tagsResult = await pool
            .request()
            .input('id', sql.Int, id)
            .query(`
        SELECT t.id, t.nome, t.slug, t.cor
        FROM tags t
        INNER JOIN conteudo_tag ct ON t.id = ct.tag_id
        WHERE ct.conteudo_id = @id
      `);

        // Buscar anexos
        const anexosResult = await pool
            .request()
            .input('id', sql.Int, id)
            .query(`
        SELECT 
          ca.id,
          ca.tipo_anexo,
          ca.legenda,
          ca.ordem,
          ca.principal,
          a.nome_original,
          a.nome_arquivo,
          a.caminho,
          a.url,
          a.tipo,
          a.tamanho
        FROM conteudo_anexo ca
        INNER JOIN anexos a ON ca.anexo_id = a.id
        WHERE ca.conteudo_id = @id
        ORDER BY ca.principal DESC, ca.ordem
      `);

        // Buscar campos personalizados
        const camposResult = await pool
            .request()
            .input('id', sql.Int, id)
            .query(`
        SELECT 
          codigo_campo,
          valor_texto,
          valor_numero,
          valor_data,
          valor_datetime,
          valor_boolean,
          valor_json
        FROM conteudos_valores_personalizados
        WHERE conteudo_id = @id
      `);

        return {
            ...conteudo,
            tags: tagsResult.recordset,
            anexos: anexosResult.recordset,
            campos_personalizados: camposResult.recordset,
        };
    }

    async obterPorSlug(tenantId: number, slug: string) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool
            .request()
            .input('slug', sql.NVarChar, slug)
            .query(`
        SELECT id FROM conteudos WHERE slug = @slug
      `);

        if (!result.recordset[0]) {
            throw new NotFoundException('Conteúdo não encontrado');
        }

        return this.obterPorId(tenantId, result.recordset[0].id);
    }

    async atualizar(
        tenantId: number,
        id: number,
        dto: AtualizarConteudoDto,
    ) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const updates: string[] = [];
        const request = pool.request().input('id', sql.Int, id);

        if (dto.titulo) {
            updates.push('titulo = @titulo');
            request.input('titulo', sql.NVarChar, dto.titulo);
        }
        if (dto.slug) {
            updates.push('slug = @slug');
            request.input('slug', sql.NVarChar, dto.slug);
        }
        if (dto.subtitulo !== undefined) {
            updates.push('subtitulo = @subtitulo');
            request.input('subtitulo', sql.NVarChar, dto.subtitulo);
        }
        if (dto.resumo !== undefined) {
            updates.push('resumo = @resumo');
            request.input('resumo', sql.NVarChar, dto.resumo);
        }
        if (dto.conteudo !== undefined) {
            updates.push('conteudo = @conteudo');
            request.input('conteudo', sql.NVarChar, dto.conteudo);
        }
        if (dto.imagemDestaque !== undefined) {
            updates.push('imagem_destaque = @imagemDestaque');
            request.input('imagemDestaque', sql.NVarChar, dto.imagemDestaque);
        }
        if (dto.status) {
            updates.push('status = @status');
            request.input('status', sql.NVarChar, dto.status);

            if (dto.status === 'publicado') {
                updates.push('publicado_em = GETDATE()');
            }
        }
        if (dto.destaque !== undefined) {
            updates.push('destaque = @destaque');
            request.input('destaque', sql.Bit, dto.destaque ? 1 : 0);
        }
        if (dto.categoriaId !== undefined) {
            updates.push('categoria_id = @categoriaId');
            request.input('categoriaId', sql.Int, dto.categoriaId);
        }

        updates.push('atualizado_em = GETDATE()');

        if (updates.length > 0) {
            await request.query(`
        UPDATE conteudos
        SET ${updates.join(', ')}
        WHERE id = @id
      `);
        }

        return { success: true };
    }

    async publicar(tenantId: number, id: number, aprovadorId?: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        await pool
            .request()
            .input('id', sql.Int, id)
            .input('aprovadorId', sql.Int, aprovadorId)
            .query(`
        UPDATE conteudos
        SET status = 'publicado',
            publicado_em = GETDATE(),
            aprovado_por_id = @aprovadorId,
            aprovado_em = GETDATE(),
            atualizado_em = GETDATE()
        WHERE id = @id
      `);

        return { success: true };
    }

    async arquivar(tenantId: number, id: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        await pool
            .request()
            .input('id', sql.Int, id)
            .query(`
        UPDATE conteudos
        SET status = 'arquivado',
            atualizado_em = GETDATE()
        WHERE id = @id
      `);

        return { success: true };
    }

    async registrarVisualizacao(
        tenantId: number,
        conteudoId: number,
        utilizadorId?: number,
        ipAddress?: string,
        userAgent?: string,
    ) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Registrar visualização
        await pool
            .request()
            .input('conteudoId', sql.Int, conteudoId)
            .input('utilizadorId', sql.Int, utilizadorId)
            .input('ipAddress', sql.NVarChar, ipAddress)
            .input('userAgent', sql.NVarChar, userAgent)
            .query(`
        INSERT INTO conteudos_visualizacoes 
          (conteudo_id, utilizador_id, ip_address, user_agent)
        VALUES 
          (@conteudoId, @utilizadorId, @ipAddress, @userAgent)
      `);

        // Incrementar contador
        await pool
            .request()
            .input('conteudoId', sql.Int, conteudoId)
            .query(`
        UPDATE conteudos
        SET visualizacoes = visualizacoes + 1
        WHERE id = @conteudoId
      `);

        return { success: true };
    }

    async favoritar(tenantId: number, conteudoId: number, utilizadorId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        try {
            await pool
                .request()
                .input('conteudoId', sql.Int, conteudoId)
                .input('utilizadorId', sql.Int, utilizadorId)
                .query(`
          INSERT INTO conteudos_favoritos (conteudo_id, utilizador_id)
          VALUES (@conteudoId, @utilizadorId)
        `);

            return { success: true, favorito: true };
        } catch (error) {
            // Se já existe, remover (toggle)
            await pool
                .request()
                .input('conteudoId', sql.Int, conteudoId)
                .input('utilizadorId', sql.Int, utilizadorId)
                .query(`
          DELETE FROM conteudos_favoritos
          WHERE conteudo_id = @conteudoId AND utilizador_id = @utilizadorId
        `);

            return { success: true, favorito: false };
        }
    }

    async obterEstatisticas(tenantId: number, conteudoId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        let result;
        if (conteudoId > 0) {
            result = await pool
                .request()
                .input('conteudoId', sql.Int, conteudoId)
                .query(`
                  SELECT 
                    c.visualizacoes AS total_visualizacoes,
                    COUNT(DISTINCT com.id) AS total_comentarios,
                    COUNT(DISTINCT fav.id) AS total_favoritos,
                    SUM(CASE WHEN vis.visualizado_em >= DATEADD(day, -7, GETDATE()) THEN 1 ELSE 0 END) AS visualizacoes_semana,
                    SUM(CASE WHEN vis.visualizado_em >= DATEADD(day, -30, GETDATE()) THEN 1 ELSE 0 END) AS visualizacoes_mes
                  FROM conteudos c
                  LEFT JOIN comentarios com ON com.conteudo_id = c.id AND com.aprovado = 1
                  LEFT JOIN conteudos_favoritos fav ON fav.conteudo_id = c.id
                  LEFT JOIN conteudos_visualizacoes vis ON vis.conteudo_id = c.id
                  WHERE c.id = @conteudoId
                  GROUP BY c.visualizacoes;
            `);
        } else {
            result = await pool
                .request()
                .input('conteudoId', sql.Int, conteudoId)
                .query(`
                  SELECT 
                    SUM(c.visualizacoes) AS total_visualizacoes,
                    COUNT(DISTINCT com.id) AS total_comentarios,
                    COUNT(DISTINCT fav.id) AS total_favoritos,
                    SUM(CASE WHEN vis.visualizado_em >= DATEADD(day, -7, GETDATE()) THEN 1 ELSE 0 END) AS visualizacoes_semana,
                    SUM(CASE WHEN vis.visualizado_em >= DATEADD(day, -30, GETDATE()) THEN 1 ELSE 0 END) AS visualizacoes_mes
                  FROM conteudos c
                  LEFT JOIN comentarios com ON com.conteudo_id = c.id AND com.aprovado = 1
                  LEFT JOIN conteudos_favoritos fav ON fav.conteudo_id = c.id
                  LEFT JOIN conteudos_visualizacoes vis ON vis.conteudo_id = c.id
            `);
        }

        return result.recordset[0];
    }
}