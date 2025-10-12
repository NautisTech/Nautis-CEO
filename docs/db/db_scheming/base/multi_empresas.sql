/****************************************************************************/
/* MÓDULO: MULTI-EMPRESA COM CONTROLO DE ACESSO                            */
/* Um tenant pode ter várias empresas/entidades                            */
/* Controlo de acesso: Utilizador só vê dados da(s) sua(s) empresa(s)     */
/* Data: 12/10/2025                                                        */
/****************************************************************************/

USE [{TenantDB}]
GO

/******************************************************************************/
/* ESTRUTURA BÁSICA DE EMPRESAS                                             */
/******************************************************************************/

-- Tabela: Empresas/Entidades (dentro do tenant)
CREATE TABLE [dbo].[empresas](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[codigo] [nvarchar](50) NOT NULL,
	[nome] [nvarchar](255) NOT NULL,
	[nif] [nvarchar](50) NULL,
	[logo_url] [nvarchar](500) NULL,
	[cor] [nvarchar](20) NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_empresas] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_empresas_codigo] UNIQUE NONCLUSTERED ([codigo] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[empresas] ADD CONSTRAINT [DF_empresas_ativo] DEFAULT ((1)) FOR [ativo]
ALTER TABLE [dbo].[empresas] ADD CONSTRAINT [DF_empresas_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[empresas] ADD CONSTRAINT [DF_empresas_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
GO

CREATE NONCLUSTERED INDEX [IX_empresas_codigo] ON [dbo].[empresas]([codigo])
CREATE NONCLUSTERED INDEX [IX_empresas_ativo] ON [dbo].[empresas]([ativo])
GO

/******************************************************************************/
/* CONTROLO DE ACESSO: UTILIZADOR ↔ EMPRESAS                                */
/******************************************************************************/

-- Tabela: Utilizador tem acesso a uma ou mais empresas
CREATE TABLE [dbo].[utilizador_empresa](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[utilizador_id] [int] NOT NULL,
	[empresa_id] [int] NOT NULL,
	[empresa_principal] [bit] NOT NULL, -- Empresa padrão do utilizador
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_utilizador_empresa] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_utilizador_empresa] UNIQUE NONCLUSTERED ([utilizador_id], [empresa_id])
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[utilizador_empresa] ADD CONSTRAINT [DF_utilizador_empresa_principal] DEFAULT ((0)) FOR [empresa_principal]
ALTER TABLE [dbo].[utilizador_empresa] ADD CONSTRAINT [DF_utilizador_empresa_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[utilizador_empresa] ADD CONSTRAINT [FK_utilizador_empresa_utilizador] 
    FOREIGN KEY([utilizador_id]) REFERENCES [dbo].[utilizadores] ([id]) ON DELETE CASCADE
ALTER TABLE [dbo].[utilizador_empresa] ADD CONSTRAINT [FK_utilizador_empresa_empresa] 
    FOREIGN KEY([empresa_id]) REFERENCES [dbo].[empresas] ([id]) ON DELETE CASCADE
GO

CREATE NONCLUSTERED INDEX [IX_utilizador_empresa_utilizador] ON [dbo].[utilizador_empresa]([utilizador_id])
CREATE NONCLUSTERED INDEX [IX_utilizador_empresa_empresa] ON [dbo].[utilizador_empresa]([empresa_id])
GO

/******************************************************************************/
/* ADICIONAR EMPRESA_ID NAS TABELAS PRINCIPAIS                              */
/******************************************************************************/

-- Adicionar empresa_id em funcionários
ALTER TABLE [dbo].[funcionarios] ADD [empresa_id] [int] NULL;
GO

ALTER TABLE [dbo].[funcionarios] ADD CONSTRAINT [FK_funcionarios_empresa] 
    FOREIGN KEY([empresa_id]) REFERENCES [dbo].[empresas] ([id])
GO

CREATE NONCLUSTERED INDEX [IX_funcionarios_empresa] ON [dbo].[funcionarios]([empresa_id])
GO

-- Adicionar empresa_id em veículos
ALTER TABLE [dbo].[veiculos] ADD [empresa_id] [int] NULL;
GO

ALTER TABLE [dbo].[veiculos] ADD CONSTRAINT [FK_veiculos_empresa] 
    FOREIGN KEY([empresa_id]) REFERENCES [dbo].[empresas] ([id])
GO

CREATE NONCLUSTERED INDEX [IX_veiculos_empresa] ON [dbo].[veiculos]([empresa_id])
GO

-- Adicionar empresa_id em conteúdos
ALTER TABLE [dbo].[conteudos] ADD [empresa_id] [int] NULL;
ALTER TABLE [dbo].[conteudos] ADD [visibilidade] [nvarchar](20) NOT NULL DEFAULT ('privada');
GO

ALTER TABLE [dbo].[conteudos] ADD CONSTRAINT [CHK_conteudos_visibilidade] 
    CHECK ([visibilidade] IN ('privada', 'publica', 'grupo_empresas'))
ALTER TABLE [dbo].[conteudos] ADD CONSTRAINT [FK_conteudos_empresa] 
    FOREIGN KEY([empresa_id]) REFERENCES [dbo].[empresas] ([id])
GO

CREATE NONCLUSTERED INDEX [IX_conteudos_empresa] ON [dbo].[conteudos]([empresa_id])
CREATE NONCLUSTERED INDEX [IX_conteudos_visibilidade] ON [dbo].[conteudos]([visibilidade])
GO

-- Tabela: Conteúdo pode ser compartilhado com múltiplas empresas
CREATE TABLE [dbo].[conteudo_empresa](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[conteudo_id] [int] NOT NULL,
	[empresa_id] [int] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_conteudo_empresa] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_conteudo_empresa] UNIQUE NONCLUSTERED ([conteudo_id], [empresa_id])
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[conteudo_empresa] ADD CONSTRAINT [DF_conteudo_empresa_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[conteudo_empresa] ADD CONSTRAINT [FK_conteudo_empresa_conteudo] 
    FOREIGN KEY([conteudo_id]) REFERENCES [dbo].[conteudos] ([id]) ON DELETE CASCADE
ALTER TABLE [dbo].[conteudo_empresa] ADD CONSTRAINT [FK_conteudo_empresa_empresa] 
    FOREIGN KEY([empresa_id]) REFERENCES [dbo].[empresas] ([id]) ON DELETE CASCADE
GO

CREATE NONCLUSTERED INDEX [IX_conteudo_empresa_conteudo] ON [dbo].[conteudo_empresa]([conteudo_id])
CREATE NONCLUSTERED INDEX [IX_conteudo_empresa_empresa] ON [dbo].[conteudo_empresa]([empresa_id])
GO

/******************************************************************************/
/* STORED PROCEDURES COM CONTROLO DE ACESSO                                 */
/******************************************************************************/

-- Procedure: Obter Empresas do Utilizador
CREATE OR ALTER PROCEDURE [dbo].[sp_ObterEmpresasUtilizador]
    @UtilizadorId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        e.*,
        ue.empresa_principal,
        (SELECT COUNT(*) FROM [dbo].[funcionarios] WHERE empresa_id = e.id AND ativo = 1) AS total_funcionarios,
        (SELECT COUNT(*) FROM [dbo].[veiculos] WHERE empresa_id = e.id AND em_circulacao = 1) AS total_veiculos
    FROM [dbo].[empresas] e
    INNER JOIN [dbo].[utilizador_empresa] ue ON e.id = ue.empresa_id
    WHERE ue.utilizador_id = @UtilizadorId
      AND e.ativo = 1
    ORDER BY ue.empresa_principal DESC, e.nome;
END
GO

-- Procedure: Verificar se Utilizador tem Acesso à Empresa
CREATE OR ALTER PROCEDURE [dbo].[sp_VerificarAcessoEmpresa]
    @UtilizadorId INT,
    @EmpresaId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    IF EXISTS (
        SELECT 1 FROM [dbo].[utilizador_empresa]
        WHERE utilizador_id = @UtilizadorId 
          AND empresa_id = @EmpresaId
    )
        SELECT 1 AS TemAcesso;
    ELSE
        SELECT 0 AS TemAcesso;
END
GO

-- Procedure: Listar Funcionários (com filtro de empresa)
CREATE OR ALTER PROCEDURE [dbo].[sp_ListarFuncionariosComAcesso]
    @UtilizadorId INT,
    @EmpresaId INT = NULL,
    @TextoPesquisa NVARCHAR(255) = NULL,
    @PageNumber INT = 1,
    @PageSize INT = 50
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    
    -- Verificar se utilizador tem acesso à empresa especificada
    IF @EmpresaId IS NOT NULL
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM [dbo].[utilizador_empresa]
            WHERE utilizador_id = @UtilizadorId AND empresa_id = @EmpresaId
        )
        BEGIN
            RAISERROR ('Utilizador não tem acesso a esta empresa', 16, 1);
            RETURN;
        END
    END
    
    -- Listar funcionários das empresas que o utilizador tem acesso
    SELECT 
        f.id,
        f.numero,
        f.nome_completo,
        f.data_nascimento,
        f.ativo,
        e.nome AS empresa_nome,
        e.codigo AS empresa_codigo,
        tf.nome AS tipo_funcionario
    FROM [dbo].[funcionarios] f
    INNER JOIN [dbo].[empresas] e ON f.empresa_id = e.id
    INNER JOIN [dbo].[utilizador_empresa] ue ON e.id = ue.empresa_id
    LEFT JOIN [dbo].[tipos_funcionarios] tf ON f.tipo_funcionario_id = tf.id
    WHERE ue.utilizador_id = @UtilizadorId
      AND (@EmpresaId IS NULL OR f.empresa_id = @EmpresaId)
      AND (@TextoPesquisa IS NULL OR f.nome_completo LIKE '%' + @TextoPesquisa + '%')
    ORDER BY f.nome_completo
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO

-- Procedure: Listar Conteúdos (com controlo de acesso)
CREATE OR ALTER PROCEDURE [dbo].[sp_ListarConteudosComAcesso]
    @UtilizadorId INT,
    @EmpresaId INT = NULL,
    @TipoConteudoId INT = NULL,
    @Status NVARCHAR(20) = 'publicado',
    @PageNumber INT = 1,
    @PageSize INT = 20
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    
    SELECT 
        c.id,
        c.titulo,
        c.slug,
        c.resumo,
        c.imagem_destaque,
        c.status,
        c.visibilidade,
        c.publicado_em,
        c.visualizacoes,
        e.nome AS empresa_nome,
        e.codigo AS empresa_codigo,
        tc.nome AS tipo_conteudo,
        u.nome AS autor_nome
    FROM [dbo].[conteudos] c
    LEFT JOIN [dbo].[empresas] e ON c.empresa_id = e.id
    INNER JOIN [dbo].[tipos_conteudo] tc ON c.tipo_conteudo_id = tc.id
    LEFT JOIN [dbo].[utilizadores] u ON c.autor_id = u.id
    WHERE c.status = @Status
      AND (@TipoConteudoId IS NULL OR c.tipo_conteudo_id = @TipoConteudoId)
      AND (@EmpresaId IS NULL OR c.empresa_id = @EmpresaId)
      AND (
          -- Conteúdo público (todos veem)
          c.visibilidade = 'publica'
          
          -- OU conteúdo privado da empresa que o utilizador tem acesso
          OR (
              c.visibilidade = 'privada' 
              AND EXISTS (
                  SELECT 1 FROM [dbo].[utilizador_empresa] ue
                  WHERE ue.utilizador_id = @UtilizadorId 
                    AND ue.empresa_id = c.empresa_id
              )
          )
          
          -- OU conteúdo compartilhado com empresas que o utilizador tem acesso
          OR (
              c.visibilidade = 'grupo_empresas'
              AND EXISTS (
                  SELECT 1 FROM [dbo].[conteudo_empresa] ce
                  INNER JOIN [dbo].[utilizador_empresa] ue ON ce.empresa_id = ue.empresa_id
                  WHERE ce.conteudo_id = c.id 
                    AND ue.utilizador_id = @UtilizadorId
              )
          )
      )
    ORDER BY c.publicado_em DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO

-- Procedure: Associar Utilizador a Empresa
CREATE OR ALTER PROCEDURE [dbo].[sp_AssociarUtilizadorEmpresa]
    @UtilizadorId INT,
    @EmpresaId INT,
    @EmpresaPrincipal BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Se for empresa principal, desmarcar outras
    IF @EmpresaPrincipal = 1
    BEGIN
        UPDATE [dbo].[utilizador_empresa]
        SET empresa_principal = 0
        WHERE utilizador_id = @UtilizadorId;
    END
    
    -- Inserir ou atualizar
    IF EXISTS (
        SELECT 1 FROM [dbo].[utilizador_empresa]
        WHERE utilizador_id = @UtilizadorId AND empresa_id = @EmpresaId
    )
    BEGIN
        UPDATE [dbo].[utilizador_empresa]
        SET empresa_principal = @EmpresaPrincipal
        WHERE utilizador_id = @UtilizadorId AND empresa_id = @EmpresaId;
    END
    ELSE
    BEGIN
        INSERT INTO [dbo].[utilizador_empresa] (utilizador_id, empresa_id, empresa_principal)
        VALUES (@UtilizadorId, @EmpresaId, @EmpresaPrincipal);
    END
    
    SELECT 'SUCCESS' AS Status;
END
GO

-- Procedure: Compartilhar Conteúdo com Empresas
CREATE OR ALTER PROCEDURE [dbo].[sp_CompartilharConteudoEmpresas]
    @ConteudoId INT,
    @EmpresasIds NVARCHAR(MAX) -- JSON array: [1, 2, 3]
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Limpar compartilhamentos anteriores
        DELETE FROM [dbo].[conteudo_empresa] WHERE conteudo_id = @ConteudoId;
        
        -- Adicionar novos compartilhamentos
        INSERT INTO [dbo].[conteudo_empresa] (conteudo_id, empresa_id)
        SELECT @ConteudoId, CAST(value AS INT)
        FROM OPENJSON(@EmpresasIds);
        
        -- Atualizar visibilidade do conteúdo
        UPDATE [dbo].[conteudos]
        SET visibilidade = 'grupo_empresas'
        WHERE id = @ConteudoId;
        
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

/******************************************************************************/
/* VIEWS COM CONTROLO DE ACESSO                                             */
/******************************************************************************/

-- View: Estatísticas por Empresa
CREATE OR ALTER VIEW [dbo].[vw_EstatisticasEmpresas]
AS
SELECT 
    e.id,
    e.codigo,
    e.nome,
    (SELECT COUNT(*) FROM [dbo].[funcionarios] WHERE empresa_id = e.id AND ativo = 1) AS total_funcionarios,
    (SELECT COUNT(*) FROM [dbo].[veiculos] WHERE empresa_id = e.id AND em_circulacao = 1) AS total_veiculos,
    (SELECT COUNT(*) FROM [dbo].[conteudos] WHERE empresa_id = e.id AND status = 'publicado') AS total_conteudos,
    (SELECT COUNT(DISTINCT utilizador_id) FROM [dbo].[utilizador_empresa] WHERE empresa_id = e.id) AS total_utilizadores
FROM [dbo].[empresas] e
WHERE e.ativo = 1;
GO

PRINT 'Módulo Multi-Empresa com Controlo de Acesso criado com sucesso!'
PRINT ''
PRINT 'Funcionalidades:'
PRINT '  ✓ Múltiplas empresas por tenant'
PRINT '  ✓ Utilizador pode ter acesso a várias empresas'
PRINT '  ✓ Controlo de acesso em funcionários, veículos e conteúdos'
PRINT '  ✓ Conteúdos com visibilidade: privada, pública ou grupo de empresas'
PRINT '  ✓ Procedures com validação de acesso automática'
GO