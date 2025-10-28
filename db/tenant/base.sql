ALTER DATABASE [ceo_tenant_microlopes] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [ceo_tenant_microlopes].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [ceo_tenant_microlopes] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET ARITHABORT OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET  DISABLE_BROKER 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET RECOVERY FULL 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET  MULTI_USER 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [ceo_tenant_microlopes] SET DB_CHAINING OFF 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [ceo_tenant_microlopes] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'ceo_tenant_microlopes', N'ON'
GO
ALTER DATABASE [ceo_tenant_microlopes] SET QUERY_STORE = ON
GO
ALTER DATABASE [ceo_tenant_microlopes] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [ceo_tenant_microlopes]
GO
/****** Object:  Table [dbo].[tipos_ticket]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tipos_ticket](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [nvarchar](100) NOT NULL,
	[descricao] [nvarchar](500) NULL,
	[cor] [nvarchar](20) NULL,
	[icone] [nvarchar](50) NULL,
	[sla_horas] [int] NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_tipos_ticket] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tickets]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tickets](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[numero_ticket] [nvarchar](50) NOT NULL,
	[tipo_ticket_id] [int] NOT NULL,
	[equipamento_id] [int] NULL,
	[titulo] [nvarchar](255) NOT NULL,
	[descricao] [nvarchar](max) NOT NULL,
	[prioridade] [nvarchar](20) NOT NULL,
	[status] [nvarchar](30) NOT NULL,
	[solicitante_id] [int] NOT NULL,
	[atribuido_id] [int] NULL,
	[localizacao] [nvarchar](255) NULL,
	[data_abertura] [datetime2](7) NOT NULL,
	[data_prevista] [datetime2](7) NULL,
	[data_conclusao] [datetime2](7) NULL,
	[tempo_resolucao_minutos] [int] NULL,
	[avaliacao] [int] NULL,
	[comentario_avaliacao] [nvarchar](1000) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[cliente_id] [int] NULL,
 CONSTRAINT [PK_tickets] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_tickets_numero] UNIQUE NONCLUSTERED 
(
	[numero_ticket] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[utilizadores]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
	[funcionario_id] [int] NULL,
	[ultimo_login] [datetime] NULL,
	[cliente_id] [int] NULL,
	[tipo_utilizador] [nvarchar](50) NULL,
 CONSTRAINT [PK_utilizadores] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_utilizadores_email] UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_utilizadores_username] UNIQUE NONCLUSTERED 
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[empresas]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
	[nome_comercial] [nvarchar](255) NULL,
	[nome_juridico] [nvarchar](255) NULL,
	[tipo_empresa] [nvarchar](50) NULL,
	[natureza_juridica] [nvarchar](100) NULL,
	[capital_social] [decimal](15, 2) NULL,
	[num_matricula] [nvarchar](50) NULL,
	[data_constituicao] [date] NULL,
	[email] [nvarchar](255) NULL,
	[telefone] [nvarchar](50) NULL,
	[telemovel] [nvarchar](50) NULL,
	[fax] [nvarchar](50) NULL,
	[website] [nvarchar](255) NULL,
	[morada_fiscal] [nvarchar](500) NULL,
	[codigo_postal] [nvarchar](20) NULL,
	[localidade] [nvarchar](100) NULL,
	[distrito] [nvarchar](100) NULL,
	[pais] [nvarchar](100) NULL,
	[morada_correspondencia] [nvarchar](500) NULL,
	[codigo_postal_correspondencia] [nvarchar](20) NULL,
	[localidade_correspondencia] [nvarchar](100) NULL,
	[num_cliente] [nvarchar](50) NULL,
	[num_fornecedor] [nvarchar](50) NULL,
	[segmento] [nvarchar](100) NULL,
	[setor_atividade] [nvarchar](100) NULL,
	[codigo_cae] [nvarchar](20) NULL,
	[iban] [nvarchar](50) NULL,
	[swift_bic] [nvarchar](20) NULL,
	[banco] [nvarchar](100) NULL,
	[condicoes_pagamento] [nvarchar](100) NULL,
	[metodo_pagamento_preferido] [nvarchar](50) NULL,
	[limite_credito] [decimal](15, 2) NULL,
	[desconto_comercial] [decimal](5, 2) NULL,
	[pessoa_contacto] [nvarchar](255) NULL,
	[cargo_contacto] [nvarchar](100) NULL,
	[email_contacto] [nvarchar](255) NULL,
	[telefone_contacto] [nvarchar](50) NULL,
	[observacoes] [nvarchar](max) NULL,
	[tags] [nvarchar](500) NULL,
	[rating] [int] NULL,
	[estado] [nvarchar](50) NULL,
	[ref_externa] [nvarchar](100) NULL,
	[id_phc] [nvarchar](50) NULL,
	[sincronizado_phc] [bit] NULL,
	[ultima_sincronizacao] [datetime2](7) NULL,
	[criado_por] [int] NULL,
	[atualizado_por] [int] NULL,
 CONSTRAINT [PK_empresas] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_empresas_codigo] UNIQUE NONCLUSTERED 
(
	[codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  View [dbo].[vw_TicketsAbertos]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************************/
/* VIEWS                                                                     */
/******************************************************************************/

