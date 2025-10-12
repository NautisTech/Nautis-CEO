import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import * as sql from 'mssql';
import { CriarTenantDto } from './dto/criar-tenant.dto';
import { AtualizarTenantDto } from './dto/atualizar-tenant.dto';

@Injectable()
export class TenantsService {
    constructor(private databaseService: DatabaseService) { }

    async criar(dto: CriarTenantDto) {
        const mainPool = this.databaseService.getMainConnection();

        const result = await mainPool
            .request()
            .input('nome', sql.NVarChar, dto.nome)
            .input('slug', sql.NVarChar, dto.slug)
            .input('dominio', sql.NVarChar, dto.dominio)
            .input('database_name', sql.NVarChar, dto.databaseName)
            .query(`
        INSERT INTO tenants (nome, slug, dominio, database_name, ativo, criado_em)
        OUTPUT INSERTED.id
        VALUES (@nome, @slug, @dominio, @database_name, 1, GETDATE())
      `);

        return { id: result.recordset[0].id };
    }

    async listar() {
        const mainPool = this.databaseService.getMainConnection();

        const result = await mainPool.request().query(`
      SELECT id, nome, slug, dominio, database_name, ativo, criado_em, atualizado_em
      FROM tenants
      ORDER BY nome
    `);

        return result.recordset;
    }

    async obterPorId(id: number) {
        const mainPool = this.databaseService.getMainConnection();

        const result = await mainPool
            .request()
            .input('id', sql.Int, id)
            .query(`
        SELECT id, nome, slug, dominio, database_name, ativo, criado_em, atualizado_em
        FROM tenants
        WHERE id = @id
      `);

        if (!result.recordset[0]) {
            throw new NotFoundException('Tenant não encontrado');
        }

        return result.recordset[0];
    }

    async atualizar(id: number, dto: AtualizarTenantDto) {
        const mainPool = this.databaseService.getMainConnection();

        await mainPool
            .request()
            .input('id', sql.Int, id)
            .input('nome', sql.NVarChar, dto.nome)
            .input('dominio', sql.NVarChar, dto.dominio)
            .input('ativo', sql.Bit, dto.ativo)
            .query(`
        UPDATE tenants
        SET nome = COALESCE(@nome, nome),
            dominio = COALESCE(@dominio, dominio),
            ativo = COALESCE(@ativo, ativo),
            atualizado_em = GETDATE()
        WHERE id = @id
      `);

        return { success: true };
    }
}