import {
    Injectable,
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { BaseService } from '../../shared/base/base.service';
import { DatabaseService } from '../../database/database.service';
import { CriarUtilizadorDto } from './dto/criar-utilizador.dto';
import { AtualizarUtilizadorDto } from './dto/atualizar-utilizador.dto';
import { AtualizarSenhaDto } from './dto/atualizar-senha.dto';
import * as sql from 'mssql';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilizadoresService extends BaseService {
    constructor(databaseService: DatabaseService) {
        super(databaseService);
    }

    async criar(tenantId: number, dto: CriarUtilizadorDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Verificar se email já existe
        const emailExistente = await pool
            .request()
            .input('email', sql.NVarChar, dto.email)
            .query(`SELECT id FROM utilizadores WHERE email = @email`);

        if (emailExistente.recordset.length > 0) {
            throw new BadRequestException('Email já está em uso');
        }

        // Verificar se username já existe
        const usernameExistente = await pool
            .request()
            .input('username', sql.NVarChar, dto.username)
            .query(`SELECT id FROM utilizadores WHERE username = @username`);

        if (usernameExistente.recordset.length > 0) {
            throw new BadRequestException('Username já está em uso');
        }

        // Hash da senha
        const senha_hash = await bcrypt.hash(dto.senha, 10);

        // Criar utilizador
        const result = await pool
            .request()
            .input('username', sql.NVarChar, dto.username)
            .input('email', sql.NVarChar, dto.email)
            .input('senha_hash', sql.NVarChar, senha_hash)
            .input('telefone', sql.NVarChar, dto.telefone || null)
            .input('foto_url', sql.NVarChar, dto.foto_url || null)
            .input('ativo', sql.Bit, dto.ativo !== false ? 1 : 0)
            .input('email_verificado', sql.Bit, dto.email_verificado ? 1 : 0)
            .query(`
        INSERT INTO utilizadores (
          username, email, senha_hash, telefone, foto_url,
          ativo, email_verificado, criado_em
        )
        OUTPUT INSERTED.id
        VALUES (
          @username, @email, @senha_hash, @telefone, @foto_url,
          @ativo, @email_verificado, GETDATE()
        )
      `);

        const utilizadorId = result.recordset[0].id;

        // Associar grupos se fornecidos
        if (dto.gruposIds && dto.gruposIds.length > 0) {
            await this.associarGrupos(tenantId, utilizadorId, dto.gruposIds);
        }

        // Associar permissões diretas se fornecidas
        if (dto.permissoesIds && dto.permissoesIds.length > 0) {
            await this.associarPermissoes(tenantId, utilizadorId, dto.permissoesIds);
        }

        // Associar empresas se fornecidas
        if (dto.empresasIds && dto.empresasIds.length > 0) {
            await this.associarEmpresas(
                tenantId,
                utilizadorId,
                dto.empresasIds,
                dto.empresasIds[0], // Primeira empresa como principal por padrão
            );
        }

        return { id: utilizadorId };
    }

    async listar(
        tenantId: number,
        page: number = 1,
        pageSize: number = 50,
        filtros?: {
            search?: string;
            ativo?: boolean;
            grupoId?: number;
            empresaId?: number;
        },
    ) {
        let whereClause = 'WHERE 1=1';
        const params: Record<string, any> = {};

        if (filtros?.search) {
            whereClause += ` AND (u.username LIKE '%' + @search + '%' OR u.email LIKE '%' + @search + '%')`;
            params.search = filtros.search;
        }

        if (filtros?.ativo !== undefined) {
            whereClause += ` AND u.ativo = @ativo`;
            params.ativo = filtros.ativo ? 1 : 0;
        }

        if (filtros?.grupoId) {
            whereClause += ` AND EXISTS (
        SELECT 1 FROM grupo_utilizador
        WHERE utilizador_id = u.id AND grupo_id = @grupoId
      )`;
            params.grupoId = filtros.grupoId;
        }

        if (filtros?.empresaId) {
            whereClause += ` AND EXISTS (
        SELECT 1 FROM utilizador_empresa
        WHERE utilizador_id = u.id AND empresa_id = @empresaId
      )`;
            params.empresaId = filtros.empresaId;
        }

        const query = `
      SELECT
        u.id,
        u.username,
        u.email,
        u.telefone,
        u.foto_url,
        u.funcionario_id,
        u.ativo,
        u.email_verificado,
        u.ultimo_acesso,
        u.criado_em,
        (SELECT COUNT(*) FROM grupo_utilizador WHERE utilizador_id = u.id) AS total_grupos,
        (SELECT COUNT(*) FROM utilizador_permissao WHERE utilizador_id = u.id) AS total_permissoes_diretas,
        (SELECT COUNT(*) FROM utilizador_empresa WHERE utilizador_id = u.id) AS total_empresas
      FROM utilizadores u
      ${whereClause}
    `;

        return this.executePaginatedQuery(tenantId, query, params, page, pageSize);
    }

    async obterPorId(tenantId: number, id: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Utilizador
        const utilizadorResult = await pool
            .request()
            .input('id', sql.Int, id)
            .query(`
        SELECT
          u.id,
          u.username,
          u.email,
          u.telefone,
          u.foto_url,
          u.tipo_utilizador,
          u.cliente_id,
          u.funcionario_id,
          u.ativo,
          u.email_verificado,
          u.ultimo_acesso,
          u.criado_em,
          u.atualizado_em
        FROM utilizadores u
        WHERE u.id = @id
      `);

        if (!utilizadorResult.recordset[0]) {
            throw new NotFoundException('Utilizador não encontrado');
        }

        // Grupos do utilizador
        const gruposResult = await pool
            .request()
            .input('id', sql.Int, id)
            .query(`
        SELECT g.id, g.nome, g.descricao, g.ativo
        FROM grupos g
        INNER JOIN grupo_utilizador gu ON g.id = gu.grupo_id
        WHERE gu.utilizador_id = @id
        ORDER BY g.nome
      `);

        // Permissões diretas do utilizador
        const permissoesResult = await pool
            .request()
            .input('id', sql.Int, id)
            .query(`
        SELECT p.id, p.codigo, p.nome, p.descricao, p.modulo, p.tipo
        FROM permissoes p
        INNER JOIN utilizador_permissao up ON p.id = up.permissao_id
        WHERE up.utilizador_id = @id
        ORDER BY p.modulo, p.nome
      `);

        // Permissões efetivas (grupos + diretas)
        const permissoesEfetivasResult = await pool
            .request()
            .input('id', sql.Int, id)
            .query(`
        SELECT DISTINCT p.id, p.codigo, p.nome, p.descricao, p.modulo, p.tipo
        FROM permissoes p
        WHERE p.id IN (
          -- Permissões diretas
          SELECT permissao_id FROM utilizador_permissao WHERE utilizador_id = @id
          UNION
          -- Permissões dos grupos
          SELECT gp.permissao_id
          FROM grupo_permissao gp
          INNER JOIN grupo_utilizador gu ON gp.grupo_id = gu.grupo_id
          WHERE gu.utilizador_id = @id
        )
        ORDER BY p.modulo, p.nome
      `);

        // Empresas do utilizador
        const empresasResult = await pool
            .request()
            .input('id', sql.Int, id)
            .query(`
        SELECT
          e.id,
          e.nome,
          e.codigo,
          e.logo_url,
          ue.empresa_principal
        FROM empresas e
        INNER JOIN utilizador_empresa ue ON e.id = ue.empresa_id
        WHERE ue.utilizador_id = @id
        ORDER BY ue.empresa_principal DESC, e.nome
      `);

        return {
            ...utilizadorResult.recordset[0],
            grupos: gruposResult.recordset,
            permissoesDiretas: permissoesResult.recordset,
            permissoesEfetivas: permissoesEfetivasResult.recordset,
            empresas: empresasResult.recordset,
        };
    }

    async atualizar(tenantId: number, id: number, dto: AtualizarUtilizadorDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Verificar se utilizador existe
        const utilizadorExiste = await pool
            .request()
            .input('id', sql.Int, id)
            .query(`SELECT id FROM utilizadores WHERE id = @id`);

        if (!utilizadorExiste.recordset[0]) {
            throw new NotFoundException('Utilizador não encontrado');
        }

        // Verificar email duplicado (se estiver sendo alterado)
        if (dto.email) {
            const emailExistente = await pool
                .request()
                .input('email', sql.NVarChar, dto.email)
                .input('id', sql.Int, id)
                .query(
                    `SELECT id FROM utilizadores WHERE email = @email AND id != @id`,
                );

            if (emailExistente.recordset.length > 0) {
                throw new BadRequestException('Email já está em uso');
            }
        }

        // Verificar username duplicado (se estiver sendo alterado)
        if (dto.username) {
            const usernameExistente = await pool
                .request()
                .input('username', sql.NVarChar, dto.username)
                .input('id', sql.Int, id)
                .query(
                    `SELECT id FROM utilizadores WHERE username = @username AND id != @id`,
                );

            if (usernameExistente.recordset.length > 0) {
                throw new BadRequestException('Username já está em uso');
            }
        }

        const updates: string[] = [];
        const request = pool.request().input('id', sql.Int, id);

        if (dto.username) {
            updates.push('username = @username');
            request.input('username', sql.NVarChar, dto.username);
        }
        if (dto.email) {
            updates.push('email = @email');
            request.input('email', sql.NVarChar, dto.email);
        }
        if (dto.telefone !== undefined) {
            updates.push('telefone = @telefone');
            request.input('telefone', sql.NVarChar, dto.telefone);
        }
        if (dto.foto_url !== undefined) {
            updates.push('foto_url = @foto_url');
            request.input('foto_url', sql.NVarChar, dto.foto_url);
        }
        if (dto.ativo !== undefined) {
            updates.push('ativo = @ativo');
            request.input('ativo', sql.Bit, dto.ativo ? 1 : 0);
        }
        if (dto.email_verificado !== undefined) {
            updates.push('email_verificado = @email_verificado');
            request.input('email_verificado', sql.Bit, dto.email_verificado ? 1 : 0);
        }
        if (dto.tipo_utilizador !== undefined) {
            updates.push('tipo_utilizador = @tipo_utilizador');
            request.input('tipo_utilizador', sql.NVarChar, dto.tipo_utilizador);
        }
        if (dto.cliente_id !== undefined) {
            updates.push('cliente_id = @cliente_id');
            request.input('cliente_id', sql.Int, dto.cliente_id);
        }
        if (dto.funcionario_id !== undefined) {
            updates.push('funcionario_id = @funcionario_id');
            request.input('funcionario_id', sql.Int, dto.funcionario_id);
        }

        updates.push('atualizado_em = GETDATE()');

        if (updates.length > 0) {
            await request.query(`
        UPDATE utilizadores
        SET ${updates.join(', ')}
        WHERE id = @id
      `);
        }

        return { success: true };
    }

    async atualizarSenha(
        tenantId: number,
        utilizadorId: number,
        dto: AtualizarSenhaDto,
    ) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Buscar utilizador com senha atual
        const utilizadorResult = await pool
            .request()
            .input('id', sql.Int, utilizadorId)
            .query(`SELECT senha_hash FROM utilizadores WHERE id = @id`);

        if (!utilizadorResult.recordset[0]) {
            throw new NotFoundException('Utilizador não encontrado');
        }

        // Verificar senha atual
        const senhaValida = await bcrypt.compare(
            dto.senhaAtual,
            utilizadorResult.recordset[0].senha_hash,
        );

        if (!senhaValida) {
            throw new UnauthorizedException('Senha atual incorreta');
        }

        // Hash da nova senha
        const novaSenhaHash = await bcrypt.hash(dto.senhaNova, 10);

        // Atualizar senha
        await pool
            .request()
            .input('id', sql.Int, utilizadorId)
            .input('senha_hash', sql.NVarChar, novaSenhaHash)
            .query(`
        UPDATE utilizadores
        SET senha_hash = @senha_hash, atualizado_em = GETDATE()
        WHERE id = @id
      `);

        return { success: true };
    }

    async resetarSenha(tenantId: number, utilizadorId: number, novaSenha: string) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Hash da nova senha
        const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

        // Atualizar senha
        await pool
            .request()
            .input('id', sql.Int, utilizadorId)
            .input('senha_hash', sql.NVarChar, novaSenhaHash)
            .query(`
        UPDATE utilizadores
        SET senha_hash = @senha_hash, atualizado_em = GETDATE()
        WHERE id = @id
      `);

        return { success: true };
    }

    async deletar(tenantId: number, id: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        await pool
            .request()
            .input('id', sql.Int, id)
            .query(`
        UPDATE utilizadores
        SET ativo = 0, atualizado_em = GETDATE()
        WHERE id = @id
      `);

        return { success: true };
    }

    async associarGrupos(
        tenantId: number,
        utilizadorId: number,
        gruposIds: number[],
    ) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Remover grupos antigos
        await pool
            .request()
            .input('utilizadorId', sql.Int, utilizadorId)
            .query(`DELETE FROM grupo_utilizador WHERE utilizador_id = @utilizadorId`);

        // Adicionar novos grupos
        for (const grupoId of gruposIds) {
            await pool
                .request()
                .input('utilizadorId', sql.Int, utilizadorId)
                .input('grupoId', sql.Int, grupoId)
                .query(`
          INSERT INTO grupo_utilizador (grupo_id, utilizador_id, criado_em)
          VALUES (@grupoId, @utilizadorId, GETDATE())
        `);
        }

        return { success: true };
    }

    async removerDeGrupo(
        tenantId: number,
        utilizadorId: number,
        grupoId: number,
    ) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        await pool
            .request()
            .input('utilizadorId', sql.Int, utilizadorId)
            .input('grupoId', sql.Int, grupoId)
            .query(`
        DELETE FROM grupo_utilizador
        WHERE utilizador_id = @utilizadorId AND grupo_id = @grupoId
      `);

        return { success: true };
    }

    async associarPermissoes(
        tenantId: number,
        utilizadorId: number,
        permissoesIds: number[],
    ) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Remover permissões diretas antigas
        await pool
            .request()
            .input('utilizadorId', sql.Int, utilizadorId)
            .query(
                `DELETE FROM utilizador_permissao WHERE utilizador_id = @utilizadorId`,
            );

        // Adicionar novas permissões
        for (const permissaoId of permissoesIds) {
            await pool
                .request()
                .input('utilizadorId', sql.Int, utilizadorId)
                .input('permissaoId', sql.Int, permissaoId)
                .query(`
          INSERT INTO utilizador_permissao (utilizador_id, permissao_id, criado_em)
          VALUES (@utilizadorId, @permissaoId, GETDATE())
        `);
        }

        return { success: true };
    }

    async removerPermissao(
        tenantId: number,
        utilizadorId: number,
        permissaoId: number,
    ) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        await pool
            .request()
            .input('utilizadorId', sql.Int, utilizadorId)
            .input('permissaoId', sql.Int, permissaoId)
            .query(`
        DELETE FROM utilizador_permissao
        WHERE utilizador_id = @utilizadorId AND permissao_id = @permissaoId
      `);

        return { success: true };
    }

    async associarEmpresas(
        tenantId: number,
        utilizadorId: number,
        empresasIds: number[],
        empresaPrincipalId?: number,
    ) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Remover empresas antigas
        await pool
            .request()
            .input('utilizadorId', sql.Int, utilizadorId)
            .query(
                `DELETE FROM utilizador_empresa WHERE utilizador_id = @utilizadorId`,
            );

        // Adicionar novas empresas
        for (const empresaId of empresasIds) {
            const isPrincipal = empresaId === empresaPrincipalId;

            await pool
                .request()
                .input('utilizadorId', sql.Int, utilizadorId)
                .input('empresaId', sql.Int, empresaId)
                .input('empresaPrincipal', sql.Bit, isPrincipal ? 1 : 0)
                .query(`
          INSERT INTO utilizador_empresa (utilizador_id, empresa_id, empresa_principal, criado_em)
          VALUES (@utilizadorId, @empresaId, @empresaPrincipal, GETDATE())
        `);
        }

        return { success: true };
    }

    async removerDeEmpresa(
        tenantId: number,
        utilizadorId: number,
        empresaId: number,
    ) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        await pool
            .request()
            .input('utilizadorId', sql.Int, utilizadorId)
            .input('empresaId', sql.Int, empresaId)
            .query(`
        DELETE FROM utilizador_empresa
        WHERE utilizador_id = @utilizadorId AND empresa_id = @empresaId
      `);

        return { success: true };
    }

    async obterEstatisticas(tenantId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request().query(`
            SELECT
                COUNT(*) AS total_utilizadores,
                COUNT(CASE WHEN ativo = 1 THEN 1 END) AS utilizadores_ativos,
                COUNT(CASE WHEN ativo = 0 THEN 1 END) AS utilizadores_inativos,
                COUNT(CASE WHEN email_verificado = 1 THEN 1 END) AS emails_verificados,
                COUNT(CASE WHEN email_verificado = 0 OR email_verificado IS NULL THEN 1 END) AS emails_nao_verificados,
                COUNT(CASE WHEN DATEDIFF(day, criado_em, GETDATE()) <= 30 THEN 1 END) AS novos_ultimos_30_dias,
                COUNT(CASE WHEN ultimo_login IS NOT NULL AND DATEDIFF(day, ultimo_login, GETDATE()) <= 7 THEN 1 END) AS ativos_ultimos_7_dias
            FROM utilizadores
        `);

        return result.recordset[0];
    }

    async obterEstatisticasDashboard(tenantId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Estatísticas de utilizadores
        const estatisticasUtilizadores = await pool.request().query(`
            SELECT
                COUNT(*) AS total_utilizadores,
                COUNT(CASE WHEN ativo = 1 THEN 1 END) AS utilizadores_ativos,
                COUNT(CASE WHEN ativo = 0 THEN 1 END) AS utilizadores_inativos,
                COUNT(CASE WHEN email_verificado = 1 THEN 1 END) AS emails_verificados,
                COUNT(CASE WHEN email_verificado = 0 OR email_verificado IS NULL THEN 1 END) AS emails_nao_verificados,
                COUNT(CASE WHEN criado_em >= DATEADD(day, -7, GETDATE()) THEN 1 END) AS novos_ultimos_7_dias,
                COUNT(CASE WHEN criado_em >= DATEADD(day, -30, GETDATE()) THEN 1 END) AS novos_ultimos_30_dias,
                COUNT(CASE WHEN ultimo_login IS NOT NULL AND DATEDIFF(day, ultimo_login, GETDATE()) <= 7 THEN 1 END) AS ativos_ultimos_7_dias,
                COUNT(CASE WHEN ultimo_login IS NOT NULL AND DATEDIFF(day, ultimo_login, GETDATE()) <= 30 THEN 1 END) AS ativos_ultimos_30_dias,
                COUNT(CASE WHEN funcionario_id IS NOT NULL THEN 1 END) AS utilizadores_com_funcionario
            FROM utilizadores
        `);

        // Estatísticas de grupos
        const estatisticasGrupos = await pool.request().query(`
            SELECT
                COUNT(*) AS total_grupos,
                COUNT(CASE WHEN ativo = 1 THEN 1 END) AS grupos_ativos,
                COUNT(CASE WHEN ativo = 0 THEN 1 END) AS grupos_inativos,
                (SELECT COUNT(*) FROM grupo_utilizador) AS total_atribuicoes_grupos,
                (SELECT COUNT(DISTINCT utilizador_id) FROM grupo_utilizador) AS utilizadores_com_grupos,
                (SELECT COUNT(DISTINCT grupo_id) FROM grupo_permissao) AS grupos_com_permissoes
            FROM grupos
        `);

        // Estatísticas de permissões
        const estatisticasPermissoes = await pool.request().query(`
            SELECT
                COUNT(*) AS total_permissoes,
                COUNT(DISTINCT modulo) AS total_modulos,
                (SELECT COUNT(*) FROM grupo_permissao) AS total_permissoes_grupos,
                (SELECT COUNT(*) FROM utilizador_permissao) AS total_permissoes_individuais,
                (SELECT COUNT(DISTINCT utilizador_id) FROM utilizador_permissao) AS utilizadores_com_permissoes_individuais
            FROM permissoes
        `);

        // Grupos com mais utilizadores
        const gruposMaisUtilizadores = await pool.request().query(`
            SELECT TOP 10
                g.id,
                g.nome,
                g.descricao,
                g.ativo,
                COUNT(gu.utilizador_id) AS total_utilizadores,
                (SELECT COUNT(*) FROM grupo_permissao gp WHERE gp.grupo_id = g.id) AS total_permissoes
            FROM grupos g
            LEFT JOIN grupo_utilizador gu ON gu.grupo_id = g.id
            GROUP BY g.id, g.nome, g.descricao, g.ativo
            ORDER BY total_utilizadores DESC
        `);

        // Permissões por módulo
        const permissoesPorModulo = await pool.request().query(`
            SELECT
                modulo,
                COUNT(*) AS total_permissoes,
                COUNT(CASE WHEN tipo = 'Criar' THEN 1 END) AS criar,
                COUNT(CASE WHEN tipo = 'Listar' THEN 1 END) AS listar,
                COUNT(CASE WHEN tipo = 'Visualizar' THEN 1 END) AS visualizar,
                COUNT(CASE WHEN tipo = 'Editar' THEN 1 END) AS editar,
                COUNT(CASE WHEN tipo = 'Apagar' THEN 1 END) AS apagar,
                (SELECT COUNT(DISTINCT gp.grupo_id)
                 FROM grupo_permissao gp
                 INNER JOIN permissoes p2 ON gp.permissao_id = p2.id
                 WHERE p2.modulo = permissoes.modulo) AS grupos_com_acesso
            FROM permissoes
            GROUP BY modulo
            ORDER BY total_permissoes DESC
        `);

        // Utilizadores recentemente criados
        const utilizadoresRecentes = await pool.request().query(`
            SELECT TOP 10
                u.id,
                u.username,
                u.email,
                u.foto_url,
                u.ativo,
                u.email_verificado,
                u.criado_em,
                u.ultimo_login,
                (SELECT COUNT(*) FROM grupo_utilizador gu WHERE gu.utilizador_id = u.id) AS total_grupos,
                (SELECT COUNT(*) FROM utilizador_permissao up WHERE up.utilizador_id = u.id) AS total_permissoes_individuais
            FROM utilizadores u
            ORDER BY u.criado_em DESC
        `);

        // Atividade de login (últimos 30 dias)
        const atividadeLogin = await pool.request().query(`
            SELECT
                CAST(ultimo_login AS DATE) AS data,
                COUNT(DISTINCT id) AS total_logins
            FROM utilizadores
            WHERE ultimo_login >= DATEADD(day, -30, GETDATE())
                AND ultimo_login IS NOT NULL
            GROUP BY CAST(ultimo_login AS DATE)
            ORDER BY data ASC
        `);

        // Utilizadores por criação ao longo do tempo (últimos 12 meses)
        const utilizadoresPorMes = await pool.request().query(`
            SELECT
                FORMAT(criado_em, 'yyyy-MM') AS mes,
                COUNT(*) AS total_criados
            FROM utilizadores
            WHERE criado_em >= DATEADD(month, -12, GETDATE())
            GROUP BY FORMAT(criado_em, 'yyyy-MM')
            ORDER BY mes ASC
        `);

        // Top utilizadores mais ativos (baseado em último login)
        const utilizadoresMaisAtivos = await pool.request().query(`
            SELECT TOP 10
                u.id,
                u.username,
                u.email,
                u.foto_url,
                u.ultimo_login,
                DATEDIFF(day, u.ultimo_login, GETDATE()) AS dias_desde_ultimo_login,
                (SELECT COUNT(*) FROM grupo_utilizador gu WHERE gu.utilizador_id = u.id) AS total_grupos
            FROM utilizadores u
            WHERE u.ativo = 1 AND u.ultimo_login IS NOT NULL
            ORDER BY u.ultimo_login DESC
        `);

        return {
            estatisticasUtilizadores: estatisticasUtilizadores.recordset[0],
            estatisticasGrupos: estatisticasGrupos.recordset[0],
            estatisticasPermissoes: estatisticasPermissoes.recordset[0],
            gruposMaisUtilizadores: gruposMaisUtilizadores.recordset,
            permissoesPorModulo: permissoesPorModulo.recordset,
            utilizadoresRecentes: utilizadoresRecentes.recordset,
            atividadeLogin: atividadeLogin.recordset,
            utilizadoresPorMes: utilizadoresPorMes.recordset,
            utilizadoresMaisAtivos: utilizadoresMaisAtivos.recordset,
        };
    }
}
