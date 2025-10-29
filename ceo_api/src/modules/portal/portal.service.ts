import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CriarTicketDto } from '../suporte/dto/criar-ticket.dto';
import { CriarTicketPortalDto } from './dto/criar-ticket-portal.dto';
import * as sql from 'mssql';

@Injectable()
export class PortalService {
    constructor(private readonly databaseService: DatabaseService) { }

    /**
     * Obter dashboard com estatísticas do cliente
     */
    async obterDashboard(tenantId: number, userId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Obter cliente_id do utilizador
        const userResult = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`SELECT cliente_id FROM utilizadores WHERE id = @userId`);

        const clienteId = userResult.recordset[0]?.cliente_id;

        if (!clienteId) {
            throw new ForbiddenException('Utilizador não tem cliente associado');
        }

        // Estatísticas - tickets criados pelo utilizador OU do mesmo cliente
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .input('clienteId', sql.Int, clienteId)
            .query(`
                SELECT
                    COUNT(*) as total_tickets,
                    SUM(CASE WHEN status = 'aberto' THEN 1 ELSE 0 END) as tickets_abertos,
                    SUM(CASE WHEN status = 'em_progresso' THEN 1 ELSE 0 END) as tickets_em_progresso,
                    SUM(CASE WHEN status = 'resolvido' THEN 1 ELSE 0 END) as tickets_resolvidos,
                    SUM(CASE WHEN prioridade = 'urgente' THEN 1 ELSE 0 END) as tickets_urgentes,
                    (SELECT COUNT(*) FROM tickets WHERE (solicitante_id = @userId OR cliente_id = @clienteId) AND DATEDIFF(DAY, data_abertura, GETDATE()) <= 7) as tickets_ultimos_7_dias
                FROM tickets
                WHERE solicitante_id = @userId OR cliente_id = @clienteId
            `);

