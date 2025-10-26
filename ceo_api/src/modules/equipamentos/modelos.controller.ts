import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/guards/permissions.guard';
import { ModelosEquipamentoService } from './modelos.service';
import { CriarModeloDto } from './dto/criar-modelo.dto';

@ApiTags('Modelos de Equipamento')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('modelos-equipamento')
export class ModelosEquipamentoController {
    constructor(private readonly modelosService: ModelosEquipamentoService) { }

    @Get()
    @RequirePermissions('EQUIPAMENTOS:Listar')
    @ApiOperation({ summary: 'Listar todos os modelos de equipamento' })
    async listar(
        @Query('marca_id') marcaId?: number,
        @Query('categoria_id') categoriaId?: number,
        @Query('page') page?: number,
        @Query('pageSize') pageSize?: number,
        @Req() req?: any
    ) {
        return this.modelosService.listar(req.user.tenantId, marcaId, categoriaId, page, pageSize);
    }

    @Get(':id')
    @RequirePermissions('EQUIPAMENTOS:Visualizar')
    @ApiOperation({ summary: 'Obter modelo por ID' })
    async obterPorId(@Param('id') id: number, @Req() req: any) {
        return this.modelosService.obterPorId(id, req.user.tenantId);
    }

    @Post()
    @RequirePermissions('EQUIPAMENTOS:Criar')
    @ApiOperation({ summary: 'Criar novo modelo' })
    async criar(@Body() dados: CriarModeloDto, @Req() req: any) {
        return this.modelosService.criar(dados, req.user.tenantId, req.user.userId);
    }

    @Put(':id')
    @RequirePermissions('EQUIPAMENTOS:Editar')
    @ApiOperation({ summary: 'Atualizar modelo' })
    async atualizar(@Param('id') id: number, @Body() dados: CriarModeloDto, @Req() req: any) {
        return this.modelosService.atualizar(id, dados, req.user.tenantId, req.user.userId);
    }

    @Delete(':id')
    @RequirePermissions('EQUIPAMENTOS:Apagar')
    @ApiOperation({ summary: 'Deletar modelo' })
    async deletar(@Param('id') id: number, @Req() req: any) {
        return this.modelosService.deletar(id, req.user.tenantId);
    }
}
