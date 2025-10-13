import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import * as bcrypt from 'bcrypt';
import * as sql from 'mssql';

interface LoginDto {
    email: string;
    password: string;
    tenantSlug?: string;
}

@Injectable()
export class AuthService {
    constructor(
        private databaseService: DatabaseService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async getUserModules(userId: number, tenantId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Obter todas as permissões do utilizador (diretas + grupos)
        const permissoesResult = await pool
            .request()
            .input('userId', sql.Int, userId)
            .query(`
            SELECT DISTINCT p.id, p.codigo, p.nome, p.descricao, p.modulo, p.tipo
            FROM permissoes p
            WHERE p.id IN (
              -- Permissões diretas do utilizador
              SELECT permissao_id FROM utilizador_permissao WHERE utilizador_id = @userId
              UNION
              -- Permissões dos grupos do utilizador
              SELECT gp.permissao_id
              FROM grupo_permissao gp
              INNER JOIN grupo_utilizador gu ON gp.grupo_id = gu.grupo_id
              WHERE gu.utilizador_id = @userId
            )
            ORDER BY p.modulo, p.tipo, p.nome
          `);

        const permissoes = permissoesResult.recordset;

        // Agrupar permissões por módulo
        const modulosMap = new Map<string, any>();

        permissoes.forEach((permissao) => {
            const modulo = permissao.modulo;

            if (!modulosMap.has(modulo)) {
                modulosMap.set(modulo, {
                    modulo: modulo,
                    nome: this.getModuleName(modulo),
                    icone: this.getModuleIcon(modulo),
                    permissoes: [],
                });
            }

            modulosMap.get(modulo).permissoes.push({
                codigo: permissao.codigo,
                nome: permissao.nome,
                tipo: permissao.tipo,
            });
        });

        // Converter Map para array
        const modulos = Array.from(modulosMap.values());

        // Obter empresas do utilizador
        const empresasResult = await pool
            .request()
            .input('userId', sql.Int, userId)
            .query(`
            SELECT 
              ue.empresa_id,
              ue.empresa_principal,
              e.nome AS empresa_nome,
              e.codigo AS empresa_codigo,
              e.logo_url,
              e.cor
            FROM utilizador_empresa ue
            INNER JOIN empresas e ON ue.empresa_id = e.id
            WHERE ue.utilizador_id = @userId
            ORDER BY ue.empresa_principal DESC
          `);

        return {
            modulos,
            empresas: empresasResult.recordset,
            totalPermissoes: permissoes.length,
            permissoesCodigos: permissoes.map((p) => p.codigo),
        };
    }

    // Helper: Nome do módulo
    private getModuleName(modulo: string): string {
        const nomes = {
            ADMIN: 'Administração',
            RH: 'Recursos Humanos',
            EMPRESAS: 'Empresas',
            CONTEUDOS: 'Conteúdos',
            VEICULOS: 'Veículos',
            SUPORTE: 'Suporte',
            RELATORIOS: 'Relatórios',
        };
        return nomes[modulo] || modulo;
    }

    // Helper: Ícone do módulo
    private getModuleIcon(modulo: string): string {
        const icones = {
            ADMIN: 'settings',
            RH: 'users',
            EMPRESA: 'building',
            CONTEUDO: 'file-text',
            VEICULOS: 'truck',
            SUPORTE: 'help-circle',
            RELATORIOS: 'bar-chart',
        };
        return icones[modulo] || 'circle';
    }

    async login(dto: LoginDto) {
        // 1. Buscar tenant pelo slug (se fornecido) ou email
        const tenant = await this.findTenant(dto.tenantSlug, dto.email);

        if (!tenant) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        // 2. Buscar utilizador no tenant
        const user = await this.findUser(tenant.id, dto.email);

        if (!user || !user.ativo) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        // 3. Validar senha
        const isPasswordValid = await bcrypt.compare(
            dto.password,
            user.senha_hash,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        // 4. Buscar permissões do utilizador
        const permissions = await this.getUserPermissions(tenant.id, user.id);

        // 5. Buscar empresas do utilizador
        const empresas = await this.getUserEmpresas(tenant.id, user.id);

        // 6. Gerar tokens
        const payload = {
            sub: user.id,
            username: user.username,
            email: user.email,
            tenantId: tenant.id,
            tenantSlug: tenant.slug,
            empresas: empresas.map((e) => e.empresa_id),
            empresaPrincipal: empresas.find((e) => e.empresa_principal)?.empresa_id,
            permissions,
        };

        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(
            { sub: user.id, tenantId: tenant.id },
            {
                secret: this.configService.get('jwt.refreshSecret'),
                expiresIn: this.configService.get('jwt.refreshExpiresIn'),
            },
        );

        // 7. Atualizar último acesso
        await this.updateLastAccess(tenant.id, user.id);

        // 8. Log de auditoria
        await this.logAccess(tenant.id, user.id, 'login');

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fotoUrl: user.foto_url,
            },
            tenant: {
                id: tenant.id,
                nome: tenant.nome,
                slug: tenant.slug,
            },
            empresas: empresas.map((e) => ({
                id: e.empresa_id,
                nome: e.empresa_nome,
                principal: e.empresa_principal,
            })),
        };
    }

