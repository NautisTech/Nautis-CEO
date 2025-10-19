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
import { TagsService } from './tags.service';
import { CriarTagDto } from './dto/criar-tag.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Tenant } from '../../common/decorators/tenant.decorator';
import { RequirePermissions } from '../../common/guards/permissions.guard';

@ApiTags('Tags')
@ApiBearerAuth()
@Controller('conteudos/tags')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @Post()
    @RequirePermissions('CONTEUDOS:Admin')
    @ApiOperation({ summary: 'Criar tag' })
    async criar(@Request() req, @Body() dto: CriarTagDto) {
        return this.tagsService.criar(req.user.tenantId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar tags' })
    async listar(@Request() req) {
        return this.tagsService.listar(req.user.tenantId);
    }

    @Get('pesquisar')
    @ApiOperation({ summary: 'Pesquisar tags' })
    async pesquisar(
        @Request() req,
        @Query('termo') termo: string,
    ) {
        return this.tagsService.pesquisar(req.user.tenantId, termo);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obter tag por ID' })
    async obterPorId(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.tagsService.obterPorId(req.user.tenantId, id);
    }
}
