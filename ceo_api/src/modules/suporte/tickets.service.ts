import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CriarTicketDto } from './dto/criar-ticket.dto';
import * as sql from 'mssql';

@Injectable()
export class TicketsService {
    constructor(private readonly databaseService: DatabaseService) { }

    private calculateSLA(ticket: any) {
        if (!ticket.sla_horas || !ticket.data_abertura) return ticket;

        const now = new Date();
        const dataAbertura = new Date(ticket.data_abertura);
        const slaDeadline = new Date(dataAbertura.getTime() + ticket.sla_horas * 60 * 60 * 1000);

        const tempoRestanteMs = slaDeadline.getTime() - now.getTime();
        const tempoRestanteMinutos = Math.floor(tempoRestanteMs / (1000 * 60));
        const tempoTotalMinutos = ticket.sla_horas * 60;
        const porcentagemRestante = (tempoRestanteMinutos / tempoTotalMinutos) * 100;

        let slaStatus: 'ok' | 'warning' | 'overdue' = 'ok';
        if (tempoRestanteMinutos < 0) {
            slaStatus = 'overdue'; // Vermelho - atrasado
        } else if (porcentagemRestante < 25) {
            slaStatus = 'warning'; // Amarelo - menos de 25% do tempo restante
        }

        return {
            ...ticket,
            sla_deadline: slaDeadline.toISOString(),
            sla_status: slaStatus,
            sla_tempo_restante_minutos: tempoRestanteMinutos
        };
    }

    async criar(tenantId: number, dto: CriarTicketDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const request = pool.request();

        // Generate ticket number
        const countResult = await request.query(`
            SELECT COUNT(*) as total FROM tickets
        `);
        const numero_ticket = `TKT${String(countResult.recordset[0].total + 1).padStart(6, '0')}`;

        const result = await pool.request()
            .input('cliente_id', sql.Int, dto.cliente_id || null)
            .input('numero_ticket', sql.VarChar(50), numero_ticket)
            .input('tipo_ticket_id', sql.Int, dto.tipo_ticket_id)
            .input('equipamento_id', sql.Int, dto.equipamento_id || null)
            .input('titulo', sql.VarChar(200), dto.titulo)
            .input('descricao', sql.Text, dto.descricao)
            .input('prioridade', sql.VarChar(20), dto.prioridade)
            .input('status', sql.VarChar(20), dto.status || 'aberto')
            .input('solicitante_id', sql.Int, dto.solicitante_id)
            .input('atribuido_id', sql.Int, dto.atribuido_id || null)
            .input('localizacao', sql.VarChar(200), dto.localizacao || null)
            .input('data_prevista', sql.DateTime, dto.data_prevista ? new Date(dto.data_prevista) : null)
            .query(`
                DECLARE @output TABLE (
                    id INT,
                    cliente_id INT,
                    numero_ticket NVARCHAR(50),
                    tipo_ticket_id INT,
                    equipamento_id INT,
                    titulo NVARCHAR(200),
                    descricao NVARCHAR(MAX),
                    prioridade NVARCHAR(20),
                    status NVARCHAR(20),
                    solicitante_id INT,
                    atribuido_id INT,
                    localizacao NVARCHAR(200),
                    data_abertura DATETIME,
                    data_prevista DATETIME,
                    criado_em DATETIME
                );

                INSERT INTO tickets (
                    cliente_id, numero_ticket, tipo_ticket_id, equipamento_id,
                    titulo, descricao, prioridade, status, solicitante_id,
                    atribuido_id, localizacao, data_abertura, data_prevista, criado_em
                )
                OUTPUT INSERTED.id,
                    INSERTED.cliente_id,
                    INSERTED.numero_ticket,
                    INSERTED.tipo_ticket_id,
                    INSERTED.equipamento_id,
                    INSERTED.titulo,
                    INSERTED.descricao,
                    INSERTED.prioridade,
                    INSERTED.status,
                    INSERTED.solicitante_id,
                    INSERTED.atribuido_id,
                    INSERTED.localizacao,
                    INSERTED.data_abertura,
                    INSERTED.data_prevista,
                    INSERTED.criado_em
                INTO @output
                VALUES (
                    @cliente_id, @numero_ticket, @tipo_ticket_id, @equipamento_id,
                    @titulo, @descricao, @prioridade, @status, @solicitante_id,
                    @atribuido_id, @localizacao, GETDATE(), @data_prevista, GETDATE()
                );

                SELECT * FROM @output;
            `);

        return result.recordset[0];
    }

    async listar(tenantId: number, filtros: {
        tipo_ticket_id?: number;
        equipamento_id?: number;
        status?: string;
        prioridade?: string;
        solicitante_id?: number;
        atribuido_id?: number;
        page?: number;
        pageSize?: number;
    }) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const request = pool.request();

