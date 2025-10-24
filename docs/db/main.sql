ALTER DATABASE [ceo_tenant_larevangelico] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [ceo_tenant_larevangelico].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET ARITHABORT OFF 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET  DISABLE_BROKER 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET RECOVERY FULL 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET  MULTI_USER 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET DB_CHAINING OFF 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'ceo_tenant_larevangelico', N'ON'
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET QUERY_STORE = ON
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [ceo_tenant_larevangelico]
GO
/****** Object:  Table [dbo].[tipos_ticket]    Script Date: 23/10/2025 18:15:27 ******/
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
/****** Object:  Table [dbo].[tickets]    Script Date: 23/10/2025 18:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
 CONSTRAINT [PK_tickets] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[utilizadores]    Script Date: 23/10/2025 18:15:27 ******/
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
 CONSTRAINT [PK_utilizadores] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[empresas]    Script Date: 23/10/2025 18:15:27 ******/
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
 CONSTRAINT [PK_empresas] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[vw_TicketsAbertos]    Script Date: 23/10/2025 18:15:27 ******/
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
/****** Object:  Table [dbo].[veiculos]    Script Date: 23/10/2025 18:15:27 ******/
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
/****** Object:  Table [dbo].[conteudos]    Script Date: 23/10/2025 18:15:27 ******/
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
    [variants] [nvarchar](MAX) NULL
 CONSTRAINT [PK_conteudos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[utilizador_empresa]    Script Date: 23/10/2025 18:15:27 ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[funcionarios]    Script Date: 23/10/2025 18:15:27 ******/
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
/****** Object:  View [dbo].[vw_EstatisticasEmpresas]    Script Date: 23/10/2025 18:15:27 ******/
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
/****** Object:  Table [dbo].[marcas]    Script Date: 23/10/2025 18:15:27 ******/
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
 CONSTRAINT [PK_marcas] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[categorias_equipamento]    Script Date: 23/10/2025 18:15:27 ******/
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
/****** Object:  Table [dbo].[modelos_equipamento]    Script Date: 23/10/2025 18:15:27 ******/
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
	[imagem_url] [nvarchar](500) NULL,
	[manual_url] [nvarchar](500) NULL,
	[ativo] [bit] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_modelos_equipamento] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[equipamentos]    Script Date: 23/10/2025 18:15:27 ******/
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
 CONSTRAINT [PK_equipamentos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  View [dbo].[vw_EquipamentosManutencaoProxima]    Script Date: 23/10/2025 18:15:27 ******/
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
/****** Object:  View [dbo].[vw_EstatisticasTickets]    Script Date: 23/10/2025 18:15:27 ******/
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
/****** Object:  Table [dbo].[intervencoes]    Script Date: 23/10/2025 18:15:27 ******/
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
 CONSTRAINT [PK_intervencoes] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  View [dbo].[vw_CustosEquipamentos]    Script Date: 23/10/2025 18:15:27 ******/
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
/****** Object:  Table [dbo].[anexos]    Script Date: 23/10/2025 18:15:27 ******/
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
/****** Object:  Table [dbo].[beneficios]    Script Date: 23/10/2025 18:15:27 ******/
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
/****** Object:  Table [dbo].[beneficios_valores_personalizados]    Script Date: 23/10/2025 18:15:27 ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[categorias_conteudo]    Script Date: 23/10/2025 18:15:27 ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[comentarios]    Script Date: 23/10/2025 18:15:27 ******/
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
/****** Object:  Table [dbo].[contatos]    Script Date: 23/10/2025 18:15:27 ******/
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
/****** Object:  Table [dbo].[conteudo_anexo]    Script Date: 23/10/2025 18:15:27 ******/
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
/****** Object:  Table [dbo].[conteudo_empresa]    Script Date: 23/10/2025 18:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[conteudo_empresa](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[conteudo_id] [int] NOT NULL,
	[empresa_id] [int] NOT NULL,
	[criado_em] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_conteudo_empresa] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[conteudo_tag]    Script Date: 23/10/2025 18:15:27 ******/
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
/****** Object:  Table [dbo].[conteudos_favoritos]    Script Date: 23/10/2025 18:15:27 ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[conteudos_valores_personalizados]    Script Date: 23/10/2025 18:15:27 ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[conteudos_visualizacoes]    Script Date: 23/10/2025 18:15:27 ******/
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
/****** Object:  Table [dbo].[dependentes]    Script Date: 23/10/2025 18:15:27 ******/
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
/****** Object:  Table [dbo].[documentos]    Script Date: 23/10/2025 18:15:27 ******/
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
	[anexo_id] [int] NULL,
	[criado_em] [datetime2](7) NOT NULL,
	[atualizado_em] [datetime2](7) NULL,
 CONSTRAINT [PK_documentos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[documentos_valores_personalizados]    Script Date: 23/10/2025 18:15:27 ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[empregos]    Script Date: 23/10/2025 18:15:27 ******/
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
 CONSTRAINT [PK_empregos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[empregos_valores_personalizados]    Script Date: 23/10/2025 18:15:27 ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[enderecos]    Script Date: 23/10/2025 18:15:27 ******/
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
/****** Object:  Table [dbo].[equipamentos_valores_personalizados]    Script Date: 23/10/2025 18:15:27 ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[funcionarios_valores_personalizados]    Script Date: 23/10/2025 18:15:27 ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[grupo_permissao]    Script Date: 23/10/2025 18:15:27 ******/
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
/****** Object:  Table [dbo].[grupo_utilizador]    Script Date: 23/10/2025 18:15:27 ******/
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
/****** Object:  Table [dbo].[grupos]    Script Date: 23/10/2025 18:15:27 ******/
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
/****** Object:  Table [dbo].[intervencoes_anexos]    Script Date: 23/10/2025 18:15:27 ******/
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
/****** Object:  Table [dbo].[intervencoes_pecas]    Script Date: 23/10/2025 18:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
 CONSTRAINT [PK_intervencoes_pecas] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[permissoes]    Script Date: 23/10/2025 18:15:27 ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tags]    Script Date: 23/10/2025 18:15:27 ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tickets_historico]    Script Date: 23/10/2025 18:15:27 ******/
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
/****** Object:  Table [dbo].[tipos_conteudo]    Script Date: 23/10/2025 18:15:27 ******/
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
 CONSTRAINT [PK_tipos_conteudo] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tipos_funcionarios]    Script Date: 23/10/2025 18:15:27 ******/
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
 CONSTRAINT [PK_tipos_funcionarios] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[utilizador_permissao]    Script Date: 23/10/2025 18:15:27 ******/
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
/****** Object:  Table [dbo].[veiculos_valores_personalizados]    Script Date: 23/10/2025 18:15:27 ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[anexos] ON 
GO
INSERT [dbo].[anexos] ([id], [nome], [nome_original], [caminho], [tipo], [tamanho_bytes], [mime_type], [hash_md5], [principal], [metadados], [criado_em], [atualizado_em], [upload_por_id], [variants]) VALUES (1, N'5669c87d-7b1a-43da-b38a-cdbb36831429.jpg', N'175d7558068f93a1f2a056ab71fd03b8.jpg', N'uploads\tenant_2\5669c87d-7b1a-43da-b38a-cdbb36831429.jpg', N'jpg', 49870, N'image/jpeg', NULL, 0, NULL, CAST(N'2025-10-20T09:11:58.9533333' AS DateTime2), CAST(N'2025-10-20T09:11:58.9533333' AS DateTime2), NULL, NULL)
GO
INSERT [dbo].[anexos] ([id], [nome], [nome_original], [caminho], [tipo], [tamanho_bytes], [mime_type], [hash_md5], [principal], [metadados], [criado_em], [atualizado_em], [upload_por_id], [variants]) VALUES (2, N'2c858724-dda8-40f0-b949-becaf1d8f3c2.jpg', N'175d7558068f93a1f2a056ab71fd03b8.jpg', N'uploads\tenant_2\2c858724-dda8-40f0-b949-becaf1d8f3c2.jpg', N'jpg', 49870, N'image/jpeg', NULL, 0, NULL, CAST(N'2025-10-20T09:12:13.1466667' AS DateTime2), CAST(N'2025-10-20T09:12:13.1466667' AS DateTime2), NULL, NULL)
GO
INSERT [dbo].[anexos] ([id], [nome], [nome_original], [caminho], [tipo], [tamanho_bytes], [mime_type], [hash_md5], [principal], [metadados], [criado_em], [atualizado_em], [upload_por_id], [variants]) VALUES (3, N'e73d90fb-ed33-4235-9e82-001af5646f67.png', N'Screenshot-90-1024x521ggg.png', N'uploads\tenant_2\e73d90fb-ed33-4235-9e82-001af5646f67.png', N'png', 215708, N'image/png', NULL, 0, NULL, CAST(N'2025-10-20T09:12:21.6366667' AS DateTime2), CAST(N'2025-10-20T09:12:21.6366667' AS DateTime2), NULL, NULL)
GO
INSERT [dbo].[anexos] ([id], [nome], [nome_original], [caminho], [tipo], [tamanho_bytes], [mime_type], [hash_md5], [principal], [metadados], [criado_em], [atualizado_em], [upload_por_id], [variants]) VALUES (4, N'07471a1c-14f7-4cd6-a8eb-10c9a78f1c31.jpeg', N'transferir (2).jpeg', N'uploads\tenant_2\07471a1c-14f7-4cd6-a8eb-10c9a78f1c31.jpeg', N'jpeg', 74318, N'image/jpeg', NULL, 0, NULL, CAST(N'2025-10-20T09:12:21.6400000' AS DateTime2), CAST(N'2025-10-20T09:12:21.6400000' AS DateTime2), NULL, NULL)
GO
INSERT [dbo].[anexos] ([id], [nome], [nome_original], [caminho], [tipo], [tamanho_bytes], [mime_type], [hash_md5], [principal], [metadados], [criado_em], [atualizado_em], [upload_por_id], [variants]) VALUES (5, N'0e96f624-d8c7-4f61-95b1-e3390d6119fa.png', N'Frame 4.png', N'uploads\tenant_2\0e96f624-d8c7-4f61-95b1-e3390d6119fa.png', N'png', 319593, N'image/png', NULL, 0, NULL, CAST(N'2025-10-20T09:12:21.6433333' AS DateTime2), CAST(N'2025-10-20T09:12:21.6433333' AS DateTime2), NULL, NULL)
GO
INSERT [dbo].[anexos] ([id], [nome], [nome_original], [caminho], [tipo], [tamanho_bytes], [mime_type], [hash_md5], [principal], [metadados], [criado_em], [atualizado_em], [upload_por_id], [variants]) VALUES (6, N'aa3a4179-c433-4131-8211-732173b4c91f.png', N'20251007_0650_Caneca CEO Minimalista_remix_01k6ykeyvmfj8ry5xphrd02hfc.png', N'uploads\tenant_2\aa3a4179-c433-4131-8211-732173b4c91f.png', N'png', 2130867, N'image/png', NULL, 0, NULL, CAST(N'2025-10-20T09:12:21.6533333' AS DateTime2), CAST(N'2025-10-20T09:12:21.6533333' AS DateTime2), NULL, NULL)
GO
INSERT [dbo].[anexos] ([id], [nome], [nome_original], [caminho], [tipo], [tamanho_bytes], [mime_type], [hash_md5], [principal], [metadados], [criado_em], [atualizado_em], [upload_por_id], [variants]) VALUES (7, N'a461d218-3932-4598-9946-c02ea19d188f.jpg', N'175d7558068f93a1f2a056ab71fd03b8.jpg', N'uploads\tenant_2\a461d218-3932-4598-9946-c02ea19d188f.jpg', N'jpg', 49870, N'image/jpeg', NULL, 0, NULL, CAST(N'2025-10-20T09:30:01.4866667' AS DateTime2), CAST(N'2025-10-20T09:30:01.4866667' AS DateTime2), NULL, NULL)
GO
INSERT [dbo].[anexos] ([id], [nome], [nome_original], [caminho], [tipo], [tamanho_bytes], [mime_type], [hash_md5], [principal], [metadados], [criado_em], [atualizado_em], [upload_por_id], [variants]) VALUES (8, N'db33acf0-8f4b-4da9-8e1a-3fd020d25119.jpeg', N'transferir (2).jpeg', N'uploads\tenant_2\db33acf0-8f4b-4da9-8e1a-3fd020d25119.jpeg', N'jpeg', 74318, N'image/jpeg', NULL, 0, NULL, CAST(N'2025-10-20T09:39:25.3733333' AS DateTime2), CAST(N'2025-10-20T09:39:25.3733333' AS DateTime2), NULL, NULL)
GO
INSERT [dbo].[anexos] ([id], [nome], [nome_original], [caminho], [tipo], [tamanho_bytes], [mime_type], [hash_md5], [principal], [metadados], [criado_em], [atualizado_em], [upload_por_id], [variants]) VALUES (9, N'2a9d01a2-7fed-4c01-96da-cfae75699d1c.jpg', N'175d7558068f93a1f2a056ab71fd03b8.jpg', N'uploads\tenant_2\2a9d01a2-7fed-4c01-96da-cfae75699d1c.jpg', N'jpg', 49870, N'image/jpeg', NULL, 0, NULL, CAST(N'2025-10-20T09:39:45.2300000' AS DateTime2), CAST(N'2025-10-20T09:39:45.2300000' AS DateTime2), NULL, NULL)
GO
INSERT [dbo].[anexos] ([id], [nome], [nome_original], [caminho], [tipo], [tamanho_bytes], [mime_type], [hash_md5], [principal], [metadados], [criado_em], [atualizado_em], [upload_por_id], [variants]) VALUES (10, N'd18e061a-c12e-4246-8686-8314abdeef34_medium.jpg', N'175d7558068f93a1f2a056ab71fd03b8.jpg', N'uploads\tenant_2\d18e061a-c12e-4246-8686-8314abdeef34_medium.jpg', N'jpg', 111022, N'image/jpeg', NULL, 0, NULL, CAST(N'2025-10-20T10:00:04.2500000' AS DateTime2), CAST(N'2025-10-20T10:00:04.2500000' AS DateTime2), NULL, N'{"original":"d18e061a-c12e-4246-8686-8314abdeef34_original.jpg","large":"d18e061a-c12e-4246-8686-8314abdeef34_original.jpg","medium":"d18e061a-c12e-4246-8686-8314abdeef34_medium.jpg","small":"d18e061a-c12e-4246-8686-8314abdeef34_small.jpg","thumbnail":"d18e061a-c12e-4246-8686-8314abdeef34_thumb.jpg"}')
GO
INSERT [dbo].[anexos] ([id], [nome], [nome_original], [caminho], [tipo], [tamanho_bytes], [mime_type], [hash_md5], [principal], [metadados], [criado_em], [atualizado_em], [upload_por_id], [variants]) VALUES (11, N'd6e431f7-4d83-43ed-9447-ea2a9dcf715a_medium.jpg', N'175d7558068f93a1f2a056ab71fd03b8.jpg', N'uploads\tenant_2\d6e431f7-4d83-43ed-9447-ea2a9dcf715a_medium.jpg', N'jpg', 111022, N'image/jpeg', NULL, 0, NULL, CAST(N'2025-10-20T10:03:07.4433333' AS DateTime2), CAST(N'2025-10-20T10:03:07.4433333' AS DateTime2), NULL, N'{"original":"d6e431f7-4d83-43ed-9447-ea2a9dcf715a_original.jpg","large":"d6e431f7-4d83-43ed-9447-ea2a9dcf715a_original.jpg","medium":"d6e431f7-4d83-43ed-9447-ea2a9dcf715a_medium.jpg","small":"d6e431f7-4d83-43ed-9447-ea2a9dcf715a_small.jpg","thumbnail":"d6e431f7-4d83-43ed-9447-ea2a9dcf715a_thumb.jpg"}')
GO
SET IDENTITY_INSERT [dbo].[anexos] OFF
GO
SET IDENTITY_INSERT [dbo].[categorias_conteudo] ON 
GO
INSERT [dbo].[categorias_conteudo] ([id], [nome], [slug], [descricao], [cor], [icone], [ordem], [ativo], [categoria_pai_id], [criado_em], [atualizado_em]) VALUES (1, N'Desenvolvimento Web', N'desenvolvimento-web', N'Projetos de desenvolvimento web', N'#3B82F6', N'tabler-code', 1, 1, NULL, CAST(N'2025-10-19T01:43:52.9533333' AS DateTime2), CAST(N'2025-10-19T01:43:52.9533333' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[categorias_conteudo] OFF
GO
SET IDENTITY_INSERT [dbo].[categorias_equipamento] ON 
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (1, N'Informática', N'Equipamentos de TI', N'monitor', N'#3B82F6', NULL, 1, CAST(N'2025-10-12T15:54:50.5300000' AS DateTime2), CAST(N'2025-10-12T15:54:50.5300000' AS DateTime2))
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (2, N'Periféricos', N'Teclados, mouses, impressoras', N'printer', N'#10B981', NULL, 1, CAST(N'2025-10-12T15:54:50.5300000' AS DateTime2), CAST(N'2025-10-12T15:54:50.5300000' AS DateTime2))
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (3, N'Redes', N'Switches, routers, access points', N'wifi', N'#8B5CF6', NULL, 1, CAST(N'2025-10-12T15:54:50.5300000' AS DateTime2), CAST(N'2025-10-12T15:54:50.5300000' AS DateTime2))
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (4, N'Telefonia', N'Telefones e sistemas de comunicação', N'phone', N'#F59E0B', NULL, 1, CAST(N'2025-10-12T15:54:50.5300000' AS DateTime2), CAST(N'2025-10-12T15:54:50.5300000' AS DateTime2))
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (5, N'Audiovisual', N'Projetores, câmeras, microfones', N'video', N'#EF4444', NULL, 1, CAST(N'2025-10-12T15:54:50.5300000' AS DateTime2), CAST(N'2025-10-12T15:54:50.5300000' AS DateTime2))
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (6, N'Climatização', N'Ar condicionado, ventilação', N'wind', N'#06B6D4', NULL, 1, CAST(N'2025-10-12T15:54:50.5300000' AS DateTime2), CAST(N'2025-10-12T15:54:50.5300000' AS DateTime2))
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (7, N'Segurança', N'Câmeras, alarmes, controle de acesso', N'shield', N'#EC4899', NULL, 1, CAST(N'2025-10-12T15:54:50.5300000' AS DateTime2), CAST(N'2025-10-12T15:54:50.5300000' AS DateTime2))
GO
INSERT [dbo].[categorias_equipamento] ([id], [nome], [descricao], [icone], [cor], [categoria_pai_id], [ativo], [criado_em], [atualizado_em]) VALUES (8, N'Móveis', N'Mesas, cadeiras, armários', N'home', N'#6B7280', NULL, 1, CAST(N'2025-10-12T15:54:50.5300000' AS DateTime2), CAST(N'2025-10-12T15:54:50.5300000' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[categorias_equipamento] OFF
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (2004, 3, CAST(N'2025-10-20T10:03:52.5666667' AS DateTime2))
GO
INSERT [dbo].[conteudo_tag] ([conteudo_id], [tag_id], [criado_em]) VALUES (2004, 6, CAST(N'2025-10-20T10:03:52.5700000' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[conteudos] ON 
GO
INSERT [dbo].[conteudos] ([id], [tipo_conteudo_id], [categoria_id], [titulo], [slug], [subtitulo], [resumo], [conteudo], [imagem_destaque], [autor_id], [status], [destaque], [permite_comentarios], [visualizacoes], [ordem], [publicado_em], [data_inicio], [data_fim], [meta_title], [meta_description], [meta_keywords], [criado_em], [atualizado_em], [aprovado_por_id], [aprovado_em], [empresa_id], [visibilidade]) VALUES (2004, 14, 1, N'Melhoria na performance', N'teste', N'Sistema completo de gestão para empresas', N'Travaloasfsaf', N'<p><strong><em><u>sdgsd</u></em></strong></p>', N'http://localhost:9832/api/uploads/tenant_2/d6e431f7-4d83-43ed-9447-ea2a9dcf715a_medium.jpg', NULL, N'em_revisao', 1, 0, 0, NULL, CAST(N'2025-10-20T09:03:19.3066667' AS DateTime2), CAST(N'2025-10-21T08:02:00.0000000' AS DateTime2), CAST(N'2025-10-27T10:02:00.0000000' AS DateTime2), N'Plataforma CEO - Sistema de Gestão Empresarial | Nautis', N'Plataforma CEO - Sistema de Gestão Empresarial | Nautis', N'plataforma ceo, gestão empresarial, sistema gestão, nextjs, nestjs, multi-tenant', CAST(N'2025-10-20T10:03:19.3066667' AS DateTime2), CAST(N'2025-10-20T10:03:52.5633333' AS DateTime2), NULL, NULL, NULL, N'privada')
GO
SET IDENTITY_INSERT [dbo].[conteudos] OFF
GO
SET IDENTITY_INSERT [dbo].[conteudos_valores_personalizados] ON 
GO
INSERT [dbo].[conteudos_valores_personalizados] ([id], [conteudo_id], [codigo_campo], [valor_texto], [valor_numero], [valor_data], [valor_datetime], [valor_boolean], [valor_json], [criado_em], [atualizado_em]) VALUES (20027, 2004, N'cliente', N'José Manel', NULL, NULL, NULL, NULL, NULL, CAST(N'2025-10-20T10:03:52.5700000' AS DateTime2), CAST(N'2025-10-20T10:03:52.5700000' AS DateTime2))
GO
INSERT [dbo].[conteudos_valores_personalizados] ([id], [conteudo_id], [codigo_campo], [valor_texto], [valor_numero], [valor_data], [valor_datetime], [valor_boolean], [valor_json], [criado_em], [atualizado_em]) VALUES (20028, 2004, N'local', N'Lisboa, Portugal', NULL, NULL, NULL, NULL, NULL, CAST(N'2025-10-20T10:03:52.5733333' AS DateTime2), CAST(N'2025-10-20T10:03:52.5733333' AS DateTime2))
GO
INSERT [dbo].[conteudos_valores_personalizados] ([id], [conteudo_id], [codigo_campo], [valor_texto], [valor_numero], [valor_data], [valor_datetime], [valor_boolean], [valor_json], [criado_em], [atualizado_em]) VALUES (20029, 2004, N'ano', NULL, CAST(10.0000 AS Decimal(18, 4)), NULL, NULL, NULL, NULL, CAST(N'2025-10-20T10:03:52.5733333' AS DateTime2), CAST(N'2025-10-20T10:03:52.5733333' AS DateTime2))
GO
INSERT [dbo].[conteudos_valores_personalizados] ([id], [conteudo_id], [codigo_campo], [valor_texto], [valor_numero], [valor_data], [valor_datetime], [valor_boolean], [valor_json], [criado_em], [atualizado_em]) VALUES (20030, 2004, N'link_externo', N'https://www.microlopes.pt/', NULL, NULL, NULL, NULL, NULL, CAST(N'2025-10-20T10:03:52.5766667' AS DateTime2), CAST(N'2025-10-20T10:03:52.5766667' AS DateTime2))
GO
INSERT [dbo].[conteudos_valores_personalizados] ([id], [conteudo_id], [codigo_campo], [valor_texto], [valor_numero], [valor_data], [valor_datetime], [valor_boolean], [valor_json], [criado_em], [atualizado_em]) VALUES (20031, 2004, N'duracao', N'33 anos', NULL, NULL, NULL, NULL, NULL, CAST(N'2025-10-20T10:03:52.5800000' AS DateTime2), CAST(N'2025-10-20T10:03:52.5800000' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[conteudos_valores_personalizados] OFF
GO
SET IDENTITY_INSERT [dbo].[marcas] ON 
GO
INSERT [dbo].[marcas] ([id], [nome], [logo_url], [website], [ativo], [criado_em], [atualizado_em]) VALUES (1, N'Dell', NULL, N'https://www.dell.com', 1, CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2))
GO
INSERT [dbo].[marcas] ([id], [nome], [logo_url], [website], [ativo], [criado_em], [atualizado_em]) VALUES (2, N'HP', NULL, N'https://www.hp.com', 1, CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2))
GO
INSERT [dbo].[marcas] ([id], [nome], [logo_url], [website], [ativo], [criado_em], [atualizado_em]) VALUES (3, N'Lenovo', NULL, N'https://www.lenovo.com', 1, CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2))
GO
INSERT [dbo].[marcas] ([id], [nome], [logo_url], [website], [ativo], [criado_em], [atualizado_em]) VALUES (4, N'Apple', NULL, N'https://www.apple.com', 1, CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2))
GO
INSERT [dbo].[marcas] ([id], [nome], [logo_url], [website], [ativo], [criado_em], [atualizado_em]) VALUES (5, N'Samsung', NULL, N'https://www.samsung.com', 1, CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2))
GO
INSERT [dbo].[marcas] ([id], [nome], [logo_url], [website], [ativo], [criado_em], [atualizado_em]) VALUES (6, N'Cisco', NULL, N'https://www.cisco.com', 1, CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2))
GO
INSERT [dbo].[marcas] ([id], [nome], [logo_url], [website], [ativo], [criado_em], [atualizado_em]) VALUES (7, N'TP-Link', NULL, N'https://www.tp-link.com', 1, CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2))
GO
INSERT [dbo].[marcas] ([id], [nome], [logo_url], [website], [ativo], [criado_em], [atualizado_em]) VALUES (8, N'Logitech', NULL, N'https://www.logitech.com', 1, CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2))
GO
INSERT [dbo].[marcas] ([id], [nome], [logo_url], [website], [ativo], [criado_em], [atualizado_em]) VALUES (9, N'Canon', NULL, N'https://www.canon.com', 1, CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2))
GO
INSERT [dbo].[marcas] ([id], [nome], [logo_url], [website], [ativo], [criado_em], [atualizado_em]) VALUES (10, N'Epson', NULL, N'https://www.epson.com', 1, CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2))
GO
INSERT [dbo].[marcas] ([id], [nome], [logo_url], [website], [ativo], [criado_em], [atualizado_em]) VALUES (11, N'LG', NULL, N'https://www.lg.com', 1, CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2))
GO
INSERT [dbo].[marcas] ([id], [nome], [logo_url], [website], [ativo], [criado_em], [atualizado_em]) VALUES (12, N'Sony', NULL, N'https://www.sony.com', 1, CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2))
GO
INSERT [dbo].[marcas] ([id], [nome], [logo_url], [website], [ativo], [criado_em], [atualizado_em]) VALUES (13, N'Hikvision', NULL, N'https://www.hikvision.com', 1, CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2))
GO
INSERT [dbo].[marcas] ([id], [nome], [logo_url], [website], [ativo], [criado_em], [atualizado_em]) VALUES (14, N'Dahua', NULL, N'https://www.dahuasecurity.com', 1, CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2))
GO
INSERT [dbo].[marcas] ([id], [nome], [logo_url], [website], [ativo], [criado_em], [atualizado_em]) VALUES (15, N'Panasonic', NULL, N'https://www.panasonic.com', 1, CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5366667' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[marcas] OFF
GO
SET IDENTITY_INSERT [dbo].[modelos_equipamento] ON 
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em]) VALUES (1, 1, 1, N'Latitude 7420', N'DELL-LAT7420', N'Notebook Dell Latitude 14" i7', NULL, NULL, NULL, 1, CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2))
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em]) VALUES (2, 1, 1, N'OptiPlex 7090', N'DELL-OPT7090', N'Desktop Dell OptiPlex i7', NULL, NULL, NULL, 1, CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2))
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em]) VALUES (3, 2, 1, N'EliteBook 840 G8', N'HP-EB840G8', N'Notebook HP EliteBook 14" i7', NULL, NULL, NULL, 1, CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2))
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em]) VALUES (4, 3, 1, N'ThinkPad X1 Carbon', N'LEN-X1C', N'Notebook Lenovo ThinkPad 14" i7', NULL, NULL, NULL, 1, CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2))
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em]) VALUES (5, 4, 1, N'MacBook Pro 14"', N'APPLE-MBP14', N'MacBook Pro 14" M3 Pro', NULL, NULL, NULL, 1, CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2))
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em]) VALUES (6, 8, 2, N'MX Master 3S', N'LOG-MXM3S', N'Mouse Logitech MX Master', NULL, NULL, NULL, 1, CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2))
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em]) VALUES (7, 8, 2, N'MX Keys', N'LOG-MXKEYS', N'Teclado Logitech MX Keys', NULL, NULL, NULL, 1, CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2))
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em]) VALUES (8, 9, 2, N'Pixma G3260', N'CAN-G3260', N'Impressora Canon Multifuncional', NULL, NULL, NULL, 1, CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2))
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em]) VALUES (9, 10, 2, N'EcoTank L3250', N'EPS-L3250', N'Impressora Epson EcoTank', NULL, NULL, NULL, 1, CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2))
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em]) VALUES (10, 6, 3, N'Catalyst 2960-X', N'CIS-C2960X', N'Switch Cisco 24 portas', NULL, NULL, NULL, 1, CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2))
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em]) VALUES (11, 7, 3, N'Archer AX73', N'TPL-AX73', N'Router TP-Link WiFi 6', NULL, NULL, NULL, 1, CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2))
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em]) VALUES (12, 7, 3, N'EAP660 HD', N'TPL-EAP660', N'Access Point TP-Link WiFi 6', NULL, NULL, NULL, 1, CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2))
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em]) VALUES (13, 10, 5, N'EB-2250U', N'EPS-EB2250', N'Projetor Epson Full HD', NULL, NULL, NULL, 1, CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2))
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em]) VALUES (14, 8, 5, N'Brio 500', N'LOG-BRIO500', N'Webcam Logitech 4K', NULL, NULL, NULL, 1, CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2))
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em]) VALUES (15, 13, 7, N'DS-2CD2385G1', N'HIK-2CD2385', N'Câmera IP Hikvision 8MP', NULL, NULL, NULL, 1, CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2))
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em]) VALUES (16, 14, 7, N'IPC-HFW5831E', N'DAH-HFW5831', N'Câmera IP Dahua 8MP', NULL, NULL, NULL, 1, CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2))
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em]) VALUES (17, 15, 4, N'KX-UT670', N'PAN-UT670', N'Telefone IP Panasonic', NULL, NULL, NULL, 1, CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2))
GO
INSERT [dbo].[modelos_equipamento] ([id], [marca_id], [categoria_id], [nome], [codigo], [descricao], [especificacoes], [imagem_url], [manual_url], [ativo], [criado_em], [atualizado_em]) VALUES (18, 11, 6, N'Split 12000 BTU', N'LG-S12K', N'Ar Condicionado LG Dual Inverter', NULL, NULL, NULL, 1, CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2), CAST(N'2025-10-12T15:54:50.5466667' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[modelos_equipamento] OFF
GO
SET IDENTITY_INSERT [dbo].[permissoes] ON 
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (21, N'EQUIPAMENTOS:Criar', N'Criar Equipamentos', N'Permite cadastrar novos equipamentos', N'SUPORTE', N'Criar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (22, N'EQUIPAMENTOS:Listar', N'Listar Equipamentos', N'Permite visualizar lista de equipamentos', N'SUPORTE', N'Listar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (23, N'EQUIPAMENTOS:Visualizar', N'Visualizar Equipamentos', N'Permite ver detalhes de equipamentos', N'SUPORTE', N'Visualizar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (24, N'EQUIPAMENTOS:Editar', N'Editar Equipamentos', N'Permite editar equipamentos', N'SUPORTE', N'Editar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (25, N'EQUIPAMENTOS:Apagar', N'Apagar Equipamentos', N'Permite excluir equipamentos', N'SUPORTE', N'Apagar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (26, N'TICKETS:Criar', N'Criar Tickets', N'Permite abrir novos tickets', N'SUPORTE', N'Criar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (27, N'TICKETS:Listar', N'Listar Tickets', N'Permite visualizar lista de tickets', N'SUPORTE', N'Listar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (28, N'TICKETS:Visualizar', N'Visualizar Tickets', N'Permite ver detalhes de tickets', N'SUPORTE', N'Visualizar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (29, N'TICKETS:Editar', N'Editar Tickets', N'Permite editar tickets', N'SUPORTE', N'Editar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (30, N'TICKETS:Atribuir', N'Atribuir Tickets', N'Permite atribuir tickets a técnicos', N'SUPORTE', N'Atribuir', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (31, N'TICKETS:Fechar', N'Fechar Tickets', N'Permite fechar tickets', N'SUPORTE', N'Concluir', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (32, N'INTERVENCOES:Criar', N'Criar Intervenções', N'Permite registrar intervenções', N'SUPORTE', N'Criar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (33, N'INTERVENCOES:Listar', N'Listar Intervenções', N'Permite visualizar lista de intervenções', N'SUPORTE', N'Listar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (34, N'INTERVENCOES:Visualizar', N'Visualizar Intervenções', N'Permite ver detalhes de intervenções', N'SUPORTE', N'Visualizar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (35, N'INTERVENCOES:Editar', N'Editar Intervenções', N'Permite editar intervenções', N'SUPORTE', N'Editar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (36, N'SUPORTE:Relatorios', N'Relatórios de Suporte', N'Permite visualizar relatórios e estatísticas', N'SUPORTE', N'Exportar', CAST(N'2025-10-12T15:59:43.0700000' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (37, N'RH:Criar', N'Criar Funcionários', N'Permite criar funcionários', N'RH', N'Criar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (38, N'RH:Listar', N'Listar Funcionários', N'Permite listar funcionários', N'RH', N'Listar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (39, N'RH:Visualizar', N'Visualizar Funcionários', N'Permite visualizar detalhes de funcionários', N'RH', N'Visualizar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (40, N'RH:Editar', N'Editar Funcionários', N'Permite editar informações de funcionários', N'RH', N'Editar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (41, N'RH:Apagar', N'Apagar Funcionários', N'Permite apagar funcionários', N'RH', N'Apagar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (42, N'RH:Exportar', N'Exportar Dados RH', N'Permite exportar dados de RH', N'RH', N'Exportar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (43, N'EMPRESAS:Criar', N'Criar Empresas', N'Permite criar empresas', N'EMPRESAS', N'Criar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (44, N'EMPRESAS:Listar', N'Listar Empresas', N'Permite listar empresas', N'EMPRESAS', N'Listar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (45, N'EMPRESAS:Visualizar', N'Visualizar Empresas', N'Permite visualizar detalhes de empresas', N'EMPRESAS', N'Visualizar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (46, N'EMPRESAS:Editar', N'Editar Empresas', N'Permite editar informações de empresas', N'EMPRESAS', N'Editar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (47, N'EMPRESAS:Admin', N'Administrar Empresas', N'Permite administrar configurações e dados de empresas', N'EMPRESAS', N'Outro', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (48, N'CONTEUDOS:Criar', N'Criar Conteúdos', N'Permite criar novos conteúdos', N'CONTEUDOS', N'Criar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (49, N'CONTEUDOS:Listar', N'Listar Conteúdos', N'Permite listar conteúdos', N'CONTEUDOS', N'Listar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (50, N'CONTEUDOS:Visualizar', N'Visualizar Conteúdos', N'Permite visualizar conteúdos', N'CONTEUDOS', N'Visualizar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (51, N'CONTEUDOS:Editar', N'Editar Conteúdos', N'Permite editar conteúdos existentes', N'CONTEUDOS', N'Editar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (52, N'CONTEUDOS:Apagar', N'Apagar Conteúdos', N'Permite apagar conteúdos', N'CONTEUDOS', N'Apagar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (53, N'CONTEUDOS:Publicar', N'Publicar Conteúdos', N'Permite aprovar e publicar conteúdos', N'CONTEUDOS', N'Aprovar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (54, N'CONTEUDOS:Arquivar', N'Arquivar Conteúdos', N'Permite arquivar conteúdos', N'CONTEUDOS', N'Outro', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (55, N'CONTEUDOS:Moderar', N'Moderar Comentários', N'Permite moderar comentários em conteúdos', N'CONTEUDOS', N'Aprovar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (56, N'CONTEUDOS:Admin', N'Administrar Conteúdos', N'Permite administrar todos os conteúdos', N'CONTEUDOS', N'Outro', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (57, N'CONTEUDOS:Favoritar', N'Favoritar Conteúdos', N'Permite marcar conteúdos como favoritos', N'CONTEUDOS', N'Outro', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (58, N'VEICULOS:Criar', N'Criar Veículos', N'Permite cadastrar veículos', N'VEICULOS', N'Criar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (59, N'VEICULOS:Listar', N'Listar Veículos', N'Permite listar veículos', N'VEICULOS', N'Listar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (60, N'VEICULOS:Visualizar', N'Visualizar Veículos', N'Permite visualizar detalhes de veículos', N'VEICULOS', N'Visualizar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (61, N'VEICULOS:Editar', N'Editar Veículos', N'Permite editar informações de veículos', N'VEICULOS', N'Editar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
INSERT [dbo].[permissoes] ([id], [codigo], [nome], [descricao], [modulo], [tipo], [criado_em]) VALUES (62, N'VEICULOS:Apagar', N'Apagar Veículos', N'Permite apagar veículos', N'VEICULOS', N'Apagar', CAST(N'2025-10-12T22:35:43.4533333' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[permissoes] OFF
GO
SET IDENTITY_INSERT [dbo].[tags] ON 
GO
INSERT [dbo].[tags] ([id], [nome], [slug], [cor], [criado_em]) VALUES (1, N'Branding e Identidade Visual', N'branding-e-identidade-visual', N'#FF6B6B', CAST(N'2025-10-13T02:15:17.5300000' AS DateTime2))
GO
INSERT [dbo].[tags] ([id], [nome], [slug], [cor], [criado_em]) VALUES (2, N'Desenvolvimento Web', N'desenvolvimento-web', N'#4ECDC4', CAST(N'2025-10-13T02:15:17.5300000' AS DateTime2))
GO
INSERT [dbo].[tags] ([id], [nome], [slug], [cor], [criado_em]) VALUES (3, N'Estratégia e Consultoria Digital', N'estrategia-e-consultoria-digital', N'#45B7D1', CAST(N'2025-10-13T02:15:17.5300000' AS DateTime2))
GO
INSERT [dbo].[tags] ([id], [nome], [slug], [cor], [criado_em]) VALUES (4, N'Gestão de Conteúdos', N'gestao-de-conteudos', N'#96CEB4', CAST(N'2025-10-13T02:15:17.5300000' AS DateTime2))
GO
INSERT [dbo].[tags] ([id], [nome], [slug], [cor], [criado_em]) VALUES (5, N'Manutenção e Suporte Técnico', N'manutencao-e-suporte-tecnico', N'#FFEAA7', CAST(N'2025-10-13T02:15:17.5300000' AS DateTime2))
GO
INSERT [dbo].[tags] ([id], [nome], [slug], [cor], [criado_em]) VALUES (6, N'UI/UX Design', N'ui-ux-design', N'#DFE6E9', CAST(N'2025-10-13T02:15:17.5300000' AS DateTime2))
GO
INSERT [dbo].[tags] ([id], [nome], [slug], [cor], [criado_em]) VALUES (7, N'Tecnologia', N'tecnologia', N'#3B82F6', CAST(N'2025-10-19T01:43:52.9700000' AS DateTime2))
GO
INSERT [dbo].[tags] ([id], [nome], [slug], [cor], [criado_em]) VALUES (8, N'Desenvolvimento', N'desenvolvimento', N'#10B981', CAST(N'2025-10-19T01:43:52.9700000' AS DateTime2))
GO
INSERT [dbo].[tags] ([id], [nome], [slug], [cor], [criado_em]) VALUES (1007, N'testes', N'testes', NULL, CAST(N'2025-10-19T11:17:29.2166667' AS DateTime2))
GO
INSERT [dbo].[tags] ([id], [nome], [slug], [cor], [criado_em]) VALUES (1009, N'643643643', N'643643643', NULL, CAST(N'2025-10-19T11:41:40.5333333' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[tags] OFF
GO
SET IDENTITY_INSERT [dbo].[tipos_conteudo] ON 
GO
INSERT [dbo].[tipos_conteudo] ([id], [codigo], [nome], [descricao], [icone], [permite_comentarios], [permite_anexos], [max_anexos], [permite_galeria], [requer_aprovacao], [template_visualizacao], [configuracao_campos], [ativo], [criado_em], [atualizado_em]) VALUES (13, N'GALERIA', N'Galeria', N'Galeria de imagens do portfólio', N'image', 0, 1, 1, 0, 0, N'galeria', N'', 1, CAST(N'2025-10-13T02:32:10.6000000' AS DateTime2), CAST(N'2025-10-13T02:32:10.6000000' AS DateTime2))
GO
INSERT [dbo].[tipos_conteudo] ([id], [codigo], [nome], [descricao], [icone], [permite_comentarios], [permite_anexos], [max_anexos], [permite_galeria], [requer_aprovacao], [template_visualizacao], [configuracao_campos], [ativo], [criado_em], [atualizado_em]) VALUES (14, N'PROJETO', N'Projeto', N'Projetos desenvolvidos', N'briefcase', 1, 1, 5, 1, 0, N'projeto', N'{
  "campos_personalizados": [
    {"codigo": "cliente", "nome": "Cliente", "tipo": "text", "obrigatorio": true},
    {"codigo": "local", "nome": "Local", "tipo": "text", "obrigatorio": false},
    {"codigo": "ano", "nome": "Ano", "tipo": "number", "obrigatorio": true},
    {"codigo": "link_externo", "nome": "Link do Projeto", "tipo": "url", "obrigatorio": false},
    {"codigo": "duracao", "nome": "Duração do Projeto", "tipo": "text", "obrigatorio": false}
  ]
}', 1, CAST(N'2025-10-13T02:32:10.6000000' AS DateTime2), CAST(N'2025-10-13T02:32:10.6000000' AS DateTime2))
GO
INSERT [dbo].[tipos_conteudo] ([id], [codigo], [nome], [descricao], [icone], [permite_comentarios], [permite_anexos], [max_anexos], [permite_galeria], [requer_aprovacao], [template_visualizacao], [configuracao_campos], [ativo], [criado_em], [atualizado_em]) VALUES (15, N'NOTICIA', N'Notícia', N'Notícias e comunicados da empresa', N'newspaper', 1, 1, 5, 1, 0, N'noticia', N'{
  "campos_personalizados": [
    {"codigo": "local", "nome": "Local", "tipo": "text", "obrigatorio": false},
    {"codigo": "fonte", "nome": "Fonte", "tipo": "text", "obrigatorio": false},
    {"codigo": "urgente", "nome": "Notícia Urgente", "tipo": "boolean", "obrigatorio": false},
  ]
}', 1, CAST(N'2025-10-13T02:32:10.6000000' AS DateTime2), CAST(N'2025-10-13T02:32:10.6000000' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[tipos_conteudo] OFF
GO
SET IDENTITY_INSERT [dbo].[tipos_ticket] ON 
GO
INSERT [dbo].[tipos_ticket] ([id], [nome], [descricao], [cor], [icone], [sla_horas], [ativo], [criado_em], [atualizado_em]) VALUES (1, N'Incidente', N'Problema que afeta o serviço', N'#EF4444', N'alert-circle', 4, 1, CAST(N'2025-10-12T15:54:50.5400000' AS DateTime2), CAST(N'2025-10-12T15:54:50.5400000' AS DateTime2))
GO
INSERT [dbo].[tipos_ticket] ([id], [nome], [descricao], [cor], [icone], [sla_horas], [ativo], [criado_em], [atualizado_em]) VALUES (2, N'Requisição', N'Solicitação de serviço ou informação', N'#3B82F6', N'inbox', 24, 1, CAST(N'2025-10-12T15:54:50.5400000' AS DateTime2), CAST(N'2025-10-12T15:54:50.5400000' AS DateTime2))
GO
INSERT [dbo].[tipos_ticket] ([id], [nome], [descricao], [cor], [icone], [sla_horas], [ativo], [criado_em], [atualizado_em]) VALUES (3, N'Manutenção Preventiva', N'Manutenção agendada', N'#10B981', N'tool', 48, 1, CAST(N'2025-10-12T15:54:50.5400000' AS DateTime2), CAST(N'2025-10-12T15:54:50.5400000' AS DateTime2))
GO
INSERT [dbo].[tipos_ticket] ([id], [nome], [descricao], [cor], [icone], [sla_horas], [ativo], [criado_em], [atualizado_em]) VALUES (4, N'Instalação', N'Instalação de novo equipamento', N'#F59E0B', N'settings', 48, 1, CAST(N'2025-10-12T15:54:50.5400000' AS DateTime2), CAST(N'2025-10-12T15:54:50.5400000' AS DateTime2))
GO
INSERT [dbo].[tipos_ticket] ([id], [nome], [descricao], [cor], [icone], [sla_horas], [ativo], [criado_em], [atualizado_em]) VALUES (5, N'Configuração', N'Alteração de configuração', N'#8B5CF6', N'sliders', 8, 1, CAST(N'2025-10-12T15:54:50.5400000' AS DateTime2), CAST(N'2025-10-12T15:54:50.5400000' AS DateTime2))
GO
INSERT [dbo].[tipos_ticket] ([id], [nome], [descricao], [cor], [icone], [sla_horas], [ativo], [criado_em], [atualizado_em]) VALUES (6, N'Consultoria', N'Dúvidas e orientações', N'#06B6D4', N'help-circle', 24, 1, CAST(N'2025-10-12T15:54:50.5400000' AS DateTime2), CAST(N'2025-10-12T15:54:50.5400000' AS DateTime2))
GO
INSERT [dbo].[tipos_ticket] ([id], [nome], [descricao], [cor], [icone], [sla_horas], [ativo], [criado_em], [atualizado_em]) VALUES (7, N'Urgente', N'Problema crítico', N'#DC2626', N'zap', 1, 1, CAST(N'2025-10-12T15:54:50.5400000' AS DateTime2), CAST(N'2025-10-12T15:54:50.5400000' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[tipos_ticket] OFF
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 48, CAST(N'2025-10-18T14:59:45.4933333' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 49, CAST(N'2025-10-18T14:59:45.4933333' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 50, CAST(N'2025-10-18T14:59:45.4933333' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 51, CAST(N'2025-10-18T14:59:45.4933333' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 52, CAST(N'2025-10-18T14:59:45.4933333' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 53, CAST(N'2025-10-18T14:59:45.4933333' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 54, CAST(N'2025-10-18T14:59:45.4933333' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 55, CAST(N'2025-10-18T14:59:45.4933333' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 56, CAST(N'2025-10-18T14:59:45.4933333' AS DateTime2))
GO
INSERT [dbo].[utilizador_permissao] ([utilizador_id], [permissao_id], [criado_em]) VALUES (1, 57, CAST(N'2025-10-18T14:59:45.4933333' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[utilizadores] ON 
GO
INSERT [dbo].[utilizadores] ([id], [username], [email], [senha_hash], [telefone], [ativo], [email_verificado], [email_verificado_em], [senha_alterada_em], [token_recordar], [token_reset_senha], [token_reset_expira_em], [ultimo_acesso], [foto_url], [idioma], [tema], [criado_em], [atualizado_em], [funcionario_id]) VALUES (1, N'joaosilva', N'joao.silva@example.com', N'$2a$12$6A5Tmryguezh7L34duSNRuMoA.KigG647TCPEVLEM9ikDIJBErno2', N'+55 11 98888-7777', 1, 1, CAST(N'2025-10-13T10:00:00.0000000' AS DateTime2), CAST(N'2025-09-20T08:00:00.0000000' AS DateTime2), N'3f5a91bfa2e84c62b876bb4f1bca65d1', NULL, NULL, CAST(N'2025-10-20T09:29:26.0100000' AS DateTime2), NULL, N'pt-PT', N'dark', CAST(N'2025-08-01T09:30:00.0000000' AS DateTime2), CAST(N'2025-10-13T10:15:00.0000000' AS DateTime2), NULL)
GO
SET IDENTITY_INSERT [dbo].[utilizadores] OFF
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_beneficios_valores]    Script Date: 23/10/2025 18:15:27 ******/
ALTER TABLE [dbo].[beneficios_valores_personalizados] ADD  CONSTRAINT [UQ_beneficios_valores] UNIQUE NONCLUSTERED 
(
	[beneficio_id] ASC,
	[codigo_campo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_categorias_conteudo_slug]    Script Date: 23/10/2025 18:15:27 ******/
ALTER TABLE [dbo].[categorias_conteudo] ADD  CONSTRAINT [UQ_categorias_conteudo_slug] UNIQUE NONCLUSTERED 
(
	[slug] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_categorias_conteudo_pai]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_categorias_conteudo_pai] ON [dbo].[categorias_conteudo]
(
	[categoria_pai_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_categorias_conteudo_slug]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_categorias_conteudo_slug] ON [dbo].[categorias_conteudo]
(
	[slug] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_comentarios_aprovado]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_comentarios_aprovado] ON [dbo].[comentarios]
(
	[aprovado] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_comentarios_conteudo]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_comentarios_conteudo] ON [dbo].[comentarios]
