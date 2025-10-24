import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    Request,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UtilizadoresService } from './utilizadores.service';
import { CriarUtilizadorDto } from './dto/criar-utilizador.dto';
import { AtualizarUtilizadorDto } from './dto/atualizar-utilizador.dto';
import { AtualizarSenhaDto } from './dto/atualizar-senha.dto';
import { AssociarGruposDto } from './dto/associar-grupos.dto';
import { AssociarPermissoesDto } from './dto/associar-permissoes.dto';
import { AssociarEmpresasDto } from './dto/associar-empresas.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/guards/permissions.guard';

@ApiTags('Utilizadores')
@ApiBearerAuth()
@Controller('utilizadores')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UtilizadoresController {
    constructor(private readonly utilizadoresService: UtilizadoresService) { }

    @Post()
    @RequirePermissions('UTILIZADORES:Gestao')
    @ApiOperation({ summary: 'Criar novo utilizador' })
    async criar(@Request() req, @Body() dto: CriarUtilizadorDto) {
        return this.utilizadoresService.criar(req.user.tenantId, dto);
    }

    @Get()
    @RequirePermissions('UTILIZADORES:Listar')
    @ApiOperation({ summary: 'Listar utilizadores com paginação' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'pageSize', required: false, type: Number })
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiQuery({ name: 'ativo', required: false, type: Boolean })
    @ApiQuery({ name: 'grupoId', required: false, type: Number })
    @ApiQuery({ name: 'empresaId', required: false, type: Number })
    async listar(
        @Request() req,
        @Query('page') page?: number,
        @Query('pageSize') pageSize?: number,
        @Query('search') search?: string,
        @Query('ativo') ativo?: boolean,
        @Query('grupoId') grupoId?: number,
        @Query('empresaId') empresaId?: number,
    ) {
        return this.utilizadoresService.listar(
            req.user.tenantId,
            page ? parseInt(page.toString()) : 1,
            pageSize ? parseInt(pageSize.toString()) : 50,
            {
                search,
                ativo: ativo !== undefined ? ativo === true : undefined,
                grupoId: grupoId ? parseInt(grupoId.toString()) : undefined,
                empresaId: empresaId ? parseInt(empresaId.toString()) : undefined,
            },
        );
    }

    @Get('estatisticas')
    @RequirePermissions('UTILIZADORES:Listar')
    @ApiOperation({ summary: 'Obter estatísticas de utilizadores' })
    async obterEstatisticas(@Request() req) {
        return this.utilizadoresService.obterEstatisticas(req.user.tenantId);
    }

    @Get('dashboard/estatisticas')
    @RequirePermissions('UTILIZADORES:Listar')
    @ApiOperation({ summary: 'Obter estatísticas para dashboard de administração' })
    async obterEstatisticasDashboard(@Request() req: any) {
        return this.utilizadoresService.obterEstatisticasDashboard(req.user.tenantId);
    }

    @Get(':id')
    @RequirePermissions('UTILIZADORES:Listar')
    @ApiOperation({ summary: 'Obter utilizador por ID' })
    async obterPorId(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.utilizadoresService.obterPorId(req.user.tenantId, id);
    }

    @Put(':id')
    @RequirePermissions('UTILIZADORES:Gestao')
    @ApiOperation({ summary: 'Atualizar utilizador' })
    async atualizar(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AtualizarUtilizadorDto,
    ) {
        return this.utilizadoresService.atualizar(req.user.tenantId, id, dto);
    }

    @Put(':id/senha')
    @RequirePermissions('UTILIZADORES:Gestao')
    @ApiOperation({ summary: 'Atualizar senha do utilizador' })
    async atualizarSenha(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AtualizarSenhaDto,
    ) {
        return this.utilizadoresService.atualizarSenha(
            req.user.tenantId,
            id,
            dto,
        );
    }

    @Post(':id/resetar-senha')
    @RequirePermissions('UTILIZADORES:Gestao')
    @ApiOperation({ summary: 'Resetar senha do utilizador (admin)' })
    async resetarSenha(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body('novaSenha') novaSenha: string,
    ) {
        return this.utilizadoresService.resetarSenha(
            req.user.tenantId,
            id,
            novaSenha,
        );
    }

    @Delete(':id')
    @RequirePermissions('UTILIZADORES:Gestao')
    @ApiOperation({ summary: 'Desativar utilizador' })
    async deletar(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.utilizadoresService.deletar(req.user.tenantId, id);
    }

    @Post(':id/grupos')
    @RequirePermissions('UTILIZADORES:Gestao')
    @ApiOperation({ summary: 'Associar grupos ao utilizador' })
    async associarGrupos(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AssociarGruposDto,
    ) {
        return this.utilizadoresService.associarGrupos(
            req.user.tenantId,
            id,
            dto.gruposIds,
        );
    }

    @Delete(':id/grupos/:grupoId')
    @RequirePermissions('UTILIZADORES:Gestao')
    @ApiOperation({ summary: 'Remover utilizador de um grupo' })
    async removerDeGrupo(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Param('grupoId', ParseIntPipe) grupoId: number,
    ) {
        return this.utilizadoresService.removerDeGrupo(
            req.user.tenantId,
            id,
            grupoId,
        );
    }

    @Post(':id/permissoes')
    @RequirePermissions('UTILIZADORES:Gestao')
    @ApiOperation({ summary: 'Associar permissões diretas ao utilizador' })
    async associarPermissoes(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AssociarPermissoesDto,
    ) {
        return this.utilizadoresService.associarPermissoes(
            req.user.tenantId,
            id,
            dto.permissoesIds,
        );
    }

    @Delete(':id/permissoes/:permissaoId')
    @RequirePermissions('UTILIZADORES:Gestao')
    @ApiOperation({ summary: 'Remover permissão direta do utilizador' })
    async removerPermissao(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Param('permissaoId', ParseIntPipe) permissaoId: number,
    ) {
        return this.utilizadoresService.removerPermissao(
            req.user.tenantId,
            id,
            permissaoId,
        );
    }

    @Post(':id/empresas')
    @RequirePermissions('UTILIZADORES:Gestao')
    @ApiOperation({ summary: 'Associar empresas ao utilizador' })
    async associarEmpresas(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AssociarEmpresasDto,
    ) {
        return this.utilizadoresService.associarEmpresas(
            req.user.tenantId,
            id,
            dto.empresasIds,
            dto.empresaPrincipalId,
        );
    }

    @Delete(':id/empresas/:empresaId')
    @RequirePermissions('UTILIZADORES:Gestao')
    @ApiOperation({ summary: 'Remover utilizador de uma empresa' })
    async removerDeEmpresa(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Param('empresaId', ParseIntPipe) empresaId: number,
    ) {
        return this.utilizadoresService.removerDeEmpresa(
            req.user.tenantId,
            id,
            empresaId,
        );
    }
}
