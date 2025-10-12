import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ComentariosService } from './comentarios.service';
import { CriarComentarioDto } from './dto/criar-comentario.dto';
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

@ApiTags('Comentários')
@ApiBearerAuth()
@Controller('conteudos/comentarios')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class ComentariosController {
    constructor(private readonly comentariosService: ComentariosService) { }

    @Post()
    @ApiOperation({ summary: 'Criar comentário' })
    async criar(
        @Tenant() tenant: TenantContext,
        @CurrentUser() user: UserPayload,
        @Body() dto: CriarComentarioDto,
    ) {
        return this.comentariosService.criar(tenant.tenantId, user.sub, dto);
    }

    @Get('conteudo/:conteudoId')
    @Public()
    @ApiOperation({ summary: 'Listar comentários de um conteúdo' })
    async listar(
        @Tenant() tenant: TenantContext,
        @Param('conteudoId', ParseIntPipe) conteudoId: number,
    ) {
        return this.comentariosService.listar(tenant.tenantId, conteudoId);
    }

    @Get(':id/respostas')
    @Public()
    @ApiOperation({ summary: 'Obter respostas de um comentário' })
    async obterRespostas(
        @Tenant() tenant: TenantContext,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.comentariosService.obterRespostas(tenant.tenantId, id);
    }

    @Patch(':id/aprovar')
    @RequirePermissions('CONTEUDOS:Moderar')
    @ApiOperation({ summary: 'Aprovar comentário' })
    async aprovar(
        @Tenant() tenant: TenantContext,
        @CurrentUser() user: UserPayload,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.comentariosService.aprovar(tenant.tenantId, id, user.sub);
    }

    @Delete(':id')
    @RequirePermissions('CONTEUDOS:Moderar')
    @ApiOperation({ summary: 'Rejeitar/deletar comentário' })
    async rejeitar(
        @Tenant() tenant: TenantContext,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.comentariosService.rejeitar(tenant.tenantId, id);
    }

    @Post(':id/like')
    @ApiOperation({ summary: 'Dar like em comentário' })
    async darLike(
        @Tenant() tenant: TenantContext,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.comentariosService.darLike(tenant.tenantId, id);
    }
}