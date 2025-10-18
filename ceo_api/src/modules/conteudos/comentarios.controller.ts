import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Request,
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
import type { UserPayload } from '../../common/interfaces/user-payload.interface';

@ApiTags('Comentários')
@ApiBearerAuth()
@Controller('conteudos/comentarios')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ComentariosController {
    constructor(private readonly comentariosService: ComentariosService) { }

    @Post()
    @ApiOperation({ summary: 'Criar comentário' })
    async criar(
        @Request() req,
        @CurrentUser() user: UserPayload,
        @Body() dto: CriarComentarioDto,
    ) {
        return this.comentariosService.criar(req.user.tenantId, user.sub, dto);
    }

    @Get('conteudo/:conteudoId')
    @Public()
    @ApiOperation({ summary: 'Listar comentários de um conteúdo' })
    async listar(
        @Request() req,
        @Param('conteudoId', ParseIntPipe) conteudoId: number,
    ) {
        return this.comentariosService.listar(req.user.tenantId, conteudoId);
    }

    @Get(':id/respostas')
    @Public()
    @ApiOperation({ summary: 'Obter respostas de um comentário' })
    async obterRespostas(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.comentariosService.obterRespostas(req.user.tenantId, id);
    }

    @Patch(':id/aprovar')
    @RequirePermissions('CONTEUDOS:Moderar')
    @ApiOperation({ summary: 'Aprovar comentário' })
    async aprovar(
        @Request() req,
        @CurrentUser() user: UserPayload,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.comentariosService.aprovar(req.user.tenantId, id, user.sub);
    }

    @Delete(':id')
    @RequirePermissions('CONTEUDOS:Moderar')
    @ApiOperation({ summary: 'Rejeitar/deletar comentário' })
    async rejeitar(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.comentariosService.rejeitar(req.user.tenantId, id);
    }

    @Post(':id/like')
    @ApiOperation({ summary: 'Dar like em comentário' })
    async darLike(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.comentariosService.darLike(req.user.tenantId, id);
    }
}