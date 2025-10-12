/****************************************************************************/
/* STORED PROCEDURES E VIEWS - MÓDULO SUPORTE                              */
/****************************************************************************/

USE [{TenantDB}]
GO

/******************************************************************************/
/* STORED PROCEDURES - TICKETS                                              */
/******************************************************************************/

-- Procedure: Criar Ticket
CREATE OR ALTER PROCEDURE [dbo].[sp_CriarTicket]
    @EmpresaId INT = NULL,
    @TipoTicketId INT,
    @EquipamentoId INT = NULL,
    @Titulo NVARCHAR(255),
    @Descricao NVARCHAR(MAX),
    @Prioridade NVARCHAR(20) = 'media',
    @Localizacao NVARCHAR(255) = NULL,
    @SolicitanteId INT,
    @AtribuidoId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    DECLARE @TicketId INT;
    DECLARE @NumeroTicket NVARCHAR(50);
    DECLARE @DataPrevista DATETIME2;
    
    BEGIN TRY
        -- Gerar número do ticket
        DECLARE @ProximoNumero INT;
        SELECT @ProximoNumero = ISNULL(MAX(CAST(SUBSTRING(numero_ticket, 4, LEN(numero_ticket)) AS INT)), 0) + 1
        FROM [dbo].[tickets]
        WHERE numero_ticket LIKE 'TKT%';
        
        SET @NumeroTicket = 'TKT' + RIGHT('00000' + CAST(@ProximoNumero AS NVARCHAR), 5);
        
        -- Calcular data prevista baseado no SLA
        DECLARE @SlaHoras INT;
        SELECT @SlaHoras = sla_horas FROM [dbo].[tipos_ticket] WHERE id = @TipoTicketId;
        
        IF @SlaHoras IS NOT NULL
            SET @DataPrevista = DATEADD(HOUR, @SlaHoras, GETDATE());
        
        -- Inserir ticket
        INSERT INTO [dbo].[tickets]
            (empresa_id, numero_ticket, tipo_ticket_id, equipamento_id, titulo, descricao,
             prioridade, status, solicitante_id, atribuido_id, localizacao, data_prevista)
        VALUES
            (@EmpresaId, @NumeroTicket, @TipoTicketId, @EquipamentoId, @Titulo, @Descricao,
             @Prioridade, 'aberto', @SolicitanteId, @AtribuidoId, @Localizacao, @DataPrevista);
        
        SET @TicketId = SCOPE_IDENTITY();
        
        -- Registrar no histórico
        INSERT INTO [dbo].[tickets_historico]
            (ticket_id, utilizador_id, tipo_acao, descricao)
        VALUES
            (@TicketId, @SolicitanteId, 'comentario', 'Ticket criado');
        
        COMMIT TRANSACTION;
        
        SELECT 
            'SUCCESS' AS Status,
            @TicketId AS TicketId,
            @NumeroTicket AS NumeroTicket;
            
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        SELECT 
            'ERROR' AS Status,
            ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END
GO

-- Procedure: Atualizar Status do Ticket
CREATE OR ALTER PROCEDURE [dbo].[sp_AtualizarStatusTicket]
    @TicketId INT,
    @NovoStatus NVARCHAR(30),
    @UtilizadorId INT,
    @Comentario NVARCHAR(1000) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    BEGIN TRY
        DECLARE @StatusAnterior NVARCHAR(30);
        DECLARE @DataConclusao DATETIME2 = NULL;
        DECLARE @TempoResolucao INT = NULL;
        
        SELECT @StatusAnterior = status FROM [dbo].[tickets] WHERE id = @TicketId;
        
        -- Se estiver fechando, calcular tempo de resolução
        IF @NovoStatus IN ('resolvido', 'fechado')
        BEGIN
            SET @DataConclusao = GETDATE();
            
            SELECT @TempoResolucao = DATEDIFF(MINUTE, data_abertura, @DataConclusao)
            FROM [dbo].[tickets]
            WHERE id = @TicketId;
        END
        
        -- Atualizar ticket
        UPDATE [dbo].[tickets]
        SET 
            status = @NovoStatus,
            data_conclusao = @DataConclusao,
            tempo_resolucao_minutos = @TempoResolucao,
            atualizado_em = GETDATE()
        WHERE id = @TicketId;
        
        -- Registrar no histórico
        INSERT INTO [dbo].[tickets_historico]
            (ticket_id, utilizador_id, tipo_acao, descricao, valor_anterior, valor_novo, visivel_cliente)
        VALUES
            (@TicketId, @UtilizadorId, 'status_alterado', @Comentario, @StatusAnterior, @NovoStatus, 1);
        
        COMMIT TRANSACTION;
        SELECT 'SUCCESS' AS Status;
            
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END
GO

