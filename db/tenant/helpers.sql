/****************************************************************************/
/* SCRIPT 3: HELPERS PARA CAMPOS DINÂMICOS                     */
/* Microsoft SQL Server - Funções e Views auxiliares                     */
/* Data: 12/10/2025                                                        */
/****************************************************************************/


/******************************************************************************/
/* VIEWS - VISUALIZAÇÕES ÚTEIS                                               */
/******************************************************************************/

-- View: Funcionários com Emprego Ativo
CREATE OR ALTER VIEW [dbo].[vw_FuncionariosAtivos]
AS
SELECT 
    f.id AS funcionario_id,
    f.numero,
    f.nome_completo,
    f.sexo,
    f.data_nascimento,
    DATEDIFF(YEAR, f.data_nascimento, GETDATE()) AS idade,
    tf.nome AS tipo_funcionario,
    e.id AS emprego_id,
    e.cargo,
    e.departamento,
    e.data_admissao,
    e.vencimento_base,
    e.situacao,
    u.email,
    u.ativo AS tem_acesso
FROM [dbo].[funcionarios] f
INNER JOIN [dbo].[empregos] e ON e.funcionario_id = f.id AND e.situacao = 'Ativo'
LEFT JOIN [dbo].[tipos_funcionarios] tf ON f.tipo_funcionario_id = tf.id
LEFT JOIN [dbo].[utilizadores] u ON u.funcionario_id = f.id
WHERE f.ativo = 1;
GO

-- View: Documentos Vencidos ou a Vencer
CREATE OR ALTER VIEW [dbo].[vw_DocumentosVencimento]
AS
SELECT 
    d.id AS documento_id,
    d.tipo AS tipo_documento,
    d.numero AS numero_documento,
    d.data_validade,
    DATEDIFF(DAY, GETDATE(), d.data_validade) AS dias_para_vencer,
    f.id AS funcionario_id,
    f.nome_completo AS funcionario_nome,
    f.numero AS funcionario_numero,
    CASE 
        WHEN d.data_validade < GETDATE() THEN 'Vencido'
        WHEN DATEDIFF(DAY, GETDATE(), d.data_validade) <= 30 THEN 'Vence em 30 dias'
        WHEN DATEDIFF(DAY, GETDATE(), d.data_validade) <= 60 THEN 'Vence em 60 dias'
        ELSE 'Válido'
    END AS status_vencimento
FROM [dbo].[documentos] d
INNER JOIN [dbo].[funcionarios] f ON d.funcionario_id = f.id
WHERE d.vitalicio = 0 
  AND d.data_validade IS NOT NULL
  AND f.ativo = 1;
GO

-- View: Aniversariantes do Mês
CREATE OR ALTER VIEW [dbo].[vw_AniversariantesMes]
AS
SELECT 
    f.id,
    f.numero,
    f.nome_completo,
    f.data_nascimento,
    DAY(f.data_nascimento) AS dia_aniversario,
    DATEDIFF(YEAR, f.data_nascimento, GETDATE()) AS idade_atual,
    DATEDIFF(YEAR, f.data_nascimento, GETDATE()) + 1 AS proxima_idade,
    tf.nome AS tipo_funcionario,
    c.valor AS telefone,
    ce.valor AS email
FROM [dbo].[funcionarios] f
LEFT JOIN [dbo].[tipos_funcionarios] tf ON f.tipo_funcionario_id = tf.id
LEFT JOIN [dbo].[contatos] c ON c.funcionario_id = f.id AND c.tipo = 'telefone' AND c.principal = 1
LEFT JOIN [dbo].[contatos] ce ON ce.funcionario_id = f.id AND ce.tipo = 'email' AND ce.principal = 1
WHERE MONTH(f.data_nascimento) = MONTH(GETDATE())
  AND f.ativo = 1;
GO

-- View: Benefícios por Funcionário
CREATE OR ALTER VIEW [dbo].[vw_BeneficiosPorFuncionario]
AS
SELECT 
    f.id AS funcionario_id,
    f.numero,
    f.nome_completo,
    b.id AS beneficio_id,
    b.tipo AS tipo_beneficio,
    b.descricao,
    b.valor,
    b.data_inicio,
    b.data_fim,
    b.ativo AS beneficio_ativo,
    CASE 
        WHEN b.data_fim IS NULL THEN 'Indeterminado'
        WHEN b.data_fim < GETDATE() THEN 'Expirado'
        ELSE 'Ativo'
    END AS status_beneficio
