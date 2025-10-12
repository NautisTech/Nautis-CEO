import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EmpresasService } from './empresas.service';
import { CriarEmpresaDto } from './dto/criar-empresa.dto';
import { AtualizarEmpresaDto } from './dto/atualizar-empresa.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Tenant, CurrentUser } from '../../common/decorators/tenant.decorator';
import { RequirePermissions } from '../../common/guards/permissions.guard';
import type {
    TenantContext,
} from '../../common/interfaces/tenant-context.interface';
import type { UserPayload } from '../../common/interfaces/user-payload.interface';

@ApiTags('Empresas')
@ApiBearerAuth()
@Controller('empresas')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class EmpresasController {
    constructor(private readonly empresasService: EmpresasService) { }

    @Post()
    @RequirePermissions('EMPRESAS:Criar')
    @ApiOperation({ summary: 'Criar nova empresa' })
    async criar(@Tenant() tenant: TenantContext, @Body() dto: CriarEmpresaDto) {
        return this.empresasService.criar(tenant.tenantId, dto);
    }

    @Get()
    @RequirePermissions('EMPRESAS:Listar')
    @ApiOperation({ summary: 'Listar empresas' })
    async listar(@Tenant() tenant: TenantContext) {
        return this.empresasService.listar(tenant.tenantId);
    }

    @Get('minhas-empresas')
    @ApiOperation({ summary: 'Obter empresas do utilizador logado' })
    async minhasEmpresas(
        @Tenant() tenant: TenantContext,
        @CurrentUser() user: UserPayload,
    ) {
        return this.empresasService.obterEmpresasDoUtilizador(
            tenant.tenantId,
            user.sub,
        );
    }

    @Get(':id')
    @RequirePermissions('EMPRESAS:Visualizar')
    @ApiOperation({ summary: 'Obter empresa por ID' })
    async obterPorId(
        @Tenant() tenant: TenantContext,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.empresasService.obterPorId(tenant.tenantId, id);
    }

    @Put(':id')
    @RequirePermissions('EMPRESAS:Editar')
    @ApiOperation({ summary: 'Atualizar empresa' })
    async atualizar(
        @Tenant() tenant: TenantContext,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AtualizarEmpresaDto,
    ) {
        return this.empresasService.atualizar(tenant.tenantId, id, dto);
    }

    @Post(':empresaId/utilizadores/:utilizadorId')
    @RequirePermissions('EMPRESAS:Admin')
    @ApiOperation({ summary: 'Associar utilizador à empresa' })
    async associarUtilizador(
        @Tenant() tenant: TenantContext,
        @Param('empresaId', ParseIntPipe) empresaId: number,
        @Param('utilizadorId', ParseIntPipe) utilizadorId: number,
        @Body('empresaPrincipal') empresaPrincipal?: boolean,
    ) {
        return this.empresasService.associarUtilizadorEmpresa(
            tenant.tenantId,
            utilizadorId,
            empresaId,
            empresaPrincipal,
        );
    }
}