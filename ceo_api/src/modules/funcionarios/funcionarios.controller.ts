import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    Request,
    UseGuards,
    ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FuncionariosService } from './funcionarios.service';
import { CriarFuncionarioDto } from './dto/criar-funcionario.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Tenant, CurrentUser } from '../../common/decorators/tenant.decorator';
import { RequirePermissions } from '../../common/guards/permissions.guard';
import type { UserPayload } from '../../common/interfaces/user-payload.interface';

@ApiTags('Funcionários')
@ApiBearerAuth()
@Controller('funcionarios')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FuncionariosController {
    constructor(private readonly funcionariosService: FuncionariosService) { }

    @Post()
    @RequirePermissions('RH:Criar')
    @ApiOperation({ summary: 'Criar novo funcionário' })
    async criar(
        @Request() req,
        @Body() dto: CriarFuncionarioDto,
    ) {
        return this.funcionariosService.criar(req.user.tenantId, dto);
    }

    @Get()
    @RequirePermissions('RH:Listar')
    @ApiOperation({ summary: 'Listar funcionários' })
    async listar(
        @Request() req,
        @CurrentUser() user: UserPayload,
        @Query('tipoFuncionarioId', new ParseIntPipe({ optional: true }))
        tipoFuncionarioId?: number,
        @Query('ativo') ativo?: boolean,
        @Query('textoPesquisa') textoPesquisa?: string,
        @Query('page', new ParseIntPipe({ optional: true })) page?: number,
        @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
    ) {
        return this.funcionariosService.listar(req.user.tenantId, {
            tipoFuncionarioId,
            ativo,
            empresaId: req.user.empresaId,
            textoPesquisa,
            page,
            pageSize,
        });
    }

    @Get(':id')
    @RequirePermissions('RH:Visualizar')
    @ApiOperation({ summary: 'Obter funcionário por ID' })
    async obterPorId(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.funcionariosService.obterPorId(req.user.tenantId, id);
    }
}