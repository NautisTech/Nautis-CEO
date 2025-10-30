import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import * as sql from 'mssql';
import { CriarFormacaoDto } from './dto/criar-formacao.dto';
import { CriarModuloDto } from './dto/criar-modulo.dto';
import { CriarAulaDto } from './dto/criar-aula.dto';
import { CriarBlocoDto } from './dto/criar-bloco.dto';
import { CriarQuizDto } from './dto/criar-quiz.dto';
import { CriarPerguntaDto } from './dto/criar-pergunta.dto';

@Injectable()
export class FormacoesService {
    constructor(private readonly databaseService: DatabaseService) { }

    /**
     * Criar formação
     */
    async criarFormacao(tenantId: number, userId: number, dto: CriarFormacaoDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request()
            .input('titulo', sql.NVarChar(255), dto.titulo)
            .input('descricao', sql.NVarChar(sql.MAX), dto.descricao)
            .input('categoria', sql.NVarChar(100), dto.categoria)
            .input('nivel', sql.NVarChar(50), dto.nivel)
            .input('duracao_minutos', sql.Int, dto.duracao_minutos || null)
            .input('capa_url', sql.NVarChar(sql.MAX), dto.capa_url || null)
            .input('autor_id', sql.Int, userId)
            .input('publicado', sql.Bit, dto.publicado ? 1 : 0)
            .input('ativo', sql.Bit, 1)
            .query(`
                INSERT INTO formacoes (
                    titulo, descricao, categoria, nivel, duracao_minutos,
                    capa_url, autor_id, publicado, ativo, criado_em, atualizado_em
                )
                OUTPUT INSERTED.*
                VALUES (
                    @titulo, @descricao, @categoria, @nivel, @duracao_minutos,
                    @capa_url, @autor_id, @publicado, @ativo, GETDATE(), GETDATE()
                )
            `);

        return result.recordset[0];
    }

    /**
     * Atualizar formação
     */
    async atualizarFormacao(tenantId: number, formacaoId: number, dto: Partial<CriarFormacaoDto>) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const updates: string[] = [];
        const request = pool.request().input('formacaoId', sql.Int, formacaoId);

        if (dto.titulo !== undefined) {
            updates.push('titulo = @titulo');
            request.input('titulo', sql.NVarChar(255), dto.titulo);
        }
        if (dto.descricao !== undefined) {
            updates.push('descricao = @descricao');
            request.input('descricao', sql.NVarChar(sql.MAX), dto.descricao);
        }
        if (dto.categoria !== undefined) {
            updates.push('categoria = @categoria');
            request.input('categoria', sql.NVarChar(100), dto.categoria);
        }
        if (dto.nivel !== undefined) {
            updates.push('nivel = @nivel');
            request.input('nivel', sql.NVarChar(50), dto.nivel);
        }
        if (dto.duracao_minutos !== undefined) {
            updates.push('duracao_minutos = @duracao_minutos');
            request.input('duracao_minutos', sql.Int, dto.duracao_minutos);
        }
        if (dto.capa_url !== undefined) {
            updates.push('capa_url = @capa_url');
            request.input('capa_url', sql.NVarChar(sql.MAX), dto.capa_url || null);
        }
        if (dto.publicado !== undefined) {
            updates.push('publicado = @publicado');
            request.input('publicado', sql.Bit, dto.publicado ? 1 : 0);
        }

        if (updates.length === 0) {
            return { message: 'Nenhum campo para atualizar' };
        }

        updates.push('atualizado_em = GETDATE()');

        await request.query(`
            UPDATE formacoes
            SET ${updates.join(', ')}
            WHERE id = @formacaoId
        `);

