/****************************************************************************/
/* MÓDULO: SUPORTE E GESTÃO DE EQUIPAMENTOS                                */
/* Controlo de ativos, tickets e intervenções                              */
/* Data: 12/10/2025                                                        */
/****************************************************************************/

USE [{TenantDB}]
GO

/******************************************************************************/
/* CATÁLOGO DE EQUIPAMENTOS                                                 */
/******************************************************************************/

-- Tabela: Marcas
CREATE TABLE [dbo].[marcas](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [nvarchar](100) NOT NULL,
	[logo_url] [nvarchar](500) NULL,
	[website] [nvarchar](255) NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_marcas] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_marcas_nome] UNIQUE NONCLUSTERED ([nome] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[marcas] ADD CONSTRAINT [DF_marcas_ativo] DEFAULT ((1)) FOR [ativo]
ALTER TABLE [dbo].[marcas] ADD CONSTRAINT [DF_marcas_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[marcas] ADD CONSTRAINT [DF_marcas_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
GO

-- Tabela: Categorias de Equipamento
CREATE TABLE [dbo].[categorias_equipamento](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [nvarchar](100) NOT NULL,
	[descricao] [nvarchar](500) NULL,
	[icone] [nvarchar](50) NULL,
	[cor] [nvarchar](20) NULL,
	[categoria_pai_id] [int] NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_categorias_equipamento] PRIMARY KEY CLUSTERED ([id] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[categorias_equipamento] ADD CONSTRAINT [DF_categorias_equipamento_ativo] DEFAULT ((1)) FOR [ativo]
ALTER TABLE [dbo].[categorias_equipamento] ADD CONSTRAINT [DF_categorias_equipamento_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[categorias_equipamento] ADD CONSTRAINT [DF_categorias_equipamento_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
ALTER TABLE [dbo].[categorias_equipamento] ADD CONSTRAINT [FK_categorias_equipamento_pai] 
    FOREIGN KEY([categoria_pai_id]) REFERENCES [dbo].[categorias_equipamento] ([id])
GO

-- Tabela: Modelos de Equipamento
CREATE TABLE [dbo].[modelos_equipamento](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[marca_id] [int] NOT NULL,
	[categoria_id] [int] NOT NULL,
	[nome] [nvarchar](100) NOT NULL,
	[codigo] [nvarchar](50) NULL,
	[descricao] [nvarchar](1000) NULL,
	[especificacoes] [nvarchar](max) NULL, -- JSON com specs técnicas
	[imagem_url] [nvarchar](500) NULL,
	[manual_url] [nvarchar](500) NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_modelos_equipamento] PRIMARY KEY CLUSTERED ([id] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[modelos_equipamento] ADD CONSTRAINT [DF_modelos_equipamento_ativo] DEFAULT ((1)) FOR [ativo]
ALTER TABLE [dbo].[modelos_equipamento] ADD CONSTRAINT [DF_modelos_equipamento_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[modelos_equipamento] ADD CONSTRAINT [DF_modelos_equipamento_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
ALTER TABLE [dbo].[modelos_equipamento] ADD CONSTRAINT [FK_modelos_equipamento_marca] 
    FOREIGN KEY([marca_id]) REFERENCES [dbo].[marcas] ([id])
ALTER TABLE [dbo].[modelos_equipamento] ADD CONSTRAINT [FK_modelos_equipamento_categoria] 
    FOREIGN KEY([categoria_id]) REFERENCES [dbo].[categorias_equipamento] ([id])
GO

CREATE NONCLUSTERED INDEX [IX_modelos_equipamento_marca] ON [dbo].[modelos_equipamento]([marca_id])
CREATE NONCLUSTERED INDEX [IX_modelos_equipamento_categoria] ON [dbo].[modelos_equipamento]([categoria_id])
GO

/******************************************************************************/
/* EQUIPAMENTOS (ATIVOS)                                                    */
/******************************************************************************/

-- Tabela: Equipamentos
CREATE TABLE [dbo].[equipamentos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[empresa_id] [int] NULL,
	[modelo_id] [int] NOT NULL,
	[numero_serie] [nvarchar](100) NULL,
	[numero_interno] [nvarchar](50) NOT NULL,
	[descricao] [nvarchar](500) NULL,
	[localizacao] [nvarchar](255) NULL,
	[responsavel_id] [int] NULL, -- Funcionário responsável
	[utilizador_id] [int] NULL, -- Utilizador atribuído
	[estado] [nvarchar](30) NOT NULL,
	[data_aquisicao] [date] NULL,
	[valor_aquisicao] [decimal](18, 2) NULL,
	[fornecedor] [nvarchar](255) NULL,
	[data_garantia] [date] NULL,
	[data_proxima_manutencao] [date] NULL,
	[observacoes] [nvarchar](max) NULL,
	[foto_url] [nvarchar](500) NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_equipamentos] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_equipamentos_numero_interno] UNIQUE NONCLUSTERED ([numero_interno] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[equipamentos] ADD CONSTRAINT [DF_equipamentos_estado] DEFAULT ('operacional') FOR [estado]
ALTER TABLE [dbo].[equipamentos] ADD CONSTRAINT [DF_equipamentos_ativo] DEFAULT ((1)) FOR [ativo]
ALTER TABLE [dbo].[equipamentos] ADD CONSTRAINT [DF_equipamentos_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[equipamentos] ADD CONSTRAINT [DF_equipamentos_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]

ALTER TABLE [dbo].[equipamentos] ADD CONSTRAINT [CHK_equipamentos_estado] 
    CHECK ([estado] IN ('operacional', 'manutencao', 'avariado', 'baixa', 'reserva', 'em_transito'))

ALTER TABLE [dbo].[equipamentos] ADD CONSTRAINT [FK_equipamentos_empresa] 
    FOREIGN KEY([empresa_id]) REFERENCES [dbo].[empresas] ([id])
ALTER TABLE [dbo].[equipamentos] ADD CONSTRAINT [FK_equipamentos_modelo] 
    FOREIGN KEY([modelo_id]) REFERENCES [dbo].[modelos_equipamento] ([id])
ALTER TABLE [dbo].[equipamentos] ADD CONSTRAINT [FK_equipamentos_responsavel] 
    FOREIGN KEY([responsavel_id]) REFERENCES [dbo].[funcionarios] ([id])
ALTER TABLE [dbo].[equipamentos] ADD CONSTRAINT [FK_equipamentos_utilizador] 
    FOREIGN KEY([utilizador_id]) REFERENCES [dbo].[utilizadores] ([id])
GO

CREATE NONCLUSTERED INDEX [IX_equipamentos_empresa] ON [dbo].[equipamentos]([empresa_id])
CREATE NONCLUSTERED INDEX [IX_equipamentos_modelo] ON [dbo].[equipamentos]([modelo_id])
CREATE NONCLUSTERED INDEX [IX_equipamentos_estado] ON [dbo].[equipamentos]([estado])
CREATE NONCLUSTERED INDEX [IX_equipamentos_numero_serie] ON [dbo].[equipamentos]([numero_serie])
GO

-- Tabela: Campos Personalizados de Equipamentos
CREATE TABLE [dbo].[equipamentos_valores_personalizados](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[equipamento_id] [int] NOT NULL,
	[codigo_campo] [nvarchar](100) NOT NULL,
	[valor_texto] [nvarchar](max) NULL,
	[valor_numero] [decimal](18, 4) NULL,
	[valor_data] [date] NULL,
	[valor_datetime] [datetime2](7) NULL,
	[valor_boolean] [bit] NULL,
	[valor_json] [nvarchar](max) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_equipamentos_valores_personalizados] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_equipamentos_valores] UNIQUE NONCLUSTERED ([equipamento_id], [codigo_campo])
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[equipamentos_valores_personalizados] ADD CONSTRAINT [DF_equipamentos_valores_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[equipamentos_valores_personalizados] ADD CONSTRAINT [DF_equipamentos_valores_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
ALTER TABLE [dbo].[equipamentos_valores_personalizados] ADD CONSTRAINT [FK_equipamentos_valores_equipamento] 
    FOREIGN KEY([equipamento_id]) REFERENCES [dbo].[equipamentos] ([id]) ON DELETE CASCADE
GO

/******************************************************************************/
/* SISTEMA DE TICKETS                                                        */
/******************************************************************************/

-- Tabela: Tipos de Ticket
CREATE TABLE [dbo].[tipos_ticket](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [nvarchar](100) NOT NULL,
	[descricao] [nvarchar](500) NULL,
	[cor] [nvarchar](20) NULL,
	[icone] [nvarchar](50) NULL,
	[sla_horas] [int] NULL, -- SLA em horas
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_tipos_ticket] PRIMARY KEY CLUSTERED ([id] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[tipos_ticket] ADD CONSTRAINT [DF_tipos_ticket_ativo] DEFAULT ((1)) FOR [ativo]
ALTER TABLE [dbo].[tipos_ticket] ADD CONSTRAINT [DF_tipos_ticket_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[tipos_ticket] ADD CONSTRAINT [DF_tipos_ticket_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
GO

-- Tabela: Tickets
CREATE TABLE [dbo].[tickets](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[empresa_id] [int] NULL,
	[numero_ticket] [nvarchar](50) NOT NULL,
	[tipo_ticket_id] [int] NOT NULL,
	[equipamento_id] [int] NULL,
	[titulo] [nvarchar](255) NOT NULL,
	[descricao] [nvarchar](max) NOT NULL,
	[prioridade] [nvarchar](20) NOT NULL,
	[status] [nvarchar](30) NOT NULL,
	[solicitante_id] [int] NOT NULL, -- Quem abriu o ticket
	[atribuido_id] [int] NULL, -- Técnico responsável
	[localizacao] [nvarchar](255) NULL,
	[data_abertura] [datetime2](7) NOT NULL,
	[data_prevista] [datetime2](7) NULL,
	[data_conclusao] [datetime2](7) NULL,
	[tempo_resolucao_minutos] [int] NULL,
	[avaliacao] [int] NULL, -- 1 a 5 estrelas
	[comentario_avaliacao] [nvarchar](1000) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_tickets] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_tickets_numero] UNIQUE NONCLUSTERED ([numero_ticket] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[tickets] ADD CONSTRAINT [DF_tickets_prioridade] DEFAULT ('media') FOR [prioridade]
ALTER TABLE [dbo].[tickets] ADD CONSTRAINT [DF_tickets_status] DEFAULT ('aberto') FOR [status]
ALTER TABLE [dbo].[tickets] ADD CONSTRAINT [DF_tickets_data_abertura] DEFAULT (getdate()) FOR [data_abertura]
ALTER TABLE [dbo].[tickets] ADD CONSTRAINT [DF_tickets_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[tickets] ADD CONSTRAINT [DF_tickets_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]

ALTER TABLE [dbo].[tickets] ADD CONSTRAINT [CHK_tickets_prioridade] 
    CHECK ([prioridade] IN ('baixa', 'media', 'alta', 'urgente'))
ALTER TABLE [dbo].[tickets] ADD CONSTRAINT [CHK_tickets_status] 
    CHECK ([status] IN ('aberto', 'em_andamento', 'aguardando_peca', 'aguardando_cliente', 'resolvido', 'fechado', 'cancelado'))
ALTER TABLE [dbo].[tickets] ADD CONSTRAINT [CHK_tickets_avaliacao] 
    CHECK ([avaliacao] IS NULL OR ([avaliacao] >= 1 AND [avaliacao] <= 5))

ALTER TABLE [dbo].[tickets] ADD CONSTRAINT [FK_tickets_empresa] 
    FOREIGN KEY([empresa_id]) REFERENCES [dbo].[empresas] ([id])
ALTER TABLE [dbo].[tickets] ADD CONSTRAINT [FK_tickets_tipo] 
    FOREIGN KEY([tipo_ticket_id]) REFERENCES [dbo].[tipos_ticket] ([id])
ALTER TABLE [dbo].[tickets] ADD CONSTRAINT [FK_tickets_equipamento] 
    FOREIGN KEY([equipamento_id]) REFERENCES [dbo].[equipamentos] ([id])
ALTER TABLE [dbo].[tickets] ADD CONSTRAINT [FK_tickets_solicitante] 
    FOREIGN KEY([solicitante_id]) REFERENCES [dbo].[utilizadores] ([id])
ALTER TABLE [dbo].[tickets] ADD CONSTRAINT [FK_tickets_atribuido] 
    FOREIGN KEY([atribuido_id]) REFERENCES [dbo].[utilizadores] ([id])
GO

CREATE NONCLUSTERED INDEX [IX_tickets_empresa] ON [dbo].[tickets]([empresa_id])
CREATE NONCLUSTERED INDEX [IX_tickets_status] ON [dbo].[tickets]([status])
CREATE NONCLUSTERED INDEX [IX_tickets_prioridade] ON [dbo].[tickets]([prioridade])
CREATE NONCLUSTERED INDEX [IX_tickets_solicitante] ON [dbo].[tickets]([solicitante_id])
CREATE NONCLUSTERED INDEX [IX_tickets_atribuido] ON [dbo].[tickets]([atribuido_id])
CREATE NONCLUSTERED INDEX [IX_tickets_data_abertura] ON [dbo].[tickets]([data_abertura] DESC)
GO

-- Tabela: Histórico/Comentários do Ticket
CREATE TABLE [dbo].[tickets_historico](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[ticket_id] [int] NOT NULL,
	[utilizador_id] [int] NOT NULL,
	[tipo_acao] [nvarchar](50) NOT NULL,
	[descricao] [nvarchar](1000) NULL,
	[valor_anterior] [nvarchar](500) NULL,
	[valor_novo] [nvarchar](500) NULL,
	[visivel_cliente] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_tickets_historico] PRIMARY KEY CLUSTERED ([id] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[tickets_historico] ADD CONSTRAINT [DF_tickets_historico_visivel_cliente] DEFAULT ((1)) FOR [visivel_cliente]
ALTER TABLE [dbo].[tickets_historico] ADD CONSTRAINT [DF_tickets_historico_criado_em] DEFAULT (getdate()) FOR [criado_em]

ALTER TABLE [dbo].[tickets_historico] ADD CONSTRAINT [CHK_tickets_historico_tipo] 
    CHECK ([tipo_acao] IN ('comentario', 'status_alterado', 'prioridade_alterada', 'atribuicao', 'anexo_adicionado', 'avaliacao'))

ALTER TABLE [dbo].[tickets_historico] ADD CONSTRAINT [FK_tickets_historico_ticket] 
    FOREIGN KEY([ticket_id]) REFERENCES [dbo].[tickets] ([id]) ON DELETE CASCADE
ALTER TABLE [dbo].[tickets_historico] ADD CONSTRAINT [FK_tickets_historico_utilizador] 
    FOREIGN KEY([utilizador_id]) REFERENCES [dbo].[utilizadores] ([id])
GO

CREATE NONCLUSTERED INDEX [IX_tickets_historico_ticket] ON [dbo].[tickets_historico]([ticket_id])
GO

/******************************************************************************/
/* INTERVENÇÕES E MANUTENÇÕES                                               */
/******************************************************************************/

-- Tabela: Intervenções
CREATE TABLE [dbo].[intervencoes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[ticket_id] [int] NULL,
	[equipamento_id] [int] NOT NULL,
	[tipo] [nvarchar](50) NOT NULL,
	[numero_intervencao] [nvarchar](50) NOT NULL,
	[titulo] [nvarchar](255) NOT NULL,
	[descricao] [nvarchar](max) NULL,
	[diagnostico] [nvarchar](max) NULL,
	[solucao] [nvarchar](max) NULL,
	[tecnico_id] [int] NOT NULL,
	[data_inicio] [datetime2](7) NOT NULL,
	[data_fim] [datetime2](7) NULL,
	[duracao_minutos] [int] NULL,
	[custo_mao_obra] [decimal](18, 2) NULL,
	[custo_pecas] [decimal](18, 2) NULL,
	[custo_total] [decimal](18, 2) NULL,
	[fornecedor_externo] [nvarchar](255) NULL,
	[numero_fatura] [nvarchar](100) NULL,
	[garantia] [bit] NOT NULL,
	[observacoes] [nvarchar](max) NULL,
	[status] [nvarchar](30) NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_intervencoes] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_intervencoes_numero] UNIQUE NONCLUSTERED ([numero_intervencao] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[intervencoes] ADD CONSTRAINT [DF_intervencoes_garantia] DEFAULT ((0)) FOR [garantia]
ALTER TABLE [dbo].[intervencoes] ADD CONSTRAINT [DF_intervencoes_status] DEFAULT ('agendada') FOR [status]
ALTER TABLE [dbo].[intervencoes] ADD CONSTRAINT [DF_intervencoes_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[intervencoes] ADD CONSTRAINT [DF_intervencoes_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]

ALTER TABLE [dbo].[intervencoes] ADD CONSTRAINT [CHK_intervencoes_tipo] 
    CHECK ([tipo] IN ('corretiva', 'preventiva', 'preditiva', 'instalacao', 'configuracao', 'upgrade'))
ALTER TABLE [dbo].[intervencoes] ADD CONSTRAINT [CHK_intervencoes_status] 
    CHECK ([status] IN ('agendada', 'em_andamento', 'concluida', 'cancelada'))

ALTER TABLE [dbo].[intervencoes] ADD CONSTRAINT [FK_intervencoes_ticket] 
    FOREIGN KEY([ticket_id]) REFERENCES [dbo].[tickets] ([id])
ALTER TABLE [dbo].[intervencoes] ADD CONSTRAINT [FK_intervencoes_equipamento] 
    FOREIGN KEY([equipamento_id]) REFERENCES [dbo].[equipamentos] ([id])
ALTER TABLE [dbo].[intervencoes] ADD CONSTRAINT [FK_intervencoes_tecnico] 
    FOREIGN KEY([tecnico_id]) REFERENCES [dbo].[utilizadores] ([id])
GO

CREATE NONCLUSTERED INDEX [IX_intervencoes_ticket] ON [dbo].[intervencoes]([ticket_id])
CREATE NONCLUSTERED INDEX [IX_intervencoes_equipamento] ON [dbo].[intervencoes]([equipamento_id])
CREATE NONCLUSTERED INDEX [IX_intervencoes_tipo] ON [dbo].[intervencoes]([tipo])
CREATE NONCLUSTERED INDEX [IX_intervencoes_status] ON [dbo].[intervencoes]([status])
CREATE NONCLUSTERED INDEX [IX_intervencoes_data_inicio] ON [dbo].[intervencoes]([data_inicio] DESC)
GO

-- Tabela: Peças Utilizadas na Intervenção
CREATE TABLE [dbo].[intervencoes_pecas](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[intervencao_id] [int] NOT NULL,
	[descricao] [nvarchar](255) NOT NULL,
	[codigo_peca] [nvarchar](100) NULL,
	[quantidade] [int] NOT NULL,
	[valor_unitario] [decimal](18, 2) NULL,
	[valor_total] [decimal](18, 2) NULL,
	[fornecedor] [nvarchar](255) NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_intervencoes_pecas] PRIMARY KEY CLUSTERED ([id] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[intervencoes_pecas] ADD CONSTRAINT [DF_intervencoes_pecas_quantidade] DEFAULT ((1)) FOR [quantidade]
ALTER TABLE [dbo].[intervencoes_pecas] ADD CONSTRAINT [DF_intervencoes_pecas_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[intervencoes_pecas] ADD CONSTRAINT [FK_intervencoes_pecas_intervencao] 
    FOREIGN KEY([intervencao_id]) REFERENCES [dbo].[intervencoes] ([id]) ON DELETE CASCADE
GO

-- Tabela: Anexos de Intervenções
CREATE TABLE [dbo].[intervencoes_anexos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[intervencao_id] [int] NOT NULL,
	[anexo_id] [int] NOT NULL,
	[tipo_documento] [nvarchar](50) NOT NULL,
	[descricao] [nvarchar](255) NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_intervencoes_anexos] PRIMARY KEY CLUSTERED ([id] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[intervencoes_anexos] ADD CONSTRAINT [DF_intervencoes_anexos_criado_em] DEFAULT (getdate()) FOR [criado_em]

ALTER TABLE [dbo].[intervencoes_anexos] ADD CONSTRAINT [CHK_intervencoes_anexos_tipo] 
    CHECK ([tipo_documento] IN ('fatura', 'orcamento', 'certificado', 'relatorio', 'foto_antes', 'foto_depois', 'manual', 'outro'))

ALTER TABLE [dbo].[intervencoes_anexos] ADD CONSTRAINT [FK_intervencoes_anexos_intervencao] 
    FOREIGN KEY([intervencao_id]) REFERENCES [dbo].[intervencoes] ([id]) ON DELETE CASCADE
ALTER TABLE [dbo].[intervencoes_anexos] ADD CONSTRAINT [FK_intervencoes_anexos_anexo] 
    FOREIGN KEY([anexo_id]) REFERENCES [dbo].[anexos] ([id])
GO

CREATE NONCLUSTERED INDEX [IX_intervencoes_anexos_intervencao] ON [dbo].[intervencoes_anexos]([intervencao_id])
CREATE NONCLUSTERED INDEX [IX_intervencoes_anexos_tipo] ON [dbo].[intervencoes_anexos]([tipo_documento])
GO

PRINT 'Módulo de Suporte e Gestão de Equipamentos criado com sucesso!'
GO