        let whereClause = `WHERE 1=1`;

        if (filtros.tipo_ticket_id) {
            whereClause += ` AND t.tipo_ticket_id = ${filtros.tipo_ticket_id}`;
        }
        if (filtros.equipamento_id) {
            whereClause += ` AND t.equipamento_id = ${filtros.equipamento_id}`;
        }
        if (filtros.status) {
            whereClause += ` AND t.status = '${filtros.status}'`;
        }
        if (filtros.prioridade) {
            whereClause += ` AND t.prioridade = '${filtros.prioridade}'`;
        }
        if (filtros.solicitante_id) {
            whereClause += ` AND t.solicitante_id = ${filtros.solicitante_id}`;
        }
        if (filtros.atribuido_id) {
            whereClause += ` AND t.atribuido_id = ${filtros.atribuido_id}`;
        }

        // If no pagination, return all
        if (!filtros.page || !filtros.pageSize) {
            const result = await request.query(`
                SELECT
                    t.*,
                    tt.nome as tipo_ticket_nome,
                    tt.sla_horas,
                    sol.username as solicitante_nome,
                    sol.email as solicitante_email,
                    atr.nome_completo as atribuido_nome,
                    e.numero_interno as equipamento_numero,
                    CONCAT(m.nome, ' ', mo.nome) as equipamento_nome
                FROM tickets t
                LEFT JOIN tipos_ticket tt ON t.tipo_ticket_id = tt.id
                LEFT JOIN utilizadores sol ON t.solicitante_id = sol.id
                LEFT JOIN funcionarios atr ON t.atribuido_id = atr.id
                LEFT JOIN equipamentos e ON t.equipamento_id = e.id
                LEFT JOIN modelos_equipamento mo ON e.modelo_id = mo.id
                LEFT JOIN marcas m ON mo.marca_id = m.id
                ${whereClause}
                ORDER BY t.criado_em DESC
            `);
            return result.recordset.map(ticket => this.calculateSLA(ticket));
        }

        // With pagination
        const page = filtros.page || 1;
        const pageSize = filtros.pageSize || 10;
        const offset = (page - 1) * pageSize;

        request.input('offset', sql.Int, offset);
        request.input('pageSize', sql.Int, pageSize);

        // Count total
        const countResult = await request.query(`
            SELECT COUNT(*) as total FROM tickets t ${whereClause}
        `);
        const total = countResult.recordset[0].total;

        // Fetch paginated data
        const dataResult = await request.query(`
            SELECT
                t.*,
                tt.nome as tipo_ticket_nome,
                tt.sla_horas,
                sol.username as solicitante_nome,
                sol.email as solicitante_email,
                atr.nome_completo as atribuido_nome,
                e.numero_interno as equipamento_numero,
                CONCAT(m.nome, ' ', mo.nome) as equipamento_nome
            FROM tickets t
            LEFT JOIN tipos_ticket tt ON t.tipo_ticket_id = tt.id
            LEFT JOIN utilizadores sol ON t.solicitante_id = sol.id
            LEFT JOIN funcionarios atr ON t.atribuido_id = atr.id
            LEFT JOIN equipamentos e ON t.equipamento_id = e.id
            LEFT JOIN modelos_equipamento mo ON e.modelo_id = mo.id
            LEFT JOIN marcas m ON mo.marca_id = m.id
            ${whereClause}
            ORDER BY t.criado_em DESC
            OFFSET @offset ROWS
            FETCH NEXT @pageSize ROWS ONLY
        `);

