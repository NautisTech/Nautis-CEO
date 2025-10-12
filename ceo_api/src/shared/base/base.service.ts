import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import * as sql from 'mssql';

@Injectable()
export abstract class BaseService {
    constructor(protected databaseService: DatabaseService) { }

    // Executar query no tenant
    protected async executeQuery<T = any>(
        tenantId: number,
        query: string,
        params?: Record<string, any>,
    ): Promise<T[]> {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const request = pool.request();

        // Adicionar parâmetros
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                request.input(key, value);
            });
        }

        const result = await request.query(query);
        return result.recordset as T[];
    }

    // Executar stored procedure no tenant
    protected async executeProcedure<T = any>(
        tenantId: number,
        procedureName: string,
        params?: Record<string, any>,
    ): Promise<T[]> {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const request = pool.request();

        // Adicionar parâmetros
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                request.input(key, value);
            });
        }

        const result = await request.execute(procedureName);
        return result.recordset as T[];
    }

    // Query com paginação
    protected async executePaginatedQuery<T = any>(
        tenantId: number,
        query: string,
        params: Record<string, any>,
        page: number = 1,
        pageSize: number = 50,
    ): Promise<{ data: T[]; total: number; page: number; pageSize: number }> {
        const offset = (page - 1) * pageSize;

        // Query com paginação
        const paginatedQuery = `
      ${query}
      ORDER BY id DESC
      OFFSET @offset ROWS
      FETCH NEXT @pageSize ROWS ONLY
    `;

        // Query para contar total
        const countQuery = `
      SELECT COUNT(*) as total
      FROM (${query}) as countTable
    `;

        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Executar count
        const countRequest = pool.request();
        Object.entries(params).forEach(([key, value]) => {
            countRequest.input(key, value);
        });
        const countResult = await countRequest.query(countQuery);
        const total = countResult.recordset[0].total;

        // Executar query paginada
        const dataRequest = pool.request();
        Object.entries({ ...params, offset, pageSize }).forEach(([key, value]) => {
            dataRequest.input(key, value);
        });
        const dataResult = await dataRequest.query(paginatedQuery);

        return {
            data: dataResult.recordset as T[],
            total,
            page,
            pageSize,
        };
    }
}