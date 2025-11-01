ALTER DATABASE [ceo_main] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [ceo_main].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [ceo_main] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [ceo_main] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [ceo_main] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [ceo_main] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [ceo_main] SET ARITHABORT OFF 
GO
ALTER DATABASE [ceo_main] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [ceo_main] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [ceo_main] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [ceo_main] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [ceo_main] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [ceo_main] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [ceo_main] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [ceo_main] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [ceo_main] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [ceo_main] SET  DISABLE_BROKER 
GO
ALTER DATABASE [ceo_main] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [ceo_main] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [ceo_main] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [ceo_main] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [ceo_main] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [ceo_main] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [ceo_main] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [ceo_main] SET RECOVERY FULL 
GO
ALTER DATABASE [ceo_main] SET  MULTI_USER 
GO
ALTER DATABASE [ceo_main] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [ceo_main] SET DB_CHAINING OFF 
GO
ALTER DATABASE [ceo_main] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [ceo_main] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [ceo_main] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [ceo_main] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'ceo_main', N'ON'
GO
ALTER DATABASE [ceo_main] SET QUERY_STORE = ON
GO
ALTER DATABASE [ceo_main] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [ceo_main]
GO
/****** Object:  Table [dbo].[modulos]    Script Date: 01/11/2025 11:48:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
 CONSTRAINT [PK_modulos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[planos]    Script Date: 01/11/2025 11:48:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
 CONSTRAINT [PK_planos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tenant_configuracoes]    Script Date: 01/11/2025 11:48:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tenant_configuracoes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[tenant_id] [int] NOT NULL,
	[codigo] [nvarchar](50) NOT NULL,
	[descricao] [nvarchar](100) NOT NULL,
	[valor] [nvarchar](max) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tenant_logs]    Script Date: 01/11/2025 11:48:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
 CONSTRAINT [PK_tenant_logs] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tenant_modulos]    Script Date: 01/11/2025 11:48:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tenant_modulos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[tenant_id] [int] NOT NULL,
	[modulo_id] [int] NOT NULL,
	[ativo] [bit] NOT NULL,
	[data_ativacao] [datetime2](7) NULL,
	[data_expiracao] [datetime2](7) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_tenant_modulos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tenants]    Script Date: 01/11/2025 11:48:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
 CONSTRAINT [PK_tenants] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[modulos] ON 
GO
INSERT [dbo].[modulos] ([id], [codigo], [nome], [descricao], [icone], [rota], [ordem], [ativo], [versao], [criado_em], [atualizado_em]) VALUES (1, N'RH', N'Recursos Humanos', N'Gestão completa de RH', N'users', N'/rh', 1, 1, N'1.0.0', CAST(N'2025-10-12T15:25:33.6166667' AS DateTime2), CAST(N'2025-10-12T15:25:33.6166667' AS DateTime2))
GO
INSERT [dbo].[modulos] ([id], [codigo], [nome], [descricao], [icone], [rota], [ordem], [ativo], [versao], [criado_em], [atualizado_em]) VALUES (2, N'VEICULOS', N'Gestão de Veículos', N'Controle de frota', N'truck', N'/veiculos', 2, 1, N'1.0.0', CAST(N'2025-10-12T15:25:33.6166667' AS DateTime2), CAST(N'2025-10-12T15:25:33.6166667' AS DateTime2))
GO
INSERT [dbo].[modulos] ([id], [codigo], [nome], [descricao], [icone], [rota], [ordem], [ativo], [versao], [criado_em], [atualizado_em]) VALUES (3, N'UTILIZADORES', N'Utilizadores', N'Gestão de acessos', N'user-cog', N'/utilizadores', 3, 1, N'1.0.0', CAST(N'2025-10-12T15:25:33.6166667' AS DateTime2), CAST(N'2025-10-12T15:25:33.6166667' AS DateTime2))
GO
INSERT [dbo].[modulos] ([id], [codigo], [nome], [descricao], [icone], [rota], [ordem], [ativo], [versao], [criado_em], [atualizado_em]) VALUES (4, N'SUPORTE', N'Suporte e Manutenção', N'Gestão de tickets e intervenções', N'tool', N'/suporte', 6, 1, N'1.0.0', CAST(N'2025-10-12T15:55:23.3966667' AS DateTime2), CAST(N'2025-10-12T15:55:23.3966667' AS DateTime2))
GO
INSERT [dbo].[modulos] ([id], [codigo], [nome], [descricao], [icone], [rota], [ordem], [ativo], [versao], [criado_em], [atualizado_em]) VALUES (5, N'CONTEUDOS', N'Gestão de Conteúdos', N'Notícias, eventos, banners e conteúdos personalizáveis', N'newspaper', N'/conteudos', 10, 1, N'1.0.0', CAST(N'2025-10-12T16:01:57.0033333' AS DateTime2), CAST(N'2025-10-12T16:01:57.0033333' AS DateTime2))
GO
INSERT [dbo].[modulos] ([id], [codigo], [nome], [descricao], [icone], [rota], [ordem], [ativo], [versao], [criado_em], [atualizado_em]) VALUES (6, N'EMPRESAS', N'Multi-Empresa', N'Gestão de múltiplas empresas dentro do tenant', N'building', N'/empresas', 12, 1, N'1.0.0', CAST(N'2025-10-12T16:01:57.0166667' AS DateTime2), CAST(N'2025-10-12T16:01:57.0166667' AS DateTime2))
GO
INSERT [dbo].[modulos] ([id], [codigo], [nome], [descricao], [icone], [rota], [ordem], [ativo], [versao], [criado_em], [atualizado_em]) VALUES (7, N'EQUIPAMENTOS', N'Gestão de Equipamentos', N'Gestão de inventário, manutenção e alocação de equipamentos', N'device-desktop', N'/equipamentos', 7, 1, N'1.0.0', CAST(N'2025-10-25T19:19:53.6766667' AS DateTime2), CAST(N'2025-10-25T19:19:53.6766667' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[modulos] OFF
GO
SET IDENTITY_INSERT [dbo].[planos] ON 
GO
INSERT [dbo].[planos] ([id], [codigo], [nome], [descricao], [preco_mensal], [preco_anual], [max_utilizadores], [max_armazenamento_gb], [recursos], [ativo], [ordem], [criado_em], [atualizado_em]) VALUES (1, N'basico', N'Básico', N'Plano básico com funcionalidades essenciais', CAST(49.99 AS Decimal(10, 2)), CAST(499.99 AS Decimal(10, 2)), 5, 10, N'{"modulos": ["RH", "UTILIZADORES"]}', 1, 1, CAST(N'2025-10-12T15:25:33.6133333' AS DateTime2), CAST(N'2025-10-12T15:25:33.6133333' AS DateTime2))
GO
INSERT [dbo].[planos] ([id], [codigo], [nome], [descricao], [preco_mensal], [preco_anual], [max_utilizadores], [max_armazenamento_gb], [recursos], [ativo], [ordem], [criado_em], [atualizado_em]) VALUES (2, N'profissional', N'Profissional', N'Plano completo para pequenas empresas', CAST(99.99 AS Decimal(10, 2)), CAST(999.99 AS Decimal(10, 2)), 20, 50, N'{"modulos": ["RH", "VEICULOS", "UTILIZADORES"]}', 1, 2, CAST(N'2025-10-12T15:25:33.6133333' AS DateTime2), CAST(N'2025-10-12T15:25:33.6133333' AS DateTime2))
GO
INSERT [dbo].[planos] ([id], [codigo], [nome], [descricao], [preco_mensal], [preco_anual], [max_utilizadores], [max_armazenamento_gb], [recursos], [ativo], [ordem], [criado_em], [atualizado_em]) VALUES (3, N'empresarial', N'Empresarial', N'Solução completa para grandes organizações', CAST(249.99 AS Decimal(10, 2)), CAST(2499.99 AS Decimal(10, 2)), 100, 200, N'{"modulos": ["*"]}', 1, 3, CAST(N'2025-10-12T15:25:33.6133333' AS DateTime2), CAST(N'2025-10-12T15:25:33.6133333' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[planos] OFF
GO
SET IDENTITY_INSERT [dbo].[tenant_configuracoes] ON 
GO
INSERT [dbo].[tenant_configuracoes] ([id], [tenant_id], [codigo], [descricao], [valor], [criado_em], [atualizado_em]) VALUES (1, 1003, N'MASTER_ENCRYPTION_KEY', N'Chave AES usada para criptografar as credenciais', N'ea3bf924d310662cbf9aad9f85670fbe89714cb26da63715cbac4f027b5e8f44', CAST(N'2025-10-30T18:45:15.8966667' AS DateTime2), NULL)
GO
INSERT [dbo].[tenant_configuracoes] ([id], [tenant_id], [codigo], [descricao], [valor], [criado_em], [atualizado_em]) VALUES (2, 1003, N'DB_HOST', N'Endereço do servidor da base de dados', N'RDdGwxva3QkFWV9VPV0gZg==', CAST(N'2025-10-30T18:45:15.8966667' AS DateTime2), NULL)
GO
INSERT [dbo].[tenant_configuracoes] ([id], [tenant_id], [codigo], [descricao], [valor], [criado_em], [atualizado_em]) VALUES (3, 1003, N'DB_PORT', N'Porta da base de dados', N'C1EFRx82HrKa0fKwosX80Q==', CAST(N'2025-10-30T18:45:15.8966667' AS DateTime2), NULL)
GO
INSERT [dbo].[tenant_configuracoes] ([id], [tenant_id], [codigo], [descricao], [valor], [criado_em], [atualizado_em]) VALUES (4, 1003, N'DB_USER', N'Utilizador da base de dados', N'L9MPlTfNOUIhZ7QUAdGkFw==', CAST(N'2025-10-30T18:45:15.8966667' AS DateTime2), NULL)
GO
INSERT [dbo].[tenant_configuracoes] ([id], [tenant_id], [codigo], [descricao], [valor], [criado_em], [atualizado_em]) VALUES (5, 1003, N'DB_PASSWORD', N'Password da base de dados do tenant', N'2XApkEdVCUyUPl90dQR5P1WISohTqzSdpciqBL6oneU=', CAST(N'2025-10-30T18:45:15.8966667' AS DateTime2), NULL)
GO
SET IDENTITY_INSERT [dbo].[tenant_configuracoes] OFF
GO
SET IDENTITY_INSERT [dbo].[tenant_logs] ON 
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (1, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-13T05:16:05.1633333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (2, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-13T05:16:14.8200000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (3, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-13T05:16:15.8700000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (4, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-13T05:16:16.6533333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (5, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-13T05:16:29.2366667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (6, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-13T05:23:35.5700000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (7, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-13T05:23:37.3866667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (8, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-13T05:45:55.2433333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (10002, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-18T10:29:46.0833333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (10003, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-18T10:29:51.1700000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (10004, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-18T10:29:55.9100000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (10005, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-18T10:29:58.3900000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (10006, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-18T10:30:00.7166667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (10007, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-18T10:34:45.5133333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (10008, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-18T10:49:33.8633333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (10009, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-18T10:50:15.5966667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (10010, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-18T10:50:18.6700000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (10011, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-18T10:52:23.5233333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (10012, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-18T10:52:40.1366667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (10013, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-18T10:55:08.2800000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (10014, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-18T10:57:44.1500000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (10015, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-18T11:13:19.1000000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (10016, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-18T11:13:25.7200000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (10017, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-18T11:19:34.8266667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (10018, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-18T14:54:08.3066667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (10019, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-18T15:04:35.0100000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (10020, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-18T16:30:41.0000000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (10021, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-18T16:59:10.0533333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20020, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-20T08:36:17.5900000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20021, 2, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-20T09:29:26.0100000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20022, 1002, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-23T17:29:39.2033333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20023, 1002, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-23T17:33:01.8666667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20024, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-24T09:04:30.8966667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20025, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-24T09:30:07.2633333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20026, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-24T11:07:29.9400000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20027, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-24T13:37:54.5466667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20028, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-24T18:02:42.7233333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20029, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-25T07:35:47.9366667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20030, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-25T10:32:19.0866667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20031, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-25T19:21:20.8066667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20032, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-25T21:56:13.3900000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20033, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-25T21:56:26.1833333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20034, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-25T21:58:41.4766667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20035, 1003, N'login', N'Utilizador 3 fez login', NULL, 3, NULL, NULL, CAST(N'2025-10-25T22:06:11.7800000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20036, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-25T22:08:55.2900000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20037, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-25T22:13:00.5566667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20038, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-25T22:18:17.0233333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20039, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-25T22:19:21.1800000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20040, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-26T21:39:59.0666667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20041, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-26T22:57:28.7600000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20042, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-26T23:30:46.1033333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20043, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-27T11:09:55.0566667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20044, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-27T11:10:08.9766667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20045, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-27T11:12:07.8000000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20046, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-27T13:48:57.3633333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20047, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-27T15:27:48.9033333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20048, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-27T15:32:58.1000000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20049, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-27T16:30:55.9433333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20050, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-27T16:43:31.0466667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20051, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-27T16:50:29.1433333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20052, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-27T17:21:22.2600000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20053, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-27T17:22:35.7666667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20054, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-27T17:40:54.8333333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20055, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-27T17:50:47.6400000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20056, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-28T09:45:37.3533333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20057, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-28T09:48:59.6966667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20058, 1003, N'login', N'Utilizador 6 fez login', NULL, 6, NULL, NULL, CAST(N'2025-10-28T11:03:31.0466667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20059, 1003, N'login', N'Utilizador 6 fez login', NULL, 6, NULL, NULL, CAST(N'2025-10-28T11:06:48.0666667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20060, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-28T12:41:55.3233333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20061, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-28T13:01:05.4166667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20062, 1003, N'login', N'Utilizador 6 fez login', NULL, 6, NULL, NULL, CAST(N'2025-10-28T16:05:39.9633333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20063, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-28T16:54:23.1433333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20064, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-28T19:54:35.3633333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20065, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-28T23:40:44.6966667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20066, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-29T09:30:03.4766667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20067, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-29T09:36:34.3766667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20068, 1003, N'login', N'Utilizador 6 fez login', NULL, 6, NULL, NULL, CAST(N'2025-10-29T10:31:13.8633333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20069, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-29T10:39:55.7100000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20070, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-29T12:12:50.4366667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20071, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-29T12:15:52.7900000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20072, 1003, N'login', N'Utilizador 3 fez login', NULL, 3, NULL, NULL, CAST(N'2025-10-29T18:11:27.1300000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20073, 1003, N'login', N'Utilizador 17 fez login', NULL, 17, NULL, NULL, CAST(N'2025-10-29T18:34:58.8700000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20074, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-30T15:28:39.6000000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20075, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-30T16:00:19.5833333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20076, 1003, N'login', N'Utilizador 17 fez login', NULL, 17, NULL, NULL, CAST(N'2025-10-30T16:21:38.1666667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20077, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-30T18:57:15.2966667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20078, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-30T19:26:58.6633333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20079, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-30T19:27:25.1100000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20080, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-30T19:27:50.9633333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20081, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-30T19:45:51.7100000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20082, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-30T20:03:19.8100000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20083, 1003, N'login', N'Utilizador 17 fez login', NULL, 17, NULL, NULL, CAST(N'2025-10-30T20:04:25.6666667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20084, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-30T22:55:27.2500000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20085, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-30T23:09:01.8000000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20086, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-31T00:58:47.2566667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20087, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-31T09:55:05.8300000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20088, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-31T14:59:58.7000000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20089, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-31T15:12:01.7333333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20090, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-31T17:58:32.1600000' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20091, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-31T18:38:44.7133333' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20092, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-31T21:43:54.9466667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20093, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-31T23:00:57.0966667' AS DateTime2))
GO
INSERT [dbo].[tenant_logs] ([id], [tenant_id], [tipo], [acao], [detalhes], [utilizador_id], [ip_address], [user_agent], [criado_em]) VALUES (20094, 1003, N'login', N'Utilizador 1 fez login', NULL, 1, NULL, NULL, CAST(N'2025-10-31T23:21:13.9433333' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[tenant_logs] OFF
GO
SET IDENTITY_INSERT [dbo].[tenant_modulos] ON 
GO
INSERT [dbo].[tenant_modulos] ([id], [tenant_id], [modulo_id], [ativo], [data_ativacao], [data_expiracao], [criado_em], [atualizado_em]) VALUES (1, 2, 5, 1, CAST(N'2025-10-18T14:53:12.9300000' AS DateTime2), NULL, CAST(N'2025-10-18T14:53:12.9300000' AS DateTime2), CAST(N'2025-10-18T14:53:12.9300000' AS DateTime2))
GO
INSERT [dbo].[tenant_modulos] ([id], [tenant_id], [modulo_id], [ativo], [data_ativacao], [data_expiracao], [criado_em], [atualizado_em]) VALUES (2, 1003, 1, 1, NULL, NULL, CAST(N'2025-10-24T11:11:50.5633333' AS DateTime2), CAST(N'2025-10-24T11:11:50.5633333' AS DateTime2))
GO
INSERT [dbo].[tenant_modulos] ([id], [tenant_id], [modulo_id], [ativo], [data_ativacao], [data_expiracao], [criado_em], [atualizado_em]) VALUES (3, 1003, 3, 1, NULL, NULL, CAST(N'2025-10-24T11:12:16.2800000' AS DateTime2), CAST(N'2025-10-24T11:12:16.2800000' AS DateTime2))
GO
INSERT [dbo].[tenant_modulos] ([id], [tenant_id], [modulo_id], [ativo], [data_ativacao], [data_expiracao], [criado_em], [atualizado_em]) VALUES (4, 1003, 4, 1, NULL, NULL, CAST(N'2025-10-25T19:20:39.1033333' AS DateTime2), CAST(N'2025-10-25T19:20:39.1033333' AS DateTime2))
GO
INSERT [dbo].[tenant_modulos] ([id], [tenant_id], [modulo_id], [ativo], [data_ativacao], [data_expiracao], [criado_em], [atualizado_em]) VALUES (5, 1003, 7, 1, NULL, NULL, CAST(N'2025-10-25T19:20:39.1033333' AS DateTime2), CAST(N'2025-10-25T19:20:39.1033333' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[tenant_modulos] OFF
GO
SET IDENTITY_INSERT [dbo].[tenants] ON 
GO
INSERT [dbo].[tenants] ([id], [nome], [slug], [dominio], [database_name], [logo_url], [cor_primaria], [cor_secundaria], [ativo], [data_expiracao], [plano_id], [max_utilizadores], [max_armazenamento_gb], [configuracoes], [criado_em], [atualizado_em]) VALUES (2, N'Softon', N'softon', N'softon.pt', N'ceo_tenant_softon', NULL, N'#0047AB', N'#F5F5F5', 1, NULL, NULL, NULL, NULL, NULL, CAST(N'2025-10-12T16:25:53.1633030' AS DateTime2), CAST(N'2025-10-12T16:25:53.1633030' AS DateTime2))
GO
INSERT [dbo].[tenants] ([id], [nome], [slug], [dominio], [database_name], [logo_url], [cor_primaria], [cor_secundaria], [ativo], [data_expiracao], [plano_id], [max_utilizadores], [max_armazenamento_gb], [configuracoes], [criado_em], [atualizado_em]) VALUES (1002, N'Lar Evangélico', N'larevangelico', N'larevangelico.pt', N'ceo_tenant_larevangelico', NULL, N'#0047AB', N'#F5F5F5', 1, NULL, NULL, NULL, NULL, NULL, CAST(N'2025-10-18T14:52:17.2866667' AS DateTime2), CAST(N'2025-10-18T14:52:17.2866667' AS DateTime2))
GO
INSERT [dbo].[tenants] ([id], [nome], [slug], [dominio], [database_name], [logo_url], [cor_primaria], [cor_secundaria], [ativo], [data_expiracao], [plano_id], [max_utilizadores], [max_armazenamento_gb], [configuracoes], [criado_em], [atualizado_em]) VALUES (1003, N'MicroLopes', N'microlopes', N'microlopes.pt', N'ceo_tenant_microlopes', NULL, N'#0047AB', N'#F5F5F5', 1, NULL, NULL, NULL, NULL, NULL, CAST(N'2025-10-24T08:27:40.9500000' AS DateTime2), CAST(N'2025-10-24T08:27:40.9500000' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[tenants] OFF
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_modulos_codigo]    Script Date: 01/11/2025 11:48:53 ******/
ALTER TABLE [dbo].[modulos] ADD  CONSTRAINT [UQ_modulos_codigo] UNIQUE NONCLUSTERED 
(
	[codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_planos_codigo]    Script Date: 01/11/2025 11:48:53 ******/
ALTER TABLE [dbo].[planos] ADD  CONSTRAINT [UQ_planos_codigo] UNIQUE NONCLUSTERED 
(
	[codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_tenant_configuracoes]    Script Date: 01/11/2025 11:48:53 ******/
ALTER TABLE [dbo].[tenant_configuracoes] ADD  CONSTRAINT [UQ_tenant_configuracoes] UNIQUE NONCLUSTERED 
(
	[tenant_id] ASC,
	[codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_tenant_configuracoes_tenant_codigo]    Script Date: 01/11/2025 11:48:53 ******/
CREATE NONCLUSTERED INDEX [IX_tenant_configuracoes_tenant_codigo] ON [dbo].[tenant_configuracoes]
(
	[tenant_id] ASC,
	[codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_tenant_logs_tenant_data]    Script Date: 01/11/2025 11:48:53 ******/
CREATE NONCLUSTERED INDEX [IX_tenant_logs_tenant_data] ON [dbo].[tenant_logs]
(
	[tenant_id] ASC,
	[criado_em] DESC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ_tenant_modulos]    Script Date: 01/11/2025 11:48:53 ******/
ALTER TABLE [dbo].[tenant_modulos] ADD  CONSTRAINT [UQ_tenant_modulos] UNIQUE NONCLUSTERED 
(
	[tenant_id] ASC,
	[modulo_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_tenants_database]    Script Date: 01/11/2025 11:48:53 ******/
ALTER TABLE [dbo].[tenants] ADD  CONSTRAINT [UQ_tenants_database] UNIQUE NONCLUSTERED 
(
	[database_name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_tenants_slug]    Script Date: 01/11/2025 11:48:53 ******/
ALTER TABLE [dbo].[tenants] ADD  CONSTRAINT [UQ_tenants_slug] UNIQUE NONCLUSTERED 
(
	[slug] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[modulos] ADD  CONSTRAINT [DF_modulos_ordem]  DEFAULT ((0)) FOR [ordem]
GO
ALTER TABLE [dbo].[modulos] ADD  CONSTRAINT [DF_modulos_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[modulos] ADD  CONSTRAINT [DF_modulos_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[modulos] ADD  CONSTRAINT [DF_modulos_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[planos] ADD  CONSTRAINT [DF_planos_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[planos] ADD  CONSTRAINT [DF_planos_ordem]  DEFAULT ((0)) FOR [ordem]
GO
ALTER TABLE [dbo].[planos] ADD  CONSTRAINT [DF_planos_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[planos] ADD  CONSTRAINT [DF_planos_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[tenant_configuracoes] ADD  CONSTRAINT [DF_tenant_configuracoes_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[tenant_logs] ADD  CONSTRAINT [DF_tenant_logs_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[tenant_modulos] ADD  CONSTRAINT [DF_tenant_modulos_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[tenant_modulos] ADD  CONSTRAINT [DF_tenant_modulos_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[tenant_modulos] ADD  CONSTRAINT [DF_tenant_modulos_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[tenants] ADD  CONSTRAINT [DF_tenants_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[tenants] ADD  CONSTRAINT [DF_tenants_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[tenants] ADD  CONSTRAINT [DF_tenants_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[tenant_configuracoes]  WITH CHECK ADD  CONSTRAINT [FK_tenant_configuracoes_tenant] FOREIGN KEY([tenant_id])
REFERENCES [dbo].[tenants] ([id])
GO
ALTER TABLE [dbo].[tenant_configuracoes] CHECK CONSTRAINT [FK_tenant_configuracoes_tenant]
GO
ALTER TABLE [dbo].[tenant_logs]  WITH CHECK ADD  CONSTRAINT [FK_tenant_logs_tenant] FOREIGN KEY([tenant_id])
REFERENCES [dbo].[tenants] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[tenant_logs] CHECK CONSTRAINT [FK_tenant_logs_tenant]
GO
ALTER TABLE [dbo].[tenant_modulos]  WITH CHECK ADD  CONSTRAINT [FK_tenant_modulos_modulo] FOREIGN KEY([modulo_id])
REFERENCES [dbo].[modulos] ([id])
GO
ALTER TABLE [dbo].[tenant_modulos] CHECK CONSTRAINT [FK_tenant_modulos_modulo]
GO
ALTER TABLE [dbo].[tenant_modulos]  WITH CHECK ADD  CONSTRAINT [FK_tenant_modulos_tenant] FOREIGN KEY([tenant_id])
REFERENCES [dbo].[tenants] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[tenant_modulos] CHECK CONSTRAINT [FK_tenant_modulos_tenant]
GO
ALTER TABLE [dbo].[tenants]  WITH CHECK ADD  CONSTRAINT [FK_tenants_planos] FOREIGN KEY([plano_id])
REFERENCES [dbo].[planos] ([id])
GO
ALTER TABLE [dbo].[tenants] CHECK CONSTRAINT [FK_tenants_planos]
GO
ALTER TABLE [dbo].[tenant_logs]  WITH CHECK ADD  CONSTRAINT [CHK_tenant_logs_tipo] CHECK  (([tipo]='security' OR [tipo]='info' OR [tipo]='warning' OR [tipo]='error' OR [tipo]='import' OR [tipo]='export' OR [tipo]='delete' OR [tipo]='update' OR [tipo]='create' OR [tipo]='logout' OR [tipo]='login'))
GO
ALTER TABLE [dbo].[tenant_logs] CHECK CONSTRAINT [CHK_tenant_logs_tipo]
GO
USE [master]
GO
ALTER DATABASE [ceo_main] SET  READ_WRITE 
GO
