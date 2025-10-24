import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Request,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GruposService } from './grupos.service';
import { CriarGrupoDto } from './dto/criar-grupo.dto';
import { AtualizarGrupoDto } from './dto/atualizar-grupo.dto';
import { AssociarPermissoesDto } from './dto/associar-permissoes.dto';
import { AssociarUtilizadoresDto } from './dto/associar-utilizadores.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Tenant } from '../../common/decorators/tenant.decorator';
import { RequirePermissions } from '../../common/guards/permissions.guard';

@ApiTags('Grupos')
@ApiBearerAuth()
@Controller('grupos')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class GruposController {
    constructor(private readonly gruposService: GruposService) { }

    @Post()
    @RequirePermissions('UTILIZADORES:GruposGestao')
    @ApiOperation({ summary: 'Criar novo grupo' })
    async criar(@Request() req, @Body() dto: CriarGrupoDto) {
        return this.gruposService.criar(req.user.tenantId, dto);
    }

    @Get()
    @RequirePermissions('UTILIZADORES:GruposListar')
    @ApiOperation({ summary: 'Listar grupos' })
    async listar(@Request() req) {
        return this.gruposService.listar(req.user.tenantId);
    }

    @Get('estatisticas')
    @RequirePermissions('UTILIZADORES:GruposListar')
    @ApiOperation({ summary: 'Obter estatísticas de grupos' })
    async obterEstatisticas(@Request() req) {
        return this.gruposService.obterEstatisticas(req.user.tenantId);
    }

    @Get(':id')
    @RequirePermissions('UTILIZADORES:GruposListar')
    @ApiOperation({ summary: 'Obter grupo por ID' })
    async obterPorId(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.gruposService.obterPorId(req.user.tenantId, id);
    }

    @Put(':id')
    @RequirePermissions('UTILIZADORES:GruposGestao')
    @ApiOperation({ summary: 'Atualizar grupo' })
    async atualizar(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AtualizarGrupoDto,
    ) {
        return this.gruposService.atualizar(req.user.tenantId, id, dto);
    }

    @Delete(':id')
    @RequirePermissions('UTILIZADORES:GruposGestao')
    @ApiOperation({ summary: 'Deletar grupo' })
    async deletar(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.gruposService.deletar(req.user.tenantId, id);
    }

    @Post(':id/permissoes')
    @RequirePermissions('UTILIZADORES:GruposGestao')
    @ApiOperation({ summary: 'Associar permissões ao grupo' })
    async associarPermissoes(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AssociarPermissoesDto,
    ) {
        return this.gruposService.associarPermissoes(
            req.user.tenantId,
            id,
            dto.permissoesIds,
        );
    }

    @Post(':id/utilizadores')
    @RequirePermissions('UTILIZADORES:GruposGestao')
    @ApiOperation({ summary: 'Associar utilizadores ao grupo' })
    async associarUtilizadores(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AssociarUtilizadoresDto,
    ) {
        return this.gruposService.associarUtilizadores(
            req.user.tenantId,
            id,
            dto.utilizadoresIds,
        );
    }
}