    async refreshToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('jwt.refreshSecret'),
            });

            const user = await this.findUserById(payload.tenantId, payload.sub);

            if (!user || !user.ativo) {
                throw new UnauthorizedException('Refresh token inválido');
            }

            const permissions = await this.getUserPermissions(
                payload.tenantId,
                user.id,
            );

            const empresas = await this.getUserEmpresas(payload.tenantId, user.id);

            const newPayload = {
                sub: user.id,
                username: user.username,
                email: user.email,
                tenantId: payload.tenantId,
                empresas: empresas.map((e) => e.empresa_id),
                empresaPrincipal: empresas.find((e) => e.empresa_principal)
                    ?.empresa_id,
                permissions,
            };

            const accessToken = this.jwtService.sign(newPayload);

            return { accessToken };
        } catch (error) {
            throw new UnauthorizedException('Refresh token inválido ou expirado');
        }
    }

    async validateUser(userId: number, tenantId: number) {
        const user = await this.findUserById(tenantId, userId);

        if (!user || !user.ativo) {
            return null;
        }

        return user;
    }

    // Métodos privados

    private async findTenant(slug?: string, email?: string) {
        const mainPool = this.databaseService.getMainConnection();

        let query = `
      SELECT id, nome, slug, database_name, ativo
      FROM tenants
      WHERE ativo = 1
    `;

        const request = mainPool.request();

        if (slug) {
            query += ' AND slug = @slug';
            request.input('slug', sql.NVarChar, slug);
        } else if (email) {
            // Se não forneceu slug, buscar pelo domínio do email
            const domain = email.split('@')[1];
            query += ' AND (slug = @domain OR dominio = @domain)';
            request.input('domain', sql.NVarChar, domain);
        } else {
            return null;
        }

        const result = await request.query(query);
        return result.recordset[0];
    }

    private async findUser(tenantId: number, email: string) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool
            .request()
            .input('email', sql.NVarChar, email)
            .query(`
        SELECT id, username, email, senha_hash, ativo, foto_url
        FROM utilizadores
        WHERE email = @email
      `);

        return result.recordset[0];
    }

    private async findUserById(tenantId: number, userId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool
            .request()
            .input('userId', sql.Int, userId)
            .query(`
        SELECT id, username, email, ativo, foto_url
        FROM utilizadores
        WHERE id = @userId
      `);

        return result.recordset[0];
    }

    private async getUserPermissions(
        tenantId: number,
        userId: number,
    ): Promise<string[]> {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool
            .request()
            .input('userId', sql.Int, userId)
            .query(`
        SELECT DISTINCT p.codigo
        FROM permissoes p
        WHERE p.id IN (
          -- Permissões diretas do utilizador
          SELECT permissao_id FROM utilizador_permissao WHERE utilizador_id = @userId
          UNION
          -- Permissões dos grupos do utilizador
          SELECT gp.permissao_id
          FROM grupo_permissao gp
          INNER JOIN grupo_utilizador gu ON gp.grupo_id = gu.grupo_id
          WHERE gu.utilizador_id = @userId
        )
      `);

        return result.recordset.map((r) => r.codigo);
    }

    private async getUserEmpresas(tenantId: number, userId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool
            .request()
            .input('userId', sql.Int, userId)
            .query(`
        SELECT 
          ue.empresa_id,
          ue.empresa_principal,
          e.nome AS empresa_nome,
          e.codigo AS empresa_codigo
        FROM utilizador_empresa ue
        INNER JOIN empresas e ON ue.empresa_id = e.id
        WHERE ue.utilizador_id = @userId
        ORDER BY ue.empresa_principal DESC
      `);

        return result.recordset;
    }

    private async updateLastAccess(tenantId: number, userId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        await pool
            .request()
            .input('userId', sql.Int, userId)
            .query(`
        UPDATE utilizadores
        SET ultimo_acesso = GETDATE()
        WHERE id = @userId
      `);
    }

    private async logAccess(
        tenantId: number,
        userId: number,
        action: string,
    ) {
        const mainPool = this.databaseService.getMainConnection();

        await mainPool
            .request()
            .input('tenantId', sql.Int, tenantId)
            .input('tipo', sql.NVarChar, action)
            .input('acao', sql.NVarChar, `Utilizador ${userId} fez ${action}`)
            .input('utilizadorId', sql.Int, userId)
            .query(`
        INSERT INTO logs_auditoria (tenant_id, tipo, acao, utilizador_id, data_hora)
        VALUES (@tenantId, @tipo, @acao, @utilizadorId, GETDATE())
      `);
    }
}