        return {
            data: dataResult.recordset.map(ticket => this.calculateSLA(ticket)),
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        };
    }

    async obterPorId(id: number, tenantId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('tenant_id', sql.Int, tenantId)
            .query(`
                SELECT
                    t.*,
                    tt.nome as tipo_ticket_nome,
                    tt.sla_horas,
                    sol.username as solicitante_nome,
                    sol.email as solicitante_email,
                    atr.nome_completo as atribuido_nome,
                    e.numero_interno as equipamento_numero,
                    CONCAT(m.nome, ' ', mo.nome) as equipamento_nome
                FROM tickets t
                LEFT JOIN tipos_ticket tt ON t.tipo_ticket_id = tt.id
                LEFT JOIN utilizadores sol ON t.solicitante_id = sol.id
                LEFT JOIN funcionarios atr ON t.atribuido_id = atr.id
                LEFT JOIN equipamentos e ON t.equipamento_id = e.id
                LEFT JOIN modelos_equipamento mo ON e.modelo_id = mo.id
                LEFT JOIN marcas m ON mo.marca_id = m.id
                WHERE t.id = @id
            `);

        if (result.recordset.length === 0) {
            throw new NotFoundException('Ticket não encontrado');
        }

        return this.calculateSLA(result.recordset[0]);
    }

    async atualizar(id: number, tenantId: number, dto: CriarTicketDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Check if exists
        await this.obterPorId(id, tenantId);

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('cliente_id', sql.Int, dto.cliente_id || null)
            .input('tipo_ticket_id', sql.Int, dto.tipo_ticket_id)
            .input('equipamento_id', sql.Int, dto.equipamento_id || null)
            .input('titulo', sql.VarChar(200), dto.titulo)
            .input('descricao', sql.Text, dto.descricao)
            .input('prioridade', sql.VarChar(20), dto.prioridade)
            .input('status', sql.VarChar(20), dto.status || 'aberto')
            .input('solicitante_id', sql.Int, dto.solicitante_id)
            .input('atribuido_id', sql.Int, dto.atribuido_id || null)
            .input('localizacao', sql.VarChar(200), dto.localizacao || null)
            .input('data_prevista', sql.DateTime, dto.data_prevista ? new Date(dto.data_prevista) : null)
            .query(`
                DECLARE @output TABLE (
                    id INT,
                    cliente_id INT,
                    tipo_ticket_id INT,
                    equipamento_id INT,
                    titulo NVARCHAR(200),
                    descricao NVARCHAR(MAX),
                    prioridade NVARCHAR(20),
                    status NVARCHAR(20),
                    solicitante_id INT,
                    atribuido_id INT,
                    localizacao NVARCHAR(200),
                    data_prevista DATETIME,
                    atualizado_em DATETIME
                );

                UPDATE tickets
                SET
                    cliente_id = @cliente_id,
                    tipo_ticket_id = @tipo_ticket_id,
                    equipamento_id = @equipamento_id,
                    titulo = @titulo,
                    descricao = @descricao,
                    prioridade = @prioridade,
                    status = @status,
                    solicitante_id = @solicitante_id,
                    atribuido_id = @atribuido_id,
                    localizacao = @localizacao,
                    data_prevista = @data_prevista,
                    atualizado_em = GETDATE()
                OUTPUT INSERTED.id,
                        INSERTED.cliente_id,
                        INSERTED.tipo_ticket_id,
                        INSERTED.equipamento_id,
                        INSERTED.titulo,
                        INSERTED.descricao,
                        INSERTED.prioridade,
                        INSERTED.status,
                        INSERTED.solicitante_id,
                        INSERTED.atribuido_id,
                        INSERTED.localizacao,
                        INSERTED.data_prevista,
                        INSERTED.atualizado_em
                INTO @output
                WHERE id = @id;

                SELECT * FROM @output;
            `);


        return result.recordset[0];
    }

    async fecharTicket(id: number, tenantId: number, userId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Check if exists
        const ticket = await this.obterPorId(id, tenantId);

        // Update ticket status to 'fechado'
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('status', sql.VarChar(20), 'fechado')
            .query(`
                DECLARE @output TABLE (
                    id INT,
                    status NVARCHAR(50),
                    data_conclusao DATETIME,
                    atualizado_em DATETIME
                    -- add any other columns you need from INSERTED.*
                );

                UPDATE tickets
                SET
                    status = @status,
                    data_conclusao = GETDATE(),
                    atualizado_em = GETDATE()
                OUTPUT INSERTED.id, INSERTED.status, INSERTED.data_conclusao, INSERTED.atualizado_em INTO @output
                WHERE id = @id;

                SELECT * FROM @output;
            `);


        // Log no histórico
        await pool.request()
            .input('ticket_id', sql.Int, id)
            .input('utilizador_id', sql.Int, userId)
            .input('tipo_acao', sql.NVarChar(50), 'status_alterado')
            .input('valor_anterior', sql.NVarChar(500), ticket.status)
            .input('valor_novo', sql.NVarChar(500), 'fechado')
            .input('descricao', sql.NVarChar(1000), 'Ticket marcado como fechado')
            .input('visivel_cliente', sql.Bit, 1)
            .query(`
                INSERT INTO tickets_historico (ticket_id, utilizador_id, tipo_acao, valor_anterior, valor_novo, descricao, visivel_cliente, criado_em)
                VALUES (@ticket_id, @utilizador_id, @tipo_acao, @valor_anterior, @valor_novo, @descricao, @visivel_cliente, GETDATE())
            `);

        return result.recordset[0];
    }

    async alterarPrioridade(id: number, tenantId: number, prioridade: string, userId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Check if exists
        const ticket = await this.obterPorId(id, tenantId);

        // Validate prioridade
        const prioridadesValidas = ['baixa', 'media', 'alta', 'urgente'];
        if (!prioridadesValidas.includes(prioridade)) {
            throw new Error('Prioridade inválida');
        }

        // Update ticket prioridade
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('prioridade', sql.VarChar(20), prioridade)
            .query(`
                UPDATE tickets
                SET
                    prioridade = @prioridade,
                    atualizado_em = GETDATE()
                OUTPUT INSERTED.*
                WHERE id = @id
            `);

        // Log no histórico
        await pool.request()
            .input('ticket_id', sql.Int, id)
            .input('utilizador_id', sql.Int, userId)
            .input('tipo_acao', sql.NVarChar(50), 'prioridade_alterada')
            .input('valor_anterior', sql.NVarChar(500), ticket.prioridade)
            .input('valor_novo', sql.NVarChar(500), prioridade)
            .input('descricao', sql.NVarChar(1000), `Prioridade alterada de ${ticket.prioridade} para ${prioridade}`)
            .input('visivel_cliente', sql.Bit, 0)
            .query(`
                INSERT INTO tickets_historico (ticket_id, utilizador_id, tipo_acao, valor_anterior, valor_novo, descricao, visivel_cliente, criado_em)
                VALUES (@ticket_id, @utilizador_id, @tipo_acao, @valor_anterior, @valor_novo, @descricao, @visivel_cliente, GETDATE())
            `);

        return result.recordset[0];
    }

    async deletar(id: number, tenantId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Check if exists
        await this.obterPorId(id, tenantId);

        await pool.request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM tickets
                WHERE id = @id
            `);

        return { message: 'Ticket deletado com sucesso' };
    }

    async listarTipos(tenantId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .query(`
                SELECT * FROM tipos_ticket
                WHERE ativo = 1
                ORDER BY nome
            `);

        return result.recordset;
    }

    async obterHistorico(ticketId: number, tenantId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);
        const result = await pool.request()
            .input('ticket_id', sql.Int, ticketId)
            .input('tenant_id', sql.Int, tenantId)
            .query(`
                SELECT
                    h.*,
                    u.username as usuario_nome
                FROM tickets_historico h
                LEFT JOIN utilizadores u ON h.usuario_id = u.id
                WHERE h.ticket_id = @ticket_id
                ORDER BY h.criado_em DESC
            `);

        return result.recordset;
    }

    async obterEstatisticas(tenantId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Get statistics for last 30 days
        const result = await pool.request()
            .query(`
                DECLARE @DataInicio DATE = DATEADD(DAY, -30, GETDATE());

                -- Total tickets
                DECLARE @Total INT = (SELECT COUNT(*) FROM tickets WHERE data_abertura >= @DataInicio);

                -- New tickets (last 7 days)
                DECLARE @Novos INT = (SELECT COUNT(*) FROM tickets WHERE data_abertura >= DATEADD(DAY, -7, GETDATE()));

                -- Open tickets
                DECLARE @Abertos INT = (SELECT COUNT(*) FROM tickets WHERE status IN ('aberto', 'em_progresso') AND data_abertura >= @DataInicio);

                -- Priority distribution
                DECLARE @Baixa INT = (SELECT COUNT(*) FROM tickets WHERE prioridade = 'baixa' AND data_abertura >= @DataInicio);
                DECLARE @Media INT = (SELECT COUNT(*) FROM tickets WHERE prioridade = 'media' AND data_abertura >= @DataInicio);
                DECLARE @Alta INT = (SELECT COUNT(*) FROM tickets WHERE prioridade = 'alta' AND data_abertura >= @DataInicio);
                DECLARE @Urgente INT = (SELECT COUNT(*) FROM tickets WHERE prioridade = 'urgente' AND data_abertura >= @DataInicio);

                -- SLA compliance (tickets with SLA that are not overdue)
                DECLARE @TicketsComSLA INT = (
                    SELECT COUNT(*)
                    FROM tickets t
                    INNER JOIN tipos_ticket tt ON t.tipo_ticket_id = tt.id
                    WHERE t.data_abertura >= @DataInicio
                    AND tt.sla_horas IS NOT NULL
                );

                DECLARE @TicketsSLACumprido INT = (
                    SELECT COUNT(*)
                    FROM tickets t
                    INNER JOIN tipos_ticket tt ON t.tipo_ticket_id = tt.id
                    WHERE t.data_abertura >= @DataInicio
                    AND tt.sla_horas IS NOT NULL
                    AND DATEADD(HOUR, tt.sla_horas, t.data_abertura) >= GETDATE()
                );

                DECLARE @SlaCumprido INT = CASE
                    WHEN @TicketsComSLA = 0 THEN 100
                    ELSE (@TicketsSLACumprido * 100) / @TicketsComSLA
                END;

                SELECT
                    @Total as total,
                    @Novos as novos,
                    @Abertos as abertos,
                    @SlaCumprido as slaCumprido,
                    @Baixa as prioridade_baixa,
                    @Media as prioridade_media,
                    @Alta as prioridade_alta,
                    @Urgente as prioridade_urgente
            `);

        return result.recordset[0];
    }
}