(
	[conteudo_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_comentarios_pai]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_comentarios_pai] ON [dbo].[comentarios]
(
	[comentario_pai_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudo_anexo_conteudo]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_conteudo_anexo_conteudo] ON [dbo].[conteudo_anexo]
(
	[conteudo_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_conteudo_anexo_tipo]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_conteudo_anexo_tipo] ON [dbo].[conteudo_anexo]
(
	[tipo_anexo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ_conteudo_empresa]    Script Date: 23/10/2025 18:15:27 ******/
ALTER TABLE [dbo].[conteudo_empresa] ADD  CONSTRAINT [UQ_conteudo_empresa] UNIQUE NONCLUSTERED 
(
	[conteudo_id] ASC,
	[empresa_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudo_empresa_conteudo]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_conteudo_empresa_conteudo] ON [dbo].[conteudo_empresa]
(
	[conteudo_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudo_empresa_empresa]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_conteudo_empresa_empresa] ON [dbo].[conteudo_empresa]
(
	[empresa_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_conteudos_slug]    Script Date: 23/10/2025 18:15:27 ******/
ALTER TABLE [dbo].[conteudos] ADD  CONSTRAINT [UQ_conteudos_slug] UNIQUE NONCLUSTERED 
(
	[slug] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudos_autor]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_autor] ON [dbo].[conteudos]
(
	[autor_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudos_categoria]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_categoria] ON [dbo].[conteudos]
(
	[categoria_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudos_empresa]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_empresa] ON [dbo].[conteudos]
(
	[empresa_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudos_publicado]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_publicado] ON [dbo].[conteudos]
(
	[publicado_em] DESC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_conteudos_slug]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_slug] ON [dbo].[conteudos]