        return this.obterFormacao(tenantId, formacaoId);
    }

    /**
     * Criar módulo
     */
    async criarModulo(tenantId: number, userId: number, dto: CriarModuloDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request()
            .input('formacao_id', sql.Int, dto.formacao_id)
            .input('titulo', sql.NVarChar(255), dto.titulo)
            .input('descricao', sql.NVarChar(sql.MAX), dto.descricao || null)
            .input('categoria', sql.NVarChar(100), dto.categoria || null)
            .input('nivel', sql.NVarChar(50), dto.nivel || null)
            .input('duracao_total', sql.Int, dto.duracao_total || null)
            .input('capa_url', sql.NVarChar(500), dto.capa_url || null)
            .input('ativo', sql.Bit, dto.ativo !== undefined ? (dto.ativo ? 1 : 0) : 1)
            .input('criado_por', sql.Int, userId)
            .query(`
                INSERT INTO m_formacoes (
                    formacao_id, titulo, descricao, categoria, nivel,
                    duracao_total, capa_url, ativo, criado_por, criado_em, atualizado_em
                )
                OUTPUT INSERTED.*
                VALUES (
                    @formacao_id, @titulo, @descricao, @categoria, @nivel,
                    @duracao_total, @capa_url, @ativo, @criado_por, GETDATE(), GETDATE()
                )
            `);

        return result.recordset[0];
    }

    /**
     * Listar todas as formações publicadas
     */
    async listarFormacoes(tenantId: number, filtros?: { categoria?: string; nivel?: string }) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        let whereClause = 'WHERE 1=1';

        if (filtros?.categoria) {
            whereClause += ` AND f.categoria = '${filtros.categoria}'`;
        }
        if (filtros?.nivel) {
            whereClause += ` AND f.nivel = '${filtros.nivel}'`;
        }

        const result = await pool.request().query(`
            SELECT
                f.id,
                f.titulo,
                f.descricao,
                f.categoria,
                f.nivel,
                f.capa_url,
                f.autor_id,
                f.publicado,
                f.ativo,
                f.criado_em,
                f.atualizado_em,
                u.username as autor_nome,
                COUNT(DISTINCT m.id) as total_modulos,
                COUNT(DISTINCT fc.id) as total_alunos,
                AVG(fc.progresso) as progresso_medio,
                ISNULL((
                    SELECT SUM(ISNULL(a.duracao_minutos, 0))
                    FROM m_formacoes m2
                    INNER JOIN a_formacoes a ON a.m_formacao_id = m2.id
                    WHERE m2.formacao_id = f.id AND m2.ativo = 1 AND a.publicado = 1
                ), 0) as duracao_minutos
            FROM formacoes f
            LEFT JOIN utilizadores u ON u.id = f.autor_id
            LEFT JOIN m_formacoes m ON m.formacao_id = f.id AND m.ativo = 1
            LEFT JOIN formacoes_clientes fc ON fc.formacao_id = f.id AND fc.ativo = 1
            ${whereClause}
            GROUP BY f.id, f.titulo, f.descricao, f.categoria, f.nivel,
                     f.capa_url, f.autor_id, f.publicado, f.ativo, f.criado_em,
                     f.atualizado_em, u.username
            ORDER BY f.criado_em DESC
        `);

        return result.recordset;
    }

    /**
     * Obter detalhes de uma formação específica
     */
    async obterFormacao(tenantId: number, formacaoId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request()
            .input('formacaoId', sql.Int, formacaoId)
            .query(`
                SELECT
                    f.id,
                    f.titulo,
                    f.descricao,
                    f.categoria,
                    f.nivel,
                    f.capa_url,
                    f.autor_id,
                    f.publicado,
                    f.ativo,
                    f.criado_em,
                    f.atualizado_em,
                    u.username as autor_nome,
                    COUNT(DISTINCT m.id) as total_modulos,
                    COUNT(DISTINCT fc.id) as total_alunos,
                    ISNULL((
                        SELECT SUM(ISNULL(a.duracao_minutos, 0))
                        FROM m_formacoes m2
                        INNER JOIN a_formacoes a ON a.m_formacao_id = m2.id
                        WHERE m2.formacao_id = f.id AND m2.ativo = 1 AND a.publicado = 1
                    ), 0) as duracao_minutos
                FROM formacoes f
                LEFT JOIN utilizadores u ON u.id = f.autor_id
                LEFT JOIN m_formacoes m ON m.formacao_id = f.id AND m.ativo = 1
                LEFT JOIN formacoes_clientes fc ON fc.formacao_id = f.id AND fc.ativo = 1
                WHERE f.id = @formacaoId AND f.ativo = 1
                GROUP BY f.id, f.titulo, f.descricao, f.categoria, f.nivel,
                         f.capa_url, f.autor_id, f.publicado, f.ativo, f.criado_em,
                         f.atualizado_em, u.username
            `);

        if (result.recordset.length === 0) {
            throw new NotFoundException('Formação não encontrada');
        }

        return result.recordset[0];
    }

    /**
     * Listar minhas formações (como aluno)
     */
    async listarMinhasFormacoes(tenantId: number, userId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT
                    f.*,
                    u.username as autor_nome,
                    fc.progresso,
                    fc.horas_estudo,
                    fc.nota_final,
                    fc.data_inscricao,
                    fc.data_conclusao,
                    COUNT(DISTINCT m.id) as total_modulos
                FROM formacoes_clientes fc
                INNER JOIN formacoes f ON f.id = fc.formacao_id
                LEFT JOIN utilizadores u ON u.id = f.autor_id
                LEFT JOIN m_formacoes m ON m.formacao_id = f.id AND m.ativo = 1
                WHERE fc.cliente_id = @userId AND fc.ativo = 1
                GROUP BY f.id, f.titulo, f.descricao, f.categoria, f.nivel, f.duracao_minutos,
                         f.capa_url, f.autor_id, f.publicado, f.ativo, f.criado_em,
                         f.atualizado_em, u.username, fc.progresso, fc.horas_estudo,
                         fc.nota_final, fc.data_inscricao, fc.data_conclusao
                ORDER BY fc.data_inscricao DESC
            `);

        return result.recordset;
    }

    /**
     * Listar formações disponíveis para o utilizador
     * - Se for funcionário: todas as formações publicadas e ativas
     * - Se for cliente: apenas formações onde está inscrito em formacoes_clientes
     */
    async listarFormacoesDisponiveis(tenantId: number, userId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Verificar se é funcionário ou cliente
        const userCheck = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT funcionario_id, cliente_id
                FROM utilizadores
                WHERE id = @userId
            `);

        const user = userCheck.recordset[0];
        const isFuncionario = user?.funcionario_id !== null;

        let query = '';

        if (isFuncionario) {
            // Funcionário: todas as formações publicadas e ativas
            query = `
                SELECT
                    f.*,
                    u.username as autor_nome,
                    COUNT(DISTINCT m.id) as total_modulos,
                    COUNT(DISTINCT fc_all.id) as total_alunos,
                    AVG(fc_all.progresso) as progresso_medio
                FROM formacoes f
                LEFT JOIN utilizadores u ON u.id = f.autor_id
                LEFT JOIN m_formacoes m ON m.formacao_id = f.id AND m.ativo = 1
                LEFT JOIN formacoes_clientes fc_all ON fc_all.formacao_id = f.id AND fc_all.ativo = 1
                WHERE f.publicado = 1 AND f.ativo = 1
                GROUP BY f.id, f.titulo, f.descricao, f.categoria, f.nivel, f.duracao_minutos,
                         f.capa_url, f.autor_id, f.publicado, f.ativo, f.criado_em,
                         f.atualizado_em, u.username
                ORDER BY f.criado_em DESC
            `;
        } else {
            // Cliente: apenas formações inscritas
            query = `
                SELECT
                    f.*,
                    u.username as autor_nome,
                    fc.progresso,
                    fc.horas_estudo,
                    fc.nota_final,
                    fc.data_inscricao,
                    fc.data_conclusao,
                    COUNT(DISTINCT m.id) as total_modulos
                FROM formacoes_clientes fc
                INNER JOIN formacoes f ON f.id = fc.formacao_id
                LEFT JOIN utilizadores u ON u.id = f.autor_id
                LEFT JOIN m_formacoes m ON m.formacao_id = f.id AND m.ativo = 1
                WHERE fc.cliente_id = @userId AND fc.ativo = 1 AND f.publicado = 1 AND f.ativo = 1
                GROUP BY f.id, f.titulo, f.descricao, f.categoria, f.nivel, f.duracao_minutos,
                         f.capa_url, f.autor_id, f.publicado, f.ativo, f.criado_em,
                         f.atualizado_em, u.username, fc.progresso, fc.horas_estudo,
                         fc.nota_final, fc.data_inscricao, fc.data_conclusao
                ORDER BY fc.data_inscricao DESC
            `;
        }

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(query);

        return result.recordset;
    }

    /**
     * Inscrever-se numa formação
     */
    async inscreverFormacao(tenantId: number, userId: number, formacaoId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Verificar se já está inscrito
        const checkResult = await pool.request()
            .input('userId', sql.Int, userId)
            .input('formacaoId', sql.Int, formacaoId)
            .query(`
                SELECT id FROM formacoes_clientes
                WHERE cliente_id = @userId AND formacao_id = @formacaoId
            `);

        if (checkResult.recordset.length > 0) {
            return { message: 'Já está inscrito nesta formação' };
        }

        // Inscrever
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('formacaoId', sql.Int, formacaoId)
            .query(`
                INSERT INTO formacoes_clientes (formacao_id, cliente_id, data_inscricao, progresso, ativo, criado_em)
                VALUES (@formacaoId, @userId, GETDATE(), 0, 1, GETDATE())
            `);

        return { message: 'Inscrição realizada com sucesso' };
    }

    /**
     * Listar módulos de uma formação
     */
    async listarModulos(tenantId: number, formacaoId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request()
            .input('formacaoId', sql.Int, formacaoId)
            .query(`
                SELECT
                    m.id,
                    m.formacao_id,
                    m.titulo,
                    m.descricao,
                    m.categoria,
                    m.nivel,
                    m.ativo,
                    m.criado_por,
                    m.criado_em,
                    m.atualizado_em,
                    COUNT(DISTINCT af.id) as total_aulas,
                    u.username as criado_por_nome,
                    ISNULL((
                        SELECT SUM(ISNULL(a.duracao_minutos, 0))
                        FROM a_formacoes a
                        WHERE a.m_formacao_id = m.id AND a.publicado = 1
                    ), 0) as duracao_total
                FROM m_formacoes m
                LEFT JOIN a_formacoes af ON af.m_formacao_id = m.id AND af.publicado = 1
                LEFT JOIN utilizadores u ON u.id = m.criado_por
                WHERE m.formacao_id = @formacaoId AND m.ativo = 1
                GROUP BY m.id, m.formacao_id, m.titulo, m.descricao, m.categoria, m.nivel,
                         m.ativo, m.criado_por, m.criado_em, m.atualizado_em, u.username
                ORDER BY m.id
            `);

        return result.recordset;
    }

    /**
     * Listar aulas de um módulo
     */
    async listarAulas(tenantId: number, moduloId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request()
            .input('moduloId', sql.Int, moduloId)
            .query(`
                SELECT
                    a.*,
                    COUNT(DISTINCT b.id) as total_blocos
                FROM a_formacoes a
                LEFT JOIN a_formacoes_blocos b ON b.a_formacao_id = a.id
                WHERE a.m_formacao_id = @moduloId
                GROUP BY a.id, a.m_formacao_id, a.titulo, a.descricao, a.tipo, a.ordem,
                         a.duracao_minutos, a.publicado, a.criado_em, a.atualizado_em
                ORDER BY a.ordem, a.id
            `);

        return result.recordset;
    }

    /**
     * Criar aula
     */
    async criarAula(tenantId: number, dto: CriarAulaDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request()
            .input('m_formacao_id', sql.Int, dto.m_formacao_id)
            .input('titulo', sql.NVarChar(255), dto.titulo)
            .input('descricao', sql.NVarChar(sql.MAX), dto.descricao || null)
            .input('tipo', sql.NVarChar(50), dto.tipo)
            .input('ordem', sql.Int, dto.ordem)
            .input('duracao_minutos', sql.Decimal(5, 2), dto.duracao_minutos || null)
            .input('publicado', sql.Bit, dto.publicado !== undefined ? (dto.publicado ? 1 : 0) : 0)
            .query(`
                INSERT INTO a_formacoes (
                    m_formacao_id, titulo, descricao, tipo, ordem,
                    duracao_minutos, publicado, criado_em, atualizado_em
                )
                OUTPUT INSERTED.*
                VALUES (
                    @m_formacao_id, @titulo, @descricao, @tipo, @ordem,
                    @duracao_minutos, @publicado, GETDATE(), GETDATE()
                )
            `);

        return result.recordset[0];
    }

    /**
     * Listar blocos de uma aula
     */
    async listarBlocos(tenantId: number, aulaId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request()
            .input('aulaId', sql.Int, aulaId)
            .query(`
                SELECT
                    b.*,
                    COUNT(DISTINCT ba.id) as total_anexos
                FROM a_formacoes_blocos b
                LEFT JOIN a_formacoes_blocos_anexos ba ON ba.bloco_id = b.id
                WHERE b.a_formacao_id = @aulaId
                GROUP BY b.id, b.a_formacao_id, b.titulo, b.conteudo, b.tipo, b.ordem,
                         b.criado_em, b.atualizado_em
                ORDER BY b.ordem, b.id
            `);

        return result.recordset;
    }

    /**
     * Criar bloco
     */
    async criarBloco(tenantId: number, dto: CriarBlocoDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request()
            .input('a_formacao_id', sql.Int, dto.a_formacao_id)
            .input('titulo', sql.NVarChar(255), dto.titulo)
            .input('conteudo', sql.NVarChar(sql.MAX), dto.conteudo || null)
            .input('tipo', sql.NVarChar(50), dto.tipo)
            .input('ordem', sql.Int, dto.ordem)
            .query(`
                INSERT INTO a_formacoes_blocos (
                    a_formacao_id, titulo, conteudo, tipo, ordem,
                    criado_em, atualizado_em
                )
                OUTPUT INSERTED.*
                VALUES (
                    @a_formacao_id, @titulo, @conteudo, @tipo, @ordem,
                    GETDATE(), GETDATE()
                )
            `);

        return result.recordset[0];
    }

    /**
     * Adicionar anexo a um bloco
     */
    async adicionarAnexoBloco(tenantId: number, blocoId: number, anexoId: number, legenda: string) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Verificar se já existe um anexo principal
        const checkResult = await pool.request()
            .input('bloco_id', sql.Int, blocoId)
            .query(`
                SELECT COUNT(*) as total FROM a_formacoes_blocos_anexos
                WHERE bloco_id = @bloco_id AND principal = 1
            `);

        const temPrincipal = checkResult.recordset[0].total > 0;

        const result = await pool.request()
            .input('bloco_id', sql.Int, blocoId)
            .input('anexo_id', sql.Int, anexoId)
            .input('legenda', sql.NVarChar(255), legenda)
            .input('principal', sql.Bit, temPrincipal ? 0 : 1) // Primeiro anexo é principal
            .query(`
                INSERT INTO a_formacoes_blocos_anexos (
                    bloco_id, anexo_id, legenda, ordem, principal, criado_em
                )
                OUTPUT INSERTED.*
                VALUES (
                    @bloco_id, @anexo_id, @legenda,
                    (SELECT ISNULL(MAX(ordem), 0) + 1 FROM a_formacoes_blocos_anexos WHERE bloco_id = @bloco_id),
                    @principal, GETDATE()
                )
            `);

        return result.recordset[0];
    }

    /**
     * Listar anexos de um bloco
     */
    async listarAnexosBloco(tenantId: number, blocoId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request()
            .input('blocoId', sql.Int, blocoId)
            .query(`
                SELECT
                    ba.id,
                    ba.bloco_id,
                    ba.anexo_id as upload_id,
                    ba.legenda as nome,
                    a.nome_original,
                    a.caminho as url,
                    a.tipo,
                    a.tamanho_bytes,
                    a.mime_type,
                    a.variants,
                    ba.ordem,
                    ba.principal,
                    ba.criado_em
                FROM a_formacoes_blocos_anexos ba
                LEFT JOIN anexos a ON a.id = ba.anexo_id
                WHERE ba.bloco_id = @blocoId
                ORDER BY ba.ordem, ba.id
            `);

        return result.recordset;
    }

    /**
     * Remover anexo de um bloco
     */
    async removerAnexoBloco(tenantId: number, blocoId: number, anexoId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        await pool.request()
            .input('blocoId', sql.Int, blocoId)
            .input('anexoId', sql.Int, anexoId)
            .query(`
                DELETE FROM a_formacoes_blocos_anexos
                WHERE bloco_id = @blocoId AND id = @anexoId
            `);

        return { message: 'Anexo removido com sucesso' };
    }

    /**
     * Criar quiz
     */
    async criarQuiz(tenantId: number, dto: CriarQuizDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request()
            .input('formacao_id', sql.Int, dto.formacao_id)
            .input('titulo', sql.NVarChar(255), dto.titulo)
            .input('descricao', sql.NVarChar(sql.MAX), dto.descricao || null)
            .input('tempo_limite_minutos', sql.Int, dto.tempo_limite_minutos || null)
            .input('nota_minima_aprovacao', sql.Int, dto.nota_minima_aprovacao || null)
            .input('mostrar_resultados', sql.Bit, dto.mostrar_resultados !== undefined ? (dto.mostrar_resultados ? 1 : 0) : 1)
            .input('permitir_tentativas_multiplas', sql.Bit, dto.permitir_tentativas_multiplas !== undefined ? (dto.permitir_tentativas_multiplas ? 1 : 0) : 1)
            .input('max_tentativas', sql.Int, dto.max_tentativas || null)
            .input('ativo', sql.Bit, dto.ativo !== undefined ? (dto.ativo ? 1 : 0) : 1)
            .query(`
                INSERT INTO formacoes_quiz (
                    formacao_id, titulo, descricao, tempo_limite_minutos, nota_minima_aprovacao,
                    mostrar_resultados, permitir_tentativas_multiplas, max_tentativas, ativo,
                    criado_em, atualizado_em
                )
                OUTPUT INSERTED.*
                VALUES (
                    @formacao_id, @titulo, @descricao, @tempo_limite_minutos, @nota_minima_aprovacao,
                    @mostrar_resultados, @permitir_tentativas_multiplas, @max_tentativas, @ativo,
                    GETDATE(), GETDATE()
                )
            `);

        return result.recordset[0];
    }

    /**
     * Listar quizzes de uma formação
     */
    async listarQuizzes(tenantId: number, formacaoId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request()
            .input('formacaoId', sql.Int, formacaoId)
            .query(`
                SELECT
                    q.*,
                    COUNT(DISTINCT p.id) as total_perguntas
                FROM formacoes_quiz q
                LEFT JOIN formacoes_quiz_perguntas p ON p.quiz_id = q.id
                WHERE q.formacao_id = @formacaoId
                GROUP BY q.id, q.formacao_id, q.titulo, q.descricao, q.tempo_limite_minutos,
                         q.nota_minima_aprovacao, q.mostrar_resultados, q.permitir_tentativas_multiplas,
                         q.max_tentativas, q.ativo, q.criado_em, q.atualizado_em
                ORDER BY q.id
            `);

        return result.recordset;
    }

    /**
     * Criar pergunta
     */
    async criarPergunta(tenantId: number, dto: CriarPerguntaDto) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Inserir pergunta
        const result = await pool.request()
            .input('quiz_id', sql.Int, dto.quiz_id)
            .input('tipo', sql.NVarChar(50), dto.tipo)
            .input('enunciado', sql.NVarChar(sql.MAX), dto.enunciado)
            .input('pontuacao', sql.Int, dto.pontuacao)
            .input('ordem', sql.Int, dto.ordem)
            .query(`
                INSERT INTO formacoes_quiz_perguntas (
                    quiz_id, tipo, enunciado, pontuacao, ordem, criado_em, atualizado_em
                )
                OUTPUT INSERTED.*
                VALUES (
                    @quiz_id, @tipo, @enunciado, @pontuacao, @ordem, GETDATE(), GETDATE()
                )
            `);

        const pergunta = result.recordset[0];

        // Se for pergunta de múltipla escolha, inserir opções
        if (dto.tipo === 'multipla' && dto.opcoes && dto.opcoes.length > 0) {
            for (const opcao of dto.opcoes) {
                await pool.request()
                    .input('pergunta_id', sql.Int, pergunta.id)
                    .input('texto', sql.NVarChar(500), opcao.texto)
                    .input('correta', sql.Bit, opcao.correta ? 1 : 0)
                    .input('ordem', sql.Int, opcao.ordem)
                    .query(`
                        INSERT INTO formacoes_quiz_opcoes (
                            pergunta_id, texto, correta, ordem
                        )
                        VALUES (
                            @pergunta_id, @texto, @correta, @ordem
                        )
                    `);
            }
        }

        return pergunta;
    }

    /**
     * Listar perguntas de um quiz
     */
    async listarPerguntas(tenantId: number, quizId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Buscar perguntas
        const perguntas = await pool.request()
            .input('quizId', sql.Int, quizId)
            .query(`
                SELECT * FROM formacoes_quiz_perguntas
                WHERE quiz_id = @quizId
                ORDER BY ordem, id
            `);

        // Buscar opções para perguntas de múltipla escolha
        const opcoes = await pool.request()
            .input('quizId', sql.Int, quizId)
            .query(`
                SELECT o.*
                FROM formacoes_quiz_opcoes o
                INNER JOIN formacoes_quiz_perguntas p ON p.id = o.pergunta_id
                WHERE p.quiz_id = @quizId
                ORDER BY o.ordem
            `);

        // Associar opções às perguntas
        const result = perguntas.recordset.map(pergunta => ({
            ...pergunta,
            opcoes: opcoes.recordset.filter(o => o.pergunta_id === pergunta.id)
        }));

        return result;
    }

    /**
     * Remover pergunta
     */
    async removerPergunta(tenantId: number, perguntaId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // As opções serão removidas automaticamente por CASCADE
        await pool.request()
            .input('perguntaId', sql.Int, perguntaId)
            .query(`
                DELETE FROM formacoes_quiz_perguntas
                WHERE id = @perguntaId
            `);

        return { message: 'Pergunta removida com sucesso' };
    }

    /**
     * Marcar aula como concluída/não concluída
     */
    async marcarAulaConcluida(tenantId: number, userId: number, aulaId: number, concluida: boolean) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Verificar se já existe registro
        const checkResult = await pool.request()
            .input('userId', sql.Int, userId)
            .input('aulaId', sql.Int, aulaId)
            .query(`
                SELECT id FROM a_formacoes_progresso
                WHERE aluno_id = @userId AND a_formacao_id = @aulaId
            `);

        if (checkResult.recordset.length > 0) {
            // Atualizar
            await pool.request()
                .input('userId', sql.Int, userId)
                .input('aulaId', sql.Int, aulaId)
                .input('visto', sql.Bit, concluida ? 1 : 0)
                .input('data_conclusao', sql.DateTime, concluida ? new Date() : null)
                .query(`
                    UPDATE a_formacoes_progresso
                    SET visto = @visto,
                        data_conclusao = @data_conclusao
                    WHERE aluno_id = @userId AND a_formacao_id = @aulaId
                `);
        } else {
            // Inserir
            await pool.request()
                .input('userId', sql.Int, userId)
                .input('aulaId', sql.Int, aulaId)
                .input('visto', sql.Bit, concluida ? 1 : 0)
                .input('data_inicio', sql.DateTime, new Date())
                .input('data_conclusao', sql.DateTime, concluida ? new Date() : null)
                .query(`
                    INSERT INTO a_formacoes_progresso (
                        aluno_id, a_formacao_id, visto, tempo_assistido, data_inicio, data_conclusao
                    )
                    VALUES (
                        @userId, @aulaId, @visto, 0, @data_inicio, @data_conclusao
                    )
                `);
        }

        return { message: 'Progresso atualizado com sucesso' };
    }

    /**
     * Obter progresso das aulas de uma formação
     */
    async obterProgressoFormacao(tenantId: number, userId: number, formacaoId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .input('formacaoId', sql.Int, formacaoId)
            .query(`
                SELECT
                    a.id as aula_id,
                    a.m_formacao_id as modulo_id,
                    CAST(ISNULL(p.visto, 0) AS BIT) as concluida
                FROM a_formacoes a
                INNER JOIN m_formacoes m ON m.id = a.m_formacao_id
                LEFT JOIN a_formacoes_progresso p ON p.a_formacao_id = a.id AND p.aluno_id = @userId
                WHERE m.formacao_id = @formacaoId AND a.publicado = 1
                ORDER BY m.id, a.id
            `);

        return result.recordset;
    }

    /**
     * Listar clientes associados a uma formação
     */
    async listarClientesFormacao(tenantId: number, formacaoId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request()
            .input('formacaoId', sql.Int, formacaoId)
            .query(`
                SELECT
                    u.id,
                    u.username as nome,
                    u.email,
                    fc.data_inscricao,
                    fc.progresso,
                    fc.nota_final,
                    fc.data_conclusao
                FROM formacoes_clientes fc
                INNER JOIN utilizadores u ON u.id = fc.cliente_id
                WHERE fc.formacao_id = @formacaoId AND fc.ativo = 1
                ORDER BY fc.data_inscricao DESC
            `);

        return result.recordset;
    }

    /**
     * Associar cliente a uma formação
     */
    async associarCliente(tenantId: number, formacaoId: number, clienteId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        // Verificar se já existe
        const existe = await pool.request()
            .input('formacaoId', sql.Int, formacaoId)
            .input('clienteId', sql.Int, clienteId)
            .query(`
                SELECT id FROM formacoes_clientes
                WHERE formacao_id = @formacaoId AND cliente_id = @clienteId
            `);

        if (existe.recordset.length > 0) {
            // Se existe mas está inativo, reativar
            await pool.request()
                .input('formacaoId', sql.Int, formacaoId)
                .input('clienteId', sql.Int, clienteId)
                .query(`
                    UPDATE formacoes_clientes
                    SET ativo = 1, data_inscricao = GETDATE()
                    WHERE formacao_id = @formacaoId AND cliente_id = @clienteId
                `);
        } else {
            // Inserir novo
            await pool.request()
                .input('formacaoId', sql.Int, formacaoId)
                .input('clienteId', sql.Int, clienteId)
                .query(`
                    INSERT INTO formacoes_clientes (
                        formacao_id, cliente_id, data_inscricao, progresso, ativo, criado_em
                    )
                    VALUES (
                        @formacaoId, @clienteId, GETDATE(), 0, 1, GETDATE()
                    )
                `);
        }

        return { message: 'Cliente associado com sucesso' };
    }

    /**
     * Desassociar cliente de uma formação
     */
    async desassociarCliente(tenantId: number, formacaoId: number, clienteId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        await pool.request()
            .input('formacaoId', sql.Int, formacaoId)
            .input('clienteId', sql.Int, clienteId)
            .query(`
                UPDATE formacoes_clientes
                SET ativo = 0
                WHERE formacao_id = @formacaoId AND cliente_id = @clienteId
            `);

        return { message: 'Cliente desassociado com sucesso' };
    }

    /**
     * Listar todos os clientes (utilizadores com tipo cliente)
     */
    async listarTodosClientes(tenantId: number) {
        const pool = await this.databaseService.getTenantConnection(tenantId);

        const result = await pool.request()
            .query(`
                SELECT
                    id,
                    username as nome,
                    email
                FROM utilizadores
                WHERE tipo_utilizador = 'cliente' AND ativo = 1
                ORDER BY username
            `);

        return result.recordset;
    }
}
