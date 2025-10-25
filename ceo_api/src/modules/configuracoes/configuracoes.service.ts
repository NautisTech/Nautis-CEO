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
        await pool.request()
            .input('codigo', sql.NVarChar, dto.codigo)
            .input('valor', sql.NVarChar, dto.valor)
            .query(`
                    UPDATE configuracoes
                    SET valor = @valor
                    WHERE codigo = @codigo
                `);
        return { message: 'Configuração atualizada com sucesso' };
    }

    async listarConfiguracoes(tenantId: number) {
        const result = await this.executeQuery(
            tenantId,
            `
      SELECT 
        g.*,
        (SELECT COUNT(*) FROM grupo_utilizador WHERE grupo_id = g.id) AS total_utilizadores,
        (SELECT COUNT(*) FROM grupo_permissao WHERE grupo_id = g.id) AS total_permissoes
      FROM grupos g
      WHERE g.ativo = 1
      ORDER BY g.nome
    `,
        );

        return result;
    }
}
