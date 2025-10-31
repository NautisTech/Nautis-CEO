import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    Query,
    Request,
    UseGuards,
    ParseIntPipe,
    HttpStatus,
    HttpCode,
    BadRequestException,
    NotFoundException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard, Public } from '../../common/guards/jwt-auth.guard';
import { ClienteGuard } from '../../common/guards/cliente.guard';
import { DatabaseService } from '../../database/database.service';
import { PortalService } from './portal.service';
import { CriarTicketDto } from '../suporte/dto/criar-ticket.dto';
import { CriarTicketPortalDto } from './dto/criar-ticket-portal.dto';
import * as sql from 'mssql';

/**
 * Controller para Portal de Cliente
 * Endpoints exclusivos para utilizadores externos (clientes)
 * Todos os endpoints requerem autenticação JWT + tipo 'cliente'
 */
@ApiTags('Portal Cliente')
@Controller('portal')
export class PortalController {
    constructor(private readonly portalService: PortalService) { }

    // ==================== DASHBOARD ====================

    @Get('dashboard')
    @ApiOperation({ summary: 'Obter dashboard do cliente (estatísticas)' })
    @UseGuards(JwtAuthGuard, ClienteGuard)
    @ApiBearerAuth()
    async getDashboard(@Request() req) {
        return this.portalService.obterDashboard(req.user.tenantId, req.user.id);
    }

    // ==================== TICKETS ====================

