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
    Req,
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
import type { UserPayload } from '../../common/interfaces/user-payload.interface';

@ApiTags('Conteúdos')
@ApiBearerAuth()
@Controller('conteudos')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ConteudosController {
    constructor(private readonly conteudosService: ConteudosService) { }

    @Post()
    @RequirePermissions('CONTEUDOS:Criar')
    @ApiOperation({ summary: 'Criar novo conteúdo' })
    async criar(
        @Request() req,
        @CurrentUser() user: UserPayload,
        @Body() dto: CriarConteudoDto,
    ) {
        return this.conteudosService.criar(req.user.tenantId, user.sub, dto);
    }

    @Get()
    @RequirePermissions('CONTEUDOS:Listar')
    @ApiOperation({ summary: 'Listar conteúdos' })
    async listar(
        @Request() req,
        @Query() filtros: FiltrarConteudosDto,
    ) {
        return this.conteudosService.listar(req.user.tenantId, filtros);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obter conteúdo por ID' })
    async obterPorId(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: UserPayload,
        @Ip() ip: string,
        @Headers('user-agent') userAgent: string,
    ) {

        return this.conteudosService.obterPorId(req.user.tenantId, id);
    }

    @Get('slug/:slug')
    @ApiOperation({ summary: 'Obter conteúdo por slug' })
    async obterPorSlug(
        @Request() req,
        @Param('slug') slug: string,
        @CurrentUser() user: UserPayload,
        @Ip() ip: string,
        @Headers('user-agent') userAgent: string,
    ) {
        // Registrar visualização
        await this.conteudosService.registrarVisualizacao(
            req.user.tenantId,
            slug,
            user?.sub,
            ip,
            userAgent,
        );

        return this.conteudosService.obterPorSlug(req.user.tenantId, slug);
    }

    @Put(':id')
    @RequirePermissions('CONTEUDOS:Editar')
    @ApiOperation({ summary: 'Atualizar conteúdo' })
    async atualizar(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AtualizarConteudoDto,
    ) {
        return this.conteudosService.atualizar(req.user.tenantId, id, dto);
    }

    @Patch(':id/publicar')
    @RequirePermissions('CONTEUDOS:Publicar')
    @ApiOperation({ summary: 'Publicar conteúdo' })
    async publicar(
        @Request() req,
        @CurrentUser() user: UserPayload,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.conteudosService.publicar(req.user.tenantId, id, user.sub);
    }

    @Patch(':id/arquivar')
    @RequirePermissions('CONTEUDOS:Arquivar')
    @ApiOperation({ summary: 'Arquivar conteúdo' })
    async arquivar(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.conteudosService.arquivar(req.user.tenantId, id);
    }

    @Post(':id/favoritar')
    @RequirePermissions('CONTEUDOS:Favoritar')
    @ApiOperation({ summary: 'Favoritar/desfavoritar conteúdo' })
    async favoritar(
        @Request() req,
        @CurrentUser() user: UserPayload,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.conteudosService.favoritar(req.user.tenantId, id, user.sub);
    }

    @Get(':id/estatisticas')
    @RequirePermissions('CONTEUDOS:Visualizar')
    @ApiOperation({ summary: 'Obter estatísticas do conteúdo' })
    async obterEstatisticas(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.conteudosService.obterEstatisticas(req.user.tenantId, id);
    }
}