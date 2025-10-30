import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Patch,
    Body,
    Param,
    Query,
    Request,
    UseGuards,
    ParseIntPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ClientesService } from './clientes.service';
import { CriarClienteDto, AtualizarClienteDto, BloquearClienteDto } from './dto/cliente.dto';

@ApiTags('Clientes')
@Controller('clientes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ClientesController {
    constructor(private readonly clientesService: ClientesService) { }

    @Get()
    @ApiOperation({ summary: 'Listar todos os clientes' })
    @ApiQuery({ name: 'gestor_conta_id', required: false, type: Number })
    @ApiQuery({ name: 'ativo', required: false, type: Boolean })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'pageSize', required: false, type: Number })
    async listar(
        @Request() req,
        @Query('gestor_conta_id') gestorContaId?: number,
        @Query('ativo') ativo?: boolean,
        @Query('page') page?: number,
        @Query('pageSize') pageSize?: number,
    ) {
        return this.clientesService.listar(req.user.tenantId, {
            gestor_conta_id: gestorContaId,
            ativo,
            page,
            pageSize
        });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obter cliente por ID' })
    async obterPorId(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.clientesService.obterPorId(req.user.tenantId, id);
    }

    @Get('empresa/:empresaId')
    @ApiOperation({ summary: 'Obter cliente por empresa_id' })
    async obterPorEmpresaId(@Request() req, @Param('empresaId', ParseIntPipe) empresaId: number) {
        return this.clientesService.obterPorEmpresaId(req.user.tenantId, empresaId);
    }

    @Post()
    @ApiOperation({ summary: 'Criar novo cliente' })
    async criar(@Request() req, @Body() dto: CriarClienteDto) {
        return this.clientesService.criar(req.user.tenantId, dto, req.user.id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar cliente' })
    async atualizar(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AtualizarClienteDto
    ) {
        return this.clientesService.atualizar(req.user.tenantId, id, dto, req.user.id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar cliente (soft delete)' })
    async eliminar(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.clientesService.eliminar(req.user.tenantId, id, req.user.id);
    }

    @Patch(':id/bloquear')
    @ApiOperation({ summary: 'Bloquear cliente' })
    async bloquear(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: BloquearClienteDto
    ) {
        return this.clientesService.bloquear(req.user.tenantId, id, dto.motivo, req.user.id);
    }

    @Patch(':id/desbloquear')
    @ApiOperation({ summary: 'Desbloquear cliente' })
    async desbloquear(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.clientesService.desbloquear(req.user.tenantId, id, req.user.id);
    }

    @Get(':id/estatisticas')
    @ApiOperation({ summary: 'Obter estatísticas do cliente' })
    async obterEstatisticas(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.clientesService.obterEstatisticas(req.user.tenantId, id);
    }
}
