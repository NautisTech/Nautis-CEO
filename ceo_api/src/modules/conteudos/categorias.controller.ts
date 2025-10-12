import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriasService } from './categorias.service';
import { CriarCategoriaDto } from './dto/criar-categoria.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Tenant } from '../../common/decorators/tenant.decorator';
import { RequirePermissions } from '../../common/guards/permissions.guard';
import type { TenantContext } from '../../common/interfaces/tenant-context.interface';

@ApiTags('Categorias de Conteúdo')
@ApiBearerAuth()
@Controller('conteudos/categorias')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class CategoriasController {
    constructor(private readonly categoriasService: CategoriasService) { }

    @Post()
    @RequirePermissions('CONTEUDOS:Admin')
    @ApiOperation({ summary: 'Criar categoria' })
    async criar(
        @Tenant() tenant: TenantContext,
        @Body() dto: CriarCategoriaDto,
    ) {
        return this.categoriasService.criar(tenant.tenantId, dto);
    }

    @Get()
    @Public()
    @ApiOperation({ summary: 'Listar categorias' })
    async listar(@Tenant() tenant: TenantContext) {
        return this.categoriasService.listar(tenant.tenantId);
    }

    @Get(':id')
    @Public()
    @ApiOperation({ summary: 'Obter categoria por ID' })
    async obterPorId(
        @Tenant() tenant: TenantContext,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.categoriasService.obterPorId(tenant.tenantId, id);
    }
}