-- View: Tickets em Aberto
CREATE   VIEW [dbo].[vw_TicketsAbertos]
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
/****** Object:  Table [dbo].[utilizador_empresa]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[utilizador_empresa](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[utilizador_id] [int] NOT NULL,
	[empresa_id] [int] NOT NULL,
	[empresa_principal] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_utilizador_empresa] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_utilizador_empresa] UNIQUE NONCLUSTERED 
(
	[utilizador_id] ASC,
	[empresa_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[veiculos]    Script Date: 28/10/2025 11:43:52 ******/
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
	[empresa_id] [int] NULL,
 CONSTRAINT [PK_veiculos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[conteudos]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[conteudos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[tipo_conteudo_id] [int] NOT NULL,
	[categoria_id] [int] NULL,
	[titulo] [nvarchar](255) NOT NULL,
	[slug] [nvarchar](255) NOT NULL,
	[subtitulo] [nvarchar](500) NULL,
	[resumo] [nvarchar](1000) NULL,
	[conteudo] [nvarchar](max) NULL,
	[imagem_destaque] [nvarchar](500) NULL,
	[autor_id] [int] NULL,
	[status] [nvarchar](20) NOT NULL,
	[destaque] [bit] NOT NULL,
	[permite_comentarios] [bit] NOT NULL,
	[visualizacoes] [int] NOT NULL,
	[ordem] [int] NULL,
	[publicado_em] [datetime2](7) NULL,
	[data_inicio] [datetime2](7) NULL,
	[data_fim] [datetime2](7) NULL,
	[meta_title] [nvarchar](255) NULL,
	[meta_description] [nvarchar](500) NULL,
	[meta_keywords] [nvarchar](500) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[aprovado_por_id] [int] NULL,
	[aprovado_em] [datetime2](7) NULL,
	[empresa_id] [int] NULL,
	[visibilidade] [nvarchar](20) NOT NULL,
	[variants] [nvarchar](max) NULL,
 CONSTRAINT [PK_conteudos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_conteudos_slug] UNIQUE NONCLUSTERED 
(
	[slug] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[funcionarios]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
	[empresa_id] [int] NULL,
 CONSTRAINT [PK_funcionarios] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  View [dbo].[vw_EstatisticasEmpresas]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************************/
/* VIEWS COM CONTROLO DE ACESSO                                             */
/******************************************************************************/

-- View: Estatísticas por Empresa
CREATE   VIEW [dbo].[vw_EstatisticasEmpresas]
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
/****** Object:  Table [dbo].[marcas]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[marcas](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [nvarchar](100) NOT NULL,
	[logo_url] [nvarchar](500) NULL,
	[website] [nvarchar](255) NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[codigo_leitura] [nvarchar](255) NULL,
	[tipo_leitura] [nvarchar](50) NULL,
	[email_suporte] [nvarchar](50) NULL,
	[telefone_suporte] [nvarchar](50) NULL,
	[link_suporte] [nvarchar](100) NULL,
 CONSTRAINT [PK_marcas] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_marcas_nome] UNIQUE NONCLUSTERED 
(
	[nome] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[categorias_equipamento]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
 CONSTRAINT [PK_categorias_equipamento] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[modelos_equipamento]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[modelos_equipamento](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[marca_id] [int] NOT NULL,
	[categoria_id] [int] NOT NULL,
	[nome] [nvarchar](100) NOT NULL,
	[codigo] [nvarchar](50) NULL,
	[descricao] [nvarchar](1000) NULL,
	[especificacoes] [nvarchar](max) NULL,
	[imagem_url] [nvarchar](300) NULL,
	[manual_url] [nvarchar](300) NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[codigo_leitura] [nvarchar](255) NULL,
	[tipo_leitura] [nvarchar](50) NULL,
 CONSTRAINT [PK_modelos_equipamento] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[equipamentos]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[equipamentos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[empresa_id] [int] NULL,
	[modelo_id] [int] NOT NULL,
	[numero_serie] [nvarchar](100) NULL,
	[numero_interno] [nvarchar](50) NOT NULL,
	[descricao] [nvarchar](500) NULL,
	[localizacao] [nvarchar](255) NULL,
	[responsavel_id] [int] NULL,
	[utilizador_id] [int] NULL,
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
	[codigo_leitura] [nvarchar](255) NULL,
	[tipo_leitura] [nvarchar](50) NULL,
 CONSTRAINT [PK_equipamentos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_equipamentos_numero_interno] UNIQUE NONCLUSTERED 
(
	[numero_interno] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  View [dbo].[vw_EquipamentosManutencaoProxima]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- View: Equipamentos com Manutenção Próxima
CREATE   VIEW [dbo].[vw_EquipamentosManutencaoProxima]
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
/****** Object:  View [dbo].[vw_EstatisticasTickets]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- View: Estatísticas de Tickets
CREATE   VIEW [dbo].[vw_EstatisticasTickets]
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
/****** Object:  Table [dbo].[intervencoes]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
	[anexo_url] [nvarchar](300) NULL,
	[cliente_id] [int] NULL,
	[precisa_aprovacao_cliente] [bit] NULL,
	[aprovacao_cliente] [bit] NULL,
	[data_aprovacao] [datetime] NULL,
 CONSTRAINT [PK_intervencoes] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_intervencoes_numero] UNIQUE NONCLUSTERED 
(
	[numero_intervencao] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  View [dbo].[vw_CustosEquipamentos]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- View: Custos por Equipamento
CREATE   VIEW [dbo].[vw_CustosEquipamentos]
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
/****** Object:  Table [dbo].[anexos]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
	[upload_por_id] [int] NULL,
	[variants] [nvarchar](max) NULL,
 CONSTRAINT [PK_anexos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[beneficios]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
 CONSTRAINT [PK_beneficios] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[beneficios_valores_personalizados]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
 CONSTRAINT [PK_beneficios_valores_personalizados] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_beneficios_valores] UNIQUE NONCLUSTERED 
(
	[beneficio_id] ASC,
	[codigo_campo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[categorias_conteudo]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[categorias_conteudo](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [nvarchar](100) NOT NULL,
	[slug] [nvarchar](100) NOT NULL,
	[descricao] [nvarchar](500) NULL,
	[cor] [nvarchar](20) NULL,
	[icone] [nvarchar](50) NULL,
	[ordem] [int] NOT NULL,
	[ativo] [bit] NOT NULL,
	[categoria_pai_id] [int] NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_categorias_conteudo] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_categorias_conteudo_slug] UNIQUE NONCLUSTERED 
(
	[slug] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[clientes]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[clientes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[empresa_id] [int] NOT NULL,
	[num_cliente] [nvarchar](50) NULL,
	[segmento] [nvarchar](100) NULL,
	[setor_atividade] [nvarchar](100) NULL,
	[codigo_cae] [nvarchar](20) NULL,
	[condicoes_pagamento] [nvarchar](100) NULL,
	[metodo_pagamento_preferido] [nvarchar](50) NULL,
	[limite_credito] [decimal](15, 2) NULL,
	[desconto_comercial] [decimal](5, 2) NULL,
	[dia_vencimento_preferido] [int] NULL,
	[rating] [int] NULL,
	[estado] [nvarchar](50) NULL,
	[motivo_bloqueio] [nvarchar](500) NULL,
	[data_bloqueio] [datetime2](7) NULL,
	[gestor_conta_id] [int] NULL,
	[total_compras] [decimal](15, 2) NULL,
	[data_primeira_compra] [datetime2](7) NULL,
	[data_ultima_compra] [datetime2](7) NULL,
	[num_encomendas] [int] NULL,
	[pessoa_contacto] [nvarchar](255) NULL,
	[cargo_contacto] [nvarchar](100) NULL,
	[email_contacto] [nvarchar](255) NULL,
	[telefone_contacto] [nvarchar](50) NULL,
	[observacoes] [nvarchar](max) NULL,
	[tags] [nvarchar](500) NULL,
	[origem] [nvarchar](100) NULL,
	[ref_externa] [nvarchar](100) NULL,
	[id_phc] [nvarchar](50) NULL,
	[sincronizado_phc] [bit] NULL,
	[ultima_sincronizacao] [datetime2](7) NULL,
	[ativo] [bit] NOT NULL,
	[criado_por] [int] NULL,
	[atualizado_por] [int] NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_clientes] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_clientes_empresa_id] UNIQUE NONCLUSTERED 
(
	[empresa_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_clientes_num_cliente] UNIQUE NONCLUSTERED 
(
	[num_cliente] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[comentarios]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[comentarios](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[conteudo_id] [int] NOT NULL,
	[utilizador_id] [int] NULL,
	[comentario_pai_id] [int] NULL,
	[autor_nome] [nvarchar](100) NULL,
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
 CONSTRAINT [PK_comentarios] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[configuracoes]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[configuracoes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[codigo] [nvarchar](50) NOT NULL,
	[descricao] [nvarchar](100) NOT NULL,
	[valor] [nvarchar](max) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[contatos]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[contatos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[funcionario_id] [int] NOT NULL,
	[tipo] [nvarchar](20) NOT NULL,
	[valor] [nvarchar](255) NOT NULL,
	[principal] [bit] NOT NULL,
	[observacoes] [nvarchar](500) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_contatos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[conteudo_anexo]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[conteudo_anexo](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[conteudo_id] [int] NOT NULL,
	[anexo_id] [int] NOT NULL,
	[tipo_anexo] [nvarchar](20) NOT NULL,
	[legenda] [nvarchar](500) NULL,
	[ordem] [int] NOT NULL,
	[principal] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_conteudo_anexo] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[conteudo_tag]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[conteudo_tag](
	[conteudo_id] [int] NOT NULL,
	[tag_id] [int] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_conteudo_tag] PRIMARY KEY CLUSTERED 
(
	[conteudo_id] ASC,
	[tag_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[conteudos_favoritos]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[conteudos_favoritos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[conteudo_id] [int] NOT NULL,
	[utilizador_id] [int] NOT NULL,
	[notas] [nvarchar](500) NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_conteudos_favoritos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_conteudos_favoritos] UNIQUE NONCLUSTERED 
(
	[conteudo_id] ASC,
	[utilizador_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[conteudos_valores_personalizados]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
 CONSTRAINT [PK_conteudos_valores_personalizados] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_conteudos_valores] UNIQUE NONCLUSTERED 
(
	[conteudo_id] ASC,
	[codigo_campo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[conteudos_visualizacoes]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[conteudos_visualizacoes](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[conteudo_id] [int] NOT NULL,
	[utilizador_id] [int] NULL,
	[ip_address] [nvarchar](50) NULL,
	[user_agent] [nvarchar](500) NULL,
	[referer] [nvarchar](500) NULL,
	[tempo_leitura_segundos] [int] NULL,
	[visualizado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_conteudos_visualizacoes] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[dependentes]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
 CONSTRAINT [PK_dependentes] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[documentos]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[anexo_url] [nvarchar](255) NULL,
 CONSTRAINT [PK_documentos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[documentos_valores_personalizados]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
 CONSTRAINT [PK_documentos_valores_personalizados] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_documentos_valores] UNIQUE NONCLUSTERED 
(
	[documento_id] ASC,
	[codigo_campo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[empregos]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[empregos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[funcionario_id] [int] NOT NULL,
	[empresa] [nvarchar](255) NULL,
	[data_admissao] [date] NOT NULL,
	[data_inicio] [date] NOT NULL,
	[data_fim] [date] NULL,
	[tipo_contrato] [nvarchar](30) NULL,
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
 CONSTRAINT [PK_empregos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[empregos_valores_personalizados]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
 CONSTRAINT [PK_empregos_valores_personalizados] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_empregos_valores] UNIQUE NONCLUSTERED 
(
	[emprego_id] ASC,
	[codigo_campo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[enderecos]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
 CONSTRAINT [PK_enderecos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[equipamentos_valores_personalizados]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
 CONSTRAINT [PK_equipamentos_valores_personalizados] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_equipamentos_valores] UNIQUE NONCLUSTERED 
(
	[equipamento_id] ASC,
	[codigo_campo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[fornecedores]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[fornecedores](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[empresa_id] [int] NOT NULL,
	[num_fornecedor] [nvarchar](50) NULL,
	[segmento] [nvarchar](100) NULL,
	[setor_atividade] [nvarchar](100) NULL,
	[tipo_fornecedor] [nvarchar](50) NULL,
	[produtos_servicos] [nvarchar](500) NULL,
	[condicoes_pagamento] [nvarchar](100) NULL,
	[metodo_pagamento_preferido] [nvarchar](50) NULL,
	[dia_pagamento_preferido] [int] NULL,
	[iban] [nvarchar](50) NULL,
	[swift_bic] [nvarchar](20) NULL,
	[banco] [nvarchar](100) NULL,
	[prazo_entrega_dias] [int] NULL,
	[prazo_entrega_minimo] [int] NULL,
	[prazo_entrega_maximo] [int] NULL,
	[metodo_envio_preferido] [nvarchar](100) NULL,
	[morada_recolha] [nvarchar](500) NULL,
	[horario_entrega] [nvarchar](200) NULL,
	[rating_qualidade] [int] NULL,
	[rating_pontualidade] [int] NULL,
	[rating_preco] [int] NULL,
	[certificacoes] [nvarchar](500) NULL,
	[estado] [nvarchar](50) NULL,
	[motivo_bloqueio] [nvarchar](500) NULL,
	[data_bloqueio] [datetime2](7) NULL,
	[requer_aprovacao] [bit] NULL,
	[comprador_responsavel_id] [int] NULL,
	[total_compras] [decimal](15, 2) NULL,
	[data_primeira_compra] [datetime2](7) NULL,
	[data_ultima_compra] [datetime2](7) NULL,
	[num_encomendas] [int] NULL,
	[num_reclamacoes] [int] NULL,
	[pessoa_contacto] [nvarchar](255) NULL,
	[cargo_contacto] [nvarchar](100) NULL,
	[email_contacto] [nvarchar](255) NULL,
	[telefone_contacto] [nvarchar](50) NULL,
	[observacoes] [nvarchar](max) NULL,
	[tags] [nvarchar](500) NULL,
	[contrato_anexo_url] [nvarchar](500) NULL,
	[data_inicio_contrato] [datetime2](7) NULL,
	[data_fim_contrato] [datetime2](7) NULL,
	[ref_externa] [nvarchar](100) NULL,
	[id_phc] [nvarchar](50) NULL,
	[sincronizado_phc] [bit] NULL,
	[ultima_sincronizacao] [datetime2](7) NULL,
	[ativo] [bit] NOT NULL,
	[criado_por] [int] NULL,
	[atualizado_por] [int] NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_fornecedores] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_fornecedores_empresa_id] UNIQUE NONCLUSTERED 
(
	[empresa_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_fornecedores_num_fornecedor] UNIQUE NONCLUSTERED 
(
	[num_fornecedor] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[funcionarios_valores_personalizados]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
 CONSTRAINT [PK_funcionarios_valores_personalizados] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_funcionarios_valores] UNIQUE NONCLUSTERED 
(
	[funcionario_id] ASC,
	[codigo_campo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[grupo_permissao]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[grupo_permissao](
	[grupo_id] [int] NOT NULL,
	[permissao_id] [int] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_grupo_permissao] PRIMARY KEY CLUSTERED 
(
	[grupo_id] ASC,
	[permissao_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[grupo_utilizador]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[grupo_utilizador](
	[grupo_id] [int] NOT NULL,
	[utilizador_id] [int] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_grupo_utilizador] PRIMARY KEY CLUSTERED 
(
	[grupo_id] ASC,
	[utilizador_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[grupos]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[grupos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [nvarchar](255) NOT NULL,
	[descricao] [nvarchar](500) NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_grupos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[intervencoes_anexos]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[intervencoes_anexos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[intervencao_id] [int] NOT NULL,
	[anexo_id] [int] NOT NULL,
	[tipo_documento] [nvarchar](50) NOT NULL,
	[descricao] [nvarchar](255) NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_intervencoes_anexos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[intervencoes_custos]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[intervencoes_custos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[intervencao_id] [int] NOT NULL,
	[descricao] [nvarchar](255) NOT NULL,
	[codigo] [nvarchar](100) NULL,
	[quantidade] [int] NOT NULL,
	[valor_unitario] [decimal](18, 2) NULL,
	[valor_total] [decimal](18, 2) NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[anexo_url] [nvarchar](255) NULL,
	[fornecedor_id] [int] NULL,
 CONSTRAINT [PK_intervencoes_pecas] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[permissoes]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[permissoes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[codigo] [nvarchar](100) NOT NULL,
	[nome] [nvarchar](255) NOT NULL,
	[descricao] [nvarchar](500) NULL,
	[modulo] [nvarchar](50) NOT NULL,
	[tipo] [nvarchar](20) NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_permissoes] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_permissoes_codigo] UNIQUE NONCLUSTERED 
(
	[codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tags]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tags](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [nvarchar](50) NOT NULL,
	[slug] [nvarchar](50) NOT NULL,
	[cor] [nvarchar](20) NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_tags] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_tags_slug] UNIQUE NONCLUSTERED 
(
	[slug] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tickets_historico]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
 CONSTRAINT [PK_tickets_historico] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tipos_conteudo]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
	[template_visualizacao] [nvarchar](100) NULL,
	[configuracao_campos] [nvarchar](max) NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[cor] [nvarchar](20) NULL,
 CONSTRAINT [PK_tipos_conteudo] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_tipos_conteudo_codigo] UNIQUE NONCLUSTERED 
(
	[codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tipos_funcionarios]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tipos_funcionarios](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[codigo] [nvarchar](50) NOT NULL,
	[nome] [nvarchar](100) NOT NULL,
	[descricao] [nvarchar](500) NULL,
	[cor] [nvarchar](20) NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
	[icone] [nvarchar](100) NULL,
 CONSTRAINT [PK_tipos_funcionarios] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_tipos_funcionarios_codigo] UNIQUE NONCLUSTERED 
(
	[codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[utilizador_permissao]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[utilizador_permissao](
	[utilizador_id] [int] NOT NULL,
	[permissao_id] [int] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_utilizador_permissao] PRIMARY KEY CLUSTERED 
(
	[utilizador_id] ASC,
	[permissao_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[veiculos_valores_personalizados]    Script Date: 28/10/2025 11:43:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
 CONSTRAINT [PK_veiculos_valores_personalizados] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_veiculos_valores] UNIQUE NONCLUSTERED 
(
	[veiculo_id] ASC,
	[codigo_campo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Index [IX_categorias_conteudo_pai]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_categorias_conteudo_pai] ON [dbo].[categorias_conteudo]
(
	[categoria_pai_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_categorias_conteudo_slug]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_categorias_conteudo_slug] ON [dbo].[categorias_conteudo]
(
	[slug] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_clientes_estado]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_clientes_estado] ON [dbo].[clientes]
(
	[estado] ASC
)
WHERE ([estado] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_clientes_id_phc]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_clientes_id_phc] ON [dbo].[clientes]
(
	[id_phc] ASC
)
WHERE ([id_phc] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_clientes_num_cliente]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_clientes_num_cliente] ON [dbo].[clientes]
(
	[num_cliente] ASC
)
WHERE ([num_cliente] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_clientes_segmento]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_clientes_segmento] ON [dbo].[clientes]
(
	[segmento] ASC
)
WHERE ([segmento] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_comentarios_aprovado]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_comentarios_aprovado] ON [dbo].[comentarios]
(
	[aprovado] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_comentarios_conteudo]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_comentarios_conteudo] ON [dbo].[comentarios]
(
	[conteudo_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_comentarios_pai]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_comentarios_pai] ON [dbo].[comentarios]
(
	[comentario_pai_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_configuracoes_codigo]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_configuracoes_codigo] ON [dbo].[configuracoes]
(
	[codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudo_anexo_conteudo]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_conteudo_anexo_conteudo] ON [dbo].[conteudo_anexo]
(
	[conteudo_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_conteudo_anexo_tipo]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_conteudo_anexo_tipo] ON [dbo].[conteudo_anexo]
(
	[tipo_anexo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudos_autor]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_autor] ON [dbo].[conteudos]
(
	[autor_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudos_categoria]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_categoria] ON [dbo].[conteudos]
(
	[categoria_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudos_empresa]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_empresa] ON [dbo].[conteudos]
(
	[empresa_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudos_publicado]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_publicado] ON [dbo].[conteudos]
(
	[publicado_em] DESC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_conteudos_slug]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_slug] ON [dbo].[conteudos]
(
	[slug] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_conteudos_status]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_status] ON [dbo].[conteudos]
(
	[status] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudos_tipo]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_tipo] ON [dbo].[conteudos]
(
	[tipo_conteudo_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_conteudos_visibilidade]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_visibilidade] ON [dbo].[conteudos]
(
	[visibilidade] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudos_valores_conteudo]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_valores_conteudo] ON [dbo].[conteudos_valores_personalizados]
(
	[conteudo_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudos_visualizacoes_conteudo]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_visualizacoes_conteudo] ON [dbo].[conteudos_visualizacoes]
(
	[conteudo_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudos_visualizacoes_data]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_visualizacoes_data] ON [dbo].[conteudos_visualizacoes]
(
	[visualizado_em] DESC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_empregos_funcionario]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_empregos_funcionario] ON [dbo].[empregos]
(
	[funcionario_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_empregos_situacao]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_empregos_situacao] ON [dbo].[empregos]
(
	[situacao] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_empresas_ativo]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_empresas_ativo] ON [dbo].[empresas]
(
	[ativo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_empresas_codigo]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_empresas_codigo] ON [dbo].[empresas]
(
	[codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_empresas_email]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_empresas_email] ON [dbo].[empresas]
(
	[email] ASC
)
WHERE ([email] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_empresas_estado]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_empresas_estado] ON [dbo].[empresas]
(
	[estado] ASC
)
WHERE ([estado] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_empresas_nif]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_empresas_nif] ON [dbo].[empresas]
(
	[nif] ASC
)
WHERE ([nif] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_empresas_num_cliente]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_empresas_num_cliente] ON [dbo].[empresas]
(
	[num_cliente] ASC
)
WHERE ([num_cliente] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_empresas_ref_externa]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_empresas_ref_externa] ON [dbo].[empresas]
(
	[ref_externa] ASC
)
WHERE ([ref_externa] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_empresas_tipo]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_empresas_tipo] ON [dbo].[empresas]
(
	[tipo_empresa] ASC
)
WHERE ([tipo_empresa] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_equipamentos_empresa]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_equipamentos_empresa] ON [dbo].[equipamentos]
(
	[empresa_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_equipamentos_estado]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_equipamentos_estado] ON [dbo].[equipamentos]
(
	[estado] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_equipamentos_modelo]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_equipamentos_modelo] ON [dbo].[equipamentos]
(
	[modelo_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_equipamentos_numero_serie]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_equipamentos_numero_serie] ON [dbo].[equipamentos]
(
	[numero_serie] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_fornecedores_comprador]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_fornecedores_comprador] ON [dbo].[fornecedores]
(
	[comprador_responsavel_id] ASC
)
WHERE ([comprador_responsavel_id] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_fornecedores_estado]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_fornecedores_estado] ON [dbo].[fornecedores]
(
	[estado] ASC
)
WHERE ([estado] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_fornecedores_id_phc]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_fornecedores_id_phc] ON [dbo].[fornecedores]
(
	[id_phc] ASC
)
WHERE ([id_phc] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_fornecedores_num_fornecedor]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_fornecedores_num_fornecedor] ON [dbo].[fornecedores]
(
	[num_fornecedor] ASC
)
WHERE ([num_fornecedor] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_fornecedores_tipo]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_fornecedores_tipo] ON [dbo].[fornecedores]
(
	[tipo_fornecedor] ASC
)
WHERE ([tipo_fornecedor] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_funcionarios_empresa]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_funcionarios_empresa] ON [dbo].[funcionarios]
(
	[empresa_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_funcionarios_nome]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_funcionarios_nome] ON [dbo].[funcionarios]
(
	[nome_completo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_funcionarios_numero]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_funcionarios_numero] ON [dbo].[funcionarios]
(
	[numero] ASC
)
WHERE ([numero] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_funcionarios_tipo]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_funcionarios_tipo] ON [dbo].[funcionarios]
(
	[tipo_funcionario_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_funcionarios_valores_campo]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_funcionarios_valores_campo] ON [dbo].[funcionarios_valores_personalizados]
(
	[codigo_campo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_funcionarios_valores_funcionario]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_funcionarios_valores_funcionario] ON [dbo].[funcionarios_valores_personalizados]
(
	[funcionario_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_intervencoes_data_inicio]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_intervencoes_data_inicio] ON [dbo].[intervencoes]
(
	[data_inicio] DESC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_intervencoes_equipamento]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_intervencoes_equipamento] ON [dbo].[intervencoes]
(
	[equipamento_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_intervencoes_status]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_intervencoes_status] ON [dbo].[intervencoes]
(
	[status] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_intervencoes_ticket]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_intervencoes_ticket] ON [dbo].[intervencoes]
(
	[ticket_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_intervencoes_tipo]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_intervencoes_tipo] ON [dbo].[intervencoes]
(
	[tipo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_intervencoes_anexos_intervencao]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_intervencoes_anexos_intervencao] ON [dbo].[intervencoes_anexos]
(
	[intervencao_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_intervencoes_anexos_tipo]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_intervencoes_anexos_tipo] ON [dbo].[intervencoes_anexos]
(
	[tipo_documento] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_modelos_equipamento_categoria]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_modelos_equipamento_categoria] ON [dbo].[modelos_equipamento]
(
	[categoria_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_modelos_equipamento_marca]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_modelos_equipamento_marca] ON [dbo].[modelos_equipamento]
(
	[marca_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_tickets_atribuido]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_tickets_atribuido] ON [dbo].[tickets]
(
	[atribuido_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_tickets_data_abertura]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_tickets_data_abertura] ON [dbo].[tickets]
(
	[data_abertura] DESC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_tickets_prioridade]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_tickets_prioridade] ON [dbo].[tickets]
(
	[prioridade] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_tickets_solicitante]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_tickets_solicitante] ON [dbo].[tickets]
(
	[solicitante_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_tickets_status]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_tickets_status] ON [dbo].[tickets]
(
	[status] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_tickets_historico_ticket]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_tickets_historico_ticket] ON [dbo].[tickets_historico]
(
	[ticket_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_utilizadores_email]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_utilizadores_email] ON [dbo].[utilizadores]
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_utilizadores_funcionario]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_utilizadores_funcionario] ON [dbo].[utilizadores]
(
	[funcionario_id] ASC
)
WHERE ([funcionario_id] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_utilizadores_tipo]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_utilizadores_tipo] ON [dbo].[utilizadores]
(
	[tipo_utilizador] ASC
)
INCLUDE([cliente_id],[funcionario_id]) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_veiculos_empresa]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_veiculos_empresa] ON [dbo].[veiculos]
(
	[empresa_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_veiculos_matricula]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_veiculos_matricula] ON [dbo].[veiculos]
(
	[matricula] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_veiculos_numero_interno]    Script Date: 28/10/2025 11:43:52 ******/
CREATE NONCLUSTERED INDEX [IX_veiculos_numero_interno] ON [dbo].[veiculos]
(
	[numero_interno] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[anexos] ADD  CONSTRAINT [DF_anexos_principal]  DEFAULT ((0)) FOR [principal]
GO
ALTER TABLE [dbo].[anexos] ADD  CONSTRAINT [DF_anexos_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[anexos] ADD  CONSTRAINT [DF_anexos_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[beneficios] ADD  CONSTRAINT [DF_beneficios_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[beneficios] ADD  CONSTRAINT [DF_beneficios_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[beneficios] ADD  CONSTRAINT [DF_beneficios_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[beneficios_valores_personalizados] ADD  CONSTRAINT [DF_beneficios_valores_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[beneficios_valores_personalizados] ADD  CONSTRAINT [DF_beneficios_valores_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[categorias_conteudo] ADD  CONSTRAINT [DF_categorias_conteudo_ordem]  DEFAULT ((0)) FOR [ordem]
GO
ALTER TABLE [dbo].[categorias_conteudo] ADD  CONSTRAINT [DF_categorias_conteudo_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[categorias_conteudo] ADD  CONSTRAINT [DF_categorias_conteudo_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[categorias_conteudo] ADD  CONSTRAINT [DF_categorias_conteudo_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[categorias_equipamento] ADD  CONSTRAINT [DF_categorias_equipamento_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[categorias_equipamento] ADD  CONSTRAINT [DF_categorias_equipamento_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[categorias_equipamento] ADD  CONSTRAINT [DF_categorias_equipamento_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[clientes] ADD  DEFAULT ('ativo') FOR [estado]
GO
ALTER TABLE [dbo].[clientes] ADD  DEFAULT ((0)) FOR [total_compras]
GO
ALTER TABLE [dbo].[clientes] ADD  DEFAULT ((0)) FOR [num_encomendas]
GO
ALTER TABLE [dbo].[clientes] ADD  DEFAULT ((0)) FOR [sincronizado_phc]
GO
ALTER TABLE [dbo].[clientes] ADD  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[clientes] ADD  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[clientes] ADD  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[comentarios] ADD  CONSTRAINT [DF_comentarios_aprovado]  DEFAULT ((0)) FOR [aprovado]
GO
ALTER TABLE [dbo].[comentarios] ADD  CONSTRAINT [DF_comentarios_denuncias]  DEFAULT ((0)) FOR [denuncias]
GO
ALTER TABLE [dbo].[comentarios] ADD  CONSTRAINT [DF_comentarios_likes]  DEFAULT ((0)) FOR [likes]
GO
ALTER TABLE [dbo].[comentarios] ADD  CONSTRAINT [DF_comentarios_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[comentarios] ADD  CONSTRAINT [DF_comentarios_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[configuracoes] ADD  CONSTRAINT [DF_configuracoes_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[contatos] ADD  CONSTRAINT [DF_contatos_principal]  DEFAULT ((0)) FOR [principal]
GO
ALTER TABLE [dbo].[contatos] ADD  CONSTRAINT [DF_contatos_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[contatos] ADD  CONSTRAINT [DF_contatos_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[conteudo_anexo] ADD  CONSTRAINT [DF_conteudo_anexo_ordem]  DEFAULT ((0)) FOR [ordem]
GO
ALTER TABLE [dbo].[conteudo_anexo] ADD  CONSTRAINT [DF_conteudo_anexo_principal]  DEFAULT ((0)) FOR [principal]
GO
ALTER TABLE [dbo].[conteudo_anexo] ADD  CONSTRAINT [DF_conteudo_anexo_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[conteudo_tag] ADD  CONSTRAINT [DF_conteudo_tag_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[conteudos] ADD  CONSTRAINT [DF_conteudos_status]  DEFAULT ('rascunho') FOR [status]
GO
ALTER TABLE [dbo].[conteudos] ADD  CONSTRAINT [DF_conteudos_destaque]  DEFAULT ((0)) FOR [destaque]
GO
ALTER TABLE [dbo].[conteudos] ADD  CONSTRAINT [DF_conteudos_permite_comentarios]  DEFAULT ((1)) FOR [permite_comentarios]
GO
ALTER TABLE [dbo].[conteudos] ADD  CONSTRAINT [DF_conteudos_visualizacoes]  DEFAULT ((0)) FOR [visualizacoes]
GO
ALTER TABLE [dbo].[conteudos] ADD  CONSTRAINT [DF_conteudos_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[conteudos] ADD  CONSTRAINT [DF_conteudos_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[conteudos] ADD  DEFAULT ('privada') FOR [visibilidade]
GO
ALTER TABLE [dbo].[conteudos_favoritos] ADD  CONSTRAINT [DF_conteudos_favoritos_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[conteudos_valores_personalizados] ADD  CONSTRAINT [DF_conteudos_valores_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[conteudos_valores_personalizados] ADD  CONSTRAINT [DF_conteudos_valores_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[conteudos_visualizacoes] ADD  CONSTRAINT [DF_conteudos_visualizacoes_data]  DEFAULT (getdate()) FOR [visualizado_em]
GO
ALTER TABLE [dbo].[dependentes] ADD  CONSTRAINT [DF_dependentes_tem_condicao]  DEFAULT ((0)) FOR [tem_condicao_medica]
GO
ALTER TABLE [dbo].[dependentes] ADD  CONSTRAINT [DF_dependentes_dep_ir]  DEFAULT ((0)) FOR [dependente_ir]
GO
ALTER TABLE [dbo].[dependentes] ADD  CONSTRAINT [DF_dependentes_dep_saude]  DEFAULT ((0)) FOR [dependente_saude]
GO
ALTER TABLE [dbo].[dependentes] ADD  CONSTRAINT [DF_dependentes_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[dependentes] ADD  CONSTRAINT [DF_dependentes_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[documentos] ADD  CONSTRAINT [DF_documentos_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[documentos] ADD  CONSTRAINT [DF_documentos_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[documentos_valores_personalizados] ADD  CONSTRAINT [DF_documentos_valores_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[documentos_valores_personalizados] ADD  CONSTRAINT [DF_documentos_valores_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[empregos] ADD  CONSTRAINT [DF_empregos_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[empregos] ADD  CONSTRAINT [DF_empregos_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[empregos_valores_personalizados] ADD  CONSTRAINT [DF_empregos_valores_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[empregos_valores_personalizados] ADD  CONSTRAINT [DF_empregos_valores_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[empresas] ADD  CONSTRAINT [DF_empresas_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[empresas] ADD  CONSTRAINT [DF_empresas_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[empresas] ADD  CONSTRAINT [DF_empresas_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[empresas] ADD  DEFAULT ('Portugal') FOR [pais]
GO
ALTER TABLE [dbo].[empresas] ADD  DEFAULT ('ativo') FOR [estado]
GO
ALTER TABLE [dbo].[empresas] ADD  DEFAULT ((0)) FOR [sincronizado_phc]
GO
ALTER TABLE [dbo].[enderecos] ADD  CONSTRAINT [DF_enderecos_principal]  DEFAULT ((0)) FOR [principal]
GO
ALTER TABLE [dbo].[enderecos] ADD  CONSTRAINT [DF_enderecos_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[enderecos] ADD  CONSTRAINT [DF_enderecos_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[equipamentos] ADD  CONSTRAINT [DF_equipamentos_estado]  DEFAULT ('operacional') FOR [estado]
GO
ALTER TABLE [dbo].[equipamentos] ADD  CONSTRAINT [DF_equipamentos_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[equipamentos] ADD  CONSTRAINT [DF_equipamentos_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[equipamentos] ADD  CONSTRAINT [DF_equipamentos_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[equipamentos_valores_personalizados] ADD  CONSTRAINT [DF_equipamentos_valores_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[equipamentos_valores_personalizados] ADD  CONSTRAINT [DF_equipamentos_valores_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[fornecedores] ADD  DEFAULT ('ativo') FOR [estado]
GO
ALTER TABLE [dbo].[fornecedores] ADD  DEFAULT ((0)) FOR [requer_aprovacao]
GO
ALTER TABLE [dbo].[fornecedores] ADD  DEFAULT ((0)) FOR [total_compras]
GO
ALTER TABLE [dbo].[fornecedores] ADD  DEFAULT ((0)) FOR [num_encomendas]
GO
ALTER TABLE [dbo].[fornecedores] ADD  DEFAULT ((0)) FOR [num_reclamacoes]
GO
ALTER TABLE [dbo].[fornecedores] ADD  DEFAULT ((0)) FOR [sincronizado_phc]
GO
ALTER TABLE [dbo].[fornecedores] ADD  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[fornecedores] ADD  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[fornecedores] ADD  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[funcionarios] ADD  CONSTRAINT [DF_funcionarios_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[funcionarios] ADD  CONSTRAINT [DF_funcionarios_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[funcionarios] ADD  CONSTRAINT [DF_funcionarios_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[funcionarios_valores_personalizados] ADD  CONSTRAINT [DF_funcionarios_valores_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[funcionarios_valores_personalizados] ADD  CONSTRAINT [DF_funcionarios_valores_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[grupo_permissao] ADD  CONSTRAINT [DF_grupo_permissao_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[grupo_utilizador] ADD  CONSTRAINT [DF_grupo_utilizador_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[grupos] ADD  CONSTRAINT [DF_grupos_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[grupos] ADD  CONSTRAINT [DF_grupos_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[grupos] ADD  CONSTRAINT [DF_grupos_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[intervencoes] ADD  CONSTRAINT [DF_intervencoes_garantia]  DEFAULT ((0)) FOR [garantia]
GO
ALTER TABLE [dbo].[intervencoes] ADD  CONSTRAINT [DF_intervencoes_status]  DEFAULT ('agendada') FOR [status]
GO
ALTER TABLE [dbo].[intervencoes] ADD  CONSTRAINT [DF_intervencoes_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[intervencoes] ADD  CONSTRAINT [DF_intervencoes_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[intervencoes_anexos] ADD  CONSTRAINT [DF_intervencoes_anexos_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[intervencoes_custos] ADD  CONSTRAINT [DF_intervencoes_pecas_quantidade]  DEFAULT ((1)) FOR [quantidade]
GO
ALTER TABLE [dbo].[intervencoes_custos] ADD  CONSTRAINT [DF_intervencoes_pecas_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[marcas] ADD  CONSTRAINT [DF_marcas_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[marcas] ADD  CONSTRAINT [DF_marcas_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[marcas] ADD  CONSTRAINT [DF_marcas_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[modelos_equipamento] ADD  CONSTRAINT [DF_modelos_equipamento_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[modelos_equipamento] ADD  CONSTRAINT [DF_modelos_equipamento_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[modelos_equipamento] ADD  CONSTRAINT [DF_modelos_equipamento_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[permissoes] ADD  CONSTRAINT [DF_permissoes_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[tags] ADD  CONSTRAINT [DF_tags_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[tickets] ADD  CONSTRAINT [DF_tickets_prioridade]  DEFAULT ('media') FOR [prioridade]
GO
ALTER TABLE [dbo].[tickets] ADD  CONSTRAINT [DF_tickets_status]  DEFAULT ('aberto') FOR [status]
GO
ALTER TABLE [dbo].[tickets] ADD  CONSTRAINT [DF_tickets_data_abertura]  DEFAULT (getdate()) FOR [data_abertura]
GO
ALTER TABLE [dbo].[tickets] ADD  CONSTRAINT [DF_tickets_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[tickets] ADD  CONSTRAINT [DF_tickets_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[tickets_historico] ADD  CONSTRAINT [DF_tickets_historico_visivel_cliente]  DEFAULT ((1)) FOR [visivel_cliente]
GO
ALTER TABLE [dbo].[tickets_historico] ADD  CONSTRAINT [DF_tickets_historico_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[tipos_conteudo] ADD  CONSTRAINT [DF_tipos_conteudo_permite_comentarios]  DEFAULT ((1)) FOR [permite_comentarios]
GO
ALTER TABLE [dbo].[tipos_conteudo] ADD  CONSTRAINT [DF_tipos_conteudo_permite_anexos]  DEFAULT ((1)) FOR [permite_anexos]
GO
ALTER TABLE [dbo].[tipos_conteudo] ADD  CONSTRAINT [DF_tipos_conteudo_permite_galeria]  DEFAULT ((0)) FOR [permite_galeria]
GO
ALTER TABLE [dbo].[tipos_conteudo] ADD  CONSTRAINT [DF_tipos_conteudo_requer_aprovacao]  DEFAULT ((0)) FOR [requer_aprovacao]
GO
ALTER TABLE [dbo].[tipos_conteudo] ADD  CONSTRAINT [DF_tipos_conteudo_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[tipos_conteudo] ADD  CONSTRAINT [DF_tipos_conteudo_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[tipos_conteudo] ADD  CONSTRAINT [DF_tipos_conteudo_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[tipos_funcionarios] ADD  CONSTRAINT [DF_tipos_funcionarios_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[tipos_funcionarios] ADD  CONSTRAINT [DF_tipos_funcionarios_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[tipos_funcionarios] ADD  CONSTRAINT [DF_tipos_funcionarios_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[tipos_ticket] ADD  CONSTRAINT [DF_tipos_ticket_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[tipos_ticket] ADD  CONSTRAINT [DF_tipos_ticket_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[tipos_ticket] ADD  CONSTRAINT [DF_tipos_ticket_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[utilizador_empresa] ADD  CONSTRAINT [DF_utilizador_empresa_principal]  DEFAULT ((0)) FOR [empresa_principal]
GO
ALTER TABLE [dbo].[utilizador_empresa] ADD  CONSTRAINT [DF_utilizador_empresa_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[utilizador_permissao] ADD  CONSTRAINT [DF_utilizador_permissao_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[utilizadores] ADD  CONSTRAINT [DF_utilizadores_ativo]  DEFAULT ((1)) FOR [ativo]
GO
ALTER TABLE [dbo].[utilizadores] ADD  CONSTRAINT [DF_utilizadores_email_verificado]  DEFAULT ((0)) FOR [email_verificado]
GO
ALTER TABLE [dbo].[utilizadores] ADD  CONSTRAINT [DF_utilizadores_idioma]  DEFAULT ('pt') FOR [idioma]
GO
ALTER TABLE [dbo].[utilizadores] ADD  CONSTRAINT [DF_utilizadores_tema]  DEFAULT ('light') FOR [tema]
GO
ALTER TABLE [dbo].[utilizadores] ADD  CONSTRAINT [DF_utilizadores_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[utilizadores] ADD  CONSTRAINT [DF_utilizadores_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[utilizadores] ADD  DEFAULT ('interno') FOR [tipo_utilizador]
GO
ALTER TABLE [dbo].[veiculos] ADD  CONSTRAINT [DF_veiculos_em_circulacao]  DEFAULT ((1)) FOR [em_circulacao]
GO
ALTER TABLE [dbo].[veiculos] ADD  CONSTRAINT [DF_veiculos_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[veiculos] ADD  CONSTRAINT [DF_veiculos_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[veiculos_valores_personalizados] ADD  CONSTRAINT [DF_veiculos_valores_criado_em]  DEFAULT (getdate()) FOR [criado_em]
GO
ALTER TABLE [dbo].[veiculos_valores_personalizados] ADD  CONSTRAINT [DF_veiculos_valores_atualizado_em]  DEFAULT (getdate()) FOR [atualizado_em]
GO
ALTER TABLE [dbo].[anexos]  WITH CHECK ADD  CONSTRAINT [FK_anexos_utilizador] FOREIGN KEY([upload_por_id])
REFERENCES [dbo].[utilizadores] ([id])
GO
ALTER TABLE [dbo].[anexos] CHECK CONSTRAINT [FK_anexos_utilizador]
GO
ALTER TABLE [dbo].[beneficios]  WITH CHECK ADD  CONSTRAINT [FK_beneficios_funcionario] FOREIGN KEY([funcionario_id])
REFERENCES [dbo].[funcionarios] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[beneficios] CHECK CONSTRAINT [FK_beneficios_funcionario]
GO
ALTER TABLE [dbo].[beneficios_valores_personalizados]  WITH CHECK ADD  CONSTRAINT [FK_beneficios_valores_beneficio] FOREIGN KEY([beneficio_id])
REFERENCES [dbo].[beneficios] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[beneficios_valores_personalizados] CHECK CONSTRAINT [FK_beneficios_valores_beneficio]
GO
ALTER TABLE [dbo].[categorias_conteudo]  WITH CHECK ADD  CONSTRAINT [FK_categorias_conteudo_pai] FOREIGN KEY([categoria_pai_id])
REFERENCES [dbo].[categorias_conteudo] ([id])
GO
ALTER TABLE [dbo].[categorias_conteudo] CHECK CONSTRAINT [FK_categorias_conteudo_pai]
GO
ALTER TABLE [dbo].[categorias_equipamento]  WITH CHECK ADD  CONSTRAINT [FK_categorias_equipamento_pai] FOREIGN KEY([categoria_pai_id])
REFERENCES [dbo].[categorias_equipamento] ([id])
GO
ALTER TABLE [dbo].[categorias_equipamento] CHECK CONSTRAINT [FK_categorias_equipamento_pai]
GO
ALTER TABLE [dbo].[clientes]  WITH CHECK ADD  CONSTRAINT [FK_clientes_empresa] FOREIGN KEY([empresa_id])
REFERENCES [dbo].[empresas] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[clientes] CHECK CONSTRAINT [FK_clientes_empresa]
GO
ALTER TABLE [dbo].[comentarios]  WITH CHECK ADD  CONSTRAINT [FK_comentarios_aprovador] FOREIGN KEY([aprovado_por_id])
REFERENCES [dbo].[utilizadores] ([id])
GO
ALTER TABLE [dbo].[comentarios] CHECK CONSTRAINT [FK_comentarios_aprovador]
GO
ALTER TABLE [dbo].[comentarios]  WITH CHECK ADD  CONSTRAINT [FK_comentarios_conteudo] FOREIGN KEY([conteudo_id])
REFERENCES [dbo].[conteudos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[comentarios] CHECK CONSTRAINT [FK_comentarios_conteudo]
GO
ALTER TABLE [dbo].[comentarios]  WITH CHECK ADD  CONSTRAINT [FK_comentarios_pai] FOREIGN KEY([comentario_pai_id])
REFERENCES [dbo].[comentarios] ([id])
GO
ALTER TABLE [dbo].[comentarios] CHECK CONSTRAINT [FK_comentarios_pai]
GO
ALTER TABLE [dbo].[comentarios]  WITH CHECK ADD  CONSTRAINT [FK_comentarios_utilizador] FOREIGN KEY([utilizador_id])
REFERENCES [dbo].[utilizadores] ([id])
GO
ALTER TABLE [dbo].[comentarios] CHECK CONSTRAINT [FK_comentarios_utilizador]
GO
ALTER TABLE [dbo].[contatos]  WITH CHECK ADD  CONSTRAINT [FK_contatos_funcionario] FOREIGN KEY([funcionario_id])
REFERENCES [dbo].[funcionarios] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[contatos] CHECK CONSTRAINT [FK_contatos_funcionario]
GO
ALTER TABLE [dbo].[conteudo_anexo]  WITH CHECK ADD  CONSTRAINT [FK_conteudo_anexo_anexo] FOREIGN KEY([anexo_id])
REFERENCES [dbo].[anexos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[conteudo_anexo] CHECK CONSTRAINT [FK_conteudo_anexo_anexo]
GO
ALTER TABLE [dbo].[conteudo_anexo]  WITH CHECK ADD  CONSTRAINT [FK_conteudo_anexo_conteudo] FOREIGN KEY([conteudo_id])
REFERENCES [dbo].[conteudos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[conteudo_anexo] CHECK CONSTRAINT [FK_conteudo_anexo_conteudo]
GO
ALTER TABLE [dbo].[conteudo_tag]  WITH CHECK ADD  CONSTRAINT [FK_conteudo_tag_conteudo] FOREIGN KEY([conteudo_id])
REFERENCES [dbo].[conteudos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[conteudo_tag] CHECK CONSTRAINT [FK_conteudo_tag_conteudo]
GO
ALTER TABLE [dbo].[conteudo_tag]  WITH CHECK ADD  CONSTRAINT [FK_conteudo_tag_tag] FOREIGN KEY([tag_id])
REFERENCES [dbo].[tags] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[conteudo_tag] CHECK CONSTRAINT [FK_conteudo_tag_tag]
GO
ALTER TABLE [dbo].[conteudos]  WITH CHECK ADD  CONSTRAINT [FK_conteudos_aprovador] FOREIGN KEY([aprovado_por_id])
REFERENCES [dbo].[utilizadores] ([id])
GO
ALTER TABLE [dbo].[conteudos] CHECK CONSTRAINT [FK_conteudos_aprovador]
GO
ALTER TABLE [dbo].[conteudos]  WITH CHECK ADD  CONSTRAINT [FK_conteudos_autor] FOREIGN KEY([autor_id])
REFERENCES [dbo].[utilizadores] ([id])
GO
ALTER TABLE [dbo].[conteudos] CHECK CONSTRAINT [FK_conteudos_autor]
GO
ALTER TABLE [dbo].[conteudos]  WITH CHECK ADD  CONSTRAINT [FK_conteudos_categoria] FOREIGN KEY([categoria_id])
REFERENCES [dbo].[categorias_conteudo] ([id])
GO
ALTER TABLE [dbo].[conteudos] CHECK CONSTRAINT [FK_conteudos_categoria]
GO
ALTER TABLE [dbo].[conteudos]  WITH CHECK ADD  CONSTRAINT [FK_conteudos_empresa] FOREIGN KEY([empresa_id])
REFERENCES [dbo].[empresas] ([id])
GO
ALTER TABLE [dbo].[conteudos] CHECK CONSTRAINT [FK_conteudos_empresa]
GO
ALTER TABLE [dbo].[conteudos]  WITH CHECK ADD  CONSTRAINT [FK_conteudos_tipo] FOREIGN KEY([tipo_conteudo_id])
REFERENCES [dbo].[tipos_conteudo] ([id])
GO
ALTER TABLE [dbo].[conteudos] CHECK CONSTRAINT [FK_conteudos_tipo]
GO
ALTER TABLE [dbo].[conteudos_favoritos]  WITH CHECK ADD  CONSTRAINT [FK_conteudos_favoritos_conteudo] FOREIGN KEY([conteudo_id])
REFERENCES [dbo].[conteudos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[conteudos_favoritos] CHECK CONSTRAINT [FK_conteudos_favoritos_conteudo]
GO
ALTER TABLE [dbo].[conteudos_favoritos]  WITH CHECK ADD  CONSTRAINT [FK_conteudos_favoritos_utilizador] FOREIGN KEY([utilizador_id])
REFERENCES [dbo].[utilizadores] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[conteudos_favoritos] CHECK CONSTRAINT [FK_conteudos_favoritos_utilizador]
GO
ALTER TABLE [dbo].[conteudos_valores_personalizados]  WITH CHECK ADD  CONSTRAINT [FK_conteudos_valores_conteudo] FOREIGN KEY([conteudo_id])
REFERENCES [dbo].[conteudos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[conteudos_valores_personalizados] CHECK CONSTRAINT [FK_conteudos_valores_conteudo]
GO
ALTER TABLE [dbo].[conteudos_visualizacoes]  WITH CHECK ADD  CONSTRAINT [FK_conteudos_visualizacoes_conteudo] FOREIGN KEY([conteudo_id])
REFERENCES [dbo].[conteudos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[conteudos_visualizacoes] CHECK CONSTRAINT [FK_conteudos_visualizacoes_conteudo]
GO
ALTER TABLE [dbo].[conteudos_visualizacoes]  WITH CHECK ADD  CONSTRAINT [FK_conteudos_visualizacoes_utilizador] FOREIGN KEY([utilizador_id])
REFERENCES [dbo].[utilizadores] ([id])
GO
ALTER TABLE [dbo].[conteudos_visualizacoes] CHECK CONSTRAINT [FK_conteudos_visualizacoes_utilizador]
GO
ALTER TABLE [dbo].[dependentes]  WITH CHECK ADD  CONSTRAINT [FK_dependentes_funcionario] FOREIGN KEY([funcionario_id])
REFERENCES [dbo].[funcionarios] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[dependentes] CHECK CONSTRAINT [FK_dependentes_funcionario]
GO
ALTER TABLE [dbo].[documentos]  WITH CHECK ADD  CONSTRAINT [FK_documentos_funcionario] FOREIGN KEY([funcionario_id])
REFERENCES [dbo].[funcionarios] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[documentos] CHECK CONSTRAINT [FK_documentos_funcionario]
GO
ALTER TABLE [dbo].[documentos_valores_personalizados]  WITH CHECK ADD  CONSTRAINT [FK_documentos_valores_documento] FOREIGN KEY([documento_id])
REFERENCES [dbo].[documentos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[documentos_valores_personalizados] CHECK CONSTRAINT [FK_documentos_valores_documento]
GO
ALTER TABLE [dbo].[empregos]  WITH CHECK ADD  CONSTRAINT [FK_empregos_funcionario] FOREIGN KEY([funcionario_id])
REFERENCES [dbo].[funcionarios] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[empregos] CHECK CONSTRAINT [FK_empregos_funcionario]
GO
ALTER TABLE [dbo].[empregos_valores_personalizados]  WITH CHECK ADD  CONSTRAINT [FK_empregos_valores_emprego] FOREIGN KEY([emprego_id])
REFERENCES [dbo].[empregos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[empregos_valores_personalizados] CHECK CONSTRAINT [FK_empregos_valores_emprego]
GO
ALTER TABLE [dbo].[enderecos]  WITH CHECK ADD  CONSTRAINT [FK_enderecos_funcionario] FOREIGN KEY([funcionario_id])
REFERENCES [dbo].[funcionarios] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[enderecos] CHECK CONSTRAINT [FK_enderecos_funcionario]
GO
ALTER TABLE [dbo].[equipamentos_valores_personalizados]  WITH CHECK ADD  CONSTRAINT [FK_equipamentos_valores_equipamento] FOREIGN KEY([equipamento_id])
REFERENCES [dbo].[equipamentos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[equipamentos_valores_personalizados] CHECK CONSTRAINT [FK_equipamentos_valores_equipamento]
GO
ALTER TABLE [dbo].[fornecedores]  WITH CHECK ADD  CONSTRAINT [FK_fornecedores_comprador] FOREIGN KEY([comprador_responsavel_id])
REFERENCES [dbo].[funcionarios] ([id])
GO
ALTER TABLE [dbo].[fornecedores] CHECK CONSTRAINT [FK_fornecedores_comprador]
GO
ALTER TABLE [dbo].[fornecedores]  WITH CHECK ADD  CONSTRAINT [FK_fornecedores_empresa] FOREIGN KEY([empresa_id])
REFERENCES [dbo].[empresas] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[fornecedores] CHECK CONSTRAINT [FK_fornecedores_empresa]
GO
ALTER TABLE [dbo].[funcionarios]  WITH CHECK ADD  CONSTRAINT [FK_funcionarios_empresa] FOREIGN KEY([empresa_id])
REFERENCES [dbo].[empresas] ([id])
GO
ALTER TABLE [dbo].[funcionarios] CHECK CONSTRAINT [FK_funcionarios_empresa]
GO
ALTER TABLE [dbo].[funcionarios]  WITH CHECK ADD  CONSTRAINT [FK_funcionarios_tipo] FOREIGN KEY([tipo_funcionario_id])
REFERENCES [dbo].[tipos_funcionarios] ([id])
GO
ALTER TABLE [dbo].[funcionarios] CHECK CONSTRAINT [FK_funcionarios_tipo]
GO
ALTER TABLE [dbo].[funcionarios_valores_personalizados]  WITH CHECK ADD  CONSTRAINT [FK_funcionarios_valores_funcionario] FOREIGN KEY([funcionario_id])
REFERENCES [dbo].[funcionarios] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[funcionarios_valores_personalizados] CHECK CONSTRAINT [FK_funcionarios_valores_funcionario]
GO
ALTER TABLE [dbo].[grupo_permissao]  WITH CHECK ADD  CONSTRAINT [FK_grupo_permissao_grupo] FOREIGN KEY([grupo_id])
REFERENCES [dbo].[grupos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[grupo_permissao] CHECK CONSTRAINT [FK_grupo_permissao_grupo]
GO
ALTER TABLE [dbo].[grupo_permissao]  WITH CHECK ADD  CONSTRAINT [FK_grupo_permissao_permissao] FOREIGN KEY([permissao_id])
REFERENCES [dbo].[permissoes] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[grupo_permissao] CHECK CONSTRAINT [FK_grupo_permissao_permissao]
GO
ALTER TABLE [dbo].[grupo_utilizador]  WITH CHECK ADD  CONSTRAINT [FK_grupo_utilizador_grupo] FOREIGN KEY([grupo_id])
REFERENCES [dbo].[grupos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[grupo_utilizador] CHECK CONSTRAINT [FK_grupo_utilizador_grupo]
GO
ALTER TABLE [dbo].[grupo_utilizador]  WITH CHECK ADD  CONSTRAINT [FK_grupo_utilizador_utilizador] FOREIGN KEY([utilizador_id])
REFERENCES [dbo].[utilizadores] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[grupo_utilizador] CHECK CONSTRAINT [FK_grupo_utilizador_utilizador]
GO
ALTER TABLE [dbo].[intervencoes]  WITH CHECK ADD  CONSTRAINT [FK_intervencoes_equipamento] FOREIGN KEY([equipamento_id])
REFERENCES [dbo].[equipamentos] ([id])
GO
ALTER TABLE [dbo].[intervencoes] CHECK CONSTRAINT [FK_intervencoes_equipamento]
GO
ALTER TABLE [dbo].[intervencoes]  WITH CHECK ADD  CONSTRAINT [FK_intervencoes_tecnico] FOREIGN KEY([tecnico_id])
REFERENCES [dbo].[funcionarios] ([id])
GO
ALTER TABLE [dbo].[intervencoes] CHECK CONSTRAINT [FK_intervencoes_tecnico]
GO
ALTER TABLE [dbo].[intervencoes]  WITH CHECK ADD  CONSTRAINT [FK_intervencoes_ticket] FOREIGN KEY([ticket_id])
REFERENCES [dbo].[tickets] ([id])
GO
ALTER TABLE [dbo].[intervencoes] CHECK CONSTRAINT [FK_intervencoes_ticket]
GO
ALTER TABLE [dbo].[intervencoes_anexos]  WITH CHECK ADD  CONSTRAINT [FK_intervencoes_anexos_anexo] FOREIGN KEY([anexo_id])
REFERENCES [dbo].[anexos] ([id])
GO
ALTER TABLE [dbo].[intervencoes_anexos] CHECK CONSTRAINT [FK_intervencoes_anexos_anexo]
GO
ALTER TABLE [dbo].[intervencoes_anexos]  WITH CHECK ADD  CONSTRAINT [FK_intervencoes_anexos_intervencao] FOREIGN KEY([intervencao_id])
REFERENCES [dbo].[intervencoes] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[intervencoes_anexos] CHECK CONSTRAINT [FK_intervencoes_anexos_intervencao]
GO
ALTER TABLE [dbo].[intervencoes_custos]  WITH CHECK ADD  CONSTRAINT [FK_intervencoes_pecas_intervencao] FOREIGN KEY([intervencao_id])
REFERENCES [dbo].[intervencoes] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[intervencoes_custos] CHECK CONSTRAINT [FK_intervencoes_pecas_intervencao]
GO
ALTER TABLE [dbo].[modelos_equipamento]  WITH CHECK ADD  CONSTRAINT [FK_modelos_equipamento_categoria] FOREIGN KEY([categoria_id])
REFERENCES [dbo].[categorias_equipamento] ([id])
GO
ALTER TABLE [dbo].[modelos_equipamento] CHECK CONSTRAINT [FK_modelos_equipamento_categoria]
GO
ALTER TABLE [dbo].[modelos_equipamento]  WITH CHECK ADD  CONSTRAINT [FK_modelos_equipamento_marca] FOREIGN KEY([marca_id])
REFERENCES [dbo].[marcas] ([id])
GO
ALTER TABLE [dbo].[modelos_equipamento] CHECK CONSTRAINT [FK_modelos_equipamento_marca]
GO
ALTER TABLE [dbo].[tickets_historico]  WITH CHECK ADD  CONSTRAINT [FK_tickets_historico_ticket] FOREIGN KEY([ticket_id])
REFERENCES [dbo].[tickets] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[tickets_historico] CHECK CONSTRAINT [FK_tickets_historico_ticket]
GO
ALTER TABLE [dbo].[tickets_historico]  WITH CHECK ADD  CONSTRAINT [FK_tickets_historico_utilizador] FOREIGN KEY([utilizador_id])
REFERENCES [dbo].[utilizadores] ([id])
GO
ALTER TABLE [dbo].[tickets_historico] CHECK CONSTRAINT [FK_tickets_historico_utilizador]
GO
ALTER TABLE [dbo].[utilizador_empresa]  WITH CHECK ADD  CONSTRAINT [FK_utilizador_empresa_empresa] FOREIGN KEY([empresa_id])
REFERENCES [dbo].[empresas] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[utilizador_empresa] CHECK CONSTRAINT [FK_utilizador_empresa_empresa]
GO
ALTER TABLE [dbo].[utilizador_empresa]  WITH CHECK ADD  CONSTRAINT [FK_utilizador_empresa_utilizador] FOREIGN KEY([utilizador_id])
REFERENCES [dbo].[utilizadores] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[utilizador_empresa] CHECK CONSTRAINT [FK_utilizador_empresa_utilizador]
GO
ALTER TABLE [dbo].[utilizador_permissao]  WITH CHECK ADD  CONSTRAINT [FK_utilizador_permissao_permissao] FOREIGN KEY([permissao_id])
REFERENCES [dbo].[permissoes] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[utilizador_permissao] CHECK CONSTRAINT [FK_utilizador_permissao_permissao]
GO
ALTER TABLE [dbo].[utilizador_permissao]  WITH CHECK ADD  CONSTRAINT [FK_utilizador_permissao_utilizador] FOREIGN KEY([utilizador_id])
REFERENCES [dbo].[utilizadores] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[utilizador_permissao] CHECK CONSTRAINT [FK_utilizador_permissao_utilizador]
GO
ALTER TABLE [dbo].[utilizadores]  WITH CHECK ADD  CONSTRAINT [FK_utilizadores_cliente] FOREIGN KEY([cliente_id])
REFERENCES [dbo].[clientes] ([id])
GO
ALTER TABLE [dbo].[utilizadores] CHECK CONSTRAINT [FK_utilizadores_cliente]
GO
ALTER TABLE [dbo].[utilizadores]  WITH CHECK ADD  CONSTRAINT [FK_utilizadores_funcionario] FOREIGN KEY([funcionario_id])
REFERENCES [dbo].[funcionarios] ([id])
GO
ALTER TABLE [dbo].[utilizadores] CHECK CONSTRAINT [FK_utilizadores_funcionario]
GO
ALTER TABLE [dbo].[veiculos]  WITH CHECK ADD  CONSTRAINT [FK_veiculos_empresa] FOREIGN KEY([empresa_id])
REFERENCES [dbo].[empresas] ([id])
GO
ALTER TABLE [dbo].[veiculos] CHECK CONSTRAINT [FK_veiculos_empresa]
GO
ALTER TABLE [dbo].[veiculos_valores_personalizados]  WITH CHECK ADD  CONSTRAINT [FK_veiculos_valores_veiculo] FOREIGN KEY([veiculo_id])
REFERENCES [dbo].[veiculos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[veiculos_valores_personalizados] CHECK CONSTRAINT [FK_veiculos_valores_veiculo]
GO
ALTER TABLE [dbo].[anexos]  WITH CHECK ADD  CONSTRAINT [CHK_anexos_tipo] CHECK  (([tipo]='zip' OR [tipo]='csv' OR [tipo]='txt' OR [tipo]='xlsx' OR [tipo]='xls' OR [tipo]='docx' OR [tipo]='doc' OR [tipo]='pdf' OR [tipo]='png' OR [tipo]='jpeg' OR [tipo]='jpg'))
GO
ALTER TABLE [dbo].[anexos] CHECK CONSTRAINT [CHK_anexos_tipo]
GO
ALTER TABLE [dbo].[beneficios]  WITH CHECK ADD  CONSTRAINT [CHK_beneficios_tipo] CHECK  (([tipo]='Outro' OR [tipo]='Seguro de Vida' OR [tipo]='Plano Odontológico' OR [tipo]='Plano de Saúde' OR [tipo]='Vale Transporte' OR [tipo]='Vale Refeição' OR [tipo]='Vale Alimentação'))
GO
ALTER TABLE [dbo].[beneficios] CHECK CONSTRAINT [CHK_beneficios_tipo]
GO
ALTER TABLE [dbo].[clientes]  WITH CHECK ADD CHECK  (([rating]>=(1) AND [rating]<=(5)))
GO
ALTER TABLE [dbo].[contatos]  WITH CHECK ADD  CONSTRAINT [CHK_contatos_tipo] CHECK  (([tipo]='whatsapp' OR [tipo]='email' OR [tipo]='celular' OR [tipo]='telefone'))
GO
ALTER TABLE [dbo].[contatos] CHECK CONSTRAINT [CHK_contatos_tipo]
GO
ALTER TABLE [dbo].[conteudo_anexo]  WITH CHECK ADD  CONSTRAINT [CHK_conteudo_anexo_tipo] CHECK  (([tipo_anexo]='outro' OR [tipo_anexo]='audio' OR [tipo_anexo]='documento' OR [tipo_anexo]='video' OR [tipo_anexo]='imagem'))
GO
ALTER TABLE [dbo].[conteudo_anexo] CHECK CONSTRAINT [CHK_conteudo_anexo_tipo]
GO
ALTER TABLE [dbo].[conteudos]  WITH CHECK ADD  CONSTRAINT [CHK_conteudos_status] CHECK  (([status]='em_revisao' OR [status]='agendado' OR [status]='arquivado' OR [status]='publicado' OR [status]='rascunho'))
GO
ALTER TABLE [dbo].[conteudos] CHECK CONSTRAINT [CHK_conteudos_status]
GO
ALTER TABLE [dbo].[conteudos]  WITH CHECK ADD  CONSTRAINT [CHK_conteudos_visibilidade] CHECK  (([visibilidade]='grupo_empresas' OR [visibilidade]='publica' OR [visibilidade]='privada'))
GO
ALTER TABLE [dbo].[conteudos] CHECK CONSTRAINT [CHK_conteudos_visibilidade]
GO
ALTER TABLE [dbo].[dependentes]  WITH CHECK ADD  CONSTRAINT [CHK_dependentes_parentesco] CHECK  (([parentesco]='Outro' OR [parentesco]='Irmã' OR [parentesco]='Irmão' OR [parentesco]='Mãe' OR [parentesco]='Pai' OR [parentesco]='Cônjuge' OR [parentesco]='Filha' OR [parentesco]='Filho'))
GO
ALTER TABLE [dbo].[dependentes] CHECK CONSTRAINT [CHK_dependentes_parentesco]
GO
ALTER TABLE [dbo].[empresas]  WITH CHECK ADD CHECK  (([rating]>=(1) AND [rating]<=(5)))
GO
ALTER TABLE [dbo].[enderecos]  WITH CHECK ADD  CONSTRAINT [CHK_enderecos_tipo] CHECK  (([tipo]='correspondencia' OR [tipo]='comercial' OR [tipo]='residencial'))
GO
ALTER TABLE [dbo].[enderecos] CHECK CONSTRAINT [CHK_enderecos_tipo]
GO
ALTER TABLE [dbo].[equipamentos]  WITH CHECK ADD  CONSTRAINT [CHK_equipamentos_estado] CHECK  (([estado]='em_transito' OR [estado]='reserva' OR [estado]='baixa' OR [estado]='avariado' OR [estado]='manutencao' OR [estado]='operacional'))
GO
ALTER TABLE [dbo].[equipamentos] CHECK CONSTRAINT [CHK_equipamentos_estado]
GO
ALTER TABLE [dbo].[fornecedores]  WITH CHECK ADD CHECK  (([rating_qualidade]>=(1) AND [rating_qualidade]<=(5)))
GO
ALTER TABLE [dbo].[fornecedores]  WITH CHECK ADD CHECK  (([rating_pontualidade]>=(1) AND [rating_pontualidade]<=(5)))
GO
ALTER TABLE [dbo].[fornecedores]  WITH CHECK ADD CHECK  (([rating_preco]>=(1) AND [rating_preco]<=(5)))
GO
ALTER TABLE [dbo].[funcionarios]  WITH CHECK ADD  CONSTRAINT [CHK_funcionarios_estado_civil] CHECK  (([estado_civil]='União de Facto' OR [estado_civil]='Viúvo(a)' OR [estado_civil]='Divorciado(a)' OR [estado_civil]='Casado(a)' OR [estado_civil]='Solteiro(a)'))
GO
ALTER TABLE [dbo].[funcionarios] CHECK CONSTRAINT [CHK_funcionarios_estado_civil]
GO
ALTER TABLE [dbo].[funcionarios]  WITH CHECK ADD  CONSTRAINT [CHK_funcionarios_sexo] CHECK  (([sexo]='O' OR [sexo]='F' OR [sexo]='M'))
GO
ALTER TABLE [dbo].[funcionarios] CHECK CONSTRAINT [CHK_funcionarios_sexo]
GO
ALTER TABLE [dbo].[intervencoes]  WITH CHECK ADD  CONSTRAINT [CHK_intervencoes_status] CHECK  (([status]='cancelada' OR [status]='concluida' OR [status]='em_andamento' OR [status]='agendada'))
GO
ALTER TABLE [dbo].[intervencoes] CHECK CONSTRAINT [CHK_intervencoes_status]
GO
ALTER TABLE [dbo].[intervencoes]  WITH CHECK ADD  CONSTRAINT [CHK_intervencoes_tipo] CHECK  (([tipo]='upgrade' OR [tipo]='configuracao' OR [tipo]='instalacao' OR [tipo]='preditiva' OR [tipo]='preventiva' OR [tipo]='corretiva'))
GO
ALTER TABLE [dbo].[intervencoes] CHECK CONSTRAINT [CHK_intervencoes_tipo]
GO
ALTER TABLE [dbo].[intervencoes_anexos]  WITH CHECK ADD  CONSTRAINT [CHK_intervencoes_anexos_tipo] CHECK  (([tipo_documento]='outro' OR [tipo_documento]='manual' OR [tipo_documento]='foto_depois' OR [tipo_documento]='foto_antes' OR [tipo_documento]='relatorio' OR [tipo_documento]='certificado' OR [tipo_documento]='orcamento' OR [tipo_documento]='fatura'))
GO
ALTER TABLE [dbo].[intervencoes_anexos] CHECK CONSTRAINT [CHK_intervencoes_anexos_tipo]
GO
ALTER TABLE [dbo].[permissoes]  WITH CHECK ADD  CONSTRAINT [CHK_permissoes_tipo] CHECK  (([tipo]='Outro' OR [tipo]='Concluir' OR [tipo]='Atribuir' OR [tipo]='Aprovar' OR [tipo]='Importar' OR [tipo]='Exportar' OR [tipo]='Apagar' OR [tipo]='Editar' OR [tipo]='Visualizar' OR [tipo]='Listar' OR [tipo]='Criar'))
GO
ALTER TABLE [dbo].[permissoes] CHECK CONSTRAINT [CHK_permissoes_tipo]
GO
ALTER TABLE [dbo].[tickets]  WITH CHECK ADD  CONSTRAINT [CHK_tickets_avaliacao] CHECK  (([avaliacao] IS NULL OR [avaliacao]>=(1) AND [avaliacao]<=(5)))
GO
ALTER TABLE [dbo].[tickets] CHECK CONSTRAINT [CHK_tickets_avaliacao]
GO
ALTER TABLE [dbo].[tickets]  WITH CHECK ADD  CONSTRAINT [CHK_tickets_prioridade] CHECK  (([prioridade]='urgente' OR [prioridade]='alta' OR [prioridade]='media' OR [prioridade]='baixa'))
GO
ALTER TABLE [dbo].[tickets] CHECK CONSTRAINT [CHK_tickets_prioridade]
GO
ALTER TABLE [dbo].[tickets]  WITH CHECK ADD  CONSTRAINT [CHK_tickets_status] CHECK  (([status]='cancelado' OR [status]='fechado' OR [status]='resolvido' OR [status]='aguardando_cliente' OR [status]='aguardando_peca' OR [status]='em_andamento' OR [status]='aberto'))
GO
ALTER TABLE [dbo].[tickets] CHECK CONSTRAINT [CHK_tickets_status]
GO
ALTER TABLE [dbo].[tickets_historico]  WITH CHECK ADD  CONSTRAINT [CHK_tickets_historico_tipo] CHECK  (([tipo_acao]='avaliacao' OR [tipo_acao]='anexo_adicionado' OR [tipo_acao]='atribuicao' OR [tipo_acao]='prioridade_alterada' OR [tipo_acao]='status_alterado' OR [tipo_acao]='comentario'))
GO
ALTER TABLE [dbo].[tickets_historico] CHECK CONSTRAINT [CHK_tickets_historico_tipo]
GO
ALTER TABLE [dbo].[utilizadores]  WITH CHECK ADD CHECK  (([tipo_utilizador]='fornecedor' OR [tipo_utilizador]='cliente' OR [tipo_utilizador]='interno'))
GO
ALTER TABLE [dbo].[veiculos]  WITH CHECK ADD  CONSTRAINT [CHK_veiculos_combustivel] CHECK  (([combustivel]='Outro' OR [combustivel]='GPL' OR [combustivel]='GNC' OR [combustivel]='Híbrido' OR [combustivel]='Elétrico' OR [combustivel]='Diesel' OR [combustivel]='Gasolina'))
GO
ALTER TABLE [dbo].[veiculos] CHECK CONSTRAINT [CHK_veiculos_combustivel]
GO
ALTER TABLE [dbo].[veiculos]  WITH CHECK ADD  CONSTRAINT [CHK_veiculos_tipo] CHECK  (([tipo]='Outro' OR [tipo]='Moto' OR [tipo]='Ligeiro' OR [tipo]='Autocarro'))
GO
ALTER TABLE [dbo].[veiculos] CHECK CONSTRAINT [CHK_veiculos_tipo]
GO
USE [master]
GO
ALTER DATABASE [ceo_tenant_microlopes] SET  READ_WRITE 
GO
