import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    UseGuards,
    ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { CriarTagDto } from './dto/criar-tag.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Tenant } from '../../common/decorators/tenant.decorator';
import { RequirePermissions } from '../../common/guards/permissions.guard';
import type { TenantContext } from '../../common/interfaces/tenant-context.interface';

@ApiTags('Tags')
@ApiBearerAuth()
@Controller('conteudos/tags')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @Post()
    @RequirePermissions('CONTEUDOS:Admin')
    @ApiOperation({ summary: 'Criar tag' })
    async criar(@Tenant() tenant: TenantContext, @Body() dto: CriarTagDto) {
        return this.tagsService.criar(tenant.tenantId, dto);
    }

    @Get()
    @Public()
    @ApiOperation({ summary: 'Listar tags' })
    async listar(@Tenant() tenant: TenantContext) {
        return this.tagsService.listar(tenant.tenantId);
    }

    @Get('pesquisar')
    @Public()
    @ApiOperation({ summary: 'Pesquisar tags' })
    async pesquisar(
        @Tenant() tenant: TenantContext,
        @Query('termo') termo: string,
    ) {
        return this.tagsService.pesquisar(tenant.tenantId, termo);
    }

    @Get(':id')
    @Public()
    @ApiOperation({ summary: 'Obter tag por ID' })
    async obterPorId(
        @Tenant() tenant: TenantContext,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.tagsService.obterPorId(tenant.tenantId, id);
    }
}
