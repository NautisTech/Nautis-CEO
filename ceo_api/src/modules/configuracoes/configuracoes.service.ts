import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import * as sql from 'mssql';
import { AtualizarConfiguracaoDto } from './dto/atualizar-configuracao.dto';
import { BaseService } from '../../shared/base/base.service';
import * as crypto from 'crypto';

@Injectable()
export class ConfiguracoesService extends BaseService {
    constructor(databaseService: DatabaseService) {
        super(databaseService);
    }

    /**
     * Obter a chave de encriptação do ambiente
     */
    private getMasterEncryptionKey(): string {
        const key = process.env.MASTER_ENCRYPTION_KEY;
        if (!key) {
            throw new Error('MASTER_ENCRYPTION_KEY não encontrada no ambiente');
        }
        return key;
    }

    /**
     * Encriptar valor usando a chave do tenant
     */
    private encrypt(value: string, keyHex: string): string {
        if (!value) return '';
        try {
            const key = Buffer.from(keyHex, 'hex');
            const iv = Buffer.alloc(16, 0);
            const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            const encrypted = Buffer.concat([
                cipher.update(value, 'utf8'),
                cipher.final(),
            ]);
            return encrypted.toString('base64');
        } catch (err) {
            throw new Error(`Erro ao encriptar valor: ${err.message}`);
        }
    }

    /**
     * Desencriptar valor usando a chave do tenant
     */
    private decrypt(encryptedValue: string, keyHex: string): string {
        if (!encryptedValue) return '';
        try {
            const key = Buffer.from(keyHex, 'hex');
            const iv = Buffer.alloc(16, 0);
            const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
            const decrypted = Buffer.concat([
                decipher.update(Buffer.from(encryptedValue, 'base64')),
                decipher.final(),
            ]);
            return decrypted.toString('utf8');
        } catch (err) {
            throw new Error(`Erro ao desencriptar valor: ${err.message}`);
        }
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

        const config = result.recordset[0];
        if (!config) return null;

        // Desencriptar se necessário
        if (config.encriptado === 1 || config.encriptado === true) {
            const key = this.getMasterEncryptionKey();
            config.valor = this.decrypt(config.valor, key);
        }

        return config;
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

        // Check if configuration exists and if it should be encrypted
        const exists = await pool.request()
            .input('codigo', sql.NVarChar, dto.codigo)
            .query(`SELECT id, encriptado FROM configuracoes WHERE codigo = @codigo`);

        let valorParaGuardar = dto.valor;

        // Se a configuração existe e deve ser encriptada, encriptar o novo valor
        if (exists.recordset.length > 0) {
            const config = exists.recordset[0];
            if (config.encriptado === 1 || config.encriptado === true) {
                const key = this.getMasterEncryptionKey();
                valorParaGuardar = this.encrypt(dto.valor, key);
            }

            // Update existing
            await pool.request()
                .input('codigo', sql.NVarChar, dto.codigo)
                .input('valor', sql.NVarChar, valorParaGuardar)
                .query(`
                    UPDATE configuracoes
                    SET valor = @valor
                    WHERE codigo = @codigo
                `);
        } else {
            // Create new (não encripta ao criar, pois encriptado será 0 por padrão)
            await pool.request()
                .input('codigo', sql.NVarChar, dto.codigo)
                .input('descricao', sql.NVarChar, dto.codigo)
                .input('valor', sql.NVarChar, valorParaGuardar)
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
                    encriptado,
                    atualizado_em
                FROM configuracoes
                ORDER BY codigo
            `);

        // Desencriptar valores quando necessário
        const key = this.getMasterEncryptionKey();

        return result.recordset.map(config => {
            if (config.encriptado === 1 || config.encriptado === true) {
                return {
                    ...config,
                    valor: this.decrypt(config.valor, key)
                };
            }
            return config;
        });
    }

    /**
     * Obter configurações públicas do tenant por slug
     */
    async obterConfiguracoesPublicasPorSlug(slug: string) {
        // Primeiro, resolver o tenant pelo slug
        const tenantInfo = await this.databaseService.getTenantInfoBySlug(slug);

        if (!tenantInfo) {
            throw new Error(`Tenant com slug "${slug}" não encontrado`);
        }

        const tenantId = tenantInfo.id;
        const tenantName = tenantInfo.nome;

        // Buscar configurações específicas do tenant
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const configCodes = [
            'TENANT_NAME',
            'CLIENT_PORTAL',
            'SUPPLIER_PORTAL',
            'TICKET_PORTAL',
            'USE_TENANT_LOGO',
            'TENANT_LOGO_PATH',
            'TENANT_LOGO_PATH_DARK'
        ];

        // Adicionar parâmetros
        const request = pool.request();
        configCodes.forEach((code, i) => {
            request.input(`code${i}`, sql.VarChar, code);
        });

        const configResult = await request.query(`
            SELECT
                codigo,
                valor,
                encriptado
            FROM configuracoes
            WHERE codigo IN (${configCodes.map((_, i) => `@code${i}`).join(', ')})
        `);

        // Desencriptar valores quando necessário (embora configs públicas não devam estar encriptadas)
        const key = this.getMasterEncryptionKey();
        const configs: Record<string, string | boolean> = {};

        configResult.recordset.forEach(config => {
            let valor = config.valor;
            if (config.encriptado === 1 || config.encriptado === true) {
                valor = this.decrypt(valor, key);
            }

            // Converter valores booleanos
            if (config.codigo.includes('PORTAL') || config.codigo === 'USE_TENANT_LOGO') {
                configs[config.codigo] = valor === 'true' || valor === '1';
            } else {
                configs[config.codigo] = valor;
            }
        });

        // Se TENANT_NAME não estiver nas configs, usar o nome do tenant da tabela principal
        if (!configs.TENANT_NAME) {
            configs.TENANT_NAME = tenantName;
        }

        return {
            data: {
                tenantName: configs.TENANT_NAME as string,
                clientPortal: configs.CLIENT_PORTAL !== undefined ? configs.CLIENT_PORTAL : false,
                supplierPortal: configs.SUPPLIER_PORTAL !== undefined ? configs.SUPPLIER_PORTAL : false,
                ticketPortal: configs.TICKET_PORTAL !== undefined ? configs.TICKET_PORTAL : false,
                useTenantLogo: configs.USE_TENANT_LOGO !== undefined ? configs.USE_TENANT_LOGO : false,
                tenantLogoPath: configs.TENANT_LOGO_PATH as string || null,
                tenantLogoPathDark: configs.TENANT_LOGO_PATH_DARK as string || null
            }
        };
    }
}
