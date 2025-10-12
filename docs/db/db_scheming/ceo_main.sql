/****************************************************************************/
/* SCRIPT 1: BASE DE DADOS PRINCIPAL - CEO_Main                            */
/* Microsoft SQL Server - Multi-Tenant com Campos Dinâmicos                */
/* Data: 12/10/2025                                                        */
/****************************************************************************/

USE [master]
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'CEO_Main')
BEGIN
    CREATE DATABASE [CEO_Main]
END
GO

USE [CEO_Main]
GO

/****** TABELA: tenants ******/
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[tenants]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[tenants](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [nome] [nvarchar](255) NOT NULL,
        [slug] [nvarchar](100) NOT NULL,
        [dominio] [nvarchar](255) NULL,
        [database_name] [nvarchar](100) NOT NULL,
        [logo_url] [nvarchar](500) NULL,
        [cor_primaria] [nvarchar](20) NULL,
        [cor_secundaria] [nvarchar](20) NULL,
        [ativo] [bit] NOT NULL,
        [data_expiracao] [datetime2](7) NULL,
        [plano_id] [int] NULL,
        [max_utilizadores] [int] NULL,
        [max_armazenamento_gb] [int] NULL,
        [configuracoes] [nvarchar](max) NULL,
        [criado_em] [datetime2](7) NOT NULL,
        [atualizado_em] [datetime2](7) NULL,
     CONSTRAINT [PK_tenants] PRIMARY KEY CLUSTERED ([id] ASC),
     CONSTRAINT [UQ_tenants_slug] UNIQUE NONCLUSTERED ([slug] ASC),
     CONSTRAINT [UQ_tenants_database] UNIQUE NONCLUSTERED ([database_name] ASC)
    )
    
    ALTER TABLE [dbo].[tenants] ADD CONSTRAINT [DF_tenants_ativo] DEFAULT ((1)) FOR [ativo]
    ALTER TABLE [dbo].[tenants] ADD CONSTRAINT [DF_tenants_criado_em] DEFAULT (getdate()) FOR [criado_em]
    ALTER TABLE [dbo].[tenants] ADD CONSTRAINT [DF_tenants_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
END
GO

/****** TABELA: planos ******/
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[planos]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[planos](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [codigo] [nvarchar](50) NOT NULL,
        [nome] [nvarchar](100) NOT NULL,
        [descricao] [nvarchar](500) NULL,
        [preco_mensal] [decimal](10, 2) NULL,
        [preco_anual] [decimal](10, 2) NULL,
        [max_utilizadores] [int] NULL,
        [max_armazenamento_gb] [int] NULL,
        [recursos] [nvarchar](max) NULL,
        [ativo] [bit] NOT NULL,
        [ordem] [int] NOT NULL,
        [criado_em] [datetime2](7) NOT NULL,
        [atualizado_em] [datetime2](7) NULL,
     CONSTRAINT [PK_planos] PRIMARY KEY CLUSTERED ([id] ASC),
     CONSTRAINT [UQ_planos_codigo] UNIQUE NONCLUSTERED ([codigo] ASC)
    )
    
    ALTER TABLE [dbo].[planos] ADD CONSTRAINT [DF_planos_ativo] DEFAULT ((1)) FOR [ativo]
    ALTER TABLE [dbo].[planos] ADD CONSTRAINT [DF_planos_ordem] DEFAULT ((0)) FOR [ordem]
    ALTER TABLE [dbo].[planos] ADD CONSTRAINT [DF_planos_criado_em] DEFAULT (getdate()) FOR [criado_em]
    ALTER TABLE [dbo].[planos] ADD CONSTRAINT [DF_planos_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
END
GO

/****** TABELA: modulos ******/
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[modulos]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[modulos](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [codigo] [nvarchar](50) NOT NULL,
        [nome] [nvarchar](100) NOT NULL,
        [descricao] [nvarchar](500) NULL,
        [icone] [nvarchar](50) NULL,
        [rota] [nvarchar](100) NULL,
        [ordem] [int] NOT NULL,
        [ativo] [bit] NOT NULL,
        [versao] [nvarchar](20) NULL,
        [criado_em] [datetime2](7) NOT NULL,
        [atualizado_em] [datetime2](7) NULL,
     CONSTRAINT [PK_modulos] PRIMARY KEY CLUSTERED ([id] ASC),
     CONSTRAINT [UQ_modulos_codigo] UNIQUE NONCLUSTERED ([codigo] ASC)
    )
    
    ALTER TABLE [dbo].[modulos] ADD CONSTRAINT [DF_modulos_ativo] DEFAULT ((1)) FOR [ativo]
    ALTER TABLE [dbo].[modulos] ADD CONSTRAINT [DF_modulos_ordem] DEFAULT ((0)) FOR [ordem]
    ALTER TABLE [dbo].[modulos] ADD CONSTRAINT [DF_modulos_criado_em] DEFAULT (getdate()) FOR [criado_em]
    ALTER TABLE [dbo].[modulos] ADD CONSTRAINT [DF_modulos_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
END
GO

/****** TABELA: entidades_sistema (Tabelas base do sistema) ******/
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[entidades_sistema]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[entidades_sistema](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [codigo] [nvarchar](50) NOT NULL,
        [nome] [nvarchar](100) NOT NULL,
        [tabela_fisica] [nvarchar](100) NOT NULL,
        [descricao] [nvarchar](500) NULL,
        [modulo_id] [int] NOT NULL,
        [permite_personalizacao] [bit] NOT NULL,
        [campos_base] [nvarchar](max) NULL, -- JSON com campos obrigatórios
        [ativo] [bit] NOT NULL,
        [criado_em] [datetime2](7) NOT NULL,
        [atualizado_em] [datetime2](7) NULL,
     CONSTRAINT [PK_entidades_sistema] PRIMARY KEY CLUSTERED ([id] ASC),
     CONSTRAINT [UQ_entidades_sistema_codigo] UNIQUE NONCLUSTERED ([codigo] ASC)
    )
    
    ALTER TABLE [dbo].[entidades_sistema] ADD CONSTRAINT [DF_entidades_sistema_permite_personalizacao] DEFAULT ((1)) FOR [permite_personalizacao]
    ALTER TABLE [dbo].[entidades_sistema] ADD CONSTRAINT [DF_entidades_sistema_ativo] DEFAULT ((1)) FOR [ativo]
    ALTER TABLE [dbo].[entidades_sistema] ADD CONSTRAINT [DF_entidades_sistema_criado_em] DEFAULT (getdate()) FOR [criado_em]
    ALTER TABLE [dbo].[entidades_sistema] ADD CONSTRAINT [DF_entidades_sistema_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
    ALTER TABLE [dbo].[entidades_sistema] ADD CONSTRAINT [FK_entidades_sistema_modulo] 
        FOREIGN KEY([modulo_id]) REFERENCES [dbo].[modulos] ([id])
END
GO

/****** TABELA: tenant_campos_personalizados ******/
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[tenant_campos_personalizados]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[tenant_campos_personalizados](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [tenant_id] [int] NOT NULL,
        [entidade_sistema_id] [int] NOT NULL,
        [codigo_campo] [nvarchar](100) NOT NULL,
        [nome_campo] [nvarchar](255) NOT NULL,
        [tipo_dados] [nvarchar](50) NOT NULL, -- text, number, date, boolean, select, multiselect, file, etc
        [tamanho_maximo] [int] NULL,
        [obrigatorio] [bit] NOT NULL,
        [valor_padrao] [nvarchar](500) NULL,
        [opcoes] [nvarchar](max) NULL, -- JSON para selects: [{"value": "1", "label": "Opção 1"}]
        [validacao] [nvarchar](500) NULL, -- Regex ou regras de validação
        [ordem] [int] NOT NULL,
        [grupo] [nvarchar](100) NULL, -- Para agrupar campos em seções
        [visivel] [bit] NOT NULL,
        [editavel] [bit] NOT NULL,
        [configuracao_extra] [nvarchar](max) NULL, -- JSON com configs adicionais
        [criado_em] [datetime2](7) NOT NULL,
        [atualizado_em] [datetime2](7) NULL,
     CONSTRAINT [PK_tenant_campos_personalizados] PRIMARY KEY CLUSTERED ([id] ASC),
     CONSTRAINT [UQ_tenant_campos] UNIQUE NONCLUSTERED ([tenant_id], [entidade_sistema_id], [codigo_campo])
    )
    
    ALTER TABLE [dbo].[tenant_campos_personalizados] ADD CONSTRAINT [DF_tenant_campos_obrigatorio] DEFAULT ((0)) FOR [obrigatorio]
    ALTER TABLE [dbo].[tenant_campos_personalizados] ADD CONSTRAINT [DF_tenant_campos_ordem] DEFAULT ((0)) FOR [ordem]
    ALTER TABLE [dbo].[tenant_campos_personalizados] ADD CONSTRAINT [DF_tenant_campos_visivel] DEFAULT ((1)) FOR [visivel]
    ALTER TABLE [dbo].[tenant_campos_personalizados] ADD CONSTRAINT [DF_tenant_campos_editavel] DEFAULT ((1)) FOR [editavel]
    ALTER TABLE [dbo].[tenant_campos_personalizados] ADD CONSTRAINT [DF_tenant_campos_criado_em] DEFAULT (getdate()) FOR [criado_em]
    ALTER TABLE [dbo].[tenant_campos_personalizados] ADD CONSTRAINT [DF_tenant_campos_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
    
    ALTER TABLE [dbo].[tenant_campos_personalizados] ADD CONSTRAINT [CHK_tenant_campos_tipo] 
        CHECK ([tipo_dados] IN ('text', 'textarea', 'number', 'decimal', 'date', 'datetime', 'boolean', 'select', 'multiselect', 'file', 'email', 'phone', 'url', 'color', 'json'))
    
    ALTER TABLE [dbo].[tenant_campos_personalizados] ADD CONSTRAINT [FK_tenant_campos_tenant] 
        FOREIGN KEY([tenant_id]) REFERENCES [dbo].[tenants] ([id]) ON DELETE CASCADE
    ALTER TABLE [dbo].[tenant_campos_personalizados] ADD CONSTRAINT [FK_tenant_campos_entidade] 
        FOREIGN KEY([entidade_sistema_id]) REFERENCES [dbo].[entidades_sistema] ([id])
END
GO

/****** TABELA: tenant_modulos ******/
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[tenant_modulos]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[tenant_modulos](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [tenant_id] [int] NOT NULL,
        [modulo_id] [int] NOT NULL,
        [ativo] [bit] NOT NULL,
        [data_ativacao] [datetime2](7) NULL,
        [data_expiracao] [datetime2](7) NULL,
        [criado_em] [datetime2](7) NOT NULL,
        [atualizado_em] [datetime2](7) NULL,
     CONSTRAINT [PK_tenant_modulos] PRIMARY KEY CLUSTERED ([id] ASC),
     CONSTRAINT [UQ_tenant_modulos] UNIQUE NONCLUSTERED ([tenant_id] ASC, [modulo_id] ASC)
    )
    
    ALTER TABLE [dbo].[tenant_modulos] ADD CONSTRAINT [DF_tenant_modulos_ativo] DEFAULT ((1)) FOR [ativo]
    ALTER TABLE [dbo].[tenant_modulos] ADD CONSTRAINT [DF_tenant_modulos_criado_em] DEFAULT (getdate()) FOR [criado_em]
    ALTER TABLE [dbo].[tenant_modulos] ADD CONSTRAINT [DF_tenant_modulos_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
    
    ALTER TABLE [dbo].[tenant_modulos] ADD CONSTRAINT [FK_tenant_modulos_tenant] 
        FOREIGN KEY([tenant_id]) REFERENCES [dbo].[tenants] ([id]) ON DELETE CASCADE
    ALTER TABLE [dbo].[tenant_modulos] ADD CONSTRAINT [FK_tenant_modulos_modulo] 
        FOREIGN KEY([modulo_id]) REFERENCES [dbo].[modulos] ([id])
END
GO

/****** TABELA: tenant_logs ******/
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[tenant_logs]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[tenant_logs](
        [id] [bigint] IDENTITY(1,1) NOT NULL,
        [tenant_id] [int] NOT NULL,
        [tipo] [nvarchar](50) NOT NULL,
        [acao] [nvarchar](255) NOT NULL,
        [detalhes] [nvarchar](max) NULL,
        [utilizador_id] [int] NULL,
        [ip_address] [nvarchar](50) NULL,
        [user_agent] [nvarchar](500) NULL,
        [criado_em] [datetime2](7) NOT NULL,
     CONSTRAINT [PK_tenant_logs] PRIMARY KEY CLUSTERED ([id] ASC)
    )
    
    ALTER TABLE [dbo].[tenant_logs] ADD CONSTRAINT [DF_tenant_logs_criado_em] DEFAULT (getdate()) FOR [criado_em]
    ALTER TABLE [dbo].[tenant_logs] ADD CONSTRAINT [CHK_tenant_logs_tipo] 
        CHECK ([tipo] IN ('login', 'logout', 'create', 'update', 'delete', 'export', 'import', 'error', 'warning', 'info', 'security'))
    
    ALTER TABLE [dbo].[tenant_logs] ADD CONSTRAINT [FK_tenant_logs_tenant] 
        FOREIGN KEY([tenant_id]) REFERENCES [dbo].[tenants] ([id]) ON DELETE CASCADE
    
    CREATE NONCLUSTERED INDEX [IX_tenant_logs_tenant_data] ON [dbo].[tenant_logs]([tenant_id], [criado_em] DESC)
END
GO

/****** FOREIGN KEYS ******/
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_tenants_planos')
    ALTER TABLE [dbo].[tenants] WITH CHECK ADD CONSTRAINT [FK_tenants_planos] 
    FOREIGN KEY([plano_id]) REFERENCES [dbo].[planos] ([id])
GO

/****** DADOS INICIAIS - PLANOS ******/
IF NOT EXISTS (SELECT * FROM [dbo].[planos])
BEGIN
    SET IDENTITY_INSERT [dbo].[planos] ON
    
    INSERT INTO [dbo].[planos] ([id], [codigo], [nome], [descricao], [preco_mensal], [preco_anual], [max_utilizadores], [max_armazenamento_gb], [recursos], [ativo], [ordem])
    VALUES 
    (1, 'basico', 'Básico', 'Plano básico com funcionalidades essenciais', 49.99, 499.99, 5, 10, '{"modulos": ["RH", "UTILIZADORES"]}', 1, 1),
    (2, 'profissional', 'Profissional', 'Plano completo para pequenas empresas', 99.99, 999.99, 20, 50, '{"modulos": ["RH", "VEICULOS", "UTILIZADORES"]}', 1, 2),
    (3, 'empresarial', 'Empresarial', 'Solução completa para grandes organizações', 249.99, 2499.99, 100, 200, '{"modulos": ["*"]}', 1, 3)
    
    SET IDENTITY_INSERT [dbo].[planos] OFF
END
GO

/****** DADOS INICIAIS - MÓDULOS ******/
IF NOT EXISTS (SELECT * FROM [dbo].[modulos])
BEGIN
    SET IDENTITY_INSERT [dbo].[modulos] ON
    
    INSERT INTO [dbo].[modulos] ([id], [codigo], [nome], [descricao], [icone], [rota], [ordem], [ativo], [versao])
    VALUES 
    (1, 'RH', 'Recursos Humanos', 'Gestão completa de RH', 'users', '/rh', 1, 1, '1.0.0'),
    (2, 'VEICULOS', 'Gestão de Veículos', 'Controle de frota', 'truck', '/veiculos', 2, 1, '1.0.0'),
    (3, 'UTILIZADORES', 'Utilizadores', 'Gestão de acessos', 'user-cog', '/utilizadores', 3, 1, '1.0.0')
    
    SET IDENTITY_INSERT [dbo].[modulos] OFF
END
GO

/****** DADOS INICIAIS - ENTIDADES SISTEMA ******/
IF NOT EXISTS (SELECT * FROM [dbo].[entidades_sistema])
BEGIN
    SET IDENTITY_INSERT [dbo].[entidades_sistema] ON
    
    INSERT INTO [dbo].[entidades_sistema] ([id], [codigo], [nome], [tabela_fisica], [descricao], [modulo_id], [permite_personalizacao], [campos_base], [ativo])
    VALUES 
    (1, 'FUNCIONARIOS', 'Funcionários', 'funcionarios', 'Cadastro de funcionários da empresa', 1, 1, 
     '{"campos": [
        {"codigo": "numero", "nome": "Número", "tipo": "number", "obrigatorio": false},
        {"codigo": "nome_completo", "nome": "Nome Completo", "tipo": "text", "obrigatorio": true},
        {"codigo": "data_nascimento", "nome": "Data de Nascimento", "tipo": "date", "obrigatorio": true},
        {"codigo": "sexo", "nome": "Sexo", "tipo": "select", "obrigatorio": true}
     ]}', 1),
    (2, 'EMPREGOS', 'Vínculos Empregatícios', 'empregos', 'Histórico e dados de emprego', 1, 1,
     '{"campos": [
        {"codigo": "data_admissao", "nome": "Data de Admissão", "tipo": "date", "obrigatorio": true},
        {"codigo": "tipo_contrato", "nome": "Tipo de Contrato", "tipo": "select", "obrigatorio": true},
        {"codigo": "cargo", "nome": "Cargo", "tipo": "text", "obrigatorio": true}
     ]}', 1),
    (3, 'BENEFICIOS', 'Benefícios', 'beneficios', 'Benefícios dos funcionários', 1, 1,
     '{"campos": [
        {"codigo": "tipo", "nome": "Tipo de Benefício", "tipo": "select", "obrigatorio": true},
        {"codigo": "data_inicio", "nome": "Data de Início", "tipo": "date", "obrigatorio": false}
     ]}', 1),
    (4, 'DOCUMENTOS', 'Documentos', 'documentos', 'Documentos pessoais e profissionais', 1, 1,
     '{"campos": [
        {"codigo": "tipo", "nome": "Tipo de Documento", "tipo": "select", "obrigatorio": true},
        {"codigo": "numero", "nome": "Número", "tipo": "text", "obrigatorio": true}
     ]}', 1),
    (5, 'VEICULOS', 'Veículos', 'veiculos', 'Frota de veículos', 2, 1,
     '{"campos": [
        {"codigo": "numero_interno", "nome": "Número Interno", "tipo": "text", "obrigatorio": true},
        {"codigo": "matricula", "nome": "Matrícula", "tipo": "text", "obrigatorio": true},
        {"codigo": "marca", "nome": "Marca", "tipo": "select", "obrigatorio": true}
     ]}', 1)
    
    SET IDENTITY_INSERT [dbo].[entidades_sistema] OFF
END
GO

PRINT 'Base de dados CEO_Main criada com sucesso!'
PRINT 'Sistema de campos dinâmicos configurado!'
GO