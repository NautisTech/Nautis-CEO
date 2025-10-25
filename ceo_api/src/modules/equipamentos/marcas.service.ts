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
            .input('ativo', sql.Bit, dto.ativo !== false ? 1 : 0)
            .query(`
                INSERT INTO marcas (nome, logo_url, website, ativo, criado_em)
                OUTPUT INSERTED.id
                VALUES (@nome, @logoUrl, @website, @ativo, GETDATE())
            `);
        return { id: result.recordset[0].id };
    }

    async listar(tenantId: number, filtros: { ativo?: boolean }) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const request = pool.request();

        let whereClause = '';
        if (filtros.ativo !== undefined) {
            whereClause = 'WHERE ativo = @ativo';
            request.input('ativo', sql.Bit, filtros.ativo ? 1 : 0);
        }

        const result = await request.query(`
            SELECT id, nome, logo_url, website, ativo, criado_em, atualizado_em
            FROM marcas
            ${whereClause}
            ORDER BY nome
        `);
        return result.recordset;
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
            .input('ativo', sql.Bit, dto.ativo !== false ? 1 : 0)
            .query(`
                UPDATE marcas
                SET nome = @nome,
                    logo_url = @logoUrl,
                    website = @website,
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