-- Procedure: Atribuir Ticket
CREATE OR ALTER PROCEDURE [dbo].[sp_AtribuirTicket]
    @TicketId INT,
    @AtribuidoId INT,
    @UtilizadorId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @StatusAtual NVARCHAR(30);
    DECLARE @AtribuidoUsername NVARCHAR(100);
    
    SELECT @StatusAtual = status FROM [dbo].[tickets] WHERE id = @TicketId;
    SELECT @AtribuidoUsername = username FROM [dbo].[utilizadores] WHERE id = @AtribuidoId;
    
    UPDATE [dbo].[tickets]
    SET 
        atribuido_id = @AtribuidoId,
        status = CASE WHEN @StatusAtual = 'aberto' THEN 'em_andamento' ELSE @StatusAtual END,
        atualizado_em = GETDATE()
    WHERE id = @TicketId;
    
    INSERT INTO [dbo].[tickets_historico]
        (ticket_id, utilizador_id, tipo_acao, descricao, valor_novo)
    VALUES
        (@TicketId, @UtilizadorId, 'atribuicao', 
         'Ticket atribuído a ' + @AtribuidoUsername,
         CAST(@AtribuidoId AS NVARCHAR));
    
    SELECT 'SUCCESS' AS Status;
END
GO

-- Procedure: Adicionar Comentário ao Ticket
CREATE OR ALTER PROCEDURE [dbo].[sp_AdicionarComentarioTicket]
    @TicketId INT,
    @UtilizadorId INT,
    @Comentario NVARCHAR(1000),
    @VisivelCliente BIT = 1
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO [dbo].[tickets_historico]
        (ticket_id, utilizador_id, tipo_acao, descricao, visivel_cliente)
    VALUES
        (@TicketId, @UtilizadorId, 'comentario', @Comentario, @VisivelCliente);
    
    UPDATE [dbo].[tickets]
    SET atualizado_em = GETDATE()
    WHERE id = @TicketId;
    
    SELECT 'SUCCESS' AS Status, SCOPE_IDENTITY() AS HistoricoId;
END
GO

-- Procedure: Avaliar Ticket
CREATE OR ALTER PROCEDURE [dbo].[sp_AvaliarTicket]
    @TicketId INT,
    @UtilizadorId INT,
    @Avaliacao INT,
    @Comentario NVARCHAR(1000) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE [dbo].[tickets]
    SET 
        avaliacao = @Avaliacao,
        comentario_avaliacao = @Comentario,
        atualizado_em = GETDATE()
    WHERE id = @TicketId;
    
    INSERT INTO [dbo].[tickets_historico]
        (ticket_id, utilizador_id, tipo_acao, descricao, valor_novo, visivel_cliente)
    VALUES
        (@TicketId, @UtilizadorId, 'avaliacao', @Comentario, CAST(@Avaliacao AS NVARCHAR), 0);
    
    SELECT 'SUCCESS' AS Status;
END
GO

/******************************************************************************/
/* STORED PROCEDURES - INTERVENÇÕES                                         */
/******************************************************************************/