FROM [dbo].[funcionarios] f
INNER JOIN [dbo].[beneficios] b ON b.funcionario_id = f.id
WHERE f.ativo = 1;
GO

/******************************************************************************/
/* FUNÇÕES AUXILIARES                                                        */
/******************************************************************************/

-- Função: Obter Valor de Campo Personalizado
CREATE OR ALTER FUNCTION [dbo].[fn_ObterValorCampoPersonalizado]
(
    @FuncionarioId INT,
    @CodigoCampo NVARCHAR(100),
    @TipoRetorno NVARCHAR(20) -- 'text', 'number', 'date', 'datetime', 'boolean', 'json'
)
RETURNS NVARCHAR(MAX)
AS
BEGIN
    DECLARE @Valor NVARCHAR(MAX);
    
    SELECT @Valor = 
        CASE @TipoRetorno
            WHEN 'text' THEN valor_texto
            WHEN 'number' THEN CAST(valor_numero AS NVARCHAR(MAX))
            WHEN 'date' THEN CONVERT(NVARCHAR(10), valor_data, 23)
            WHEN 'datetime' THEN CONVERT(NVARCHAR(19), valor_datetime, 120)
            WHEN 'boolean' THEN CAST(valor_boolean AS NVARCHAR(5))
            WHEN 'json' THEN valor_json
            ELSE NULL
        END
    FROM [dbo].[funcionarios_valores_personalizados]
    WHERE funcionario_id = @FuncionarioId 
      AND codigo_campo = @CodigoCampo;
    
    RETURN @Valor;
END
GO

-- Função: Calcular Tempo de Empresa
CREATE OR ALTER FUNCTION [dbo].[fn_CalcularTempoEmpresa]
(
    @DataAdmissao DATE,
    @DataSaida DATE = NULL
)
RETURNS NVARCHAR(100)
AS
BEGIN
    DECLARE @DataFim DATE = ISNULL(@DataSaida, GETDATE());
    DECLARE @Anos INT = DATEDIFF(YEAR, @DataAdmissao, @DataFim);
    DECLARE @Meses INT = DATEDIFF(MONTH, @DataAdmissao, @DataFim) % 12;
    DECLARE @Resultado NVARCHAR(100);
    
    SET @Resultado = 
        CASE 
            WHEN @Anos > 0 THEN CAST(@Anos AS NVARCHAR) + ' ano(s) e ' + CAST(@Meses AS NVARCHAR) + ' mês(es)'
            WHEN @Meses > 0 THEN CAST(@Meses AS NVARCHAR) + ' mês(es)'
            ELSE 'Menos de 1 mês'
        END;
    
    RETURN @Resultado;
END
GO

/******************************************************************************/
/* TRIGGERS - AUDITORIA E VALIDAÇÕES                                         */
/******************************************************************************/

-- Trigger: Atualizar campo atualizado_em automaticamente
CREATE OR ALTER TRIGGER [dbo].[trg_funcionarios_atualizar_data]
ON [dbo].[funcionarios]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE f
    SET atualizado_em = GETDATE()
    FROM [dbo].[funcionarios] f
    INNER JOIN inserted i ON f.id = i.id;
END
GO

