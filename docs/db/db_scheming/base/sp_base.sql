/****************************************************************************/
/* SCRIPT 3: HELPERS E PROCEDURES PARA CAMPOS DINÂMICOS                     */
/* Microsoft SQL Server - Procedures e Views auxiliares                     */
/* Data: 12/10/2025                                                        */
/****************************************************************************/

USE [{TenantDB}]
GO

/******************************************************************************/
/* STORED PROCEDURES - GESTÃO DE FUNCIONÁRIOS COM CAMPOS DINÂMICOS          */
/******************************************************************************/

-- Procedure: Obter Funcionário Completo (Base + Campos Personalizados)
CREATE OR ALTER PROCEDURE [dbo].[sp_ObterFuncionarioCompleto]
    @FuncionarioId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Dados base do funcionário
    SELECT 
        f.*,
        tf.nome AS tipo_funcionario_nome,
        u.username,
        u.email AS email_acesso
    FROM [dbo].[funcionarios] f
    LEFT JOIN [dbo].[tipos_funcionarios] tf ON f.tipo_funcionario_id = tf.id
    LEFT JOIN [dbo].[utilizadores] u ON u.funcionario_id = f.id
    WHERE f.id = @FuncionarioId;
    
    -- Campos personalizados
    SELECT 
        codigo_campo,
        valor_texto,
        valor_numero,
        valor_data,
        valor_datetime,
        valor_boolean,
        valor_json
    FROM [dbo].[funcionarios_valores_personalizados]
    WHERE funcionario_id = @FuncionarioId;
    
    -- Contatos
    SELECT * FROM [dbo].[contatos] WHERE funcionario_id = @FuncionarioId;
    
    -- Endereços
    SELECT * FROM [dbo].[enderecos] WHERE funcionario_id = @FuncionarioId;
    
    -- Dependentes
    SELECT * FROM [dbo].[dependentes] WHERE funcionario_id = @FuncionarioId;
    
    -- Empregos
    SELECT * FROM [dbo].[empregos] WHERE funcionario_id = @FuncionarioId ORDER BY data_admissao DESC;
    
    -- Benefícios
    SELECT * FROM [dbo].[beneficios] WHERE funcionario_id = @FuncionarioId AND ativo = 1;
    
    -- Documentos
    SELECT d.*, a.caminho, a.nome_original
    FROM [dbo].[documentos] d
    LEFT JOIN [dbo].[anexos] a ON d.anexo_id = a.id
    WHERE d.funcionario_id = @FuncionarioId;
END
GO

-- Procedure: Salvar Campo Personalizado de Funcionário
CREATE OR ALTER PROCEDURE [dbo].[sp_SalvarCampoPersonalizadoFuncionario]
    @FuncionarioId INT,
    @CodigoCampo NVARCHAR(100),
    @TipoDados NVARCHAR(50),
    @ValorTexto NVARCHAR(MAX) = NULL,
    @ValorNumero DECIMAL(18,4) = NULL,
    @ValorData DATE = NULL,
    @ValorDatetime DATETIME2 = NULL,
    @ValorBoolean BIT = NULL,
    @ValorJson NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Verificar se já existe
    IF EXISTS (
        SELECT 1 FROM [dbo].[funcionarios_valores_personalizados] 
        WHERE funcionario_id = @FuncionarioId AND codigo_campo = @CodigoCampo
    )
    BEGIN
        -- Atualizar
        UPDATE [dbo].[funcionarios_valores_personalizados]
        SET 
            valor_texto = @ValorTexto,
            valor_numero = @ValorNumero,
            valor_data = @ValorData,
            valor_datetime = @ValorDatetime,
            valor_boolean = @ValorBoolean,
            valor_json = @ValorJson,
            atualizado_em = GETDATE()
        WHERE funcionario_id = @FuncionarioId AND codigo_campo = @CodigoCampo;
    END
    ELSE
    BEGIN
        -- Inserir
        INSERT INTO [dbo].[funcionarios_valores_personalizados]
            (funcionario_id, codigo_campo, valor_texto, valor_numero, valor_data, valor_datetime, valor_boolean, valor_json)
        VALUES
            (@FuncionarioId, @CodigoCampo, @ValorTexto, @ValorNumero, @ValorData, @ValorDatetime, @ValorBoolean, @ValorJson);
    END
    
    SELECT 'SUCCESS' AS Status;
END
GO

