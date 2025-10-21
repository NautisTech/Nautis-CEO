import {
    Controller,
    Get,
    Param,
    Query,
    ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ConteudosService } from './conteudos.service';
import { FiltrarConteudosDto } from './dto/filtrar-conteudos.dto';
import { Public } from '../../common/guards/jwt-auth.guard';

@ApiTags('Conteúdos Públicos')
@Controller('public/conteudos')
@Public() // Tornar todas as rotas públicas
export class ConteudosPublicController {
    constructor(private readonly conteudosService: ConteudosService) { }

    @Get(':tenantId')
    @ApiOperation({ summary: 'Listar conteúdos públicos por tenant' })
    @ApiQuery({ name: 'tipoConteudoId', required: false, type: Number })
    @ApiQuery({ name: 'categoriaId', required: false, type: Number })
    @ApiQuery({ name: 'destaque', required: false, type: Boolean })
    @ApiQuery({ name: 'textoPesquisa', required: false, type: String })
    @ApiQuery({ name: 'tag', required: false, type: String })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'pageSize', required: false, type: Number })
    async listar(
        @Param('tenantId', ParseIntPipe) tenantId: number,
        @Query() filtros: FiltrarConteudosDto,
    ) {
        // Forçar apenas conteúdos publicados
        return this.conteudosService.listar(tenantId, {
            ...filtros,
            status: 'publicado' as any,
        });
    }

    @Get(':tenantId/slug/:slug')
    @ApiOperation({ summary: 'Obter conteúdo público por slug e tenant' })
    async obterPorSlug(
        @Param('tenantId', ParseIntPipe) tenantId: number,
        @Param('slug') slug: string,
    ) {
        const conteudo = await this.conteudosService.obterPorSlug(tenantId, slug);

        // Verificar se está publicado
        if (conteudo.status !== 'publicado') {
            throw new Error('Conteúdo não disponível');
        }

        // Registrar visualização sem user
        await this.conteudosService.registrarVisualizacao(
            tenantId,
            slug,
            undefined, // sem userId
            undefined, // sem IP (ou pegar do request se necessário)
            undefined, // sem userAgent
        );

        return conteudo;
    }
}