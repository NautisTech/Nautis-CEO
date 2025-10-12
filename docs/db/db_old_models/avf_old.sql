USE [WebAVF]
GO
/****** Object:  Table [dbo].[alcunhas]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[alcunhas](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[apelido] [nvarchar](255) NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[pessoa_id] [int] NOT NULL,
 CONSTRAINT [PK_c751a344844661450add79ab85f] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[anexos]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[anexos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [nvarchar](255) NOT NULL,
	[valor] [nvarchar](500) NOT NULL,
	[tipo] [nvarchar](10) NULL,
	[ordem] [int] NULL,
	[tamanho] [int] NULL,
	[principal] [int] NOT NULL,
	[metadados] [nvarchar](255) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_da398d73b0fa1e7549520adc9f3] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[beneficios]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[beneficios](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[tipo] [nvarchar](50) NOT NULL,
	[valor] [nvarchar](255) NULL,
	[data_inicio] [date] NULL,
	[codigo_pagamento] [nvarchar](50) NULL,
	[numero_beneficiario] [nvarchar](50) NULL,
	[sindicato] [nvarchar](255) NULL,
	[numero_socio] [nvarchar](50) NULL,
	[companhia_seguros] [nvarchar](255) NULL,
	[titulares] [nvarchar](255) NULL,
	[pensionista] [bit] NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[pessoa_id] [int] NOT NULL,
 CONSTRAINT [PK_bf13717178c09a53c95cb6cdb85] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[chapas]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[chapas](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[codigo_chapa] [nvarchar](20) NOT NULL,
	[duracao_total] [time](7) NULL,
	[tempo_conducao] [time](7) NULL,
	[tempo_pausa] [time](7) NULL,
	[kms] [decimal](14, 4) NULL,
	[horas_extra] [time](7) NULL,
	[cor] [nvarchar](20) NULL,
	[ativo] [bit] NOT NULL,
	[tipo_semana] [nvarchar](20) NULL,
	[horas_noturnas_v1] [time](7) NULL,
	[horas_noturnas_v2] [time](7) NULL,
	[desativado_em] [datetime2](7) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_2778cd22eb9ed40b2bd9b0cc5b7] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_cfce477b9694382acbe9e4c094e] UNIQUE NONCLUSTERED 
(
	[codigo_chapa] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[contatos]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[contatos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[tipo] [nvarchar](20) NOT NULL,
	[valor] [nvarchar](255) NOT NULL,
	[localidade] [nvarchar](255) NULL,
	[codigo_postal] [nvarchar](50) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[pessoa_id] [int] NOT NULL,
 CONSTRAINT [PK_994cdcb2c56dfb5b66217c854cc] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[dependentes]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[dependentes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [nvarchar](255) NOT NULL,
	[parentesco] [nvarchar](30) NOT NULL,
	[profissao] [nvarchar](255) NULL,
	[data_nascimento] [date] NULL,
	[tem_condicao_medica] [bit] NOT NULL,
	[descricao_condicao_medica] [nvarchar](255) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[pessoa_id] [int] NOT NULL,
 CONSTRAINT [PK_d64e4b842fb0a435d498046afc6] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[documentos]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[documentos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[tipo] [nvarchar](30) NOT NULL,
	[numero] [nvarchar](50) NOT NULL,
	[vitalicio] [bit] NULL,
	[data_emissao] [date] NULL,
	[data_validade] [date] NULL,
	[detalhes] [nvarchar](255) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[pessoa_id] [int] NULL,
	[veiculo_id] [int] NULL,
	[anexo_id] [int] NULL,
 CONSTRAINT [PK_30b7ee230a352e7582842d1dc02] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[empregos]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[empregos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[empresa] [nvarchar](255) NULL,
	[data_admissao] [date] NOT NULL,
	[data_inicio] [date] NOT NULL,
	[data_fim] [date] NULL,
	[tipo_contrato] [nvarchar](20) NOT NULL,
	[lei] [nvarchar](255) NULL,
	[meses] [int] NULL,
	[dias] [int] NULL,
	[rnv_prev] [int] NOT NULL,
	[dt_ent_quadro] [date] NULL,
	[rnv_efect] [int] NOT NULL,
	[motivo_rnv] [nvarchar](255) NULL,
	[profissao] [nvarchar](255) NULL,
	[categoria] [nvarchar](100) NULL,
	[situacao_profissao] [nvarchar](50) NULL,
	[dt_ini] [date] NULL,
	[dt_rev] [date] NULL,
	[nivel_qualificacao] [nvarchar](255) NULL,
	[motivo] [nvarchar](255) NULL,
	[vencimento] [decimal](18, 2) NULL,
	[horario] [nvarchar](100) NULL,
	[inst_seguranca_social] [nvarchar](255) NULL,
	[situacao] [nvarchar](30) NULL,
	[empresa_deficiencia] [nvarchar](255) NULL,
	[taxa_fixa_marginal] [nvarchar](50) NULL,
	[sec_ccusto] [nvarchar](50) NULL,
	[data_inicio2] [date] NULL,
	[cl_contab] [nvarchar](50) NULL,
	[habilitacoes_literarias] [nvarchar](255) NULL,
	[cct_irct] [nvarchar](255) NULL,
	[estabelecimento] [nvarchar](255) NULL,
	[situacao_militar] [nvarchar](50) NULL,
	[forma_pagamento] [nvarchar](50) NULL,
	[banco_depend] [nvarchar](100) NULL,
	[iban] [nvarchar](50) NULL,
	[situacao_empresa] [nvarchar](50) NULL,
	[dt_situacao] [date] NULL,
	[montante_demissao] [decimal](18, 2) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[pessoa_id] [int] NOT NULL,
 CONSTRAINT [PK_f48493233b3067f82b4f7e11206] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[entidade_grupo]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[entidade_grupo](
	[entidade_id] [int] NOT NULL,
	[grupo_id] [int] NOT NULL,
 CONSTRAINT [PK_f041d2b225a0bf3a54c24a07e96] PRIMARY KEY CLUSTERED 
(
	[entidade_id] ASC,
	[grupo_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[entidade_permissao]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[entidade_permissao](
	[entidade_id] [int] NOT NULL,
	[permissao_id] [int] NOT NULL,
 CONSTRAINT [PK_e224f2dacd1b115bc17d8ef101f] PRIMARY KEY CLUSTERED 
(
	[entidade_id] ASC,
	[permissao_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[entidade_utilizador]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[entidade_utilizador](
	[entidade_id] [int] NOT NULL,
	[utilizador_id] [int] NOT NULL,
 CONSTRAINT [PK_1d16d718bcdfc6c98d261b9d0b7] PRIMARY KEY CLUSTERED 
(
	[entidade_id] ASC,
	[utilizador_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[entidades]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[entidades](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [nvarchar](255) NOT NULL,
	[tipo] [nvarchar](255) NOT NULL,
	[valor] [nvarchar](255) NOT NULL,
 CONSTRAINT [PK_4ceb23ee98193c241ee43c95111] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[grupo_permissao]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[grupo_permissao](
	[grupo_id] [int] NOT NULL,
	[permissao_id] [int] NOT NULL,
 CONSTRAINT [PK_e34c888c629c9af3915fddd18ef] PRIMARY KEY CLUSTERED 
(
	[grupo_id] ASC,
	[permissao_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[grupo_utilizador]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[grupo_utilizador](
	[grupo_id] [int] NOT NULL,
	[utilizador_id] [int] NOT NULL,
 CONSTRAINT [PK_1ba24f651339ccf2e09ffb5fe7d] PRIMARY KEY CLUSTERED 
(
	[grupo_id] ASC,
	[utilizador_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[grupos]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[grupos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [nvarchar](255) NOT NULL,
	[descricao] [nvarchar](255) NOT NULL,
 CONSTRAINT [PK_34de64ec8a5ecd99afb23b2bd62] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[gtfs_agency]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[gtfs_agency](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[agency_id] [nvarchar](20) NOT NULL,
	[agency_name] [nvarchar](100) NOT NULL,
	[agency_url] [nvarchar](50) NOT NULL,
	[agency_timezone] [nvarchar](20) NOT NULL,
	[agency_lang] [nvarchar](20) NOT NULL,
 CONSTRAINT [PK_b40dba94c77637eea5f24240e47] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_87238591b54dd6686528cc8f4fe] UNIQUE NONCLUSTERED 
(
	[agency_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[gtfs_calendar]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[gtfs_calendar](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[service_id] [nvarchar](20) NOT NULL,
	[monday] [nvarchar](1) NOT NULL,
	[tuesday] [nvarchar](1) NOT NULL,
	[wednesday] [nvarchar](1) NOT NULL,
	[thursday] [nvarchar](1) NOT NULL,
	[friday] [nvarchar](1) NOT NULL,
	[saturday] [nvarchar](1) NOT NULL,
	[sunday] [nvarchar](1) NOT NULL,
	[start_date] [nvarchar](8) NOT NULL,
	[end_date] [nvarchar](8) NOT NULL,
 CONSTRAINT [PK_548f149cb5b5ab1f44a4d905feb] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[gtfs_calendar_date]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[gtfs_calendar_date](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[service_id] [nvarchar](20) NOT NULL,
	[date] [nvarchar](8) NOT NULL,
	[exception_type] [nvarchar](1) NOT NULL,
 CONSTRAINT [PK_7f7dc7d632bb312ba5d8b1b44f0] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[gtfs_feed_info]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[gtfs_feed_info](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[feed_publisher_name] [nvarchar](50) NOT NULL,
	[feed_publisher_url] [nvarchar](100) NOT NULL,
	[feed_lang] [nvarchar](50) NOT NULL,
	[feed_start_date] [nvarchar](20) NOT NULL,
	[feed_end_date] [nvarchar](20) NOT NULL,
	[feed_version] [nvarchar](20) NOT NULL,
 CONSTRAINT [PK_eda23d3a4060e6e0b8960f6a4cc] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_9650353b976ee6aa33edfe969da] UNIQUE NONCLUSTERED 
(
	[feed_publisher_name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[gtfs_no_school_dates]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[gtfs_no_school_dates](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[no_school_id] [nvarchar](20) NOT NULL,
	[no_school_desc] [nvarchar](150) NOT NULL,
	[start_date] [nvarchar](8) NOT NULL,
	[end_date] [nvarchar](8) NOT NULL,
 CONSTRAINT [PK_24460f4f6012a421bb6a723f261] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[gtfs_routes]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[gtfs_routes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[route_id] [nvarchar](20) NOT NULL,
	[agency_id] [nvarchar](20) NOT NULL,
	[route_short_name] [nvarchar](255) NOT NULL,
	[route_long_name] [nvarchar](255) NOT NULL,
	[route_desc] [nvarchar](255) NULL,
	[route_type] [nvarchar](20) NOT NULL,
	[no_school_id] [nvarchar](10) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_e32b17a1228bded8065b03c9a5c] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[gtfs_routes_mapping]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[gtfs_routes_mapping](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[route_id] [nvarchar](20) NOT NULL,
	[shape_id] [nvarchar](20) NOT NULL,
	[origin] [nvarchar](100) NOT NULL,
	[destination] [nvarchar](100) NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_eb6edd0cae152dbc6956da57f19] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[gtfs_shapes]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[gtfs_shapes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[shape_id] [nvarchar](255) NOT NULL,
	[shape_pt_lat] [decimal](17, 15) NOT NULL,
	[shape_pt_lon] [decimal](17, 15) NOT NULL,
	[shape_pt_sequence] [int] NOT NULL,
 CONSTRAINT [PK_899f7121b3be976ffa77145e2bd] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[gtfs_stops]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[gtfs_stops](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[stop_id] [nvarchar](50) NOT NULL,
	[stop_name] [nvarchar](100) NOT NULL,
	[stop_lat] [decimal](17, 15) NOT NULL,
	[stop_lon] [decimal](17, 15) NOT NULL,
	[zone_id] [nvarchar](50) NULL,
 CONSTRAINT [PK_2a908c23152d53510375122609c] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_aa0d19f1a08abc6b6ea53dc29db] UNIQUE NONCLUSTERED 
(
	[stop_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[percursos]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[percursos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[ordem] [int] NULL,
	[linha] [int] NULL,
	[tipo] [int] NULL,
	[direcao] [int] NULL,
	[tipo_semana] [nvarchar](20) NULL,
	[local_chegada] [nvarchar](70) NULL,
	[local_partida] [nvarchar](70) NULL,
	[pausa] [bit] NOT NULL,
	[tipo_pausa] [nvarchar](20) NULL,
	[hora_partida] [time](7) NULL,
	[hora_chegada] [time](7) NULL,
	[tempo] [time](7) NULL,
	[kms] [decimal](14, 4) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[chapa_id] [int] NOT NULL,
 CONSTRAINT [PK_015c0e181b72493d0a2c1143d47] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[permissoes]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[permissoes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[codigo] [varchar](255) NOT NULL,
	[descricao] [varchar](255) NOT NULL,
	[modulo] [varchar](20) NOT NULL,
	[tipo] [varchar](20) NOT NULL,
 CONSTRAINT [PK_5a83561e7be8610760090b45c98] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[pessoas]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[pessoas](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[numero] [int] NULL,
	[nome_completo] [nvarchar](255) NOT NULL,
	[abreviacao_nome] [nvarchar](50) NULL,
	[sexo] [nvarchar](20) NOT NULL,
	[data_nascimento] [date] NOT NULL,
	[naturalidade] [nvarchar](255) NULL,
	[nacionalidade] [nvarchar](100) NULL,
	[nivel_antrop] [nvarchar](255) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_fa8104cfc91dc207880a73a1acd] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[route_mapping_stops]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[route_mapping_stops](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[stop_sequence] [int] NOT NULL,
	[shape_point_index] [int] NULL,
	[distance_to_next] [decimal](10, 3) NULL,
	[time_to_next] [time](7) NULL,
	[cumulative_distance] [decimal](10, 3) NULL,
	[cumulative_time] [time](7) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[route_mapping_id] [int] NULL,
	[stop_id] [int] NULL,
 CONSTRAINT [PK_5bdf01a575522ffa80daeb0bfd7] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[utilizador_permissao]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[utilizador_permissao](
	[utilizador_id] [int] NOT NULL,
	[permissao_id] [int] NOT NULL,
 CONSTRAINT [PK_aff05f37ec13c9a850890041350] PRIMARY KEY CLUSTERED 
(
	[utilizador_id] ASC,
	[permissao_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[utilizadores]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[utilizadores](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [nvarchar](255) NOT NULL,
	[email] [nvarchar](255) NULL,
	[email_verificado_em] [datetime2](7) NULL,
	[senha] [nvarchar](255) NOT NULL,
	[senha_alterada_em] [datetime2](7) NULL,
	[token_recordar] [nvarchar](100) NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[pessoa_id] [int] NULL,
	[anexo_id] [int] NULL,
 CONSTRAINT [PK_fc73db723ab93405cbdbb5135a0] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_ce1a87e79cefdf62bd0845d413e] UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[veiculos]    Script Date: 12/10/2025 14:33:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[veiculos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[numero_interno] [nvarchar](50) NOT NULL,
	[entidade] [nvarchar](100) NULL,
	[tipo] [nvarchar](30) NOT NULL,
	[marca] [nvarchar](30) NOT NULL,
	[modelo] [nvarchar](40) NULL,
	[matricula] [nvarchar](20) NULL,
	[chassis] [nvarchar](40) NULL,
	[combustivel] [nvarchar](30) NOT NULL,
	[ano] [int] NULL,
	[capacidade] [int] NULL,
	[detalhes] [nvarchar](255) NULL,
	[data_aquisicao] [datetime2](7) NULL,
	[data_baixa] [datetime2](7) NULL,
	[em_circulacao] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_0c3daa1e5d16914bd9e7777cf77] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[alcunhas] ADD  CONSTRAINT [DF_c7ccf67699072508316f348e93e]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[alcunhas] ADD  CONSTRAINT [DF_94b1fbca10d966d2a43ff57fedf]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[anexos] ADD  CONSTRAINT [DF_c71a3811f69d13ae4a895401893]  DEFAULT ((0)) FOR [principal]
GO
ALTER TABLE [dbo].[anexos] ADD  CONSTRAINT [DF_97d6ea3c163908774a4570f5896]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[anexos] ADD  CONSTRAINT [DF_981f7427d84859c4c6d9b9859a3]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[beneficios] ADD  CONSTRAINT [DF_8d58ec8359cad74468d711a58b4]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[beneficios] ADD  CONSTRAINT [DF_cf6100e2a23be12dc72097e31b9]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[chapas] ADD  CONSTRAINT [DF_b9b62333190951acc059ca23992]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[chapas] ADD  CONSTRAINT [DF_be1732f8759c373916b104b985a]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[chapas] ADD  CONSTRAINT [DF_6d89b6627a220c1a457c15fa3b7]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[contatos] ADD  CONSTRAINT [DF_e99ff2f0c7d8f2611ed5914c1bb]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[contatos] ADD  CONSTRAINT [DF_a256a690cee37b683ccd903def0]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[dependentes] ADD  CONSTRAINT [DF_97b33c597b1151bcca92383c679]  DEFAULT ('Cônjuge') FOR [parentesco]
GO
ALTER TABLE [dbo].[dependentes] ADD  CONSTRAINT [DF_a963830a82d4c242115c824ce0c]  DEFAULT ((0)) FOR [tem_condicao_medica]
GO
ALTER TABLE [dbo].[dependentes] ADD  CONSTRAINT [DF_cef2504be06cd91c8f19b779f29]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[dependentes] ADD  CONSTRAINT [DF_77221b70bbfb42ed7ca3f624434]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[documentos] ADD  CONSTRAINT [DF_81e562652a69aae2385618fe4cd]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[documentos] ADD  CONSTRAINT [DF_6ac930dceb3531d2492ded841dc]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[empregos] ADD  CONSTRAINT [DF_aec5c36146015259df83ce691da]  DEFAULT ((0)) FOR [rnv_prev]
GO
ALTER TABLE [dbo].[empregos] ADD  CONSTRAINT [DF_f2217fb188219c6e02ad54a4c53]  DEFAULT ((0)) FOR [rnv_efect]
GO
ALTER TABLE [dbo].[empregos] ADD  CONSTRAINT [DF_b32986d5ee27b7cc88b146be616]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[empregos] ADD  CONSTRAINT [DF_c6f10f16228b6043c62870e32bd]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[gtfs_routes] ADD  CONSTRAINT [DF_e3df043242f18ea6e44c14fee01]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[gtfs_routes] ADD  CONSTRAINT [DF_7adfa6a204adb4101df1012ecda]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[gtfs_routes_mapping] ADD  CONSTRAINT [DF_e9827ca0839ce4965a8086769ea]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[gtfs_routes_mapping] ADD  CONSTRAINT [DF_1c2722d0ced93fceb70b3f7fdeb]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[percursos] ADD  CONSTRAINT [DF_bf5acece0db942d9c1609be12bd]  DEFAULT ((0)) FOR [pausa]
GO
ALTER TABLE [dbo].[percursos] ADD  CONSTRAINT [DF_550b4cf3d5b52c0ebec6bf9cf2e]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[percursos] ADD  CONSTRAINT [DF_13505a5b5e67ba6dc2346fe56a9]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[pessoas] ADD  CONSTRAINT [DF_569724e7282aa25a16c26e81922]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[pessoas] ADD  CONSTRAINT [DF_174bec08cf6174c706129340617]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[route_mapping_stops] ADD  CONSTRAINT [DF_caf3a24622b1fb0d51d741e88b7]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[route_mapping_stops] ADD  CONSTRAINT [DF_4c76cb0ae5a553662a4d4fc4082]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[utilizadores] ADD  CONSTRAINT [DF_8bb5d0627f9829a36ab1b871d5c]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[utilizadores] ADD  CONSTRAINT [DF_f84388da21278f9b5a6901e6018]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[utilizadores] ADD  CONSTRAINT [DF_c964d781af51272af365322ee11]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[veiculos] ADD  CONSTRAINT [DF_c0f7d672aeb8beb76221c978669]  DEFAULT ((1)) FOR [em_circulacao]
GO
ALTER TABLE [dbo].[veiculos] ADD  CONSTRAINT [DF_0c4f4693fb176de726d19f7eb4b]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[veiculos] ADD  CONSTRAINT [DF_dc54f9501f9b7350e4cc1b9b586]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[entidade_grupo]  WITH CHECK ADD  CONSTRAINT [FK_ac40b2f8806a4712f308f1393d5] FOREIGN KEY([grupo_id])
REFERENCES [dbo].[grupos] ([id])
GO
ALTER TABLE [dbo].[entidade_grupo] CHECK CONSTRAINT [FK_ac40b2f8806a4712f308f1393d5]
GO
ALTER TABLE [dbo].[entidade_grupo]  WITH CHECK ADD  CONSTRAINT [FK_cd978e049ac4624e1070dbd4f23] FOREIGN KEY([entidade_id])
REFERENCES [dbo].[entidades] ([id])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[entidade_grupo] CHECK CONSTRAINT [FK_cd978e049ac4624e1070dbd4f23]
GO
ALTER TABLE [dbo].[entidade_permissao]  WITH CHECK ADD  CONSTRAINT [FK_2ac7fd20a57ce51853d65b9fb83] FOREIGN KEY([permissao_id])
REFERENCES [dbo].[permissoes] ([id])
GO
ALTER TABLE [dbo].[entidade_permissao] CHECK CONSTRAINT [FK_2ac7fd20a57ce51853d65b9fb83]
GO
ALTER TABLE [dbo].[entidade_permissao]  WITH CHECK ADD  CONSTRAINT [FK_2cc1fbcf71675ecdc9a75bf5268] FOREIGN KEY([entidade_id])
REFERENCES [dbo].[entidades] ([id])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[entidade_permissao] CHECK CONSTRAINT [FK_2cc1fbcf71675ecdc9a75bf5268]
GO
ALTER TABLE [dbo].[entidade_utilizador]  WITH CHECK ADD  CONSTRAINT [FK_5bdc964d10c6184b4e30d7b48e8] FOREIGN KEY([entidade_id])
REFERENCES [dbo].[entidades] ([id])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[entidade_utilizador] CHECK CONSTRAINT [FK_5bdc964d10c6184b4e30d7b48e8]
GO
ALTER TABLE [dbo].[entidade_utilizador]  WITH CHECK ADD  CONSTRAINT [FK_70cdd3450951230caf905116951] FOREIGN KEY([utilizador_id])
REFERENCES [dbo].[utilizadores] ([id])
GO
ALTER TABLE [dbo].[entidade_utilizador] CHECK CONSTRAINT [FK_70cdd3450951230caf905116951]
GO
ALTER TABLE [dbo].[grupo_permissao]  WITH CHECK ADD  CONSTRAINT [FK_0feaa50254d4453b6ba60666c8e] FOREIGN KEY([permissao_id])
REFERENCES [dbo].[permissoes] ([id])
GO
ALTER TABLE [dbo].[grupo_permissao] CHECK CONSTRAINT [FK_0feaa50254d4453b6ba60666c8e]
GO
ALTER TABLE [dbo].[grupo_permissao]  WITH CHECK ADD  CONSTRAINT [FK_bf9afc9c8f9c713893590574239] FOREIGN KEY([grupo_id])
REFERENCES [dbo].[grupos] ([id])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[grupo_permissao] CHECK CONSTRAINT [FK_bf9afc9c8f9c713893590574239]
GO
ALTER TABLE [dbo].[grupo_utilizador]  WITH CHECK ADD  CONSTRAINT [FK_547f0831d24baf47a075ff6a312] FOREIGN KEY([utilizador_id])
REFERENCES [dbo].[utilizadores] ([id])
GO
ALTER TABLE [dbo].[grupo_utilizador] CHECK CONSTRAINT [FK_547f0831d24baf47a075ff6a312]
GO
ALTER TABLE [dbo].[grupo_utilizador]  WITH CHECK ADD  CONSTRAINT [FK_d3dab746d5aaec2e5934e9ff9f4] FOREIGN KEY([grupo_id])
REFERENCES [dbo].[grupos] ([id])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[grupo_utilizador] CHECK CONSTRAINT [FK_d3dab746d5aaec2e5934e9ff9f4]
GO
ALTER TABLE [dbo].[utilizador_permissao]  WITH CHECK ADD  CONSTRAINT [FK_5a8ac9ca08d687df5e9b96d8c47] FOREIGN KEY([utilizador_id])
REFERENCES [dbo].[utilizadores] ([id])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[utilizador_permissao] CHECK CONSTRAINT [FK_5a8ac9ca08d687df5e9b96d8c47]
GO
ALTER TABLE [dbo].[utilizador_permissao]  WITH CHECK ADD  CONSTRAINT [FK_cb48db3477286a0ad564bf5de40] FOREIGN KEY([permissao_id])
REFERENCES [dbo].[permissoes] ([id])
GO
ALTER TABLE [dbo].[utilizador_permissao] CHECK CONSTRAINT [FK_cb48db3477286a0ad564bf5de40]
GO
ALTER TABLE [dbo].[anexos]  WITH CHECK ADD  CONSTRAINT [CHK_cec39017608eba8ea553c1e432_ENUM] CHECK  (([tipo]='zip' OR [tipo]='xlsx' OR [tipo]='txt' OR [tipo]='docx' OR [tipo]='csv' OR [tipo]='pdf' OR [tipo]='png' OR [tipo]='jpg'))
GO
ALTER TABLE [dbo].[anexos] CHECK CONSTRAINT [CHK_cec39017608eba8ea553c1e432_ENUM]
GO
ALTER TABLE [dbo].[beneficios]  WITH CHECK ADD  CONSTRAINT [CHK_b2a254940232fad30a5c14763e_ENUM] CHECK  (([tipo]='Outro' OR [tipo]='Pensionista' OR [tipo]='SubNatal' OR [tipo]='SubAlim'))
GO
ALTER TABLE [dbo].[beneficios] CHECK CONSTRAINT [CHK_b2a254940232fad30a5c14763e_ENUM]
GO
ALTER TABLE [dbo].[chapas]  WITH CHECK ADD  CONSTRAINT [CHK_3a2072bc24a0767407cf603431_ENUM] CHECK  (([cor]='Vermelha' OR [cor]='Amarela' OR [cor]='Verde'))
GO
ALTER TABLE [dbo].[chapas] CHECK CONSTRAINT [CHK_3a2072bc24a0767407cf603431_ENUM]
GO
ALTER TABLE [dbo].[chapas]  WITH CHECK ADD  CONSTRAINT [CHK_f149af78048ca1cc3f07be1048_ENUM] CHECK  (([tipo_semana]='AD' OR [tipo_semana]='AS' OR [tipo_semana]='AU'))
GO
ALTER TABLE [dbo].[chapas] CHECK CONSTRAINT [CHK_f149af78048ca1cc3f07be1048_ENUM]
GO
ALTER TABLE [dbo].[contatos]  WITH CHECK ADD  CONSTRAINT [CHK_4a03913408c51a54e135d76bba_ENUM] CHECK  (([tipo]='morada' OR [tipo]='email' OR [tipo]='telefone'))
GO
ALTER TABLE [dbo].[contatos] CHECK CONSTRAINT [CHK_4a03913408c51a54e135d76bba_ENUM]
GO
ALTER TABLE [dbo].[dependentes]  WITH CHECK ADD  CONSTRAINT [CHK_5fda225a7d2f82d23b5e66f6af_ENUM] CHECK  (([parentesco]='Outro' OR [parentesco]='Irmão' OR [parentesco]='Mãe' OR [parentesco]='Pai' OR [parentesco]='Cônjuge' OR [parentesco]='Filho'))
GO
ALTER TABLE [dbo].[dependentes] CHECK CONSTRAINT [CHK_5fda225a7d2f82d23b5e66f6af_ENUM]
GO
ALTER TABLE [dbo].[documentos]  WITH CHECK ADD  CONSTRAINT [CHK_bc68afb540d95e56c07f12c1f3_ENUM] CHECK  (([tipo]='Outro' OR [tipo]='Recibo' OR [tipo]='Licenca' OR [tipo]='Utente' OR [tipo]='CartaConducao' OR [tipo]='Passaporte' OR [tipo]='BI'))
GO
ALTER TABLE [dbo].[documentos] CHECK CONSTRAINT [CHK_bc68afb540d95e56c07f12c1f3_ENUM]
GO
ALTER TABLE [dbo].[empregos]  WITH CHECK ADD  CONSTRAINT [CHK_d7be08bb5b6638977661464bdf_ENUM] CHECK  (([tipo_contrato]='Temporario' OR [tipo_contrato]='Estagio' OR [tipo_contrato]='PJ' OR [tipo_contrato]='CLT'))
GO
ALTER TABLE [dbo].[empregos] CHECK CONSTRAINT [CHK_d7be08bb5b6638977661464bdf_ENUM]
GO
ALTER TABLE [dbo].[percursos]  WITH CHECK ADD  CONSTRAINT [CHK_203eefa106de72d85042ac9815_ENUM] CHECK  (([direcao]='3' OR [direcao]='2' OR [direcao]='1'))
GO
ALTER TABLE [dbo].[percursos] CHECK CONSTRAINT [CHK_203eefa106de72d85042ac9815_ENUM]
GO
ALTER TABLE [dbo].[percursos]  WITH CHECK ADD  CONSTRAINT [CHK_7c32bb738d4036a7f338365105_ENUM] CHECK  (([tipo]='6' OR [tipo]='5' OR [tipo]='4' OR [tipo]='3' OR [tipo]='2' OR [tipo]='1' OR [tipo]='0'))
GO
ALTER TABLE [dbo].[percursos] CHECK CONSTRAINT [CHK_7c32bb738d4036a7f338365105_ENUM]
GO
ALTER TABLE [dbo].[percursos]  WITH CHECK ADD  CONSTRAINT [CHK_8c6cf64aa3cdfd5ab5f521ab4a_ENUM] CHECK  (([tipo_semana]='AD' OR [tipo_semana]='AS' OR [tipo_semana]='AU'))
GO
ALTER TABLE [dbo].[percursos] CHECK CONSTRAINT [CHK_8c6cf64aa3cdfd5ab5f521ab4a_ENUM]
GO
ALTER TABLE [dbo].[percursos]  WITH CHECK ADD  CONSTRAINT [CHK_fbde1ce5baa3cfb9729c880340_ENUM] CHECK  (([tipo_pausa]='Deslocacao' OR [tipo_pausa]='Outros' OR [tipo_pausa]='Intervalo' OR [tipo_pausa]='Jantar' OR [tipo_pausa]='Almoco'))
GO
ALTER TABLE [dbo].[percursos] CHECK CONSTRAINT [CHK_fbde1ce5baa3cfb9729c880340_ENUM]
GO
ALTER TABLE [dbo].[permissoes]  WITH CHECK ADD  CONSTRAINT [CHK_151688315ab6c5bb5fa6688da6_ENUM] CHECK  (([tipo]='Exportar' OR [tipo]='Importar' OR [tipo]='Aprovar' OR [tipo]='Concluir' OR [tipo]='Atribuir' OR [tipo]='Moderar' OR [tipo]='Desativar' OR [tipo]='Banir' OR [tipo]='Apagar' OR [tipo]='Listar' OR [tipo]='Editar' OR [tipo]='Criar'))
GO
ALTER TABLE [dbo].[permissoes] CHECK CONSTRAINT [CHK_151688315ab6c5bb5fa6688da6_ENUM]
GO
ALTER TABLE [dbo].[permissoes]  WITH CHECK ADD  CONSTRAINT [CHK_34d9a157cd300624a102fe0fff_ENUM] CHECK  (([modulo]='Trafego' OR [modulo]='Documentacao' OR [modulo]='Reportes' OR [modulo]='Suporte' OR [modulo]='Comentarios' OR [modulo]='Conteudos' OR [modulo]='Permissoes' OR [modulo]='Grupos' OR [modulo]='Utilizadores'))
GO
ALTER TABLE [dbo].[permissoes] CHECK CONSTRAINT [CHK_34d9a157cd300624a102fe0fff_ENUM]
GO
ALTER TABLE [dbo].[pessoas]  WITH CHECK ADD  CONSTRAINT [CHK_0f77a020c44e53483bf27ba155_ENUM] CHECK  (([sexo]='Não declarado' OR [sexo]='Outro' OR [sexo]='Feminino' OR [sexo]='Masculino'))
GO
ALTER TABLE [dbo].[pessoas] CHECK CONSTRAINT [CHK_0f77a020c44e53483bf27ba155_ENUM]
GO
ALTER TABLE [dbo].[veiculos]  WITH CHECK ADD  CONSTRAINT [CHK_35550921cd3d85bea5c57a1c71_ENUM] CHECK  (([tipo]='Reboque' OR [tipo]='Piquete' OR [tipo]='Outro' OR [tipo]='Moto' OR [tipo]='Ligeiro' OR [tipo]='Autocarro'))
GO
ALTER TABLE [dbo].[veiculos] CHECK CONSTRAINT [CHK_35550921cd3d85bea5c57a1c71_ENUM]
GO
ALTER TABLE [dbo].[veiculos]  WITH CHECK ADD  CONSTRAINT [CHK_64cdc9dacf91a42dbf94ad46fb_ENUM] CHECK  (([combustivel]='Outro' OR [combustivel]='GPL' OR [combustivel]='GNC' OR [combustivel]='Híbrido' OR [combustivel]='Elétrico' OR [combustivel]='Diesel' OR [combustivel]='Gasolina'))
GO
ALTER TABLE [dbo].[veiculos] CHECK CONSTRAINT [CHK_64cdc9dacf91a42dbf94ad46fb_ENUM]
GO
ALTER TABLE [dbo].[veiculos]  WITH CHECK ADD  CONSTRAINT [CHK_ebb72f31910c7a1fc96ed13a29_ENUM] CHECK  (([marca]='Foton' OR [marca]='TATA' OR [marca]='Chery' OR [marca]='JAC' OR [marca]='Iveco' OR [marca]='DAF' OR [marca]='Mitsubishi' OR [marca]='Suzuki' OR [marca]='Renault' OR [marca]='Citroën' OR [marca]='Peugeot' OR [marca]='Fiat' OR [marca]='Volvo' OR [marca]='Scania' OR [marca]='MAN' OR [marca]='Lexus' OR [marca]='Mazda' OR [marca]='Subaru' OR [marca]='Kia' OR [marca]='Hyundai' OR [marca]='Audi' OR [marca]='Mercedes-Benz' OR [marca]='BMW' OR [marca]='Volkswagen' OR [marca]='Nissan' OR [marca]='Chevrolet' OR [marca]='Honda' OR [marca]='Ford' OR [marca]='Toyota'))
GO
ALTER TABLE [dbo].[veiculos] CHECK CONSTRAINT [CHK_ebb72f31910c7a1fc96ed13a29_ENUM]
GO
