import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sql from 'mssql';
import * as crypto from 'crypto';

interface TenantConnection {
    pool: sql.ConnectionPool;
    lastUsed: Date;
    database: string;
}

@Injectable()
export class DatabaseService implements OnModuleDestroy {
    private readonly logger = new Logger(DatabaseService.name);
    private mainPool: sql.ConnectionPool;
    private tenantPools: Map<number, TenantConnection> = new Map();
    private readonly POOL_TIMEOUT = 30 * 60 * 1000; // 30 minutos

    constructor(private configService: ConfigService) {
        this.initializeMainConnection();
        this.startPoolCleanup();
    }

    // Conexão principal (CEO_Main)
    private async initializeMainConnection() {
        const config = this.configService.get('database.main');
        this.mainPool = new sql.ConnectionPool(config);

        try {
            await this.mainPool.connect();
            this.logger.log('Conexão principal estabelecida');
        } catch (error) {
            this.logger.error('Erro ao conectar ao banco de dados principal:', error);
            throw error;
        }
    }

    // Obter conexão principal
    getMainConnection(): sql.ConnectionPool {
        if (!this.mainPool?.connected) {
            throw new Error('Conexão principal não está disponível');
        }
        return this.mainPool;
    }

    // Obter ou criar conexão do tenant
    async getTenantConnection(tenantId: number): Promise<sql.ConnectionPool> {
        // Se já existir pool ativa, reutiliza
        const existing = this.tenantPools.get(tenantId);
        if (existing?.pool?.connected) {
            existing.lastUsed = new Date();
            return existing.pool;
        }

        // Buscar informações básicas do tenant (nome da base)
        const tenantInfo = await this.getTenantInfo(tenantId);
        if (!tenantInfo) {
            throw new Error(`Tenant ${tenantId} não encontrado`);
        }

        // Buscar configurações e chave de criptografia
        const tenantDbConfig = await this.getTenantDbConfig(tenantId, tenantInfo.database_name);

        // Criar nova conexão
        const pool = new sql.ConnectionPool(tenantDbConfig);
        await pool.connect();

        this.tenantPools.set(tenantId, {
            pool,
            lastUsed: new Date(),
            database: tenantDbConfig.database,
        });

        this.logger.log(`Conexão criada para tenant ${tenantId} (${tenantInfo.nome})`);
        return pool;
    }

    // Busca o nome da base de dados do tenant
    private async getTenantInfo(tenantId: number) {
        const result = await this.mainPool
            .request()
            .input('tenantId', sql.Int, tenantId)
            .query(`
                SELECT id, nome, database_name
                FROM tenants
                WHERE id = @tenantId
            `);

        return result.recordset[0];
    }

    async getTenantInfoBySlug(tenantSlug: string) {
        const result = await this.mainPool
            .request()
            .input('tenantSlug', sql.VarChar, tenantSlug)
            .query(`
                SELECT id, nome, database_name
                FROM tenants
                WHERE slug = @tenantSlug
            `);
        return result.recordset[0];
    }

    // Lê configurações da tabela tenant_configuracoes
    private async getTenantDbConfig(tenantId: number, databaseName: string) {
        const result = await this.mainPool
            .request()
            .input('tenantId', sql.Int, tenantId)
            .query(`
                SELECT codigo, valor
                FROM tenant_configuracoes
                WHERE tenant_id = @tenantId
            `);

        const configMap = Object.fromEntries(result.recordset.map(r => [r.codigo, r.valor]));

        if (!configMap.MASTER_ENCRYPTION_KEY) {
            throw new Error(`MASTER_ENCRYPTION_KEY não encontrada para tenant ${tenantId}`);
        }

        // usar a chave deste tenant para descriptografar
        const decrypt = (val: string) => this.decrypt(val, configMap.MASTER_ENCRYPTION_KEY);

        // monta o config da conexão
        return {
            server: decrypt(configMap.DB_HOST),
            port: parseInt(decrypt(configMap.DB_PORT), 10),
            user: decrypt(configMap.DB_USER),
            password: decrypt(configMap.DB_PASSWORD),
            database: databaseName, // vem da tabela tenants
            options: {
                encrypt: process.env.DB_ENCRYPT === 'true',
                trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
            },
            pool: {
                max: 10,
                min: 0,
                idleTimeoutMillis: 30000,
            },
        };
    }

    // Descriptografar valores (AES-256-CBC)
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
            this.logger.error('Erro ao descriptografar valor:', err.message);
            throw err;
        }
    }

    // Limpar pools inativos
    private startPoolCleanup() {
        setInterval(() => {
            const now = new Date();

            this.tenantPools.forEach((connection, tenantId) => {
                const timeSinceLastUse = now.getTime() - connection.lastUsed.getTime();

                if (timeSinceLastUse > this.POOL_TIMEOUT) {
                    connection.pool.close();
                    this.tenantPools.delete(tenantId);
                    this.logger.log(`✓ Pool do tenant ${tenantId} fechado por inatividade`);
                }
            });
        }, 10 * 60 * 1000); // Verificar a cada 10 minutos
    }

    // Fechar todas as conexões
    async onModuleDestroy() {
        this.logger.log('Fechando todas as conexões...');

        for (const [tenantId, connection] of this.tenantPools) {
            await connection.pool.close();
            this.logger.log(`✓ Pool do tenant ${tenantId} fechado`);
        }

        if (this.mainPool) {
            await this.mainPool.close();
            this.logger.log('✓ Conexão principal fechada');
        }
    }
}
