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
    UseGuards,
    ParseIntPipe,
    Request,
    Ip,
    Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConteudosService } from './conteudos.service';
import { CriarConteudoDto } from './dto/criar-conteudo.dto';
import { AtualizarConteudoDto } from './dto/atualizar-conteudo.dto';
import { FiltrarConteudosDto } from './dto/filtrar-conteudos.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Tenant, CurrentUser } from '../../common/decorators/tenant.decorator';
import { RequirePermissions } from '../../common/guards/permissions.guard';
import type {
    TenantContext,
} from '../../common/interfaces/tenant-context.interface';
import type { UserPayload } from '../../common/interfaces/user-payload.interface';

@ApiTags('Conteúdos')
@ApiBearerAuth()
@Controller('conteudos')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class ConteudosController {
    constructor(private readonly conteudosService: ConteudosService) { }

    @Post()
    @RequirePermissions('CONTEUDOS:Criar')
    @ApiOperation({ summary: 'Criar novo conteúdo' })
    async criar(
        @Tenant() tenant: TenantContext,
        @CurrentUser() user: UserPayload,
        @Body() dto: CriarConteudoDto,
    ) {
        return this.conteudosService.criar(tenant.tenantId, user.sub, dto);
    }

    @Get()
    @Public()
    @ApiOperation({ summary: 'Listar conteúdos' })
    async listar(
        @Tenant() tenant: TenantContext,
        @Query() filtros: FiltrarConteudosDto,
    ) {
        return this.conteudosService.listar(tenant.tenantId, filtros);
    }

    @Get(':id')
    @Public()
    @ApiOperation({ summary: 'Obter conteúdo por ID' })
    async obterPorId(
        @Tenant() tenant: TenantContext,
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: UserPayload,
        @Ip() ip: string,
        @Headers('user-agent') userAgent: string,
    ) {
        // Registrar visualização
        await this.conteudosService.registrarVisualizacao(
            tenant.tenantId,
            id,
            user?.sub,
            ip,
            userAgent,
        );

        return this.conteudosService.obterPorId(tenant.tenantId, id);
    }

    @Get('slug/:slug')
    @Public()
    @ApiOperation({ summary: 'Obter conteúdo por slug' })
    async obterPorSlug(
        @Tenant() tenant: TenantContext,
        @Param('slug') slug: string,
    ) {
        return this.conteudosService.obterPorSlug(tenant.tenantId, slug);
    }

    @Put(':id')
    @RequirePermissions('CONTEUDOS:Editar')
    @ApiOperation({ summary: 'Atualizar conteúdo' })
    async atualizar(
        @Tenant() tenant: TenantContext,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AtualizarConteudoDto,
    ) {
        return this.conteudosService.atualizar(tenant.tenantId, id, dto);
    }

    @Patch(':id/publicar')
    @RequirePermissions('CONTEUDOS:Publicar')
    @ApiOperation({ summary: 'Publicar conteúdo' })
    async publicar(
        @Tenant() tenant: TenantContext,
        @CurrentUser() user: UserPayload,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.conteudosService.publicar(tenant.tenantId, id, user.sub);
    }

    @Patch(':id/arquivar')
    @RequirePermissions('CONTEUDOS:Arquivar')
    @ApiOperation({ summary: 'Arquivar conteúdo' })
    async arquivar(
        @Tenant() tenant: TenantContext,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.conteudosService.arquivar(tenant.tenantId, id);
    }

    @Post(':id/favoritar')
    @RequirePermissions('CONTEUDOS:Favoritar')
    @ApiOperation({ summary: 'Favoritar/desfavoritar conteúdo' })
    async favoritar(
        @Tenant() tenant: TenantContext,
        @CurrentUser() user: UserPayload,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.conteudosService.favoritar(tenant.tenantId, id, user.sub);
    }

    @Get(':id/estatisticas')
    @RequirePermissions('CONTEUDOS:Visualizar')
    @ApiOperation({ summary: 'Obter estatísticas do conteúdo' })
    async obterEstatisticas(
        @Tenant() tenant: TenantContext,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.conteudosService.obterEstatisticas(tenant.tenantId, id);
    }
}