-- Procedure: Criar Funcionário Completo
CREATE OR ALTER PROCEDURE [dbo].[sp_CriarFuncionarioCompleto]
    @Numero INT = NULL,
    @TipoFuncionarioId INT = NULL,
    @NomeCompleto NVARCHAR(255),
    @NomeAbreviado NVARCHAR(100) = NULL,
    @Sexo NVARCHAR(20),
    @DataNascimento DATE,
    @Naturalidade NVARCHAR(255) = NULL,
    @Nacionalidade NVARCHAR(100) = NULL,
    @EstadoCivil NVARCHAR(50) = NULL,
    @CamposPersonalizados NVARCHAR(MAX) = NULL, -- JSON: [{"codigo":"campo1","tipo":"text","valor":"valor1"}]
    @CriarUtilizador BIT = 0,
    @Username NVARCHAR(100) = NULL,
    @Email NVARCHAR(255) = NULL,
    @Senha NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    DECLARE @FuncionarioId INT;
    DECLARE @UtilizadorId INT;
    
    BEGIN TRY
        -- Inserir funcionário
        INSERT INTO [dbo].[funcionarios] 
            (numero, tipo_funcionario_id, nome_completo, nome_abreviado, sexo, data_nascimento, 
             naturalidade, nacionalidade, estado_civil, ativo)
        VALUES 
            (@Numero, @TipoFuncionarioId, @NomeCompleto, @NomeAbreviado, @Sexo, @DataNascimento,
             @Naturalidade, @Nacionalidade, @EstadoCivil, 1);
        
        SET @FuncionarioId = SCOPE_IDENTITY();
        
        -- Processar campos personalizados se fornecidos
        IF @CamposPersonalizados IS NOT NULL
        BEGIN
            DECLARE @Json NVARCHAR(MAX) = @CamposPersonalizados;
            
            INSERT INTO [dbo].[funcionarios_valores_personalizados]
                (funcionario_id, codigo_campo, valor_texto, valor_numero, valor_data, valor_datetime, valor_boolean, valor_json)
            SELECT 
                @FuncionarioId,
                JSON_VALUE(value, '$.codigo'),
                CASE WHEN JSON_VALUE(value, '$.tipo') IN ('text', 'textarea', 'email', 'phone', 'url') 
                     THEN JSON_VALUE(value, '$.valor') END,
                CASE WHEN JSON_VALUE(value, '$.tipo') IN ('number', 'decimal') 
                     THEN TRY_CAST(JSON_VALUE(value, '$.valor') AS DECIMAL(18,4)) END,
                CASE WHEN JSON_VALUE(value, '$.tipo') = 'date' 
                     THEN TRY_CAST(JSON_VALUE(value, '$.valor') AS DATE) END,
                CASE WHEN JSON_VALUE(value, '$.tipo') = 'datetime' 
                     THEN TRY_CAST(JSON_VALUE(value, '$.valor') AS DATETIME2) END,
                CASE WHEN JSON_VALUE(value, '$.tipo') = 'boolean' 
                     THEN TRY_CAST(JSON_VALUE(value, '$.valor') AS BIT) END,
                CASE WHEN JSON_VALUE(value, '$.tipo') = 'json' 
                     THEN JSON_QUERY(value, '$.valor') END
            FROM OPENJSON(@Json);
        END
        
        -- Criar utilizador se solicitado
        IF @CriarUtilizador = 1 AND @Email IS NOT NULL AND @Senha IS NOT NULL
        BEGIN
            IF @Username IS NULL
                SET @Username = LEFT(@Email, CHARINDEX('@', @Email) - 1);
            
            INSERT INTO [dbo].[utilizadores] 
                (username, email, senha_hash, ativo, funcionario_id)
            VALUES 
                (@Username, @Email, @Senha, 1, @FuncionarioId);
            
            SET @UtilizadorId = SCOPE_IDENTITY();
        END
        
        COMMIT TRANSACTION;
        
        SELECT 
            'SUCCESS' AS Status,
            @FuncionarioId AS FuncionarioId,
            @UtilizadorId AS UtilizadorId;
            
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        
        SELECT 
            'ERROR' AS Status,
            ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END
GO

-- Procedure: Listar Funcionários com Filtros Dinâmicos
CREATE OR ALTER PROCEDURE [dbo].[sp_ListarFuncionarios]
    @TipoFuncionarioId INT = NULL,
    @Ativo BIT = NULL,
    @TextoPesquisa NVARCHAR(255) = NULL,
    @PageNumber INT = 1,
    @PageSize INT = 50
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    
    -- Total de registros
    SELECT COUNT(*) AS TotalRegistros
    FROM [dbo].[funcionarios] f
    WHERE 
        (@TipoFuncionarioId IS NULL OR f.tipo_funcionario_id = @TipoFuncionarioId)
        AND (@Ativo IS NULL OR f.ativo = @Ativo)
        AND (@TextoPesquisa IS NULL OR 
             f.nome_completo LIKE '%' + @TextoPesquisa + '%' OR
             CAST(f.numero AS NVARCHAR) LIKE '%' + @TextoPesquisa + '%');
    
    -- Dados paginados
    SELECT 
        f.id,
        f.numero,
        f.nome_completo,
        f.nome_abreviado,
        f.sexo,
        f.data_nascimento,
        DATEDIFF(YEAR, f.data_nascimento, GETDATE()) AS idade,
        f.nacionalidade,
        f.ativo,
        tf.nome AS tipo_funcionario,
        tf.cor AS tipo_funcionario_cor,
        u.email,
        u.ativo AS tem_acesso,
        (SELECT COUNT(*) FROM [dbo].[empregos] WHERE funcionario_id = f.id) AS total_empregos,
        (SELECT COUNT(*) FROM [dbo].[beneficios] WHERE funcionario_id = f.id AND ativo = 1) AS total_beneficios_ativos,
        f.criado_em,
        f.atualizado_em
    FROM [dbo].[funcionarios] f
    LEFT JOIN [dbo].[tipos_funcionarios] tf ON f.tipo_funcionario_id = tf.id
    LEFT JOIN [dbo].[utilizadores] u ON u.funcionario_id = f.id
    WHERE 
        (@TipoFuncionarioId IS NULL OR f.tipo_funcionario_id = @TipoFuncionarioId)
        AND (@Ativo IS NULL OR f.ativo = @Ativo)
        AND (@TextoPesquisa IS NULL OR 
             f.nome_completo LIKE '%' + @TextoPesquisa + '%' OR
             CAST(f.numero AS NVARCHAR) LIKE '%' + @TextoPesquisa + '%')
    ORDER BY f.nome_completo
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO

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

PRINT 'Helpers e Procedures criados com sucesso!'
PRINT 'Sistema completo de campos dinâmicos operacional!'
GO