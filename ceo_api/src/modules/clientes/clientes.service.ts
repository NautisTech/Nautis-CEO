import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as sql from 'mssql';
import { DatabaseService } from '../../database/database.service';
import { CriarClienteDto, AtualizarClienteDto } from './dto/cliente.dto';

@Injectable()
export class ClientesService {
    constructor(private readonly databaseService: DatabaseService) { }

    /**
     * Listar todos os clientes
     */
    async listar(tenantId: number, filtros: any = {}) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        let whereClause = 'WHERE c.id > 0';

        if (filtros.gestor_conta_id) {
            whereClause += ` AND c.gestor_conta_id = ${filtros.gestor_conta_id}`;
        }

        if (filtros.ativo !== undefined) {
            whereClause += ` AND c.ativo = ${filtros.ativo ? 1 : 0}`;
        }

        // Sem paginação
        if (!filtros.page || !filtros.pageSize) {
            const result = await pool.request().query(`
                SELECT
                    c.*,
                    e.nome as empresa_nome,
                    e.nome_comercial as empresa_nome_comercial,
                    e.nif as empresa_nif,
                    e.email as empresa_email,
                    e.telefone as empresa_telefone,
                    g.nome_completo as gestor_nome
                FROM clientes c
                LEFT JOIN empresas e ON c.empresa_id = e.id
                LEFT JOIN funcionarios g ON c.gestor_conta_id = g.id
                ${whereClause}
                ORDER BY c.nome_cliente, e.nome
            `);

            return result.recordset;
        }

        // Com paginação
        const page = filtros.page || 1;
        const pageSize = filtros.pageSize || 10;
        const offset = (page - 1) * pageSize;

        const countResult = await pool.request().query(`
            SELECT COUNT(*) as total FROM clientes c ${whereClause}
        `);

        const dataResult = await pool.request()
            .input('offset', sql.Int, offset)
            .input('pageSize', sql.Int, pageSize)
            .query(`
                SELECT
                    c.*,
                    e.nome as empresa_nome,
                    e.nome_comercial as empresa_nome_comercial,
                    e.nif as empresa_nif,
                    e.email as empresa_email,
                    e.telefone as empresa_telefone,
                    g.nome_completo as gestor_nome
                FROM clientes c
                LEFT JOIN empresas e ON c.empresa_id = e.id
                LEFT JOIN funcionarios g ON c.gestor_conta_id = g.id
                ${whereClause}
                ORDER BY c.nome_cliente, e.nome
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
     * Obter cliente por ID
     */
    async obterPorId(tenantId: number, id: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    c.*,
                    e.nome as empresa_nome,
                    e.nome_comercial as empresa_nome_comercial,
                    e.nif as empresa_nif,
                    e.email as empresa_email,
                    e.telefone as empresa_telefone,
                    g.nome_completo as gestor_nome
                FROM clientes c
                LEFT JOIN empresas e ON c.empresa_id = e.id
                LEFT JOIN funcionarios g ON c.gestor_conta_id = g.id
                WHERE c.id = @id
            `);

        if (result.recordset.length === 0) {
            throw new NotFoundException('Cliente não encontrado');
        }

