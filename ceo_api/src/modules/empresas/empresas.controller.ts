import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    Request,
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
import type { UserPayload } from '../../common/interfaces/user-payload.interface';

@ApiTags('Empresas')
@ApiBearerAuth()
@Controller('empresas')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class EmpresasController {
    constructor(private readonly empresasService: EmpresasService) { }

    @Post()
    @RequirePermissions('EMPRESAS:Criar')
    @ApiOperation({ summary: 'Criar nova empresa' })
    async criar(@Request() req, @Body() dto: CriarEmpresaDto) {
        return this.empresasService.criar(req.user.tenantId, dto);
    }

    @Get()
    @RequirePermissions('EMPRESAS:Listar')
    @ApiOperation({ summary: 'Listar empresas' })
    async listar(@Request() req) {
        return this.empresasService.listar(req.user.tenantId);
    }

    @Get('minhas-empresas')
    @ApiOperation({ summary: 'Obter empresas do utilizador logado' })
    async minhasEmpresas(
        @Request() req,
        @CurrentUser() user: UserPayload,
    ) {
        return this.empresasService.obterEmpresasDoUtilizador(
            req.user.tenantId,
            user.sub,
        );
    }

    @Get(':id')
    @RequirePermissions('EMPRESAS:Visualizar')
    @ApiOperation({ summary: 'Obter empresa por ID' })
    async obterPorId(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.empresasService.obterPorId(req.user.tenantId, id);
    }

    @Put(':id')
    @RequirePermissions('EMPRESAS:Editar')
    @ApiOperation({ summary: 'Atualizar empresa' })
    async atualizar(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AtualizarEmpresaDto,
    ) {
        return this.empresasService.atualizar(req.user.tenantId, id, dto);
    }

    @Post(':empresaId/utilizadores/:utilizadorId')
    @RequirePermissions('EMPRESAS:Admin')
    @ApiOperation({ summary: 'Associar utilizador à empresa' })
    async associarUtilizador(
        @Request() req,
        @Param('empresaId', ParseIntPipe) empresaId: number,
        @Param('utilizadorId', ParseIntPipe) utilizadorId: number,
        @Body('empresaPrincipal') empresaPrincipal?: boolean,
    ) {
        return this.empresasService.associarUtilizadorEmpresa(
            req.user.tenantId,
            utilizadorId,
            empresaId,
            empresaPrincipal,
        );
    }
}