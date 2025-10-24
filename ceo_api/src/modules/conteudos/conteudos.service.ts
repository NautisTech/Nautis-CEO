import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
    const pool = await this.databaseService.getTenantConnection(tenantId);
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      // Gerar slug se não fornecido
      let slug = dto.slug;
      if (!slug) {
        slug = dto.titulo
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
      }

      // Inserir conteúdo principal
      const publicadoEm = dto.status === 'publicado' ? new Date() : null;

      const conteudoResult = await new sql.Request(transaction)
        .input('tipoConteudoId', sql.Int, dto.tipoConteudoId)
        .input('categoriaId', sql.Int, dto.categoriaId)
        .input('titulo', sql.NVarChar, dto.titulo)
        .input('slug', sql.NVarChar, slug)
        .input('subtitulo', sql.NVarChar, dto.subtitulo)
        .input('resumo', sql.NVarChar, dto.resumo)
        .input('conteudo', sql.NVarChar, dto.conteudo)
        .input('imagemDestaque', sql.NVarChar, dto.imagemDestaque)
        .input('autorId', sql.Int, autorId)
        .input('status', sql.NVarChar, dto.status || 'rascunho')
        .input('destaque', sql.Bit, dto.destaque ? 1 : 0)
        .input(
          'permiteComentarios',
          sql.Bit,
          dto.permiteComentarios !== false ? 1 : 0,
        )
        .input('dataInicio', sql.DateTime, dto.dataInicio)
        .input('dataFim', sql.DateTime, dto.dataFim)
        .input('metaTitle', sql.NVarChar, dto.metaTitle)
        .input('metaDescription', sql.NVarChar, dto.metaDescription)
        .input('metaKeywords', sql.NVarChar, dto.metaKeywords)
        .input('publicadoEm', sql.DateTime, publicadoEm).query(`
                    INSERT INTO conteudos
                        (tipo_conteudo_id, categoria_id, titulo, slug, subtitulo, resumo, conteudo,
                         imagem_destaque, autor_id, status, destaque, permite_comentarios,
                         data_inicio, data_fim, meta_title, meta_description, meta_keywords, publicado_em)
                    OUTPUT INSERTED.id
                    VALUES
                        (@tipoConteudoId, @categoriaId, @titulo, @slug, @subtitulo, @resumo, @conteudo,
                         @imagemDestaque, @autorId, @status, @destaque, @permiteComentarios,
                         @dataInicio, @dataFim, @metaTitle, @metaDescription, @metaKeywords, @publicadoEm)
                `);

      const conteudoId = conteudoResult.recordset[0].id;

      // Processar tags
      if (dto.tags && dto.tags.length > 0) {
        for (const tagNome of dto.tags) {
          // Verificar se tag existe
          const tagResult = await new sql.Request(transaction)
            .input('nome', sql.NVarChar, tagNome)
            .query('SELECT id FROM tags WHERE nome = @nome');

          let tagId: number;

          if (tagResult.recordset.length > 0) {
            tagId = tagResult.recordset[0].id;
          } else {
            // Criar tag se não existir
            const tagSlug = tagNome
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-');

            const newTagResult = await new sql.Request(transaction)
              .input('nome', sql.NVarChar, tagNome)
              .input('slug', sql.NVarChar, tagSlug).query(`
                                INSERT INTO tags (nome, slug)
                                OUTPUT INSERTED.id
                                VALUES (@nome, @slug)
                            `);

            tagId = newTagResult.recordset[0].id;
          }

          // Associar tag ao conteúdo
          await new sql.Request(transaction)
            .input('conteudoId', sql.Int, conteudoId)
            .input('tagId', sql.Int, tagId).query(`
                            INSERT INTO conteudo_tag (conteudo_id, tag_id)
                            VALUES (@conteudoId, @tagId)
                        `);
        }
      }

      // Processar campos personalizados
      if (dto.camposPersonalizados && dto.camposPersonalizados.length > 0) {
        for (const campo of dto.camposPersonalizados) {
          const requestCampo = new sql.Request(transaction);
          requestCampo.input('conteudoId', sql.Int, conteudoId);
          requestCampo.input('codigoCampo', sql.NVarChar, campo.codigo);

          // Determinar qual coluna usar baseado no tipo
          let query = `
                        INSERT INTO conteudos_valores_personalizados
                        (conteudo_id, codigo_campo, `;

          switch (campo.tipo) {
            case 'numero':
              query +=
                'valor_numero) VALUES (@conteudoId, @codigoCampo, @valor)';
              requestCampo.input('valor', sql.Decimal(18, 2), campo.valor);
              break;
            case 'data':
              query += 'valor_data) VALUES (@conteudoId, @codigoCampo, @valor)';
              requestCampo.input('valor', sql.Date, campo.valor);
              break;
            case 'datetime':
              query +=
                'valor_datetime) VALUES (@conteudoId, @codigoCampo, @valor)';
              requestCampo.input('valor', sql.DateTime, campo.valor);
              break;
            case 'boolean':
              query +=
                'valor_boolean) VALUES (@conteudoId, @codigoCampo, @valor)';
              requestCampo.input('valor', sql.Bit, campo.valor ? 1 : 0);
              break;
            case 'json':
              query += 'valor_json) VALUES (@conteudoId, @codigoCampo, @valor)';
              requestCampo.input(
                'valor',
                sql.NVarChar,
                typeof campo.valor === 'string'
                  ? campo.valor
                  : JSON.stringify(campo.valor),
              );
              break;
            default: // texto, textarea, select, radio, etc
              query +=
                'valor_texto) VALUES (@conteudoId, @codigoCampo, @valor)';
              requestCampo.input('valor', sql.NVarChar, campo.valor);
          }

          await requestCampo.query(query);
        }
      }

      // Processar anexos
      if (dto.anexosIds && dto.anexosIds.length > 0) {
        for (let i = 0; i < dto.anexosIds.length; i++) {
          const anexoId = dto.anexosIds[i];

          // Buscar tipo do anexo
          const anexoResult = await new sql.Request(transaction)
            .input('anexoId', sql.Int, anexoId)
            .query('SELECT tipo FROM anexos WHERE id = @anexoId');

          if (anexoResult.recordset.length > 0) {
            const tipo = anexoResult.recordset[0].tipo;
            let tipoAnexo = 'documento';

            if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(tipo)) {
              tipoAnexo = 'imagem';
            } else if (['mp4', 'avi', 'mov'].includes(tipo)) {
              tipoAnexo = 'video';
            } else if (['mp3', 'wav'].includes(tipo)) {
              tipoAnexo = 'audio';
            }

            await new sql.Request(transaction)
              .input('conteudoId', sql.Int, conteudoId)
              .input('anexoId', sql.Int, anexoId)
              .input('tipoAnexo', sql.NVarChar, tipoAnexo)
              .input('ordem', sql.Int, i)
              .input('principal', sql.Bit, i === 0 ? 1 : 0).query(`
                                INSERT INTO conteudo_anexo (conteudo_id, anexo_id, tipo_anexo, ordem, principal)
                                VALUES (@conteudoId, @anexoId, @tipoAnexo, @ordem, @principal)
                            `);
          }
        }
      }

      await transaction.commit();

      return {
        id: conteudoId,
        slug: slug,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
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
            tc.permite_comentarios AS tipo_permite_comentarios,
            c.categoria_id,
            cat.nome AS categoria_nome,
            cat.icone AS categoria_icone,
            cat.cor AS categoria_cor,
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
            c.ordem,
            c.visibilidade,
            (SELECT COUNT(*) FROM comentarios WHERE conteudo_id = c.id AND aprovado = 1) AS total_comentarios,
            (SELECT COUNT(*) FROM conteudos_favoritos WHERE conteudo_id = c.id) AS total_favoritos,
            (
              SELECT 
                codigo_campo,
                valor_texto,
                valor_numero,
                valor_data,
                valor_datetime,
                valor_boolean,
                valor_json
              FROM conteudos_valores_personalizados
              WHERE conteudo_id = c.id
              FOR JSON PATH
            ) AS campos_personalizados
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

    // Parse campos personalizados JSON
    const data = result.recordset.map((item) => ({
      ...item,
      campos_personalizados: item.campos_personalizados
        ? JSON.parse(item.campos_personalizados)
        : [],
    }));

    return {
      data,
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
    const conteudoResult = await pool.request().input('id', sql.Int, id).query(`
            SELECT 
              c.*,
              tc.nome AS tipo_conteudo_nome,
              tc.codigo AS tipo_conteudo_codigo,
              tc.permite_comentarios AS tipo_permite_comentarios,
              tc.permite_anexos AS tipo_permite_anexos,
              tc.permite_galeria AS tipo_permite_galeria,
              tc.max_anexos AS tipo_max_anexos,
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
    const tagsResult = await pool.request().input('id', sql.Int, id).query(`
            SELECT t.id, t.nome, t.slug, t.cor
            FROM tags t
            INNER JOIN conteudo_tag ct ON t.id = ct.tag_id
            WHERE ct.conteudo_id = @id
          `);

    // Buscar anexos - QUERY CORRIGIDA

    const anexosResult = await pool.request().input('id', sql.Int, id).query(`
                SELECT 
                ca.id AS conteudo_anexo_id,
                ca.tipo_anexo,
                ca.legenda,
                ca.ordem,
                ca.principal,
                a.id,
                a.nome,
                a.nome_original,
                a.caminho,
                a.tipo,
                a.mime_type,
                a.tamanho_bytes,
                a.upload_por_id,
                a.variants,
                u.username AS upload_por_nome
                FROM conteudo_anexo ca
                INNER JOIN anexos a ON ca.anexo_id = a.id
                LEFT JOIN utilizadores u ON a.upload_por_id = u.id
                WHERE ca.conteudo_id = @id
                ORDER BY ca.principal DESC, ca.ordem
            `);

    // Buscar campos personalizados
    const camposResult = await pool.request().input('id', sql.Int, id).query(`
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

    // Montar URL dos anexos
    const apiUrl = process.env.API_URL || 'http://localhost:9833';
    const anexos = anexosResult.recordset.map((anexo) => {
      const baseUrl = `${apiUrl}/uploads/tenant_${tenantId}`;

      const isExternal =
        anexo.caminho &&
        (anexo.caminho.startsWith('http://') ||
          anexo.caminho.startsWith('https://'));

      let url = isExternal ? anexo.caminho : `${baseUrl}/${anexo.nome}`;
      let variants: any;

      if (anexo.variants && !isExternal) {
        try {
          const variantsObj = JSON.parse(anexo.variants);
          variants = {
            original: `${baseUrl}/${variantsObj.original}`,
            large: `${baseUrl}/${variantsObj.large}`,
            medium: `${baseUrl}/${variantsObj.medium}`,
            small: `${baseUrl}/${variantsObj.small}`,
            thumbnail: `${baseUrl}/${variantsObj.thumbnail}`,
          };
        } catch (error) { }
      }

      return {
        conteudo_anexo_id: anexo.conteudo_anexo_id,
        id: anexo.id,
        tipo_anexo: anexo.tipo_anexo,
        legenda: anexo.legenda,
        ordem: anexo.ordem,
        principal: anexo.principal,
        nome: anexo.nome,
        nome_original: anexo.nome_original,
        caminho: anexo.caminho,
        tipo: anexo.tipo,
        mime_type: anexo.mime_type,
        tamanho_bytes: anexo.tamanho_bytes,
        upload_por_id: anexo.upload_por_id,
        upload_por_nome: anexo.upload_por_nome,
        url: url,
        variants: variants, // Adicionar variants
      };
    });

    const resultado = {
      ...conteudo,
      tags: tagsResult.recordset,
      anexos: anexos,
      campos_personalizados: camposResult.recordset,
    };

    return resultado;
  }

  async obterPorSlug(
    tenantId: number,
    slug: string,
    ip?: string,
    userAgent?: string,
    user?: any,
  ) {
    const pool = await this.databaseService.getTenantConnection(tenantId);

    const result = await pool.request().input('slug', sql.NVarChar, slug)
      .query(`
        SELECT id FROM conteudos WHERE slug = @slug
      `);

    if (!result.recordset[0]) {
      throw new NotFoundException('Conteúdo não encontrado');
    }

    await this.registrarVisualizacao(
      tenantId,
      result.recordset[0].id,
      user?.sub,
      ip,
      userAgent,
    );

    return this.obterPorId(tenantId, result.recordset[0].id);
  }

  async atualizar(tenantId: number, id: number, dto: AtualizarConteudoDto) {
    const pool = await this.databaseService.getTenantConnection(tenantId);

    // Iniciar transação
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      const updates: string[] = [];
      const request = new sql.Request(transaction);
      request.input('id', sql.Int, id);

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
      if (dto.permiteComentarios !== undefined) {
        updates.push('permite_comentarios = @permiteComentarios');
        request.input(
          'permiteComentarios',
          sql.Bit,
          dto.permiteComentarios ? 1 : 0,
        );
      }
      if (dto.dataInicio !== undefined) {
        updates.push('data_inicio = @dataInicio');
        request.input('dataInicio', sql.DateTime, dto.dataInicio);
      }
      if (dto.dataFim !== undefined) {
        updates.push('data_fim = @dataFim');
        request.input('dataFim', sql.DateTime, dto.dataFim);
      }
      if (dto.metaTitle !== undefined) {
        updates.push('meta_title = @metaTitle');
        request.input('metaTitle', sql.NVarChar, dto.metaTitle);
      }
      if (dto.metaDescription !== undefined) {
        updates.push('meta_description = @metaDescription');
        request.input('metaDescription', sql.NVarChar, dto.metaDescription);
      }
      if (dto.metaKeywords !== undefined) {
        updates.push('meta_keywords = @metaKeywords');
        request.input('metaKeywords', sql.NVarChar, dto.metaKeywords);
      }

      updates.push('atualizado_em = GETDATE()');

      // Atualizar conteúdo principal
      if (updates.length > 0) {
        await request.query(`
                    UPDATE conteudos
                    SET ${updates.join(', ')}
                    WHERE id = @id
                `);
      }

      // Atualizar tags se fornecidas
      if (dto.tags && dto.tags.length > 0) {
        // Remover tags antigas
        await new sql.Request(transaction)
          .input('conteudoId', sql.Int, id)
          .query('DELETE FROM conteudo_tag WHERE conteudo_id = @conteudoId');

        // Inserir novas tags
        for (const tagNome of dto.tags) {
          // Verificar se tag existe
          const tagResult = await new sql.Request(transaction)
            .input('nome', sql.NVarChar, tagNome)
            .query('SELECT id FROM tags WHERE nome = @nome');

          let tagId: number;

          if (tagResult.recordset.length > 0) {
            tagId = tagResult.recordset[0].id;
          } else {
            // Criar tag se não existir
            const slug = tagNome
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-');

            const newTagResult = await new sql.Request(transaction)
              .input('nome', sql.NVarChar, tagNome)
              .input('slug', sql.NVarChar, slug).query(`
                                INSERT INTO tags (nome, slug)
                                OUTPUT INSERTED.id
                                VALUES (@nome, @slug)
                            `);

            tagId = newTagResult.recordset[0].id;
          }

          // Associar tag ao conteúdo
          await new sql.Request(transaction)
            .input('conteudoId', sql.Int, id)
            .input('tagId', sql.Int, tagId).query(`
                            INSERT INTO conteudo_tag (conteudo_id, tag_id)
                            VALUES (@conteudoId, @tagId)
                        `);
        }
      }

      // Atualizar campos personalizados se fornecidos
      if (dto.camposPersonalizados && dto.camposPersonalizados.length > 0) {
        // Remover campos antigos
        await new sql.Request(transaction)
          .input('conteudoId', sql.Int, id)
          .query(
            'DELETE FROM conteudos_valores_personalizados WHERE conteudo_id = @conteudoId',
          );

        // Inserir novos valores
        for (const campo of dto.camposPersonalizados) {
          const requestCampo = new sql.Request(transaction);
          requestCampo.input('conteudoId', sql.Int, id);
          requestCampo.input('codigoCampo', sql.NVarChar, campo.codigo);

          // Determinar qual coluna usar baseado no tipo
          let query = `
                        INSERT INTO conteudos_valores_personalizados 
                        (conteudo_id, codigo_campo, `;

          switch (campo.tipo) {
            case 'numero':
              query +=
                'valor_numero) VALUES (@conteudoId, @codigoCampo, @valor)';
              requestCampo.input('valor', sql.Decimal(18, 2), campo.valor);
              break;
            case 'data':
              query += 'valor_data) VALUES (@conteudoId, @codigoCampo, @valor)';
              requestCampo.input('valor', sql.Date, campo.valor);
              break;
            case 'datetime':
              query +=
                'valor_datetime) VALUES (@conteudoId, @codigoCampo, @valor)';
              requestCampo.input('valor', sql.DateTime, campo.valor);
              break;
            case 'boolean':
              query +=
                'valor_boolean) VALUES (@conteudoId, @codigoCampo, @valor)';
              requestCampo.input('valor', sql.Bit, campo.valor ? 1 : 0);
              break;
            case 'json':
              query += 'valor_json) VALUES (@conteudoId, @codigoCampo, @valor)';
              requestCampo.input(
                'valor',
                sql.NVarChar,
                typeof campo.valor === 'string'
                  ? campo.valor
                  : JSON.stringify(campo.valor),
              );
              break;
            default: // texto, textarea, select, radio, etc
              query +=
                'valor_texto) VALUES (@conteudoId, @codigoCampo, @valor)';
              requestCampo.input('valor', sql.NVarChar, campo.valor);
          }

          await requestCampo.query(query);
        }
      }

      await transaction.commit();
      return { success: true };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async publicar(tenantId: number, id: number, aprovadorId?: number) {
    const pool = await this.databaseService.getTenantConnection(tenantId);

    await pool
      .request()
      .input('id', sql.Int, id)
      .input('aprovadorId', sql.Int, aprovadorId).query(`
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

    await pool.request().input('id', sql.Int, id).query(`
        UPDATE conteudos
        SET status = 'arquivado',
            atualizado_em = GETDATE()
        WHERE id = @id
      `);

    return { success: true };
  }

  async toggleDestaque(tenantId: number, id: number) {
    const pool = await this.databaseService.getTenantConnection(tenantId);

    // Get current destaque status
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query(`SELECT destaque FROM conteudos WHERE id = @id`);

    if (!result.recordset[0]) {
      throw new NotFoundException('Conteúdo não encontrado');
    }

    const novoDestaque = !result.recordset[0].destaque;

    // Update destaque status
    await pool
      .request()
      .input('id', sql.Int, id)
      .input('destaque', sql.Bit, novoDestaque ? 1 : 0)
      .query(`
        UPDATE conteudos
        SET destaque = @destaque,
            atualizado_em = GETDATE()
        WHERE id = @id
      `);

    return { success: true, destaque: novoDestaque };
  }

  async duplicar(tenantId: number, id: number, autorId: number) {
    const pool = await this.databaseService.getTenantConnection(tenantId);
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      // Get original content
      const originalResult = await new sql.Request(transaction)
        .input('id', sql.Int, id)
        .query(`SELECT * FROM conteudos WHERE id = @id`);

      if (!originalResult.recordset[0]) {
        throw new NotFoundException('Conteúdo não encontrado');
      }

      const original = originalResult.recordset[0];

      // Generate new slug with incremental counter (slug-2, slug-3, etc.)
      let novoSlug = `${original.slug}-2`;
      let contador = 2;
      let slugExiste = true;

      while (slugExiste) {
        const checkResult = await new sql.Request(transaction)
          .input('slug', sql.NVarChar, novoSlug)
          .query(`SELECT COUNT(*) as count FROM conteudos WHERE slug = @slug`);

        if (checkResult.recordset[0].count === 0) {
          slugExiste = false;
        } else {
          contador++;
          novoSlug = `${original.slug}-${contador}`;
        }
      }

      // Create copy with new slug and "(Cópia)" suffix
      const novoTitulo = `${original.titulo} (Cópia)`;

      const conteudoResult = await new sql.Request(transaction)
        .input('tipoConteudoId', sql.Int, original.tipo_conteudo_id)
        .input('categoriaId', sql.Int, original.categoria_id)
        .input('titulo', sql.NVarChar, novoTitulo)
        .input('slug', sql.NVarChar, novoSlug)
        .input('subtitulo', sql.NVarChar, original.subtitulo)
        .input('resumo', sql.NVarChar, original.resumo)
        .input('conteudo', sql.NVarChar, original.conteudo)
        .input('imagemDestaque', sql.NVarChar, original.imagem_destaque)
        .input('autorId', sql.Int, autorId)
        .input('status', sql.NVarChar, 'rascunho')
        .input('destaque', sql.Bit, 0)
        .input(
          'permiteComentarios',
          sql.Bit,
          original.permite_comentarios ? 1 : 0,
        )
        .input('dataInicio', sql.DateTime, original.data_inicio)
        .input('dataFim', sql.DateTime, original.data_fim)
        .input('metaTitle', sql.NVarChar, original.meta_title)
        .input('metaDescription', sql.NVarChar, original.meta_description)
        .input('metaKeywords', sql.NVarChar, original.meta_keywords).query(`
          INSERT INTO conteudos
            (tipo_conteudo_id, categoria_id, titulo, slug, subtitulo, resumo, conteudo,
             imagem_destaque, autor_id, status, destaque, permite_comentarios,
             data_inicio, data_fim, meta_title, meta_description, meta_keywords)
          OUTPUT INSERTED.id
          VALUES
            (@tipoConteudoId, @categoriaId, @titulo, @slug, @subtitulo, @resumo, @conteudo,
             @imagemDestaque, @autorId, @status, @destaque, @permiteComentarios,
             @dataInicio, @dataFim, @metaTitle, @metaDescription, @metaKeywords)
        `);

      const novoConteudoId = conteudoResult.recordset[0].id;

      // Copy tags
      await new sql.Request(transaction)
        .input('novoConteudoId', sql.Int, novoConteudoId)
        .input('originalId', sql.Int, id).query(`
          INSERT INTO conteudo_tag (conteudo_id, tag_id)
          SELECT @novoConteudoId, tag_id
          FROM conteudo_tag
          WHERE conteudo_id = @originalId
        `);

      // Copy custom fields
      await new sql.Request(transaction)
        .input('novoConteudoId', sql.Int, novoConteudoId)
        .input('originalId', sql.Int, id).query(`
          INSERT INTO conteudos_valores_personalizados
            (conteudo_id, codigo_campo, valor_texto, valor_numero, valor_data,
             valor_datetime, valor_boolean, valor_json)
          SELECT @novoConteudoId, codigo_campo, valor_texto, valor_numero, valor_data,
                 valor_datetime, valor_boolean, valor_json
          FROM conteudos_valores_personalizados
          WHERE conteudo_id = @originalId
        `);

      // Copy attachments (reuse same anexos without duplicating files)
      await new sql.Request(transaction)
        .input('novoConteudoId', sql.Int, novoConteudoId)
        .input('originalId', sql.Int, id).query(`
          INSERT INTO conteudo_anexo (conteudo_id, anexo_id, tipo_anexo, legenda, ordem, principal)
          SELECT @novoConteudoId, anexo_id, tipo_anexo, legenda, ordem, principal
          FROM conteudo_anexo
          WHERE conteudo_id = @originalId
        `);

      await transaction.commit();

      return {
        id: novoConteudoId,
        slug: novoSlug,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
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
      .input('userAgent', sql.NVarChar, userAgent).query(`
        INSERT INTO conteudos_visualizacoes
          (conteudo_id, utilizador_id, ip_address, user_agent)
        VALUES
          (@conteudoId, @utilizadorId, @ipAddress, @userAgent)
      `);

    // Incrementar contador
    await pool.request().input('conteudoId', sql.Int, conteudoId).query(`
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
        .input('utilizadorId', sql.Int, utilizadorId).query(`
          INSERT INTO conteudos_favoritos (conteudo_id, utilizador_id)
          VALUES (@conteudoId, @utilizadorId)
        `);

      return { success: true, favorito: true };
    } catch (error) {
      // Se já existe, remover (toggle)
      await pool
        .request()
        .input('conteudoId', sql.Int, conteudoId)
        .input('utilizadorId', sql.Int, utilizadorId).query(`
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
      result = await pool.request().input('conteudoId', sql.Int, conteudoId)
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
      result = await pool.request().input('conteudoId', sql.Int, conteudoId)
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

  async obterEstatisticasDashboard(tenantId: number) {
    const pool = await this.databaseService.getTenantConnection(tenantId);

    // Estatísticas gerais
    const estatisticasGerais = await pool.request().query(`
      SELECT
        COUNT(*) AS total_conteudos,
        COUNT(CASE WHEN status = 'publicado' THEN 1 END) AS conteudos_publicados,
        COUNT(CASE WHEN status = 'rascunho' THEN 1 END) AS conteudos_rascunho,
        COUNT(CASE WHEN status = 'em_revisao' THEN 1 END) AS conteudos_em_revisao,
        COUNT(CASE WHEN status = 'agendado' THEN 1 END) AS conteudos_agendados,
        COUNT(CASE WHEN status = 'arquivado' THEN 1 END) AS conteudos_arquivados,
        COUNT(CASE WHEN destaque = 1 THEN 1 END) AS conteudos_destaque,
        ISNULL(SUM(visualizacoes), 0) AS total_visualizacoes,
        (SELECT COUNT(*) FROM comentarios WHERE aprovado = 1) AS total_comentarios,
        (SELECT COUNT(*) FROM conteudos_favoritos) AS total_favoritos,
        COUNT(CASE WHEN criado_em >= DATEADD(day, -7, GETDATE()) THEN 1 END) AS novos_ultimos_7_dias,
        COUNT(CASE WHEN criado_em >= DATEADD(day, -30, GETDATE()) THEN 1 END) AS novos_ultimos_30_dias
      FROM conteudos
    `);

    // Estatísticas por tipo de conteúdo
    const estatisticasPorTipo = await pool.request().query(`
      SELECT
        tc.id,
        tc.nome,
        tc.codigo,
        tc.icone,
        tc.cor,
        COUNT(c.id) AS total_conteudos,
        COUNT(CASE WHEN c.status = 'publicado' THEN 1 END) AS publicados,
        ISNULL(SUM(c.visualizacoes), 0) AS total_visualizacoes
      FROM tipos_conteudo tc
      LEFT JOIN conteudos c ON c.tipo_conteudo_id = tc.id
      WHERE tc.ativo = 1
      GROUP BY tc.id, tc.nome, tc.codigo, tc.icone, tc.cor
      ORDER BY total_conteudos DESC
    `);

    // Estatísticas por categoria
    const estatisticasPorCategoria = await pool.request().query(`
      SELECT TOP 10
        cat.id,
        cat.nome,
        cat.icone,
        cat.cor,
        COUNT(c.id) AS total_conteudos,
        ISNULL(SUM(c.visualizacoes), 0) AS total_visualizacoes
      FROM categorias_conteudo cat
      LEFT JOIN conteudos c ON c.categoria_id = cat.id
      WHERE cat.ativo = 1
      GROUP BY cat.id, cat.nome, cat.icone, cat.cor
      ORDER BY total_conteudos DESC
    `);

    // Conteúdos mais visualizados (últimos 30 dias)
    const maisVisualizados = await pool.request().query(`
      SELECT TOP 10
        c.id,
        c.titulo,
        c.slug,
        c.imagem_destaque,
        c.status,
        c.visualizacoes,
        (SELECT COUNT(*) FROM comentarios com WHERE com.conteudo_id = c.id AND com.aprovado = 1) AS total_comentarios,
        (SELECT COUNT(*) FROM conteudos_favoritos fav WHERE fav.conteudo_id = c.id) AS total_favoritos,
        tc.nome AS tipo_conteudo_nome,
        tc.icone AS tipo_conteudo_icone,
        cat.nome AS categoria_nome,
        cat.cor AS categoria_cor,
        u.username AS autor_nome
      FROM conteudos c
      LEFT JOIN tipos_conteudo tc ON c.tipo_conteudo_id = tc.id
      LEFT JOIN categorias_conteudo cat ON c.categoria_id = cat.id
      LEFT JOIN utilizadores u ON c.autor_id = u.id
      WHERE c.status = 'publicado'
        AND c.criado_em >= DATEADD(day, -30, GETDATE())
      ORDER BY c.visualizacoes DESC
    `);

    // Atividade recente (últimos conteúdos criados/atualizados)
    const atividadeRecente = await pool.request().query(`
      SELECT TOP 10
        c.id,
        c.titulo,
        c.status,
        c.criado_em,
        c.atualizado_em,
        c.publicado_em,
        tc.nome AS tipo_conteudo_nome,
        tc.icone AS tipo_conteudo_icone,
        u.username AS autor_nome
      FROM conteudos c
      LEFT JOIN tipos_conteudo tc ON c.tipo_conteudo_id = tc.id
      LEFT JOIN utilizadores u ON c.autor_id = u.id
      ORDER BY c.atualizado_em DESC
    `);

    // Estatísticas de visualizações por dia (últimos 30 dias)
    const visualizacoesPorDia = await pool.request().query(`
      SELECT
        CAST(criado_em AS DATE) AS data,
        COUNT(*) AS total_conteudos,
        ISNULL(SUM(visualizacoes), 0) AS total_visualizacoes
      FROM conteudos
      WHERE criado_em >= DATEADD(day, -30, GETDATE())
      GROUP BY CAST(criado_em AS DATE)
      ORDER BY data ASC
    `);

    // Top autores
    const topAutores = await pool.request().query(`
      SELECT TOP 10
        u.id,
        u.username,
        u.email,
        u.foto_url,
        COUNT(c.id) AS total_conteudos,
        COUNT(CASE WHEN c.status = 'publicado' THEN 1 END) AS conteudos_publicados,
        ISNULL(SUM(c.visualizacoes), 0) AS total_visualizacoes,
        (SELECT COUNT(*) FROM conteudos_favoritos fav
         INNER JOIN conteudos c2 ON fav.conteudo_id = c2.id
         WHERE c2.autor_id = u.id) AS total_favoritos
      FROM utilizadores u
      INNER JOIN conteudos c ON c.autor_id = u.id
      GROUP BY u.id, u.username, u.email, u.foto_url
      ORDER BY total_conteudos DESC
    `);

    return {
      estatisticasGerais: estatisticasGerais.recordset[0],
      estatisticasPorTipo: estatisticasPorTipo.recordset,
      estatisticasPorCategoria: estatisticasPorCategoria.recordset,
      maisVisualizados: maisVisualizados.recordset,
      atividadeRecente: atividadeRecente.recordset,
      visualizacoesPorDia: visualizacoesPorDia.recordset,
      topAutores: topAutores.recordset,
    };
  }
}
