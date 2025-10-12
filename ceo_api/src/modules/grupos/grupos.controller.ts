import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
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
import type { TenantContext } from '../../common/interfaces/tenant-context.interface';

@ApiTags('Grupos')
@ApiBearerAuth()
@Controller('grupos')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class GruposController {
    constructor(private readonly gruposService: GruposService) { }

    @Post()
    @RequirePermissions('ADMIN:GruposGestao')
    @ApiOperation({ summary: 'Criar novo grupo' })
    async criar(@Tenant() tenant: TenantContext, @Body() dto: CriarGrupoDto) {
        return this.gruposService.criar(tenant.tenantId, dto);
    }

    @Get()
    @RequirePermissions('ADMIN:GruposListar')
    @ApiOperation({ summary: 'Listar grupos' })
    async listar(@Tenant() tenant: TenantContext) {
        return this.gruposService.listar(tenant.tenantId);
    }

    @Get(':id')
    @RequirePermissions('ADMIN:GruposVisualizar')
    @ApiOperation({ summary: 'Obter grupo por ID' })
    async obterPorId(
        @Tenant() tenant: TenantContext,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.gruposService.obterPorId(tenant.tenantId, id);
    }

    @Put(':id')
    @RequirePermissions('ADMIN:GruposGestao')
    @ApiOperation({ summary: 'Atualizar grupo' })
    async atualizar(
        @Tenant() tenant: TenantContext,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AtualizarGrupoDto,
    ) {
        return this.gruposService.atualizar(tenant.tenantId, id, dto);
    }

    @Delete(':id')
    @RequirePermissions('ADMIN:GruposGestao')
    @ApiOperation({ summary: 'Deletar grupo' })
    async deletar(
        @Tenant() tenant: TenantContext,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.gruposService.deletar(tenant.tenantId, id);
    }

    @Post(':id/permissoes')
    @RequirePermissions('ADMIN:GruposGestao')
    @ApiOperation({ summary: 'Associar permissões ao grupo' })
    async associarPermissoes(
        @Tenant() tenant: TenantContext,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AssociarPermissoesDto,
    ) {
        return this.gruposService.associarPermissoes(
            tenant.tenantId,
            id,
            dto.permissoesIds,
        );
    }

    @Post(':id/utilizadores')
    @RequirePermissions('ADMIN:GruposGestao')
    @ApiOperation({ summary: 'Associar utilizadores ao grupo' })
    async associarUtilizadores(
        @Tenant() tenant: TenantContext,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AssociarUtilizadoresDto,
    ) {
        return this.gruposService.associarUtilizadores(
            tenant.tenantId,
            id,
            dto.utilizadoresIds,
        );
    }
}