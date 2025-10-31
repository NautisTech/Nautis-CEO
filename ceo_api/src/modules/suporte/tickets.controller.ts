import {
    Controller,
    Get,
    Post,
    Put,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    Request,
    UseGuards,
    ParseIntPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/guards/permissions.guard';
import { TicketsService } from './tickets.service';
import { CriarTicketDto } from './dto/criar-ticket.dto';

@ApiTags('Tickets')
@Controller('tickets')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Post()
    @RequirePermissions('TICKETS:Criar')
    @ApiOperation({ summary: 'Criar novo ticket' })
    async criar(@Request() req, @Body() dto: CriarTicketDto) {
        return this.ticketsService.criar(req.user.tenantId, dto);
    }

    @Get()
    @RequirePermissions('TICKETS:Listar')
    @ApiOperation({ summary: 'Listar tickets' })
    @ApiQuery({ name: 'tipo_ticket_id', required: false, type: Number })
    @ApiQuery({ name: 'equipamento_id', required: false, type: Number })
    @ApiQuery({ name: 'status', required: false, type: String })
    @ApiQuery({ name: 'prioridade', required: false, type: String })
    @ApiQuery({ name: 'solicitante_id', required: false, type: Number })
    @ApiQuery({ name: 'atribuido_id', required: false, type: Number })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'pageSize', required: false, type: Number })
    async listar(
        @Request() req,
        @Query('tipo_ticket_id') tipo_ticket_id?: number,
        @Query('equipamento_id') equipamento_id?: number,
        @Query('status') status?: string,
        @Query('prioridade') prioridade?: string,
        @Query('solicitante_id') solicitante_id?: number,
        @Query('atribuido_id') atribuido_id?: number,
        @Query('page') page?: number,
        @Query('pageSize') pageSize?: number,
    ) {
        return this.ticketsService.listar(req.user.tenantId, {
            tipo_ticket_id,
            equipamento_id,
            status,
            prioridade,
            solicitante_id,
            atribuido_id,
            page,
            pageSize
        });
    }

    @Get('tipos')
    @RequirePermissions('TICKETS:Listar')
    @ApiOperation({ summary: 'Listar tipos de ticket' })
    async listarTipos(@Request() req) {
        return this.ticketsService.listarTipos(req.user.tenantId);
    }

    @Get('estatisticas')
    @RequirePermissions('TICKETS:Listar')
    @ApiOperation({ summary: 'Obter estatísticas de tickets' })
    async obterEstatisticas(@Request() req: any) {
        return this.ticketsService.obterEstatisticas(req.user.tenantId);
    }

    @Get(':id')
    @RequirePermissions('TICKETS:Visualizar')
    @ApiOperation({ summary: 'Obter ticket por ID' })
    async obterPorId(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.ticketsService.obterPorId(id, req.user.tenantId);
    }

    @Get(':id/historico')
    @RequirePermissions('TICKETS:Visualizar')
    @ApiOperation({ summary: 'Obter histórico do ticket' })
    async obterHistorico(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.ticketsService.obterHistorico(id, req.user.tenantId);
    }

    @Put(':id')
    @RequirePermissions('TICKETS:Editar')
    @ApiOperation({ summary: 'Atualizar ticket' })
    async atualizar(
        @Param('id', ParseIntPipe) id: number,
        @Request() req,
        @Body() dto: CriarTicketDto
    ) {
        return this.ticketsService.atualizar(id, req.user.tenantId, dto);
    }

    @Patch(':id/fechar')
    @RequirePermissions('TICKETS:Editar')
    @ApiOperation({ summary: 'Fechar ticket' })
    async fechar(
        @Param('id', ParseIntPipe) id: number,
        @Request() req
    ) {
        const userId = req.user.sub || req.user.id || 1;
        return this.ticketsService.fecharTicket(id, req.user.tenantId, userId);
    }

    @Patch(':id/prioridade')
    @RequirePermissions('TICKETS:Editar')
    @ApiOperation({ summary: 'Alterar prioridade do ticket' })
    async alterarPrioridade(
        @Param('id', ParseIntPipe) id: number,
        @Body('prioridade') prioridade: string,
        @Request() req
    ) {
        const userId = req.user.sub || req.user.id || 1;
        console.log('User info:', { sub: req.user.sub, id: req.user.id, userId });
        return this.ticketsService.alterarPrioridade(id, req.user.tenantId, prioridade, userId);
    }

    @Get('dashboard/estatisticas')
    @RequirePermissions('TICKETS:Listar')
    @ApiOperation({ summary: 'Obter estatísticas para dashboard de suporte' })
    async obterEstatisticasDashboard(@Request() req: any) {
        return this.ticketsService.obterEstatisticasDashboard(req.user.tenantId);
    }

    @Delete(':id')
    @RequirePermissions('TICKETS:Apagar')
    @ApiOperation({ summary: 'Apagar ticket' })
    async deletar(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.ticketsService.deletar(id, req.user.tenantId);
    }
}
