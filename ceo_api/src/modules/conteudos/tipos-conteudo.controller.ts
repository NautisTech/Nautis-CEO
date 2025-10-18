import {
    Controller,
    Get,
    Param,
    UseGuards,
    Request,
    ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TiposConteudoService } from './tipos-conteudo.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Tenant } from '../../common/decorators/tenant.decorator';

@ApiTags('Tipos de Conteúdo')
@ApiBearerAuth()
@Controller('tipos-conteudo')
@UseGuards(JwtAuthGuard)
export class TiposConteudoController {
    constructor(private readonly tiposConteudoService: TiposConteudoService) { }

    @Get()
    @ApiOperation({ summary: 'Listar tipos de conteúdo' })
    async listar(@Request() req) {
        return this.tiposConteudoService.listar(req.user.tenantId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obter tipo de conteúdo por ID' })
    async obterPorId(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.tiposConteudoService.obterPorId(req.user.tenantId, id);
    }

    @Get(':id/schema')
    @ApiOperation({ summary: 'Obter schema de campos do tipo' })
    async obterSchema(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.tiposConteudoService.obterSchemaCampos(req.user.tenantId, id);
    }
}