(
	[slug] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_conteudos_status]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_status] ON [dbo].[conteudos]
(
	[status] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudos_tipo]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_tipo] ON [dbo].[conteudos]
(
	[tipo_conteudo_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_conteudos_visibilidade]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_visibilidade] ON [dbo].[conteudos]
(
	[visibilidade] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ_conteudos_favoritos]    Script Date: 23/10/2025 18:15:27 ******/
ALTER TABLE [dbo].[conteudos_favoritos] ADD  CONSTRAINT [UQ_conteudos_favoritos] UNIQUE NONCLUSTERED 
(
	[conteudo_id] ASC,
	[utilizador_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_conteudos_valores]    Script Date: 23/10/2025 18:15:27 ******/
ALTER TABLE [dbo].[conteudos_valores_personalizados] ADD  CONSTRAINT [UQ_conteudos_valores] UNIQUE NONCLUSTERED 
(
	[conteudo_id] ASC,
	[codigo_campo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudos_valores_conteudo]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_valores_conteudo] ON [dbo].[conteudos_valores_personalizados]
(
	[conteudo_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudos_visualizacoes_conteudo]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_visualizacoes_conteudo] ON [dbo].[conteudos_visualizacoes]
(
	[conteudo_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_conteudos_visualizacoes_data]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_conteudos_visualizacoes_data] ON [dbo].[conteudos_visualizacoes]
(
	[visualizado_em] DESC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_documentos_valores]    Script Date: 23/10/2025 18:15:27 ******/
ALTER TABLE [dbo].[documentos_valores_personalizados] ADD  CONSTRAINT [UQ_documentos_valores] UNIQUE NONCLUSTERED 
(
	[documento_id] ASC,
	[codigo_campo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_empregos_funcionario]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_empregos_funcionario] ON [dbo].[empregos]
(
	[funcionario_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_empregos_situacao]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_empregos_situacao] ON [dbo].[empregos]
(
	[situacao] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_empregos_valores]    Script Date: 23/10/2025 18:15:27 ******/
ALTER TABLE [dbo].[empregos_valores_personalizados] ADD  CONSTRAINT [UQ_empregos_valores] UNIQUE NONCLUSTERED 
(
	[emprego_id] ASC,
	[codigo_campo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_empresas_codigo]    Script Date: 23/10/2025 18:15:27 ******/
ALTER TABLE [dbo].[empresas] ADD  CONSTRAINT [UQ_empresas_codigo] UNIQUE NONCLUSTERED 
(
	[codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_empresas_ativo]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_empresas_ativo] ON [dbo].[empresas]
(
	[ativo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_empresas_codigo]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_empresas_codigo] ON [dbo].[empresas]
(
	[codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_equipamentos_numero_interno]    Script Date: 23/10/2025 18:15:27 ******/
ALTER TABLE [dbo].[equipamentos] ADD  CONSTRAINT [UQ_equipamentos_numero_interno] UNIQUE NONCLUSTERED 
(
	[numero_interno] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_equipamentos_empresa]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_equipamentos_empresa] ON [dbo].[equipamentos]
(
	[empresa_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_equipamentos_estado]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_equipamentos_estado] ON [dbo].[equipamentos]
(
	[estado] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_equipamentos_modelo]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_equipamentos_modelo] ON [dbo].[equipamentos]
(
	[modelo_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_equipamentos_numero_serie]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_equipamentos_numero_serie] ON [dbo].[equipamentos]
(
	[numero_serie] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_equipamentos_valores]    Script Date: 23/10/2025 18:15:27 ******/
ALTER TABLE [dbo].[equipamentos_valores_personalizados] ADD  CONSTRAINT [UQ_equipamentos_valores] UNIQUE NONCLUSTERED 
(
	[equipamento_id] ASC,
	[codigo_campo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_funcionarios_empresa]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_funcionarios_empresa] ON [dbo].[funcionarios]
(
	[empresa_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_funcionarios_nome]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_funcionarios_nome] ON [dbo].[funcionarios]
(
	[nome_completo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_funcionarios_numero]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_funcionarios_numero] ON [dbo].[funcionarios]
(
	[numero] ASC
)
WHERE ([numero] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_funcionarios_tipo]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_funcionarios_tipo] ON [dbo].[funcionarios]
(
	[tipo_funcionario_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_funcionarios_valores]    Script Date: 23/10/2025 18:15:27 ******/
ALTER TABLE [dbo].[funcionarios_valores_personalizados] ADD  CONSTRAINT [UQ_funcionarios_valores] UNIQUE NONCLUSTERED 
(
	[funcionario_id] ASC,
	[codigo_campo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_funcionarios_valores_campo]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_funcionarios_valores_campo] ON [dbo].[funcionarios_valores_personalizados]
(
	[codigo_campo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_funcionarios_valores_funcionario]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_funcionarios_valores_funcionario] ON [dbo].[funcionarios_valores_personalizados]
(
	[funcionario_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_intervencoes_numero]    Script Date: 23/10/2025 18:15:27 ******/
ALTER TABLE [dbo].[intervencoes] ADD  CONSTRAINT [UQ_intervencoes_numero] UNIQUE NONCLUSTERED 
(
	[numero_intervencao] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_intervencoes_data_inicio]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_intervencoes_data_inicio] ON [dbo].[intervencoes]
(
	[data_inicio] DESC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_intervencoes_equipamento]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_intervencoes_equipamento] ON [dbo].[intervencoes]
