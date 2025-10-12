import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../shared/base/base.service';
import { DatabaseService } from '../../database/database.service';
import { CriarEmpresaDto } from './dto/criar-empresa.dto';
import { AtualizarEmpresaDto } from './dto/atualizar-empresa.dto';
import * as sql from 'mssql';

@Injectable()
export class EmpresasService extends BaseService {
    constructor(databaseService: DatabaseService) {
        super(databaseService);
    }

    async criar(tenantId: number, dto: CriarEmpresaDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool
            .request()
            .input('codigo', sql.NVarChar, dto.codigo)
            .input('nome', sql.NVarChar, dto.nome)
            .input('nif', sql.NVarChar, dto.nif)
            .input('logoUrl', sql.NVarChar, dto.logoUrl)
            .input('cor', sql.NVarChar, dto.cor)
            .query(`
        INSERT INTO empresas (codigo, nome, nif, logo_url, cor, ativo, criado_em)
        OUTPUT INSERTED.id
        VALUES (@codigo, @nome, @nif, @logoUrl, @cor, 1, GETDATE())
      `);

        return { id: result.recordset[0].id };
    }

    async listar(tenantId: number) {
        const result = await this.executeQuery(
            tenantId,
            `
      SELECT 
        e.*,
        (SELECT COUNT(*) FROM funcionarios WHERE empresa_id = e.id AND ativo = 1) AS total_funcionarios,
        (SELECT COUNT(*) FROM veiculos WHERE empresa_id = e.id AND em_circulacao = 1) AS total_veiculos,
        (SELECT COUNT(DISTINCT utilizador_id) FROM utilizador_empresa WHERE empresa_id = e.id) AS total_utilizadores
      FROM empresas e
      WHERE e.ativo = 1
      ORDER BY e.nome
    `,
        );

        return result;
    }

    async obterPorId(tenantId: number, id: number) {
        const result = await this.executeQuery(
            tenantId,
            `
      SELECT 
        e.*,
        (SELECT COUNT(*) FROM funcionarios WHERE empresa_id = e.id AND ativo = 1) AS total_funcionarios,
        (SELECT COUNT(*) FROM veiculos WHERE empresa_id = e.id AND em_circulacao = 1) AS total_veiculos
      FROM empresas e
      WHERE e.id = @id
    `,
            { id },
        );

        if (!result[0]) {
            throw new NotFoundException('Empresa não encontrada');
        }

        return result[0];
    }

    async atualizar(tenantId: number, id: number, dto: AtualizarEmpresaDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const updates: string[] = [];
        const request = pool.request().input('id', sql.Int, id);

        if (dto.nome) {
            updates.push('nome = @nome');
            request.input('nome', sql.NVarChar, dto.nome);
        }
        if (dto.nif !== undefined) {
            updates.push('nif = @nif');
            request.input('nif', sql.NVarChar, dto.nif);
        }
        if (dto.logoUrl !== undefined) {
            updates.push('logo_url = @logoUrl');
            request.input('logoUrl', sql.NVarChar, dto.logoUrl);
        }
        if (dto.cor !== undefined) {
            updates.push('cor = @cor');
            request.input('cor', sql.NVarChar, dto.cor);
        }

        updates.push('atualizado_em = GETDATE()');

        if (updates.length > 0) {
            await request.query(`
        UPDATE empresas
        SET ${updates.join(', ')}
        WHERE id = @id
      `);
        }

        return { success: true };
    }

    async obterEmpresasDoUtilizador(tenantId: number, utilizadorId: number) {
        const result = await this.executeProcedure(
            tenantId,
            'sp_ObterEmpresasUtilizador',
            { UtilizadorId: utilizadorId },
        );

        return result;
    }

    async associarUtilizadorEmpresa(
        tenantId: number,
        utilizadorId: number,
        empresaId: number,
        empresaPrincipal: boolean = false,
    ) {
        await this.executeProcedure(tenantId, 'sp_AssociarUtilizadorEmpresa', {
            UtilizadorId: utilizadorId,
            EmpresaId: empresaId,
            EmpresaPrincipal: empresaPrincipal ? 1 : 0,
        });

        return { success: true };
    }
}