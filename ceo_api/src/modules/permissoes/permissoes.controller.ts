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
import { PermissoesService } from './permissoes.service';
import { CriarPermissaoDto } from './dto/criar-permissao.dto';
import { AtualizarPermissaoDto } from './dto/atualizar-permissao.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Tenant } from '../../common/decorators/tenant.decorator';
import { RequirePermissions } from '../../common/guards/permissions.guard';
import type { TenantContext } from '../../common/interfaces/tenant-context.interface';

@ApiTags('Permissões')
@ApiBearerAuth()
@Controller('permissoes')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class PermissoesController {
    constructor(private readonly permissoesService: PermissoesService) { }

    @Post()
    @RequirePermissions('ADMIN:PermissoesGestao')
    @ApiOperation({ summary: 'Criar nova permissão' })
    async criar(
        @Tenant() tenant: TenantContext,
        @Body() dto: CriarPermissaoDto,
    ) {
        return this.permissoesService.criar(tenant.tenantId, dto);
    }

    @Get()
    @RequirePermissions('ADMIN:PermissoesGestao')
    @ApiOperation({ summary: 'Listar todas as permissões' })
    async listar(@Tenant() tenant: TenantContext) {
        return this.permissoesService.listar(tenant.tenantId);
    }

    @Get('modulos')
    @RequirePermissions('ADMIN:PermissoesGestao')
    @ApiOperation({ summary: 'Listar permissões agrupadas por módulo' })
    async listarPorModulo(@Tenant() tenant: TenantContext) {
        return this.permissoesService.listarPorModulo(tenant.tenantId);
    }

    @Get('utilizador/:utilizadorId')
    @ApiOperation({ summary: 'Obter permissões de um utilizador' })
    async obterPermissoesDoUtilizador(
        @Tenant() tenant: TenantContext,
        @Param('utilizadorId', ParseIntPipe) utilizadorId: number,
    ) {
        return this.permissoesService.obterPermissoesDoUtilizador(
            tenant.tenantId,
            utilizadorId,
        );
    }

    @Get(':id')
    @RequirePermissions('ADMIN:PermissoesGestao')
    @ApiOperation({ summary: 'Obter permissão por ID' })
    async obterPorId(
        @Tenant() tenant: TenantContext,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.permissoesService.obterPorId(tenant.tenantId, id);
    }

    @Get('codigo/:codigo')
    @RequirePermissions('ADMIN:PermissoesGestao')
    @ApiOperation({ summary: 'Obter permissão por código' })
    async obterPorCodigo(
        @Tenant() tenant: TenantContext,
        @Param('codigo') codigo: string,
    ) {
        return this.permissoesService.obterPorCodigo(tenant.tenantId, codigo);
    }

    @Put(':id')
    @RequirePermissions('ADMIN:PermissoesGestao')
    @ApiOperation({ summary: 'Atualizar permissão' })
    async atualizar(
        @Tenant() tenant: TenantContext,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AtualizarPermissaoDto,
    ) {
        return this.permissoesService.atualizar(tenant.tenantId, id, dto);
    }

    @Delete(':id')
    @RequirePermissions('ADMIN:PermissoesGestao')
    @ApiOperation({ summary: 'Deletar permissão' })
    async deletar(
        @Tenant() tenant: TenantContext,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.permissoesService.deletar(tenant.tenantId, id);
    }

    @Post('utilizador/:utilizadorId/:permissaoId')
    @RequirePermissions('ADMIN:PermissoesGestao')
    @ApiOperation({ summary: 'Associar permissão a utilizador' })
    async associarPermissaoAoUtilizador(
        @Tenant() tenant: TenantContext,
        @Param('utilizadorId', ParseIntPipe) utilizadorId: number,
        @Param('permissaoId', ParseIntPipe) permissaoId: number,
    ) {
        return this.permissoesService.associarPermissaoAoUtilizador(
            tenant.tenantId,
            utilizadorId,
            permissaoId,
        );
    }

    @Delete('utilizador/:utilizadorId/:permissaoId')
    @RequirePermissions('ADMIN:PermissoesGestao')
    @ApiOperation({ summary: 'Remover permissão de utilizador' })
    async removerPermissaoDoUtilizador(
        @Tenant() tenant: TenantContext,
        @Param('utilizadorId', ParseIntPipe) utilizadorId: number,
        @Param('permissaoId', ParseIntPipe) permissaoId: number,
    ) {
        return this.permissoesService.removerPermissaoDoUtilizador(
            tenant.tenantId,
            utilizadorId,
            permissaoId,
        );
    }
}