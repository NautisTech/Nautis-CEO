import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    Request,
    UseGuards,
    ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MarcasService } from './marcas.service';
import { CriarMarcaDto } from './dto/criar-marca.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/guards/permissions.guard';

@ApiTags('Marcas')
@ApiBearerAuth()
@Controller('marcas')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MarcasController {
    constructor(private readonly marcasService: MarcasService) { }

    @Post()
    @RequirePermissions('EQUIPAMENTOS:Criar')
    @ApiOperation({ summary: 'Criar nova marca' })
    async criar(
        @Request() req,
        @Body() dto: CriarMarcaDto,
    ) {
        return this.marcasService.criar(req.user.tenantId, dto);
    }

    @Get()
    @RequirePermissions('EQUIPAMENTOS:Listar')
    @ApiOperation({ summary: 'Listar marcas' })
    async listar(
        @Request() req,
        @Query('ativo') ativo?: boolean,
        @Query('page') page?: number,
        @Query('pageSize') pageSize?: number,
    ) {
        return this.marcasService.listar(req.user.tenantId, { ativo, page, pageSize });
    }

    @Get(':id')
    @RequirePermissions('EQUIPAMENTOS:Visualizar')
    @ApiOperation({ summary: 'Obter marca por ID' })
    async obterPorId(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.marcasService.obterPorId(req.user.tenantId, id);
    }

    @Put(':id')
    @RequirePermissions('EQUIPAMENTOS:Editar')
    @ApiOperation({ summary: 'Atualizar marca' })
    async atualizar(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: CriarMarcaDto,
    ) {
        return this.marcasService.atualizar(req.user.tenantId, id, dto);
    }

    @Delete(':id')
    @RequirePermissions('EQUIPAMENTOS:Apagar')
    @ApiOperation({ summary: 'Deletar marca' })
    async deletar(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.marcasService.deletar(req.user.tenantId, id);
    }
}
