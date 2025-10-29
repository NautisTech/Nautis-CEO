import { Controller, Get, Post, Put, Delete, Param, Query, Body, Request, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FormacoesService } from './formacoes.service';
import { CriarFormacaoDto } from './dto/criar-formacao.dto';
import { CriarModuloDto } from './dto/criar-modulo.dto';
import { CriarAulaDto } from './dto/criar-aula.dto';
import { CriarBlocoDto } from './dto/criar-bloco.dto';
import { CriarQuizDto } from './dto/criar-quiz.dto';
import { CriarPerguntaDto } from './dto/criar-pergunta.dto';

@ApiTags('Formações')
@Controller('formacoes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FormacoesController {
    constructor(private readonly formacoesService: FormacoesService) { }

    @Post()
    @ApiOperation({ summary: 'Criar nova formação' })
    async criar(@Request() req, @Body() dto: CriarFormacaoDto) {
        return this.formacoesService.criarFormacao(req.user.tenantId, req.user.id, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todas as formações disponíveis' })
    @ApiQuery({ name: 'categoria', required: false, type: String })
    @ApiQuery({ name: 'nivel', required: false, type: String })
    async listar(
        @Request() req,
        @Query('categoria') categoria?: string,
        @Query('nivel') nivel?: string,
    ) {
        return this.formacoesService.listarFormacoes(req.user.tenantId, { categoria, nivel });
    }

    @Get('disponiveis')
    @ApiOperation({ summary: 'Listar formações disponíveis (funcionários: todas publicadas | clientes: apenas inscritas)' })
    async disponiveis(@Request() req) {
        return this.formacoesService.listarFormacoesDisponiveis(req.user.tenantId, req.user.id);
    }

    @Get('minhas')
    @ApiOperation({ summary: 'Listar minhas formações (inscrições)' })
    async minhas(@Request() req) {
        return this.formacoesService.listarMinhasFormacoes(req.user.tenantId, req.user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obter detalhes de uma formação' })
    async obter(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.formacoesService.obterFormacao(req.user.tenantId, id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar formação' })
    async atualizar(@Param('id', ParseIntPipe) id: number, @Request() req, @Body() dto: Partial<CriarFormacaoDto>) {
        return this.formacoesService.atualizarFormacao(req.user.tenantId, id, dto);
    }

    @Post(':id/inscrever')
    @ApiOperation({ summary: 'Inscrever-se numa formação' })
    async inscrever(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.formacoesService.inscreverFormacao(req.user.tenantId, req.user.id, id);
    }

    @Get(':id/modulos')
    @ApiOperation({ summary: 'Listar módulos de uma formação' })
    async listarModulos(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.formacoesService.listarModulos(req.user.tenantId, id);
    }

    @Post('modulos')
    @ApiOperation({ summary: 'Criar novo módulo' })
    async criarModulo(@Request() req, @Body() dto: CriarModuloDto) {
        return this.formacoesService.criarModulo(req.user.tenantId, req.user.id, dto);
    }

    @Post('aulas')
    @ApiOperation({ summary: 'Criar nova aula' })
    async criarAula(@Request() req, @Body() dto: CriarAulaDto) {
        return this.formacoesService.criarAula(req.user.tenantId, dto);
    }

    @Get('modulos/:id/aulas')
    @ApiOperation({ summary: 'Listar aulas de um módulo' })
    async listarAulas(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.formacoesService.listarAulas(req.user.tenantId, id);
    }

    @Post('blocos')
    @ApiOperation({ summary: 'Criar novo bloco' })
    async criarBloco(@Request() req, @Body() dto: CriarBlocoDto) {
        return this.formacoesService.criarBloco(req.user.tenantId, dto);
    }

    @Get('aulas/:id/blocos')
    @ApiOperation({ summary: 'Listar blocos de uma aula' })
    async listarBlocos(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.formacoesService.listarBlocos(req.user.tenantId, id);
    }

    @Post('blocos/:id/anexos')
    @ApiOperation({ summary: 'Adicionar anexo a um bloco' })
    async adicionarAnexoBloco(
        @Param('id', ParseIntPipe) id: number,
        @Request() req,
        @Body() body: { upload_id: number; nome: string }
    ) {
        // upload_id do frontend corresponde a anexo_id no backend
        return this.formacoesService.adicionarAnexoBloco(req.user.tenantId, id, body.upload_id, body.nome);
    }

    @Get('blocos/:id/anexos')
    @ApiOperation({ summary: 'Listar anexos de um bloco' })
    async listarAnexosBloco(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.formacoesService.listarAnexosBloco(req.user.tenantId, id);
    }

    @Delete('blocos/:id/anexos/:anexoId')
    @ApiOperation({ summary: 'Remover anexo de um bloco' })
    async removerAnexoBloco(
        @Param('id', ParseIntPipe) id: number,
        @Param('anexoId', ParseIntPipe) anexoId: number,
        @Request() req
    ) {
        return this.formacoesService.removerAnexoBloco(req.user.tenantId, id, anexoId);
    }

    @Post('quiz')
    @ApiOperation({ summary: 'Criar quiz' })
    async criarQuiz(@Request() req, @Body() dto: CriarQuizDto) {
        return this.formacoesService.criarQuiz(req.user.tenantId, dto);
    }

    @Get(':id/quiz')
    @ApiOperation({ summary: 'Listar quizzes de uma formação' })
    async listarQuizzes(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.formacoesService.listarQuizzes(req.user.tenantId, id);
    }

    @Post('quiz/perguntas')
    @ApiOperation({ summary: 'Criar pergunta' })
    async criarPergunta(@Request() req, @Body() dto: CriarPerguntaDto) {
        return this.formacoesService.criarPergunta(req.user.tenantId, dto);
    }

    @Get('quiz/:id/perguntas')
    @ApiOperation({ summary: 'Listar perguntas de um quiz' })
    async listarPerguntas(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.formacoesService.listarPerguntas(req.user.tenantId, id);
    }

    @Delete('quiz/perguntas/:id')
    @ApiOperation({ summary: 'Remover pergunta' })
    async removerPergunta(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.formacoesService.removerPergunta(req.user.tenantId, id);
    }

    @Post('aulas/:id/concluir')
    @ApiOperation({ summary: 'Marcar aula como concluída/não concluída' })
    async marcarAulaConcluida(
        @Param('id', ParseIntPipe) id: number,
        @Body('concluida') concluida: boolean,
        @Request() req
    ) {
        return this.formacoesService.marcarAulaConcluida(req.user.tenantId, req.user.id, id, concluida);
    }

    @Get('clientes/todos')
    @ApiOperation({ summary: 'Listar todos os clientes disponíveis' })
    async listarTodosClientes(@Request() req) {
        return this.formacoesService.listarTodosClientes(req.user.tenantId);
    }

    @Get(':id/progresso')
    @ApiOperation({ summary: 'Obter progresso das aulas de uma formação' })
    async obterProgressoFormacao(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.formacoesService.obterProgressoFormacao(req.user.tenantId, req.user.id, id);
    }

    @Get(':id/clientes')
    @ApiOperation({ summary: 'Listar clientes associados a uma formação' })
    async listarClientesFormacao(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.formacoesService.listarClientesFormacao(req.user.tenantId, id);
    }

    @Post(':id/clientes/:clienteId')
    @ApiOperation({ summary: 'Associar cliente a uma formação' })
    async associarCliente(
        @Param('id', ParseIntPipe) id: number,
        @Param('clienteId', ParseIntPipe) clienteId: number,
        @Request() req
    ) {
        return this.formacoesService.associarCliente(req.user.tenantId, id, clienteId);
    }

    @Delete(':id/clientes/:clienteId')
    @ApiOperation({ summary: 'Desassociar cliente de uma formação' })
    async desassociarCliente(
        @Param('id', ParseIntPipe) id: number,
        @Param('clienteId', ParseIntPipe) clienteId: number,
        @Request() req
    ) {
        return this.formacoesService.desassociarCliente(req.user.tenantId, id, clienteId);
    }
}
