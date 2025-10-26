import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import * as sql from 'mssql';
import { AtualizarConfiguracaoDto } from './dto/atualizar-configuracao.dto';
import { BaseService } from '../../shared/base/base.service';

@Injectable()
export class ConfiguracoesService extends BaseService {
    constructor(databaseService: DatabaseService) {
        super(databaseService);
    }

    async obterConfiguracao(tenantId: number, codigo: string) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .input('codigo', sql.NVarChar, codigo)
            .query(`
                    SELECT c.*
                    FROM configuracoes c
                    WHERE c.codigo = @codigo
                `);
        return result.recordset[0];
    }

    async atualizarConfiguracao(tenantId: number, dto: AtualizarConfiguracaoDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // If valor is null, delete the configuration
        if (dto.valor === null || dto.valor === undefined) {
            await pool.request()
                .input('codigo', sql.NVarChar, dto.codigo)
                .query(`
                    DELETE FROM configuracoes
                    WHERE codigo = @codigo
                `);
            return { message: 'Configuração removida com sucesso' };
        }

        // Check if configuration exists
        const exists = await pool.request()
            .input('codigo', sql.NVarChar, dto.codigo)
            .query(`SELECT id FROM configuracoes WHERE codigo = @codigo`);

        if (exists.recordset.length > 0) {
            // Update existing
            await pool.request()
                .input('codigo', sql.NVarChar, dto.codigo)
                .input('valor', sql.NVarChar, dto.valor)
                .query(`
                    UPDATE configuracoes
                    SET valor = @valor
                    WHERE codigo = @codigo
                `);
        } else {
            // Create new
            await pool.request()
                .input('codigo', sql.NVarChar, dto.codigo)
                .input('descricao', sql.NVarChar, dto.codigo)
                .input('valor', sql.NVarChar, dto.valor)
                .query(`
                    INSERT INTO configuracoes (codigo, descricao, valor)
                    VALUES (@codigo, @descricao, @valor)
                `);
        }

        return { message: 'Configuração atualizada com sucesso' };
    }

    async listarConfiguracoes(tenantId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .query(`
                SELECT
                    id,
                    codigo,
                    descricao,
                    valor,
                    atualizado_em
                FROM configuracoes
                ORDER BY codigo
            `);

        return result.recordset;
    }
}
