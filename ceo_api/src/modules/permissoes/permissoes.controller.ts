import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Request,
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

@ApiTags('Permissões')
@ApiBearerAuth()
@Controller('permissoes')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PermissoesController {
    constructor(private readonly permissoesService: PermissoesService) { }

    @Post()
    @RequirePermissions('UTILIZADORES:PermissoesGestao')
    @ApiOperation({ summary: 'Criar nova permissão' })
    async criar(
        @Request() req,
        @Body() dto: CriarPermissaoDto,
    ) {
        return this.permissoesService.criar(req.user.tenantId, dto);
    }

    @Get()
    @RequirePermissions('UTILIZADORES:PermissoesListar')
    @ApiOperation({ summary: 'Listar todas as permissões' })
    async listar(@Request() req) {
        return this.permissoesService.listar(req.user.tenantId);
    }

    @Get('modulos')
    @RequirePermissions('UTILIZADORES:PermissoesListar')
    @ApiOperation({ summary: 'Listar permissões agrupadas por módulo' })
    async listarPorModulo(@Request() req) {
        return this.permissoesService.listarPorModulo(req.user.tenantId);
    }

    @Get('utilizador/:utilizadorId')
    @RequirePermissions('UTILIZADORES:PermissoesListar')
    @ApiOperation({ summary: 'Obter permissões de um utilizador' })
    async obterPermissoesDoUtilizador(
        @Request() req,
        @Param('utilizadorId', ParseIntPipe) utilizadorId: number,
    ) {
        return this.permissoesService.obterPermissoesDoUtilizador(
            req.user.tenantId,
            utilizadorId,
        );
    }

    @Get(':id')
    @RequirePermissions('UTILIZADORES:PermissoesListar')
    @ApiOperation({ summary: 'Obter permissão por ID' })
    async obterPorId(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.permissoesService.obterPorId(req.user.tenantId, id);
    }

    @Get('codigo/:codigo')
    @RequirePermissions('UTILIZADORES:PermissoesListar')
    @ApiOperation({ summary: 'Obter permissão por código' })
    async obterPorCodigo(
        @Request() req,
        @Param('codigo') codigo: string,
    ) {
        return this.permissoesService.obterPorCodigo(req.user.tenantId, codigo);
    }

    @Put(':id')
    @RequirePermissions('UTILIZADORES:PermissoesGestao')
    @ApiOperation({ summary: 'Atualizar permissão' })
    async atualizar(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AtualizarPermissaoDto,
    ) {
        return this.permissoesService.atualizar(req.user.tenantId, id, dto);
    }

    @Delete(':id')
    @RequirePermissions('UTILIZADORES:PermissoesGestao')
    @ApiOperation({ summary: 'Deletar permissão' })
    async deletar(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.permissoesService.deletar(req.user.tenantId, id);
    }

    @Post('utilizador/:utilizadorId/:permissaoId')
    @RequirePermissions('UTILIZADORES:PermissoesGestao')
    @ApiOperation({ summary: 'Associar permissão a utilizador' })
    async associarPermissaoAoUtilizador(
        @Request() req,
        @Param('utilizadorId', ParseIntPipe) utilizadorId: number,
        @Param('permissaoId', ParseIntPipe) permissaoId: number,
    ) {
        return this.permissoesService.associarPermissaoAoUtilizador(
            req.user.tenantId,
            utilizadorId,
            permissaoId,
        );
    }

    @Delete('utilizador/:utilizadorId/:permissaoId')
    @RequirePermissions('UTILIZADORES:PermissoesGestao')
    @ApiOperation({ summary: 'Remover permissão de utilizador' })
    async removerPermissaoDoUtilizador(
        @Request() req,
        @Param('utilizadorId', ParseIntPipe) utilizadorId: number,
        @Param('permissaoId', ParseIntPipe) permissaoId: number,
    ) {
        return this.permissoesService.removerPermissaoDoUtilizador(
            req.user.tenantId,
            utilizadorId,
            permissaoId,
        );
    }
}