-- Procedure: Criar Intervenção
CREATE OR ALTER PROCEDURE [dbo].[sp_CriarIntervencao]
    @TicketId INT = NULL,
    @EquipamentoId INT,
    @Tipo NVARCHAR(50),
    @Titulo NVARCHAR(255),
    @Descricao NVARCHAR(MAX) = NULL,
    @TecnicoId INT,
    @DataInicio DATETIME2,
    @DataFim DATETIME2 = NULL,
    @Pecas NVARCHAR(MAX) = NULL, -- JSON: [{"descricao":"...","quantidade":1,"valor":10}]
    @CustoMaoObra DECIMAL(18,2) = NULL,
    @AnexosIds NVARCHAR(MAX) = NULL -- JSON: [{"anexo_id":1,"tipo_documento":"fatura"}]
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    DECLARE @IntervencaoId INT;
    DECLARE @NumeroIntervencao NVARCHAR(50);
    DECLARE @CustoPecas DECIMAL(18,2) = 0;
    DECLARE @CustoTotal DECIMAL(18,2) = 0;
    
    BEGIN TRY
        -- Gerar número da intervenção
        DECLARE @ProximoNumero INT;
        SELECT @ProximoNumero = ISNULL(MAX(CAST(SUBSTRING(numero_intervencao, 4, LEN(numero_intervencao)) AS INT)), 0) + 1
        FROM [dbo].[intervencoes]
        WHERE numero_intervencao LIKE 'INT%';
        
        SET @NumeroIntervencao = 'INT' + RIGHT('00000' + CAST(@ProximoNumero AS NVARCHAR), 5);
        
        -- Calcular duração
        DECLARE @Duracao INT = NULL;
        IF @DataFim IS NOT NULL
            SET @Duracao = DATEDIFF(MINUTE, @DataInicio, @DataFim);
        
        -- Inserir intervenção
        INSERT INTO [dbo].[intervencoes]
            (ticket_id, equipamento_id, tipo, numero_intervencao, titulo, descricao,
             tecnico_id, data_inicio, data_fim, duracao_minutos, custo_mao_obra, status)
        VALUES
            (@TicketId, @EquipamentoId, @Tipo, @NumeroIntervencao, @Titulo, @Descricao,
             @TecnicoId, @DataInicio, @DataFim, @Duracao, @CustoMaoObra, 
             CASE WHEN @DataFim IS NULL THEN 'em_andamento' ELSE 'concluida' END);
        
        SET @IntervencaoId = SCOPE_IDENTITY();
        
        -- Processar peças
        IF @Pecas IS NOT NULL
        BEGIN
            INSERT INTO [dbo].[intervencoes_pecas]
                (intervencao_id, descricao, codigo_peca, quantidade, valor_unitario, valor_total, fornecedor)
            SELECT 
                @IntervencaoId,
                JSON_VALUE(value, '$.descricao'),
                JSON_VALUE(value, '$.codigo_peca'),
                CAST(JSON_VALUE(value, '$.quantidade') AS INT),
                CAST(JSON_VALUE(value, '$.valor_unitario') AS DECIMAL(18,2)),
                CAST(JSON_VALUE(value, '$.quantidade') AS INT) * CAST(JSON_VALUE(value, '$.valor_unitario') AS DECIMAL(18,2)),
                JSON_VALUE(value, '$.fornecedor')
            FROM OPENJSON(@Pecas);
            
            SELECT @CustoPecas = ISNULL(SUM(valor_total), 0)
            FROM [dbo].[intervencoes_pecas]
            WHERE intervencao_id = @IntervencaoId;
        END
        
        -- Processar anexos
        IF @AnexosIds IS NOT NULL
        BEGIN
            INSERT INTO [dbo].[intervencoes_anexos]
                (intervencao_id, anexo_id, tipo_documento, descricao)
            SELECT 
                @IntervencaoId,
                CAST(JSON_VALUE(value, '$.anexo_id') AS INT),
                JSON_VALUE(value, '$.tipo_documento'),
                JSON_VALUE(value, '$.descricao')
            FROM OPENJSON(@AnexosIds);
        END
        
        -- Calcular custo total e atualizar
        SET @CustoTotal = ISNULL(@CustoMaoObra, 0) + @CustoPecas;
        
        UPDATE [dbo].[intervencoes]
        SET 
            custo_pecas = @CustoPecas,
            custo_total = @CustoTotal
        WHERE id = @IntervencaoId;
        
        -- Se tiver ticket, atualizar status
        IF @TicketId IS NOT NULL AND @DataFim IS NOT NULL
        BEGIN
            UPDATE [dbo].[tickets]
            SET status = 'resolvido'
            WHERE id = @TicketId AND status NOT IN ('fechado', 'cancelado');
        END
        
        COMMIT TRANSACTION;
        
        SELECT 
            'SUCCESS' AS Status,
            @IntervencaoId AS IntervencaoId,
            @NumeroIntervencao AS NumeroIntervencao;
            
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END
GO