        return result.recordset[0];
    }

    /**
     * Obter cliente por empresa_id
     */
    async obterPorEmpresaId(tenantId: number, empresaId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request()
            .input('empresaId', sql.Int, empresaId)
            .query(`
                SELECT
                    c.*,
                    e.nome as empresa_nome,
                    e.nome_comercial as empresa_nome_comercial,
                    e.nif as empresa_nif,
                    e.email as empresa_email,
                    e.telefone as empresa_telefone,
                    g.nome_completo as gestor_nome
                FROM clientes c
                LEFT JOIN empresas e ON c.empresa_id = e.id
                LEFT JOIN funcionarios g ON c.gestor_conta_id = g.id
                WHERE c.empresa_id = @empresaId
            `);

        if (result.recordset.length === 0) {
            throw new NotFoundException('Cliente não encontrado para esta empresa');
        }

        return result.recordset[0];
    }

    /**
     * Criar novo cliente
     */
    async criar(tenantId: number, dto: CriarClienteDto, userId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Verificar se a empresa existe
        const empresaCheck = await pool.request()
            .input('empresaId', sql.Int, dto.empresa_id)
            .query('SELECT id FROM empresas WHERE id = @empresaId');

        if (empresaCheck.recordset.length === 0) {
            throw new NotFoundException('Empresa não encontrada');
        }

        // Verificar se já existe um cliente para esta empresa
        const clienteCheck = await pool.request()
            .input('empresaId', sql.Int, dto.empresa_id)
            .query('SELECT id FROM clientes WHERE empresa_id = @empresaId');

        if (clienteCheck.recordset.length > 0) {
            throw new BadRequestException('Já existe um cliente associado a esta empresa');
        }

        // Gerar num_cliente se não fornecido
        let numCliente = dto.num_cliente;
        if (!numCliente) {
            const countResult = await pool.request().query('SELECT COUNT(*) as total FROM clientes');
            numCliente = `CLI${String(countResult.recordset[0].total + 1).padStart(6, '0')}`;
        }

        const result = await pool.request()
            .input('empresaId', sql.Int, dto.empresa_id)
            .input('numCliente', sql.NVarChar, numCliente)
            .input('nomeCliente', sql.NVarChar, dto.nome_cliente || null)
            .input('condicoesPagamento', sql.NVarChar, dto.condicoes_pagamento || null)
            .input('metodoPagamentoPreferido', sql.NVarChar, dto.metodo_pagamento_preferido || null)
            .input('limiteCredito', sql.Decimal(15, 2), dto.limite_credito || null)
            .input('descontoComercial', sql.Decimal(5, 2), dto.desconto_comercial || null)
            .input('diaVencimentoPreferido', sql.Int, dto.dia_vencimento_preferido || null)
            .input('pessoaContacto', sql.NVarChar, dto.pessoa_contacto || null)
            .input('cargoContacto', sql.NVarChar, dto.cargo_contacto || null)
            .input('emailContacto', sql.NVarChar, dto.email_contacto || null)
            .input('telefoneContacto', sql.NVarChar, dto.telefone_contacto || null)
            .input('observacoes', sql.NVarChar, dto.observacoes || null)
            .input('origem', sql.NVarChar, dto.origem || null)
            .input('criadoPor', sql.Int, userId)
            .query(`
                INSERT INTO clientes (
                    empresa_id, num_cliente, nome_cliente, condicoes_pagamento, metodo_pagamento_preferido, 
                    limite_credito, desconto_comercial, dia_vencimento_preferido, pessoa_contacto, 
                    cargo_contacto, email_contacto, telefone_contacto, observacoes, origem, 
                    ativo, criado_por, criado_em
                )
                OUTPUT INSERTED.*
                VALUES (
                    @empresaId, @numCliente, @nomeCliente, @condicoesPagamento, @metodoPagamentoPreferido,
                    @limiteCredito, @descontoComercial, @diaVencimentoPreferido, @pessoaContacto, 
                    @cargoContacto, @emailContacto, @telefoneContacto, @observacoes, @origem,
                    1, @criadoPor, GETDATE()
                )
            `);

        return result.recordset[0];
    }

    /**
     * Atualizar cliente
     */
    async atualizar(tenantId: number, id: number, dto: AtualizarClienteDto, userId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Verificar se o cliente existe
        const clienteCheck = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT id FROM clientes WHERE id = @id');

        if (clienteCheck.recordset.length === 0) {
            throw new NotFoundException('Cliente não encontrado');
        }

        // Construir query de atualização dinamicamente
        const updates: string[] = [];
        const request = pool.request();

        if (dto.empresa_id !== undefined) {
            updates.push('empresa_id = @empresaId');
            request.input('empresaId', sql.Int, dto.empresa_id);
        }
        if (dto.num_cliente !== undefined) {
            updates.push('num_cliente = @numCliente');
            request.input('numCliente', sql.NVarChar, dto.num_cliente);
        }
        if (dto.nome_cliente !== undefined) {
            updates.push('nome_cliente = @nomeCliente');
            request.input('nomeCliente', sql.NVarChar, dto.nome_cliente);
        }
        if (dto.condicoes_pagamento !== undefined) {
            updates.push('condicoes_pagamento = @condicoesPagamento');
            request.input('condicoesPagamento', sql.NVarChar, dto.condicoes_pagamento);
        }
        if (dto.metodo_pagamento_preferido !== undefined) {
            updates.push('metodo_pagamento_preferido = @metodoPagamentoPreferido');
            request.input('metodoPagamentoPreferido', sql.NVarChar, dto.metodo_pagamento_preferido);
        }
        if (dto.limite_credito !== undefined) {
            updates.push('limite_credito = @limiteCredito');
            request.input('limiteCredito', sql.Decimal(15, 2), dto.limite_credito);
        }
        if (dto.desconto_comercial !== undefined) {
            updates.push('desconto_comercial = @descontoComercial');
            request.input('descontoComercial', sql.Decimal(5, 2), dto.desconto_comercial);
        }
        if (dto.dia_vencimento_preferido !== undefined) {
            updates.push('dia_vencimento_preferido = @diaVencimentoPreferido');
            request.input('diaVencimentoPreferido', sql.Int, dto.dia_vencimento_preferido);
        }
        if (dto.motivo_bloqueio !== undefined) {
            updates.push('motivo_bloqueio = @motivoBloqueio');
            request.input('motivoBloqueio', sql.NVarChar, dto.motivo_bloqueio);
        }
        if (dto.gestor_conta_id !== undefined) {
            updates.push('gestor_conta_id = @gestorContaId');
            request.input('gestorContaId', sql.Int, dto.gestor_conta_id);
        }
        if (dto.pessoa_contacto !== undefined) {
            updates.push('pessoa_contacto = @pessoaContacto');
            request.input('pessoaContacto', sql.NVarChar, dto.pessoa_contacto);
        }
        if (dto.cargo_contacto !== undefined) {
            updates.push('cargo_contacto = @cargoContacto');
            request.input('cargoContacto', sql.NVarChar, dto.cargo_contacto);
        }
        if (dto.email_contacto !== undefined) {
            updates.push('email_contacto = @emailContacto');
            request.input('emailContacto', sql.NVarChar, dto.email_contacto);
        }
        if (dto.telefone_contacto !== undefined) {
            updates.push('telefone_contacto = @telefoneContacto');
            request.input('telefoneContacto', sql.NVarChar, dto.telefone_contacto);
        }
        if (dto.observacoes !== undefined) {
            updates.push('observacoes = @observacoes');
            request.input('observacoes', sql.NVarChar, dto.observacoes);
        }
        if (dto.origem !== undefined) {
            updates.push('origem = @origem');
            request.input('origem', sql.NVarChar, dto.origem);
        }
        if (dto.ativo !== undefined) {
            updates.push('ativo = @ativo');
            request.input('ativo', sql.Bit, dto.ativo ? 1 : 0);
        }

        if (updates.length === 0) {
            throw new BadRequestException('Nenhum campo para atualizar');
        }

        updates.push('atualizado_por = @atualizadoPor');
        updates.push('atualizado_em = GETDATE()');

        request.input('id', sql.Int, id);
        request.input('atualizadoPor', sql.Int, userId);

        const result = await request.query(`
            UPDATE clientes
            SET ${updates.join(', ')}
            OUTPUT INSERTED.*
            WHERE id = @id
        `);

        return result.recordset[0];
    }

    /**
     * Eliminar cliente (soft delete)
     */
    async eliminar(tenantId: number, id: number, userId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('atualizadoPor', sql.Int, userId)
            .query(`
                UPDATE clientes
                SET ativo = 0, atualizado_por = @atualizadoPor, atualizado_em = GETDATE()
                WHERE id = @id
            `);

        if (result.rowsAffected[0] === 0) {
            throw new NotFoundException('Cliente não encontrado');
        }

        return { message: 'Cliente eliminado com sucesso' };
    }

    /**
     * Bloquear cliente
     */
    async bloquear(tenantId: number, id: number, motivo: string, userId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('motivo', sql.NVarChar, motivo)
            .input('atualizadoPor', sql.Int, userId)
            .query(`
                UPDATE clientes
                SET motivo_bloqueio = @motivo,
                    data_bloqueio = GETDATE(),
                    atualizado_por = @atualizadoPor,
                    atualizado_em = GETDATE()
                OUTPUT INSERTED.*
                WHERE id = @id
            `);

        if (result.recordset.length === 0) {
            throw new NotFoundException('Cliente não encontrado');
        }

        return {
            message: 'Cliente bloqueado com sucesso',
            cliente: result.recordset[0]
        };
    }

    /**
     * Desbloquear cliente
     */
    async desbloquear(tenantId: number, id: number, userId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('atualizadoPor', sql.Int, userId)
            .query(`
                UPDATE clientes
                SET motivo_bloqueio = NULL,
                    data_bloqueio = NULL,
                    atualizado_por = @atualizadoPor,
                    atualizado_em = GETDATE()
                OUTPUT INSERTED.*
                WHERE id = @id
            `);

        if (result.recordset.length === 0) {
            throw new NotFoundException('Cliente não encontrado');
        }

        return {
            message: 'Cliente desbloqueado com sucesso',
            cliente: result.recordset[0]
        };
    }

    /**
     * Obter estatísticas do cliente
     */
    async obterEstatisticas(tenantId: number, id: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    c.total_compras,
                    c.num_encomendas,
                    c.data_ultima_compra as ultima_compra,
                    (SELECT COUNT(*) FROM tickets WHERE cliente_id = @id AND status IN ('aberto', 'em_andamento')) as tickets_abertos,
                    (SELECT COUNT(*) FROM tickets WHERE cliente_id = @id) as tickets_total,
                    CASE WHEN c.num_encomendas > 0 
                        THEN c.total_compras / c.num_encomendas 
                        ELSE 0 
                    END as valor_medio_compra
                FROM clientes c
                WHERE c.id = @id
            `);

        if (result.recordset.length === 0) {
            throw new NotFoundException('Cliente não encontrado');
        }

        return result.recordset[0];
    }
}
