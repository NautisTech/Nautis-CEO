import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CriarMarcaDto } from './dto/criar-marca.dto';
import * as sql from 'mssql';

@Injectable()
export class MarcasService {
    constructor(private readonly databaseService: DatabaseService) { }

    async criar(tenantId: number, dto: CriarMarcaDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .input('nome', sql.NVarChar, dto.nome)
            .input('logoUrl', sql.NVarChar, dto.logo_url || null)
            .input('website', sql.NVarChar, dto.website || null)
            .input('codigoLeitura', sql.NVarChar, dto.codigo_leitura || null)
            .input('tipoLeitura', sql.NVarChar, dto.tipo_leitura || null)
            .input('emailSuporte', sql.NVarChar, dto.email_suporte || null)
            .input('telefoneSuporte', sql.NVarChar, dto.telefone_suporte || null)
            .input('linkSuporte', sql.NVarChar, dto.link_suporte || null)
            .input('ativo', sql.Bit, dto.ativo !== false ? 1 : 0)
            .query(`
                INSERT INTO marcas (nome, logo_url, website, codigo_leitura, tipo_leitura, email_suporte, telefone_suporte, link_suporte, ativo, criado_em)
                OUTPUT INSERTED.id
                VALUES (@nome, @logoUrl, @website, @codigoLeitura, @tipoLeitura, @emailSuporte, @telefoneSuporte, @linkSuporte, @ativo, GETDATE())
            `);
        return { id: result.recordset[0].id };
    }

    async listar(tenantId: number, filtros: { ativo?: boolean; page?: number; pageSize?: number }) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const request = pool.request();

        let whereClause = '';
        if (filtros.ativo !== undefined) {
            whereClause = 'WHERE m.ativo = @ativo';
            request.input('ativo', sql.Bit, filtros.ativo ? 1 : 0);
        }

        // Se não houver paginação, retornar todos
        if (!filtros.page || !filtros.pageSize) {
            const result = await request.query(`
                SELECT
                    m.id,
                    m.nome,
                    m.logo_url,
                    m.website,
                    m.codigo_leitura,
                    m.tipo_leitura,
                    m.email_suporte,
                    m.telefone_suporte,
                    m.link_suporte,
                    m.ativo,
                    m.criado_em,
                    m.atualizado_em,
                    (SELECT COUNT(*) FROM modelos_equipamento WHERE marca_id = m.id) as total_modelos
                FROM marcas m
                ${whereClause}
                ORDER BY m.nome
            `);
            return result.recordset;
        }

        // Com paginação
        const page = filtros.page || 1;
        const pageSize = filtros.pageSize || 10;
        const offset = (page - 1) * pageSize;

        request.input('offset', sql.Int, offset);
        request.input('pageSize', sql.Int, pageSize);

        // Contar total
        const countResult = await request.query(`
            SELECT COUNT(*) as total
            FROM marcas m
            ${whereClause}
        `);

        const total = countResult.recordset[0].total;

        // Buscar dados paginados
        const dataResult = await request.query(`
            SELECT
                m.id,
                m.nome,
                m.logo_url,
                m.website,
                m.codigo_leitura,
                m.tipo_leitura,
                m.email_suporte,
                m.telefone_suporte,
                m.link_suporte,
                m.ativo,
                m.criado_em,
                m.atualizado_em,
                (SELECT COUNT(*) FROM modelos_equipamento WHERE marca_id = m.id) as total_modelos
            FROM marcas m
            ${whereClause}
            ORDER BY m.nome
            OFFSET @offset ROWS
            FETCH NEXT @pageSize ROWS ONLY
        `);

        return {
            data: dataResult.recordset,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        };
    }

    async obterPorId(tenantId: number, id: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT m.*,
                    (SELECT COUNT(*) FROM modelos_equipamento WHERE marca_id = m.id) as total_modelos
                FROM marcas m
                WHERE m.id = @id
            `);
        return result.recordset[0];
    }

    async atualizar(tenantId: number, id: number, dto: CriarMarcaDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        await pool.request()
            .input('id', sql.Int, id)
            .input('nome', sql.NVarChar, dto.nome)
            .input('logoUrl', sql.NVarChar, dto.logo_url || null)
            .input('website', sql.NVarChar, dto.website || null)
            .input('codigoLeitura', sql.NVarChar, dto.codigo_leitura || null)
            .input('tipoLeitura', sql.NVarChar, dto.tipo_leitura || null)
            .input('emailSuporte', sql.NVarChar, dto.email_suporte || null)
            .input('telefoneSuporte', sql.NVarChar, dto.telefone_suporte || null)
            .input('linkSuporte', sql.NVarChar, dto.link_suporte || null)
            .input('ativo', sql.Bit, dto.ativo !== false ? 1 : 0)
            .query(`
                UPDATE marcas
                SET nome = @nome,
                    logo_url = @logoUrl,
                    website = @website,
                    codigo_leitura = @codigoLeitura,
                    tipo_leitura = @tipoLeitura,
                    email_suporte = @emailSuporte,
                    telefone_suporte = @telefoneSuporte,
                    link_suporte = @linkSuporte,
                    ativo = @ativo,
                    atualizado_em = GETDATE()
                WHERE id = @id
            `);
        return { message: 'Marca atualizada com sucesso' };
    }

    async deletar(tenantId: number, id: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM marcas WHERE id = @id');
        return { message: 'Marca deletada com sucesso' };
    }
}