-- Procedure: Concluir Intervenção
CREATE OR ALTER PROCEDURE [dbo].[sp_ConcluirIntervencao]
    @IntervencaoId INT,
    @Diagnostico NVARCHAR(MAX) = NULL,
    @Solucao NVARCHAR(MAX) = NULL,
    @DataFim DATETIME2 = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @DataFim IS NULL
        SET @DataFim = GETDATE();
    
    DECLARE @DataInicio DATETIME2;
    DECLARE @Duracao INT;
    
    SELECT @DataInicio = data_inicio FROM [dbo].[intervencoes] WHERE id = @IntervencaoId;
    SET @Duracao = DATEDIFF(MINUTE, @DataInicio, @DataFim);
    
    UPDATE [dbo].[intervencoes]
    SET 
        diagnostico = @Diagnostico,
        solucao = @Solucao,
        data_fim = @DataFim,
        duracao_minutos = @Duracao,
        status = 'concluida',
        atualizado_em = GETDATE()
    WHERE id = @IntervencaoId;
    
    SELECT 'SUCCESS' AS Status;
END
GO

-- Procedure: Listar Tickets (com filtros)
CREATE OR ALTER PROCEDURE [dbo].[sp_ListarTickets]
    @UtilizadorId INT,
    @EmpresaId INT = NULL,
    @Status NVARCHAR(30) = NULL,
    @Prioridade NVARCHAR(20) = NULL,
    @AtribuidoId INT = NULL,
    @MeusTickets BIT = 0,
    @PageNumber INT = 1,
    @PageSize INT = 50
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    
    SELECT 
        t.id,
        t.numero_ticket,
        t.titulo,
        t.descricao,
        t.prioridade,
        t.status,
        t.data_abertura,
        t.data_prevista,
        t.data_conclusao,
        CASE 
            WHEN t.data_prevista < GETDATE() AND t.status NOT IN ('resolvido', 'fechado', 'cancelado') 
            THEN 1 ELSE 0 
        END AS atrasado,
        tt.nome AS tipo_ticket,
        tt.cor AS tipo_cor,
        e.numero_interno AS equipamento,
        eq.nome AS empresa_nome,
        sol.username AS solicitante_nome,
        sol.foto_url AS solicitante_foto,
        atr.username AS atribuido_nome,
        atr.foto_url AS atribuido_foto,
        (SELECT COUNT(*) FROM [dbo].[tickets_historico] WHERE ticket_id = t.id) AS total_comentarios
    FROM [dbo].[tickets] t
    INNER JOIN [dbo].[tipos_ticket] tt ON t.tipo_ticket_id = tt.id
    LEFT JOIN [dbo].[equipamentos] e ON t.equipamento_id = e.id
    LEFT JOIN [dbo].[empresas] eq ON t.empresa_id = eq.id
    INNER JOIN [dbo].[utilizadores] sol ON t.solicitante_id = sol.id
    LEFT JOIN [dbo].[utilizadores] atr ON t.atribuido_id = atr.id
    WHERE 
        (@EmpresaId IS NULL OR t.empresa_id = @EmpresaId)
        AND (@Status IS NULL OR t.status = @Status)
        AND (@Prioridade IS NULL OR t.prioridade = @Prioridade)
        AND (@AtribuidoId IS NULL OR t.atribuido_id = @AtribuidoId)
        AND (@MeusTickets = 0 OR t.solicitante_id = @UtilizadorId OR t.atribuido_id = @UtilizadorId)
    ORDER BY 
        CASE t.prioridade 
            WHEN 'urgente' THEN 1 
            WHEN 'alta' THEN 2 
            WHEN 'media' THEN 3 
            ELSE 4 
        END,
        t.data_abertura DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO

