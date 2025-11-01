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
        return this.conteudosService.criar(req.user.tenantId, req.user.id, dto);
    }

    @Public()
    @Get('public/login-banners/:slug')
    @ApiOperation({ summary: 'Obter banners de login por slug do tenant (público)' })
    async obterBannersLogin(@Param('slug') slug: string) {
        return this.conteudosService.obterBannersLoginPorSlug(slug);
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
        return this.conteudosService.obterPorSlug(req.user.tenantId, slug, ip, userAgent, user);
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
        return this.conteudosService.publicar(req.user.tenantId, id, req.user.id);
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
        return this.conteudosService.favoritar(req.user.tenantId, id, req.user.id);
    }

    @Patch(':id/destaque')
    @RequirePermissions('CONTEUDOS:Editar')
    @ApiOperation({ summary: 'Toggle destaque do conteúdo' })
    async toggleDestaque(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.conteudosService.toggleDestaque(req.user.tenantId, id);
    }

    @Post(':id/duplicar')
    @RequirePermissions('CONTEUDOS:Criar')
    @ApiOperation({ summary: 'Duplicar conteúdo' })
    async duplicar(
        @Request() req,
        @CurrentUser() user: UserPayload,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.conteudosService.duplicar(req.user.tenantId, id, req.user.id);
    }

    @Get('dashboard/estatisticas')
    @RequirePermissions('CONTEUDOS:Listar')
    @ApiOperation({ summary: 'Obter estatísticas para dashboard de conteúdos' })
    async obterEstatisticasDashboard(@Request() req: any) {
        return this.conteudosService.obterEstatisticasDashboard(req.user.tenantId);
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

    @Get('configuracoes/idiomas')
    @RequirePermissions('CONTEUDOS:Listar')
    @ApiOperation({ summary: 'Obter configurações de idiomas disponíveis para conteúdos' })
    async obterConfiguracoesIdiomas(@Request() req) {
        return this.conteudosService.obterConfiguracoesIdiomas(req.user.tenantId);
    }
}