-- Trigger: Validar Email Único do Utilizador
CREATE OR ALTER TRIGGER [dbo].[trg_utilizadores_validar_email]
ON [dbo].[utilizadores]
INSTEAD OF INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Verificar se email já existe (para INSERT ou UPDATE com mudança de email)
    IF EXISTS (
        SELECT 1 
        FROM inserted i
        INNER JOIN [dbo].[utilizadores] u ON i.email = u.email 
        WHERE u.id != i.id OR (u.id = i.id AND NOT EXISTS (SELECT 1 FROM deleted))
    )
    BEGIN
        RAISERROR ('Email já está em uso por outro utilizador.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
    
    -- Se for INSERT
    IF NOT EXISTS (SELECT 1 FROM deleted)
    BEGIN
        INSERT INTO [dbo].[utilizadores] (
            username, email, senha_hash, telefone, ativo, 
            email_verificado, email_verificado_em, senha_alterada_em,
            token_recordar, token_reset_senha, token_reset_expira_em,
            ultimo_acesso, foto_url, idioma, tema, 
            criado_em, atualizado_em, funcionario_id
        )
        SELECT 
            username, email, senha_hash, telefone, ativo,
            email_verificado, email_verificado_em, senha_alterada_em,
            token_recordar, token_reset_senha, token_reset_expira_em,
            ultimo_acesso, foto_url, idioma, tema,
            criado_em, atualizado_em, funcionario_id
        FROM inserted;
    END
    -- Se for UPDATE
    ELSE
    BEGIN
        UPDATE u
        SET 
            username = i.username,
            email = i.email,
            senha_hash = i.senha_hash,
            telefone = i.telefone,
            ativo = i.ativo,
            email_verificado = i.email_verificado,
            email_verificado_em = i.email_verificado_em,
            senha_alterada_em = i.senha_alterada_em,
            token_recordar = i.token_recordar,
            token_reset_senha = i.token_reset_senha,
            token_reset_expira_em = i.token_reset_expira_em,
            ultimo_acesso = i.ultimo_acesso,
            foto_url = i.foto_url,
            idioma = i.idioma,
            tema = i.tema,
            atualizado_em = GETDATE(),
            funcionario_id = i.funcionario_id
        FROM [dbo].[utilizadores] u
        INNER JOIN inserted i ON u.id = i.id;
    END
END
GO

/******************************************************************************/
/* EXEMPLOS DE USO                                                           */
/******************************************************************************/

/*
-- EXEMPLO 1: Criar funcionário com campos personalizados
EXEC [dbo].[sp_CriarFuncionarioCompleto]
    @NomeCompleto = 'João Silva',
    @Sexo = 'Masculino',
    @DataNascimento = '1990-05-15',
    @Nacionalidade = 'Portuguesa',
    @CamposPersonalizados = '[
        {"codigo":"nif","tipo":"text","valor":"123456789"},
        {"codigo":"numero_ss","tipo":"text","valor":"11111111111"},
        {"codigo":"salario_extra","tipo":"number","valor":"500.50"}
    ]',
    @CriarUtilizador = 1,
    @Email = 'joao.silva@empresa.com',
    @Senha = 'hash_da_senha_aqui';

-- EXEMPLO 2: Salvar campo personalizado individual
EXEC [dbo].[sp_SalvarCampoPersonalizadoFuncionario]
    @FuncionarioId = 1,
    @CodigoCampo = 'certificacao_especial',
    @TipoDados = 'text',
    @ValorTexto = 'ISO 9001 Certified';

-- EXEMPLO 3: Obter funcionário completo
EXEC [dbo].[sp_ObterFuncionarioCompleto] @FuncionarioId = 1;

-- EXEMPLO 4: Listar funcionários com paginação
EXEC [dbo].[sp_ListarFuncionarios]
    @Ativo = 1,
    @TextoPesquisa = 'Silva',
    @PageNumber = 1,
    @PageSize = 20;

-- EXEMPLO 5: Usar função para obter valor personalizado
SELECT 
    f.nome_completo,
    [dbo].[fn_ObterValorCampoPersonalizado](f.id, 'nif', 'text') AS NIF,
    [dbo].[fn_ObterValorCampoPersonalizado](f.id, 'salario_extra', 'number') AS SalarioExtra
FROM [dbo].[funcionarios] f
WHERE f.ativo = 1;

-- EXEMPLO 6: Ver aniversariantes do mês
SELECT * FROM [dbo].[vw_AniversariantesMes]
ORDER BY dia_aniversario;

-- EXEMPLO 7: Ver documentos a vencer
SELECT * FROM [dbo].[vw_DocumentosVencimento]
WHERE status_vencimento IN ('Vencido', 'Vence em 30 dias')
ORDER BY data_validade;
*/


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

/******************************************************************************/
/* FINALIZAÇÃO DO SCRIPT                                                    */
/******************************************************************************/

PRINT 'Helpers e Procedures criados com sucesso!'
PRINT 'Sistema completo de campos dinâmicos operacional!'
GO