-- Procedure: Obter Detalhes do Ticket
CREATE OR ALTER PROCEDURE [dbo].[sp_ObterTicketDetalhes]
    @TicketId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Dados do ticket
    SELECT 
        t.*,
        tt.nome AS tipo_ticket_nome,
        tt.sla_horas,
        e.numero_interno AS equipamento_numero,
        e.descricao AS equipamento_descricao,
        m.nome AS equipamento_modelo,
        ma.nome AS equipamento_marca,
        eq.nome AS empresa_nome,
        sol.username AS solicitante_nome,
        sol.email AS solicitante_email,
        sol.foto_url AS solicitante_foto,
        atr.username AS atribuido_nome,
        atr.email AS atribuido_email,
        atr.foto_url AS atribuido_foto
    FROM [dbo].[tickets] t
    INNER JOIN [dbo].[tipos_ticket] tt ON t.tipo_ticket_id = tt.id
    LEFT JOIN [dbo].[equipamentos] e ON t.equipamento_id = e.id
    LEFT JOIN [dbo].[modelos_equipamento] m ON e.modelo_id = m.id
    LEFT JOIN [dbo].[marcas] ma ON m.marca_id = ma.id
    LEFT JOIN [dbo].[empresas] eq ON t.empresa_id = eq.id
    INNER JOIN [dbo].[utilizadores] sol ON t.solicitante_id = sol.id
    LEFT JOIN [dbo].[utilizadores] atr ON t.atribuido_id = atr.id
    WHERE t.id = @TicketId;
    
    -- Histórico
    SELECT 
        h.*,
        u.username AS utilizador_nome,
        u.foto_url AS utilizador_foto
    FROM [dbo].[tickets_historico] h
    INNER JOIN [dbo].[utilizadores] u ON h.utilizador_id = u.id
    WHERE h.ticket_id = @TicketId
    ORDER BY h.criado_em DESC;
    
    -- Intervenções relacionadas
    SELECT 
        i.*,
        tec.username AS tecnico_nome
    FROM [dbo].[intervencoes] i
    INNER JOIN [dbo].[utilizadores] tec ON i.tecnico_id = tec.id
    WHERE i.ticket_id = @TicketId
    ORDER BY i.data_inicio DESC;
END
GO

/******************************************************************************/
/* VIEWS                                                                     */
/******************************************************************************/

-- View: Tickets em Aberto
CREATE OR ALTER VIEW [dbo].[vw_TicketsAbertos]
AS
SELECT 
    t.id,
    t.numero_ticket,
    t.titulo,
    t.prioridade,
    t.status,
    t.data_abertura,
    t.data_prevista,
    DATEDIFF(HOUR, t.data_abertura, GETDATE()) AS horas_abertas,
    CASE 
        WHEN t.data_prevista < GETDATE() THEN 'Atrasado'
        WHEN DATEADD(HOUR, -2, t.data_prevista) < GETDATE() THEN 'Próximo do vencimento'
        ELSE 'No prazo'
    END AS situacao_sla,
    tt.nome AS tipo_ticket,
    sol.username AS solicitante,
    atr.username AS atribuido,
    eq.nome AS empresa
