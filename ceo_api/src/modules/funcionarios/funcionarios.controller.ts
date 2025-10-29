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

    @Get('tipos-funcionario')
    @RequirePermissions('RH:Listar')
    @ApiOperation({ summary: 'Listar tipos de funcionário' })
    async listarTiposFuncionario(@Request() req) {
        return this.funcionariosService.listarTiposFuncionario(req.user.tenantId);
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

    @Put(':id')
    @RequirePermissions('RH:Editar')
    @ApiOperation({ summary: 'Atualizar funcionário' })
    async atualizar(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: CriarFuncionarioDto,
    ) {
        return this.funcionariosService.atualizar(req.user.tenantId, id, dto);
    }

    @Patch(':id/desativar')
    @RequirePermissions('RH:Editar')
    @ApiOperation({ summary: 'Desativar/ativar funcionário' })
    async toggleAtivo(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.funcionariosService.toggleAtivo(req.user.tenantId, id);
    }

    // ========== CONTATOS ==========
    @Get(':id/contatos')
    @RequirePermissions('RH:Listar')
    @ApiOperation({ summary: 'Listar contatos do funcionário' })
    async listarContatos(
        @Request() req,
        @Param('id', ParseIntPipe) funcionarioId: number,
    ) {
        return this.funcionariosService.listarContatos(req.user.tenantId, funcionarioId);
    }

    @Post('contatos')
    @RequirePermissions('RH:Criar')
    @ApiOperation({ summary: 'Criar contato' })
    async criarContato(@Request() req, @Body() data: any) {
        return this.funcionariosService.criarContato(req.user.tenantId, data);
    }

    @Put('contatos/:id')
    @RequirePermissions('RH:Editar')
    @ApiOperation({ summary: 'Atualizar contato' })
    async atualizarContato(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() data: any,
    ) {
        return this.funcionariosService.atualizarContato(req.user.tenantId, id, data);
    }

    @Delete('contatos/:id')
    @RequirePermissions('RH:Apagar')
    @ApiOperation({ summary: 'Deletar contato' })
    async deletarContato(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.funcionariosService.deletarContato(req.user.tenantId, id);
    }

    // ========== ENDEREÇOS ==========
    @Get(':id/enderecos')
    @RequirePermissions('RH:Listar')
    @ApiOperation({ summary: 'Listar endereços do funcionário' })
    async listarEnderecos(
        @Request() req,
        @Param('id', ParseIntPipe) funcionarioId: number,
    ) {
        return this.funcionariosService.listarEnderecos(req.user.tenantId, funcionarioId);
    }

    @Post('enderecos')
    @RequirePermissions('RH:Criar')
    @ApiOperation({ summary: 'Criar endereço' })
    async criarEndereco(@Request() req, @Body() data: any) {
        return this.funcionariosService.criarEndereco(req.user.tenantId, data);
    }

    @Put('enderecos/:id')
    @RequirePermissions('RH:Editar')
    @ApiOperation({ summary: 'Atualizar endereço' })
    async atualizarEndereco(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() data: any,
    ) {
        return this.funcionariosService.atualizarEndereco(req.user.tenantId, id, data);
    }

    @Delete('enderecos/:id')
    @RequirePermissions('RH:Apagar')
    @ApiOperation({ summary: 'Deletar endereço' })
    async deletarEndereco(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.funcionariosService.deletarEndereco(req.user.tenantId, id);
    }

    // ========== EMPREGOS ==========
    @Get(':id/empregos')
    @RequirePermissions('RH:Listar')
    @ApiOperation({ summary: 'Listar empregos do funcionário' })
    async listarEmpregos(
        @Request() req,
        @Param('id', ParseIntPipe) funcionarioId: number,
    ) {
        return this.funcionariosService.listarEmpregos(req.user.tenantId, funcionarioId);
    }

    @Post('empregos')
    @RequirePermissions('RH:Criar')
    @ApiOperation({ summary: 'Criar emprego' })
    async criarEmprego(@Request() req, @Body() data: any) {
        return this.funcionariosService.criarEmprego(req.user.tenantId, data);
    }

    @Put('empregos/:id')
    @RequirePermissions('RH:Editar')
    @ApiOperation({ summary: 'Atualizar emprego' })
    async atualizarEmprego(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() data: any,
    ) {
        return this.funcionariosService.atualizarEmprego(req.user.tenantId, id, data);
    }

    @Delete('empregos/:id')
    @RequirePermissions('RH:Apagar')
    @ApiOperation({ summary: 'Deletar emprego' })
    async deletarEmprego(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.funcionariosService.deletarEmprego(req.user.tenantId, id);
    }

    // ========== BENEFÍCIOS ==========
    @Get(':id/beneficios')
    @RequirePermissions('RH:Listar')
    @ApiOperation({ summary: 'Listar benefícios do funcionário' })
    async listarBeneficios(
        @Request() req,
        @Param('id', ParseIntPipe) funcionarioId: number,
    ) {
        return this.funcionariosService.listarBeneficios(req.user.tenantId, funcionarioId);
    }

    @Post('beneficios')
    @RequirePermissions('RH:Criar')
    @ApiOperation({ summary: 'Criar benefício' })
    async criarBeneficio(@Request() req, @Body() data: any) {
        return this.funcionariosService.criarBeneficio(req.user.tenantId, data);
    }

    @Put('beneficios/:id')
    @RequirePermissions('RH:Editar')
    @ApiOperation({ summary: 'Atualizar benefício' })
    async atualizarBeneficio(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() data: any,
    ) {
        return this.funcionariosService.atualizarBeneficio(req.user.tenantId, id, data);
    }

    @Delete('beneficios/:id')
    @RequirePermissions('RH:Apagar')
    @ApiOperation({ summary: 'Deletar benefício' })
    async deletarBeneficio(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.funcionariosService.deletarBeneficio(req.user.tenantId, id);
    }

    // ========== DOCUMENTOS ==========
    @Get(':id/documentos')
    @RequirePermissions('RH:Listar')
    @ApiOperation({ summary: 'Listar documentos do funcionário' })
    async listarDocumentos(
        @Request() req,
        @Param('id', ParseIntPipe) funcionarioId: number,
    ) {
        return this.funcionariosService.listarDocumentos(req.user.tenantId, funcionarioId);
    }

    @Post('documentos')
    @RequirePermissions('RH:Criar')
    @ApiOperation({ summary: 'Criar documento' })
    async criarDocumento(@Request() req, @Body() data: any) {
        return this.funcionariosService.criarDocumento(req.user.tenantId, data);
    }

    @Put('documentos/:id')
    @RequirePermissions('RH:Editar')
    @ApiOperation({ summary: 'Atualizar documento' })
    async atualizarDocumento(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() data: any,
    ) {
        return this.funcionariosService.atualizarDocumento(req.user.tenantId, id, data);
    }

    @Delete('documentos/:id')
    @RequirePermissions('RH:Apagar')
    @ApiOperation({ summary: 'Deletar documento' })
    async deletarDocumento(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.funcionariosService.deletarDocumento(req.user.tenantId, id);
    }
}