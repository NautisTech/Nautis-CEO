import {
    Controller,
    Get,
    Post,
    Put,
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
import { IntervencoesService } from './intervencoes.service';
import { CriarIntervencaoDto } from './dto/criar-intervencao.dto';

@ApiTags('Intervenções')
@Controller('intervencoes')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class IntervencoesController {
    constructor(private readonly intervencoesService: IntervencoesService) { }

    @Post()
    @RequirePermissions('INTERVENCOES:Criar')
    @ApiOperation({ summary: 'Criar nova intervenção' })
    async criar(@Request() req, @Body() dto: CriarIntervencaoDto) {
        return this.intervencoesService.criar(req.user.tenantId, dto);
    }

    @Get('estatisticas')
    @RequirePermissions('INTERVENCOES:Listar')
    @ApiOperation({ summary: 'Obter estatísticas de intervenções' })
    @ApiQuery({ name: 'data_inicio', required: false, type: String })
    @ApiQuery({ name: 'data_fim', required: false, type: String })
    async obterEstatisticas(
        @Request() req,
        @Query('data_inicio') data_inicio?: string,
        @Query('data_fim') data_fim?: string,
    ) {
        return this.intervencoesService.obterEstatisticas(req.user.tenantId, {
            data_inicio,
            data_fim
        });
    }

    @Get()
    @RequirePermissions('INTERVENCOES:Listar')
    @ApiOperation({ summary: 'Listar intervenções' })
    @ApiQuery({ name: 'ticket_id', required: false, type: Number })
    @ApiQuery({ name: 'equipamento_id', required: false, type: Number })
    @ApiQuery({ name: 'tipo', required: false, type: String })
    @ApiQuery({ name: 'tecnico_id', required: false, type: Number })
    @ApiQuery({ name: 'status', required: false, type: String })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'pageSize', required: false, type: Number })
    async listar(
        @Request() req,
        @Query('ticket_id') ticket_id?: number,
        @Query('equipamento_id') equipamento_id?: number,
        @Query('tipo') tipo?: string,
        @Query('tecnico_id') tecnico_id?: number,
        @Query('status') status?: string,
        @Query('page') page?: number,
        @Query('pageSize') pageSize?: number,
    ) {
        return this.intervencoesService.listar(req.user.tenantId, {
            ticket_id,
            equipamento_id,
            tipo,
            tecnico_id,
            status,
            page,
            pageSize
        });
    }

    @Get(':id')
    @RequirePermissions('INTERVENCOES:Visualizar')
    @ApiOperation({ summary: 'Obter intervenção por ID' })
    async obterPorId(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.intervencoesService.obterPorId(id, req.user.tenantId);
    }

    @Get(':id/anexos')
    @RequirePermissions('INTERVENCOES:Visualizar')
    @ApiOperation({ summary: 'Obter anexos da intervenção' })
    async obterAnexos(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.intervencoesService.obterAnexos(id, req.user.tenantId);
    }

    @Get(':id/pecas')
    @RequirePermissions('INTERVENCOES:Visualizar')
    @ApiOperation({ summary: 'Obter peças da intervenção' })
    async obterPecas(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.intervencoesService.obterPecas(id, req.user.tenantId);
    }

    @Put(':id')
    @RequirePermissions('INTERVENCOES:Atualizar')
    @ApiOperation({ summary: 'Atualizar intervenção' })
    async atualizar(
        @Param('id', ParseIntPipe) id: number,
        @Request() req,
        @Body() dto: CriarIntervencaoDto
    ) {
        return this.intervencoesService.atualizar(id, req.user.tenantId, dto);
    }

    @Delete(':id')
    @RequirePermissions('INTERVENCOES:Deletar')
    @ApiOperation({ summary: 'Deletar intervenção' })
    async deletar(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.intervencoesService.deletar(id, req.user.tenantId);
    }
}
