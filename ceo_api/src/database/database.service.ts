import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sql from 'mssql';

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
        // Verificar se já existe conexão ativa
        const existing = this.tenantPools.get(tenantId);
        if (existing?.pool?.connected) {
            existing.lastUsed = new Date();
            return existing.pool;
        }

        // Buscar informações do tenant no CEO_Main
        const tenantInfo = await this.getTenantInfo(tenantId);

        if (!tenantInfo || !tenantInfo.ativo) {
            throw new Error(`Tenant ${tenantId} não encontrado ou inativo`);
        }

        // Criar nova conexão
        const config = {
            ...this.configService.get('database.main'),
            database: tenantInfo.database_name,
        };

        const pool = new sql.ConnectionPool(config);
        await pool.connect();

        this.tenantPools.set(tenantId, {
            pool,
            lastUsed: new Date(),
            database: tenantInfo.database_name,
        });

        this.logger.log(`Conexão criada para tenant ${tenantId} (${tenantInfo.nome})`);
        return pool;
    }

    // Buscar informações do tenant
    private async getTenantInfo(tenantId: number) {
        const result = await this.mainPool
            .request()
            .input('tenantId', sql.Int, tenantId)
            .query(`
        SELECT id, nome, database_name, ativo 
        FROM tenants 
        WHERE id = @tenantId
      `);

        return result.recordset[0];
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

        // Fechar pools dos tenants
        for (const [tenantId, connection] of this.tenantPools) {
            await connection.pool.close();
            this.logger.log(`✓ Pool do tenant ${tenantId} fechado`);
        }

        // Fechar pool principal
        if (this.mainPool) {
            await this.mainPool.close();
            this.logger.log('✓ Conexão principal fechada');
        }
    }
}