        return {
            estatisticas: result.recordset[0],
            cliente_id: clienteId
        };
    }

    /**
     * Listar tickets do cliente
     */
    async listarTicketsCliente(tenantId: number, userId: number, filtros: any) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Obter cliente_id do utilizador
        const userResult = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`SELECT cliente_id FROM utilizadores WHERE id = @userId`);

        const clienteId = userResult.recordset[0]?.cliente_id;

        // DEBUG LOG
        console.log('🔍 [PORTAL DEBUG] listarTicketsCliente:', {
            userId,
            clienteId,
            userRecord: userResult.recordset[0]
        });

        if (!clienteId) {
            throw new ForbiddenException('Utilizador não tem cliente associado');
        }

        // FILTRAR por tickets criados pelo utilizador OU do mesmo cliente
        let whereClause = `WHERE (t.solicitante_id = ${userId} OR t.cliente_id = ${clienteId})`;

        // DEBUG LOG
        console.log('🔍 [PORTAL DEBUG] whereClause:', whereClause);

        if (filtros.status) {
            whereClause += ` AND t.status = '${filtros.status}'`;
        }
        if (filtros.prioridade) {
            whereClause += ` AND t.prioridade = '${filtros.prioridade}'`;
        }

        // Sem paginação
        if (!filtros.page || !filtros.pageSize) {
            const query = `
                SELECT
                    t.*,
                    t.titulo as assunto,
                    tt.nome as tipo_ticket_nome,
                    tt.sla_horas,
                    atr.nome_completo as atribuido_nome,
                    e.numero_interno as equipamento_numero,
                    m.nome as equipamento_nome,
                    CASE WHEN EXISTS (
                        SELECT 1 FROM intervencoes i
                        WHERE i.ticket_id = t.id
                        AND i.precisa_aprovacao_cliente = 1
                        AND i.aprovacao_cliente = 0
                    ) THEN 1 ELSE 0 END as precisa_aprovacao
                FROM tickets t
                LEFT JOIN tipos_ticket tt ON t.tipo_ticket_id = tt.id
                LEFT JOIN funcionarios atr ON t.atribuido_id = atr.id
                LEFT JOIN equipamentos e ON t.equipamento_id = e.id
                LEFT JOIN modelos_equipamento m ON e.modelo_id = m.id
                ${whereClause}
                ORDER BY t.criado_em DESC
            `;

            // DEBUG LOG
            console.log('🔍 [PORTAL DEBUG] Query SQL:', query);

            const result = await pool.request().query(query);

            // DEBUG LOG
            console.log('🔍 [PORTAL DEBUG] Result count:', result.recordset.length);
            console.log('🔍 [PORTAL DEBUG] First ticket:', result.recordset[0]);

            return result.recordset;
        }

        // Com paginação
        const page = filtros.page || 1;
        const pageSize = filtros.pageSize || 10;
        const offset = (page - 1) * pageSize;

        const countResult = await pool.request().query(`
            SELECT COUNT(*) as total FROM tickets t ${whereClause}
        `);

        const dataResult = await pool.request()
            .input('offset', sql.Int, offset)
            .input('pageSize', sql.Int, pageSize)
            .query(`
                SELECT
                    t.*,
                    t.titulo as assunto,
                    tt.nome as tipo_ticket_nome,
                    tt.sla_horas,
                    atr.nome_completo as atribuido_nome,
                    e.numero_interno as equipamento_numero,
                    m.nome as equipamento_nome,
                    CASE WHEN EXISTS (
                        SELECT 1 FROM intervencoes i
                        WHERE i.ticket_id = t.id
                        AND i.precisa_aprovacao_cliente = 1
                        AND i.aprovacao_cliente = 0
                    ) THEN 1 ELSE 0 END as precisa_aprovacao
                FROM tickets t
                LEFT JOIN tipos_ticket tt ON t.tipo_ticket_id = tt.id
                LEFT JOIN funcionarios atr ON t.atribuido_id = atr.id
                LEFT JOIN equipamentos e ON t.equipamento_id = e.id
                LEFT JOIN modelos_equipamento m ON e.modelo_id = m.id
                ${whereClause}
                ORDER BY t.criado_em DESC
                OFFSET @offset ROWS
                FETCH NEXT @pageSize ROWS ONLY
            `);

        return {
            data: dataResult.recordset,
            total: countResult.recordset[0].total,
            page,
            pageSize,
            totalPages: Math.ceil(countResult.recordset[0].total / pageSize)
        };
    }

    /**
     * Obter detalhes de um ticket (se pertencer ao cliente)
     */
    async obterTicketCliente(tenantId: number, userId: number, ticketId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Obter cliente_id do utilizador
        const userResult = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`SELECT cliente_id FROM utilizadores WHERE id = @userId`);

        const clienteId = userResult.recordset[0]?.cliente_id;

        if (!clienteId) {
            throw new ForbiddenException('Utilizador não tem cliente associado');
        }

        const result = await pool.request()
            .input('ticketId', sql.Int, ticketId)
            .input('userId', sql.Int, userId)
            .input('clienteId', sql.Int, clienteId)
            .query(`
                SELECT
                    t.*,
                    t.titulo as assunto,
                    tt.nome as tipo_ticket_nome,
                    tt.sla_horas,
                    sol.username as solicitante_nome,
                    sol.email as solicitante_email,
                    atr.nome_completo as atribuido_nome,
                    e.numero_interno as equipamento_numero,
                    m.nome as equipamento_nome
                FROM tickets t
                LEFT JOIN tipos_ticket tt ON t.tipo_ticket_id = tt.id
                LEFT JOIN utilizadores sol ON t.solicitante_id = sol.id
                LEFT JOIN funcionarios atr ON t.atribuido_id = atr.id
                LEFT JOIN equipamentos e ON t.equipamento_id = e.id
                LEFT JOIN modelos_equipamento m ON e.modelo_id = m.id
                WHERE t.id = @ticketId AND (t.solicitante_id = @userId OR t.cliente_id = @clienteId)
            `);

        if (result.recordset.length === 0) {
            throw new NotFoundException('Ticket não encontrado ou não pertence a este cliente');
        }

        return result.recordset[0];
    }

    /**
     * Criar ticket (cliente só pode criar para si mesmo)
     */
    async criarTicketCliente(tenantId: number, userId: number, dto: CriarTicketPortalDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Obter cliente_id do utilizador
        const userResult = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`SELECT cliente_id FROM utilizadores WHERE id = @userId`);

        const clienteId = userResult.recordset[0]?.cliente_id;

        if (!clienteId) {
            throw new ForbiddenException('Utilizador não tem cliente associado');
        }

        // Gerar número do ticket
        const countResult = await pool.request().query(`
            SELECT COUNT(*) as total FROM tickets
        `);
        const numero_ticket = `TKT${String(countResult.recordset[0].total + 1).padStart(6, '0')}`;

        const result = await pool.request()
            .input('cliente_id', sql.Int, clienteId)
            .input('numero_ticket', sql.VarChar(50), numero_ticket)
            .input('tipo_ticket_id', sql.Int, dto.tipo_ticket_id)
            .input('titulo', sql.VarChar(200), dto.assunto) // assunto do portal → titulo
            .input('descricao', sql.Text, dto.descricao)
            .input('prioridade', sql.VarChar(20), dto.prioridade)
            .input('status', sql.VarChar(20), 'aberto') // Sempre aberto para cliente
            .input('solicitante_id', sql.Int, userId) // Forçar utilizador logado como solicitante
            .input('localizacao', sql.VarChar(200), dto.localizacao || null)
            .query(`
                DECLARE @output TABLE (
                    id INT,
                    cliente_id INT,
                    numero_ticket NVARCHAR(50),
                    tipo_ticket_id INT,
                    titulo NVARCHAR(200),
                    descricao NVARCHAR(MAX),
                    prioridade NVARCHAR(20),
                    status NVARCHAR(20),
                    solicitante_id INT,
                    localizacao NVARCHAR(200),
                    data_abertura DATETIME,
                    criado_em DATETIME
                );

                INSERT INTO tickets (
                    cliente_id, numero_ticket, tipo_ticket_id,
                    titulo, descricao, prioridade, status, solicitante_id,
                    localizacao, data_abertura, criado_em
                )
                OUTPUT INSERTED.id,
                        INSERTED.cliente_id,
                        INSERTED.numero_ticket,
                        INSERTED.tipo_ticket_id,
                        INSERTED.titulo,
                        INSERTED.descricao,
                        INSERTED.prioridade,
                        INSERTED.status,
                        INSERTED.solicitante_id,
                        INSERTED.localizacao,
                        INSERTED.data_abertura,
                        INSERTED.criado_em
                INTO @output
                VALUES (
                    @cliente_id, @numero_ticket, @tipo_ticket_id,
                    @titulo, @descricao, @prioridade, @status, @solicitante_id,
                    @localizacao, GETDATE(), GETDATE()
                );

                SELECT * FROM @output;
            `);

        return result.recordset[0];
    }

    /**
     * Atualizar ticket (cliente só pode atualizar alguns campos)
     */
    async atualizarTicketCliente(tenantId: number, userId: number, ticketId: number, dto: Partial<CriarTicketDto>) {
        // Verificar se o ticket pertence ao cliente (já valida cliente_id)
        await this.obterTicketCliente(tenantId, userId, ticketId);

        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Obter cliente_id do utilizador
        const userResult = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`SELECT cliente_id FROM utilizadores WHERE id = @userId`);

        const clienteId = userResult.recordset[0]?.cliente_id;

        const updates: string[] = [];
        const request = pool.request()
            .input('ticketId', sql.Int, ticketId)
            .input('clienteId', sql.Int, clienteId);

        // Cliente só pode atualizar estes campos
        if (dto.descricao !== undefined) {
            updates.push('descricao = @descricao');
            request.input('descricao', sql.Text, dto.descricao);
        }
        if (dto.localizacao !== undefined) {
            updates.push('localizacao = @localizacao');
            request.input('localizacao', sql.VarChar(200), dto.localizacao);
        }

        if (updates.length === 0) {
            return { message: 'Nenhum campo para atualizar' };
        }

        updates.push('atualizado_em = GETDATE()');

        // Adicionar userId ao request
        request.input('userId', sql.Int, userId);

        await request.query(`
            UPDATE tickets
            SET ${updates.join(', ')}
            WHERE id = @ticketId AND (solicitante_id = @userId OR cliente_id = @clienteId)
        `);

        return this.obterTicketCliente(tenantId, userId, ticketId);
    }

    /**
     * Obter histórico do ticket
     */
    async obterHistoricoTicket(tenantId: number, userId: number, ticketId: number) {
        // Verificar se o ticket pertence ao cliente
        await this.obterTicketCliente(tenantId, userId, ticketId);

        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request()
            .input('ticketId', sql.Int, ticketId)
            .query(`
                SELECT
                    h.*,
                    u.username as usuario_nome
                FROM tickets_historico h
                LEFT JOIN utilizadores u ON h.usuario_id = u.id
                WHERE h.ticket_id = @ticketId
                ORDER BY h.criado_em DESC
            `);

        return result.recordset;
    }

    /**
     * Listar intervenções de um ticket
     */
    async listarIntervencoesTicket(tenantId: number, userId: number, ticketId: number) {
        // Verificar se o ticket pertence ao cliente
        await this.obterTicketCliente(tenantId, userId, ticketId);

        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request()
            .input('ticketId', sql.Int, ticketId)
            .query(`
                SELECT
                    i.*,
                    t.nome_completo as tecnico_nome
                FROM intervencoes i
                LEFT JOIN funcionarios t ON i.tecnico_id = t.id
                WHERE i.ticket_id = @ticketId
                ORDER BY i.criado_em DESC
            `);

        // Para cada intervenção, buscar custos e anexos
        const intervencoes = await Promise.all(
            result.recordset.map(async (intervencao) => {
                // Buscar custos
                const custosResult = await pool.request()
                    .input('intervencaoId', sql.Int, intervencao.id)
                    .query(`
                        SELECT
                            ic.id,
                            ic.descricao,
                            ic.codigo,
                            ic.quantidade,
                            ic.valor_unitario,
                            ic.valor_total
                        FROM intervencoes_custos ic
                        WHERE ic.intervencao_id = @intervencaoId
                        ORDER BY ic.criado_em DESC
                    `);

                // Buscar anexos
                const anexosResult = await pool.request()
                    .input('intervencaoId', sql.Int, intervencao.id)
                    .query(`
                        SELECT
                            ia.id,
                            ia.anexo_id,
                            a.nome,
                            a.nome_original,
                            a.caminho,
                            a.tipo,
                            a.tamanho_bytes as tamanho,
                            ia.descricao,
                            ia.criado_em
                        FROM intervencoes_anexos ia
                        LEFT JOIN anexos a ON ia.anexo_id = a.id
                        WHERE ia.intervencao_id = @intervencaoId
                        ORDER BY ia.criado_em DESC
                    `);

                return {
                    ...intervencao,
                    custos: custosResult.recordset,
                    anexos: anexosResult.recordset
                };
            })
        );

        return intervencoes;
    }

    /**
     * Obter detalhes de uma intervenção
     */
    async obterIntervencao(tenantId: number, userId: number, intervencaoId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Obter cliente_id do utilizador
        const userResult = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`SELECT cliente_id FROM utilizadores WHERE id = @userId`);

        const clienteId = userResult.recordset[0]?.cliente_id;

        if (!clienteId) {
            throw new ForbiddenException('Utilizador não tem cliente associado');
        }

        const result = await pool.request()
            .input('intervencaoId', sql.Int, intervencaoId)
            .input('userId', sql.Int, userId)
            .input('clienteId', sql.Int, clienteId)
            .query(`
                SELECT
                    i.*,
                    t.nome_completo as tecnico_nome
                FROM intervencoes i
                LEFT JOIN funcionarios t ON i.tecnico_id = t.id
                INNER JOIN tickets tk ON i.ticket_id = tk.id
                WHERE i.id = @intervencaoId AND (tk.solicitante_id = @userId OR tk.cliente_id = @clienteId)
            `);

        if (result.recordset.length === 0) {
            throw new NotFoundException('Intervenção não encontrada');
        }

        return result.recordset[0];
    }

    /**
     * Aprovar intervenção (cliente)
     */
    async aprovarIntervencao(tenantId: number, userId: number, intervencaoId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Obter cliente_id do utilizador
        const userResult = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`SELECT cliente_id FROM utilizadores WHERE id = @userId`);

        const clienteId = userResult.recordset[0]?.cliente_id;

        if (!clienteId) {
            throw new ForbiddenException('Utilizador não tem cliente associado');
        }

        // Verificar se a intervenção pertence ao cliente
        const intervencaoResult = await pool.request()
            .input('intervencaoId', sql.Int, intervencaoId)
            .input('clienteId', sql.Int, clienteId)
            .query(`
                SELECT i.* FROM intervencoes i
                INNER JOIN tickets t ON i.ticket_id = t.id
                WHERE i.id = @intervencaoId
                AND t.cliente_id = @clienteId
            `);

        if (intervencaoResult.recordset.length === 0) {
            throw new NotFoundException('Intervenção não encontrada ou não pertence a este cliente');
        }

        const intervencao = intervencaoResult.recordset[0];

        // Verificar se precisa de aprovação
        if (!intervencao.precisa_aprovacao_cliente && intervencao.precisa_aprovacao_cliente !== 1) {
            throw new ForbiddenException('Esta intervenção não requer aprovação do cliente');
        }

        // Verificar se já foi aprovada
        if (intervencao.aprovacao_cliente === 1 || intervencao.aprovacao_cliente === true) {
            throw new ForbiddenException('Esta intervenção já foi aprovada');
        }

        // Aprovar a intervenção
        await pool.request()
            .input('intervencaoId', sql.Int, intervencaoId)
            .query(`
                UPDATE intervencoes
                SET aprovacao_cliente = 1,
                    data_aprovacao = GETDATE(),
                    atualizado_em = GETDATE()
                WHERE id = @intervencaoId
            `);

        return { message: 'Intervenção aprovada com sucesso' };
    }

    /**
     * Rejeitar intervenção (cliente)
     */
    async rejeitarIntervencao(tenantId: number, userId: number, intervencaoId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Obter cliente_id do utilizador
        const userResult = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`SELECT cliente_id FROM utilizadores WHERE id = @userId`);

        const clienteId = userResult.recordset[0]?.cliente_id;

        if (!clienteId) {
            throw new ForbiddenException('Utilizador não tem cliente associado');
        }

        // Verificar se a intervenção pertence ao cliente
        const intervencaoResult = await pool.request()
            .input('intervencaoId', sql.Int, intervencaoId)
            .input('clienteId', sql.Int, clienteId)
            .query(`
                SELECT i.* FROM intervencoes i
                INNER JOIN tickets t ON i.ticket_id = t.id
                WHERE i.id = @intervencaoId
                AND t.cliente_id = @clienteId
            `);

        if (intervencaoResult.recordset.length === 0) {
            throw new NotFoundException('Intervenção não encontrada ou não pertence a este cliente');
        }

        const intervencao = intervencaoResult.recordset[0];

        // Verificar se precisa de aprovação
        if (!intervencao.precisa_aprovacao_cliente && intervencao.precisa_aprovacao_cliente !== 1) {
            throw new ForbiddenException('Esta intervenção não requer aprovação do cliente');
        }

        // Rejeitar a intervenção (definir aprovacao_cliente como 0 e manter data_aprovacao como NULL)
        await pool.request()
            .input('intervencaoId', sql.Int, intervencaoId)
            .query(`
                UPDATE intervencoes
                SET aprovacao_cliente = 0,
                    data_aprovacao = NULL,
                    atualizado_em = GETDATE()
                WHERE id = @intervencaoId
            `);

        return { message: 'Intervenção rejeitada' };
    }

    /**
     * Listar anexos visíveis para o cliente
     */
    async listarAnexosCliente(tenantId: number, userId: number, filtros: any) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        let whereClause = 'WHERE visivel_cliente = 1';

        if (filtros.entidadeTipo) {
            whereClause += ` AND entidade_tipo = '${filtros.entidadeTipo}'`;
        }
        if (filtros.entidadeId) {
            whereClause += ` AND entidade_id = ${filtros.entidadeId}`;
        }

        const result = await pool.request().query(`
            SELECT * FROM anexos
            ${whereClause}
            ORDER BY criado_em DESC
        `);

        return result.recordset;
    }

    /**
     * Download de anexo (se visível)
     */
    async downloadAnexo(tenantId: number, userId: number, anexoId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request()
            .input('anexoId', sql.Int, anexoId)
            .query(`
                SELECT * FROM anexos
                WHERE id = @anexoId AND visivel_cliente = 1
            `);

        if (result.recordset.length === 0) {
            throw new NotFoundException('Anexo não encontrado ou não visível');
        }

        return result.recordset[0];
    }

    /**
     * Obter perfil do cliente
     */
    async obterPerfilCliente(tenantId: number, userId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT
                    u.*,
                    c.*,
                    e.nome as empresa_nome,
                    e.nif,
                    e.email as empresa_email,
                    e.telefone as empresa_telefone,
                    e.morada_fiscal,
                    e.codigo_postal,
                    e.localidade,
                    e.logo_url
                FROM utilizadores u
                LEFT JOIN clientes c ON u.cliente_id = c.id
                LEFT JOIN empresas e ON c.empresa_id = e.id
                WHERE u.id = @userId
            `);

        return result.recordset[0];
    }

    /**
     * Atualizar perfil (campos limitados)
     */
    async atualizarPerfilCliente(tenantId: number, userId: number, dto: any) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Cliente só pode atualizar email e telefone do utilizador
        const updates: string[] = [];
        const request = pool.request().input('userId', sql.Int, userId);

        if (dto.email) {
            updates.push('email = @email');
            request.input('email', sql.NVarChar(255), dto.email);
        }

        if (updates.length > 0) {
            updates.push('atualizado_em = GETDATE()');

            await request.query(`
                UPDATE utilizadores
                SET ${updates.join(', ')}
                WHERE id = @userId
            `);
        }

        return this.obterPerfilCliente(tenantId, userId);
    }

    /**
     * Listar notificações (stub - implementar futuramente)
     */
    async listarNotificacoes(tenantId: number, userId: number, filtros: any) {
        return [];
    }

    /**
     * Marcar notificação como lida (stub - implementar futuramente)
     */
    async marcarNotificacaoLida(tenantId: number, userId: number, notificacaoId: number) {
        return { success: true };
    }
}