FROM [dbo].[tickets] t
INNER JOIN [dbo].[tipos_ticket] tt ON t.tipo_ticket_id = tt.id
INNER JOIN [dbo].[utilizadores] sol ON t.solicitante_id = sol.id
LEFT JOIN [dbo].[utilizadores] atr ON t.atribuido_id = atr.id
LEFT JOIN [dbo].[empresas] eq ON t.empresa_id = eq.id
WHERE t.status NOT IN ('fechado', 'cancelado');
GO

-- View: Equipamentos com Manutenção Próxima
CREATE OR ALTER VIEW [dbo].[vw_EquipamentosManutencaoProxima]
AS
SELECT 
    e.id,
    e.numero_interno,
    e.descricao,
    e.localizacao,
    e.data_proxima_manutencao,
    DATEDIFF(DAY, GETDATE(), e.data_proxima_manutencao) AS dias_para_manutencao,
    m.nome AS modelo,
    ma.nome AS marca,
    cat.nome AS categoria,
    emp.nome AS empresa,
    resp.nome_completo AS responsavel
FROM [dbo].[equipamentos] e
INNER JOIN [dbo].[modelos_equipamento] m ON e.modelo_id = m.id
INNER JOIN [dbo].[marcas] ma ON m.marca_id = ma.id
INNER JOIN [dbo].[categorias_equipamento] cat ON m.categoria_id = cat.id
LEFT JOIN [dbo].[empresas] emp ON e.empresa_id = emp.id
LEFT JOIN [dbo].[funcionarios] resp ON e.responsavel_id = resp.id
WHERE e.ativo = 1
  AND e.data_proxima_manutencao IS NOT NULL
  AND e.data_proxima_manutencao <= DATEADD(DAY, 30, GETDATE());
GO

-- View: Estatísticas de Tickets
CREATE OR ALTER VIEW [dbo].[vw_EstatisticasTickets]
AS
SELECT 
    COUNT(*) AS total_tickets,
    SUM(CASE WHEN status = 'aberto' THEN 1 ELSE 0 END) AS abertos,
    SUM(CASE WHEN status = 'em_andamento' THEN 1 ELSE 0 END) AS em_andamento,
    SUM(CASE WHEN status = 'resolvido' THEN 1 ELSE 0 END) AS resolvidos,
    SUM(CASE WHEN status = 'fechado' THEN 1 ELSE 0 END) AS fechados,
    SUM(CASE WHEN status NOT IN ('fechado', 'cancelado') AND data_prevista < GETDATE() THEN 1 ELSE 0 END) AS atrasados,
    AVG(CASE WHEN tempo_resolucao_minutos IS NOT NULL THEN tempo_resolucao_minutos ELSE NULL END) AS tempo_medio_resolucao,
    AVG(CASE WHEN avaliacao IS NOT NULL THEN CAST(avaliacao AS FLOAT) ELSE NULL END) AS avaliacao_media
FROM [dbo].[tickets];
GO

-- View: Custos por Equipamento
CREATE OR ALTER VIEW [dbo].[vw_CustosEquipamentos]
AS
SELECT 
    e.id AS equipamento_id,
    e.numero_interno,
    e.descricao AS equipamento_descricao,
    m.nome AS modelo,
    ma.nome AS marca,
    e.valor_aquisicao,
    ISNULL(SUM(i.custo_total), 0) AS custo_total_intervencoes,
    COUNT(i.id) AS total_intervencoes,
    e.valor_aquisicao + ISNULL(SUM(i.custo_total), 0) AS custo_total
FROM [dbo].[equipamentos] e
INNER JOIN [dbo].[modelos_equipamento] m ON e.modelo_id = m.id
INNER JOIN [dbo].[marcas] ma ON m.marca_id = ma.id
LEFT JOIN [dbo].[intervencoes] i ON e.id = i.equipamento_id
GROUP BY e.id, e.numero_interno, e.descricao, m.nome, ma.nome, e.valor_aquisicao;
GO

PRINT 'Procedures e Views do Módulo Suporte criadas com sucesso!'
GO