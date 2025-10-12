import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RequirePermissions } from '../../common/guards/permissions.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { CriarTenantDto } from './dto/criar-tenant.dto';
import { AtualizarTenantDto } from './dto/atualizar-tenant.dto';

@ApiTags('Tenants')
@ApiBearerAuth()
@Controller('tenants')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TenantsController {
    constructor(private readonly tenantsService: TenantsService) { }

    @Post()
    @RequirePermissions('ADMIN:SuperAdmin')
    @ApiOperation({ summary: 'Criar novo tenant' })
    async criar(@Body() dto: CriarTenantDto) {
        return this.tenantsService.criar(dto);
    }

    @Get()
    @RequirePermissions('ADMIN:SuperAdmin')
    @ApiOperation({ summary: 'Listar todos os tenants' })
    async listar() {
        return this.tenantsService.listar();
    }

    @Get(':id')
    @RequirePermissions('ADMIN:SuperAdmin')
    @ApiOperation({ summary: 'Obter tenant por ID' })
    async obterPorId(@Param('id', ParseIntPipe) id: number) {
        return this.tenantsService.obterPorId(id);
    }

    @Put(':id')
    @RequirePermissions('ADMIN:SuperAdmin')
    @ApiOperation({ summary: 'Atualizar tenant' })
    async atualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AtualizarTenantDto,
    ) {
        return this.tenantsService.atualizar(id, dto);
    }
}