(
	[equipamento_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_intervencoes_status]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_intervencoes_status] ON [dbo].[intervencoes]
(
	[status] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_intervencoes_ticket]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_intervencoes_ticket] ON [dbo].[intervencoes]
(
	[ticket_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_intervencoes_tipo]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_intervencoes_tipo] ON [dbo].[intervencoes]
(
	[tipo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_intervencoes_anexos_intervencao]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_intervencoes_anexos_intervencao] ON [dbo].[intervencoes_anexos]
(
	[intervencao_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_intervencoes_anexos_tipo]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_intervencoes_anexos_tipo] ON [dbo].[intervencoes_anexos]
(
	[tipo_documento] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_marcas_nome]    Script Date: 23/10/2025 18:15:27 ******/
ALTER TABLE [dbo].[marcas] ADD  CONSTRAINT [UQ_marcas_nome] UNIQUE NONCLUSTERED 
(
	[nome] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_modelos_equipamento_categoria]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_modelos_equipamento_categoria] ON [dbo].[modelos_equipamento]
(
	[categoria_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_modelos_equipamento_marca]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_modelos_equipamento_marca] ON [dbo].[modelos_equipamento]
(
	[marca_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_permissoes_codigo]    Script Date: 23/10/2025 18:15:27 ******/
ALTER TABLE [dbo].[permissoes] ADD  CONSTRAINT [UQ_permissoes_codigo] UNIQUE NONCLUSTERED 
(
	[codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_tags_slug]    Script Date: 23/10/2025 18:15:27 ******/
ALTER TABLE [dbo].[tags] ADD  CONSTRAINT [UQ_tags_slug] UNIQUE NONCLUSTERED 
(
	[slug] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_tickets_numero]    Script Date: 23/10/2025 18:15:27 ******/
ALTER TABLE [dbo].[tickets] ADD  CONSTRAINT [UQ_tickets_numero] UNIQUE NONCLUSTERED 
(
	[numero_ticket] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_tickets_atribuido]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_tickets_atribuido] ON [dbo].[tickets]
(
	[atribuido_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_tickets_data_abertura]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_tickets_data_abertura] ON [dbo].[tickets]
(
	[data_abertura] DESC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_tickets_empresa]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_tickets_empresa] ON [dbo].[tickets]
