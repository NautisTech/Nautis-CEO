import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/guards/permissions.guard';
import { EquipamentosService } from './equipamentos.service';
import { CriarEquipamentoDto } from './dto/criar-equipamento.dto';

@ApiTags('Equipamentos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('equipamentos')
export class EquipamentosController {
    constructor(private readonly equipamentosService: EquipamentosService) { }

    @Get()
    @RequirePermissions('EQUIPAMENTOS:Listar')
    @ApiOperation({ summary: 'Listar todos os equipamentos' })
    async listar(
        @Query('modelo_id') modeloId?: number,
        @Query('responsavel_id') responsavelId?: number,
        @Query('utilizador_id') utilizadorId?: number,
        @Query('estado') estado?: string,
        @Query('page') page?: number,
        @Query('pageSize') pageSize?: number,
        @Req() req?: any
    ) {
        return this.equipamentosService.listar(req.user.tenantId, {
            modeloId,
            responsavelId,
            utilizadorId,
            estado,
            page,
            pageSize
        });
    }

    @Get(':id')
    @RequirePermissions('EQUIPAMENTOS:Visualizar')
    @ApiOperation({ summary: 'Obter equipamento por ID' })
    async obterPorId(@Param('id') id: number, @Req() req: any) {
        return this.equipamentosService.obterPorId(id, req.user.tenantId);
    }

    @Post()
    @RequirePermissions('EQUIPAMENTOS:Criar')
    @ApiOperation({ summary: 'Criar novo equipamento' })
    async criar(@Body() dados: CriarEquipamentoDto, @Req() req: any) {
        return this.equipamentosService.criar(dados, req.user.tenantId, req.user.userId);
    }

    @Put(':id')
    @RequirePermissions('EQUIPAMENTOS:Editar')
    @ApiOperation({ summary: 'Atualizar equipamento' })
    async atualizar(@Param('id') id: number, @Body() dados: CriarEquipamentoDto, @Req() req: any) {
        return this.equipamentosService.atualizar(id, dados, req.user.tenantId, req.user.userId);
    }

    @Delete(':id')
    @RequirePermissions('EQUIPAMENTOS:Apagar')
    @ApiOperation({ summary: 'Deletar equipamento' })
    async deletar(@Param('id') id: number, @Req() req: any) {
        return this.equipamentosService.deletar(id, req.user.tenantId);
    }

    @Get('dashboard/estatisticas')
    @RequirePermissions('EQUIPAMENTOS:Listar')
    @ApiOperation({ summary: 'Obter estatísticas para dashboard de equipamentos' })
    async obterEstatisticasDashboard(@Req() req: any) {
        return this.equipamentosService.obterEstatisticasDashboard(req.user.tenantId);
    }
}
