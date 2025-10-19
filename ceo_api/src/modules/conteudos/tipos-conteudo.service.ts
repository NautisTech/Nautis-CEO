import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../shared/base/base.service';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class TiposConteudoService extends BaseService {
    constructor(databaseService: DatabaseService) {
        super(databaseService);
    }

    async listar(tenantId: number) {
        const result = await this.executeQuery(
            tenantId,
            `
      SELECT 
        id,
        codigo,
        nome,
        descricao,
        icone,
        permite_comentarios,
        permite_anexos,
        max_anexos,
        permite_galeria,
        requer_aprovacao,
        template_visualizacao,
        configuracao_campos,
        ativo
      FROM tipos_conteudo
      WHERE ativo = 1
      ORDER BY nome
    `,
        );

        return result;
    }

    async obterPorId(tenantId: number, id: number) {
        const result = await this.executeQuery(
            tenantId,
            `
      SELECT 
        id,
        codigo,
        nome,
        descricao,
        icone,
        permite_comentarios,
        permite_anexos,
        max_anexos,
        permite_galeria,
        requer_aprovacao,
        template_visualizacao,
        configuracao_campos,
        ativo,
        criado_em,
        atualizado_em
      FROM tipos_conteudo
      WHERE id = @id
    `,
            { id },
        );

        if (!result[0]) {
            throw new NotFoundException('Tipo de conteúdo não encontrado');
        }

        return result[0];
    }

    async obterSchemaCampos(tenantId: number, tipoConteudoId: number) {
        const tipo = await this.obterPorId(tenantId, tipoConteudoId);

        // Parse do JSON configuracao_campos com tratamento de erro
        let config: any = { campos_personalizados: [] };

        if (tipo.configuracao_campos) {
            try {
                const cleaned = tipo.configuracao_campos
                    .replace(/,(\s*[}\]])/g, '$1')  // Remove vírgula antes de ] ou }
                    .replace(/,(\s*,)/g, ',')       // Remove vírgulas duplicadas
                    .trim();

                const parsed = JSON.parse(cleaned);
                config = parsed;
            } catch (error) {
                console.error(`Falha na correção automática do JSON para tipo "${tipo.nome}":`, error);
            }
        }

        return {
            tipo_conteudo_id: tipo.id,
            codigo: tipo.codigo,
            nome: tipo.nome,
            campos_personalizados: Array.isArray(config.campos_personalizados)
                ? config.campos_personalizados
                : [],
        };
    }
}