(
	[empresa_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_tickets_prioridade]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_tickets_prioridade] ON [dbo].[tickets]
(
	[prioridade] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_tickets_solicitante]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_tickets_solicitante] ON [dbo].[tickets]
(
	[solicitante_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_tickets_status]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_tickets_status] ON [dbo].[tickets]
(
	[status] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_tickets_historico_ticket]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_tickets_historico_ticket] ON [dbo].[tickets_historico]
(
	[ticket_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_tipos_conteudo_codigo]    Script Date: 23/10/2025 18:15:27 ******/
ALTER TABLE [dbo].[tipos_conteudo] ADD  CONSTRAINT [UQ_tipos_conteudo_codigo] UNIQUE NONCLUSTERED 
(
	[codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_tipos_funcionarios_codigo]    Script Date: 23/10/2025 18:15:27 ******/
ALTER TABLE [dbo].[tipos_funcionarios] ADD  CONSTRAINT [UQ_tipos_funcionarios_codigo] UNIQUE NONCLUSTERED 
(
	[codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ_utilizador_empresa]    Script Date: 23/10/2025 18:15:27 ******/
ALTER TABLE [dbo].[utilizador_empresa] ADD  CONSTRAINT [UQ_utilizador_empresa] UNIQUE NONCLUSTERED 
(
	[utilizador_id] ASC,
	[empresa_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_utilizador_empresa_empresa]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_utilizador_empresa_empresa] ON [dbo].[utilizador_empresa]
(
	[empresa_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_utilizador_empresa_utilizador]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_utilizador_empresa_utilizador] ON [dbo].[utilizador_empresa]
(
	[utilizador_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_utilizadores_email]    Script Date: 23/10/2025 18:15:27 ******/
ALTER TABLE [dbo].[utilizadores] ADD  CONSTRAINT [UQ_utilizadores_email] UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_utilizadores_username]    Script Date: 23/10/2025 18:15:27 ******/
ALTER TABLE [dbo].[utilizadores] ADD  CONSTRAINT [UQ_utilizadores_username] UNIQUE NONCLUSTERED 
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_utilizadores_email]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_utilizadores_email] ON [dbo].[utilizadores]
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_utilizadores_funcionario]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_utilizadores_funcionario] ON [dbo].[utilizadores]
(
	[funcionario_id] ASC
)
WHERE ([funcionario_id] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_veiculos_empresa]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_veiculos_empresa] ON [dbo].[veiculos]
(
	[empresa_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_veiculos_matricula]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_veiculos_matricula] ON [dbo].[veiculos]
