import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/guards/permissions.guard';
import { CategoriasEquipamentoService } from './categorias.service';
import { CriarCategoriaDto } from './dto/criar-categoria.dto';

@ApiTags('Categorias de Equipamento')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('categorias-equipamento')
export class CategoriasEquipamentoController {
    constructor(private readonly categoriasService: CategoriasEquipamentoService) { }

    @Get()
    @RequirePermissions('EQUIPAMENTOS:Listar')
    @ApiOperation({ summary: 'Listar todas as categorias de equipamento' })
    async listar(@Req() req: any) {
        return this.categoriasService.listar(req.user.tenantId);
    }

    @Get('hierarquia')
    @RequirePermissions('EQUIPAMENTOS:Listar')
    @ApiOperation({ summary: 'Listar categorias em estrutura hierárquica' })
    async listarHierarquia(@Req() req: any) {
        return this.categoriasService.listarHierarquia(req.user.tenantId);
    }

    @Get(':id')
    @RequirePermissions('EQUIPAMENTOS:Visualizar')
    @ApiOperation({ summary: 'Obter categoria por ID' })
    async obterPorId(@Param('id') id: number, @Req() req: any) {
        return this.categoriasService.obterPorId(id, req.user.tenantId);
    }

    @Post()
    @RequirePermissions('EQUIPAMENTOS:Criar')
    @ApiOperation({ summary: 'Criar nova categoria' })
    async criar(@Body() dados: CriarCategoriaDto, @Req() req: any) {
        return this.categoriasService.criar(dados, req.user.tenantId, req.user.userId);
    }

    @Put(':id')
    @RequirePermissions('EQUIPAMENTOS:Editar')
    @ApiOperation({ summary: 'Atualizar categoria' })
    async atualizar(@Param('id') id: number, @Body() dados: CriarCategoriaDto, @Req() req: any) {
        return this.categoriasService.atualizar(id, dados, req.user.tenantId, req.user.userId);
    }

    @Delete(':id')
    @RequirePermissions('EQUIPAMENTOS:Apagar')
    @ApiOperation({ summary: 'Deletar categoria' })
    async deletar(@Param('id') id: number, @Req() req: any) {
        return this.categoriasService.deletar(id, req.user.tenantId);
    }
}
