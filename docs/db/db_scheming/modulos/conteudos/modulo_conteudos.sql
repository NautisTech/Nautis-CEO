/****************************************************************************/
/* MÓDULO: GESTÃO DE CONTEÚDOS                                             */
/* Sistema flexível para Notícias, Eventos, Banners e Conteúdos Custom     */
/* Data: 12/10/2025                                                        */
/****************************************************************************/

USE [{TenantDB}]
GO

/******************************************************************************/
/* TABELAS PRINCIPAIS                                                        */
/******************************************************************************/

-- Tabela: Categorias de Conteúdo
CREATE TABLE [dbo].[categorias_conteudo](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [nvarchar](100) NOT NULL,
	[slug] [nvarchar](100) NOT NULL,
	[descricao] [nvarchar](500) NULL,
	[cor] [nvarchar](20) NULL,
	[icone] [nvarchar](50) NULL,
	[ordem] [int] NOT NULL,
	[ativo] [bit] NOT NULL,
	[categoria_pai_id] [int] NULL, -- Para criar subcategorias
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_categorias_conteudo] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_categorias_conteudo_slug] UNIQUE NONCLUSTERED ([slug] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[categorias_conteudo] ADD CONSTRAINT [DF_categorias_conteudo_ordem] DEFAULT ((0)) FOR [ordem]
ALTER TABLE [dbo].[categorias_conteudo] ADD CONSTRAINT [DF_categorias_conteudo_ativo] DEFAULT ((1)) FOR [ativo]
ALTER TABLE [dbo].[categorias_conteudo] ADD CONSTRAINT [DF_categorias_conteudo_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[categorias_conteudo] ADD CONSTRAINT [DF_categorias_conteudo_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
ALTER TABLE [dbo].[categorias_conteudo] ADD CONSTRAINT [FK_categorias_conteudo_pai] 
    FOREIGN KEY([categoria_pai_id]) REFERENCES [dbo].[categorias_conteudo] ([id])
GO

CREATE NONCLUSTERED INDEX [IX_categorias_conteudo_slug] ON [dbo].[categorias_conteudo]([slug])
CREATE NONCLUSTERED INDEX [IX_categorias_conteudo_pai] ON [dbo].[categorias_conteudo]([categoria_pai_id])
GO

-- Tabela: Tipos de Conteúdo (Templates personalizáveis)
CREATE TABLE [dbo].[tipos_conteudo](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[codigo] [nvarchar](50) NOT NULL,
	[nome] [nvarchar](100) NOT NULL,
	[descricao] [nvarchar](500) NULL,
	[icone] [nvarchar](50) NULL,
	[permite_comentarios] [bit] NOT NULL,
	[permite_anexos] [bit] NOT NULL,
	[max_anexos] [int] NULL,
	[permite_galeria] [bit] NOT NULL,
	[requer_aprovacao] [bit] NOT NULL,
	[template_visualizacao] [nvarchar](100) NULL, -- Ex: 'noticia', 'evento', 'banner'
	[configuracao_campos] [nvarchar](max) NULL, -- JSON com campos específicos
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_tipos_conteudo] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_tipos_conteudo_codigo] UNIQUE NONCLUSTERED ([codigo] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[tipos_conteudo] ADD CONSTRAINT [DF_tipos_conteudo_permite_comentarios] DEFAULT ((1)) FOR [permite_comentarios]
ALTER TABLE [dbo].[tipos_conteudo] ADD CONSTRAINT [DF_tipos_conteudo_permite_anexos] DEFAULT ((1)) FOR [permite_anexos]
ALTER TABLE [dbo].[tipos_conteudo] ADD CONSTRAINT [DF_tipos_conteudo_permite_galeria] DEFAULT ((0)) FOR [permite_galeria]
ALTER TABLE [dbo].[tipos_conteudo] ADD CONSTRAINT [DF_tipos_conteudo_requer_aprovacao] DEFAULT ((0)) FOR [requer_aprovacao]
ALTER TABLE [dbo].[tipos_conteudo] ADD CONSTRAINT [DF_tipos_conteudo_ativo] DEFAULT ((1)) FOR [ativo]
ALTER TABLE [dbo].[tipos_conteudo] ADD CONSTRAINT [DF_tipos_conteudo_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[tipos_conteudo] ADD CONSTRAINT [DF_tipos_conteudo_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
GO

-- Tabela: Tags
CREATE TABLE [dbo].[tags](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [nvarchar](50) NOT NULL,
	[slug] [nvarchar](50) NOT NULL,
	[cor] [nvarchar](20) NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_tags] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_tags_slug] UNIQUE NONCLUSTERED ([slug] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[tags] ADD CONSTRAINT [DF_tags_criado_em] DEFAULT (getdate()) FOR [criado_em]
GO

-- Tabela Principal: Conteúdos
CREATE TABLE [dbo].[conteudos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[tipo_conteudo_id] [int] NOT NULL,
	[categoria_id] [int] NULL,
	[titulo] [nvarchar](255) NOT NULL,
	[slug] [nvarchar](255) NOT NULL,
	[subtitulo] [nvarchar](500) NULL,
	[resumo] [nvarchar](1000) NULL,
	[conteudo] [nvarchar](max) NULL, -- HTML/Rich Text
	[imagem_destaque] [nvarchar](500) NULL, -- URL da imagem principal
	[autor_id] [int] NULL, -- Utilizador que criou
	[status] [nvarchar](20) NOT NULL, -- rascunho, publicado, arquivado, agendado
	[destaque] [bit] NOT NULL, -- Aparece em destaque?
	[permite_comentarios] [bit] NOT NULL,
	[visualizacoes] [int] NOT NULL,
	[ordem] [int] NULL, -- Para ordenação manual
	[publicado_em] [datetime2](7) NULL,
	[data_inicio] [datetime2](7) NULL, -- Para eventos ou conteúdo temporário
	[data_fim] [datetime2](7) NULL,
	[meta_title] [nvarchar](255) NULL, -- SEO
	[meta_description] [nvarchar](500) NULL, -- SEO
	[meta_keywords] [nvarchar](500) NULL, -- SEO
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[aprovado_por_id] [int] NULL,
	[aprovado_em] [datetime2](7) NULL,
	[visibilidade] [nvarchar](20) NOT NULL, -- public, privado, protegido por senha
	[variants] [nvarchar](max) NULL, -- JSON para variações de conteúdo
 CONSTRAINT [PK_conteudos] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_conteudos_slug] UNIQUE NONCLUSTERED ([slug] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[conteudos] ADD CONSTRAINT [DF_conteudos_status] DEFAULT ('rascunho') FOR [status]
ALTER TABLE [dbo].[conteudos] ADD CONSTRAINT [DF_conteudos_destaque] DEFAULT ((0)) FOR [destaque]
ALTER TABLE [dbo].[conteudos] ADD CONSTRAINT [DF_conteudos_permite_comentarios] DEFAULT ((1)) FOR [permite_comentarios]
ALTER TABLE [dbo].[conteudos] ADD CONSTRAINT [DF_conteudos_visualizacoes] DEFAULT ((0)) FOR [visualizacoes]
ALTER TABLE [dbo].[conteudos] ADD CONSTRAINT [DF_conteudos_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[conteudos] ADD CONSTRAINT [DF_conteudos_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]

ALTER TABLE [dbo].[conteudos] ADD CONSTRAINT [CHK_conteudos_status] 
    CHECK ([status] IN ('rascunho', 'publicado', 'arquivado', 'agendado', 'em_revisao'))

ALTER TABLE [dbo].[conteudos] ADD CONSTRAINT [FK_conteudos_tipo] 
    FOREIGN KEY([tipo_conteudo_id]) REFERENCES [dbo].[tipos_conteudo] ([id])
ALTER TABLE [dbo].[conteudos] ADD CONSTRAINT [FK_conteudos_categoria] 
    FOREIGN KEY([categoria_id]) REFERENCES [dbo].[categorias_conteudo] ([id])
ALTER TABLE [dbo].[conteudos] ADD CONSTRAINT [FK_conteudos_autor] 
    FOREIGN KEY([autor_id]) REFERENCES [dbo].[utilizadores] ([id])
ALTER TABLE [dbo].[conteudos] ADD CONSTRAINT [FK_conteudos_aprovador] 
    FOREIGN KEY([aprovado_por_id]) REFERENCES [dbo].[utilizadores] ([id])
GO

CREATE NONCLUSTERED INDEX [IX_conteudos_tipo] ON [dbo].[conteudos]([tipo_conteudo_id])
CREATE NONCLUSTERED INDEX [IX_conteudos_categoria] ON [dbo].[conteudos]([categoria_id])
CREATE NONCLUSTERED INDEX [IX_conteudos_autor] ON [dbo].[conteudos]([autor_id])
CREATE NONCLUSTERED INDEX [IX_conteudos_status] ON [dbo].[conteudos]([status])
CREATE NONCLUSTERED INDEX [IX_conteudos_publicado] ON [dbo].[conteudos]([publicado_em] DESC)
CREATE NONCLUSTERED INDEX [IX_conteudos_slug] ON [dbo].[conteudos]([slug])
GO

-- Tabela: Campos Personalizados de Conteúdo (EAV)
CREATE TABLE [dbo].[conteudos_valores_personalizados](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[conteudo_id] [int] NOT NULL,
	[codigo_campo] [nvarchar](100) NOT NULL,
	[valor_texto] [nvarchar](max) NULL,
	[valor_numero] [decimal](18, 4) NULL,
	[valor_data] [date] NULL,
	[valor_datetime] [datetime2](7) NULL,
	[valor_boolean] [bit] NULL,
	[valor_json] [nvarchar](max) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_conteudos_valores_personalizados] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_conteudos_valores] UNIQUE NONCLUSTERED ([conteudo_id], [codigo_campo])
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[conteudos_valores_personalizados] ADD CONSTRAINT [DF_conteudos_valores_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[conteudos_valores_personalizados] ADD CONSTRAINT [DF_conteudos_valores_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
ALTER TABLE [dbo].[conteudos_valores_personalizados] ADD CONSTRAINT [FK_conteudos_valores_conteudo] 
    FOREIGN KEY([conteudo_id]) REFERENCES [dbo].[conteudos] ([id]) ON DELETE CASCADE
GO

CREATE NONCLUSTERED INDEX [IX_conteudos_valores_conteudo] ON [dbo].[conteudos_valores_personalizados]([conteudo_id])
GO

-- Tabela: Conteúdo_Tag (Many-to-Many)
CREATE TABLE [dbo].[conteudo_tag](
	[conteudo_id] [int] NOT NULL,
	[tag_id] [int] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_conteudo_tag] PRIMARY KEY CLUSTERED ([conteudo_id] ASC, [tag_id] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[conteudo_tag] ADD CONSTRAINT [DF_conteudo_tag_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[conteudo_tag] ADD CONSTRAINT [FK_conteudo_tag_conteudo] 
    FOREIGN KEY([conteudo_id]) REFERENCES [dbo].[conteudos] ([id]) ON DELETE CASCADE
ALTER TABLE [dbo].[conteudo_tag] ADD CONSTRAINT [FK_conteudo_tag_tag] 
    FOREIGN KEY([tag_id]) REFERENCES [dbo].[tags] ([id]) ON DELETE CASCADE
GO

-- Tabela: Anexos de Conteúdo (Many-to-Many)
CREATE TABLE [dbo].[conteudo_anexo](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[conteudo_id] [int] NOT NULL,
	[anexo_id] [int] NOT NULL,
	[tipo_anexo] [nvarchar](20) NOT NULL, -- imagem, video, documento, audio
	[legenda] [nvarchar](500) NULL,
	[ordem] [int] NOT NULL,
	[principal] [bit] NOT NULL, -- Anexo principal do conteúdo
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_conteudo_anexo] PRIMARY KEY CLUSTERED ([id] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[conteudo_anexo] ADD CONSTRAINT [DF_conteudo_anexo_ordem] DEFAULT ((0)) FOR [ordem]
ALTER TABLE [dbo].[conteudo_anexo] ADD CONSTRAINT [DF_conteudo_anexo_principal] DEFAULT ((0)) FOR [principal]
ALTER TABLE [dbo].[conteudo_anexo] ADD CONSTRAINT [DF_conteudo_anexo_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[conteudo_anexo] ADD CONSTRAINT [CHK_conteudo_anexo_tipo] 
    CHECK ([tipo_anexo] IN ('imagem', 'video', 'documento', 'audio', 'outro'))
ALTER TABLE [dbo].[conteudo_anexo] ADD CONSTRAINT [FK_conteudo_anexo_conteudo] 
    FOREIGN KEY([conteudo_id]) REFERENCES [dbo].[conteudos] ([id]) ON DELETE CASCADE
ALTER TABLE [dbo].[conteudo_anexo] ADD CONSTRAINT [FK_conteudo_anexo_anexo] 
    FOREIGN KEY([anexo_id]) REFERENCES [dbo].[anexos] ([id]) ON DELETE CASCADE
GO

CREATE NONCLUSTERED INDEX [IX_conteudo_anexo_conteudo] ON [dbo].[conteudo_anexo]([conteudo_id])
CREATE NONCLUSTERED INDEX [IX_conteudo_anexo_tipo] ON [dbo].[conteudo_anexo]([tipo_anexo])
GO

-- Tabela: Comentários
CREATE TABLE [dbo].[comentarios](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[conteudo_id] [int] NOT NULL,
	[utilizador_id] [int] NULL,
	[comentario_pai_id] [int] NULL, -- Para respostas/threads
	[autor_nome] [nvarchar](100) NULL, -- Se permitir comentários anônimos
	[autor_email] [nvarchar](255) NULL,
	[conteudo] [nvarchar](2000) NOT NULL,
	[aprovado] [bit] NOT NULL,
	[aprovado_por_id] [int] NULL,
	[aprovado_em] [datetime2](7) NULL,
	[denuncias] [int] NOT NULL,
	[likes] [int] NOT NULL,
	[ip_address] [nvarchar](50) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_comentarios] PRIMARY KEY CLUSTERED ([id] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[comentarios] ADD CONSTRAINT [DF_comentarios_aprovado] DEFAULT ((0)) FOR [aprovado]
ALTER TABLE [dbo].[comentarios] ADD CONSTRAINT [DF_comentarios_denuncias] DEFAULT ((0)) FOR [denuncias]
ALTER TABLE [dbo].[comentarios] ADD CONSTRAINT [DF_comentarios_likes] DEFAULT ((0)) FOR [likes]
ALTER TABLE [dbo].[comentarios] ADD CONSTRAINT [DF_comentarios_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[comentarios] ADD CONSTRAINT [DF_comentarios_atualizado_em] DEFAULT (getdate()) FOR [atualizado_em]
ALTER TABLE [dbo].[comentarios] ADD CONSTRAINT [FK_comentarios_conteudo] 
    FOREIGN KEY([conteudo_id]) REFERENCES [dbo].[conteudos] ([id]) ON DELETE CASCADE
ALTER TABLE [dbo].[comentarios] ADD CONSTRAINT [FK_comentarios_utilizador] 
    FOREIGN KEY([utilizador_id]) REFERENCES [dbo].[utilizadores] ([id])
ALTER TABLE [dbo].[comentarios] ADD CONSTRAINT [FK_comentarios_pai] 
    FOREIGN KEY([comentario_pai_id]) REFERENCES [dbo].[comentarios] ([id])
ALTER TABLE [dbo].[comentarios] ADD CONSTRAINT [FK_comentarios_aprovador] 
    FOREIGN KEY([aprovado_por_id]) REFERENCES [dbo].[utilizadores] ([id])
GO

CREATE NONCLUSTERED INDEX [IX_comentarios_conteudo] ON [dbo].[comentarios]([conteudo_id])
CREATE NONCLUSTERED INDEX [IX_comentarios_aprovado] ON [dbo].[comentarios]([aprovado])
CREATE NONCLUSTERED INDEX [IX_comentarios_pai] ON [dbo].[comentarios]([comentario_pai_id])
GO

-- Tabela: Histórico de Visualizações (Analytics)
CREATE TABLE [dbo].[conteudos_visualizacoes](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[conteudo_id] [int] NOT NULL,
	[utilizador_id] [int] NULL,
	[ip_address] [nvarchar](50) NULL,
	[user_agent] [nvarchar](500) NULL,
	[referer] [nvarchar](500) NULL,
	[tempo_leitura_segundos] [int] NULL,
	[visualizado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_conteudos_visualizacoes] PRIMARY KEY CLUSTERED ([id] ASC)
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[conteudos_visualizacoes] ADD CONSTRAINT [DF_conteudos_visualizacoes_data] DEFAULT (getdate()) FOR [visualizado_em]
ALTER TABLE [dbo].[conteudos_visualizacoes] ADD CONSTRAINT [FK_conteudos_visualizacoes_conteudo] 
    FOREIGN KEY([conteudo_id]) REFERENCES [dbo].[conteudos] ([id]) ON DELETE CASCADE
ALTER TABLE [dbo].[conteudos_visualizacoes] ADD CONSTRAINT [FK_conteudos_visualizacoes_utilizador] 
    FOREIGN KEY([utilizador_id]) REFERENCES [dbo].[utilizadores] ([id])
GO

CREATE NONCLUSTERED INDEX [IX_conteudos_visualizacoes_conteudo] ON [dbo].[conteudos_visualizacoes]([conteudo_id])
CREATE NONCLUSTERED INDEX [IX_conteudos_visualizacoes_data] ON [dbo].[conteudos_visualizacoes]([visualizado_em] DESC)
GO

-- Tabela: Favoritos/Bookmarks
CREATE TABLE [dbo].[conteudos_favoritos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[conteudo_id] [int] NOT NULL,
	[utilizador_id] [int] NOT NULL,
	[notas] [nvarchar](500) NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_conteudos_favoritos] PRIMARY KEY CLUSTERED ([id] ASC),
 CONSTRAINT [UQ_conteudos_favoritos] UNIQUE NONCLUSTERED ([conteudo_id], [utilizador_id])
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[conteudos_favoritos] ADD CONSTRAINT [DF_conteudos_favoritos_criado_em] DEFAULT (getdate()) FOR [criado_em]
ALTER TABLE [dbo].[conteudos_favoritos] ADD CONSTRAINT [FK_conteudos_favoritos_conteudo] 
    FOREIGN KEY([conteudo_id]) REFERENCES [dbo].[conteudos] ([id]) ON DELETE CASCADE
ALTER TABLE [dbo].[conteudos_favoritos] ADD CONSTRAINT [FK_conteudos_favoritos_utilizador] 
    FOREIGN KEY([utilizador_id]) REFERENCES [dbo].[utilizadores] ([id]) ON DELETE CASCADE
GO

PRINT 'Módulo de Gestão de Conteúdos criado com sucesso!'
GO