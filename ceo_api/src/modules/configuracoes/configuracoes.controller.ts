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
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Tenant, CurrentUser } from '../../common/decorators/tenant.decorator';
import { RequirePermissions } from '../../common/guards/permissions.guard';
import type { UserPayload } from '../../common/interfaces/user-payload.interface';
import { ConfiguracoesService } from './configuracoes.service';
import { AtualizarConfiguracaoDto } from './dto/atualizar-configuracao.dto';

@ApiTags('Configurações')
@ApiBearerAuth()
@Controller('configuracoes')
@UseGuards(JwtAuthGuard)
export class ConfiguracoesController {
    constructor(private readonly configuracoesService: ConfiguracoesService) { }

    @Put(':codigo')
    @ApiOperation({ summary: 'Atualizar configuração' })
    async atualizarConfiguracao(
        @Request() req,
        @Param('codigo') codigo: string,
        @Body() dto: AtualizarConfiguracaoDto,
    ) {
        return this.configuracoesService.atualizarConfiguracao(req.user.tenantId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar configurações' })
    async listarConfiguracoes(
        @Request() req,
    ) {
        return this.configuracoesService.listarConfiguracoes(req.user.tenantId);
    }

    @Get(':codigo')
    @ApiOperation({ summary: 'Obter configuração' })
    async obterConfiguracao(
        @Request() req,
        @Param('codigo') codigo: string,
    ) {
        return this.configuracoesService.obterConfiguracao(req.user.tenantId, codigo);
    }

    @Public()
    @Get('public/:slug/tenant-config')
    @ApiOperation({ summary: 'Obter configurações públicas do tenant por slug (público)' })
    async obterConfiguracoesPublicas(@Param('slug') slug: string) {
        return this.configuracoesService.obterConfiguracoesPublicasPorSlug(slug);
    }

}