    @Get('tickets')
    @ApiOperation({ summary: 'Listar tickets do cliente logado' })
    @ApiQuery({ name: 'status', required: false, type: String })
    @ApiQuery({ name: 'prioridade', required: false, type: String })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'pageSize', required: false, type: Number })
    @UseGuards(JwtAuthGuard, ClienteGuard)
    @ApiBearerAuth()
    async listarMeusTickets(
        @Request() req,
        @Query('status') status?: string,
        @Query('prioridade') prioridade?: string,
        @Query('page') page?: number,
        @Query('pageSize') pageSize?: number,
    ) {
        return this.portalService.listarTicketsCliente(
            req.user.tenantId,
            req.user.id,
            { status, prioridade, page, pageSize }
        );
    }

    @Get('tickets/:id')
    @ApiOperation({ summary: 'Obter detalhes de um ticket do cliente' })
    @UseGuards(JwtAuthGuard, ClienteGuard)
    @ApiBearerAuth()
    async obterTicket(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.portalService.obterTicketCliente(req.user.tenantId, req.user.id, id);
    }

    @Post('tickets')
    @ApiOperation({ summary: 'Criar novo ticket' })
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard, ClienteGuard)
    @ApiBearerAuth()
    async criarTicket(@Request() req, @Body() dto: CriarTicketPortalDto) {
        return this.portalService.criarTicketCliente(req.user.tenantId, req.user.id, dto);
    }

    @Put('tickets/:id')
    @ApiOperation({ summary: 'Atualizar ticket do cliente (apenas alguns campos)' })
    @UseGuards(JwtAuthGuard, ClienteGuard)
    @ApiBearerAuth()
    async atualizarTicket(
        @Param('id', ParseIntPipe) id: number,
        @Request() req,
        @Body() dto: Partial<CriarTicketDto>
    ) {
        return this.portalService.atualizarTicketCliente(req.user.tenantId, req.user.id, id, dto);
    }

    @Get('tickets/:id/historico')
    @ApiOperation({ summary: 'Obter histórico do ticket' })
    @UseGuards(JwtAuthGuard, ClienteGuard)
    @ApiBearerAuth()
    async obterHistoricoTicket(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.portalService.obterHistoricoTicket(req.user.tenantId, req.user.id, id);
    }

    // ==================== INTERVENÇÕES ====================

    @Get('tickets/:ticketId/intervencoes')
    @ApiOperation({ summary: 'Listar intervenções de um ticket do cliente' })
    @UseGuards(JwtAuthGuard, ClienteGuard)
    @ApiBearerAuth()
    async listarIntervencoes(@Param('ticketId', ParseIntPipe) ticketId: number, @Request() req) {
        return this.portalService.listarIntervencoesTicket(req.user.tenantId, req.user.id, ticketId);
    }

    @Get('intervencoes/:id')
    @ApiOperation({ summary: 'Obter detalhes de uma intervenção' })
    @UseGuards(JwtAuthGuard, ClienteGuard)
    @ApiBearerAuth()
    async obterIntervencao(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.portalService.obterIntervencao(req.user.tenantId, req.user.id, id);
    }

    @Put('intervencoes/:id/aprovar')
    @ApiOperation({ summary: 'Aprovar intervenção (cliente)' })
    @UseGuards(JwtAuthGuard, ClienteGuard)
    @ApiBearerAuth()
    async aprovarIntervencao(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.portalService.aprovarIntervencao(req.user.tenantId, req.user.id, id);
    }

    @Put('intervencoes/:id/rejeitar')
    @ApiOperation({ summary: 'Rejeitar intervenção (cliente)' })
    @UseGuards(JwtAuthGuard, ClienteGuard)
    @ApiBearerAuth()
    async rejeitarIntervencao(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.portalService.rejeitarIntervencao(req.user.tenantId, req.user.id, id);
    }

    // ==================== ANEXOS ====================

    @Get('anexos')
    @ApiOperation({ summary: 'Listar anexos visíveis para o cliente' })
    @ApiQuery({ name: 'entidade_tipo', required: false, type: String, description: 'ticket, intervencao' })
    @ApiQuery({ name: 'entidade_id', required: false, type: Number })
    @UseGuards(JwtAuthGuard, ClienteGuard)
    @ApiBearerAuth()
    async listarAnexos(
        @Request() req,
        @Query('entidade_tipo') entidadeTipo?: string,
        @Query('entidade_id') entidadeId?: number,
    ) {
        return this.portalService.listarAnexosCliente(req.user.tenantId, req.user.id, {
            entidadeTipo,
            entidadeId
        });
    }

    @Get('anexos/:id/download')
    @ApiOperation({ summary: 'Download de anexo (se visível para cliente)' })
    @UseGuards(JwtAuthGuard, ClienteGuard)
    @ApiBearerAuth()
    async downloadAnexo(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.portalService.downloadAnexo(req.user.tenantId, req.user.id, id);
    }

    // ==================== PERFIL ====================

    @Get('perfil')
    @ApiOperation({ summary: 'Obter dados do perfil do cliente' })
    @UseGuards(JwtAuthGuard, ClienteGuard)
    @ApiBearerAuth()
    async obterPerfil(@Request() req) {
        return this.portalService.obterPerfilCliente(req.user.tenantId, req.user.id);
    }

    @Put('perfil')
    @ApiOperation({ summary: 'Atualizar dados do perfil (limitado)' })
    @UseGuards(JwtAuthGuard, ClienteGuard)
    @ApiBearerAuth()
    async atualizarPerfil(@Request() req, @Body() dto: any) {
        return this.portalService.atualizarPerfilCliente(req.user.tenantId, req.user.id, dto);
    }

    // ==================== NOTIFICAÇÕES ====================

    @Get('notificacoes')
    @ApiOperation({ summary: 'Listar notificações do cliente' })
    @ApiQuery({ name: 'lidas', required: false, type: Boolean })
    @UseGuards(JwtAuthGuard, ClienteGuard)
    @ApiBearerAuth()
    async listarNotificacoes(
        @Request() req,
        @Query('lidas') lidas?: boolean,
    ) {
        return this.portalService.listarNotificacoes(req.user.tenantId, req.user.id, { lidas });
    }

    @Put('notificacoes/:id/marcar-lida')
    @ApiOperation({ summary: 'Marcar notificação como lida' })
    @UseGuards(JwtAuthGuard, ClienteGuard)
    @ApiBearerAuth()
    async marcarNotificacaoLida(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.portalService.marcarNotificacaoLida(req.user.tenantId, req.user.id, id);
    }

    // ==================== CONTEÚDOS / NOTÍCIAS ====================

    @Get('noticias')
    @ApiOperation({ summary: 'Listar notícias internas para o portal (campo personalizado "interno" = true)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Número de notícias a retornar (padrão: 10)' })
    @UseGuards(JwtAuthGuard, ClienteGuard)
    @ApiBearerAuth()
    async listarNoticias(
        @Request() req,
        @Query('limit') limit?: number,
    ) {
        return this.portalService.listarNoticiasInternas(req.user.tenantId, limit || 10);
    }

    // ==================== TRANSAÇÕES / CONTA CORRENTE ====================

    @Get('conta-corrente')
    @ApiOperation({ summary: 'Obter resumo da conta corrente do cliente (saldo e estatísticas)' })
    @UseGuards(JwtAuthGuard, ClienteGuard)
    @ApiBearerAuth()
    async obterContaCorrente(@Request() req) {
        return this.portalService.obterContaCorrente(req.user.tenantId, req.user.id);
    }

    @Get('transacoes')
    @ApiOperation({ summary: 'Listar transações do cliente' })
    @ApiQuery({ name: 'tipo_transacao', required: false, type: String })
    @ApiQuery({ name: 'estado', required: false, type: String })
    @ApiQuery({ name: 'data_inicio', required: false, type: String, description: 'YYYY-MM-DD' })
    @ApiQuery({ name: 'data_fim', required: false, type: String, description: 'YYYY-MM-DD' })
    @ApiQuery({ name: 'item_tipo', required: false, type: String })
    @ApiQuery({ name: 'item_id', required: false, type: Number })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'pageSize', required: false, type: Number })
    @UseGuards(JwtAuthGuard, ClienteGuard)
    @ApiBearerAuth()
    async listarTransacoes(
        @Request() req,
        @Query('tipo_transacao') tipo_transacao?: string,
        @Query('estado') estado?: string,
        @Query('data_inicio') data_inicio?: string,
        @Query('data_fim') data_fim?: string,
        @Query('item_tipo') item_tipo?: string,
        @Query('item_id') item_id?: number,
        @Query('page') page?: number,
        @Query('pageSize') pageSize?: number,
    ) {
        return this.portalService.listarTransacoesCliente(
            req.user.tenantId,
            req.user.id,
            { tipo_transacao, estado, data_inicio, data_fim, item_tipo, item_id, page, pageSize }
        );
    }

    @Get('transacoes/:id')
    @ApiOperation({ summary: 'Obter detalhes de uma transação específica' })
    @UseGuards(JwtAuthGuard, ClienteGuard)
    @ApiBearerAuth()
    async obterTransacao(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.portalService.obterTransacaoCliente(req.user.tenantId, req.user.id, id);
    }

    @Public()
    @Get('codigo/:codigo')
    @ApiOperation({ summary: 'Obter ticket por código único (público)' })
    @ApiQuery({ name: 'tenant', required: true, type: String })
    async obterPorCodigo(@Param('codigo') codigo: string, @Query('tenant') tenant: string) {
        return this.portalService.obterPorCodigo(tenant, codigo);
    }
}
