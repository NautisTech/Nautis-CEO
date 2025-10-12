/****************************************************************************/
/* SCRIPT 2: TEMPLATE BASE DE DADOS TENANT                                 */
/* Microsoft SQL Server - Estrutura com Campos Dinâmicos                   */
/* Data: 12/10/2025                                                        */
/* NOTA: Substituir {TenantDB} pelo nome da base de dados do tenant        */
/****************************************************************************/

USE [{TenantDB}]
GO

/******************************************************************************/
/* AUTENTICAÇÃO E CONTROLE DE ACESSO                                         */
/******************************************************************************/

-- Tabela: Utilizadores (Login/Autenticação)
CREATE TABLE [dbo].[utilizadores](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[username] [nvarchar](100) NOT NULL,
	[email] [nvarchar](255) NOT NULL,
	[senha_hash] [nvarchar](255) NOT NULL,
	[telefone] [nvarchar](50) NULL,
	[ativo] [bit] NOT NULL,
	[email_verificado] [bit] NOT NULL,
	[email_verificado_em] [datetime2](7) NULL,
	[senha_alterada_em] [datetime2](7) NULL,
	[token_recordar] [nvarchar](255) NULL,
	[token_reset_senha] [nvarchar](255) NULL,
	[token_reset_expira_em] [datetime2](7) NULL,
	[ultimo_acesso] [datetime2](7) NULL,
	[foto_url] [nvarchar](500) NULL,
	[idioma] [nvarchar](10) NULL,
	[tema] [nvarchar](20) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[funcionario_id] [int] NULL, -- Relação opcional com funcionário
 CONSTRAINT [PK_utilizadores] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_utilizadores_username] UNIQUE NONCLUSTERED ([username] ASC),
 CONSTRAINT [UQ_utilizadores_email] UNIQUE NONCLUSTERED ([email] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[utilizadores] ADD CONSTRAINT [DF_utilizadores_ativo] DEFAULT ((1)) FOR [ativo]
ALTER TABLE [dbo].[utilizadores] ADD CONSTRAINT [DF_utilizadores_email_verificado] DEFAULT ((0)) FOR [email_verificado]
ALTER TABLE [dbo].[utilizadores] ADD CONSTRAINT [DF_utilizadores_idioma] DEFAULT ('pt') FOR [idioma]
ALTER TABLE [dbo].[utilizadores] ADD CONSTRAINT [DF_utilizadores_tema] DEFAULT ('light') FOR [tema]
ALTER TABLE [dbo].[utilizadores] ADD CONSTRAINT [DF_utilizadores_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[utilizadores] ADD CONSTRAINT [DF_utilizadores_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
GO

CREATE NONCLUSTERED INDEX [IX_utilizadores_email] ON [dbo].[utilizadores]([email])
CREATE NONCLUSTERED INDEX [IX_utilizadores_funcionario] ON [dbo].[utilizadores]([funcionario_id]) WHERE [funcionario_id] IS NOT NULL
GO

-- Tabela: Grupos (Perfis de Acesso)
CREATE TABLE [dbo].[grupos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [nvarchar](255) NOT NULL,
	[descricao] [nvarchar](500) NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_grupos] PRIMARY KEY CLUSTERED ([id] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[grupos] ADD CONSTRAINT [DF_grupos_ativo] DEFAULT ((1)) FOR [ativo]
ALTER TABLE [dbo].[grupos] ADD CONSTRAINT [DF_grupos_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[grupos] ADD CONSTRAINT [DF_grupos_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
GO

-- Tabela: Permissões
CREATE TABLE [dbo].[permissoes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[codigo] [nvarchar](100) NOT NULL,
	[nome] [nvarchar](255) NOT NULL,
	[descricao] [nvarchar](500) NULL,
	[modulo] [nvarchar](50) NOT NULL,
	[tipo] [nvarchar](20) NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_permissoes] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_permissoes_codigo] UNIQUE NONCLUSTERED ([codigo] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[permissoes] ADD CONSTRAINT [DF_permissoes_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[permissoes] ADD CONSTRAINT [CHK_permissoes_tipo] 
    CHECK ([tipo] IN ('Criar', 'Listar', 'Visualizar', 'Editar', 'Apagar', 'Exportar', 'Importar', 'Aprovar'))
GO

-- Tabela: Grupo_Utilizador (Many-to-Many)
CREATE TABLE [dbo].[grupo_utilizador](
	[grupo_id] [int] NOT NULL,
	[utilizador_id] [int] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_grupo_utilizador] PRIMARY KEY CLUSTERED ([grupo_id] ASC, [utilizador_id] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[grupo_utilizador] ADD CONSTRAINT [DF_grupo_utilizador_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[grupo_utilizador] ADD CONSTRAINT [FK_grupo_utilizador_grupo] 
    FOREIGN KEY([grupo_id]) REFERENCES [dbo].[grupos] ([id]) ON DELETE CASCADE
ALTER TABLE [dbo].[grupo_utilizador] ADD CONSTRAINT [FK_grupo_utilizador_utilizador] 
    FOREIGN KEY([utilizador_id]) REFERENCES [dbo].[utilizadores] ([id]) ON DELETE CASCADE
GO

-- Tabela: Grupo_Permissao (Many-to-Many)
CREATE TABLE [dbo].[grupo_permissao](
	[grupo_id] [int] NOT NULL,
	[permissao_id] [int] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_grupo_permissao] PRIMARY KEY CLUSTERED ([grupo_id] ASC, [permissao_id] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[grupo_permissao] ADD CONSTRAINT [DF_grupo_permissao_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[grupo_permissao] ADD CONSTRAINT [FK_grupo_permissao_grupo] 
    FOREIGN KEY([grupo_id]) REFERENCES [dbo].[grupos] ([id]) ON DELETE CASCADE
ALTER TABLE [dbo].[grupo_permissao] ADD CONSTRAINT [FK_grupo_permissao_permissao] 
    FOREIGN KEY([permissao_id]) REFERENCES [dbo].[permissoes] ([id]) ON DELETE CASCADE
GO

-- Tabela: Utilizador_Permissao (Permissões individuais - Many-to-Many)
CREATE TABLE [dbo].[utilizador_permissao](
	[utilizador_id] [int] NOT NULL,
	[permissao_id] [int] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_utilizador_permissao] PRIMARY KEY CLUSTERED ([utilizador_id] ASC, [permissao_id] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[utilizador_permissao] ADD CONSTRAINT [DF_utilizador_permissao_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[utilizador_permissao] ADD CONSTRAINT [FK_utilizador_permissao_utilizador] 
    FOREIGN KEY([utilizador_id]) REFERENCES [dbo].[utilizadores] ([id]) ON DELETE CASCADE
ALTER TABLE [dbo].[utilizador_permissao] ADD CONSTRAINT [FK_utilizador_permissao_permissao] 
    FOREIGN KEY([permissao_id]) REFERENCES [dbo].[permissoes] ([id]) ON DELETE CASCADE
GO

/******************************************************************************/
/* MÓDULO: RECURSOS HUMANOS                                                  */
/******************************************************************************/

-- Tabela: Tipos de Funcionários
CREATE TABLE [dbo].[tipos_funcionarios](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[codigo] [nvarchar](50) NOT NULL,
	[nome] [nvarchar](100) NOT NULL,
	[descricao] [nvarchar](500) NULL,
	[cor] [nvarchar](20) NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_tipos_funcionarios] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_tipos_funcionarios_codigo] UNIQUE NONCLUSTERED ([codigo] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[tipos_funcionarios] ADD CONSTRAINT [DF_tipos_funcionarios_ativo] DEFAULT ((1)) FOR [ativo]
ALTER TABLE [dbo].[tipos_funcionarios] ADD CONSTRAINT [DF_tipos_funcionarios_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[tipos_funcionarios] ADD CONSTRAINT [DF_tipos_funcionarios_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
GO

-- Tabela Principal: Funcionários (Dados Base)
CREATE TABLE [dbo].[funcionarios](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[numero] [int] NULL,
	[tipo_funcionario_id] [int] NULL,
	[nome_completo] [nvarchar](255) NOT NULL,
	[nome_abreviado] [nvarchar](100) NULL,
	[sexo] [nvarchar](20) NOT NULL,
	[data_nascimento] [date] NOT NULL,
	[naturalidade] [nvarchar](255) NULL,
	[nacionalidade] [nvarchar](100) NULL,
	[estado_civil] [nvarchar](50) NULL,
	[foto_url] [nvarchar](500) NULL,
	[observacoes] [nvarchar](max) NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_funcionarios] PRIMARY KEY CLUSTERED ([id] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[funcionarios] ADD CONSTRAINT [DF_funcionarios_ativo] DEFAULT ((1)) FOR [ativo]
ALTER TABLE [dbo].[funcionarios] ADD CONSTRAINT [DF_funcionarios_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[funcionarios] ADD CONSTRAINT [DF_funcionarios_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
ALTER TABLE [dbo].[funcionarios] ADD CONSTRAINT [CHK_funcionarios_sexo] 
    CHECK ([sexo] IN ('Masculino', 'Feminino', 'Outro', 'Não declarado'))
ALTER TABLE [dbo].[funcionarios] ADD CONSTRAINT [CHK_funcionarios_estado_civil] 
    CHECK ([estado_civil] IN ('Solteiro', 'Casado', 'Divorciado', 'Viúvo', 'União de Facto', 'Outro'))
ALTER TABLE [dbo].[funcionarios] ADD CONSTRAINT [FK_funcionarios_tipo] 
    FOREIGN KEY([tipo_funcionario_id]) REFERENCES [dbo].[tipos_funcionarios] ([id])
GO

CREATE NONCLUSTERED INDEX [IX_funcionarios_nome] ON [dbo].[funcionarios]([nome_completo])
CREATE NONCLUSTERED INDEX [IX_funcionarios_numero] ON [dbo].[funcionarios]([numero]) WHERE [numero] IS NOT NULL
CREATE NONCLUSTERED INDEX [IX_funcionarios_tipo] ON [dbo].[funcionarios]([tipo_funcionario_id])
GO

-- AGORA VEM A PARTE MALUCA: Tabela de Valores Dinâmicos (EAV Pattern)
CREATE TABLE [dbo].[funcionarios_valores_personalizados](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[funcionario_id] [int] NOT NULL,
	[codigo_campo] [nvarchar](100) NOT NULL,
	[valor_texto] [nvarchar](max) NULL,
	[valor_numero] [decimal](18, 4) NULL,
	[valor_data] [date] NULL,
	[valor_datetime] [datetime2](7) NULL,
	[valor_boolean] [bit] NULL,
	[valor_json] [nvarchar](max) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_funcionarios_valores_personalizados] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_funcionarios_valores] UNIQUE NONCLUSTERED ([funcionario_id], [codigo_campo])
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[funcionarios_valores_personalizados] ADD CONSTRAINT [DF_funcionarios_valores_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[funcionarios_valores_personalizados] ADD CONSTRAINT [DF_funcionarios_valores_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
ALTER TABLE [dbo].[funcionarios_valores_personalizados] ADD CONSTRAINT [FK_funcionarios_valores_funcionario] 
    FOREIGN KEY([funcionario_id]) REFERENCES [dbo].[funcionarios] ([id]) ON DELETE CASCADE
GO

CREATE NONCLUSTERED INDEX [IX_funcionarios_valores_funcionario] ON [dbo].[funcionarios_valores_personalizados]([funcionario_id])
CREATE NONCLUSTERED INDEX [IX_funcionarios_valores_campo] ON [dbo].[funcionarios_valores_personalizados]([codigo_campo])
GO

-- Tabela: Contatos
CREATE TABLE [dbo].[contatos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[funcionario_id] [int] NOT NULL,
	[tipo] [nvarchar](20) NOT NULL,
	[valor] [nvarchar](255) NOT NULL,
	[principal] [bit] NOT NULL,
	[observacoes] [nvarchar](500) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_contatos] PRIMARY KEY CLUSTERED ([id] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[contatos] ADD CONSTRAINT [DF_contatos_principal] DEFAULT ((0)) FOR [principal]
ALTER TABLE [dbo].[contatos] ADD CONSTRAINT [DF_contatos_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[contatos] ADD CONSTRAINT [DF_contatos_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
ALTER TABLE [dbo].[contatos] ADD CONSTRAINT [CHK_contatos_tipo] 
    CHECK ([tipo] IN ('telefone', 'celular', 'email', 'whatsapp'))
ALTER TABLE [dbo].[contatos] ADD CONSTRAINT [FK_contatos_funcionario] 
    FOREIGN KEY([funcionario_id]) REFERENCES [dbo].[funcionarios] ([id]) ON DELETE CASCADE
GO

-- Tabela: Endereços
CREATE TABLE [dbo].[enderecos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[funcionario_id] [int] NOT NULL,
	[tipo] [nvarchar](20) NOT NULL,
	[logradouro] [nvarchar](255) NOT NULL,
	[numero] [nvarchar](20) NULL,
	[complemento] [nvarchar](100) NULL,
	[bairro] [nvarchar](100) NULL,
	[cidade] [nvarchar](100) NOT NULL,
	[estado] [nvarchar](50) NULL,
	[codigo_postal] [nvarchar](20) NOT NULL,
	[pais] [nvarchar](100) NULL,
	[principal] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_enderecos] PRIMARY KEY CLUSTERED ([id] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[enderecos] ADD CONSTRAINT [DF_enderecos_principal] DEFAULT ((0)) FOR [principal]
ALTER TABLE [dbo].[enderecos] ADD CONSTRAINT [DF_enderecos_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[enderecos] ADD CONSTRAINT [DF_enderecos_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
ALTER TABLE [dbo].[enderecos] ADD CONSTRAINT [CHK_enderecos_tipo] 
    CHECK ([tipo] IN ('residencial', 'comercial', 'correspondencia'))
ALTER TABLE [dbo].[enderecos] ADD CONSTRAINT [FK_enderecos_funcionario] 
    FOREIGN KEY([funcionario_id]) REFERENCES [dbo].[funcionarios] ([id]) ON DELETE CASCADE
GO

-- Tabela: Dependentes
CREATE TABLE [dbo].[dependentes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[funcionario_id] [int] NOT NULL,
	[nome] [nvarchar](255) NOT NULL,
	[parentesco] [nvarchar](30) NOT NULL,
	[data_nascimento] [date] NULL,
	[cpf] [nvarchar](20) NULL,
	[profissao] [nvarchar](255) NULL,
	[tem_condicao_medica] [bit] NOT NULL,
	[descricao_condicao_medica] [nvarchar](500) NULL,
	[dependente_ir] [bit] NOT NULL,
	[dependente_saude] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_dependentes] PRIMARY KEY CLUSTERED ([id] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[dependentes] ADD CONSTRAINT [DF_dependentes_tem_condicao] DEFAULT ((0)) FOR [tem_condicao_medica]
ALTER TABLE [dbo].[dependentes] ADD CONSTRAINT [DF_dependentes_dep_ir] DEFAULT ((0)) FOR [dependente_ir]
ALTER TABLE [dbo].[dependentes] ADD CONSTRAINT [DF_dependentes_dep_saude] DEFAULT ((0)) FOR [dependente_saude]
ALTER TABLE [dbo].[dependentes] ADD CONSTRAINT [DF_dependentes_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[dependentes] ADD CONSTRAINT [DF_dependentes_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
ALTER TABLE [dbo].[dependentes] ADD CONSTRAINT [CHK_dependentes_parentesco] 
    CHECK ([parentesco] IN ('Filho', 'Filha', 'Cônjuge', 'Pai', 'Mãe', 'Irmão', 'Irmã', 'Outro'))
ALTER TABLE [dbo].[dependentes] ADD CONSTRAINT [FK_dependentes_funcionario] 
    FOREIGN KEY([funcionario_id]) REFERENCES [dbo].[funcionarios] ([id]) ON DELETE CASCADE
GO

-- Tabela: Empregos (Vínculos Empregatícios)
CREATE TABLE [dbo].[empregos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[funcionario_id] [int] NOT NULL,
	[empresa] [nvarchar](255) NULL,
	[data_admissao] [date] NOT NULL,
	[data_inicio] [date] NOT NULL,
	[data_fim] [date] NULL,
	[tipo_contrato] [nvarchar](20) NOT NULL,
	[cargo] [nvarchar](255) NOT NULL,
	[departamento] [nvarchar](255) NULL,
	[categoria] [nvarchar](100) NULL,
	[nivel_qualificacao] [nvarchar](255) NULL,
	[vencimento_base] [decimal](18, 2) NULL,
	[carga_horaria] [nvarchar](100) NULL,
	[situacao] [nvarchar](30) NULL,
	[motivo_desligamento] [nvarchar](500) NULL,
	[forma_pagamento] [nvarchar](50) NULL,
	[banco] [nvarchar](100) NULL,
	[agencia] [nvarchar](20) NULL,
	[conta] [nvarchar](30) NULL,
	[iban] [nvarchar](50) NULL,
	[observacoes] [nvarchar](max) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_empregos] PRIMARY KEY CLUSTERED ([id] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[empregos] ADD CONSTRAINT [DF_empregos_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[empregos] ADD CONSTRAINT [DF_empregos_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
ALTER TABLE [dbo].[empregos] ADD CONSTRAINT [CHK_empregos_tipo_contrato] 
    CHECK ([tipo_contrato] IN ('Efetivo', 'Temporário', 'Estágio', 'Prestação de Serviços', 'Outro'))
ALTER TABLE [dbo].[empregos] ADD CONSTRAINT [CHK_empregos_situacao] 
    CHECK ([situacao] IN ('Ativo', 'Férias', 'Licença', 'Afastado', 'Desligado'))
ALTER TABLE [dbo].[empregos] ADD CONSTRAINT [FK_empregos_funcionario] 
    FOREIGN KEY([funcionario_id]) REFERENCES [dbo].[funcionarios] ([id]) ON DELETE CASCADE
GO

CREATE NONCLUSTERED INDEX [IX_empregos_funcionario] ON [dbo].[empregos]([funcionario_id])
CREATE NONCLUSTERED INDEX [IX_empregos_situacao] ON [dbo].[empregos]([situacao])
GO

-- Tabela de Valores Dinâmicos para Empregos
CREATE TABLE [dbo].[empregos_valores_personalizados](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[emprego_id] [int] NOT NULL,
	[codigo_campo] [nvarchar](100) NOT NULL,
	[valor_texto] [nvarchar](max) NULL,
	[valor_numero] [decimal](18, 4) NULL,
	[valor_data] [date] NULL,
	[valor_datetime] [datetime2](7) NULL,
	[valor_boolean] [bit] NULL,
	[valor_json] [nvarchar](max) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_empregos_valores_personalizados] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_empregos_valores] UNIQUE NONCLUSTERED ([emprego_id], [codigo_campo])
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[empregos_valores_personalizados] ADD CONSTRAINT [DF_empregos_valores_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[empregos_valores_personalizados] ADD CONSTRAINT [DF_empregos_valores_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
ALTER TABLE [dbo].[empregos_valores_personalizados] ADD CONSTRAINT [FK_empregos_valores_emprego] 
    FOREIGN KEY([emprego_id]) REFERENCES [dbo].[empregos] ([id]) ON DELETE CASCADE
GO

-- Tabela: Benefícios
CREATE TABLE [dbo].[beneficios](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[funcionario_id] [int] NOT NULL,
	[tipo] [nvarchar](50) NOT NULL,
	[descricao] [nvarchar](255) NULL,
	[valor] [decimal](18, 2) NULL,
	[data_inicio] [date] NULL,
	[data_fim] [date] NULL,
	[codigo_pagamento] [nvarchar](50) NULL,
	[numero_beneficiario] [nvarchar](50) NULL,
	[operadora] [nvarchar](255) NULL,
	[observacoes] [nvarchar](max) NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_beneficios] PRIMARY KEY CLUSTERED ([id] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[beneficios] ADD CONSTRAINT [DF_beneficios_ativo] DEFAULT ((1)) FOR [ativo]
ALTER TABLE [dbo].[beneficios] ADD CONSTRAINT [DF_beneficios_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[beneficios] ADD CONSTRAINT [DF_beneficios_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
ALTER TABLE [dbo].[beneficios] ADD CONSTRAINT [CHK_beneficios_tipo] 
    CHECK ([tipo] IN ('Vale Alimentação', 'Vale Refeição', 'Vale Transporte', 'Plano de Saúde', 'Plano Odontológico', 'Seguro de Vida', 'Outro'))
ALTER TABLE [dbo].[beneficios] ADD CONSTRAINT [FK_beneficios_funcionario] 
    FOREIGN KEY([funcionario_id]) REFERENCES [dbo].[funcionarios] ([id]) ON DELETE CASCADE
GO

-- Tabela de Valores Dinâmicos para Benefícios
CREATE TABLE [dbo].[beneficios_valores_personalizados](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[beneficio_id] [int] NOT NULL,
	[codigo_campo] [nvarchar](100) NOT NULL,
	[valor_texto] [nvarchar](max) NULL,
	[valor_numero] [decimal](18, 4) NULL,
	[valor_data] [date] NULL,
	[valor_datetime] [datetime2](7) NULL,
	[valor_boolean] [bit] NULL,
	[valor_json] [nvarchar](max) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_beneficios_valores_personalizados] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_beneficios_valores] UNIQUE NONCLUSTERED ([beneficio_id], [codigo_campo])
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[beneficios_valores_personalizados] ADD CONSTRAINT [DF_beneficios_valores_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[beneficios_valores_personalizados] ADD CONSTRAINT [DF_beneficios_valores_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
ALTER TABLE [dbo].[beneficios_valores_personalizados] ADD CONSTRAINT [FK_beneficios_valores_beneficio] 
    FOREIGN KEY([beneficio_id]) REFERENCES [dbo].[beneficios] ([id]) ON DELETE CASCADE
GO

/******************************************************************************/
/* MÓDULO: DOCUMENTOS E ANEXOS                                               */
/******************************************************************************/

-- Tabela: Anexos (Arquivos Gerais)
CREATE TABLE [dbo].[anexos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [nvarchar](255) NOT NULL,
	[nome_original] [nvarchar](255) NOT NULL,
	[caminho] [nvarchar](500) NOT NULL,
	[tipo] [nvarchar](10) NULL,
	[tamanho_bytes] [bigint] NULL,
	[mime_type] [nvarchar](100) NULL,
	[hash_md5] [nvarchar](50) NULL,
	[principal] [bit] NOT NULL,
	[metadados] [nvarchar](max) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_anexos] PRIMARY KEY CLUSTERED ([id] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[anexos] ADD CONSTRAINT [DF_anexos_principal] DEFAULT ((0)) FOR [principal]
ALTER TABLE [dbo].[anexos] ADD CONSTRAINT [DF_anexos_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[anexos] ADD CONSTRAINT [DF_anexos_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
ALTER TABLE [dbo].[anexos] ADD CONSTRAINT [CHK_anexos_tipo] 
    CHECK ([tipo] IN ('jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'csv', 'zip'))
GO

-- Tabela: Documentos
CREATE TABLE [dbo].[documentos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[funcionario_id] [int] NULL,
	[tipo] [nvarchar](30) NOT NULL,
	[numero] [nvarchar](50) NOT NULL,
	[orgao_emissor] [nvarchar](100) NULL,
	[vitalicio] [bit] NULL,
	[data_emissao] [date] NULL,
	[data_validade] [date] NULL,
	[detalhes] [nvarchar](500) NULL,
	[anexo_id] [int] NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_documentos] PRIMARY KEY CLUSTERED ([id] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[documentos] ADD CONSTRAINT [DF_documentos_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[documentos] ADD CONSTRAINT [DF_documentos_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
ALTER TABLE [dbo].[documentos] ADD CONSTRAINT [CHK_documentos_tipo] 
    CHECK ([tipo] IN ('BI', 'Passaporte', 'Carta de Condução', 'Cartão Utente', 'Certificado', 'Diploma', 'Outro'))
ALTER TABLE [dbo].[documentos] ADD CONSTRAINT [FK_documentos_funcionario] 
    FOREIGN KEY([funcionario_id]) REFERENCES [dbo].[funcionarios] ([id]) ON DELETE CASCADE
ALTER TABLE [dbo].[documentos] ADD CONSTRAINT [FK_documentos_anexo] 
    FOREIGN KEY([anexo_id]) REFERENCES [dbo].[anexos] ([id])
GO

-- Tabela de Valores Dinâmicos para Documentos
CREATE TABLE [dbo].[documentos_valores_personalizados](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[documento_id] [int] NOT NULL,
	[codigo_campo] [nvarchar](100) NOT NULL,
	[valor_texto] [nvarchar](max) NULL,
	[valor_numero] [decimal](18, 4) NULL,
	[valor_data] [date] NULL,
	[valor_datetime] [datetime2](7) NULL,
	[valor_boolean] [bit] NULL,
	[valor_json] [nvarchar](max) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_documentos_valores_personalizados] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_documentos_valores] UNIQUE NONCLUSTERED ([documento_id], [codigo_campo])
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[documentos_valores_personalizados] ADD CONSTRAINT [DF_documentos_valores_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[documentos_valores_personalizados] ADD CONSTRAINT [DF_documentos_valores_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
ALTER TABLE [dbo].[documentos_valores_personalizados] ADD CONSTRAINT [FK_documentos_valores_documento] 
    FOREIGN KEY([documento_id]) REFERENCES [dbo].[documentos] ([id]) ON DELETE CASCADE
GO

/******************************************************************************/
/* MÓDULO: VEÍCULOS                                                          */
/******************************************************************************/

-- Tabela: Veículos
CREATE TABLE [dbo].[veiculos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[numero_interno] [nvarchar](50) NOT NULL,
	[entidade] [nvarchar](100) NULL,
	[tipo] [nvarchar](30) NOT NULL,
	[marca] [nvarchar](30) NOT NULL,
	[modelo] [nvarchar](40) NULL,
	[matricula] [nvarchar](20) NULL,
	[chassis] [nvarchar](40) NULL,
	[cor] [nvarchar](30) NULL,
	[combustivel] [nvarchar](30) NOT NULL,
	[ano] [int] NULL,
	[capacidade] [int] NULL,
	[quilometragem] [int] NULL,
	[detalhes] [nvarchar](max) NULL,
	[data_aquisicao] [date] NULL,
	[valor_aquisicao] [decimal](18, 2) NULL,
	[data_baixa] [date] NULL,
	[em_circulacao] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_veiculos] PRIMARY KEY CLUSTERED ([id] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[veiculos] ADD CONSTRAINT [DF_veiculos_em_circulacao] DEFAULT ((1)) FOR [em_circulacao]
ALTER TABLE [dbo].[veiculos] ADD CONSTRAINT [DF_veiculos_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[veiculos] ADD CONSTRAINT [DF_veiculos_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
ALTER TABLE [dbo].[veiculos] ADD CONSTRAINT [CHK_veiculos_tipo] 
    CHECK ([tipo] IN ('Autocarro', 'Ligeiro', 'Moto', 'Outro'))
ALTER TABLE [dbo].[veiculos] ADD CONSTRAINT [CHK_veiculos_combustivel] 
    CHECK ([combustivel] IN ('Gasolina', 'Diesel', 'Elétrico', 'Híbrido', 'GNC', 'GPL', 'Outro'))
GO

CREATE NONCLUSTERED INDEX [IX_veiculos_matricula] ON [dbo].[veiculos]([matricula])
CREATE NONCLUSTERED INDEX [IX_veiculos_numero_interno] ON [dbo].[veiculos]([numero_interno])
GO

-- Tabela de Valores Dinâmicos para Veículos
CREATE TABLE [dbo].[veiculos_valores_personalizados](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[veiculo_id] [int] NOT NULL,
	[codigo_campo] [nvarchar](100) NOT NULL,
	[valor_texto] [nvarchar](max) NULL,
	[valor_numero] [decimal](18, 4) NULL,
	[valor_data] [date] NULL,
	[valor_datetime] [datetime2](7) NULL,
	[valor_boolean] [bit] NULL,
	[valor_json] [nvarchar](max) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_veiculos_valores_personalizados] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_veiculos_valores] UNIQUE NONCLUSTERED ([veiculo_id], [codigo_campo])
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[veiculos_valores_personalizados] ADD CONSTRAINT [DF_veiculos_valores_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[veiculos_valores_personalizados] ADD CONSTRAINT [DF_veiculos_valores_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
ALTER TABLE [dbo].[veiculos_valores_personalizados] ADD CONSTRAINT [FK_veiculos_valores_veiculo] 
    FOREIGN KEY([veiculo_id]) REFERENCES [dbo].[veiculos] ([id]) ON DELETE CASCADE
GO

-- Foreign Key: Utilizador -> Funcionário
ALTER TABLE [dbo].[utilizadores] ADD CONSTRAINT [FK_utilizadores_funcionario] 
    FOREIGN KEY([funcionario_id]) REFERENCES [dbo].[funcionarios] ([id])
GO

PRINT 'Template de Base de Dados Tenant criado com sucesso!'
PRINT 'Estrutura com campos dinâmicos configurada!'
GO