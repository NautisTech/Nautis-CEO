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
    HttpCode
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ClienteGuard } from '../../common/guards/cliente.guard';
import { PortalService } from './portal.service';
import { CriarTicketDto } from '../suporte/dto/criar-ticket.dto';
import { CriarTicketPortalDto } from './dto/criar-ticket-portal.dto';

/**
 * Controller para Portal de Cliente
 * Endpoints exclusivos para utilizadores externos (clientes)
 * Todos os endpoints requerem autenticação JWT + tipo 'cliente'
 */
@ApiTags('Portal Cliente')
@Controller('portal')
@UseGuards(JwtAuthGuard, ClienteGuard)
@ApiBearerAuth()
export class PortalController {
    constructor(private readonly portalService: PortalService) { }

    // ==================== DASHBOARD ====================

    @Get('dashboard')
    @ApiOperation({ summary: 'Obter dashboard do cliente (estatísticas)' })
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
    async obterTicket(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.portalService.obterTicketCliente(req.user.tenantId, req.user.id, id);
    }

    @Post('tickets')
    @ApiOperation({ summary: 'Criar novo ticket' })
    @HttpCode(HttpStatus.CREATED)
    async criarTicket(@Request() req, @Body() dto: CriarTicketPortalDto) {
        return this.portalService.criarTicketCliente(req.user.tenantId, req.user.id, dto);
    }

    @Put('tickets/:id')
    @ApiOperation({ summary: 'Atualizar ticket do cliente (apenas alguns campos)' })
    async atualizarTicket(
        @Param('id', ParseIntPipe) id: number,
        @Request() req,
        @Body() dto: Partial<CriarTicketDto>
    ) {
        return this.portalService.atualizarTicketCliente(req.user.tenantId, req.user.id, id, dto);
    }

    @Get('tickets/:id/historico')
    @ApiOperation({ summary: 'Obter histórico do ticket' })
    async obterHistoricoTicket(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.portalService.obterHistoricoTicket(req.user.tenantId, req.user.id, id);
    }

    // ==================== INTERVENÇÕES ====================

    @Get('tickets/:ticketId/intervencoes')
    @ApiOperation({ summary: 'Listar intervenções de um ticket do cliente' })
    async listarIntervencoes(@Param('ticketId', ParseIntPipe) ticketId: number, @Request() req) {
        return this.portalService.listarIntervencoesTicket(req.user.tenantId, req.user.id, ticketId);
    }

    @Get('intervencoes/:id')
    @ApiOperation({ summary: 'Obter detalhes de uma intervenção' })
    async obterIntervencao(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.portalService.obterIntervencao(req.user.tenantId, req.user.id, id);
    }

    @Put('intervencoes/:id/aprovar')
    @ApiOperation({ summary: 'Aprovar intervenção (cliente)' })
    async aprovarIntervencao(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.portalService.aprovarIntervencao(req.user.tenantId, req.user.id, id);
    }

    @Put('intervencoes/:id/rejeitar')
    @ApiOperation({ summary: 'Rejeitar intervenção (cliente)' })
    async rejeitarIntervencao(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.portalService.rejeitarIntervencao(req.user.tenantId, req.user.id, id);
    }

    // ==================== ANEXOS ====================

    @Get('anexos')
    @ApiOperation({ summary: 'Listar anexos visíveis para o cliente' })
    @ApiQuery({ name: 'entidade_tipo', required: false, type: String, description: 'ticket, intervencao' })
    @ApiQuery({ name: 'entidade_id', required: false, type: Number })
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
    async downloadAnexo(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.portalService.downloadAnexo(req.user.tenantId, req.user.id, id);
    }

    // ==================== PERFIL ====================

    @Get('perfil')
    @ApiOperation({ summary: 'Obter dados do perfil do cliente' })
    async obterPerfil(@Request() req) {
        return this.portalService.obterPerfilCliente(req.user.tenantId, req.user.id);
    }

    @Put('perfil')
    @ApiOperation({ summary: 'Atualizar dados do perfil (limitado)' })
    async atualizarPerfil(@Request() req, @Body() dto: any) {
        return this.portalService.atualizarPerfilCliente(req.user.tenantId, req.user.id, dto);
    }

    // ==================== NOTIFICAÇÕES ====================

    @Get('notificacoes')
    @ApiOperation({ summary: 'Listar notificações do cliente' })
    @ApiQuery({ name: 'lidas', required: false, type: Boolean })
    async listarNotificacoes(
        @Request() req,
        @Query('lidas') lidas?: boolean,
    ) {
        return this.portalService.listarNotificacoes(req.user.tenantId, req.user.id, { lidas });
    }

    @Put('notificacoes/:id/marcar-lida')
    @ApiOperation({ summary: 'Marcar notificação como lida' })
    async marcarNotificacaoLida(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.portalService.marcarNotificacaoLida(req.user.tenantId, req.user.id, id);
    }
}
