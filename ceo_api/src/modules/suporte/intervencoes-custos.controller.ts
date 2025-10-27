import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { IntervencoesCustosService } from './intervencoes-custos.service';
import { CriarIntervencaoCustoDto } from './dto/criar-intervencao-custo.dto';
import { AtualizarIntervencaoCustoDto } from './dto/atualizar-intervencao-custo.dto';

@ApiTags('Intervenções - Custos')
@Controller('intervencoes-custos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class IntervencoesCustosController {
    constructor(private readonly intervencoesCustosService: IntervencoesCustosService) { }

    @Get()
    @ApiOperation({ summary: 'Listar custos de intervenções' })
    @ApiResponse({ status: 200, description: 'Lista de custos' })
    async listar(
        @Request() req,
        @Query('intervencao_id') intervencao_id?: string
    ) {
        return this.intervencoesCustosService.listar(
            req.user.tenantId,
            intervencao_id ? parseInt(intervencao_id) : undefined
        );
    }

    @Get('intervencao/:intervencaoId/total')
    @ApiOperation({ summary: 'Obter total de custos de uma intervenção' })
    @ApiResponse({ status: 200, description: 'Total de custos' })
    async obterTotal(@Request() req, @Param('intervencaoId') intervencaoId: string) {
        return this.intervencoesCustosService.obterTotalPorIntervencao(
            req.user.tenantId,
            parseInt(intervencaoId)
        );
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obter custo por ID' })
    @ApiResponse({ status: 200, description: 'Custo encontrado' })
    @ApiResponse({ status: 404, description: 'Custo não encontrado' })
    async obterPorId(@Request() req, @Param('id') id: string) {
        return this.intervencoesCustosService.obterPorId(req.user.tenantId, parseInt(id));
    }

    @Post()
    @ApiOperation({ summary: 'Criar custo de intervenção' })
    @ApiResponse({ status: 201, description: 'Custo criado com sucesso' })
    async criar(@Request() req, @Body() dto: CriarIntervencaoCustoDto) {
        return this.intervencoesCustosService.criar(req.user.tenantId, dto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar custo de intervenção' })
    @ApiResponse({ status: 200, description: 'Custo atualizado com sucesso' })
    @ApiResponse({ status: 404, description: 'Custo não encontrado' })
    async atualizar(
        @Request() req,
        @Param('id') id: string,
        @Body() dto: AtualizarIntervencaoCustoDto
    ) {
        return this.intervencoesCustosService.atualizar(req.user.tenantId, parseInt(id), dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remover custo de intervenção' })
    @ApiResponse({ status: 200, description: 'Custo removido com sucesso' })
    @ApiResponse({ status: 404, description: 'Custo não encontrado' })
    async remover(@Request() req, @Param('id') id: string) {
        return this.intervencoesCustosService.remover(req.user.tenantId, parseInt(id));
    }
}