(
	[matricula] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_veiculos_numero_interno]    Script Date: 23/10/2025 18:15:27 ******/
CREATE NONCLUSTERED INDEX [IX_veiculos_numero_interno] ON [dbo].[veiculos]
(
	[numero_interno] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_veiculos_valores]    Script Date: 23/10/2025 18:15:27 ******/
ALTER TABLE [dbo].[veiculos_valores_personalizados] ADD  CONSTRAINT [UQ_veiculos_valores] UNIQUE NONCLUSTERED 
(
	[veiculo_id] ASC,
	[codigo_campo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
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
ALTER TABLE [dbo].[conteudo_empresa] ADD  CONSTRAINT [DF_conteudo_empresa_criado_em]  DEFAULT (getdate()) FOR [criado_em]
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
ALTER TABLE [dbo].[intervencoes_pecas] ADD  CONSTRAINT [DF_intervencoes_pecas_quantidade]  DEFAULT ((1)) FOR [quantidade]
GO
ALTER TABLE [dbo].[intervencoes_pecas] ADD  CONSTRAINT [DF_intervencoes_pecas_criado_em]  DEFAULT (getdate()) FOR [criado_em]
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
ALTER TABLE [dbo].[conteudo_empresa]  WITH CHECK ADD  CONSTRAINT [FK_conteudo_empresa_conteudo] FOREIGN KEY([conteudo_id])
REFERENCES [dbo].[conteudos] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[conteudo_empresa] CHECK CONSTRAINT [FK_conteudo_empresa_conteudo]
GO
ALTER TABLE [dbo].[conteudo_empresa]  WITH CHECK ADD  CONSTRAINT [FK_conteudo_empresa_empresa] FOREIGN KEY([empresa_id])
REFERENCES [dbo].[empresas] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[conteudo_empresa] CHECK CONSTRAINT [FK_conteudo_empresa_empresa]
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
ALTER TABLE [dbo].[documentos]  WITH CHECK ADD  CONSTRAINT [FK_documentos_anexo] FOREIGN KEY([anexo_id])
REFERENCES [dbo].[anexos] ([id])
GO
ALTER TABLE [dbo].[documentos] CHECK CONSTRAINT [FK_documentos_anexo]
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
REFERENCES [dbo].[utilizadores] ([id])
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
ALTER TABLE [dbo].[intervencoes_pecas]  WITH CHECK ADD  CONSTRAINT [FK_intervencoes_pecas_intervencao] FOREIGN KEY([intervencao_id])
REFERENCES [dbo].[intervencoes] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[intervencoes_pecas] CHECK CONSTRAINT [FK_intervencoes_pecas_intervencao]
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
ALTER TABLE [dbo].[documentos]  WITH CHECK ADD  CONSTRAINT [CHK_documentos_tipo] CHECK  (([tipo]='Outro' OR [tipo]='Diploma' OR [tipo]='Certificado' OR [tipo]='Cartão Utente' OR [tipo]='Carta de Condução' OR [tipo]='Passaporte' OR [tipo]='BI'))
GO
ALTER TABLE [dbo].[documentos] CHECK CONSTRAINT [CHK_documentos_tipo]
GO
ALTER TABLE [dbo].[empregos]  WITH CHECK ADD  CONSTRAINT [CHK_empregos_situacao] CHECK  (([situacao]='Desligado' OR [situacao]='Afastado' OR [situacao]='Licença' OR [situacao]='Férias' OR [situacao]='Ativo'))
GO
ALTER TABLE [dbo].[empregos] CHECK CONSTRAINT [CHK_empregos_situacao]
GO
ALTER TABLE [dbo].[empregos]  WITH CHECK ADD  CONSTRAINT [CHK_empregos_tipo_contrato] CHECK  (([tipo_contrato]='Outro' OR [tipo_contrato]='Prestação de Serviços' OR [tipo_contrato]='Estágio' OR [tipo_contrato]='Temporário' OR [tipo_contrato]='Efetivo'))
GO
ALTER TABLE [dbo].[empregos] CHECK CONSTRAINT [CHK_empregos_tipo_contrato]
GO
ALTER TABLE [dbo].[enderecos]  WITH CHECK ADD  CONSTRAINT [CHK_enderecos_tipo] CHECK  (([tipo]='correspondencia' OR [tipo]='comercial' OR [tipo]='residencial'))
GO
ALTER TABLE [dbo].[enderecos] CHECK CONSTRAINT [CHK_enderecos_tipo]
GO
ALTER TABLE [dbo].[equipamentos]  WITH CHECK ADD  CONSTRAINT [CHK_equipamentos_estado] CHECK  (([estado]='em_transito' OR [estado]='reserva' OR [estado]='baixa' OR [estado]='avariado' OR [estado]='manutencao' OR [estado]='operacional'))
GO
ALTER TABLE [dbo].[equipamentos] CHECK CONSTRAINT [CHK_equipamentos_estado]
GO
ALTER TABLE [dbo].[funcionarios]  WITH CHECK ADD  CONSTRAINT [CHK_funcionarios_estado_civil] CHECK  (([estado_civil]='Outro' OR [estado_civil]='União de Facto' OR [estado_civil]='Viúvo' OR [estado_civil]='Divorciado' OR [estado_civil]='Casado' OR [estado_civil]='Solteiro'))
GO
ALTER TABLE [dbo].[funcionarios] CHECK CONSTRAINT [CHK_funcionarios_estado_civil]
GO
ALTER TABLE [dbo].[funcionarios]  WITH CHECK ADD  CONSTRAINT [CHK_funcionarios_sexo] CHECK  (([sexo]='Não declarado' OR [sexo]='Outro' OR [sexo]='Feminino' OR [sexo]='Masculino'))
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
ALTER TABLE [dbo].[veiculos]  WITH CHECK ADD  CONSTRAINT [CHK_veiculos_combustivel] CHECK  (([combustivel]='Outro' OR [combustivel]='GPL' OR [combustivel]='GNC' OR [combustivel]='Híbrido' OR [combustivel]='Elétrico' OR [combustivel]='Diesel' OR [combustivel]='Gasolina'))
GO
ALTER TABLE [dbo].[veiculos] CHECK CONSTRAINT [CHK_veiculos_combustivel]
GO
ALTER TABLE [dbo].[veiculos]  WITH CHECK ADD  CONSTRAINT [CHK_veiculos_tipo] CHECK  (([tipo]='Outro' OR [tipo]='Moto' OR [tipo]='Ligeiro' OR [tipo]='Autocarro'))
GO
ALTER TABLE [dbo].[veiculos] CHECK CONSTRAINT [CHK_veiculos_tipo]
GO
/****** Object:  StoredProcedure [dbo].[sp_AdicionarComentarioTicket]    Script Date: 23/10/2025 18:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedure: Adicionar Comentário ao Ticket
CREATE   PROCEDURE [dbo].[sp_AdicionarComentarioTicket]
    @TicketId INT,
    @UtilizadorId INT,
    @Comentario NVARCHAR(1000),
    @VisivelCliente BIT = 1
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO [dbo].[tickets_historico]
        (ticket_id, utilizador_id, tipo_acao, descricao, visivel_cliente)
    VALUES
        (@TicketId, @UtilizadorId, 'comentario', @Comentario, @VisivelCliente);
    
    UPDATE [dbo].[tickets]
    SET atualizado_em = GETDATE()
    WHERE id = @TicketId;
    
    SELECT 'SUCCESS' AS Status, SCOPE_IDENTITY() AS HistoricoId;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_AssociarUtilizadorEmpresa]    Script Date: 23/10/2025 18:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedure: Associar Utilizador a Empresa
CREATE   PROCEDURE [dbo].[sp_AssociarUtilizadorEmpresa]
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
/****** Object:  StoredProcedure [dbo].[sp_AtribuirTicket]    Script Date: 23/10/2025 18:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedure: Atribuir Ticket
CREATE   PROCEDURE [dbo].[sp_AtribuirTicket]
    @TicketId INT,
    @AtribuidoId INT,
    @UtilizadorId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @StatusAtual NVARCHAR(30);
    DECLARE @AtribuidoUsername NVARCHAR(100);
    
    SELECT @StatusAtual = status FROM [dbo].[tickets] WHERE id = @TicketId;
    SELECT @AtribuidoUsername = username FROM [dbo].[utilizadores] WHERE id = @AtribuidoId;
    
    UPDATE [dbo].[tickets]
    SET 
        atribuido_id = @AtribuidoId,
        status = CASE WHEN @StatusAtual = 'aberto' THEN 'em_andamento' ELSE @StatusAtual END,
        atualizado_em = GETDATE()
    WHERE id = @TicketId;
    
    INSERT INTO [dbo].[tickets_historico]
        (ticket_id, utilizador_id, tipo_acao, descricao, valor_novo)
    VALUES
        (@TicketId, @UtilizadorId, 'atribuicao', 
         'Ticket atribuído a ' + @AtribuidoUsername,
         CAST(@AtribuidoId AS NVARCHAR));
    
    SELECT 'SUCCESS' AS Status;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_AtualizarStatusTicket]    Script Date: 23/10/2025 18:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedure: Atualizar Status do Ticket
CREATE   PROCEDURE [dbo].[sp_AtualizarStatusTicket]
    @TicketId INT,
    @NovoStatus NVARCHAR(30),
    @UtilizadorId INT,
    @Comentario NVARCHAR(1000) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    BEGIN TRY
        DECLARE @StatusAnterior NVARCHAR(30);
        DECLARE @DataConclusao DATETIME2 = NULL;
        DECLARE @TempoResolucao INT = NULL;
        
        SELECT @StatusAnterior = status FROM [dbo].[tickets] WHERE id = @TicketId;
        
        -- Se estiver fechando, calcular tempo de resolução
        IF @NovoStatus IN ('resolvido', 'fechado')
        BEGIN
            SET @DataConclusao = GETDATE();
            
            SELECT @TempoResolucao = DATEDIFF(MINUTE, data_abertura, @DataConclusao)
            FROM [dbo].[tickets]
            WHERE id = @TicketId;
        END
        
        -- Atualizar ticket
        UPDATE [dbo].[tickets]
        SET 
            status = @NovoStatus,
            data_conclusao = @DataConclusao,
            tempo_resolucao_minutos = @TempoResolucao,
            atualizado_em = GETDATE()
        WHERE id = @TicketId;
        
        -- Registrar no histórico
        INSERT INTO [dbo].[tickets_historico]
            (ticket_id, utilizador_id, tipo_acao, descricao, valor_anterior, valor_novo, visivel_cliente)
        VALUES
            (@TicketId, @UtilizadorId, 'status_alterado', @Comentario, @StatusAnterior, @NovoStatus, 1);
        
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
/****** Object:  StoredProcedure [dbo].[sp_AvaliarTicket]    Script Date: 23/10/2025 18:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedure: Avaliar Ticket
CREATE   PROCEDURE [dbo].[sp_AvaliarTicket]
    @TicketId INT,
    @UtilizadorId INT,
    @Avaliacao INT,
    @Comentario NVARCHAR(1000) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE [dbo].[tickets]
    SET 
        avaliacao = @Avaliacao,
        comentario_avaliacao = @Comentario,
        atualizado_em = GETDATE()
    WHERE id = @TicketId;
    
    INSERT INTO [dbo].[tickets_historico]
        (ticket_id, utilizador_id, tipo_acao, descricao, valor_novo, visivel_cliente)
    VALUES
        (@TicketId, @UtilizadorId, 'avaliacao', @Comentario, CAST(@Avaliacao AS NVARCHAR), 0);
    
    SELECT 'SUCCESS' AS Status;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_CompartilharConteudoEmpresas]    Script Date: 23/10/2025 18:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedure: Compartilhar Conteúdo com Empresas
CREATE   PROCEDURE [dbo].[sp_CompartilharConteudoEmpresas]
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
/****** Object:  StoredProcedure [dbo].[sp_ConcluirIntervencao]    Script Date: 23/10/2025 18:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedure: Concluir Intervenção
CREATE   PROCEDURE [dbo].[sp_ConcluirIntervencao]
    @IntervencaoId INT,
    @Diagnostico NVARCHAR(MAX) = NULL,
    @Solucao NVARCHAR(MAX) = NULL,
    @DataFim DATETIME2 = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @DataFim IS NULL
        SET @DataFim = GETDATE();
    
    DECLARE @DataInicio DATETIME2;
    DECLARE @Duracao INT;
    
    SELECT @DataInicio = data_inicio FROM [dbo].[intervencoes] WHERE id = @IntervencaoId;
    SET @Duracao = DATEDIFF(MINUTE, @DataInicio, @DataFim);
    
    UPDATE [dbo].[intervencoes]
    SET 
        diagnostico = @Diagnostico,
        solucao = @Solucao,
        data_fim = @DataFim,
        duracao_minutos = @Duracao,
        status = 'concluida',
        atualizado_em = GETDATE()
    WHERE id = @IntervencaoId;
    
    SELECT 'SUCCESS' AS Status;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_CriarConteudoCompleto]    Script Date: 23/10/2025 18:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[sp_CriarConteudoCompleto]
    @TipoConteudoId INT,
    @CategoriaId INT = NULL,
    @Titulo NVARCHAR(255),
    @Slug NVARCHAR(255) = NULL,
    @Subtitulo NVARCHAR(500) = NULL,
    @Resumo NVARCHAR(1000) = NULL,
    @Conteudo NVARCHAR(MAX) = NULL,
    @ImagemDestaque NVARCHAR(500) = NULL,
    @AutorId INT,
    @Status NVARCHAR(20) = 'rascunho',
    @Destaque BIT = 0,
    @PermiteComentarios BIT = 1,
    @DataInicio DATETIME2 = NULL,
    @DataFim DATETIME2 = NULL,
    @Tags NVARCHAR(MAX) = NULL, -- JSON array: ["tag1", "tag2"]
    @AnexosIds NVARCHAR(MAX) = NULL, -- JSON array: [1, 2, 3]
    @CamposPersonalizados NVARCHAR(MAX) = NULL, -- JSON
    @MetaTitle NVARCHAR(255) = NULL,
    @MetaDescription NVARCHAR(500) = NULL,
    @MetaKeywords NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    DECLARE @ConteudoId INT;
    DECLARE @PublicadoEm DATETIME2 = CASE WHEN @Status = 'publicado' THEN GETDATE() ELSE NULL END;

    BEGIN TRY
        -- Gerar slug se não fornecido
        IF @Slug IS NULL OR @Slug = ''
        BEGIN
            SET @Slug = LOWER(REPLACE(REPLACE(REPLACE(@Titulo, ' ', '-'), 'ç', 'c'), 'ã', 'a'));
            -- Remover caracteres especiais
            SET @Slug = REPLACE(REPLACE(REPLACE(REPLACE(@Slug, 'á', 'a'), 'é', 'e'), 'í', 'i'), 'ó', 'o');
            SET @Slug = REPLACE(@Slug, 'ú', 'u');
        END

        -- Inserir conteúdo
        INSERT INTO [dbo].[conteudos]
            (tipo_conteudo_id, categoria_id, titulo, slug, subtitulo, resumo, conteudo,
             imagem_destaque, autor_id, status, destaque, permite_comentarios,
             data_inicio, data_fim, meta_title, meta_description, meta_keywords, publicado_em)
        VALUES
            (@TipoConteudoId, @CategoriaId, @Titulo, @Slug, @Subtitulo, @Resumo, @Conteudo,
             @ImagemDestaque, @AutorId, @Status, @Destaque, @PermiteComentarios,
             @DataInicio, @DataFim, @MetaTitle, @MetaDescription, @MetaKeywords, @PublicadoEm);

        SET @ConteudoId = SCOPE_IDENTITY();

        -- Processar Tags
        IF @Tags IS NOT NULL
        BEGIN
            DECLARE @TagNome NVARCHAR(50);
            DECLARE @TagId INT;

            DECLARE tag_cursor CURSOR FOR
            SELECT value FROM OPENJSON(@Tags);

            OPEN tag_cursor;
            FETCH NEXT FROM tag_cursor INTO @TagNome;

            WHILE @@FETCH_STATUS = 0
            BEGIN
                -- Verificar se tag existe, senão criar
                SELECT @TagId = id FROM [dbo].[tags] WHERE nome = @TagNome;

                IF @TagId IS NULL
                BEGIN
                    INSERT INTO [dbo].[tags] (nome, slug)
                    VALUES (@TagNome, LOWER(REPLACE(@TagNome, ' ', '-')));
                    SET @TagId = SCOPE_IDENTITY();
                END

                -- Associar tag ao conteúdo
                IF NOT EXISTS (SELECT 1 FROM [dbo].[conteudo_tag] WHERE conteudo_id = @ConteudoId AND tag_id = @TagId)
                BEGIN
                    INSERT INTO [dbo].[conteudo_tag] (conteudo_id, tag_id) VALUES (@ConteudoId, @TagId);
                END

                FETCH NEXT FROM tag_cursor INTO @TagNome;
            END

            CLOSE tag_cursor;
            DEALLOCATE tag_cursor;
        END

        -- Processar Anexos
        IF @AnexosIds IS NOT NULL
        BEGIN
            DECLARE @AnexoId INT;
            DECLARE @Ordem INT = 0;

            INSERT INTO [dbo].[conteudo_anexo] (conteudo_id, anexo_id, tipo_anexo, ordem, principal)
            SELECT
                @ConteudoId,
                CAST(value AS INT),
                CASE
                    WHEN a.tipo IN ('jpg', 'jpeg', 'png', 'gif') THEN 'imagem'
                    WHEN a.tipo IN ('mp4', 'avi', 'mov') THEN 'video'
                    WHEN a.tipo IN ('mp3', 'wav') THEN 'audio'
                    ELSE 'documento'
                END,
                ROW_NUMBER() OVER (ORDER BY (SELECT NULL)),
                CASE WHEN ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) = 1 THEN 1 ELSE 0 END
            FROM OPENJSON(@AnexosIds) j
            INNER JOIN [dbo].[anexos] a ON a.id = CAST(j.value AS INT);
        END

        -- Processar Campos Personalizados
        IF @CamposPersonalizados IS NOT NULL AND @CamposPersonalizados != '[]'
        BEGIN
            INSERT INTO [dbo].[conteudos_valores_personalizados]
                (conteudo_id, codigo_campo, valor_texto, valor_numero, valor_data, valor_datetime, valor_boolean, valor_json)
            SELECT
                @ConteudoId,
                JSON_VALUE(value, '$.codigo'),
                CASE WHEN JSON_VALUE(value, '$.tipo') IN ('texto', 'textarea', 'select', 'radio', 'email', 'phone', 'url', 'text')
                     THEN CAST(JSON_VALUE(value, '$.valor') AS NVARCHAR(MAX)) END,
                CASE WHEN JSON_VALUE(value, '$.tipo') IN ('numero', 'number', 'decimal')
                     THEN TRY_CAST(JSON_VALUE(value, '$.valor') AS DECIMAL(18,4)) END,
                CASE WHEN JSON_VALUE(value, '$.tipo') = 'data' OR JSON_VALUE(value, '$.tipo') = 'date'
                     THEN TRY_CAST(JSON_VALUE(value, '$.valor') AS DATE) END,
                CASE WHEN JSON_VALUE(value, '$.tipo') = 'datetime' OR JSON_VALUE(value, '$.tipo') = 'datetime-local'
                     THEN TRY_CAST(JSON_VALUE(value, '$.valor') AS DATETIME2) END,
                CASE WHEN JSON_VALUE(value, '$.tipo') IN ('boolean', 'checkbox')
                     THEN TRY_CAST(JSON_VALUE(value, '$.valor') AS BIT) END,
                CASE WHEN JSON_VALUE(value, '$.tipo') = 'json'
                     THEN JSON_QUERY(value, '$.valor') END
            FROM OPENJSON(@CamposPersonalizados)
            WHERE JSON_VALUE(value, '$.codigo') IS NOT NULL;
        END

        COMMIT TRANSACTION;

        SELECT
            'SUCCESS' AS Status,
            @ConteudoId AS ConteudoId,
            @Slug AS Slug;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        SELECT
            'ERROR' AS Status,
            ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[sp_CriarIntervencao]    Script Date: 23/10/2025 18:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************************/
/* STORED PROCEDURES - INTERVENÇÕES                                         */
/******************************************************************************/

-- Procedure: Criar Intervenção
CREATE   PROCEDURE [dbo].[sp_CriarIntervencao]
    @TicketId INT = NULL,
    @EquipamentoId INT,
    @Tipo NVARCHAR(50),
    @Titulo NVARCHAR(255),
    @Descricao NVARCHAR(MAX) = NULL,
    @TecnicoId INT,
    @DataInicio DATETIME2,
    @DataFim DATETIME2 = NULL,
    @Pecas NVARCHAR(MAX) = NULL, -- JSON: [{"descricao":"...","quantidade":1,"valor":10}]
    @CustoMaoObra DECIMAL(18,2) = NULL,
    @AnexosIds NVARCHAR(MAX) = NULL -- JSON: [{"anexo_id":1,"tipo_documento":"fatura"}]
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    DECLARE @IntervencaoId INT;
    DECLARE @NumeroIntervencao NVARCHAR(50);
    DECLARE @CustoPecas DECIMAL(18,2) = 0;
    DECLARE @CustoTotal DECIMAL(18,2) = 0;
    
    BEGIN TRY
        -- Gerar número da intervenção
        DECLARE @ProximoNumero INT;
        SELECT @ProximoNumero = ISNULL(MAX(CAST(SUBSTRING(numero_intervencao, 4, LEN(numero_intervencao)) AS INT)), 0) + 1
        FROM [dbo].[intervencoes]
        WHERE numero_intervencao LIKE 'INT%';
        
        SET @NumeroIntervencao = 'INT' + RIGHT('00000' + CAST(@ProximoNumero AS NVARCHAR), 5);
        
        -- Calcular duração
        DECLARE @Duracao INT = NULL;
        IF @DataFim IS NOT NULL
            SET @Duracao = DATEDIFF(MINUTE, @DataInicio, @DataFim);
        
        -- Inserir intervenção
        INSERT INTO [dbo].[intervencoes]
            (ticket_id, equipamento_id, tipo, numero_intervencao, titulo, descricao,
             tecnico_id, data_inicio, data_fim, duracao_minutos, custo_mao_obra, status)
        VALUES
            (@TicketId, @EquipamentoId, @Tipo, @NumeroIntervencao, @Titulo, @Descricao,
             @TecnicoId, @DataInicio, @DataFim, @Duracao, @CustoMaoObra, 
             CASE WHEN @DataFim IS NULL THEN 'em_andamento' ELSE 'concluida' END);
        
        SET @IntervencaoId = SCOPE_IDENTITY();
        
        -- Processar peças
        IF @Pecas IS NOT NULL
        BEGIN
            INSERT INTO [dbo].[intervencoes_pecas]
                (intervencao_id, descricao, codigo_peca, quantidade, valor_unitario, valor_total, fornecedor)
            SELECT 
                @IntervencaoId,
                JSON_VALUE(value, '$.descricao'),
                JSON_VALUE(value, '$.codigo_peca'),
                CAST(JSON_VALUE(value, '$.quantidade') AS INT),
                CAST(JSON_VALUE(value, '$.valor_unitario') AS DECIMAL(18,2)),
                CAST(JSON_VALUE(value, '$.quantidade') AS INT) * CAST(JSON_VALUE(value, '$.valor_unitario') AS DECIMAL(18,2)),
                JSON_VALUE(value, '$.fornecedor')
            FROM OPENJSON(@Pecas);
            
            SELECT @CustoPecas = ISNULL(SUM(valor_total), 0)
            FROM [dbo].[intervencoes_pecas]
            WHERE intervencao_id = @IntervencaoId;
        END
        
        -- Processar anexos
        IF @AnexosIds IS NOT NULL
        BEGIN
            INSERT INTO [dbo].[intervencoes_anexos]
                (intervencao_id, anexo_id, tipo_documento, descricao)
            SELECT 
                @IntervencaoId,
                CAST(JSON_VALUE(value, '$.anexo_id') AS INT),
                JSON_VALUE(value, '$.tipo_documento'),
                JSON_VALUE(value, '$.descricao')
            FROM OPENJSON(@AnexosIds);
        END
        
        -- Calcular custo total e atualizar
        SET @CustoTotal = ISNULL(@CustoMaoObra, 0) + @CustoPecas;
        
        UPDATE [dbo].[intervencoes]
        SET 
            custo_pecas = @CustoPecas,
            custo_total = @CustoTotal
        WHERE id = @IntervencaoId;
        
        -- Se tiver ticket, atualizar status
        IF @TicketId IS NOT NULL AND @DataFim IS NOT NULL
        BEGIN
            UPDATE [dbo].[tickets]
            SET status = 'resolvido'
            WHERE id = @TicketId AND status NOT IN ('fechado', 'cancelado');
        END
        
        COMMIT TRANSACTION;
        
        SELECT 
            'SUCCESS' AS Status,
            @IntervencaoId AS IntervencaoId,
            @NumeroIntervencao AS NumeroIntervencao;
            
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        SELECT 'ERROR' AS Status, ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[sp_CriarTicket]    Script Date: 23/10/2025 18:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/******************************************************************************/
/* STORED PROCEDURES - TICKETS                                              */
/******************************************************************************/

-- Procedure: Criar Ticket
CREATE   PROCEDURE [dbo].[sp_CriarTicket]
    @EmpresaId INT = NULL,
    @TipoTicketId INT,
    @EquipamentoId INT = NULL,
    @Titulo NVARCHAR(255),
    @Descricao NVARCHAR(MAX),
    @Prioridade NVARCHAR(20) = 'media',
    @Localizacao NVARCHAR(255) = NULL,
    @SolicitanteId INT,
    @AtribuidoId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    DECLARE @TicketId INT;
    DECLARE @NumeroTicket NVARCHAR(50);
    DECLARE @DataPrevista DATETIME2;
    
    BEGIN TRY
        -- Gerar número do ticket
        DECLARE @ProximoNumero INT;
        SELECT @ProximoNumero = ISNULL(MAX(CAST(SUBSTRING(numero_ticket, 4, LEN(numero_ticket)) AS INT)), 0) + 1
        FROM [dbo].[tickets]
        WHERE numero_ticket LIKE 'TKT%';
        
        SET @NumeroTicket = 'TKT' + RIGHT('00000' + CAST(@ProximoNumero AS NVARCHAR), 5);
        
        -- Calcular data prevista baseado no SLA
        DECLARE @SlaHoras INT;
        SELECT @SlaHoras = sla_horas FROM [dbo].[tipos_ticket] WHERE id = @TipoTicketId;
        
        IF @SlaHoras IS NOT NULL
            SET @DataPrevista = DATEADD(HOUR, @SlaHoras, GETDATE());
        
        -- Inserir ticket
        INSERT INTO [dbo].[tickets]
            (empresa_id, numero_ticket, tipo_ticket_id, equipamento_id, titulo, descricao,
             prioridade, status, solicitante_id, atribuido_id, localizacao, data_prevista)
        VALUES
            (@EmpresaId, @NumeroTicket, @TipoTicketId, @EquipamentoId, @Titulo, @Descricao,
             @Prioridade, 'aberto', @SolicitanteId, @AtribuidoId, @Localizacao, @DataPrevista);
        
        SET @TicketId = SCOPE_IDENTITY();
        
        -- Registrar no histórico
        INSERT INTO [dbo].[tickets_historico]
            (ticket_id, utilizador_id, tipo_acao, descricao)
        VALUES
            (@TicketId, @SolicitanteId, 'comentario', 'Ticket criado');
        
        COMMIT TRANSACTION;
        
        SELECT 
            'SUCCESS' AS Status,
            @TicketId AS TicketId,
            @NumeroTicket AS NumeroTicket;
            
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        SELECT 
            'ERROR' AS Status,
            ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[sp_ListarFuncionariosComAcesso]    Script Date: 23/10/2025 18:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedure: Listar Funcionários (com filtro de empresa)
CREATE   PROCEDURE [dbo].[sp_ListarFuncionariosComAcesso]
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
/****** Object:  StoredProcedure [dbo].[sp_ListarTickets]    Script Date: 23/10/2025 18:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedure: Listar Tickets (com filtros)
CREATE   PROCEDURE [dbo].[sp_ListarTickets]
    @UtilizadorId INT,
    @EmpresaId INT = NULL,
    @Status NVARCHAR(30) = NULL,
    @Prioridade NVARCHAR(20) = NULL,
    @AtribuidoId INT = NULL,
    @MeusTickets BIT = 0,
    @PageNumber INT = 1,
    @PageSize INT = 50
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    
    SELECT 
        t.id,
        t.numero_ticket,
        t.titulo,
        t.descricao,
        t.prioridade,
        t.status,
        t.data_abertura,
        t.data_prevista,
        t.data_conclusao,
        CASE 
            WHEN t.data_prevista < GETDATE() AND t.status NOT IN ('resolvido', 'fechado', 'cancelado') 
            THEN 1 ELSE 0 
        END AS atrasado,
        tt.nome AS tipo_ticket,
        tt.cor AS tipo_cor,
        e.numero_interno AS equipamento,
        eq.nome AS empresa_nome,
        sol.username AS solicitante_nome,
        sol.foto_url AS solicitante_foto,
        atr.username AS atribuido_nome,
        atr.foto_url AS atribuido_foto,
        (SELECT COUNT(*) FROM [dbo].[tickets_historico] WHERE ticket_id = t.id) AS total_comentarios
    FROM [dbo].[tickets] t
    INNER JOIN [dbo].[tipos_ticket] tt ON t.tipo_ticket_id = tt.id
    LEFT JOIN [dbo].[equipamentos] e ON t.equipamento_id = e.id
    LEFT JOIN [dbo].[empresas] eq ON t.empresa_id = eq.id
    INNER JOIN [dbo].[utilizadores] sol ON t.solicitante_id = sol.id
    LEFT JOIN [dbo].[utilizadores] atr ON t.atribuido_id = atr.id
    WHERE 
        (@EmpresaId IS NULL OR t.empresa_id = @EmpresaId)
        AND (@Status IS NULL OR t.status = @Status)
        AND (@Prioridade IS NULL OR t.prioridade = @Prioridade)
        AND (@AtribuidoId IS NULL OR t.atribuido_id = @AtribuidoId)
        AND (@MeusTickets = 0 OR t.solicitante_id = @UtilizadorId OR t.atribuido_id = @UtilizadorId)
    ORDER BY 
        CASE t.prioridade 
            WHEN 'urgente' THEN 1 
            WHEN 'alta' THEN 2 
            WHEN 'media' THEN 3 
            ELSE 4 
        END,
        t.data_abertura DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_ObterEmpresasUtilizador]    Script Date: 23/10/2025 18:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************************/
/* STORED PROCEDURES COM CONTROLO DE ACESSO                                 */
/******************************************************************************/

-- Procedure: Obter Empresas do Utilizador
CREATE   PROCEDURE [dbo].[sp_ObterEmpresasUtilizador]
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
/****** Object:  StoredProcedure [dbo].[sp_ObterTicketDetalhes]    Script Date: 23/10/2025 18:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedure: Obter Detalhes do Ticket
CREATE   PROCEDURE [dbo].[sp_ObterTicketDetalhes]
    @TicketId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Dados do ticket
    SELECT 
        t.*,
        tt.nome AS tipo_ticket_nome,
        tt.sla_horas,
        e.numero_interno AS equipamento_numero,
        e.descricao AS equipamento_descricao,
        m.nome AS equipamento_modelo,
        ma.nome AS equipamento_marca,
        eq.nome AS empresa_nome,
        sol.username AS solicitante_nome,
        sol.email AS solicitante_email,
        sol.foto_url AS solicitante_foto,
        atr.username AS atribuido_nome,
        atr.email AS atribuido_email,
        atr.foto_url AS atribuido_foto
    FROM [dbo].[tickets] t
    INNER JOIN [dbo].[tipos_ticket] tt ON t.tipo_ticket_id = tt.id
    LEFT JOIN [dbo].[equipamentos] e ON t.equipamento_id = e.id
    LEFT JOIN [dbo].[modelos_equipamento] m ON e.modelo_id = m.id
    LEFT JOIN [dbo].[marcas] ma ON m.marca_id = ma.id
    LEFT JOIN [dbo].[empresas] eq ON t.empresa_id = eq.id
    INNER JOIN [dbo].[utilizadores] sol ON t.solicitante_id = sol.id
    LEFT JOIN [dbo].[utilizadores] atr ON t.atribuido_id = atr.id
    WHERE t.id = @TicketId;
    
    -- Histórico
    SELECT 
        h.*,
        u.username AS utilizador_nome,
        u.foto_url AS utilizador_foto
    FROM [dbo].[tickets_historico] h
    INNER JOIN [dbo].[utilizadores] u ON h.utilizador_id = u.id
    WHERE h.ticket_id = @TicketId
    ORDER BY h.criado_em DESC;
    
    -- Intervenções relacionadas
    SELECT 
        i.*,
        tec.username AS tecnico_nome
    FROM [dbo].[intervencoes] i
    INNER JOIN [dbo].[utilizadores] tec ON i.tecnico_id = tec.id
    WHERE i.ticket_id = @TicketId
    ORDER BY i.data_inicio DESC;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_VerificarAcessoEmpresa]    Script Date: 23/10/2025 18:15:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedure: Verificar se Utilizador tem Acesso à Empresa
CREATE   PROCEDURE [dbo].[sp_VerificarAcessoEmpresa]
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
USE [master]
GO
ALTER DATABASE [ceo_tenant_larevangelico] SET  READ_WRITE 
GO
